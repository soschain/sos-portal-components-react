// Flow contract: render every canonical IPS section and FHIR resource type through independent clinical projections, preserving manual text, translation and native composite values.
/**
 * Flow contract:
 * 1. The host gives the component one already-loaded IPS document Bundle.
 * 2. Neutral FHIR utilities resolve every Composition section and referenced resource.
 * 3. The component renders one section container and its UI-ready cards.
 * 4. No browser ingestion or GW operation occurs in this rendering flow.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import {
  FHIR_IPS_CLINICAL_ARTIFACT_SCHEMAS,
  FhirIpsClinicalArtifactTypes,
  buildVitalSignObservation,
  projectVitalSignObservationR4,
  FHIR_IPS_ALL_SECTIONS_DEMO_DATA,
  CLINICAL_TERMINOLOGY_TEST_DATA,
} from 'fhir-data-utils-ts'
import { ResourceTypesFhirR4 } from 'fhir-data-utils-ts'
import type { ClinicalResourceLike, ClinicalSectionView } from 'fhir-data-utils-ts/clinical-resource-view'
import { IpsBundleSummary } from '../../src/clinical/IpsBundleSummary.js'

function concept(resourceType: string) {
  return {
    text: `Texto local ${resourceType}`,
    coding: [{
      system: 'http://snomed.info/sct',
      code: '123456',
      display: `International ${resourceType}`,
    }],
  }
}

function resourceFor(resourceType: string): ClinicalResourceLike {
  const common = { resourceType, id: `component-${resourceType}`, language: 'es' }
  const coded = concept(resourceType)
  switch (resourceType) {
    case ResourceTypesFhirR4.MedicationStatement:
    case ResourceTypesFhirR4.MedicationRequest:
      return { ...common, medicationCodeableConcept: coded }
    case ResourceTypesFhirR4.Medication:
      return { ...common, code: coded }
    case ResourceTypesFhirR4.Immunization:
      return { ...common, vaccineCode: coded }
    case ResourceTypesFhirR4.Specimen:
    case ResourceTypesFhirR4.Device:
    case ResourceTypesFhirR4.DocumentReference:
      return { ...common, type: coded }
    case ResourceTypesFhirR4.ImagingStudy:
      return { ...common, procedureCode: [coded] }
    case ResourceTypesFhirR4.DeviceUseStatement:
      return { ...common, device: { display: `International ${resourceType}` } }
    case ResourceTypesFhirR4.ClinicalImpression:
      return { ...common, summary: `Texto local ${resourceType}` }
    case ResourceTypesFhirR4.ImmunizationRecommendation:
      return { ...common, recommendation: [{ vaccineCode: [coded] }] }
    case ResourceTypesFhirR4.Consent:
    case ResourceTypesFhirR4.CarePlan:
      return { ...common, category: [coded] }
    case ResourceTypesFhirR4.Organization:
      return { ...common, name: `International ${resourceType}` }
    case ResourceTypesFhirR4.Practitioner:
      return { ...common, name: [{ given: ['Ada'], family: 'Lovelace' }] }
    case ResourceTypesFhirR4.PractitionerRole:
      return { ...common, code: [coded] }
    default:
      return { ...common, code: coded }
  }
}

describe('IpsBundleSummary', () => {
  const vaccine = CLINICAL_TERMINOLOGY_TEST_DATA.humanInactivatedInfluenzaVaccine
  function minimizedVaccinations() {
    return {
      resourceType: 'Bundle', type: 'collection', entry: [
        { resource: { resourceType: ResourceTypesFhirR4.Patient, id: 'collection-patient', name: [{ text: 'Subject envelope' }] } },
        { resource: { resourceType: ResourceTypesFhirR4.Organization, id: 'collection-organization', name: 'Issuer envelope' } },
        ...[1, 2, 3].map(index => ({
          fullUrl: `Immunization/collection-${index}`,
          resource: { resourceType: ResourceTypesFhirR4.Immunization, id: `collection-${index}`, status: 'completed', vaccineCode: { coding: [{ system: vaccine.system, code: vaccine.code }] } },
        })),
      ],
    }
  }

  it('renders three minimized collection vaccinations without inventing Composition membership or section actions', () => {
    const bundle = minimizedVaccinations(), original = structuredClone(bundle)
    const sectionActions = vi.fn(() => <button>Section mutation</button>)
    const resourceActions = vi.fn((_section: ClinicalSectionView, resource: ClinicalSectionView['resources'][number]) => <button>Inspect {resource.fullUrl}</button>)
    const html = renderToStaticMarkup(<IpsBundleSummary bundle={bundle} emptyLabel="No records" sectionActions={sectionActions} resourceActions={resourceActions} />)
    expect(html.match(/data-resource-type="Immunization"/g)).toHaveLength(3)
    expect(html.split(`${vaccine.system}|${vaccine.code}`)).toHaveLength(4)
    expect(html).not.toContain('data-resource-type="Patient"')
    expect(html).not.toContain('data-resource-type="Organization"')
    expect(sectionActions).not.toHaveBeenCalled()
    expect(resourceActions.mock.calls.map(([section, resource]) => ({ code: section.code, reference: resource.fullUrl }))).toEqual([1, 2, 3].map(index => ({ code: undefined, reference: `Immunization/collection-${index}` })))
    expect(html.match(/>Inspect Immunization\/collection-/g)).toHaveLength(3)
    expect(bundle).toEqual(original)
  })

  it('passes collection codes and locale to the existing terminology translator', () => {
    const translateCode = vi.fn(() => 'Vacuna traducida')
    const html = renderToStaticMarkup(<IpsBundleSummary bundle={minimizedVaccinations()} locale="es" translateCode={translateCode} emptyLabel="Sin registros" />)
    expect(html.split('Vacuna traducida')).toHaveLength(4)
    expect(translateCode).toHaveBeenCalledWith(expect.objectContaining({ resourceType: ResourceTypesFhirR4.Immunization, system: vaccine.system, code: vaccine.code, locale: 'es' }))
  })

  it('groups only the existing six supported authored clinical resource kinds in a collection', () => {
    const types = Object.values(FhirIpsClinicalArtifactTypes)
    const bundle = { resourceType: 'Bundle', type: 'collection', entry: types.map(type => ({ fullUrl: `${type}/collection`, resource: resourceFor(type) })) }
    const html = renderToStaticMarkup(<IpsBundleSummary bundle={bundle} emptyLabel="No records" resourceTypeLabel={type => `Group ${type}`} />)
    expect(html.match(/data-resource-type=/g)).toHaveLength(types.length)
    for (const type of types) expect(html).toContain(`data-resource-type="${type}"`)
  })

  it('leaves a patient-only collection empty', () => {
    const bundle = { resourceType: 'Bundle', type: 'collection', entry: [{ resource: { resourceType: ResourceTypesFhirR4.Patient } }] }
    const html = renderToStaticMarkup(<IpsBundleSummary bundle={bundle} emptyLabel="No records" noSectionsLabel="No clinical records" />)
    expect(html).toContain('No clinical records')
    expect(html).not.toContain('data-resource-type=')
  })

  it('does not infer groups for a document lacking its required Composition', () => {
    const bundle = { ...minimizedVaccinations(), type: 'document' }
    const html = renderToStaticMarkup(<IpsBundleSummary bundle={bundle} emptyLabel="No records" noSectionsLabel="No Composition sections" />)
    expect(html).toContain('No Composition sections')
    expect(html).not.toContain('data-resource-type=')
  })

  it('keeps Composition references authoritative in a collection and does not append orphan vaccinations', () => {
    const collection = minimizedVaccinations()
    const bundle = { ...collection, entry: [{ resource: { resourceType: ResourceTypesFhirR4.Composition, section: [{ title: 'Declared vaccination', entry: [{ reference: 'Immunization/collection-2' }] }] } }, ...collection.entry] }
    const original = structuredClone(bundle), sectionActions = vi.fn(() => <button>Add declared record</button>)
    const html = renderToStaticMarkup(<IpsBundleSummary bundle={bundle} emptyLabel="No records" sectionActions={sectionActions} />)
    expect(html.match(/data-resource-type="Immunization"/g)).toHaveLength(1)
    expect(html).toContain('Declared vaccination')
    expect(sectionActions).toHaveBeenCalledTimes(1)
    expect(bundle).toEqual(original)
  })

  it('does not fall back around an empty Composition in a collection', () => {
    const collection = minimizedVaccinations()
    const bundle = { ...collection, entry: [{ resource: { resourceType: ResourceTypesFhirR4.Composition, section: [] } }, ...collection.entry] }
    const html = renderToStaticMarkup(<IpsBundleSummary bundle={bundle} emptyLabel="No records" />)
    expect(html).toContain('No records')
    expect(html).not.toContain('data-resource-type=')
  })

  it('supports collection data entries without manufacturing absent resource references', () => {
    const bundle = { resourceType: 'Bundle', type: 'collection', data: [{ resource: { resourceType: ResourceTypesFhirR4.Immunization, vaccineCode: { coding: [{ system: vaccine.system, code: vaccine.code }] } } }] }
    const resourceActions = vi.fn((_section: ClinicalSectionView, _resource: ClinicalSectionView['resources'][number]) => null), original = structuredClone(bundle)
    const html = renderToStaticMarkup(<IpsBundleSummary bundle={bundle} emptyLabel="No records" resourceActions={resourceActions} />)
    expect(html).toContain('data-resource-type="Immunization"')
    expect(resourceActions).toHaveBeenCalledTimes(1)
    expect(resourceActions.mock.calls[0]?.[0].code).toBeUndefined()
    expect(resourceActions.mock.calls[0]?.[1].fullUrl).toBeUndefined()
    expect(bundle).toEqual(original)
  })

  it('can hide empty IPS sections while preserving sections that contain records', () => {
    const bundle = {
      resourceType: 'Bundle', type: 'document', entry: [{ resource: {
        resourceType: 'Composition', section: [
          { title: 'Empty problems', entry: [] },
          { title: 'Immunizations', entry: [{ reference: 'Immunization/component-Immunization' }] },
        ],
      } }, { fullUrl: 'Immunization/component-Immunization', resource: resourceFor('Immunization') }],
    }
    const html = renderToStaticMarkup(<IpsBundleSummary bundle={bundle} locale="es" emptyLabel="Sin registros" hideEmptySections />)

    expect(html).not.toContain('Empty problems')
    expect(html).toContain('Immunizations')
    expect(html).toContain('Texto local Immunization')
  })

  it('maps section and resource actions to their distinct visual owners', () => {
    const bundle = {
      resourceType: 'Bundle',
      type: 'document',
      entry: [{
        resource: {
          resourceType: ResourceTypesFhirR4.Composition,
          section: [{
            title: 'Problems',
            entry: [{ reference: 'Condition/component-Condition' }],
          }],
        },
      }, {
        fullUrl: 'Condition/component-Condition',
        resource: resourceFor(ResourceTypesFhirR4.Condition),
      }],
    }

    const html = renderToStaticMarkup(<IpsBundleSummary
      bundle={bundle}
      emptyLabel="No records"
      sectionActions={() => <button type="button">Add</button>}
      resourceActions={(_section, resource) => <button type="button">Edit {resource.title}</button>}
    />)

    expect(html).toMatch(/<header>[\s\S]*?>Add<\/button>[\s\S]*?<\/header>/)
    expect(html).toMatch(/<article[^>]*>[\s\S]*?>Edit Texto local Condition<\/button>[\s\S]*?<\/article>/)
  })

  it('renders all 16 sections from the canonical synthetic FHIR IPS fixture', () => {
    const bundle = FHIR_IPS_ALL_SECTIONS_DEMO_DATA.bundle
    const html = renderToStaticMarkup(
      <IpsBundleSummary bundle={bundle} locale="en" emptyLabel="No records" />,
    )

    expect(html.match(/data-ips-section=/g)).toHaveLength(16)
    const cardTitles = [...html.matchAll(/class="uhcp-clinical-title"[^>]*><bdi>(.*?)<\/bdi>/g)]
      .map((match) => match[1]!)
    expect(cardTitles.length).toBeGreaterThan(0)
    expect(cardTitles.every((title) => !/^https?:\/\/[^|]+\|/.test(title))).toBe(true)
  })

  it('renders every canonical FHIR resource type through the generic section renderer', () => {
    const resourceTypes = Object.values(ResourceTypesFhirR4)
    const entries = resourceTypes.map((resourceType) => ({
      fullUrl: `${resourceType}/component-${resourceType}`,
      resource: resourceFor(resourceType),
    }))
    const bundle = {
      resourceType: 'Bundle',
      type: 'document',
      entry: [{
        resource: {
          resourceType: ResourceTypesFhirR4.Composition,
          section: [{
            title: 'All declared resource types',
            code: { coding: [{ system: 'http://loinc.org', code: '60591-5' }] },
            entry: entries.map((entry) => ({ reference: entry.fullUrl })),
          }],
        },
      }, ...entries],
    }

    const html = renderToStaticMarkup(
      <IpsBundleSummary bundle={bundle} locale="es" emptyLabel="Sin registros" />,
    )

    expect(html.match(/data-resource-type=/g)).toHaveLength(resourceTypes.length)
    for (const resourceType of resourceTypes) {
      expect(html).toContain(`data-resource-type="${resourceType}"`)
    }
  })

  it('propagates locale and terminology translation to section cards', () => {
    const bundle = {
      resourceType: 'Bundle',
      type: 'document',
      entry: [{
        resource: {
          resourceType: ResourceTypesFhirR4.Composition,
          section: [{
            title: 'Problems',
            entry: [{ reference: 'Condition/component-Condition' }],
          }],
        },
      }, {
        fullUrl: 'Condition/component-Condition',
        resource: resourceFor(ResourceTypesFhirR4.Condition),
      }],
    }

    const html = renderToStaticMarkup(
      <IpsBundleSummary
        bundle={bundle}
        locale="fr"
        translateCode={({ token }) => token === 'http://snomed.info/sct|123456'
          ? 'Condition traduite'
          : undefined}
        emptyLabel="Aucun dossier"
      />,
    )

    expect(html).toContain('Condition traduite')
    expect(html).not.toContain('>http://snomed.info/sct|123456<')
  })

  it('renders every component value of a composite Observation', () => {
    const systolic = 120
    const diastolic = 80
    const graph = buildVitalSignObservation({
      entryId: 'blood-pressure-id',
      subjectReference: 'Patient/demo',
      kind: 'blood-pressure',
      measuredAt: '2026-10-03T09:30:00Z',
      status: 'final',
      systolic,
      diastolic,
    })
    const observation = projectVitalSignObservationR4(graph)
    const bundle = {
      resourceType: 'Bundle',
      type: 'document',
      entry: [{
        resource: {
          resourceType: ResourceTypesFhirR4.Composition,
          section: [{
            title: 'Vital signs',
            code: { coding: [{ system: 'http://loinc.org', code: FHIR_IPS_CLINICAL_ARTIFACT_SCHEMAS[FhirIpsClinicalArtifactTypes.Observation].sectionCode }] },
            entry: [{ reference: graph.primary.reference }],
          }],
        },
      }, { fullUrl: graph.primary.reference, resource: observation }],
    }

    const html = renderToStaticMarkup(<IpsBundleSummary
      bundle={bundle}
      locale="en-CA"
      timeZone="America/Vancouver"
      emptyLabel="No records"
      timeline={{
        labels: { from: 'From', to: 'To', date: 'Date', time: 'Time', useToday: 'Today', useCurrentTime: 'Now', previous: 'Previous', next: 'Next', showAll: 'Show all', empty: 'No dated results' },
        sectionFacetLabel: 'Section',
        resourceTypeFacetLabel: 'Resource type',
      }}
    />)

    for (const component of observation.component ?? []) {
      expect(html).toContain(component.code.coding[0]!.display)
      expect(html).toContain(`>${component.valueQuantity.value} ${component.valueQuantity.unit}<`)
    }
    expect(html).toContain('Oct 3, 2026, 02:30')
    expect(html).not.toContain('2026-10-03T09:30:00Z')
    expect(html).toContain('1 / 1')
    expect(html).toContain('<legend>Section</legend>')
  })
})

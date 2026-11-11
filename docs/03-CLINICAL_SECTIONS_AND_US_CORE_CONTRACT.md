# US Core and all-sections clinical viewer contract

## Recovered ownership and implementation status

This preserves the contract previously documented in SOSChain Personal Next,
`docs/US_CORE_ALL_SECTIONS_TEST_CONTRACT.md`. The existing shared organizer is
`AllClinicalSections` in `uhc-portal-components-react`; its host supplies
subject-specific, authorized content. Reuse that organizer and its mappings
across Personal and Professional rather than rebuilding product-specific trees.

The historical demo includes placeholder content for several non-IPS areas.
The complete STU6 example inventory and semantic CRUD lifecycle below remain
acceptance requirements, not a statement that all profiles already work.

## Current component ownership

Check the canonical source export before introducing any new consumer import.
Historical paths below are discovery references, not migration targets.

| Surface | Active owner | Compatibility/deprecation boundary |
| --- | --- | --- |
| Encounter journey and transfer | `sos-portal-components-react/encounter-journey` and `/encounter-transfer-console` | UHC transfer console delegates to SOS and is deprecated for new imports |
| Subject conversation | `sos-portal-components-react/subject-conversation-chat` | UHC subject chat is a deprecated re-export; `SubjectCommunicationCenter` is also deprecated |
| All-section organizer and Encounter-linked clinical documents | `uhc-portal-components-react`: `AllClinicalSections`, `ClinicalDocumentEncounterExplorer` | Current UHC sources retain the implementations; these exports are not currently marked deprecated |
| Shared Consent directory | `uhc-portal-components-react`: `ConsentPermissionDirectory` | Current shared canonical directory remains in UHC; the CH host editor additionally composes its recipient/role policy and BFF adapters |
| Clinical authoring | `uhc-portal-components-react`: `ClinicalBundleDraftEditorV2` | Earlier standalone/version-selecting clinical editors are deprecated |
| Controller workforce administration | `antifraud-hosting-components-react` | UHC workforce administration is deprecated |

Do not restore deprecated implementations from old portals. Do not infer that
an entire package is deprecated because some of its compatibility exports are.
The remaining base-UI extraction is explicitly pending in the SOS README.

## Reuse and test ownership

| Shared surface | Consumers and configuration | Provider boundary | Owned proof |
| --- | --- | --- | --- |
| SOS `EncounterJourneyPanel` | CH Personal `PersonalEncounterJourney`; CH Professional `ProfessionalEncounterJourney`; person/animal services supplied by the host | Personal read-only and Professional mutation BFFs → SOS Node care vault through the authenticated peer | SOS `encounter-journey-panel`/`encounter-transfer-controlled` interaction suites; each CH adapter suite; CH `portal-encounter-journey.spec.ts` real crossed browser journey |
| SOS `EncounterTransferConsole` | Internal dependency of the journey panel; UHC wrapper retained for historical import compatibility | Controlled host callback, no persistence inside the component | SOS transfer suite and UHC workspace composition suite |
| Existing CH `ConsentPermissionsPanel` | One Personal application source across all configured flavours; richer country/sector/recipient/role policy and contacts than the generic directory | Injected Demo permission/contact stores; Network uses the governed BFF separately | Personal editor, permission-store, contact, current-Consent and family-read contracts; crossed browser request/approve/revoke steps |
| UHC clinical organizer/document explorer | Retained clinical composition contracts; historical SOS usage identifies the intended mapping | Host-authorized content only | Existing shared tests; the complete official US Core CRUD matrix below remains pending |

The Professional request panel is a restricted request/effective-access adapter,
not another controller Consent editor. It cannot approve grants. The historical
UHC transfer wrapper contains no second transfer-state implementation.
A test-file reference identifies the proof owner; attach actual run evidence
before marking any browser, flavour or environment verified.

## Permissions and navigation

Encounters and Appointments are independent logical permission sections.
They must remain selectable even when a flavour hides them from card navigation.
The IPS document and its clinical sections are separate permission targets;
USCDI data classes are not interchangeable with navigation IDs or FHIR resources.
Use the existing governed section and resource-type catalogs, preserving profile
and clinical context where a resource type spans more than one area. Do not
invent new section identifiers from UI labels.

A card controller manages grants. Caregiver/family membership and being an
emergency contact do not independently grant clinical access. Evaluate explicit
Consent for the subject, verified recipient/role, purpose, period and target on
every protected read or mutation. General Encounter access is the current
scope; emergency-only Encounter filtering requires a separate defined contract.

Demo Consent records use a separate subject/generation-scoped collection through
the same injected transactional vault repository as other Demo state. The
Professional may request a draft; only an authorized controller can approve it.
A request must never appear as an active grant. Network authorization and
persistence require their own adapter and end-to-end evidence.

## Purpose

SOSChain must not present IPS as the complete clinical record. IPS is one
Composition-driven document profile. The personal and professional portals may
also organize authorized USCDI/US Core information and Encounter-linked
documents with the shared `AllClinicalSections<Person|Animal>` and
`ClinicalDocumentEncounterExplorer` components.

Each portal decides whether sections appear as tabs or collapsible panels and
may exclude inapplicable sections. Authorization, retrieval and persistence
remain server-owned.

## Person organizer mappings

The person preset can include these areas outside IPS:

- Health status assessments, with nested functional, disability,
  mental/cognitive and other assessment groups.
- Health insurance information (`Coverage` and payer `Organization`).
- Family health history (`FamilyMemberHistory`). It must not automatically
  follow or reveal a relative's card, IPS or other documents. It can include a
  deceased relative as modeled by the resource.
- Clinical notes (`DocumentReference` and supported report/note documents).
- Care-team members (`CareTeam` with its authorized participants).
- Emergency contacts as a distinct SOSChain product grouping backed by the
  subject's authorized `RelatedPerson` relationships. It is not a synonym for
  the care team.
- Encounters and clinical documents. A FHIR document Bundle is
  Composition-first; `Composition.encounter` supplies care context. The
  Encounter is not substituted for the clinical subject.

The organizer must not duplicate these USCDI labels outside IPS:

- Goals and preferences remains the single IPS Goals and Preferences section;
  advance directives are a nested category within it.
- Clinical tests maps to the IPS Diagnostic Results section, with collapsible
  laboratory/pathology, radiology and other result categories.

Portals may relabel those IPS sections for a local audience, but the shared
component, filters and persistence contract retain one canonical section.

Animal portals reuse the organizer with an animal-specific section set. They
must not inherit person-only US Core constraints merely because the React
component is shared.

## Versioned Condition boundary

Starting with US Core 5.0.0, the former US Core Condition profile is split:

- US Core Condition Encounter Diagnosis: an Encounter diagnosis, normally with
  `Condition.encounter` and category `encounter-diagnosis`.
- US Core Condition Problems and Health Concerns: problems, health concerns and
  applicable social-determinant concerns.

The UI, fixtures and tests must preserve that distinction even though both are
FHIR `Condition` resources. A resource type alone is not a sufficient profile
or section discriminator.

References:

- [USCDI to US Core mapping](https://build.fhir.org/ig/HL7/US-Core/uscdi.html)
- [US Core STU6 Encounter Diagnosis](https://hl7.org/fhir/us/core/STU6/StructureDefinition-us-core-condition-encounter-diagnosis.html)
- [US Core STU6 artifacts and examples](https://hl7.org/fhir/us/core/STU6/artifacts.html#example-example-instances)

## Versioned USCDI inventory that must not be lost

The executable baseline is pinned to **US Core 6.0.0 / STU6 on FHIR R4**
because that is the example set selected for the SOSChain regression corpus.
The continuously built US Core mapping is a monitored source for later
profiles, not an unreviewed replacement for the pinned baseline. Any upgrade
must record the old and new canonical profile URLs and migration expectations.

The fixture inventory must retain every official STU6 example instance, not
only IPS resources. An inventory test must compare the checked-in manifest
with the version-pinned HL7 inventory captured during an explicit update. A
new, renamed or removed upstream example therefore produces a deliberate
review failure instead of silently disappearing.

| USCDI or SOSChain view | Profile families/examples to retain | Placement |
| --- | --- | --- |
| Clinical notes | `DocumentReference`; DiagnosticReport note/report examples including cardiology, chest X-ray and bone-density reports | Outside IPS as Clinical Notes; link to Encounter when supplied |
| Clinical tests and diagnostic imaging | Clinical-result Observation, laboratory Observation, DiagnosticReport and Specimen examples | One IPS Diagnostic Results area with laboratory/pathology, radiology and other-result subsections; never a duplicated top-level copy |
| Encounters | Encounter plus Encounter Diagnosis Condition examples | Encounter explorer and document context outside IPS |
| Goals and preferences | Goal, ADI Observation, ADI DocumentReference, treatment-intervention preference and care-experience preference examples | One IPS Goals and Preferences area; advance directives are nested, not duplicated outside IPS |
| Health insurance information | Coverage and payer Organization examples | Collapsible area outside IPS |
| Health status assessments | Simple Observation, Problems and Health Concerns Condition, Screening Assessment Observation and QuestionnaireResponse examples | Collapsible area outside IPS with functional, disability, mental/cognitive, pregnancy, alcohol, substance use, physical activity, SDOH and smoking subsections |
| Family health history | FamilyMemberHistory examples, including deceased relatives where present | Outside IPS; never follow or reveal a relative's live card automatically |
| Care team and emergency relationships | CareTeam examples; SOSChain RelatedPerson emergency-contact fixtures | Separate Care Team and Emergency Contacts areas |
| Devices and procedures | Implantable-device and procedure examples | Appropriate clinical section; preserve Encounter context |
| Core IPS clinical data | AllergyIntolerance, medication, Immunization, both Condition profiles, Procedure and all Observation variants | Existing IPS section/subsection mapping |

In the authoring claims, `code-text` is the reusable alias for a resource's
primary clinical concept. Immunization intentionally uses
`vaccine-code-text`/`vaccine-code`; its `target-disease` coding is independent
and must never be populated from the vaccine product candidate.

The phrase “all official examples” means the complete instance list below the
STU6 **Example: Example Instances** heading. The table above is an information-
architecture grouping and must never be treated as permission to sample only
one example per row.

## Executable example lifecycle

Official example instances needed by SOSChain must be copied into versioned,
repository-safe `*.data.ts` fixtures in the owning shared data package. Tests
must never depend on the live HL7 website. Each fixture records its canonical
source URL, US Core release and profile URL.

For every supported example/profile, automated tests must prove this complete
lifecycle:

1. Import the individual resource or a document/collection Bundle without
   changing its profile identity or clinical provenance.
2. Place and display it in the correct section or Encounter-linked document.
3. Open the correct profile-aware editor and preserve required elements.
4. Save through the high-level provider boundary and read a fresh result.
5. Compare a semantic snapshot of the displayed and persisted clinical data.
6. Delete it and verify that a fresh read no longer returns or references it.
7. Recreate it from the same fixture and verify semantic equivalence.

Semantic equivalence excludes provider-assigned IDs, versions, audit metadata
and expected date changes. It includes profile identity, subject, Encounter
context, terminology systems/codes/displays, quantities/units, components,
references and section placement.

The fixture matrix must cover at least `Condition` in both profiles,
`Observation` variants, `DiagnosticReport`, `DocumentReference`, `Coverage`,
`Goal`, `FamilyMemberHistory`, `CareTeam`, `RelatedPerson`, `Encounter` and the
supported advance-directive profiles. A green rendering-only test is not CRUD
proof.

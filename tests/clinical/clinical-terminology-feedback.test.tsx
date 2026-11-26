// Flow contract: the shared selector distinguishes a recognized coverage rejection, a service failure and an empty successful search.
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ImmunizationClaim, ResourceTypesFhirR4 } from 'fhir-data-utils-ts'
import { afterEach, expect, it, vi } from 'vitest'
import { CodedConceptPropertyV2 } from '../../src/clinical/ClinicalArtifactPropertiesV2.js'

afterEach(cleanup)

it('renders localized coverage feedback and keeps empty results distinct from failures', async () => {
  const unsupported = new Error('unsupported_species')
  const search = vi.fn()
    .mockRejectedValueOnce(unsupported)
    .mockRejectedValueOnce(new Error('upstream details'))
    .mockResolvedValueOnce([])
  render(<CodedConceptPropertyV2
    resourceType={ResourceTypesFhirR4.Immunization}
    codeClaim={ImmunizationClaim.VaccineCode}
    label="Vacuna"
    locale="es"
    text="rab"
    code=""
    display=""
    copy={{
      searchTerminology: 'Buscar', terminologyLoading: 'Buscando…',
      terminologyUnavailable: 'La búsqueda no está disponible.',
      terminologyEmpty: 'No se encontraron códigos.',
      terminologyFailureMessage: (reason: unknown) => reason === unsupported ? 'Búsqueda sin cobertura para esta especie.' : undefined,
      terminologySources: 'Sistemas', selectCandidate: 'Seleccionar', clearCoding: 'Borrar',
      canonicalCode: 'Código', canonicalDisplay: 'Descripción',
    }}
    searchTerminology={search}
    onChange={vi.fn()}
  />)

  const button = screen.getByRole('button', { name: 'Buscar' })
  fireEvent.click(button)
  expect((await screen.findByRole('alert')).textContent).toBe('Búsqueda sin cobertura para esta especie.')
  fireEvent.click(button)
  expect((await screen.findByRole('alert')).textContent).toBe('La búsqueda no está disponible.')
  fireEvent.click(button)
  expect(await screen.findByText('No se encontraron códigos.')).toBeTruthy()
  expect(screen.queryByRole('alert')).toBeNull()
})

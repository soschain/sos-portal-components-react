// Copyright 2026 Connecting Solution & Applications Ltd under the Apache License, Version 2.0.
// Flow contract: reuse canonical test data and coding systems from their owning FHIR, SOS and sector data contracts.
// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import { ResourceTypesFhirR4 } from 'fhir-data-utils-ts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ClinicalArtifactEditorV2 } from '../../src/clinical/ClinicalArtifactEditorV2.js'

describe('ClinicalArtifactEditorV2 action hierarchy', () => {
  afterEach(cleanup)

  it('places the green constructive action before the non-green cancel action', () => {
    render(<ClinicalArtifactEditorV2
      request={{ resourceType: ResourceTypesFhirR4.Immunization, sectionCode: '11369-6', mode: 'create' }}
      authoringContext={{ subjectReference: 'Patient/example', language: 'en', createdAt: '2026-10-07T00:00:00Z', dataAuthorReference: 'PractitionerRole/example', attestationState: 'draft' }}
      copy={{ title:'Add',description:'Add',save:'Add to draft',saving:'Adding',cancel:'Cancel',close:'Close',terminologyLoading:'Searching',terminologyUnavailable:'Unavailable',terminologySources:'Systems',readbackMissing:'Missing',addField:'Add field',chooseField:'Choose field',addSelectedField:'Add',removeField:'Remove',searchTerminology:'Search',clearCoding:'Clear',selectCandidate:'Select',canonicalCode:'Code',canonicalDisplay:'Display',codingRequired:'Required',documents:'Documents',addDocuments:'Add documents',removeDocument:'Remove',date:'Date',time:'Time',useToday:'Today',useCurrentTime:'Now' }}
      fields={[]}
      initialVisibleClaims={[]}
      fieldLabel={claim => claim}
      saveArtifact={vi.fn()}
      onCancel={vi.fn()}
      onReadback={vi.fn()}
    />)
    const footer = screen.getByRole('button', { name: 'Add to draft' }).closest('footer')!
    const buttons = within(footer).getAllByRole('button')
    expect(buttons.map(button => button.textContent)).toEqual(['Add to draft', 'Cancel'])
    expect(buttons[0]!.classList.contains('uhcp-clinical-editor-submit')).toBe(true)
    expect(buttons[1]!.classList.contains('uhcp-clinical-editor-cancel')).toBe(true)
  })
})

// Flow contract: every portal mode uses controlled locator fields; number lookup asks person/animal and animal species, while DID/QR identifies itself and UI selections never grant access.
// @vitest-environment jsdom
import React from 'react'
import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {SubjectCardLocatorFields} from '../src/SubjectCardLocatorFields.js'

afterEach(cleanup)
const copy={method:'Identifier type',number:'Card number',didQr:'DID / QR content',subjectKind:'Subject type',choose:'Select…',person:'Person',animal:'Animal',species:'Species',taxonomy:'NCBI taxonomy ID',otherSpecies:'Other species',value:'Card ID or QR content'}
const speciesOptions=[{taxonomyId:'9615',label:'Dog'},{taxonomyId:'9685',label:'Cat'}]
const value={method:'card-number' as const,subjectKind:'animal' as const,taxonomyId:'',locator:''}

it('asks for species only for an animal number and delegates controlled changes',()=>{
  const onChange=vi.fn()
  const view=render(<SubjectCardLocatorFields copy={copy} value={value} speciesOptions={speciesOptions} onChange={onChange}/> )
  fireEvent.change(screen.getByLabelText(copy.species),{target:{value:'9615'}})
  expect(onChange).toHaveBeenCalledWith({...value,taxonomyId:'9615'})
  fireEvent.change(screen.getByLabelText(copy.subjectKind),{target:{value:'person'}})
  expect(onChange).toHaveBeenCalledWith({...value,subjectKind:'person',taxonomyId:''})
  view.rerender(<SubjectCardLocatorFields copy={copy} value={{...value,subjectKind:'person'}} speciesOptions={speciesOptions} onChange={onChange}/> )
  expect(screen.queryByLabelText(copy.species)).toBeNull()
  view.rerender(<SubjectCardLocatorFields copy={copy} value={{...value,method:'did-qr'}} speciesOptions={speciesOptions} onChange={onChange}/> )
  expect(screen.queryByLabelText(copy.subjectKind)).toBeNull()
  expect(screen.queryByLabelText(copy.species)).toBeNull()
  expect(screen.getByLabelText(copy.value)).toBeTruthy()
})

it('supports other taxonomy IDs without restricting animal lookup to the preset species',()=>{
  const onChange=vi.fn()
  render(<SubjectCardLocatorFields copy={copy} value={{...value,taxonomyId:'10090'}} speciesOptions={speciesOptions} onChange={onChange}/> )
  expect((screen.getByLabelText(copy.species) as HTMLSelectElement).value).toBe('other')
  fireEvent.change(screen.getByLabelText(copy.taxonomy),{target:{value:'10116'}})
  expect(onChange).toHaveBeenCalledWith({...value,taxonomyId:'10116'})
})

it('disables every editable field while resolution is in progress',()=>{
  render(<SubjectCardLocatorFields copy={copy} value={value} speciesOptions={speciesOptions} onChange={vi.fn()} disabled/> )
  for(const control of screen.getAllByRole('combobox'))expect((control as HTMLSelectElement).disabled).toBe(true)
  expect((screen.getByLabelText(copy.value) as HTMLInputElement).disabled).toBe(true)
})

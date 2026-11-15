// Flow contract: SOS owns host-controlled animal/subject identity composition, preserving distinct controller data, required photo readiness and pending capability-aware readback without a UHC runtime dependency.
// @vitest-environment jsdom
import React from 'react'
import {cleanup,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
afterEach(cleanup)
const load=(path:string)=>import(/* @vite-ignore */ path)
const copy={title:'Create animal',intro:'Host-controlled identity',animalStep:'Animal identity',controllerStep:'Controller identity',evidenceStep:'Identity evidence',animalName:'Animal name',taxonomyId:'Species',birthDate:'Birth date',sex:'Sex',sexUnknown:'Unknown',sexFemale:'Female',sexMale:'Male',sexOther:'Other',identifierSystem:'Identifier type',identifierValue:'Identifier',controllerLegalName:'Controller legal name',controllerIdentifierType:'Controller document type',controllerIdentifierValue:'Controller document number',controllerCountry:'Country',relationship:'Relationship',owner:'Owner',caregiver:'Caregiver',ownerDocument:'Controller document',animalDocument:'Animal document',relationshipDocument:'Relationship document',submit:'Create animal',controllerIsLegalRepresentative:'Controller confirmation',animalPreview:'{name} preview',addAnimalPhoto:'Add animal photo',removeAnimalPhoto:'Remove animal photo',photoHelp:'Host photo requirements',photoTooLarge:'Photo too large',photoDimensionsInvalid:'Photo dimensions invalid',ownerKind:'Entity type',responsibleParty:'Responsible party',personOwner:'Person',organizationOwner:'Organization',regionalIdentifier:'Regional identifier',controllerRegion:'Region',controllerEmail:'Email',controllerTelephone:'Telephone',contactRequired:'Choose a contact',verificationMethod:'Review method',physicalInPerson:'Physical inspection',supervisedRemote:'Supervised remote',electronicId:'Electronic identity',unsupervisedRemote:'Unsupervised remote'}

it('renders the owned original animal form without treating it as a human registration',async()=>{
 const {AnimalIdentityOnboarding}=await load('../src/identity/AnimalIdentityOnboarding.js')
 const onSubmit=vi.fn();render(<AnimalIdentityOnboarding copy={copy} onSubmit={onSubmit}/>)
 expect(screen.getByLabelText('Animal name')).toBeTruthy()
 expect(screen.getByLabelText('Controller legal name')).toBeTruthy()
 expect(screen.queryByLabelText('Subject usual name')).toBeNull()
 expect(onSubmit).not.toHaveBeenCalled()
})

it('preserves progressive animal/controller sections and keeps creation unavailable before a valid photo/contact',async()=>{
 const {AnimalIdentityOnboardingV2}=await load('../src/identity/AnimalIdentityOnboardingV2.js')
 const onSubmit=vi.fn(),view=render(<AnimalIdentityOnboardingV2 copy={copy} onSubmit={onSubmit}/>)
 expect(view.container.querySelectorAll('details')).toHaveLength(2)
 expect(screen.getByLabelText('Animal name')).toBeTruthy()
 expect(screen.getByLabelText('Controller legal name')).toBeTruthy()
 expect((screen.getByRole('button',{name:'Create animal'}) as HTMLButtonElement).disabled).toBe(true)
 expect(onSubmit).not.toHaveBeenCalled()
})

it('renders independent subject and controller details as readback rather than editable identity authority',async()=>{
 const {AnimalIdentityDetailsV2}=await load('../src/identity/AnimalIdentityDetailsV2.js')
 const view=render(<AnimalIdentityDetailsV2 copy={{animalStep:'Animal identity',controllerStep:'Controller identity',animalName:'Name',species:'Species',identifierType:'Type',identifierValue:'Identifier',controllerName:'Controller',relationship:'Relationship'}} value={{animalName:'Synthetic animal',species:'Host supplied species',identifierType:'Host supplied type',identifierValue:'Synthetic subject reference',controllerName:'Synthetic responsible adult',relationship:'Host supplied responsibility'}}/>)
 expect(screen.getByText('Synthetic animal')).toBeTruthy()
 expect(screen.getByText('Synthetic responsible adult')).toBeTruthy()
 expect(view.container.querySelector('input')).toBeNull()
})

it('keeps a dependent subject distinct from its pending controller and hides editing without host capability',async()=>{
 const {SubjectIdentityCard}=await load('../src/identity/AnimalIdentityOnboarding.js')
 render(<SubjectIdentityCard subject={{displayName:'Synthetic dependent',kind:'person',facts:[]}} relationship={{label:'Controller',displayName:'Synthetic responsible adult',status:'pending'}} statusLabels={{verified:'Verified',pending:'Pending',rejected:'Rejected'}} canEdit={false} editLabel="Edit identity" onEdit={vi.fn()}/>)
 expect(screen.getByText('Synthetic dependent')).toBeTruthy()
 expect(screen.getByText('Synthetic responsible adult')).toBeTruthy()
 expect(screen.getByText('Pending')).toBeTruthy()
 expect(screen.queryByText('Verified')).toBeNull()
 expect(screen.queryByRole('button',{name:'Edit identity'})).toBeNull()
})

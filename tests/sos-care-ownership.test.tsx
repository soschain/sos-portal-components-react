// @vitest-environment jsdom
// These component contracts preserve host-controlled state in every access mode.
import React from 'react'
import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'

afterEach(cleanup)
const loadOwnedLeaf=(path:string)=>import(/* @vite-ignore */ path)

it('renders the actual acknowledged emergency status and keeps unavailable actions non-navigable',async()=>{
  const {EmergencyTaskHub}=await loadOwnedLeaf('../src/care/EmergencyTaskHub.js')
  render(<EmergencyTaskHub copy={{title:'Emergency tasks',description:'Choose an action',unavailable:'Unavailable'}} tasks={[
    {id:'acknowledged',icon:'journey',title:'Dental emergency',description:'Clinic response',actionLabel:'Open response',href:'#response',status:'Accepted by clinic'},
    {id:'unavailable',icon:'health',title:'Health summary',description:'Protected data',actionLabel:'Open health'},
  ]}/> )
  expect(screen.getByText('Accepted by clinic')).toBeTruthy()
  expect(screen.getByRole('link',{name:'Open response'}).getAttribute('href')).toBe('#response')
  expect(screen.queryByRole('link',{name:'Open health'})).toBeNull()
  expect(screen.getByText('Unavailable')).toBeTruthy()
})

it('does not expose communication content through a search-only capability',async()=>{
  const {SelectedSubjectWorkspace}=await loadOwnedLeaf('../src/care/SelectedSubjectWorkspace.js')
  render(<SelectedSubjectWorkspace subject={{id:'selected',display:'Selected person'}} capabilities={[{area:'communications',actions:['search'],recordCount:4}]} copy={{card:'Card',summary:'Summary',identity:'Identity',health:'Health',insurance:'Insurance',appointmentsTasks:'Appointments and tasks',communications:'Communications',contactsPermissions:'Contacts and permissions',records:'records'}} content={{communications:<p>Private message body</p>}}/> )
  fireEvent.click(screen.getByRole('tab',{name:'Communications, 4 records'}))
  expect(screen.queryByText('Private message body')).toBeNull()
  expect(screen.queryByRole('tab',{name:'Health'})).toBeNull()
})

it('preserves disabled-area keyboard navigation without granting authority',async()=>{
  const {SubjectWorkspace}=await loadOwnedLeaf('../src/care/SubjectWorkspace.js')
  const onAreaChange=vi.fn()
  render(<SubjectWorkspace ariaLabel="Subject sections" onAreaChange={onAreaChange} areas={[
    {id:'identity',label:'Identity',content:<p>Selected identity</p>},
    {id:'health',label:'Health',disabled:true,content:<p>Private health</p>},
    {id:'communications',label:'Communications',content:<p>Selected messages</p>},
  ]}/> )
  fireEvent.keyDown(screen.getByRole('tab',{name:'Identity'}),{key:'ArrowRight'})
  expect(onAreaChange).toHaveBeenCalledWith('communications')
  expect(screen.getByText('Selected messages')).toBeTruthy()
  expect(screen.queryByText('Private health')).toBeNull()
})

it('renders an unsigned card as unavailable and never invents a signed identity QR',async()=>{
  const {SoschainSmartIdentityCardArtifact}=await loadOwnedLeaf('../src/care/AnimalCardArtifact.js')
  render(<SoschainSmartIdentityCardArtifact subjectKind="personal" cardDid="host-supplied-card" didQr={<span>Host DID payload</span>} logoUrl="/brand.svg" signedIdentityUnavailableLabel="Identity credential pending"/> )
  expect(screen.getByText('Personal')).toBeTruthy()
  expect(screen.getByText('Identity credential pending')).toBeTruthy()
  expect(screen.queryByLabelText('Signed identity QR code')).toBeNull()
})

it('uses the host brand for a printable animal card without a veterinary brand fallback',async()=>{
  const {AnimalCardArtifact}=await loadOwnedLeaf('../src/care/AnimalCardArtifact.js')
  render(<AnimalCardArtifact brand="SOSCHAIN" title="Animal card" provider="Host provider" subject="Selected animal" species="Host species" cardNumber="Host card number" cardDid="Host card reference" qrImageUrl="/host-qr.svg"/> )
  expect(screen.getByText('SOSCHAIN')).toBeTruthy()
  expect(screen.getByText('S')).toBeTruthy()
  expect(screen.queryByText('V')).toBeNull()
})

it('filters communications while preserving host-supplied message and call categories',async()=>{
  const {SubjectCommunicationCenter}=await loadOwnedLeaf('../src/care/SubjectCommunicationCenter.js')
  render(<SubjectCommunicationCenter subjectLabel="Selected person" items={[
    {id:'message',kind:'message',category:'care',title:'Clinic message',summary:'Private message'},
    {id:'call',kind:'video-call',category:'emergency',title:'Emergency call',summary:'Pending call'},
  ]}/> )
  fireEvent.click(screen.getByRole('button',{name:'Emergency'}))
  expect(screen.queryByText('Clinic message')).toBeNull()
  expect(screen.getByText('Emergency call')).toBeTruthy()
  fireEvent.click(screen.getByRole('button',{name:'Messages'}))
  expect(screen.getByText('Clinic message')).toBeTruthy()
  expect(screen.queryByText('Emergency call')).toBeNull()
})

it('keeps a clinical section action distinct from its resource action',async()=>{
  const {ClinicalSectionSummary}=await loadOwnedLeaf('../src/clinical/ClinicalSectionSummary.js')
  render(<ClinicalSectionSummary code="host-section" title="Health summary" actions={<button>Add record</button>} resources={[{key:'record',title:'Recorded allergy',resourceType:'AllergyIntolerance',actions:<button>Edit record</button>}]}/> )
  const add=screen.getByRole('button',{name:'Add record'})
  const edit=screen.getByRole('button',{name:'Edit record'})
  expect(add.closest('header')).toBeTruthy()
  expect(add.closest('article')).toBeNull()
  expect(edit.closest('article')?.textContent).toContain('Recorded allergy')
})

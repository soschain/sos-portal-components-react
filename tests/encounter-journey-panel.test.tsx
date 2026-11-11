// Flow contract: one shared subject-bound journey renders confirmed stages for both portals; only server-granted Professional capabilities expose create/status/transfer intent, and retries preserve the operation identity.
// @vitest-environment jsdom
import React from 'react'
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import * as ui from '../src/index.js'
import {EncounterClaim as E,EncounterStatusR5 as S} from 'fhir-data-utils-ts/claims'
import {FHIR_ENCOUNTER_TRANSFER_TEST_DATA as f} from 'fhir-data-utils-ts/data'
import {buildFlatClaimResourceEntry} from 'fhir-data-utils-ts/flat-claim-resource-graph'
import type {PortalEncounterJourneyView,PortalEncounterRequest} from 'sos-data-utils-ts/portal-encounter-journey'

const service={reference:f.source.serviceReference,label:f.source.serviceReference,organizationReference:f.senderReference,classToken:`${f.class.system}|${f.class.code}`}
const record={revision:1,allowedStatuses:[S.InProgress],entry:buildFlatClaimResourceEntry({resourceType:'Encounter',entryId:f.source.id,claims:{[E.Subject]:f.subjectReference,[E.Status]:S.Planned,[E.ServiceType]:service.reference}})}
const view:PortalEncounterJourneyView={subjectIdentifier:f.subjectReference,canManage:true,services:[service],encounters:[record],history:[]}
afterEach(cleanup)

it('keeps a patient/family view read-only even when a mutation callback is supplied',()=>{
  const onCommand=vi.fn()
  render(<ui.EncounterJourneyPanel subjectLabel={f.subjectReference} view={{...view,canManage:false}} onCommand={onCommand}/>)
  expect(screen.getByRole('region',{name:'Encounter journey'})).toBeTruthy()
  expect(screen.queryByRole('button',{name:'Create encounter'})).toBeNull()
  expect(screen.queryByRole('button',{name:'Start encounter'})).toBeNull()
  expect(screen.queryByRole('button',{name:'Transfer to another service'})).toBeNull()
  expect(onCommand).not.toHaveBeenCalled()
})
it('uses the exact persisted Encounter/revision and only server-provided status options',async()=>{
  const updated={...record,revision:2,entry:{...record.entry,claims:{...record.entry.claims,[E.Status]:S.InProgress}}}
  const onCommand=vi.fn(async(_command:PortalEncounterRequest)=>({journey:{...view,encounters:[updated]},affectedEncounterReferences:[record.entry.reference]}))
  render(<ui.EncounterJourneyPanel subjectLabel={f.subjectReference} view={view} onCommand={onCommand}/>)
  expect(screen.queryByRole('button',{name:'Clinical discharge'})).toBeNull()
  fireEvent.click(screen.getByRole('button',{name:'Start encounter'}))
  await waitFor(()=>expect(onCommand).toHaveBeenCalledTimes(1))
  expect(onCommand.mock.calls[0]?.[0]).toMatchObject({action:'status',encounterReference:record.entry.reference,expectedRevision:1,status:S.InProgress})
  expect(screen.getByRole('status').textContent).toContain('confirmed')
})
it('retries the identical command after an interrupted response without assuming success',async()=>{
  const requests:PortalEncounterRequest[]=[]
  const created={...record,entry:{...record.entry,entryId:f.destination.id,reference:f.destination.reference}}
  const onCommand=vi.fn(async(command:PortalEncounterRequest)=>{
    requests.push(command)
    if(requests.length===1)throw new Error('connection interrupted')
    return {journey:{...view,encounters:[record,created]},affectedEncounterReferences:[created.entry.reference]}
  })
  render(<ui.EncounterJourneyPanel subjectLabel={f.subjectReference} view={view} onCommand={onCommand}/>)
  fireEvent.click(screen.getByRole('button',{name:'Create encounter'}))
  await waitFor(()=>expect(screen.getByRole('alert')).toBeTruthy())
  expect(screen.queryByText('Change confirmed')).toBeNull()
  fireEvent.click(screen.getByRole('button',{name:'Retry last change'}))
  await waitFor(()=>expect(onCommand).toHaveBeenCalledTimes(2))
  expect(requests[1]).toEqual(requests[0])
  expect(requests[0]).toMatchObject({action:'create',serviceReference:service.reference})
})

it('the transfer console retry preserves the original operation after a lost response',async()=>{
  const active={...record,revision:2,entry:{...record.entry,claims:{...record.entry.claims,[E.Status]:S.InProgress,[E.ServiceProvider]:service.organizationReference}}}
  const target={...service,reference:f.destination.serviceReference,label:'Assessment service'}
  const requests:PortalEncounterRequest[]=[]
  const onCommand=vi.fn(async(command:PortalEncounterRequest)=>{requests.push(command);throw new Error('connection interrupted')})
  render(<ui.EncounterJourneyPanel subjectLabel={f.subjectReference} view={{...view,services:[service,target],encounters:[active]}} onCommand={onCommand}/>)
  fireEvent.click(screen.getByRole('button',{name:'Transfer to another service'}))
  fireEvent.click(screen.getByRole('button',{name:'Confirm transfer'}))
  await waitFor(()=>expect(requests).toHaveLength(1))
  fireEvent.click(await screen.findByRole('button',{name:'Retry transfer'}))
  await waitFor(()=>expect(requests).toHaveLength(2))
  expect(requests[1]).toEqual(requests[0])
})

it('a confirmed transfer replaces the editor with one persisted journey status',async()=>{
  const active={...record,revision:2,entry:{...record.entry,claims:{...record.entry.claims,[E.Status]:S.InProgress,[E.ServiceProvider]:service.organizationReference}}}
  const target={...service,reference:f.destination.serviceReference,label:'Assessment service'}
  function Host(){
    const [current,setCurrent]=React.useState<PortalEncounterJourneyView>({...view,services:[service,target],encounters:[active]})
    return <ui.EncounterJourneyPanel subjectLabel={f.subjectReference} view={current} onCommand={async()=>{
      const next={...current,encounters:[{...active,entry:{...active.entry,claims:{...active.entry.claims,[E.Status]:S.OnHold}}},{...active,entry:{...active.entry,reference:f.destination.reference,entryId:f.destination.id,claims:{...active.entry.claims,[E.Status]:S.InProgress,[E.ServiceType]:target.reference}}}]}
      setCurrent(next);return {journey:next,affectedEncounterReferences:[active.entry.reference,f.destination.reference]}
    }}/>
  }
  render(<Host/>);fireEvent.click(screen.getByRole('button',{name:'Transfer to another service'}));fireEvent.click(screen.getByRole('button',{name:'Confirm transfer'}))
  await waitFor(()=>expect(screen.getAllByRole('status')).toHaveLength(1))
  expect(screen.getByRole('status').textContent).toBe('Change confirmed')
})

it.each([`${f.source.id}-destination`,`encounter-${f.source.id}`])('keeps the opaque identifier %s out of the normal journey',identifier=>{
 const row={...record,entry:{...record.entry,claims:{...record.entry.claims,[E.Identifier]:identifier}}}
 render(<ui.EncounterJourneyPanel subjectLabel="Shared subject" view={{...view,canManage:false,encounters:[row]}}/>)
 expect(screen.queryByText(identifier)).toBeNull()
})

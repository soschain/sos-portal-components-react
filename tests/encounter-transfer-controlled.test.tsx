// Flow contract: the reused transfer console displays provider-confirmed states, supports a read-only family projection, and never substitutes simulated tools or a submitted request for confirmed readback.
// @vitest-environment jsdom
import React from 'react'
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import * as shared from '../src/index.js'
import type {EncounterTransferConsoleCopy} from '../src/EncounterTransferConsole.js'
import {SOSCHAIN_PERSONAL_DEMO_HOUSEHOLD} from 'sos-data-utils-ts/portal-demo-fixtures'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'

// Label keys themselves are the exact controlled-copy contract under test.
const keys='patientSearchTitle scanQr patientId search journeyTitle sourceTitle destinationTitle returning returningHint notReturning notReturningHint transferTo reviewChanges applyTransfer emergencyActions call videoCall sendMessage text audio messageLabel attach pdf fhirBundle calendar send resourceSummary sourceUpdate sourceHistory destinationUpdate destinationHistory indexProjection demoWarning helpTitle helpBody transferReady messageReady callReady videoReady patientReady reviewReady attachmentReady technicalDetails encounterIdentifier transferPending retryTransfer transferRejected'.split(' ')
const copy=Object.fromEntries(keys.map(key=>[key,key])) as EncounterTransferConsoleCopy
const subject=SOSCHAIN_PERSONAL_DEMO_HOUSEHOLD[0]!
const encounters=[{identifier:subject.uhcId,serviceLabel:subject.nickname,arrivedAt:'',status:'planned' as const}]
afterEach(cleanup)

it('shows actual planned state and removes all mutation and simulated controls for a read-only viewer',()=>{
  render(<shared.EncounterTransferConsole copy={copy} patientDisplay={subject.nickname} encounters={encounters} sourceEncounterId="" destinationEncounterId={subject.uhcId} contacts={[]} readOnly />)
  expect(screen.getByText('planned')).toBeTruthy()
  expect(screen.queryByRole('button',{name:copy.applyTransfer})).toBeNull()
  expect(screen.queryByRole('button',{name:copy.scanQr})).toBeNull()
  expect(screen.queryByRole('button',{name:copy.call})).toBeNull()
  expect(screen.queryByRole('radio')).toBeNull()
})
it('shows one real planned stage without navigation controls or an empty time element',()=>{
 const host=render(<shared.EncounterTransferConsole copy={copy} patientDisplay={subject.nickname} encounters={encounters} sourceEncounterId="" destinationEncounterId="" contacts={[]} readOnly/>)
 expect(screen.getByText('planned')).toBeTruthy()
 expect(host.container.querySelectorAll('.uhcp-transfer-card')).toHaveLength(1)
 expect(host.container.querySelector('time')).toBeNull()
 expect(screen.queryByRole('button',{name:'Anterior'})).toBeNull()
 expect(screen.queryByRole('button',{name:'Siguiente'})).toBeNull()
 expect(screen.queryByRole('button',{name:copy.applyTransfer})).toBeNull()
})
it('does not reserve full-screen rail or card height for the normal one-stage read view',()=>{
 const style=document.createElement('style')
 style.textContent=readFileSync(resolve(process.cwd(),'src/encounter-journey.css'),'utf8')
 document.head.append(style)
 try{
  const host=render(<shared.EncounterTransferConsole copy={copy} patientDisplay={subject.nickname} encounters={encounters} sourceEncounterId="" destinationEncounterId="" contacts={[]} readOnly/>)
  const rail=host.container.querySelector('.uhcp-transfer-rail')!,card=host.container.querySelector('.uhcp-transfer-card')!
  expect(getComputedStyle(rail).minHeight).toMatch(/^0(?:px)?$/)
  expect(getComputedStyle(card).minHeight).toMatch(/^0(?:px)?$/)
 }finally{style.remove()}
})
it('retains three actual stages, their statuses and bounded rail navigation without inventing times',()=>{
 const stages=[encounters[0]!,{...encounters[0]!,identifier:subject.uhcId+'-second',serviceLabel:'Assessment',arrivedAt:'2026-11-17T10:00:00Z',status:'in-progress' as const},{...encounters[0]!,identifier:subject.uhcId+'-third',serviceLabel:'Follow-up',arrivedAt:'2026-11-17T11:00:00Z',status:'completed' as const}]
 const host=render(<shared.EncounterTransferConsole copy={copy} patientDisplay={subject.nickname} encounters={stages} sourceEncounterId="" destinationEncounterId="" contacts={[]} readOnly/>)
 expect(host.container.querySelectorAll('.uhcp-transfer-card')).toHaveLength(3)
 expect(screen.getByText('planned')).toBeTruthy();expect(screen.getByText('in-progress')).toBeTruthy();expect(screen.getByText('completed')).toBeTruthy()
 expect(host.container.querySelectorAll('time')).toHaveLength(2)
 expect(screen.getByRole('button',{name:'Anterior'})).toBeTruthy();expect(screen.getByRole('button',{name:'Siguiente'})).toBeTruthy()
 expect(screen.queryByRole('radio')).toBeNull()
})
it('does not report a transfer as confirmed without a host handler',()=>{
  render(<shared.EncounterTransferConsole copy={copy} patientDisplay={subject.nickname} encounters={encounters} sourceEncounterId={subject.uhcId} destinationEncounterId="" contacts={[]} />)
  expect((screen.getByRole('button',{name:copy.applyTransfer}) as HTMLButtonElement).disabled).toBe(true)
  expect(screen.queryByRole('status')).toBeNull()
})
it('waits for confirmation and leaves a rejected transfer visibly unconfirmed',async()=>{
  let finish!:(result:{state:'confirmed'})=>void
  const onApplyTransfer=vi.fn(()=>new Promise<{state:'confirmed'}>(resolve=>{finish=resolve}))
  const props={copy,patientDisplay:subject.nickname,encounters,sourceEncounterId:subject.uhcId,destinationEncounterId:'',contacts:[],onApplyTransfer}
  const view=render(<shared.EncounterTransferConsole {...props}/>)
  fireEvent.click(screen.getByRole('button',{name:copy.applyTransfer}))
  expect(screen.queryByText(copy.transferReady)).toBeNull()
  expect((screen.getByRole('button',{name:copy.applyTransfer}) as HTMLButtonElement).disabled).toBe(true)
  finish({state:'confirmed'})
  await waitFor(()=>expect(screen.getByText(copy.transferReady)).toBeTruthy())
  view.unmount()
  render(<shared.EncounterTransferConsole {...props} onApplyTransfer={async()=>({state:'rejected'})}/>)
  fireEvent.click(screen.getByRole('button',{name:copy.applyTransfer}))
  await waitFor(()=>expect(screen.getByText(copy.transferRejected)).toBeTruthy())
  expect(screen.queryByText(copy.transferReady)).toBeNull()
})

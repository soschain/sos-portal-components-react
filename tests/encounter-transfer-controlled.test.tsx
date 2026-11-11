// Flow contract: the reused transfer console displays provider-confirmed states, supports a read-only family projection, and never substitutes simulated tools or a submitted request for confirmed readback.
// @vitest-environment jsdom
import React from 'react'
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import * as shared from '../src/index.js'
import type {EncounterTransferConsoleCopy} from '../src/EncounterTransferConsole.js'
import {SOSCHAIN_PERSONAL_DEMO_HOUSEHOLD} from 'sos-data-utils-ts/portal-demo-fixtures'

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

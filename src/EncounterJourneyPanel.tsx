import {useRef,useState} from 'react'
import {EncounterStatusR5 as S,portalEncounterNextStatuses,type PortalEncounterJourneyView,type PortalEncounterMutationResult,type PortalEncounterRequest} from 'sos-data-utils-ts/portal-encounter-journey'
import {EncounterClaim as E,EncounterHistoryClaim as H} from 'fhir-data-utils-ts/claims'
import {EncounterTransferConsole,type EncounterTransferConsoleCopy,type EncounterSourceOutcome,type EncounterTransferStage} from './EncounterTransferConsole.js'

export const ENCOUNTER_TRANSFER_COPY_EN:EncounterTransferConsoleCopy={
  patientSearchTitle:'Find a patient',scanQr:'Scan QR',patientId:'Card identifier',search:'Find card',journeyTitle:'Service stages',
  sourceTitle:'Current service',destinationTitle:'Destination service',returning:'Patient will return',returningHint:'Keep the current service on hold.',
  notReturning:'Patient will not return',notReturningHint:'Complete the current service.',transferTo:'Transfer to',reviewChanges:'Review changes',applyTransfer:'Confirm transfer',
  emergencyActions:'Emergency contacts',call:'Call',videoCall:'Video call',sendMessage:'Send message',text:'Text',audio:'Audio',messageLabel:'Message',attach:'Attach',pdf:'PDF',fhirBundle:'FHIR Bundle',calendar:'Calendar',send:'Send',
  resourceSummary:'Transfer changes',sourceUpdate:'Update source',sourceHistory:'Record source history',destinationUpdate:'Update destination',destinationHistory:'Record destination history',indexProjection:'Project continuity',
  demoWarning:'Synthetic Demo data',helpTitle:'What happens to the previous service?',helpBody:'A temporary move keeps it on hold. A definitive move completes it. The destination starts only after the transfer is confirmed.',
  transferReady:'Transfer confirmed',messageReady:'Message prepared',callReady:'Call prepared',videoReady:'Video call prepared',patientReady:'Card found',reviewReady:'Review prepared',attachmentReady:'Attachment selected',technicalDetails:'Technical details',
  encounterIdentifier:'Encounter identifier',transferPending:'Transfer is not confirmed. Retry the same change.',retryTransfer:'Retry transfer',transferRejected:'The transfer was rejected.',
}
export type EncounterJourneyCopy=Readonly<{
  title:string;empty:string;service:string;create:string;encounter:string;destination:string;transfer:string;history:string;refresh:string;retry:string;confirmed:string
  start:string;resume:string;hold:string;complete:string;discharge:string;cancel:string;discontinue:string;transferCopy:EncounterTransferConsoleCopy
}>
export const ENCOUNTER_JOURNEY_COPY_EN:EncounterJourneyCopy={title:'Encounter journey',empty:'No encounters have been recorded for this card.',service:'Service',create:'Create encounter',encounter:'Encounter',destination:'Destination service',transfer:'Transfer to another service',history:'Encounter history',refresh:'Refresh journey',retry:'Retry last change',confirmed:'Change confirmed',start:'Start encounter',resume:'Resume encounter',hold:'Pause encounter',complete:'Complete encounter',discharge:'Clinical discharge',cancel:'Cancel encounter',discontinue:'Discontinue encounter',transferCopy:ENCOUNTER_TRANSFER_COPY_EN}

/** One renderer and one intent contract. The host chooses the authorized provider and returns its actual readback. */
export function EncounterJourneyPanel({subjectLabel,view,onCommand,onRefresh,copy=ENCOUNTER_JOURNEY_COPY_EN}:Readonly<{
  subjectLabel:string;view:PortalEncounterJourneyView;onCommand?:(command:PortalEncounterRequest)=>Promise<PortalEncounterMutationResult>
  onRefresh?:()=>Promise<void>;copy?:EncounterJourneyCopy
}>){
  const [selectedReference,setSelectedReference]=useState(''),[serviceReference,setServiceReference]=useState('')
  const [destinationReference,setDestinationReference]=useState(''),[transferOpen,setTransferOpen]=useState(false)
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('')
  const retry=useRef<PortalEncounterRequest|null>(null)
  const manageable=view.encounters.filter(row=>view.services.some(service=>service.reference===row.entry.claims[E.ServiceType]&&(!row.entry.claims[E.ServiceProvider]||service.organizationReference===row.entry.claims[E.ServiceProvider])))
  const selected=manageable.find(row=>row.entry.reference===selectedReference)
    ??manageable.find(row=>row.entry.claims[E.Status]===S.InProgress)??manageable[0]
  const canManage=Boolean(view.canManage&&onCommand),blocked=busy||Boolean(error&&retry.current)
  const service=view.services.find(item=>item.reference===serviceReference)??view.services[0]
  const destinations=view.services.filter(item=>item.organizationReference===selected?.entry.claims[E.ServiceProvider]&&item.reference!==selected.entry.claims[E.ServiceType])
  const destination=destinations.find(item=>item.reference===destinationReference)??destinations[0]
  const stages:EncounterTransferStage[]=view.encounters.map(row=>({identifier:row.entry.reference,
    serviceLabel:row.serviceLabel||view.services.find(item=>item.reference===row.entry.claims[E.ServiceType])?.label||'Other organization encounter',
    arrivedAt:row.entry.claims[E.ActualPeriodStart]||row.entry.claims[E.PeriodStart]||'',status:row.entry.claims[E.Status] as EncounterTransferStage['status'],
  }))
  const statuses=selected?.allowedStatuses??portalEncounterNextStatuses(selected?.entry.claims[E.Status]||'')
  const statusLabel=(status:S)=>status===S.InProgress?(selected?.entry.claims[E.Status]===S.OnHold?copy.resume:copy.start):status===S.OnHold?copy.hold:status===S.Completed?copy.complete:status===S.Discharged?copy.discharge:status===S.Cancelled?copy.cancel:copy.discontinue

  async function execute(command:PortalEncounterRequest):Promise<void>{
    if(!canManage||!onCommand)throw new Error('encounter_write_unavailable')
    retry.current=command;setBusy(true);setError('');setNotice('')
    try{
      const result=await onCommand(command)
      if(result.journey.subjectIdentifier!==view.subjectIdentifier||!result.affectedEncounterReferences.length
        ||result.affectedEncounterReferences.some(reference=>!result.journey.encounters.some(row=>row.entry.reference===reference)))throw new Error('encounter_readback_missing')
      if(command.action==='status'&&!result.journey.encounters.some(row=>row.entry.reference===command.encounterReference&&row.entry.claims[E.Status]===command.status))throw new Error('encounter_readback_mismatch')
      if(command.action==='transfer'&&(!result.journey.encounters.some(row=>row.entry.reference===command.encounterReference&&row.entry.claims[E.Status]===command.sourceOutcome)
        ||!result.journey.encounters.some(row=>row.entry.reference!==command.encounterReference&&row.entry.claims[E.ServiceType]===command.destinationServiceReference&&row.entry.claims[E.Status]===S.InProgress)))throw new Error('encounter_readback_mismatch')
      if(command.action==='create'&&!result.journey.encounters.some(row=>result.affectedEncounterReferences.includes(row.entry.reference)&&row.entry.claims[E.Status]===S.Planned))throw new Error('encounter_readback_mismatch')
      retry.current=null;setTransferOpen(false);setNotice(copy.confirmed)
    }catch(reason){setError(reason instanceof Error?reason.message:'Encounter change failed');throw reason}
    finally{setBusy(false)}
  }
  async function transfer(outcome:EncounterSourceOutcome){
    if(!selected||!destination)return {state:'rejected' as const}
    const pending=retry.current
    const command:PortalEncounterRequest=pending?.action==='transfer'?pending:{action:'transfer',operationId:crypto.randomUUID(),encounterReference:selected.entry.reference,expectedRevision:selected.revision,destinationServiceReference:destination.reference,sourceOutcome:outcome as S.OnHold|S.Completed}
    try{await execute(command);return {state:'confirmed' as const}}catch{return {state:'retryable' as const}}
  }
  return <section className="sos-encounter-journey" role="region" aria-label={copy.title}>
    <header><div><h2>{copy.title}</h2><p>{subjectLabel}</p></div>{onRefresh&&<button type="button" disabled={busy} onClick={()=>void onRefresh().then(()=>{retry.current=null;setError('');setNotice('')}).catch(reason=>setError(String(reason)))}>{copy.refresh}</button>}</header>
    {canManage&&service&&<form onSubmit={event=>{event.preventDefault();void execute({action:'create',operationId:crypto.randomUUID(),serviceReference:service.reference}).catch(()=>{})}}>
      <label>{copy.service}<select aria-label={copy.service} value={service.reference} disabled={blocked} onChange={event=>setServiceReference(event.target.value)}>{view.services.map(item=><option key={item.reference} value={item.reference}>{item.label}</option>)}</select></label>
      <button type="submit" disabled={blocked}>{copy.create}</button>
    </form>}
    {!view.encounters.length?<p>{copy.empty}</p>:<>
      {canManage&&selected&&<div className="sos-encounter-actions"><label>{copy.encounter}<select aria-label={copy.encounter} value={selected.entry.reference} disabled={blocked} onChange={event=>{setSelectedReference(event.target.value);setTransferOpen(false)}}>{stages.filter(item=>manageable.some(row=>row.entry.reference===item.identifier)).map(item=><option key={item.identifier} value={item.identifier}>{item.serviceLabel} · {item.status}</option>)}</select></label>
        {statuses.map(status=><button key={status} type="button" disabled={blocked} onClick={()=>void execute({action:'status',operationId:crypto.randomUUID(),encounterReference:selected.entry.reference,expectedRevision:selected.revision,status}).catch(()=>{})}>{statusLabel(status)}</button>)}
        {destinations.length>0&&selected.entry.claims[E.Status]===S.InProgress&&<button type="button" disabled={blocked} onClick={()=>setTransferOpen(value=>!value)}>{copy.transfer}</button>}
      </div>}
      {canManage&&transferOpen&&destination&&<label>{copy.destination}<select aria-label={copy.destination} disabled={blocked} value={destination.reference} onChange={event=>setDestinationReference(event.target.value)}>{destinations.map(item=><option key={item.reference} value={item.reference}>{item.label}</option>)}</select></label>}
      <EncounterTransferConsole key={transferOpen?'edit':'read'} copy={copy.transferCopy} patientDisplay={subjectLabel} encounters={stages} sourceEncounterId={transferOpen?selected?.entry.reference||'':''} destinationEncounterId="" contacts={[]} readOnly={!canManage||!transferOpen}
        {...(transferOpen&&destination?{destinationPreview:{serviceLabel:destination.label}}:{})}
        {...(canManage&&transferOpen?{onApplyTransfer:transfer}:{})}/>
    </>}
    {view.history.length>0&&<details><summary>{copy.history}</summary><ol>{view.history.map(row=><li key={row.entry.reference} data-encounter-history={row.entry.claims[H.Encounter]}><time>{row.entry.claims[H.ActualPeriodStart]}</time> · {row.entry.claims[H.Status]} · {row.serviceLabel||view.services.find(service=>service.reference===row.entry.claims[H.ServiceType])?.label||'Other organization encounter'}</li>)}</ol></details>}
    {error&&<p role="alert">{error}</p>}
    {canManage&&error&&retry.current&&<button type="button" disabled={busy} onClick={()=>void execute(retry.current!).catch(()=>{})}>{copy.retry}</button>}
    {notice&&<p role="status">{notice}</p>}
  </section>
}

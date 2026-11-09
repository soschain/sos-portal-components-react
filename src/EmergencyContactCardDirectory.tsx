'use client'

import type {SoschainDemoContact,SoschainDemoSubject} from 'sos-data-utils-ts/portal-demo-fixtures'
import {useId,useState} from 'react'

export type EmergencyContactCardDirectoryCopy=Readonly<{
  title:string;controller:string;contactCard:string;add:string;remove:string
  makePrimary:string;primary:string;empty:string;noCandidates:string;authority:string
}>

export type EmergencyContactCardDirectoryProps=Readonly<{
  copy:EmergencyContactCardDirectoryCopy
  contacts:readonly SoschainDemoContact<string>[]
  candidates:readonly Pick<SoschainDemoSubject,'uhcId'|'nickname'>[]
  controllerLabel:string
  busy?:boolean
  error?:string
  className?:string
  actionClassName?:string
  selectClassName?:string
  onAdd(subjectIdentifier:string):void|Promise<void>
  onRemove(contactId:string):void|Promise<void>
  onMakePrimary(contactId:string):void|Promise<void>
}>

/** Controlled card relationships; the host owns persistence and authorization. */
export function EmergencyContactCardDirectory({copy,contacts,candidates,controllerLabel,busy,error,className,actionClassName,selectClassName,onAdd,onRemove,onMakePrimary}:EmergencyContactCardDirectoryProps){
  const id=useId()
  const [selection,setSelection]=useState('')
  const available=candidates.filter(candidate=>!contacts.some(contact=>contact.subjectId===candidate.uhcId))
  const selected=available.some(candidate=>candidate.uhcId===selection)?selection:''
  return <section aria-labelledby={`${id}-title`} className={['emergency-contact-card-directory',className].filter(Boolean).join(' ')}>
    <h3 id={`${id}-title`}>{copy.title}</h3>
    <p><strong>{copy.controller}: </strong>{controllerLabel}</p>
    <p>{copy.authority}</p>
    <fieldset disabled={busy}>
      {contacts.length?<ul>{contacts.map(contact=><li key={contact.contactId}>
        <strong>{contact.label}</strong>
        <p>{contact.relationshipLabel}</p>
        {contact.primary?<p>{copy.primary}</p>:<button type="button" className={actionClassName} disabled={busy} onClick={()=>void onMakePrimary(contact.contactId)}>{copy.makePrimary}</button>}
        <button type="button" className={actionClassName} disabled={busy} onClick={()=>void onRemove(contact.contactId)}>{copy.remove}</button>
      </li>)}</ul>:<p>{copy.empty}</p>}
      {available.length?<form onSubmit={event=>{event.preventDefault();if(!busy&&selected)void onAdd(selected)}}>
        <label htmlFor={`${id}-contact`}>{copy.contactCard}</label>
        <select id={`${id}-contact`} className={selectClassName} value={selected} onChange={event=>setSelection(event.target.value)} required>
          <option value="" disabled>{copy.contactCard}</option>
          {available.map(candidate=><option key={candidate.uhcId} value={candidate.uhcId}>{candidate.nickname}</option>)}
        </select>
        <button type="submit" className={actionClassName} disabled={busy||!selected}>{copy.add}</button>
      </form>:<p>{copy.noCandidates}</p>}
    </fieldset>
    {error?<p role="alert">{error}</p>:null}
  </section>
}

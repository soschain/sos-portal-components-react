'use client'
import {useId} from 'react'
export type PushNotificationRegistrationCopy=Readonly<{
  title:string;description:string;enable:string;disable:string;enabled:string;disabled:string
  unavailable:string;denied:string;otherDevice:string;revoke:string;total:string
}>
export type PushNotificationRegistrationProps=Readonly<{
  copy:PushNotificationRegistrationCopy
  status:'enabled'|'disabled'|'unavailable'|'denied'
  devices:readonly Readonly<{keyId:string}>[]
  currentKeyId?:string
  busy?:boolean
  progress?:string
  error?:string
  className?:string
  actionClassName?:string
  onEnable():void|Promise<void>
  onRevoke(keyId:string):void|Promise<void>
}>
/** Shared controlled presentation; the host supplies the browser/native registration and owning BFF. */
export function PushNotificationRegistration({copy,status,devices,currentKeyId,busy,progress,error,className,actionClassName,onEnable,onRevoke}:PushNotificationRegistrationProps){
  const id=useId()
  return <details className={className}>
    <summary id={id}>{copy.title}</summary>
    <section aria-labelledby={id} aria-busy={busy}>
      <p>{copy.description}</p><p role="status">{busy&&progress?progress:copy[status]}</p>
      {status==='disabled'?<button type="button" disabled={busy} className={actionClassName} onClick={()=>{if(!busy)void onEnable()}}>{copy.enable}</button>:null}
      {status==='enabled'&&currentKeyId?<button type="button" disabled={busy} className={actionClassName} onClick={()=>{if(!busy)void onRevoke(currentKeyId)}}>{copy.disable}</button>:null}
      <p>{copy.total}: {devices.length}</p>
      {devices.filter(device=>device.keyId!==currentKeyId).length?<ul>{devices.filter(device=>device.keyId!==currentKeyId).map((device,index)=><li key={device.keyId}>{copy.otherDevice} {index+1} <button type="button" disabled={busy} className={actionClassName} onClick={()=>{if(!busy)void onRevoke(device.keyId)}}>{copy.revoke}</button></li>)}</ul>:null}
      {error?<p role="alert">{error}</p>:null}
    </section>
  </details>
}

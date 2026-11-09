'use client'
import {useCallback,useEffect,useRef} from 'react'
import type {RealtimeCallSession,RealtimeCallEndOutcome} from './LiveKitRealtimeCallClient.js'

/** Shared profile-owned media lifetime; hosts retain their own state and error presentation. */
export function useRealtimeCallSessionLifecycle(session:RealtimeCallSession|undefined,callbacks:Readonly<{
  onEnded:(session:RealtimeCallSession)=>void
  onError:(error:unknown,session:RealtimeCallSession)=>void
}>){
  const latest=useRef(callbacks),mountedSession=useRef<RealtimeCallSession|undefined>(undefined)
  const closing=useRef(new WeakSet<RealtimeCallSession>())
  const endSession=useCallback((target:RealtimeCallSession,outcome?:RealtimeCallEndOutcome)=>{
    closing.current.add(target)
    return target.end(outcome)
  },[])
  useEffect(()=>{latest.current=callbacks},[callbacks])
  useEffect(()=>{
    if(!session)return
    mountedSession.current=session
    let active=true
    void session.ended?.then(()=>{closing.current.add(session);if(active)latest.current.onEnded(session)},error=>{closing.current.add(session);if(active)latest.current.onError(error,session)})
    return()=>{
      active=false
      if(mountedSession.current===session)mountedSession.current=undefined
      // React Strict Mode replays mount effects synchronously. End only if this
      // exact session was not mounted again; a replacement/closed profile ends it.
      queueMicrotask(()=>{
        if(mountedSession.current!==session&&!closing.current.has(session)){
          closing.current.add(session)
          void Promise.resolve(session.end()).catch(()=>undefined)
        }
      })
    }
  },[session])
  return endSession
}

// Flow contract: both portal hosts share one session lifecycle that observes persisted remote completion, keeps ordinary renders from closing a call and ends media when the owning profile view unmounts; a failed end remains an error, never a successful terminal state.
// @vitest-environment jsdom
import React from 'react'
import {act,cleanup,render} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {useRealtimeCallSessionLifecycle} from '../src/useRealtimeCallSessionLifecycle.js'
import type {RealtimeCallSession} from '../src/LiveKitRealtimeCallClient.js'
import {REPOSITORY_SAFE_EXAMPLES as safe} from 'sos-data-utils-ts/repository-privacy'
afterEach(cleanup)
function Harness({session,onEnded,onError,onReady}:{session:RealtimeCallSession;onEnded:()=>void;onError:(error:unknown)=>void;onReady?:(end:unknown)=>void}){const end=useRealtimeCallSessionLifecycle(session,{onEnded,onError});React.useEffect(()=>onReady?.(end),[onReady,end]);return <div/>}
it('observes completion without re-ending on ordinary renders, and ends the session on profile closure',async()=>{
  let finish!:()=>void
  const ended=new Promise<void>(resolve=>{finish=resolve}),end=vi.fn(async()=>undefined)
  const session={callId:safe.resourceUuid,localStream:{} as MediaStream,remoteStream:{} as MediaStream,answered:Promise.resolve(),ended,end}
  const onEnded=vi.fn(),onError=vi.fn()
  const view=render(<Harness session={session} onEnded={onEnded} onError={onError}/>)
  view.rerender(<Harness session={session} onEnded={()=>onEnded()} onError={()=>onError()}/>)
  expect(end).not.toHaveBeenCalled()
  await act(async()=>{finish();await ended})
  expect(onEnded).toHaveBeenCalledOnce();expect(onError).not.toHaveBeenCalled()
  await act(async()=>{view.unmount();await Promise.resolve()});expect(end).not.toHaveBeenCalled()
})
it('reports a failed persistence confirmation without claiming completion',async()=>{
  let fail!:(error:Error)=>void
  const ended=new Promise<void>((_resolve,reject)=>{fail=reject})
  const onEnded=vi.fn(),onError=vi.fn(),end=vi.fn(async()=>undefined)
  const session={callId:safe.resourceUuid,localStream:{} as MediaStream,remoteStream:{} as MediaStream,answered:Promise.resolve(),ended,end}
  render(<Harness session={session} onEnded={onEnded} onError={onError}/>)
  await act(async()=>{fail(new Error('history_pending'));await Promise.resolve()})
  expect(onEnded).not.toHaveBeenCalled();expect(onError).toHaveBeenCalledOnce()
})
it('preserves an active session through React Strict Mode effect replay',async()=>{
  const end=vi.fn(async()=>undefined)
  const session={callId:safe.resourceUuid,localStream:{} as MediaStream,remoteStream:{} as MediaStream,answered:Promise.resolve(),ended:new Promise<void>(()=>{}),end}
  const view=render(<React.StrictMode><Harness session={session} onEnded={vi.fn()} onError={vi.fn()}/></React.StrictMode>)
  await act(async()=>{await Promise.resolve()})
  expect(end).not.toHaveBeenCalled()
  await act(async()=>{view.unmount();await Promise.resolve()})
  expect(end).toHaveBeenCalledOnce()
})
it('does not replay a failed explicit missed outcome as a new default end during view cleanup',async()=>{
  const end=vi.fn().mockRejectedValueOnce(new Error('history_pending'))
  const session={callId:safe.resourceUuid,localStream:{} as MediaStream,remoteStream:{} as MediaStream,answered:Promise.resolve(),ended:new Promise<void>(()=>{}),end}
  const ready=vi.fn()
  const view=render(<Harness session={session} onEnded={vi.fn()} onError={vi.fn()} onReady={ready}/>)
  const finish=ready.mock.calls[0]![0]
  expect(typeof finish).toBe('function')
  await expect(finish(session,'missed')).rejects.toThrow('history_pending')
  await act(async()=>{view.unmount();await Promise.resolve()})
  expect(end.mock.calls).toEqual([['missed']])
})

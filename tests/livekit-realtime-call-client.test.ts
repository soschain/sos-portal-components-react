// Flow contract: a portal call obtains one BFF-authorized grant, connects real RTC media and converges local/remote/authoritative terminal events into one persisted end; connection failure releases media and cannot leave an accepted placeholder or invoke an assistant.
import {afterEach,describe, expect, it, vi } from 'vitest'
import { createLiveKitRealtimeCallClient } from '../src/LiveKitRealtimeCallClient.js'
import {REPOSITORY_SAFE_EXAMPLES as safe} from 'sos-data-utils-ts/repository-privacy'
afterEach(()=>vi.useRealTimers())

describe('dedicated LiveKit realtime call client', () => {
  it('connects and ends without exposing an assistant transport', async () => {
    const stop = vi.fn(); const localTrack = { stop }; const remoteTrack = {}
    const localStream = { addTrack: vi.fn(), getTracks: () => [localTrack] }
    const remoteStream = { addTrack: vi.fn(), getTracks: () => [] }
    const room = { on: vi.fn((event, handler) => {if(event==='trackSubscribed')handler({ mediaStreamTrack: remoteTrack })}), connect: vi.fn(), disconnect: vi.fn(), localParticipant: {
      setMicrophoneEnabled: vi.fn(), setCameraEnabled: vi.fn(), trackPublications: new Map([['audio', { track: { mediaStreamTrack: localTrack } }]]),
    } }
    const issueSession = vi.fn().mockResolvedValue({ callId: 'call-1', serverUrl: 'wss://rtc.example', participantToken: 'opaque-token' })
    const endCall = vi.fn()
    class MockRoom { constructor() { return room as never } }
    const client = createLiveKitRealtimeCallClient({ issueSession, endCall,
      loadLiveKit: async () => ({ Room: MockRoom, RoomEvent: { TrackSubscribed: 'trackSubscribed',ParticipantDisconnected:'participantDisconnected',Disconnected:'disconnected' } } as never),
      createMediaStream: vi.fn().mockReturnValueOnce(localStream).mockReturnValueOnce(remoteStream) as never })
    const session = await client.start({ conversation: { subjectDid: 'did:web:subject.example' }, media: ['audio', 'video'] })
    expect(room.connect).toHaveBeenCalledWith('wss://rtc.example', 'opaque-token')
    expect(remoteStream.addTrack).toHaveBeenCalledWith(remoteTrack)
    expect(session.answered).toBeInstanceOf(Promise)
    await session.answered
    await session.end('missed')
    expect(endCall).toHaveBeenCalledWith({ conversation: { subjectDid: 'did:web:subject.example' }, callId: 'call-1', outcome: 'missed' })
    expect(JSON.stringify(issueSession.mock.calls)).not.toMatch(/chat|assistant/i)
  })
})

function fixture(){
  const handlers=new Map<string,()=>void>(),stop=vi.fn()
  const localTrack={stop},stream={addTrack:vi.fn(),getTracks:()=>[localTrack]}
  const room={on:vi.fn((name:string,handler:()=>void)=>handlers.set(name,handler)),connect:vi.fn(async()=>undefined),disconnect:vi.fn(),localParticipant:{setMicrophoneEnabled:vi.fn(),setCameraEnabled:vi.fn(),trackPublications:new Map([['audio',{track:{mediaStreamTrack:localTrack}}]])}}
  const issueSession=vi.fn(async()=>({callId:safe.resourceUuid,serverUrl:safe.httpsBaseUrl,participantToken:'synthetic-test-grant'})),endCall=vi.fn(async()=>undefined)
  class Room{constructor(){return room as never}}
  const dependencies={issueSession,endCall,loadLiveKit:async()=>({Room,RoomEvent:{TrackSubscribed:'track',ParticipantDisconnected:'peer-left',Disconnected:'disconnected'}} as never),createMediaStream:()=>stream as unknown as MediaStream}
  return {handlers,stop,room,issueSession,endCall,dependencies,input:{conversation:{subjectDid:safe.didWeb},media:['audio'] as const}}
}
it('closes media and persists once when the remote participant hangs up',async()=>{
  const f=fixture(),session=await createLiveKitRealtimeCallClient(f.dependencies).start(f.input)
  expect(session.ended).toBeInstanceOf(Promise)
  f.handlers.get('peer-left')!()
  await session.ended
  await session.end()
  expect(f.endCall).toHaveBeenCalledTimes(1);expect(f.stop).toHaveBeenCalledTimes(1);expect(f.room.disconnect).toHaveBeenCalledTimes(1)
})
it('cleans up a failed connection and records cancellation without leaving media or an unhandled promise',async()=>{
  const f=fixture();f.room.connect.mockRejectedValueOnce(new Error('connection_failed'))
  await expect(createLiveKitRealtimeCallClient(f.dependencies).start(f.input)).rejects.toThrow('connection_failed')
  expect(f.room.disconnect).toHaveBeenCalledOnce();expect(f.stop).toHaveBeenCalledOnce()
  expect(f.endCall).toHaveBeenCalledWith(expect.objectContaining({outcome:'cancelled'}))
})
it('does not create a call when the browser cannot load the media client',async()=>{
  const f=fixture()
  await expect(createLiveKitRealtimeCallClient({...f.dependencies,loadLiveKit:async()=>{throw new Error('media_unavailable')}}).start(f.input)).rejects.toThrow('media_unavailable')
  expect(f.issueSession).not.toHaveBeenCalled()
})
it('observes a canonical decline before media joins and stops without waiting for the unanswered timer',async()=>{
  vi.useFakeTimers()
  const f=fixture(),readCallState=vi.fn(async()=> 'declined' as const)
  const session=await createLiveKitRealtimeCallClient({...f.dependencies,readCallState}).start(f.input)
  await vi.advanceTimersByTimeAsync(2000)
  await session.ended
  expect(f.endCall).toHaveBeenCalledOnce();expect(f.room.disconnect).toHaveBeenCalledOnce()
})
it('releases microphone tracks immediately even while transport shutdown is pending',async()=>{
  const f=fixture(),session=await createLiveKitRealtimeCallClient(f.dependencies).start(f.input)
  let disconnected!:()=>void
  f.room.disconnect.mockReturnValue(new Promise<void>(resolve=>{disconnected=resolve}))
  const pending=session.end()
  expect(f.stop).toHaveBeenCalledOnce()
  disconnected();await pending
})

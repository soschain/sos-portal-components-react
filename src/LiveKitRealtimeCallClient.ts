export type RealtimeCallMedia = 'audio' | 'video'
export type RealtimeCallEndOutcome = 'missed' | 'cancelled'
export type RealtimeCallSession = Readonly<{ callId: string; localStream: MediaStream; remoteStream: MediaStream; answered: Promise<void>; /** Present on the shared client; optional for retained injected legacy adapters. */ ended?:Promise<void>; end(outcome?: RealtimeCallEndOutcome): Promise<void> }>
export type LiveKitJoinSession<Conversation> = Readonly<{ conversation: Conversation; callId?: string; media: readonly RealtimeCallMedia[] }>
export type LiveKitSessionGrant = Readonly<{ callId: string; serverUrl: string; participantToken: string }>

type LiveKitModule = typeof import('livekit-client')

/** Dedicated RTC adapter. It never receives Chat routes and persists no call history. */
export function createLiveKitRealtimeCallClient<Conversation>(dependencies: Readonly<{
  issueSession(input: LiveKitJoinSession<Conversation>): Promise<LiveKitSessionGrant>
  endCall(input: Readonly<{ conversation: Conversation; callId: string; outcome?: RealtimeCallEndOutcome }>): Promise<void>
  loadLiveKit?: () => Promise<LiveKitModule>
  createMediaStream?: () => MediaStream
  readCallState?: (input:Readonly<{conversation:Conversation;callId:string}>)=>Promise<PortalRtcCallState>
}>) {
  const loadLiveKit = dependencies.loadLiveKit ?? (() => import('livekit-client'))
  const createMediaStream = dependencies.createMediaStream ?? (() => new MediaStream())

  async function connect(input: LiveKitJoinSession<Conversation>): Promise<RealtimeCallSession> {
    // Establish browser capability before creating a persisted invitation.
    const liveKit=await loadLiveKit()
    const grant=await dependencies.issueSession(input)
    const room = new liveKit.Room({ adaptiveStream: true, dynacast: true })
    const localStream = createMediaStream()
    const remoteStream = createMediaStream()
    let resolveAnswered: (() => void) | undefined
    const answered = new Promise<void>(resolve => { resolveAnswered = resolve })
    let resolveEnded!:()=>void,rejectEnded!:(error:unknown)=>void
    const ended=new Promise<void>((resolve,reject)=>{resolveEnded=resolve;rejectEnded=reject})
    void ended.catch(()=>undefined) // A disconnect may precede the host receiving its session; retain the original rejection for that host.
    let closing=false,connected=false,disconnected=false,released=false,pendingEnd:Promise<void>|undefined
    let timer:ReturnType<typeof setTimeout>|undefined
    function end(outcome?:RealtimeCallEndOutcome):Promise<void>{
      if(pendingEnd)return pendingEnd
      closing=true;clearTimeout(timer)
      pendingEnd=(async()=>{
        const failures:unknown[]=[]
        if(!released){
          released=true
          const tracks=new Set([...localStream.getTracks(),...remoteStream.getTracks(),...Array.from(room.localParticipant.trackPublications.values(),publication=>publication.track?.mediaStreamTrack).filter((track):track is MediaStreamTrack=>Boolean(track))])
          for(const track of tracks)track.stop()
        }
        try{if(!disconnected){await room.disconnect();disconnected=true}}catch(error){failures.push(error)}
        try{await dependencies.endCall({conversation:input.conversation,callId:grant.callId,...(outcome?{outcome}:{})})}catch(error){failures.push(error)}
        if(failures.length)throw failures.length===1?failures[0]:new AggregateError(failures,'portal_rtc_close_failed')
        resolveEnded()
      })().catch(error=>{pendingEnd=undefined;rejectEnded(error);throw error})
      return pendingEnd
    }
    const remoteEnded=()=>{if(!closing)void end(connected?undefined:'cancelled').catch(()=>undefined)}
    room.on(liveKit.RoomEvent.ParticipantDisconnected,remoteEnded)
    room.on(liveKit.RoomEvent.Disconnected,remoteEnded)
    room.on(liveKit.RoomEvent.TrackSubscribed, track => {
      const mediaTrack = track.mediaStreamTrack
      if (mediaTrack) remoteStream.addTrack(mediaTrack)
      resolveAnswered?.()
      resolveAnswered = undefined
    })
    try{
      await room.connect(grant.serverUrl, grant.participantToken)
      connected=true
      if (!closing&&input.media.includes('audio')) await room.localParticipant.setMicrophoneEnabled(true)
      if (!closing&&input.media.includes('video')) await room.localParticipant.setCameraEnabled(true)
      if(!closing)for (const publication of room.localParticipant.trackPublications.values()) {
        const mediaTrack = publication.track?.mediaStreamTrack
        if (mediaTrack) localStream.addTrack(mediaTrack)
      }
    }catch(error){
      try{await end('cancelled')}catch(closeError){throw new AggregateError([error,closeError],'portal_rtc_connection_and_history_failed')}
      throw error
    }
    async function watch(){
      if(closing||!dependencies.readCallState)return
      try{
        const state=await dependencies.readCallState({conversation:input.conversation,callId:grant.callId})
        if(Object.values(PortalRtcCallState).includes(state)&&state!==PortalRtcCallState.Ringing&&state!==PortalRtcCallState.Received){await end(state==='cancelled'||state==='missed'?state:undefined);return}
      }catch{/* A failed read is not an end state. A close failure remains on ended for the host to handle/retry. */}
      if(!closing)timer=setTimeout(()=>void watch(),2000)
    }
    if(dependencies.readCallState&&!closing)timer=setTimeout(()=>void watch(),2000)
    return Object.freeze({
      callId: grant.callId, localStream, remoteStream, answered,ended,end,
    })
  }

  return {
    start(input: Readonly<{ conversation: Conversation; media: readonly RealtimeCallMedia[] }>) { return connect(input) },
    accept(input: Readonly<{ conversation: Conversation; callId: string; media: readonly RealtimeCallMedia[] }>) { return connect(input) },
  }
}
import {PortalRtcCallState} from 'sos-data-utils-ts/portal-rtc-call'

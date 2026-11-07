export type RealtimeCallMedia = 'audio' | 'video'
export type RealtimeCallSession = Readonly<{ callId: string; localStream: MediaStream; remoteStream: MediaStream; end(): Promise<void> }>
export type LiveKitJoinSession<Conversation> = Readonly<{ conversation: Conversation; callId?: string; media: readonly RealtimeCallMedia[] }>
export type LiveKitSessionGrant = Readonly<{ callId: string; serverUrl: string; participantToken: string }>

type LiveKitModule = typeof import('livekit-client')

/** Dedicated RTC adapter. It never receives Chat routes and persists no call history. */
export function createLiveKitRealtimeCallClient<Conversation>(dependencies: Readonly<{
  issueSession(input: LiveKitJoinSession<Conversation>): Promise<LiveKitSessionGrant>
  endCall(input: Readonly<{ conversation: Conversation; callId: string }>): Promise<void>
  loadLiveKit?: () => Promise<LiveKitModule>
  createMediaStream?: () => MediaStream
}>) {
  const loadLiveKit = dependencies.loadLiveKit ?? (() => import('livekit-client'))
  const createMediaStream = dependencies.createMediaStream ?? (() => new MediaStream())

  async function connect(input: LiveKitJoinSession<Conversation>): Promise<RealtimeCallSession> {
    const [liveKit, grant] = await Promise.all([loadLiveKit(), dependencies.issueSession(input)])
    const room = new liveKit.Room({ adaptiveStream: true, dynacast: true })
    const localStream = createMediaStream()
    const remoteStream = createMediaStream()
    room.on(liveKit.RoomEvent.TrackSubscribed, track => {
      const mediaTrack = track.mediaStreamTrack
      if (mediaTrack) remoteStream.addTrack(mediaTrack)
    })
    await room.connect(grant.serverUrl, grant.participantToken)
    if (input.media.includes('audio')) await room.localParticipant.setMicrophoneEnabled(true)
    if (input.media.includes('video')) await room.localParticipant.setCameraEnabled(true)
    for (const publication of room.localParticipant.trackPublications.values()) {
      const mediaTrack = publication.track?.mediaStreamTrack
      if (mediaTrack) localStream.addTrack(mediaTrack)
    }
    return Object.freeze({
      callId: grant.callId, localStream, remoteStream,
      async end() {
        room.disconnect()
        for (const track of localStream.getTracks()) track.stop()
        await dependencies.endCall({ conversation: input.conversation, callId: grant.callId })
      },
    })
  }

  return {
    start(input: Readonly<{ conversation: Conversation; media: readonly RealtimeCallMedia[] }>) { return connect(input) },
    accept(input: Readonly<{ conversation: Conversation; callId: string; media: readonly RealtimeCallMedia[] }>) { return connect(input) },
  }
}

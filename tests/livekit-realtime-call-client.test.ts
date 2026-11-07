// Flow contract: a portal call obtains one BFF-authorized LiveKit grant, connects media directly to the dedicated RTC provider and records end through Communication without invoking Chat or an assistant.
import { describe, expect, it, vi } from 'vitest'
import { createLiveKitRealtimeCallClient } from '../src/LiveKitRealtimeCallClient.js'

describe('dedicated LiveKit realtime call client', () => {
  it('connects and ends without exposing an assistant transport', async () => {
    const stop = vi.fn(); const localTrack = { stop }; const remoteTrack = {}
    const localStream = { addTrack: vi.fn(), getTracks: () => [localTrack] }
    const remoteStream = { addTrack: vi.fn(), getTracks: () => [] }
    const room = { on: vi.fn((_event, handler) => handler({ mediaStreamTrack: remoteTrack })), connect: vi.fn(), disconnect: vi.fn(), localParticipant: {
      setMicrophoneEnabled: vi.fn(), setCameraEnabled: vi.fn(), trackPublications: new Map([['audio', { track: { mediaStreamTrack: localTrack } }]]),
    } }
    const issueSession = vi.fn().mockResolvedValue({ callId: 'call-1', serverUrl: 'wss://rtc.example', participantToken: 'opaque-token' })
    const endCall = vi.fn()
    class MockRoom { constructor() { return room as never } }
    const client = createLiveKitRealtimeCallClient({ issueSession, endCall,
      loadLiveKit: async () => ({ Room: MockRoom, RoomEvent: { TrackSubscribed: 'trackSubscribed' } } as never),
      createMediaStream: vi.fn().mockReturnValueOnce(localStream).mockReturnValueOnce(remoteStream) as never })
    const session = await client.start({ conversation: { subjectDid: 'did:web:subject.example' }, media: ['audio', 'video'] })
    expect(room.connect).toHaveBeenCalledWith('wss://rtc.example', 'opaque-token')
    expect(remoteStream.addTrack).toHaveBeenCalledWith(remoteTrack)
    await session.end()
    expect(endCall).toHaveBeenCalledWith({ conversation: { subjectDid: 'did:web:subject.example' }, callId: 'call-1' })
    expect(JSON.stringify(issueSession.mock.calls)).not.toMatch(/chat|assistant/i)
  })
})

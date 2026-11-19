'use client'

import { useEffect, useRef, useState } from 'react'
import type { RealtimeCallMedia } from '../LiveKitRealtimeCallClient.js'
import { BrowserCallVideoTile } from './BrowserCallVideoTile.js'

/** Minimal host-injected session contract; no signaling or persistence implementation. */
export type BrowserRealtimeCallSession = Readonly<{ callId: string; localStream: MediaStream; remoteStream: MediaStream; end(): Promise<void> }>

export type BrowserRealtimeCallPanelClient<Conversation> = Readonly<{
  start(input: Readonly<{ conversation: Conversation; media: readonly RealtimeCallMedia[] }>): Promise<BrowserRealtimeCallSession>
  accept(input: Readonly<{ conversation: Conversation; callId: string; media: readonly RealtimeCallMedia[] }>): Promise<BrowserRealtimeCallSession>
}>

export type BrowserRealtimeCallPanelLabels = Readonly<{
  title: string
  start: string
  accept: string
  end: string
  connecting?: string
  connected?: string
  ended?: string
  failed?: string
}>

/** Product-neutral, two-sided browser call screen; authority remains in the supplied BFF client. */
export function BrowserRealtimeCallPanel<Conversation>({
  conversation,
  client,
  incomingCallId,
  labels,
  locale,
  media = ['audio', 'video'],
  onFailure,
}: Readonly<{
  conversation: Conversation
  client: BrowserRealtimeCallPanelClient<Conversation>
  incomingCallId?: string
  labels: BrowserRealtimeCallPanelLabels
  locale?: string
  media?: readonly RealtimeCallMedia[]
  onFailure?: (error: unknown) => void
}>) {
  const [session, setSession] = useState<BrowserRealtimeCallSession>()
  const [status, setStatus] = useState('idle')
  const remoteAudio = useRef<HTMLAudioElement>(null)
  const activeSession = useRef<BrowserRealtimeCallSession | undefined>(undefined)

  useEffect(() => {
    activeSession.current = session
    const audio = remoteAudio.current
    if (audio) audio.srcObject = session?.remoteStream ?? null
    return () => { if (audio) audio.srcObject = null }
  }, [session])

  useEffect(() => () => {
    if (activeSession.current) void activeSession.current.end().catch(() => undefined)
  }, [])

  async function open() {
    setStatus('connecting')
    try {
      setSession(incomingCallId
        ? await client.accept({ conversation, callId: incomingCallId, media })
        : await client.start({ conversation, media }))
      setStatus('connected')
    } catch (error) {
      onFailure?.(error)
      setStatus('failed')
    }
  }

  async function end() {
    const active = session
    setSession(undefined)
    setStatus('ended')
    await active?.end()
  }

  return <section className="uhcp-realtime-call-panel" aria-label={labels.title}>
    <h3>{labels.title}</h3>
    {!session ? <button type="button" onClick={() => void open()} disabled={status === 'connecting'}>
      {incomingCallId ? labels.accept : labels.start}
    </button> : null}
    <p role="status">{labels[status as keyof BrowserRealtimeCallPanelLabels] || status}</p>
    {session ? <div className="uhcp-realtime-call-media">
      {media.includes('video') ? <div className="uhcp-call-video-grid">
        <BrowserCallVideoTile stream={session.localStream} side="local" locale={locale} testId="realtime-call-local-video" />
        <BrowserCallVideoTile stream={session.remoteStream} side="remote" locale={locale} testId="realtime-call-remote-video" />
      </div> : <audio ref={remoteAudio} autoPlay />}
      <button type="button" onClick={() => void end()}>{labels.end}</button>
    </div> : null}
  </section>
}

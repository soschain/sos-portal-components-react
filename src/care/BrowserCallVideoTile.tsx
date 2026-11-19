'use client'

import { useEffect, useRef, useState } from 'react'

/** Keep the media element mounted so a participant can hear audio before video arrives. */
export function BrowserCallVideoTile({ stream, side, locale, testId }: Readonly<{
  stream: MediaStream
  side: 'local' | 'remote'
  locale?: string | undefined
  testId?: string
}>) {
  const video = useRef<HTMLVideoElement>(null)
  const [hasVideo, setHasVideo] = useState(false)
  const es = locale?.split('-')[0] === 'es'
  const local = side === 'local'
  const label = local ? (es ? 'Tú' : 'You') : (es ? 'Otra persona' : 'Other participant')
  const unavailable = local
    ? (es ? 'Tu cámara está desactivada o no está disponible' : 'Your camera is off or unavailable')
    : (es ? 'La cámara de la otra persona está desactivada o no está disponible' : 'Other participant’s camera is off or unavailable')

  useEffect(() => {
    const element = video.current
    if (!element) return
    element.srcObject = stream

    function update() {
      setHasVideo(stream.getTracks().some(track => track.kind === 'video' && track.readyState === 'live' && !track.muted))
    }
    const trackEvents = ['mute', 'unmute', 'ended']
    let observed: MediaStreamTrack[] = []
    function unobserve() {
      for (const track of observed) {
        for (const event of trackEvents) track.removeEventListener(event, update)
      }
    }
    function observe() {
      unobserve()
      observed = stream.getTracks().filter(track => track.kind === 'video')
      for (const track of observed) {
        for (const event of trackEvents) track.addEventListener(event, update)
      }
      update()
    }
    stream.addEventListener?.('addtrack', observe)
    stream.addEventListener?.('removetrack', observe)
    observe()
    return () => {
      unobserve()
      stream.removeEventListener?.('addtrack', observe)
      stream.removeEventListener?.('removetrack', observe)
      element.srcObject = null
    }
  }, [stream])

  return <div className="uhcp-call-video" role="group" aria-label={label}>
    <video ref={video} data-testid={testId} autoPlay muted={local} playsInline />
    {!hasVideo && <div className="uhcp-call-video-placeholder">
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3l18 18M9 7h5a2 2 0 0 1 2 2v1l5-3v10l-3-2M16 17a2 2 0 0 1-2 1H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2" />
      </svg>
      <span>{unavailable}</span>
    </div>}
  </div>
}

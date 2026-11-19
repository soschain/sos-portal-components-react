// Flow contract: one neutral call screen starts or accepts an authorized browser session, binds local and remote media, and ends the exact active call.
// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BrowserRealtimeCallPanel } from '../../src/care/BrowserRealtimeCallPanel.js'

const localStream = { getTracks: () => [] } as unknown as MediaStream
const remoteStream = { getTracks: () => [] } as unknown as MediaStream
afterEach(cleanup)

describe('BrowserRealtimeCallPanel', () => {
  it('starts video through the supplied authorized client and ends that session', async () => {
    const end = vi.fn().mockResolvedValue(undefined)
    const start = vi.fn().mockResolvedValue({ callId: 'call-1', localStream, remoteStream, end })
    render(<BrowserRealtimeCallPanel
      conversation={{ subjectId: 'subject-1' }}
      client={{ start, accept: vi.fn() }}
      labels={{ title: 'Protected video call', start: 'Start video', accept: 'Accept video', end: 'Hang up' }}
    />)

    fireEvent.click(screen.getByRole('button', { name: 'Start video' }))
    await waitFor(() => expect(start).toHaveBeenCalledWith({ conversation: { subjectId: 'subject-1' }, media: ['audio', 'video'] }))
    await waitFor(() => expect(screen.getByTestId('realtime-call-local-video')).toHaveProperty('srcObject', localStream))
    expect(screen.getByTestId('realtime-call-remote-video')).toHaveProperty('srcObject', remoteStream)

    fireEvent.click(screen.getByRole('button', { name: 'Hang up' }))
    await waitFor(() => expect(end).toHaveBeenCalledOnce())
  })

  it('accepts one server-listed call without changing its identifier', async () => {
    const accept = vi.fn().mockResolvedValue({ callId: 'call-incoming', localStream, remoteStream, end: vi.fn().mockResolvedValue(undefined) })
    render(<BrowserRealtimeCallPanel
      conversation="conversation-1"
      incomingCallId="call-incoming"
      client={{ start: vi.fn(), accept }}
      labels={{ title: 'Protected video call', start: 'Start video', accept: 'Accept video', end: 'Hang up' }}
    />)

    fireEvent.click(screen.getByRole('button', { name: 'Accept video' }))
    await waitFor(() => expect(accept).toHaveBeenCalledWith({
      conversation: 'conversation-1', callId: 'call-incoming', media: ['audio', 'video'],
    }))
  })

  it('shows both camera placeholders and keeps audio attached when only remote video arrives', async () => {
    const audioTrack = { kind: 'audio' }
    const videoTrack = Object.assign(new EventTarget(), { kind: 'video', readyState: 'live', muted: false })
    const tracks: object[] = [audioTrack]
    const incomingStream = Object.assign(new EventTarget(), { getTracks: () => tracks })
    const start = vi.fn().mockResolvedValue({ callId: 'call-1', localStream, remoteStream: incomingStream, end: vi.fn().mockResolvedValue(undefined) })
    render(<BrowserRealtimeCallPanel
      conversation="conversation-1"
      client={{ start, accept: vi.fn() }}
      labels={{ title: 'Protected video call', start: 'Start video', accept: 'Accept video', end: 'Hang up' }}
    />)
    fireEvent.click(screen.getByRole('button', { name: 'Start video' }))

    const local = await screen.findByRole('group', { name: 'You' })
    const remote = screen.getByRole('group', { name: 'Other participant' })
    expect(within(local).getByText('Your camera is off or unavailable')).toBeDefined()
    expect(within(remote).getByText('Other participant’s camera is off or unavailable')).toBeDefined()
    const remoteVideo = within(remote).getByTestId('realtime-call-remote-video')
    expect(remoteVideo).toHaveProperty('srcObject', incomingStream)
    expect(remoteVideo).toHaveProperty('muted', false)

    act(() => {
      tracks.push(videoTrack)
      incomingStream.dispatchEvent(new Event('addtrack'))
    })
    expect(within(remote).queryByText('Other participant’s camera is off or unavailable')).toBeNull()
    expect(within(local).getByText('Your camera is off or unavailable')).toBeDefined()
    expect(within(remote).getByTestId('realtime-call-remote-video')).toBe(remoteVideo)

    act(() => {
      tracks.pop()
      incomingStream.dispatchEvent(new Event('removetrack'))
    })
    expect(within(remote).getByText('Other participant’s camera is off or unavailable')).toBeDefined()
    expect(remoteVideo).toHaveProperty('srcObject', incomingStream)
  })

  it('reports a connection failure without exposing the conversation in the rendered status', async () => {
    const failure = new DOMException('camera unavailable', 'NotReadableError')
    const onFailure = vi.fn()
    const rendered = render(<BrowserRealtimeCallPanel
      conversation={{ privateSubject: 'subject-1' }}
      client={{ start: vi.fn().mockRejectedValue(failure), accept: vi.fn() }}
      labels={{ title: 'Protected video call', start: 'Start video', accept: 'Accept video', end: 'Hang up', failed: 'Call failed.' }}
      onFailure={onFailure}
    />)

    const panel = within(rendered.container)
    fireEvent.click(panel.getByRole('button', { name: 'Start video' }))

    await waitFor(() => expect(onFailure).toHaveBeenCalledWith(failure))
    expect(panel.getByRole('status').textContent).toBe('Call failed.')
    expect(panel.getByRole('status').textContent).not.toContain('subject-1')
  })
})

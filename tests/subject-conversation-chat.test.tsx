// Flow contract: the shared SOS web and Expo adapter projects one authorized subject conversation into the neutral React Native chat surface while hosts retain send, attachment, FHIR rendering and delivery authority.
// @vitest-environment jsdom
import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const capture = vi.hoisted(() => vi.fn())
vi.mock('antifraud-portal-components-react/conversation-surface', () => ({
  AntifraudConversationSurface: (props: any) => {
    capture(props)
    const documentMessage = props.messages.find((message: any) => message.subjectConversation.content.kind === 'fhir-document')
    return <div data-testid="react-native-chat">
      {props.messages.map((message: any) => <span key={message._id}>{message.text}</span>)}
      {documentMessage ? props.renderMessageContent(documentMessage) : null}
      <button type="button" onClick={() => props.onSendText('Reply from shared chat')}>Mock send</button>
    </div>
  },
}))

import { SubjectConversationChat } from '../src/SubjectConversationChat.js'

afterEach(() => { cleanup(); capture.mockClear() })

describe('SubjectConversationChat', () => {
  it('projects text, FHIR documents and missed calls without taking host authority', () => {
    const sent: string[] = []
    render(<SubjectConversationChat
      entries={[
        { id: 'text-1', createdAt: '2026-11-06T10:00:00.000Z', direction: 'incoming', sender: { id: 'PractitionerRole/one', name: 'Clinic' }, content: { kind: 'text', text: 'Vaccination confirmed.' } },
        { id: 'document-1', createdAt: '2026-11-06T10:01:00.000Z', direction: 'incoming', sender: { id: 'PractitionerRole/one', name: 'Clinic' }, content: { kind: 'fhir-document', label: 'Vaccination Bundle', bundle: { resourceType: 'Bundle', type: 'document' } } },
        { id: 'call-1', createdAt: '2026-11-06T10:02:00.000Z', direction: 'incoming', sender: { id: 'PractitionerRole/one', name: 'Clinic' }, content: { kind: 'call', media: 'video', state: 'missed', label: 'Video call' } },
      ]}
      currentUser={{ id: 'Patient/self', name: 'Me' }}
      onSendText={text => { sent.push(text) }}
      renderFhirDocument={({ label }) => <div>FHIR renderer: {label}</div>}
      locale="en"
    />)

    expect(screen.getByTestId('react-native-chat')).toBeTruthy()
    expect(screen.getByText('Video call · Missed')).toBeTruthy()
    expect(screen.getByText('FHIR renderer: Vaccination Bundle')).toBeTruthy()
    expect(capture.mock.calls[0]![0].messages[0].system).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Mock send' }))
    expect(sent).toEqual(['Reply from shared chat'])
  })
})

// Flow contract: nested subject workspaces register display state with the SOS header; cleanup clears it, and switching requires an explicit host capability and callback.
// @vitest-environment jsdom
import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

afterEach(cleanup)
const loadOwnedSubject = (path: string) => import(/* @vite-ignore */ path)
const labels = { current: 'Current subject', change: 'Change subject' }
const subject = { id: 'selected-subject', displayName: 'Selected subject' }

it('registers host display state and clears the header when its workspace unmounts', async () => {
  const { PortalCurrentSubjectProvider, PortalCurrentSubjectSlot, usePortalCurrentSubjectRegistration } = await loadOwnedSubject('../src/PortalCurrentSubject.js')
  function Workspace() {
    usePortalCurrentSubjectRegistration({ subject, labels, canChange: false })
    return null
  }
  function Surface({ show }: { show: boolean }) {
    return <PortalCurrentSubjectProvider><PortalCurrentSubjectSlot/>{show ? <Workspace/> : null}</PortalCurrentSubjectProvider>
  }
  const view = render(<Surface show/>)
  expect(screen.getByRole('button', { name: 'Current subject: Selected subject' })).toBeTruthy()
  view.rerender(<Surface show={false}/>)
  expect(screen.queryByRole('button', { name: 'Current subject: Selected subject' })).toBeNull()
})

it('requires host switching capability and callback and dismisses the menu without changing the subject', async () => {
  const { PortalCurrentSubjectControl } = await loadOwnedSubject('../src/PortalCurrentSubject.js')
  const onChange = vi.fn()
  const view = render(<PortalCurrentSubjectControl subject={subject} labels={labels} canChange={false} onChange={onChange}/>)
  fireEvent.click(screen.getByRole('button', { name: 'Current subject: Selected subject' }))
  expect(screen.queryByRole('button', { name: 'Change subject' })).toBeNull()
  fireEvent.keyDown(window, { key: 'Escape' })
  expect(screen.getByRole('button', { name: 'Current subject: Selected subject' }).getAttribute('aria-expanded')).toBe('false')
  expect(onChange).not.toHaveBeenCalled()
  view.rerender(<PortalCurrentSubjectControl subject={subject} labels={labels} canChange/>)
  fireEvent.click(screen.getByRole('button', { name: 'Current subject: Selected subject' }))
  expect(screen.queryByRole('button', { name: 'Change subject' })).toBeNull()
  view.rerender(<PortalCurrentSubjectControl subject={subject} labels={labels} canChange onChange={onChange}/>)
  fireEvent.click(screen.getByRole('button', { name: 'Change subject' }))
  expect(onChange).toHaveBeenCalledOnce()
  expect(screen.getByRole('button', { name: 'Current subject: Selected subject' }).getAttribute('aria-expanded')).toBe('false')
})

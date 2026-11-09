// Flow contract: device push registration is an explicit account-level action, independent of card navigation; one shared renderer shows unavailable/denied/enabled states and delegates registration or revocation without requesting permission on mount.
// @vitest-environment jsdom
import React from 'react'
import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {PushNotificationRegistration} from '../src/PushNotificationRegistration.js'
afterEach(cleanup)
const copy={title:'Notifications on your devices',description:'Enable notifications on each browser or app. No card needs to be open.',enable:'Enable on this browser',disable:'Disable on this browser',enabled:'Enabled on this browser',disabled:'Not enabled on this browser',unavailable:'Not available in this environment',denied:'Notifications are blocked in browser settings',otherDevice:'Other registered browser',revoke:'Remove device',total:'Registered browsers'}
it('requests registration only after the user action and delegates device revocation',()=>{
  const onEnable=vi.fn(),onRevoke=vi.fn()
  const props={copy,status:'disabled' as const,devices:[{keyId:'other'}],onEnable,onRevoke}
  const view=render(<PushNotificationRegistration {...props}/>)
  expect(onEnable).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button',{name:copy.enable}));expect(onEnable).toHaveBeenCalledOnce()
  fireEvent.click(screen.getByRole('button',{name:copy.revoke}));expect(onRevoke).toHaveBeenCalledWith('other')
  view.rerender(<PushNotificationRegistration {...props} status="enabled" currentKeyId="other"/>)
  fireEvent.click(screen.getByRole('button',{name:copy.disable}));expect(onRevoke).toHaveBeenLastCalledWith('other')
})
it('shows unsupported or denied state without an active registration button',()=>{
  const props={copy,status:'unavailable' as const,devices:[],onEnable:vi.fn(),onRevoke:vi.fn()}
  const view=render(<PushNotificationRegistration {...props}/>);expect(screen.queryByRole('button',{name:copy.enable})).toBeNull()
  view.rerender(<PushNotificationRegistration {...props} status="denied"/>);expect(screen.getByText(copy.denied)).toBeTruthy()
  expect(screen.queryByRole('button',{name:copy.enable})).toBeNull()
})
it('shows the host registration progress while the native browser operation is pending',()=>{
  render(<PushNotificationRegistration copy={copy} status="disabled" busy progress="Registering this browser…" devices={[]} onEnable={vi.fn()} onRevoke={vi.fn()}/>)
  expect(screen.getByRole('status').textContent).toBe('Registering this browser…')
  expect((screen.getByRole('button',{name:copy.enable}) as HTMLButtonElement).disabled).toBe(true)
})

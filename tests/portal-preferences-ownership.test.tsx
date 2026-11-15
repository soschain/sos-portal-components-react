// Flow contract: SOS owns explicit device-only preference persistence and composes controlled Antifraud renderers; menu and settings share a namespace without changing business state.
// @vitest-environment jsdom
import React from 'react'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

// Node's optional server-side Web Storage must not replace the browser Storage API.
beforeEach(() => {
  const browser = (globalThis as unknown as { jsdom: { window: Window } }).jsdom.window
  vi.stubGlobal('localStorage', browser.localStorage)
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.classList.remove('dark', 'light')
  delete document.documentElement.dataset.theme
  delete document.documentElement.dataset.density
  vi.unstubAllGlobals()
})
const loadOwned = (path: string) => import(/* @vite-ignore */ path)
const brand = { family: 'personal', productName: 'Configured portal', organizationName: 'Configured organization', homeHref: '/home' }
const copy = { home: 'Home', accountAndPreferences: 'Account and preferences', notSignedIn: 'Signed out', appearance: 'Appearance', textSize: 'Text size', themes: { light: 'Light', dark: 'Dark', system: 'System' }, language: 'Language', chooseAccess: 'Choose access', signOut: 'Sign out' }
const settingsCopy = { title: 'Settings', description: 'Device settings', security: 'Security', appearance: 'Appearance', theme: 'Theme', textSize: 'Text size', language: 'Language', legal: 'Legal', themes: copy.themes, densities: { small: 'Small', medium: 'Medium', large: 'Large' } }

it('synchronizes explicit device preferences between both controlled surfaces and preserves unrelated business state', async () => {
  const { PortalHeader } = await loadOwned('../src/PortalHeader.js')
  const { PortalSettingsPanel } = await loadOwned('../src/PortalSettingsPanel.js')
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  localStorage.setItem('unrelated-business-state', 'unchanged')
  const onThemeChange = vi.fn()
  render(<><PortalHeader brand={brand} copy={copy} guestActionHref="/login" storageNamespace="shared-ui" onThemeChange={onThemeChange}/><PortalSettingsPanel copy={settingsCopy} storageNamespace="shared-ui" languageOptions={[]} legalLinks={[]}/></>)
  const settings = within(screen.getByRole('main'))
  fireEvent.click(settings.getByRole('button', { name: 'Dark' }))
  fireEvent.click(screen.getByRole('button', { name: copy.accountAndPreferences }))
  const menu = within(screen.getByRole('region', { name: copy.accountAndPreferences }))
  expect(menu.getByRole('button', { name: 'Dark' }).getAttribute('aria-pressed')).toBe('true')
  expect(onThemeChange).toHaveBeenLastCalledWith('dark')
  fireEvent.click(menu.getByRole('button', { name: 'L' }))
  expect(settings.getByRole('button', { name: 'Large' }).getAttribute('aria-pressed')).toBe('true')
  expect(document.documentElement.dataset.density).toBe('large')
  expect(localStorage.getItem('shared-ui.theme')).toBe('dark')
  expect(localStorage.getItem('unrelated-business-state')).toBe('unchanged')
})

it('restores only its namespace and applies system theme changes through the explicit browser adapter', async () => {
  const { PortalSettingsPanel } = await loadOwned('../src/PortalSettingsPanel.js')
  let changed: (() => void) | undefined
  const media = { matches: false, addEventListener: vi.fn((_event: string, listener: () => void) => { changed = listener }), removeEventListener: vi.fn() }
  vi.stubGlobal('matchMedia', () => media)
  localStorage.setItem('other-ui.theme', 'dark')
  const view = render(<PortalSettingsPanel copy={settingsCopy} storageNamespace="owned-ui" languageOptions={[]} legalLinks={[]}/>)
  expect(screen.getByRole('button', { name: 'System' }).getAttribute('aria-pressed')).toBe('true')
  expect(document.documentElement.dataset.theme).toBe('light')
  media.matches = true
  changed?.()
  expect(document.documentElement.dataset.theme).toBe('dark')
  view.unmount()
  expect(media.removeEventListener).toHaveBeenCalled()
  expect(localStorage.getItem('other-ui.theme')).toBe('dark')
  expect(localStorage.getItem('owned-ui.theme')).toBeNull()
})

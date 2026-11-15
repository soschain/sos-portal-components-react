'use client'

import { useEffect, useState } from 'react'
import type { PortalUiDensity, PortalUiTheme } from 'antifraud-common-components-react'
import { notifyPortalUiPreferencesChanged, observePortalUiTheme, resolvePortalUiDensity, resolvePortalUiTheme, subscribePortalUiPreferences } from './preferences.js'

/** Browser device presentation only. No account, subject, credential or grant is persisted here. */
export function usePortalUiPreferences(storageNamespace: string, onThemeChange?: (theme: PortalUiTheme) => void) {
  const [theme, setTheme] = useState<PortalUiTheme>('system')
  const [density, setDensity] = useState<PortalUiDensity>('medium')
  const themeKey = `${storageNamespace}.theme`
  const densityKey = `${storageNamespace}.density`

  useEffect(() => {
    setTheme(resolvePortalUiTheme(localStorage.getItem(themeKey)))
    const savedDensity = resolvePortalUiDensity(localStorage.getItem(densityKey))
    setDensity(savedDensity)
    document.documentElement.dataset.density = savedDensity
  }, [themeKey, densityKey])

  useEffect(() => observePortalUiTheme(theme), [theme])
  useEffect(() => subscribePortalUiPreferences(storageNamespace, kind => {
    const savedTheme = resolvePortalUiTheme(localStorage.getItem(themeKey))
    const savedDensity = resolvePortalUiDensity(localStorage.getItem(densityKey))
    setTheme(savedTheme)
    setDensity(savedDensity)
    document.documentElement.dataset.density = savedDensity
    if (kind === 'theme') onThemeChange?.(savedTheme)
  }), [storageNamespace, themeKey, densityKey, onThemeChange])

  function changeTheme(value: PortalUiTheme) {
    setTheme(value)
    localStorage.setItem(themeKey, value)
    notifyPortalUiPreferencesChanged(storageNamespace, 'theme')
  }

  function changeDensity(value: PortalUiDensity) {
    setDensity(value)
    localStorage.setItem(densityKey, value)
    document.documentElement.dataset.density = value
    notifyPortalUiPreferencesChanged(storageNamespace, 'density')
  }

  return { theme, density, changeTheme, changeDensity }
}

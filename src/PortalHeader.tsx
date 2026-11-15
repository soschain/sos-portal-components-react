'use client'

import { PortalHeader as ControlledPortalHeader, type PortalHeaderProps as ControlledPortalHeaderProps, type PortalUiTheme } from 'antifraud-common-components-react'
import { PortalCurrentSubjectControl, PortalCurrentSubjectSlot, type PortalCurrentSubjectRegistration } from './PortalCurrentSubject.js'
import { usePortalUiPreferences } from './usePortalUiPreferences.js'

export type PortalHeaderProps = Omit<ControlledPortalHeaderProps, 'theme' | 'density' | 'onThemeChange' | 'onDensityChange' | 'currentSubject' | 'onLanguageSelect'> & Readonly<{
  storageNamespace?: string
  currentSubject?: PortalCurrentSubjectRegistration
  onThemeChange?: (theme: PortalUiTheme) => void
}>

/** SOS composition supplies the subject slot and explicit browser presentation adapter. */
export function PortalHeader({ storageNamespace = 'sos-portal', currentSubject, onThemeChange, ...props }: PortalHeaderProps) {
  const { theme, density, changeTheme, changeDensity } = usePortalUiPreferences(storageNamespace, onThemeChange)
  return <ControlledPortalHeader {...props} theme={theme} density={density} onThemeChange={changeTheme} onDensityChange={changeDensity}
    onLanguageSelect={href => window.location.assign(href)}
    currentSubject={currentSubject ? <PortalCurrentSubjectControl {...currentSubject}/> : <PortalCurrentSubjectSlot/>}/>
}

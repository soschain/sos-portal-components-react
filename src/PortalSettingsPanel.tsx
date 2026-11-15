'use client'

import { PortalSettingsPanel as ControlledPortalSettingsPanel, type PortalSettingsPanelProps as ControlledPortalSettingsPanelProps } from 'antifraud-common-components-react'
import { usePortalUiPreferences } from './usePortalUiPreferences.js'

export type { PortalSettingsCopy, PortalSettingsLink } from 'antifraud-common-components-react'
export type PortalSettingsPanelProps = Omit<ControlledPortalSettingsPanelProps, 'theme' | 'density' | 'onThemeChange' | 'onDensityChange'> & Readonly<{ storageNamespace: string }>

/** Same controlled renderer as the header; storage remains in the SOS browser adapter. */
export function PortalSettingsPanel({ storageNamespace, ...props }: PortalSettingsPanelProps) {
  const { theme, density, changeTheme, changeDensity } = usePortalUiPreferences(storageNamespace)
  return <ControlledPortalSettingsPanel {...props} theme={theme} density={density} onThemeChange={changeTheme} onDensityChange={changeDensity}/>
}

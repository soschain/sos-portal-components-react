'use client'
import {useEffect, useState, type ReactNode} from 'react'
import {PublicOfferingDirectory, type PublicOfferingDirectoryCopy, type PublicOfferingOption} from 'antifraud-portal-components-react/public-offering-directory'
import {readPublicOfferingCatalog, type PublicOffering, type PublicOfferingQuery} from 'antifraud-data-utils-ts/public-offering-catalog'
import {Iso3166Countries, iso3166SubdivisionsForCountry} from 'sos-data-utils-ts/iso-jurisdictions'

export type {PublicOfferingQuery} from 'antifraud-data-utils-ts/public-offering-catalog'
export type PublicOfferingDiscoveryCopy = PublicOfferingDirectoryCopy & Readonly<{loading: string; loadFailed: string; retry: string}>
export type PublicOfferingCatalogLoader = (signal: AbortSignal) => Promise<readonly PublicOffering[]>
const countryOptions = Iso3166Countries.map(item => ({value: item.code, label: item.name})).sort((a,b) => a.label.localeCompare(b.label))
export function createPublicOfferingCatalogLoader(request: (url: string, init?: RequestInit) => Promise<Response>, endpoint = '/api/public-catalog'): PublicOfferingCatalogLoader {
  return async signal => {
    const response = await request(endpoint, {signal})
    if (!response.ok) throw new Error('public_catalog_unavailable')
    return readPublicOfferingCatalog(await response.json())
  }
}

/** Shared read-only discovery state for Demo and Network. Hosts inject transport and any existing service actions. */
export function PublicOfferingDiscovery({copy, loadCatalog, sectors, categories, initialSector = '', showHeading = true, renderServices}: Readonly<{
  copy: PublicOfferingDiscoveryCopy
  loadCatalog: PublicOfferingCatalogLoader
  sectors: readonly PublicOfferingOption[]
  categories: readonly PublicOfferingOption[]
  initialSector?: string
  showHeading?: boolean
  renderServices?: (query: PublicOfferingQuery) => ReactNode
}>) {
  const [entries, setEntries] = useState<readonly PublicOffering[]>([])
  const [query, setQuery] = useState<PublicOfferingQuery>({sector: initialSector})
  const [view, setView] = useState<'grid'|'list'>('grid')
  const [status, setStatus] = useState<'loading'|'ready'|'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading'); setEntries([])
    void loadCatalog(controller.signal).then(value => {
      if (!controller.signal.aborted) {setEntries(value); setStatus('ready')}
    }, () => {if (!controller.signal.aborted) setStatus('error')})
    return () => controller.abort()
  }, [loadCatalog, attempt])
  const regions = iso3166SubdivisionsForCountry(query.country ?? '').map(item => ({value: item.code, label: item.name, country: item.countryCode}))
  const resolvedSectors = [...sectors, ...[...new Set(entries.map(item => item.sector))].filter(value => !sectors.some(item => item.value === value)).map(value => ({value, label: value}))]
  const resolvedCategories = [...categories, ...[...new Set(entries.map(item => item.category))].filter(value => !categories.some(item => item.value === value)).map(value => ({value, label: value}))]
  return <div className="space-y-5">
    {status === 'loading' ? <p role="status">{copy.loading}</p> : null}
    {status === 'error' ? <div><p role="alert">{copy.loadFailed}</p><button type="button" className="app-secondary-action" onClick={() => setAttempt(value => value + 1)}>{copy.retry}</button></div> : null}
    <PublicOfferingDirectory copy={copy} entries={entries} sectors={resolvedSectors} categories={resolvedCategories} countries={countryOptions} regions={regions} busy={status !== 'ready'}
      query={query} view={view} showHeading={showHeading} onQueryChange={setQuery} onViewChange={setView}/>
    {renderServices && (!query.category || query.category === 'healthcare-services') ? renderServices(query) : null}
  </div>
}

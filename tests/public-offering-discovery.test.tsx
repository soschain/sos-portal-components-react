// Flow contract: Demo and Network share one public discovery controller; late responses cannot replace the current catalogue and no subject grant or persistence is created.
// @vitest-environment jsdom
import React from 'react'
import {cleanup, render, screen, waitFor} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {PublicOfferingDiscovery, createPublicOfferingCatalogLoader} from '../src/PublicOfferingDiscovery.js'

afterEach(cleanup)
const copy = {title:'Data space',description:'Browse public offers',sector:'Sector',allSectors:'All sectors',category:'Category',allCategories:'All categories',country:'Country (optional)',allCountries:'All countries',region:'Region (optional)',allRegions:'All regions',query:'Search',grid:'Grid',list:'List',results:'Results',empty:'No matching offers',details:'View offers',publisher:'Publisher',seller:'Distributor',availableIn:'Available in',delivery:'Delivery',operation:'Operation',support:'Support',notSpecified:'Not specified',demo:'Demo example',website:'Visit website',offers:'Offers',loading:'Loading catalogue',loadFailed:'Catalogue could not be loaded',retry:'Retry'}
const base = {copy, sectors:[{value:'animal-care',label:'Animal health'}],categories:[{value:'devices',label:'Devices'}]}
describe('public offering discovery', () => {
  it('loads an unscoped public catalogue through the injected transport', async () => {
    const request = vi.fn(async (_url: string, _init?: RequestInit) => new Response('[]'))
    const loadCatalog = createPublicOfferingCatalogLoader(request)
    render(<PublicOfferingDiscovery {...base} loadCatalog={loadCatalog}/> )
    await waitFor(() => expect(screen.queryByText(copy.loading)).toBeNull())
    expect(request.mock.calls[0]?.[0]).toBe('/api/public-catalog')
    expect(screen.getByLabelText(copy.country).getAttribute('required')).toBeNull()
    expect(screen.getByText(copy.empty)).toBeTruthy()
  })
  it('rejects an invalid response instead of treating it as an empty catalogue', async () => {
    const loadCatalog = createPublicOfferingCatalogLoader(async () => new Response('{"verified":true}'))
    render(<PublicOfferingDiscovery {...base} loadCatalog={loadCatalog}/> )
    expect(await screen.findByRole('alert')).toHaveProperty('textContent', copy.loadFailed)
    expect(screen.getByRole('button', {name:copy.retry})).toBeTruthy()
  })
  it('ignores a failed response from a previous transport after the current feed is ready', async () => {
    let rejectPrevious!: (reason: Error) => void
    const previous = () => new Promise<readonly never[]>((_resolve, reject) => {rejectPrevious = reject})
    const current = async () => []
    const {rerender} = render(<PublicOfferingDiscovery {...base} loadCatalog={previous}/> )
    rerender(<PublicOfferingDiscovery {...base} loadCatalog={current}/> )
    await waitFor(() => expect(screen.queryByText(copy.loading)).toBeNull())
    rejectPrevious(new Error('previous_transport_failed'))
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
    expect(screen.getByText(copy.empty)).toBeTruthy()
  })
})

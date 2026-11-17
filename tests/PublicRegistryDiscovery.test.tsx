// Flow contract: both portal audiences inject the same public source search; location is opt-in and ephemeral; permission failure preserves manual search and a failed search never presents stale results.
// @vitest-environment jsdom
import React from 'react'
import {describe,it,expect,vi} from 'vitest'
import {render,screen,fireEvent,cleanup} from '@testing-library/react'
import {afterEach} from 'vitest'
import {PublicRegistryDiscovery,createPublicRegistrySearch} from '../src/PublicRegistryDiscovery.js'
const copy={title:'Real clinics',description:'Official listings',address:'Address',municipality:'Municipality',postalCode:'Postal code',identifier:'NIF',query:'Text',search:'Search',searching:'Searching',location:'Use my location',clearLocation:'Clear location',radius:'Radius',nearbyActive:'Location enabled',source:'Source',registration:'Registration',missingName:'Name unavailable',noActions:'Discovery only',empty:'No matches',limit:'Limited',distance:'km in a straight line',unlocated:'Unknown coordinates',nearbyUnavailable:'Location search unavailable',locationFailed:'Location permission unavailable; use manual search.',searchFailed:'The official source is unavailable.'}
afterEach(cleanup)
describe('shared registry discovery',()=>{
 it('uses location only after an explicit request, applies the radius and clears the origin',async()=>{
  const locate=vi.fn(async()=>({latitude:40,longitude:-3}))
  const search=vi.fn(async()=>({entries:[],total:0,nearbyAvailable:true,unlocatedCount:0}))
  render(<PublicRegistryDiscovery copy={copy} search={search} locate={locate}/>)
  expect(locate).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button',{name:copy.location}))
  await screen.findByText(copy.nearbyActive)
  fireEvent.change(screen.getByLabelText(copy.radius),{target:{value:'10'}})
  fireEvent.click(screen.getByRole('button',{name:copy.search}))
  await screen.findByText(copy.empty)
  expect(search).toHaveBeenLastCalledWith({near:{latitude:40,longitude:-3,radiusKm:10}})
  fireEvent.click(screen.getByRole('button',{name:copy.clearLocation}))
  fireEvent.click(screen.getByRole('button',{name:copy.search}))
  await screen.findByText(copy.empty)
  expect(search).toHaveBeenLastCalledWith({})
 })
 it('keeps manual search available after location denial and clears failed results',async()=>{
  const search=vi.fn().mockResolvedValueOnce({entries:[],total:0,nearbyAvailable:false,unlocatedCount:0}).mockRejectedValueOnce(new Error('private upstream details'))
  render(<PublicRegistryDiscovery copy={copy} search={search} locate={async()=>{throw new Error('denied')}} />)
  fireEvent.click(screen.getByRole('button',{name:copy.location}))
  await screen.findByText(copy.locationFailed)
  fireEvent.click(screen.getByRole('button',{name:copy.search}))
  await screen.findByText(copy.empty)
  fireEvent.click(screen.getByRole('button',{name:copy.search}))
  await screen.findByText(copy.searchFailed)
  expect(screen.queryByText(copy.empty)).toBeNull()
 })
 it('serializes nearby and exact identifier filters without storage or a paid provider',async()=>{
  const request=vi.fn(async(_url:string,_init?:RequestInit)=>new Response(JSON.stringify({entries:[],total:0,nearbyAvailable:true,unlocatedCount:0})))
  const search=createPublicRegistrySearch(request)
  await search({address:'Example',municipality:'Example municipality',identifier:'SYNTHETIC-ID',near:{latitude:40,longitude:-3,radiusKm:5}})
  const url=new URL(request.mock.calls[0]![0],'https://example.invalid')
  expect(url.searchParams.get('identifier')).toBe('SYNTHETIC-ID')
  expect(url.searchParams.get('radiusKm')).toBe('5')
  expect(request.mock.calls[0]![1]?.cache).toBe('no-store')
 })
})

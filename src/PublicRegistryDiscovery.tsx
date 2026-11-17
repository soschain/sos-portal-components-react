'use client'
import React,{useEffect,useRef,useState} from 'react'
import {PublicRegistryDirectory,type PublicRegistryDirectoryCopy,type PublicRegistryDirectoryProps} from 'antifraud-common-components-react'

type Query=PublicRegistryDirectoryProps['query']
type Result=NonNullable<PublicRegistryDirectoryProps['result']>
export type PublicRegistryDiscoveryCopy=PublicRegistryDirectoryCopy & Readonly<{locationFailed:string;searchFailed:string}>
export type PublicRegistrySearch=(query:Query)=>Promise<Result>

export function createPublicRegistrySearch(request:(url:string,init?:RequestInit)=>Promise<Response>,endpoint='/api/clinic-directory'):PublicRegistrySearch {
  return async query=>{
    const params=new URLSearchParams()
    for(const key of ['query','address','municipality','postalCode','identifier'] as const){if(query[key]?.trim())params.set(key,query[key]!.trim())}
    if(query.near){for(const key of ['latitude','longitude','radiusKm'] as const)params.set(key,String(query.near[key]))}
    const response=await request(`${endpoint}?${params}`,{cache:'no-store',referrerPolicy:'no-referrer'})
    const body=await response.json()
    if(!response.ok)throw new Error(body.error==='registry_coordinates_unavailable'?'registry_coordinates_unavailable':'registry_source_unavailable')
    if(!Array.isArray(body.entries)||!Number.isInteger(body.total)||typeof body.nearbyAvailable!=='boolean')throw new Error('registry_response_invalid')
    return body as Result
  }
}

/** One workflow for Personal and Professional; the host injects authenticated transport in every mode. */
export function PublicRegistryDiscovery({copy,search,locate=browserLocation}:Readonly<{
  copy:PublicRegistryDiscoveryCopy;search:PublicRegistrySearch
  locate?:()=>Promise<{latitude:number;longitude:number}>
}>){
  const [query,setQuery]=useState<Query>({}),[result,setResult]=useState<Result>(),[busy,setBusy]=useState(false),[error,setError]=useState('')
  const operation=useRef(0)
  useEffect(()=>()=>{operation.current++},[])
  async function run(){
    const current=++operation.current;setBusy(true);setError('');setResult(undefined)
    try{const next=await search(query);if(current===operation.current)setResult(next)}
    catch(reason){if(current===operation.current)setError(reason instanceof Error&&reason.message==='registry_coordinates_unavailable'?copy.nearbyUnavailable:copy.searchFailed)}
    finally{if(current===operation.current)setBusy(false)}
  }
  async function requestLocation(){
    const current=++operation.current;setBusy(true);setError('')
    try{const point=await locate();if(current===operation.current)setQuery(previous=>({...previous,near:{...point,radiusKm:5}}))}
    catch{if(current===operation.current)setError(copy.locationFailed)}
    finally{if(current===operation.current)setBusy(false)}
  }
  return <PublicRegistryDirectory copy={copy} query={query} {...(result?{result}:{})} busy={busy} error={error} onQueryChange={setQuery} onSearch={()=>void run()} onRequestLocation={()=>void requestLocation()} onClearLocation={()=>{setQuery(previous=>{const {near,...manual}=previous;return manual});setError('');setResult(undefined)}}/>
}
function browserLocation():Promise<{latitude:number;longitude:number}>{
  return new Promise((resolve,reject)=>{
    if(typeof navigator==='undefined'||!navigator.geolocation){reject(new Error('location_unavailable'));return}
    navigator.geolocation.getCurrentPosition(position=>resolve({latitude:position.coords.latitude,longitude:position.coords.longitude}),reject,{enableHighAccuracy:false,timeout:10_000,maximumAge:60_000})
  })
}

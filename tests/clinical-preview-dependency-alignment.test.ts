// Flow contract: the shared native clinical preview resolves the reviewed FHIR 0.8.1 and SOS Data 0.8.7 owners from its own package boundary, rather than silently using older nested renderer contracts. This is dependency coherence, not browser or registry-release proof.
import {readFileSync,existsSync} from 'node:fs'
import {dirname,join} from 'node:path'
import {createRequire} from 'node:module'
import {expect,it} from 'vitest'

const expected={'fhir-data-utils-ts':'0.8.1','sos-data-utils-ts':'0.8.7'} as const
const read=(file:string)=>JSON.parse(readFileSync(file,'utf8').replace(/^\uFEFF/u,''))

it('declares the current clinical preview owners without older exact dependency pins',()=>{
 const manifest=read(join(process.cwd(),'package.json'))
 for(const[name,version]of Object.entries(expected))expect(manifest.dependencies[name]).toBe(version)
})

it('locks the same current clinical owners and the SOS Data FHIR edge',()=>{
 const lock=read(join(process.cwd(),'package-lock.json'))
 for(const[name,version]of Object.entries(expected)){
  expect(lock.packages[''].dependencies[name]).toBe(version)
  expect(lock.packages['node_modules/'+name].version).toBe(version)
 }
 expect(lock.packages['node_modules/sos-data-utils-ts'].dependencies['fhir-data-utils-ts']).toBe(expected['fhir-data-utils-ts'])
})

it('resolves the preview package own actual FHIR and Data modules to the declared owner identities',()=>{
 const resolve=createRequire(join(process.cwd(),'package.json'))
 for(const[name,version]of Object.entries(expected)){
  let directory=dirname(resolve.resolve(name))
  while(!existsSync(join(directory,'package.json'))){const parent=dirname(directory);if(parent===directory)throw Error('owned_package_metadata_missing');directory=parent}
  const manifest=read(join(directory,'package.json'))
  expect({name:manifest.name,version:manifest.version}).toEqual({name,version})
 }
})

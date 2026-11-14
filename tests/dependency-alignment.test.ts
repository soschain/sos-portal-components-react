// Flow contract: the current shared journey renderer declares the same SOS Data version as its reviewed runtime instead of reinstalling an older nested contract catalog.
import {readFileSync, existsSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {createRequire} from 'node:module'
import {expect, it} from 'vitest'

it('declares the reviewed SOS Data runtime dependency', () => {
  const manifest = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'))
  expect(manifest.dependencies['sos-data-utils-ts']).toBe('0.6.35')
})

it('resolves the active SOS Data contract catalog to the reviewed version', () => {
  const resolve = createRequire(join(process.cwd(), 'package.json'))
  let directory = dirname(resolve.resolve('sos-data-utils-ts'))
  while (!existsSync(join(directory, 'package.json'))) directory = dirname(directory)
  const active = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'))
  expect({name: active.name, version: active.version}).toEqual({name: 'sos-data-utils-ts', version: '0.6.35'})
})

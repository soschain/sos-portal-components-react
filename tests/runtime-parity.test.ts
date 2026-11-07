// Flow contract: one shared presentation renders the same use-case state in Demo, Test Network, web and Expo and never owns a persistence adapter.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('shared UI runtime parity', () => {
  it('keeps README, AGENTS and skill synchronized', () => {
    const root = process.cwd()
    const contract = [
      'README.md',
      'AGENTS.md',
      '.codex/skills/preserve-demo-test-network-adapter-parity/SKILL.md',
    ].map(path => readFileSync(join(root, path), 'utf8')).join('\n')
    expect(contract).toMatch(/same use-case state.*Demo.*Test Network.*Expo/is)
    expect(contract).toMatch(/never.*(select|import).*persistence/is)
    expect(contract).toMatch(/Expo SQLite/is)
  })
})

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
      'docs/DEVELOPER_UPDATE_2026-11-06.md',
    ].map(path => readFileSync(join(root, path), 'utf8')).join('\n')
    expect(contract).toMatch(/same use-case state.*Demo.*Test Network.*Expo/is)
    expect(contract).toMatch(/never.*(select|import).*persistence/is)
    expect(contract).toMatch(/Expo SQLite/is)
    expect(contract).toMatch(/all-local[\s\S]*does not[\s\S]*(start|require)[\s\S]*Chat/is)
    expect(contract).toMatch(/dedicated RTC/is)
    expect(contract).toMatch(/unanswered audio[\s\S]*Communication/is)
  })
})

// Flow contract: one controlled contact-card directory distinguishes controller from emergency recipient, renders primary priority, and delegates add/remove/priority changes to the authorized host without selecting persistence or granting access.
// @vitest-environment jsdom
import React from 'react'
import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {SOSCHAIN_PERSONAL_DEMO_HOUSEHOLD,SOSCHAIN_PERSONAL_DEMO_STORIES,SoschainPersonalDemoSubjectIds} from 'sos-data-utils-ts/portal-demo-fixtures'
import {EmergencyContactCardDirectory} from '../src/EmergencyContactCardDirectory.js'

afterEach(cleanup)
const self=SOSCHAIN_PERSONAL_DEMO_HOUSEHOLD.find(card=>card.id===SoschainPersonalDemoSubjectIds.Self)!
const partner=SOSCHAIN_PERSONAL_DEMO_HOUSEHOLD.find(card=>card.id===SoschainPersonalDemoSubjectIds.Partner)!
const contacts=SOSCHAIN_PERSONAL_DEMO_STORIES[SoschainPersonalDemoSubjectIds.Animal].contacts
const copy={title:'Emergency contacts',controller:'Card controller',contactCard:'Contact card',add:'Add contact',remove:'Remove contact',makePrimary:'Make primary',primary:'Primary emergency contact',empty:'No emergency contacts',noCandidates:'No other authorized contact cards are available',authority:'Contact changes do not change controller authority or grant health-data access.'}

it('renders primary contacts and delegates independent removal and priority changes',()=>{
  const onRemove=vi.fn(),onMakePrimary=vi.fn(),onAdd=vi.fn()
  render(<EmergencyContactCardDirectory copy={copy} contacts={contacts} candidates={[]} controllerLabel={self.nickname} onAdd={onAdd} onRemove={onRemove} onMakePrimary={onMakePrimary}/>)
  expect(screen.getByText(copy.primary)).toBeTruthy()
  expect(screen.getByText(copy.authority)).toBeTruthy()
  fireEvent.click(screen.getAllByRole('button',{name:copy.remove})[0]!)
  expect(onRemove).toHaveBeenCalledWith(contacts[0]!.contactId)
  fireEvent.click(screen.getByRole('button',{name:copy.makePrimary}))
  expect(onMakePrimary).toHaveBeenCalledWith(contacts[1]!.contactId)
  expect(onAdd).not.toHaveBeenCalled()
})

it('adds an explicitly selected authorized card and keeps controls closed while saving',()=>{
  const onAdd=vi.fn(),props={copy,contacts:[],candidates:[{uhcId:partner.uhcId,nickname:partner.nickname}],controllerLabel:self.nickname,onAdd,onRemove:vi.fn(),onMakePrimary:vi.fn()}
  const view=render(<EmergencyContactCardDirectory {...props}/>)
  fireEvent.change(screen.getByLabelText(copy.contactCard),{target:{value:partner.uhcId}})
  fireEvent.click(screen.getByRole('button',{name:copy.add}))
  expect(onAdd).toHaveBeenCalledWith(partner.uhcId)
  view.rerender(<EmergencyContactCardDirectory {...props} busy/>)
  expect((screen.getByRole('button',{name:copy.add}) as HTMLButtonElement).disabled).toBe(true)
})

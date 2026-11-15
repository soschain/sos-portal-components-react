// @vitest-environment jsdom
// The host supplies publishing authority and audiences; the browser never invents recipients.
import React from 'react'
import {cleanup,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
afterEach(cleanup)
const loadOwnedLeaf=(path:string)=>import(/* @vite-ignore */ path)

it('offers only host-authorized audiences without direct recipient-address fields',async()=>{
  const {NotificationComposer}=await loadOwnedLeaf('../src/care/NotificationComposer.js')
  render(<NotificationComposer audiences={[{id:'authorized',label:'Authorized care audience',audience:{mode:'public-dataset',datasetName:'host-authorized-dataset'}}]} copy={{title:'Notification',audience:'Audience',subject:'Subject',bodyMarkdown:'Message',preview:'Preview',attachments:'Attachments',addAttachments:'Add documents',removeAttachment:'Remove',send:'Send',sending:'Sending',sent:'Sent',unsupportedAttachment:'Unsupported document',attachmentUploadFailed:'Upload failed',sendFailed:'Send failed'}} uploadAttachment={vi.fn()} onSubmit={vi.fn()}/> )
  expect(screen.getByRole('option',{name:'Authorized care audience'})).toBeTruthy()
  expect(screen.queryByRole('textbox',{name:/recipient|email|telephone/i})).toBeNull()
  expect(screen.getAllByRole('option')).toHaveLength(1)
})

it('refuses missing protected-profile proof before any notification transport runs',async()=>{
  const {createPublicNotificationBffClient}=await loadOwnedLeaf('../src/care/notification-bff-client.js')
  const authorizedFetch=vi.fn()
  expect(()=>createPublicNotificationBffClient({authorizedFetch,profileProof:{profileId:'',profileSessionToken:'host-session'}})).toThrow('profile_id_required')
  expect(()=>createPublicNotificationBffClient({authorizedFetch,profileProof:{profileId:'host-profile',profileSessionToken:''}})).toThrow('wallet_session_required')
  expect(authorizedFetch).not.toHaveBeenCalled()
})

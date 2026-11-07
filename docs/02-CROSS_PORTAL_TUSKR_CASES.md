# 02 — Cross-portal Tuskr cases

Use [01 — Portal modes and authentication](01-PORTAL_MODES_AND_AUTH.md) as
the precondition for every case. The stable `SOS-PORTAL-001`–`029` IDs remain
in the [README catalogue](../README.md#tuskr-use-case-catalogue). The grouped
journeys below give Tuskr steps, expected results and rejection checks; keep
the existing ID and add the scenario/variant to the Tuskr case title.

## 1. Execution record and matrix

Every execution records case ID/variant, exact revisions and registry package
versions, configured flavour, subject kind, sector, role, access path,
adapter, two browser/account contexts, viewport/theme, prerequisites, steps,
expected and observed results, sanitized evidence and cleanup result. No
credential, OTP, token, signing key, clear destination or personal record
belongs in Tuskr or screenshots.

| Dimension | Required applicable variants |
| --- | --- |
| Access path | BFF-only Demo; separate full-lifecycle Test Network; Production only under its own approved acceptance process |
| Execution | All-local with memory; dev:staging with configured remote boundaries; deployed acceptance when that revision is deployed |
| Subject/sector | Human health; animal care; mixed subject/public-safety emergency response; other configured sectors where the feature applies |
| Professional profile | Doctor; veterinarian; authorized nurse/assistant; police officer; lifeguard/other responder; administrative read-only; Organization controller |
| Accounts | Distinct Personal recipient and Professional caller; same account with separate protected profiles; unrelated account as an attacker |
| Surface | Desktop/light and mobile/dark; keyboard/screen-reader checks; Expo Android/iOS only when its adapter is implemented |

Public Demo uses real email account login. Private automated/operator tests
may use configured Firebase test-phone fixtures from ignored files, including
Test Network authentication where profile/evidence prerequisites are met.
Phone authentication does not provide the verified-email claim required by
the CH Organization/employee endpoints. The online real-email OTP variant
waits for the operator's owned email and ignored approved mailbox-access
configuration. Do not add a phone-to-email association feature as a shortcut.
A telephone
does not select a role. A reserved flavour or Expo target is marked
not executable until its launcher/adapter exists; do not mark an absent
variant passed or silently substitute another brand/sector.

Prepare reusable prerequisites once per run where safe. Never combine Demo
and Test Network records or treat one route's login as the other's profile
grant. Cases below are acceptance specifications, not a claim that they have
already passed.

### 1.1 Dependency preconditions and progression

Use the dependency table in
[01, section 1.1](01-PORTAL_MODES_AND_AUTH.md#11-start-dependencies-for-the-case-being-tested).
Record which row a case uses before starting processes:

- Sections 2, 3 and the BFF-only Demo variants of 5/12 start with UI/BFF,
  the required test authentication and the shared memory vault. They do not
  start GW, Terminology or LiveKit merely to render and edit synthetic state.
- Section 10 adds Terminology when authoring/coding or testing the BFF cache.
  Warm and read that cache through the terminology SDK; missing required
  provider data fails this case. Viewing an already persisted Bundle or
  testing an unrelated section does not automatically need Terminology.
- Sections 7–9 add LiveKit for an actual call. Message/thread checks that do
  not open media need only their Communication persistence boundary. LiveKit
  does not imply GW, Terminology, Chat or either assistant in Demo.
- Section 4 and other network-authority variants first prove the applicable
  UI -> BFF -> SDK -> GW journey with `networkKind=test` and memory, then
  repeat against local Fabric `local-network`, then the selected configured
  flavours in `dev:staging` Test Network with online services.

The Demo path remains BFF-only at every stage and has no GW Organization
bootstrap prerequisite. Do not merge its result with the organization and
employee lifecycle gate. Clinical coding and call tests add their dependencies
independently; only a case explicitly exercising both requires both.

Retain successful predecessor evidence. On a failure rerun the failed gate
and smallest affected tests; rerun a predecessor only when its changed
boundary or expired state requires it. Before a release, verify the cumulative
affected gate set rather than assuming one narrow rerun proves every case.

## 2. Entry, shell, account and protected profiles

IDs: `SOS-PORTAL-001`, `002`, `003`, `004`, `005`, `024`, `026`, `027`.

1. Open each owning portal through its normal configured entry. Select the
   enabled access path, authenticate and accept the applicable terms.
2. Open the account/profile menu; choose and unlock an existing permitted
   profile, using passkey/biometrics when supported or the governed PIN path.
3. Change theme/text size/locale, navigate, reload and restore that exact
   account/profile. Repeat by keyboard and with the mobile layout.
4. Switch the same account between Organization controller and employee
   profiles, then between two employee assignments. Open a second isolated
   browser for the corresponding Personal profile.

Expected: the common shell and tab architecture persist; profile-specific
capabilities change only after BFF confirmation. Separate profile grants,
device protection, organization, role and access path remain visible and
cannot leak into another profile.

Negative checks: cancellation of required user-verifying enrollment keeps the
profile locked; wrong PIN, expired/replayed grant, foreign profile id and an
unrelated account fail closed. A fixed test-phone login is never offered to
public visitors. Login alone does not create employee or subject authority.
Recovery revokes the prior protected/device state according to its contract.

## 3. Demo setup and reset across two browsers

IDs: `SOS-PORTAL-003`, `005`, `006`, `007`, `027`.

1. Authenticate Personal and Professional using the selected test identity
   mode. Open Demo and unlock their BFF-validated synthetic profiles.
2. Create/load a synthetic household, select a human/animal card and copy or
   scan its generated locator in the Professional portal.
3. Resolve the same card and verify the synthetic organization, sector,
   professional role and allowed card sections.
4. Reload both portals, perform a permitted edit and verify shared readback.
5. Reset or expire the Personal Demo generation; retry the old card locator
   and reopen the old Professional view.

Expected: all business state uses BFF-owned Confidential Storage. No GW tenant
bootstrap, GW business write or unsigned synthetic GW bearer is used. Real
email identity does not make synthetic roles authoritative. Reset invalidates
the former locators/sessions according to policy and leaves other generations
and Test Network/Production unchanged.

Negative checks: reject another ecosystem/host namespace, forged sector/role,
expired generation and an unregistered card. The test must detect attempted
GW business traffic rather than accepting it as Demo success. Two separate
unshared process-local stores do not satisfy the shared-readback assertion.

## 4. Test Network organization and workforce lifecycle

IDs: `SOS-PORTAL-005`, `019`, `023`, `028`.

Precondition: the chosen authenticated account supplies the profile evidence
required by the actual Organization/employee endpoints, including verified
email. For the online real-email OTP variant the operator supplies the owned
email and approved mailbox-access configuration in ignored files. Keep the
full online lifecycle blocked/not executed until those prerequisites are
resolved. A valid Firebase test-phone session proves authentication, not
missing email verification or authority. Local Auth-emulator fixtures may
carry explicit verified-email test claims, but do not prove cloud email
verification. Do not invent a mailbox service, add an account-association
feature as a workaround, or count a skipped lifecycle as release evidence.

1. Authenticate the synthetic applicant, protect its controller wallet and
   register the permitted `animal-tech` or `health-tech` organization under
   the configured host's Test Network policy.
2. Complete reviewed admission, the existing `_transaction`/Offer/Order
   continuation, activation and authoritative Organization readback.
3. Complete required seat/licence purchase; invite the employee and accept
   under the intended account. Activate veterinarian or doctor, register the
   independent device and unlock its protected profile.
4. Confirm the employee's exact group/service assignment and applicable
   subject authorization. Add police/lifeguard variants only where enabled
   by the configured Test Network catalogue.
5. Suspend/revoke the employee, group assignment, licence or device; retry a
   previously permitted operation from an already open browser.

Expected: each lifecycle stage has BFF/SDK/GW readback before continuing;
controller governance composes the Antifraud Hosting/controller UI. The same
account may own distinct controller and employee profiles without merging
their grants. Employee suspension/revocation removes effective access.

Negative checks: a selected role, invitation notice, purchased seat or
`-tech` admission alone does not authorize a clinical write. Retry after an
injected post-write failure returns the same object instead of a duplicate.
An unrelated employee cannot accept the invitation or reopen the controller
wallet. No legacy ICA flow is introduced to bypass missing current evidence.

## 5. Card identity, related entities, contacts and members

IDs: `SOS-PORTAL-006`, `007`, `008`, `009`, `010`, `020`, `023`.

1. Personal discovers the configured provider, creates/recovers a card and
   reloads the stable identifier under its protected controller profile.
2. Update permitted identity fields and add an authorized related entity and
   emergency contact with explicit relationship, priority and availability.
3. Invite a member/delegate. In the second account accept the invitation,
   reload the permitted card and confirm its effective scope.
4. Professional resolves the card by locator and sees only the identity,
   contacts and sections permitted by its acting profile.
5. Suspend, reactivate and revoke the member; reload both portals after each
   transition and after a new login.

Expected: immutable identifiers/provenance survive edits, lifecycle state
matches in both views, and changing contacts is independent from granting
clinical or thread access. Provider failures remain visible, not empty
successful directories.

Negative checks: reject foreign owner/profile ids, forged locator/provider,
unaccepted membership, direct URLs to hidden sections and revoked delegates.
Ordinary contact membership does not grant authority to read a private child
thread. Emergency-only disclosure is not an unrestricted identity directory.

## 6. Cross-portal messages, attachments and data-index updates

IDs: `SOS-PORTAL-012`, `022`, `027`, `029`.

1. Select an authorized card and open its service/Organization root channel
   in both portals. Send a message from the permitted Professional context.
2. Repeat with supported Bundle/clinical document, SHC, ICS, image and audio
   attachments; open each through its authorized handler.
3. Send a provider index-update Communication with the governed client/patient
   portal link. Reload Personal and open that link under its own access rules.
4. Submit the supported clinical-document/IPS request and read its correlated
   response. Refresh/reload both histories and compare identifiers/order.

Expected: one Communication representation drives the shared chat adapter;
the provider update belongs to that provider's channel, not a fabricated
parallel chat message. Both portals retain the exact thread, sender,
recipient, attachment metadata and permitted provenance.

Negative checks: reject invalid/unauthorized attachments, unsafe links,
foreign subject/thread ids and attempts to read provider content without its
own authorization. No raw credentials, RTC grants, private keys or clear
destinations enter a Communication or browser log. Request and response share
the requester `thid`, while message id/JTI remains unique; parent `pthid`
must not replace asynchronous request/response correlation.

## 7. Completed audio and video calls

IDs: `SOS-PORTAL-010`, `012`, `013`, `029`.

1. Keep the Personal recipient signed in with the selected card open. In the
   other browser use the authorized Professional card/contact action.
2. Start an audio call; observe the incoming indication and answer in Personal.
3. Confirm both participants joined the dedicated RTC room and actual media
   is sent/received. End the call and reload both Communications histories.
4. Repeat as a video call on desktop/light and mobile/dark.

Expected: BFF-issued grants bind the exact call and participant. Both
histories show the same received/completed result in their appropriate
incoming/outgoing projection. The RTC provider carries media; persisted
Communications carry the call events.

Negative checks: a visible call panel, successful grant response or room with
one participant is not two-way media proof. Reject a forged participant,
expired grant, foreign subject/call and revoked professional/device. Demo
stays BFF-only for business persistence even when RTC is online; Test Network
uses its real authority and GW history boundary. Chat/assistants stay off.

## 8. Declined, cancelled, missed calls and unanswered audio

IDs: `SOS-PORTAL-012`, `013`, `027`.

1. Ring Personal and decline before opening media. Verify `declined` in both
   histories, then reload.
2. Start another call and cancel from the caller while ringing. Verify
   `cancelled`, distinct from decline and timeout.
3. Let another call ring until its defined timeout. Verify `missed` in both
   histories and that media/ringing resources are released.
4. Where the host enables unanswered audio, attach a permitted audio message
   to that missed-call event, reload and play it as the authorized recipient.

Expected: each terminal event has stable identity and readback; refresh/retry
does not duplicate it. An accepted call ends as completed. Unanswered audio
remains governed by the call/channel and does not create an assistant session.

Negative checks: reject unanswered audio on an incompatible call state,
invalid media type/length or unauthorized reader. Retry/end requests must
not silently rewrite a terminal outcome or append contradictory duplicates.

## 9. Relationship child threads and emergency response

IDs: `SOS-PORTAL-009`, `010`, `011`, `013`, `021`, `029`.

1. Personal opens the card's root channel, then a permitted member or
   emergency-contact child thread. Confirm its relationship and participants.
2. Professional opens the same child thread only with separately confirmed
   professional subject/relationship scope. Send a message and repeat call
   outcomes from sections 7–8 for that exact recipient.
3. Create or acknowledge an emergency Encounter/triage action, continue the
   assigned care journey and, when permitted, request exceptional access with
   reason and expiry. Reload the audit and current access projection.

Expected: the child retains stable parent `pthid`, relationship and subject
identity. Personal and Professional see only their permitted thread content.
Call/triage actions do not finalize a clinical document or grant new access.

Negative checks: merely being an emergency contact cannot enumerate/open
threads. Deny another member's thread, unrelated police/lifeguard scope,
expired exceptional access and revoked relationships. Root-channel controller
call evidence does not close this child-thread test.

## 10. Clinical viewer, editor, sections and credentials

IDs: `SOS-PORTAL-007`, `008`, `011`, `015`, `016`, `017`, `018`.

1. Open the same authorized human/animal card in both portals. Read the IPS or
   clinical document with sections, referenced resources and provenance.
2. As the enabled doctor/veterinarian, create a draft document; add/edit
   permitted sections, encounter context and a coded vaccination/observation.
3. Complete required review/attestation and persist through the normal
   BFF/SDK boundary. Reload and compare the Personal and Professional views.
4. Issue/display/scan the supported SHC or other explicitly supported
   credential and QR transport; verify the expected issuer/subject/proof.

Expected: all configured flavours compose the same section-based editor and
viewer with sector extensions and explicit role policy. Draft authorship,
review, final publication and credential issuance are separate operations.
Signing/verification remains outside React. Terminology starts only when the
case needs coding; viewing a persisted document need not start its database.

Negative checks: reject administrative, police/lifeguard and read-only assistant
clinical writes; mismatched subject, invalid section/resource and unauthorized
attester fail closed. A Demo credential is explicitly synthetic and never
presented as a production health/data credential. Detached or post-quantum QR
support is tested only against its versioned transport contract, not inferred
from rendering a QR image.

## 11. Appointments, services, blood donation and Encounter continuity

IDs: `SOS-PORTAL-011`, `014`, `023`, `028`.

1. Professional/controller configures the permitted department, Service,
   Place, availability and capacity. Personal selects the authorized provider
   and books the offered slot; repeat a blood-donation/service variant.
2. Reschedule/cancel and verify both views. Race two bookings for the last
   available capacity and verify the authoritative outcome.
3. Fulfil an appointment and create/open the corresponding Encounter. Follow
   authorized child Service/Place encounters and notify the Personal channel.

Expected: identity, booking, capacity, membership and clinical authority stay
separate. Personal and Professional agree on the appointment's current state;
Encounter contributions identify the exact actor and service context.

Negative checks: reject overbooking, stale slot state, foreign booking ids,
unauthorized service edits and a browser-supplied provider route. A shared
Location or department label does not authorize all services at that location.

## 12. Permissions and Organization-controller composition

IDs: `SOS-PORTAL-018`, `019`, `020`, `028`.

1. Open Management as the exact Organization controller and compose the
   Antifraud controller/hosting group, department, workforce and device UI.
2. Change the permitted group assignment/authorization. Independently obtain
   subject/controller permission when the action requires it.
3. In the employee and Personal browsers, reload and retry the relevant action.
4. Revoke the group assignment or subject permission and repeat the request
   from a previously authorized session.

Expected: management uses the shared neutral owner implementation; employee
membership and subject authorization remain independent. Notifications are
Communications, not proof of permission. Controller access embedded in CH is
explicit while supported and is not copied into flavour-specific controllers.

Negative checks: deny employee-to-controller escalation, another tenant's
group edits, unaccepted permissions and stale sessions after revocation.
Host/tenant administration remains scoped to the configured data space;
unrelated portal branding is not an authority boundary.

## 13. Specialist research studies and research subjects

Existing IDs: `HEALTH-RESEARCH-001`–`005`; related base IDs `SOS-PORTAL-015`,
`018`, `022`, `028`.

1. As the separately authorized study controller, create/edit a ResearchStudy,
   invite the intended organization/participant and activate its membership.
2. Discover eligible ResearchSubjects, establish the permitted secondary-use
   context and import/map/review staged data through its specialist adapter.
3. Read the allowed study/subject projection in the appropriate portal and
   channel. Revoke study or participant access and verify denial on reload.

Expected: existing research functionality remains in UHC components/host
adapters pending a deliberate future specialist or animal-care package move.
It is tracked in Tuskr without placing research/genomics into the SOS base.
Animal-first validation does not define a permanent human-health dependency.

Negative checks: ordinary care access, study discovery or a researcher label
does not grant study data, subject identity or clinical authorship. Retain
anonymization, mapping/provenance, review and publication boundaries. Unbuilt
genomics or edge-model workflows remain explicit targets, not passed cases.

## 14. Expo reuse, failure recovery and execution closure

IDs: `SOS-PORTAL-024`, `025`, `026`, `027`.

1. Repeat an implemented card/conversation/action contract through the web
   adapter and applicable Expo Android/iOS adapter using the same use-case
   data and authorization decisions. Inject Expo SQLite for native custody.
2. Test microphone/camera permission denial, interrupted network, provider
   failure and expired profile/grant; retry after restoring the prerequisite.
3. Confirm rollback/idempotent readback, meaningful errors and no duplicate
   card/member/Communication. Log out and verify protected state is closed.
4. Attach sanitized evidence and exact environment to Tuskr, record cleanup,
   and keep failed/blocked/not-executable variants separate from passed cases.

Expected: platform adapters supply native capabilities without new business
DTOs, hidden storage selectors or duplicate conversation state. Rerun the
smallest failed gate; rerun a predecessor when its state/boundary changed.
Legacy compatibility remains separately runnable and never substitutes for
the active Personal ↔ Professional journey.

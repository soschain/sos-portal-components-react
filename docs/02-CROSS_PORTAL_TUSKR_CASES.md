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
Phone authentication does not provide the verified-email claim currently
required by the CH Organization/employee endpoints. The selected automated
journey uses simulated phones without a mailbox; migrate that email-only
contract rather than requesting mailbox access or inventing email claims.
Do not add a phone-to-email association feature as a shortcut.
A telephone
does not select a role. A reserved flavour or Expo target is marked
not executable until its launcher/adapter exists; do not mark an absent
variant passed or silently substitute another brand/sector.

Prepare reusable prerequisites once per run where safe. Never combine Demo
and Test Network records or treat one route's login as the other's profile
grant. Cases below are acceptance specifications, not a claim that they have
already passed.

### Shared UI placement and device preferences

Apply these checks to `SOS-PORTAL-001` and `026` in every configured flavour,
Personal/Professional surface and Demo/Test Network variant:

- Primary navigation precedes workspace content. The selected subject's
  compact summary owns Change card and a collapsed View card. The change
  control is compact; the initial directory, when no subject is selected,
  lives below the Cards tab. Do not duplicate the directory above navigation.
- Account and device Preferences use the same shared person-menu component.
  Subject-specific telephone-device authorization belongs to that subject's
  card and requires its independent BFF grant; it is not an account preference.
- Navigation/selected options are blue, positive mutations green, destructive
  actions red and warnings amber, independently of branding and network mode.
- Device preferences distinguish user enablement, runtime availability and
  model preparation. Show speech-to-text and language-model capabilities,
  their real status and a disabled reason when unavailable. Do not infer
  readiness from a checkbox, silently download a model or treat device settings
  as a microphone permission, subject grant or assistant authorization.
- Appearance and text size use the same device preference namespace on the
  menu and Preferences page and survive reload/navigation between modes.
- Real Management subtabs select a task. Sections inside each selected subtab
  are independently collapsible; these are distinct levels of navigation.

Health (`SOS-PORTAL-015`, `016` and the clinical variants below) starts with document
creation for authorized writers and a collapsed IPS. Supported sections open
the shared section-based editor. Folding a draft retains it; replacing a draft
with another section's document requires an explicit discard decision.
These are acceptance requirements, not a declaration that every adapter has
already implemented model controls or passed its browser variant.

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

Precondition: verified official phone OR email must be checked against the
exact authoritative source. Current CH Organization/employee endpoints still
require verified email, which blocks the selected phone-only online journey.
Keep it unexecuted until that contract is migrated; no mailbox is required
for this selected test. A valid Firebase test-phone session proves account
authentication, not organization, employee or subject authority. Local
Auth-emulator fixtures may carry explicit synthetic verified-email claims to
isolate an existing policy test, but do not prove cloud email verification or
the phone-only lifecycle. Do not invent email claims, a mailbox service,
account-association features or GW/DID changes to hide missing authority.

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

The controller/root-channel RTC case below is a media subcase. Full emergency
acceptance additionally requires the created-card, recipient and Encounter
journey in section 15; a preloaded card or an already selected controller
cannot replace those steps.

IDs: `SOS-PORTAL-010`, `012`, `013`, `029`.

1. Keep the Personal recipient signed in with the selected card open. In the
   other browser use the authorized Professional card/contact action.
2. Start an audio call; observe the incoming indication and answer in Personal.
3. Confirm both participants joined the dedicated RTC room and actual media
   is sent/received. Hang up on one side only. The other side closes media
   automatically and both sides release microphone/camera tracks. Reload both
   Communications histories; do not require a second manual hangup.
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

## 15. Created household → emergency contact → Encounter → handover

IDs: `SOS-PORTAL-006`, `009`, `010`, `011`, `012`, `013`, `018`, `021`,
`023`, `029`. Use scenario suffixes on these existing IDs in Tuskr.

This is the complete manual and automated acceptance journey. Its initial
implementation target is the mixed SOS Personal/Professional pair. Every
step must use the ordinary visible UI; setup through an API cannot replace a
user action under test. These are requirements, not execution results.

### 15.1 Create the caller's recipient identity and dependent cards

1. In a fresh/reset Personal Demo, sign in and unlock the profile. The card
   directory is empty. Choose **Create my card** and complete the human form.
2. Save, reload and reopen the same card. It is visibly identified as **My
   card**, including in the card switcher. Only one active `ONESELF`
   relationship is allowed for this profile; a retry returns the same card.
3. Create another human card for an authorized dependent, then an animal
   card. Persist an explicit controller relationship and a separate primary
   emergency-contact relationship to My card. Show both defaults before save.
4. Open each new card's Contacts. Add another contact, change priority and
   remove the initial contact where authorized. Removing a contact does not
   remove the controller; controller authority does not itself authorize a
   clinical read or enumerate someone else's private conversation.
5. Restore My card as the main emergency contact for the following call case.
   Reload and sign in again; verify the same cards and contact relationships.

Creation of a competent adult's card requires the applicable authority or
invitation/acceptance; mere possession of their email is insufficient. For an
animal-only presentation, the human responsible-person identity must remain
distinct from an animal card; never label an animal `ONESELF`. Define and
test that presentation before declaring the animal-only variant passed.

### 15.2 Introduce a card to Professional

Personal exposes copyable identifiers/provider/species and a downloadable QR.
For each applicable row, start from Professional's normal **Introduce card**
entry and resolve the same dependent card through the authorized BFF:

| Variant | Visible user operation | Required result |
| --- | --- | --- |
| Full identifier | Copy the identifier in Personal and paste it in Professional | Resolve its exact card and index provider; request no redundant fields already encoded in that identifier |
| Manual details | Enter card number, provider code and human/animal choice; select animal species when applicable | Cross-check the complete tuple; human species is supplied by the canonical human profile |
| Camera QR | Start camera scanning and present Personal's card QR | Decode the supported locator and pass it to the same resolver |
| Image QR | Download the card QR in Personal and upload that file through Professional's scanner | Decode that actual image and resolve the same card; no hard-coded scan response |
| Linked identifier | Enter an enabled, governed linked identifier, such as email | Resolve only through the protected provider-discovery/match contract; discovery grants no access |

The network path resolves an opaque index key to its provider and then asks
that provider under the acting profile. Clear email/phone values never enter
the ledger. Human cross-provider matching follows the existing PDQm ITI-119
`Patient/$match` boundary; do not add PIXm or derive clinical authority from a
match. The provider code and species are routing/identity input, not grants.
Demo simulates the same use case through its BFF vault without Fabric/GW.

Reject an invalid checksum, wrong provider/species, expired/reset locator,
ambiguous match, unregistered card, unsupported QR, oversized or invalid
image, denied camera and unavailable provider with a visible reason. An
unsupported camera must not disable file upload or pasted-ID entry. Do not
silently turn an arbitrary DID/number into an imported synthetic card.

### 15.3 Confirm the Encounter and contact the responsible person

1. Before revealing protected contacts or starting a call, Professional shows
   the resolved subject and the BFF-confirmed organization, department/service,
   role and existing Encounter or explicit **Start encounter** action.
   Scanning alone must not silently create an Encounter or grant access.
2. Start or resume the permitted Encounter. Verify its stable identifier,
   subject, service and acting professional after reload. Resolve an existing
   Encounter idempotently; do not create another one on each scan.
3. Open the subject's authorized emergency contacts. Select the responsible
   person's My card, now visibly identified as the intended recipient.
4. Leave Personal signed in with **no card selected**, then repeat while
   viewing My card, an unrelated card and another workspace section. From
   Professional start audio, then video in separate runs.
5. Personal receives an account-level incoming notice in every variant. The
   recipient need not select, own or control the attended card. Before answer,
   show the dependent subject, calling organization, department/service, role
   and Encounter context. Answer and verify real two-way media.
6. End, reload both portals and reopen the organization/service conversation
   on My card. Verify the same call and Encounter identifiers, direction and
   terminal outcome. The attended subject also shows its authorized event.
7. Repeat declined, caller-cancelled and missed cases, then a text message and
   enabled attachments. Notifications and history derive from the same
   canonical Communication; projection in two views does not duplicate it.

Repeat for each host-enabled authorized role: veterinarian, hospital emergency
clinician, paramedic, municipal police/traffic officer and lifeguard. Record
the exact role and subject-kind variant. A veterinarian-to-animal pass does
not close doctor-to-human or public-safety variants. The jurisdiction policy
must explicitly authorize contact disclosure and each subsequent operation.

### 15.4 Recipient identity, registered devices and delivery

Developer requirements:

1. Address the call to the verified emergency-contact identity, independently
   of the attended card and the card currently selected in the portal.
2. Register each browser or native application installation separately. The
   user enables notifications; the installation obtains its Web Push
   subscription or native push token and registers it with the owning BFF.
   Login, a card DID, email and telephone number are not push tokens.
3. Bind registrations to the authenticated recipient and the authorized
   application/environment. Support several enabled installations and token
   renewal, expiry, account changes and explicit revocation. Never accept a
   recipient identity supplied by the browser as authority.
4. Notify the explicitly resolved active registrations. A browser portal can
   receive Web Push without an open card or page, subject to browser/OS
   support and permission. A native app uses its configured push provider.
5. Keep external notifications content-free. Opening one restores the portal
   or app and requires authentication/unlock before showing caller, attended
   subject, organization/service or Encounter details or joining the call.
6. Let the first authorized device answer atomically. Stop ringing on sibling
   devices and reject their attempts to obtain a second recipient media grant
   or end the winning session's call. Both refusals return HTTP 409; readback
   must retain the received state until an authorized participant ends it.
7. Keep the in-page notice, browser push, native push and verified email/SMS
   delivery separate in implementation, status and acceptance evidence.

Recipient identity and device delivery are independent of card navigation.
The in-page incoming banner, browser Web Push, native application push and
email/SMS are distinct mechanisms with separate execution evidence. Polling
an open page is not a push-delivery pass.

Repeat the recipient case with several attended cards and multiple registered
devices/applications/portals bound to that same verified recipient identity.
The server resolves an explicit snapshot of enabled, non-revoked device keys
using the existing directed-message device-audience contract. The attended
card's DID identifies the subject; it is not the recipient's device address.
Email/phone sign-in only supplies verified account evidence and must not
silently link unrelated accounts across identity providers.

Test no selected card, another selected card, background/closed browser,
native application where implemented, locked profile, logged-out session and
revoked device. The first authorized device that answers wins; sibling
devices stop ringing and cannot obtain another participant grant. A locked
or logged-out device may receive a content-free notice and must authenticate
before receiving protected context or joining media. Follow the existing
`notificationPreview: hidden` content policy for external push payloads.
Test configured, verified email/SMS fallbacks and their actual delivery
receipts separately; do not label an unconfigured provider, queued job or
rendered banner delivered. Missing native/push adapters remain unexecuted.

### 15.5 Exceptional access and care handover

1. Revoke ordinary subject permission and repeat introduction. Identification
   may succeed but protected data/contact actions remain denied.
2. For the exact eligible healthcare role and subject, request break-glass
   using incident/Encounter, mandatory reason, permitted scope and expiry.
   The server evaluates eligibility; a medical-role label is insufficient.
3. Verify scoped access and its audit/recipient notice, then expire/revoke it
   and retry from the already open browser. Repeat as an ineligible responder
   and require denial without contact disclosure or an RTC grant.
4. Exercise a human ambulance-to-hospital transfer. The receiving service
   explicitly accepts handover and starts its distinct Encounter. Permanent
   transfer completes the departing Encounter; temporary transfer uses the
   canonical on-hold/return contract rather than silently closing it.
5. Verify Encounter links and service assignments by authoritative readback.
   Reconcile future professional recipients through the existing
   `reconcileEncounterCommunicationAudience` contract. Previously sent
   Communications retain their original recipient snapshots.
6. In the hospital Encounter, record permitted tests/results and publish the
   reviewed clinical contribution. Personal sees its authorized provenance,
   journey update and conversation; ordinary draft tests are not completed
   clinical documents. Repeat transfer/reload without duplicate Encounters.

### 15.6 Execution and release evidence

Give every row/role/subject a separate Tuskr execution status and matching
numbered Playwright journey. Record the control labels, two account contexts,
exact revisions, actual persistence/readback, RTC media evidence and cleanup.
Use the same sequence for manual acceptance; the user must be able to follow
it without knowing a fixture name or choosing a hidden API path.

The Demo gate runs first through its BFF vault; the network gate first uses
the local memory GW, then local-network and Test Network with real authority.
Do not claim the combined journey passed from component tests, a preloaded
root-channel call or a collection of disconnected backend tests. Missing UI,
missing adapter and policy denial remain distinct observed outcomes.

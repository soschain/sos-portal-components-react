# 01 — Portal modes, authentication and authority

Read [00 — Index](00-INDEX.md), then use
[02 — Cross-portal Tuskr cases](02-CROSS_PORTAL_TUSKR_CASES.md) to test these
rules. This contract applies to both Personal and Professional applications
and every configured sector flavour.

## 1. Independent configuration dimensions

| Dimension | Selects | Does not grant |
| --- | --- | --- |
| Application flavour | Branding, subject kinds, enabled provider routes and sector extensions | Employment, licence, membership or subject access |
| Execution profile | Local services or configured remote staging/production services | An authenticated identity or an admitted organization |
| Access path | Demo, Test Network or Production data/authority boundary | A right to reuse another access path's records or session |
| Authenticated account | The verified Firebase user identity | Controller or employee authority merely from an email, telephone or selected role |
| Protected profile | The exact organization/subject context, role, device and effective capabilities | Rights belonging to another profile of the same account |

`dev:staging` means local UI/BFF processes using configured staging services.
It may host either Demo or Test Network. It does not make Demo a GW journey
and does not make Test Network a synthetic browser-only experience.

The same shared components render the same use-case state in Demo, Test
Network, web and Expo. They never select or import persistence. Labels such as
Human or Veterinary describe a sector specialization; a brand must not select
a different tab model, editor, conversation format or authorization model.
An allocated port or intended flavour is not a runnable launcher profile until
the owning application implements and verifies it.

### 1.1 Start dependencies for the case being tested

Begin with the cheapest real boundary that can prove the intended case. The
following rows add independent dependencies; they are not an instruction to
start every service for every test.

| Case/profile | Required boundary | Services not implied by that case |
| --- | --- | --- |
| Local Demo UI, navigation and BFF business state | Owning UI/BFF, configured test authentication and the shared Confidential Storage memory adapter | No GW, Fabric, Terminology or LiveKit |
| Demo clinical coding or terminology-cache behavior | The Demo UI/BFF boundary plus the configured terminology SDK/provider; warm/read the BFF cache through the SDK | No GW or Fabric; no LiveKit unless the case also makes a call |
| Demo audio/video call | The Demo UI/BFF boundary plus the dedicated LiveKit provider required by the call | No GW, Fabric or Terminology merely because RTC is enabled |
| Local network/business use case | UI -> BFF -> SDK -> GW with `networkKind=test` and the memory adapter; ICA only where the authority case requires it | No Fabric; clinical/call dependencies only for their own cases |
| `local-network` acceptance | The same applicable network use case against the local Fabric-backed network profile | No unrelated assistant, terminology or RTC profile |
| `dev:staging` Test Network acceptance | Local UI/BFF for the chosen configured flavours, real staging identity/authority, online GW and the case's required online services | No automatic promotion of a Demo case into GW onboarding |

For network use cases, establish the memory-backed GW `test` evidence first,
then local Fabric `local-network`, then the online `dev:staging` Test Network
journey. Keep the profile names distinct from the Demo access path. Demo
remains BFF-only in every execution environment and never requires a GW
organization/tenant bootstrap.

Terminology and RTC are independent additions. A missing required terminology
provider/cache result fails the coding case; do not invent a coded value or
silently return unrelated fixture data. An unrelated UI, card-navigation or
call case does not require Terminology just because a clinical case does.
The telephone assistant, optional web assistant and Chat each retain their
own integration cases and do not become implicit prerequisites in this table.

During development rerun only the failed gate and the smallest affected tests.
Repeat a green predecessor when its boundary changed or its state is needed,
not on every iteration. Release closure still requires the cumulative set of
affected gates to have current green evidence; fail-fast iteration does not
waive a required boundary.

## 2. Public Demo and test credentials

Public Demo requires a real email account sign-in through the application's
enabled provider. A federated Google email account is still real account
authentication. Account sign-in limits anonymous use; it does not make the
synthetic Demo organization or professional role real.

Real telephone authentication may be used in a controlled test. Test-only
Firebase phone numbers and their fixed verification codes belong exclusively
to private automated/operator testing, in ignored runtime/access files and the
selected staging Firebase project's test-phone configuration. They must never
be offered as public Demo credentials, published in guides, prefilled for
visitors, or turned into a public production authentication bypass.

A fixed code configured for a Firebase test phone is different from the SMS
sent to a real telephone. Do not send real SMS merely because a test fixture
is missing. Verify the configured test project and fail with a clear setup
error when its test-phone fixture is absent.

Test identity and role remain separate. One account may hold a Personal
controller profile, an Organization-controller profile and multiple employee
profiles, subject to their independent lifecycle. Veterinarian, doctor,
police officer and lifeguard are profile/assignment contexts, not properties
of a telephone number. The same-account scenario proves correct switching;
different-account scenarios prove ownership and denial boundaries.

## 3. Demo in dev:staging

The expected Demo flow is:

1. Each of two isolated browsers authenticates to its owning portal.
2. The BFF validates the synthetic profile selection and Demo PIN.
3. The Personal BFF creates/loads synthetic cards and relationships through
   the Confidential Storage port and returns only the permitted projection.
4. The Professional BFF resolves the exact shared Demo card/context through
   the BFF-owned Demo data boundary and applies its synthetic role policy.
5. Both portals perform the permitted action and reload the persisted result.

Use the term **BFF-validated Demo selection**. It grants no real employment,
licence, membership, Consent or provider authority. Demo business records,
card discovery and Communications stay in the BFF-owned Confidential Storage
boundary; no Demo GW tenant bootstrap or GW business write is required.
Do not manufacture an unsigned bearer token to make a production Gateway
accept a synthetic Demo actor.

Two BFF processes must share Demo state through the configured Confidential
Storage composition. Two unrelated process-local memory stores cannot prove
cross-browser or cross-portal readback. Do not repair this with a parallel
global Map, localStorage database or a special chat history.

The adapter is selected at the composition root: memory for all-local,
Expo SQLite for native, IndexedDB for explicitly enabled browser-offline
custody, or configured Firestore/PostgreSQL for a durable deployment. An
explicit disposable local-to-staging adapter is not production storage.
Demo routes and components receive the vault port; they do not import a
provider database client or choose the collection prefix themselves.

The same port also covers account enrollment, profiles, sessions, passkeys,
recovery, cards, members, clinical records and Communications. Atomic one-use
operations retain the shared transactional contract, including rollback and
owner/profile binding. A namespace includes the applicable deployment,
network/access path, host/tenant and ecosystem; the browser cannot choose it.
Reset/TTL invalidates the old Demo generation and its card locators without
changing Test Network or Production data.

## 4. Test Network in dev:staging

Test Network has a separate complete authority journey. A configured Firebase
test-phone session is valid test authentication where the selected profile's
evidence requirements are met; it does not authorize an Organization,
employee, role or subject. CH Organization and employee endpoints require
verified-email evidence, so a phone-only token without that claim cannot
complete their lifecycle. An isolated local Auth emulator may seed explicit
verified-email fixture claims for a local network test; that does not prove
cloud email verification.

The selected automated acceptance journey uses simulated Firebase phones;
it does not require an operator mailbox or a phone-to-email association.
The current email-only Organization/employee contract is an implementation
gap. Policy must support verified official phone OR email according to the
authoritative source, without treating a shared organization contact as an
employee's identity. Do not manufacture email claims, change DID formats or
alter GW correlation to bypass the gap. Keep that full phone-only lifecycle
unexecuted until its actual prerequisites are implemented; a blocked or
skipped case is not a passed release gate. Public Demo account-login policy
and any independently selected email-OTP test remain separate.

1. Authenticate the applicant with the chosen valid identity/evidence flow and create/unlock its protected controller
   wallet before submitting the organization application.
2. Admit the synthetic test organization under the configured host policy.
   The reviewed CH path submits signed admission/domain credentials through
   `Organization/_transaction`, then follows the existing Offer/Order
   continuation. Do not add legacy ICA `_verify` or `_activate` as a new CH
   prerequisite or change the GW protocol.
3. Confirm the organization is active by authoritative readback; complete any
   required seat/licence purchase separately.
4. Invite the employee, accept as the correct account, activate the exact
   role/profile and register its independent device/DCR context.
5. Create/recover the Personal subject/card and verify its controller/member
   relationships, then establish the authorized professional subject scope.
6. Execute and reload the cross-portal action through BFF, SDK and real GW.
7. Suspend/revoke the employee, device or relationship and verify denial of
   the same action from the previously opened browser.

An enabled Test Network `animal-tech` policy may exercise a veterinarian
persona, and `health-tech` may exercise a doctor persona, without claiming the
test organization is a legally verified care provider. Admission, employee
assignment, licence/device state and subject authorization remain independent
checks. Apply the configured sector catalogue for police/lifeguard and other
profiles; do not widen a production sector from a test role selector.

Use the current `antifraud-ica-node-ts` authority where that journey needs
ICA. A local synthetic issuer or HTTP 200 is not provider verification or
production credential evidence. Frozen legacy `gdc-*`/GW CORE implementations
are migration references; new shared functionality belongs in the maintained
Antifraud/FHIR/SOS data utilities and SDK layers.

## 5. Communications, threads and calls

Messages, optional attachments, index-update notices, clinical-document/IPS
requests and call-history events are Communications. Keep one persisted
record/projection rather than creating a second chat event. The shared
conversation adapter uses `@kesha-antonov/react-native-chat` through the
Antifraud/SOS presentation packages; it does not own transport or authority.

DIDComm may carry the documented application body, including the existing
message representation or an explicitly supported JSON:API/FHIR document.
This UI guide does not introduce a new wire format or declare an application
extension a standard. Follow the applicable versioned data/SDK contracts.

Preserve GW asynchronous correlation: the requester generates `thid`, the
response retains it, and retrieval uses that `thid`. A separate message `id`
or `jti` remains unique. `pthid` identifies the parent thread; a relationship
child channel must keep its stable parent/relationship/participant scope.
Do not replace request/response correlation with an invented channel id.

LiveKit is the dedicated signaling/media provider. The BFF authorizes the
exact participant and issues a short-lived room grant; API keys/secrets never
enter React, a Communication, logs or a Tuskr attachment. Invitation,
received/completed/declined/cancelled/missed outcomes and optional unanswered
audio are Communications. Media teardown is not history persistence.

CH all-local does not start or require Chat, the telephone assistant or the
optional web assistant. Calls are not an assistant onboarding flow. Online
RTC may be used by a dev:staging Demo without moving Demo business records
into the GW. Verify room join and media in both browsers; DNS, certificate,
HTTP response and a ready pod prove only their infrastructure boundaries.

## 6. Verification and maintenance

Use the same applicable Tuskr cases across flavours and adapters. Demo
evidence cannot close the Test Network organization/employee lifecycle gate.
A GW-backed synthetic RTC test cannot close the BFF-only Demo gate. A test
phone authenticated through an emulator cannot close real Firebase staging
authentication. A fixture page cannot close the normal portal route journey.

Record results against exact commits/packages, actor/profile and environment
without retaining credentials or personal data. Resume the smallest failed
gate and retain green predecessor evidence unless its boundary changed.
Keep legacy compatibility tests explicitly optional. Put dated results in
the changelog or test execution; keep these guides as maintained contracts.

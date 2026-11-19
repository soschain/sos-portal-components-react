# Changelog

## Unreleased

- Compose one public catalogue discovery controller over the Antifraud renderer
  for Personal/Professional and Demo/Network. Inject transport, retain optional
  ISO geography, ignore obsolete responses and expose explicit loading/error
  states. Existing authorised service actions remain host-owned.

## 0.5.2

- Show supported clinical records in an explicit collection without a Composition,
  including minimized SHC vaccinations, through the existing resource projector.
  These display groups assign no IPS section membership or section actions;
  a supplied Composition retains control of its referenced records.

- Align the shared clinical preview with FHIR Data 0.8.1 and SOS Data 0.8.5,
  including readable clinical codes when a document has no display label.
- Consume Antifraud Portal 0.4.2 credential QR capture for the clinical journeys.

## 0.5.1 - 2026-11-17

- Align the reviewed Data runtime and exact dependency assertions with public
  SOS Data 0.8.3, FHIR 0.7.2, Antifraud Common 1.3.1 and Antifraud Portal 0.4.1.
  Preserve strict declaration/runtime equality and the existing renderer code.

- Keep the normal Encounter journey content-sized, omit unavailable stage and
  history timestamps, and hide rail navigation for a single recorded stage.
  Collapse secondary creation after records exist while preserving empty-state
  creation, server-granted actions, transfer retries and confirmed readback.

- Use individual-neutral English defaults in the shared Encounter transfer
  journey for human and animal subjects. Preserve caller copy overrides,
  authorized transfer intent and the normal console's hidden legacy tools.

- Compose one public-registry discovery workflow for Personal and Professional:
  injected authenticated search, explicit ephemeral location consent, selectable
  radius, manual fallback and straight-line distance labels. Share the Antifraud
  controlled renderer without selecting persistence or a paid maps provider.

- Scope jurisdiction-specific acceptance to affected flows; keep unrelated Demo
  and general technology-sector releases independent while retaining mandatory
  affected regressions and truthful failure reporting.

## 0.5.0 - 2026-11-15

- Pin the published Antifraud Common Components 1.3.0 and Antifraud Portal
  Components 0.4.0 releases for the shared shell and controlled identity panels.

- Own shared clinical editors, document drafts, IPS summary/timeline, card and
  subject workspaces, communications, emergency-task and notification presentation
  using existing FHIR/SOS Data contracts and host-authorized callbacks.
- Compose neutral Antifraud identity/evidence entry, recipient activation and
  access-request renderers. Own animal/controller forms and read-only details
  without a UHC runtime dependency. Preserve pending evidence and responsibility.
- Compose the controlled Antifraud shell with SOS current-subject context and
  browser UI preferences; include responsive styles and host-branded card fallback.
- Validate the published dependency cohort: strict types, 45 suites/178
  component cases, build, three source/emitted/registry-lock independence checks,
  and all 83 required consumer exports (46 runtime, 36 types and stylesheet).
  Governed fixture corrections retain 17 affected cases. These are component
  assertions, not new user journeys or Test Network/blockchain acceptance.

## 0.4.0 - 2026-11-14

- Verify the full 33 component tests and three required dependency contracts,
  typecheck/build, source/emitted privacy and all six JavaScript public entries
  plus CSS against the independent registry cohort. This release preserves
  the existing shared API; it does not incorporate UHC components.

- Require the independent dependency gate in the normal check: reject GDC
  declarations and aliases, source/declaration/emitted imports or re-exports,
  and every transitive registry lock entry.

- Consume the published FHIR and SOS Data 0.7 contracts through registry-only
  dependencies, preserving the shared UI API and the existing neutral
  Antifraud renderer.

- Pin the reviewed SOS Data contract version used by the shared journey
  renderer so dependency resolution does not reinstall an older catalog.

## 0.3.4 - 2026-11-12

- Render provider-supplied organization/service labels for authorized foreign history without exposing service-reference internals or mutation controls.

- Keep other-organization Encounter history read-only in the shared journey action selector. Document consent-free professional encounter traceability, scoped history read grants and the full IPS permission catalog.

## 0.3.3 - 2026-11-11

- Add controlled, host-authorized Encounter journey and transfer components, including persisted response validation and read-only Personal presentation. Retain the UHC transfer console through a compatibility wrapper.
- Recover the shared person/animal clinical-section, permission and US Core STU6 contract; distinguish existing views from the pending complete example lifecycle.

## 0.3.2 - 2026-11-10

- Add controlled `SubjectCardLocatorFields` for card-number or DID/QR entry.
  Number entry distinguishes person/animal and animal taxonomy, including
  species beyond the supplied presets. Hosts provide labels/options and own
  resolution and authorization; the fields select no mode, storage or provider.

## 0.3.1 - 2026-11-09

- Add a persisted RTC completion signal for local/remote hangup and injected
  canonical terminal-state observation. Release tracks, de-duplicate end
  requests, preserve retryable history failures and cancel invitations after
  connection failure. Load browser media capability before issuing a grant.

- Add shared account-level push registration controls with explicit enable,
  current-browser disable, other-device revocation and unavailable/denied
  states. Permission requests, transports, identity and persistence remain in
  the host adapters.

- Add one controlled emergency-contact card directory with separate controller
  context, primary-recipient presentation and injected add/remove/priority
  operations. It owns no storage or authority and can render the same state
  across execution modes; native rendering remains a separate adapter.

- Specify the complete created-card emergency acceptance journey under the
  existing Tuskr IDs: My card, dependent/controller/contact defaults, pasted
  identifier/manual tuple/camera/image intake, linked-identifier discovery,
  Encounter-scoped contact and RTC, recipient-card history, exceptional access
  and ambulance/hospital handover. Distinguish requirements from executed
  evidence and isolated media cases from full lifecycle acceptance.

## 0.3.0 - 2026-11-08

- Export shared device-assistance preferences through an independent SOS entry,
  delegating its controlled web renderer to Antifraud 0.3.0. Keep runtime,
  capability detection, storage and authorization in the owning application.
  Native preferences rendering is not implemented by this release.
- Typecheck, build and the independent export smoke pass. Cross-application
  phone-authenticated browser checks belong to the CH acceptance evidence.
- List the three implemented runtime exports separately from the acceptance
  catalogue. Base shell/profile/card extraction from the existing domain
  package remains pending; controller administration has a separate owner.

- Specify shared subject-control placement, semantic option/action colours,
  account-menu versus subject-device grants, appearance namespace parity and
  separate model enablement/availability/preparation states in the existing
  Tuskr cases. These are acceptance requirements, not new runtime readiness.

- Correct the shared acceptance guides to use the selected simulated-phone
  tests without mailbox access. Treat current email-only Organization/employee
  contracts as an implementation gap; preserve official-source verification,
  independent profile authority and existing GW/DID behavior.

- Replace the dated developer handoff with numbered, README-linked guides for
  generic portal modes/authentication and detailed cross-portal Tuskr cases.
  Preserve the existing `SOS-PORTAL-001`-`029` and specialist research IDs.
- Distinguish public Demo real-email account login from fixed Firebase test
  phone fixtures, BFF-owned Demo persistence from Test Network authority/GW
  lifecycle, and dedicated RTC media from Communication history and assistants.
- Document positive/negative Personal ? Professional journeys, both-side
  readback, profile/relationship revocation, sector variants and evidence
  boundaries without claiming unexecuted gates have passed.
- Specify dependency-by-case progression: BFF/memory Demo first, independent
  terminology-cache and RTC additions, and memory-GW -> local Fabric ->
  online Test Network acceptance for network cases. Retain green evidence and
  rerun only failed/affected gates while closing the cumulative release set.

## 0.2.3 - 2026-11-07

- Render caller-cancelled Communications as `Cancelled`/`Cancelada` rather
  than collapsing them into an undefined or generic ended state.
- Let the host distinguish a caller cancellation from an unanswered timeout
  when ending an RTC session; media teardown remains separate from canonical
  Communication persistence.

## 0.2.2 - 2026-11-07

- Render the canonical ringing, missed and ended state beside every call
  Communication in the shared Personal/Professional conversation surface.
  Host portals no longer need divergent status labels to expose call history.

## 0.2.1 - 2026-11-07

- Pin `sos-data-utils-ts@0.6.28`, the exact release that owns the portal RTC
  Communication contract consumed by `createLiveKitRealtimeCallClient`. Clean npm
  installs no longer retain a nested pre-RTC data-utils release.

## 0.2.0 - 2026-11-07

- Establish this package as the shared presentation boundary consumed directly
  by CH Personal and Professional in every flavour. Product portals provide
  authorization, policy and BFF adapters; UHC compatibility exports no longer
  own the active implementation.
- Export `SubjectConversationChat` as the single subject-channel renderer over
  canonical Communications. It projects text, governed attachments, clinical
  Bundles, ICS/files, audio and call events without owning persistence,
  signaling or recipient authority.
- Export `createLiveKitRealtimeCallClient` as a dynamically loaded web RTC adapter
  designed for later Expo substitution. It consumes only the short grant
  issued by the BFF and never receives LiveKit API credentials.
- Separate CH all-local, telephone-assistant, optional web-assistant and RTC
  integration profiles. Calls use a host-injected dedicated RTC client while
  invitations, terminal events and unanswered audio render as Communications.

## 0.1.2 - 2026-11-07

- Document and enforce one shared UI contract for Demo, Test Network, web and
  Expo; presentation components never select a persistence adapter.

## 0.1.1 - 2026-11-06

- Document the GitHub organization handoff, BFF-validated synthetic Demo
  boundary, scoped storage contract and two-browser call verification flow.

## 0.1.0 - 2026-11-06

- Establish the shared cross-sector portal-component boundary.
- Publish the initial Tuskr-ready use-case catalogue covering shell, access,
  cards, identity, encounters, communications, appointments, relationships,
  calls, clinical documents, permissions and lifecycle composition.
- Add the Personal/Professional communications matrix for card-root channels,
  relationship child threads and persisted audio/video call-event states.
- Keep host/tenant controller governance in Antifraud Hosting and leave
  research/genomics outside the initial core until their package boundary is
  decided.
- Add the canonical `SubjectConversationChat` React Native/Web adapter over
  Antifraud's neutral conversation surface and SOS subject-conversation
  contracts, including text, governed attachments, FHIR documents and call
  events without moving authorization or delivery into React.


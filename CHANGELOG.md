# Changelog

## Unreleased

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
  Preserve the existing `SOS-PORTAL-001`–`029` and specialist research IDs.
- Distinguish public Demo real-email account login from fixed Firebase test
  phone fixtures, BFF-owned Demo persistence from Test Network authority/GW
  lifecycle, and dedicated RTC media from Communication history and assistants.
- Document positive/negative Personal ↔ Professional journeys, both-side
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


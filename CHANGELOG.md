# Changelog

## Unreleased

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


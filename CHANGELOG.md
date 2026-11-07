# Changelog

## Unreleased

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


# SOS Portal Components React

## Runtime parity

These components render the same use-case state in Demo, Test Network, web and
Expo. They never select storage. Owning applications inject memory for
all-local, Expo SQLite for native, or an explicit durable adapter. Firestore
must not create a Demo-only component or data model.

Shared portal UI for base components. It provides the portal UI core for
personal and professional applications across human
health, animal care, public safety, emergency response and other configured
sectors. The package exists to prevent each sector flavour from reimplementing
the same shell, access journey, card navigation and governed subject workflows.

The current repository and Demo-boundary handoff is summarized in
[`docs/DEVELOPER_UPDATE_2026-11-06.md`](docs/DEVELOPER_UPDATE_2026-11-06.md).

The first implementation of a workflow may be proven in the animal-care
portals. That does not make every future human-health consumer depend
permanently on an animal-care component. Promotion into this package happens
only after the shared contract is understood. Research, genomics and other
specialist areas remain in their current package until their long-term
boundary is deliberately chosen.

## Ownership boundaries

- This package owns reusable portal presentation and controlled user intents.
- Applications own branding, routes, environment selection, BFF calls and
  server-resolved sector/role policy.
- `antifraud-hosting-components-react` owns neutral host- and
  tenant-controller administration. SOS may compose it but does not fork it.
- `antifraud-portal-components-react` owns neutral evidence and conversation
  primitives used beyond health.
- `terminology-components-react` owns terminology controls; the terminology
  service and SDK own canonical systems, releases and searches.
- FHIR/SOS/Vet data utilities and SDKs own data contracts, validation,
  transport, signatures and persistence. React never derives authority.
- Sector packages own their human-health, animal-care and other
  domain-specific extensions.

Browser state, a visible tab or a selected role never grants authority. Every
protected action is enabled from trusted host capabilities and remains
revalidated by the BFF/Gateway.

## Implemented exports

- `sos-portal-components-react/subject-conversation-chat` provides the
  canonical React Native/Web adapter for an already-authorized subject
  conversation. It projects the stable SOS entry model into the neutral
  Antifraud conversation surface backed by
  `@kesha-antonov/react-native-chat`. Hosts retain BFF delivery, attachment
  opening, FHIR rendering, WebRTC signaling and authorization.

The compatibility export currently present in the human-health component
package is deprecated and will delegate to this package while consumers move
to the SOS-owned path.

## Tuskr use-case catalogue

The stable IDs below are intended to become Tuskr cases. Each case must be
executed for every applicable flavour, actor, viewport and environment. Demo
uses synthetic state and must say so; Test Network and Production must use
their real authorized BFF path.

| ID | Area | Governed journey and acceptance target |
|---|---|---|
| SOS-PORTAL-001 | Shell | Render the shared top bar, brand slot, account/profile menu, current subject and responsive navigation without flavour-specific forks. |
| SOS-PORTAL-002 | Entry | Choose an enabled Demo, Test Network or Production entry supplied by trusted host configuration; a browser choice never selects network infrastructure. |
| SOS-PORTAL-003 | Sign-in | Sign in through the host adapter, restore the exact protected profile and reject a profile belonging to another access path. |
| SOS-PORTAL-004 | Biometrics | Unlock a protected profile with platform biometrics/passkey when available and use the governed PIN/password recovery fallback without exposing keys to React. |
| SOS-PORTAL-005 | Registration | Register or accept an invitation for the applicable person, professional or animal-responsible profile; registration alone grants no subject access. |
| SOS-PORTAL-006 | Cards | List only server-authorized individual or animal cards, select one card and preserve its stable identifier across navigation/reload. |
| SOS-PORTAL-007 | Card sections | Resolve card sections from subject kind, sector, role and backend capabilities; hidden or read-only sections cannot be enabled by URL or browser state. |
| SOS-PORTAL-008 | Identity | View and edit the permitted identity fields, provenance and attestations for a selected card while preserving immutable identifiers. |
| SOS-PORTAL-009 | Related entities | Add, view, update or remove authorized related people, animals and organizations with explicit relationship type and provenance. |
| SOS-PORTAL-010 | Contacts | Manage ordinary and emergency contacts independently, including priority, relationship, availability and emergency-only disclosure. |
| SOS-PORTAL-011 | Encounters | List, open and author permitted encounters; bind contributions to the acting professional, organization, subject and server-confirmed scope. |
| SOS-PORTAL-012 | Communications | Render one canonical conversation of DIDComm/FHIR Communications with text and governed attachments such as Bundles, documents, ICS, images and audio in both Personal and an authorized Professional card channel. |
| SOS-PORTAL-013 | Calls | Initiate and display authorized audio/video calls and outgoing, incoming, completed, rejected, cancelled or missed call events without treating call signaling as clinical authority. |
| SOS-PORTAL-014 | Appointments | Search availability and create, update or cancel appointments for applicable services, including blood-donation centres and other scheduled providers. |
| SOS-PORTAL-015 | Clinical viewer | View authorized clinical documents, IPS summaries, sections, timelines and source/provenance details for human or animal cards. |
| SOS-PORTAL-016 | Clinical authoring | Create and edit clinical documents through the canonical section-based editor, including encounters, observations, immunizations and host-enabled sections. |
| SOS-PORTAL-017 | Credentials | Create, display, scan and verify supported health/data-card credentials and QR transports while keeping signing and verification outside React. |
| SOS-PORTAL-018 | Permissions | View and change only permitted Consent/access relationships, group memberships and card grants; notifications never substitute for authorization. |
| SOS-PORTAL-019 | Employee lifecycle | Compose the canonical Antifraud Hosting workforce screen for invitations, licences, employees and devices; SOS supplies sector labels and adapters, not a duplicate implementation. |
| SOS-PORTAL-020 | Individual members | Manage an individual's authorized members/delegates separately from organization employees, with explicit lifecycle and revocation. |
| SOS-PORTAL-021 | Emergency access | Show protected emergency data and request governed exceptional/break-glass access with reason, expiry, audit and clear post-access state. |
| SOS-PORTAL-022 | Subject index | Display real index-update Communications from authorized providers and open linked records without manufacturing parallel chat events. |
| SOS-PORTAL-023 | Provider directory | Select authorized card/index, clinical, appointment or emergency providers from host-supplied directories without hard-coded flavour endpoints. |
| SOS-PORTAL-024 | Accessibility | Complete every shared journey by keyboard and screen reader with visible focus, labelled controls, status announcements and responsive layouts. |
| SOS-PORTAL-025 | Expo reuse | Render platform-neutral contracts in Expo Android/iOS adapters and web adapters while retaining one message/card/action model and host-owned native capabilities. |
| SOS-PORTAL-026 | Preferences | Apply light/dark/system appearance, text size, locale and accessibility preferences before and after sign-in without changing authorization. |
| SOS-PORTAL-027 | Failure safety | Fail closed on missing capabilities, expired sessions, invalid attachments, unavailable providers or rejected persistence and preserve an actionable, non-sensitive error. |
| SOS-PORTAL-028 | Controller embedding | In CH Management, embed the published Antifraud controller components for groups, departments, workforce and memberships until controller access is removed from branded professional portals. |
| SOS-PORTAL-029 | Conversation threads | Open the individual card's root channel and authorized child threads for members, related entities or emergency contacts; each thread keeps stable subject/relationship/participant identifiers, and contact status alone grants no message access. |

### Communications execution matrix

Tuskr must exercise `SOS-PORTAL-012`, `SOS-PORTAL-013` and
`SOS-PORTAL-029` together:

| Actor/surface | Root card channel | Authorized child thread | Required call events |
|---|---|---|---|
| Personal portal | View/send according to the individual's capability | Open a member, related-entity or emergency-contact thread only after the BFF confirms participation | outgoing, incoming, completed, rejected/cancelled and missed audio/video calls |
| Professional portal | View/send in the selected individual's card channel only with professional subject scope | Open only child threads included in the professional's server-resolved scope | the same persisted call-event projection; no browser-manufactured duplicate |
| Reload/cross-surface | Preserve stable channel, thread and message identifiers | Preserve the exact relationship reference and participant set | Personal and Professional render the same authorized event status and attachment metadata |

Acceptance requires real persisted Communications (or the explicit synthetic
Demo adapter), chronological projection without a parallel chat record, and
negative tests proving that a contact listed for emergencies cannot enumerate
or open a thread without separate authorization.

## Tracked specialist integration cases

These cases must remain visible in Tuskr and in CH while they are migrated,
but they are not owned by the initial SOS core package.

| ID | Current owner | Planned direction | Acceptance target |
|---|---|---|---|
| HEALTH-RESEARCH-001 | Human-health components / host adapter | Candidate for animal-care components | Create, update, activate and revoke a research study with server-confirmed controller or delegated authority. |
| HEALTH-RESEARCH-002 | Human-health components / host adapter | Candidate for animal-care components | Search and add authorized research subjects without turning discovery into access. |
| HEALTH-RESEARCH-003 | Human-health components / host adapter | Candidate for animal-care components | Import research data, map source fields, track jobs and review/reclassify/discard staged records. |
| HEALTH-RESEARCH-004 | Human-health components / host adapter | Candidate for animal-care components | Manage research contracts, study invitations, subscriptions and governed data access separately from ordinary card permissions. |
| HEALTH-RESEARCH-005 | Human-health components / host adapter | Undecided specialist package | Use transcription/edge models and future genomic workflows only through explicit capability, provenance and privacy policy. |

The current source inventory still contains host-local research panels.
Migration is complete only when consuming portals import their published
human-health implementation and the local alternatives are deprecated.
Group-management source already lives in
the Antifraud Controller application; its controlled UI must be exported by
the Antifraud Hosting component package before CH can remove its final local
group adapter.

## Explicitly outside the initial core

- host registry, tenant admission and organization lifecycle policy (Antifraud
  Controller/Hosting);
- research-study administration, research-subject import and genomic workflows
  (tracked above through their human-health to animal-care/specialist migration);
- terminology databases and searches;
- FHIR validation/conversion, DIDComm transport, wallets, signatures, QR
  cryptography, WebRTC signaling and persistence;
- application-specific routes, branding and deployment configuration.

## Delivery order

1. Inventory the current verified components in deprecated sector portals,
   human-health components and consuming portal flavours.
2. Add a contract test for one canonical component per use case.
3. Move the current implementation without changing its data/authority
   boundary, then switch all CH flavours to the published package.
4. Mark old exports deprecated and keep their legacy tests separately runnable.
5. Add web plus Expo adapters only where the same controlled contract is
   genuinely reusable.
6. Remove compatibility implementations only in a later breaking release.


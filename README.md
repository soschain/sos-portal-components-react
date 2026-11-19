# SOS Portal Components React

Shared portal presentation for Personal and Professional applications across
human health, animal care, public safety and other configured sectors. Reuse
one shell, card navigation and subject workflow across Demo and Test Network;
the application supplies the appropriate trusted backend adapter.

## Start with the integration guides

1. [Documentation index](docs/00-INDEX.md): choose the guide for your task.
2. [Portal modes and authentication](docs/01-PORTAL_MODES_AND_AUTH.md): connect
   authentication, storage, providers and protected actions.
3. [Cross-portal use cases](docs/02-CROSS_PORTAL_TUSKR_CASES.md): follow the
   Personal/Professional journeys and their expected readback and denial checks.
4. [Clinical sections and US Core](docs/03-CLINICAL_SECTIONS_AND_US_CORE_CONTRACT.md)
   covers clinical authoring and permission contracts.

Runnable commands, flavour configuration and ports belong in the consuming
application's README. For a local Demo, start the UI/BFF and memory vault.
Add Terminology for clinical coding or cache cases and LiveKit for calls.
Network cases follow the staged dependency sequence in the modes guide.

## Choose an entry point

The root, `clinical`, `care` and `identity` exports compose clinical authoring,
IPS summaries, cards, communications, emergency tasks, notifications and
human/animal identity entry. Selected public entry points include:

| Entry | Use |
| --- | --- |
| `PortalHeader`, `PortalSettingsPanel` | Shared header and controlled account/display settings. |
| `ProfileProtectionGateV2` | Common PIN/passkey profile-protection presentation. |
| `SubjectCardLocatorFields` | Card-number or DID/QR lookup; person/animal and species hints are checked by the host against the registered card. |
| `EncounterJourneyPanel` | Create, status, transfer and saved-journey presentation. |
| `EncounterTransferConsole` | Shared transfer presentation. |
| `SubjectConversationChat` | React Native/Web conversation adapter for authorized subject Communications. |
| `createLiveKitRealtimeCallClient` | Host-configured RTC client. |
| `useRealtimeCallSessionLifecycle` | Persisted-end observation and profile-owned call cleanup, including React Strict Mode replay. |
| `DeviceAssistancePreferences` | Controlled Antifraud device-assistance renderer. |
| `PushNotificationRegistration` | Explicit browser enable, registration status and per-device revoke actions. |
| `EmergencyContactCardDirectory` | Card-linked recipients and primary-contact priority. |

Import `sos-portal-components-react/styles.css` at the application root. Account
pages can import `sos-portal-components-react/device-assistance-preferences`
and its Antifraud CSS entry independently to avoid loading conversation and RTC
modules. The [device lifecycle contract](docs/01-PORTAL_MODES_AND_AUTH.md#7-device-assistance-and-ui-preferences)
covers availability, explicit model preparation and opt-out.

## Connect state and trusted actions

Applications supply branding, authorized subjects, current capabilities and
callbacks. The BFF validates the actor and target, performs protected operations
and returns the resulting state. FHIR utilities own clinical projections and
document builders; SOS Data and SDK layers own operational contracts,
validation, transport, signatures and persistence.

Antifraud Common owns neutral entry, profile-protection and shell renderers.
Antifraud Portal owns neutral identity/evidence and conversation primitives.
Antifraud Hosting owns controller administration, and Terminology components
own terminology controls. Sector packages retain their specialist extensions.
This package composes those public owners and has no UHC or GDC dependency.

SOS supplies the browser theme/density preference adapter and current-subject
context. Use an application-specific preference namespace and supply storage
through the composition root. Calls use a dedicated RTC adapter; their
invitations, terminal states and optional unanswered audio are Communications.
Chat and assistant integrations have independent tests and dependencies.

## Adoption and platform support

The common shell and profile-protection exports are available here. Several
legacy contact, permission and clinical controls still require migration in
their owning applications. Research and other specialist workflows retain
their current owners until a shared boundary is chosen. The catalogue below
lists acceptance targets as well as implemented flows.

Native support is export-specific: conversation has a React Native/Web
adapter, while DOM forms, shell, subject locator and device preferences need
native renderers before Expo use. Reuse their controlled contracts when
adding those renderers rather than creating a separate Demo workflow.

## Use cases and migration

The [use-case catalogue](docs/04-USE_CASE_CATALOGUE.md) retains stable IDs,
acceptance targets, specialist ownership and the migration sequence. Use the
[cross-portal guide](docs/02-CROSS_PORTAL_TUSKR_CASES.md) for executable steps
and expected outcomes. Record which journeys passed and list their execution
variants separately.
### Public product and service discovery

`sos-portal-components-react/public-offering-discovery` exports
`PublicOfferingDiscovery` and `createPublicOfferingCatalogLoader`. Both portal
audiences inject the public feed transport, sector/category options and copy.
The host chooses the Demo or Network endpoint; the renderer and state machine
are identical. Discovery needs no subject selection. Optional `renderServices`
composes existing subject-authorised clinical actions using the same query.
This web DOM component does not establish native/Expo rendering support.

### Real public registry discovery

`sos-portal-components-react/public-registry-discovery` exports
`PublicRegistryDiscovery` and `createPublicRegistrySearch`. Both portal
audiences inject authenticated transport and localized copy into this one
workflow. Browser location is opt-in, retained only in component state and
clearable; denied location preserves manual search. The Antifraud controlled
renderer distinguishes public registry evidence from membership or published
services. Access mode never turns a real registry entry into a synthetic
clinic or a bookable service.

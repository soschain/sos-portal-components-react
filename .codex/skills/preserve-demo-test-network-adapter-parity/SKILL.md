---
name: preserve-demo-test-network-adapter-parity
description: Preserve the same shared UI and use-case props across Demo, Test Network, web and Expo without persistence imports.
---

# Preserve Demo and Test Network adapter parity

Shared components render the same use-case state in Demo, Test Network, web
and Expo. They never select or import persistence. The owning composition root
injects memory for all-local, Expo SQLite for native, IndexedDB for explicit
offline web or a durable Firestore/PostgreSQL adapter.

Keep test profiles separate. CH all-local does not start or require Chat, the
telephone assistant or the optional web assistant. The host injects a dedicated
RTC client and authorized Communication entries; shared UI does not couple them.

Reject Demo-only editors, viewers, navigation, DTOs and storage-aware props.

Promote by access path: relevant local Demo checks -> exact published registry
dependencies and lockfiles -> portal build -> online Demo deployment. Run
online dev:staging/Test Network lifecycle checks afterward; fixes repeat local
affected checks and redeploy. Demo deployment is not Test Network or production
readiness. Network-backed cases retain their local GW/Fabric gates. See
`docs/01-PORTAL_MODES_AND_AUTH.md`; auth, privacy and custody remain mandatory.

## Jurisdiction-scoped acceptance

Jurisdiction-specific journeys are optional and nonblocking for a release
unless the change affects that exact jurisdiction's flow. An unaffected Demo
or general technology-sector lifecycle must not wait for Spain's certificate-
signed PDF or another jurisdiction's documents, provider or fixture. This
does not waive the selected lifecycle's own authentication, authority,
privacy or custody requirements.

When a change affects a jurisdiction-specific flow, its real affected
regression is mandatory. For example, a change to Spain's certificate-signed
Organization PDF admission must validate that Spanish signing, upload and
verification boundary. Select and record the applicable jurisdiction and
journeys before the gate; keep an absent unrelated prerequisite explicitly
out of scope. A selected failure remains a failure: never convert it to a
skip, a synthetic success or a passed release claim. Report journeys
separately from viewport, theme, flavour and access-mode execution variants.

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

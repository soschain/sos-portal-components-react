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

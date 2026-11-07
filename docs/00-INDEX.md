# 00 — Shared portal engineering guides

These maintained guides describe the common contract for Personal and
Professional applications. Product names, logos and deployment hostnames are
application configuration; human health, animal care, public safety and other
sectors determine policy and permitted specializations.

1. [01 — Portal modes, authentication and authority](01-PORTAL_MODES_AND_AUTH.md)
   explains public Demo login, test-only Firebase phones, BFF-owned Demo
   persistence, Test Network lifecycle, Confidential Storage and RTC.
2. [02 — Cross-portal Tuskr cases](02-CROSS_PORTAL_TUSKR_CASES.md) defines
   actor-to-actor journeys, expected readback, negative checks and execution
   evidence for the stable `SOS-PORTAL-001`–`SOS-PORTAL-029` catalogue.
3. [Package README](../README.md) contains the export/ownership map and the
   compact use-case catalogue.
4. [Changelog](../CHANGELOG.md) records dated changes. Email/Teams updates are
   transient messages, not maintained architecture documents.

The owning CH applications document runnable commands, configured flavours,
ports and provider routes in their own numbered README indexes:

- [CH Personal](https://github.com/Fundacion-UNID/connect-health-personal-next#readme)
- [CH Professional](https://github.com/Fundacion-UNID/connect-health-professional-next#readme)

The guides specify acceptance targets. A link, manifest, implemented component
or numbered Tuskr case does not establish that its end-to-end journey passed.
Attach the actual environment and revision evidence to each execution.

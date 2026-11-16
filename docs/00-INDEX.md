# 00 - Shared portal engineering guides

Use these guides when integrating Personal and Professional applications.
Branding and deployment hosts are application configuration; sector policy
controls the permitted specializations and actions.

| Task | Guide |
| --- | --- |
| Find components and public entry points | [Package README](../README.md) |
| Configure login, Demo/Network adapters, storage and RTC | [01 - Portal modes and authentication](01-PORTAL_MODES_AND_AUTH.md) |
| Integrate device preferences and model preparation | [Device assistance lifecycle](01-PORTAL_MODES_AND_AUTH.md#7-device-assistance-and-ui-preferences) |
| Find stable case IDs and plan a migration | [04 - Use-case catalogue](04-USE_CASE_CATALOGUE.md) |
| Execute Personal/Professional workflows | [02 - Cross-portal use cases](02-CROSS_PORTAL_TUSKR_CASES.md) |
| Connect clinical sections, permissions and US Core | [03 - Clinical sections contract](03-CLINICAL_SECTIONS_AND_US_CORE_CONTRACT.md) |
| Review dated package changes | [Changelog](../CHANGELOG.md) |

The cross-portal guide retains stable `SOS-PORTAL-001` through `SOS-PORTAL-029` case
identifiers. Section 15 describes the created-card, contact, Encounter, call and
handover sequence. Record an execution's exact environment and revision, its
observed outcome and cleanup. Count user journeys separately from viewport,
theme, flavour and access-mode variants.

Find runnable commands, ports and configured provider routes in the consuming
applications:

- [CH Personal](https://github.com/Fundacion-UNID/connect-health-personal-next#readme)
- [CH Professional](https://github.com/Fundacion-UNID/connect-health-professional-next#readme)

The guides define expected behavior; execution records establish which
journeys passed. Keep current integration instructions here and dated results
in the changelog or test record. Email and Teams updates are transient messages.

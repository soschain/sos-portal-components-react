# AGENTS.md - sos-portal-components-react

Start with [00 — Documentation index](docs/00-INDEX.md). Follow
[01 — Portal modes and authentication](docs/01-PORTAL_MODES_AND_AUTH.md) and
[02 — Cross-portal Tuskr cases](docs/02-CROSS_PORTAL_TUSKR_CASES.md) when
changing any shared journey. Keep new maintained guides numbered and linked
from that index and the README; transient email/Teams updates are not guides.

Public Demo uses real email account login; fixed Firebase test-phone codes
belong only to controlled tests in ignored configuration. Demo business state
is BFF-owned behind Confidential Storage and does not bootstrap/write a GW.
Test Network separately proves organization/employee/subject authority through
the real BFF/SDK/GW lifecycle. Online dedicated RTC does not change that
boundary, and a call test never implies the lifecycle or child-thread tests
have passed.

Apply
[`preserve-demo-test-network-adapter-parity`](.codex/skills/preserve-demo-test-network-adapter-parity/SKILL.md)
to every shared workflow. Demo, Test Network, web and Expo render the same
components and use-case state. Components never import or select persistence.
Do not combine the CH all-local portal gate with telephone-assistant, optional
web-assistant or Chat integration tests. Calls receive a dedicated RTC client;
their canonical invitation, terminal state and unanswered audio come from
Communication props.

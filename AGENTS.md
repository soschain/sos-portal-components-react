# AGENTS.md - sos-portal-components-react

Apply
[`preserve-demo-test-network-adapter-parity`](.codex/skills/preserve-demo-test-network-adapter-parity/SKILL.md)
to every shared workflow. Demo, Test Network, web and Expo render the same
components and use-case state. Components never import or select persistence.
Do not combine the CH all-local portal gate with telephone-assistant, optional
web-assistant or Chat integration tests. Calls receive a dedicated RTC client;
their canonical invitation, terminal state and unanswered audio come from
Communication props.

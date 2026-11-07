# Developer update — 2026-11-06

Pull the latest `main` branches before continuing Connect Health work.

## Shared components

- `sos-portal-components-react` now lives at
  <https://github.com/soschain/sos-portal-components-react>.
- It owns reusable base portal UI contracts and the canonical subject
  conversation adapter. Branding, routes, BFF calls and sector/role policy
  remain in each application.
- The README contains the Tuskr-ready catalogue for shell, cards, identity,
  communications, child threads, calls, appointments, clinical documents,
  permissions and lifecycle journeys.
- Historical transferred repositories whose name ends in
  `-archive-20261014` are intentionally private archived snapshots. They are
  not development remotes and must not be unarchived or published.

## Demo boundary

- Firebase authenticates the user account.
- The portal BFF validates the synthetic Demo tenant, organization, sector,
  role and PIN against the shared Demo catalogue. Use the term
  **BFF-validated Demo selection**.
- This selection grants no employment, licence, membership, Gateway or
  professional authority. Demo does not use the Gateway.
- Personal workspaces, generated card locators, call signaling and inbox
  projections use the shared `demo-v1` storage namespace. Production is
  rejected and Live/Test Network collections are never used as a fallback.
- Ending an unanswered call projects `missed`; ending an accepted call
  projects `completed` in Communications.

## Two-browser verification

1. Sign in to the Personal Demo, unlock it with a Demo PIN and copy one
   generated card number.
2. In another browser, sign in to the Professional Demo and select a profile
   offered by the BFF-validated Demo catalogue.
3. Resolve the card number and start an audio/video call.
4. Answer or leave it unanswered in Personal, then refresh Communications and
   verify the persisted `completed` or `missed` event.
5. Reset the Personal Demo generation and verify that its former card numbers
   can no longer be resolved.

Test Network and Production keep their normal Gateway/identity/credential
authority paths and must not reuse this synthetic Demo boundary.

# Testing

## Working directory and runtime

Run commands from `tests/test5/lancealot` relative to the repository root. Use the Node engine declared in package.json; Node 24 is the validated local line. Ensure the Node selected by npm scripts also meets it. Build/test results for a particular session belong in the feature plan/HANDOVER, not here.

## Unit and build checks

- `npm test`: Vitest in Node, covering the public account service and public-configuration validation. The gateway is an external-system fake; these tests verify business access/error/recovery behavior, not Supabase auth/RLS.
- `npm run build`: vue-tsc plus the Vite production build. `npm run type-check` is available for a type-only pass; build-only does not include it.
- No lint script or automated real-browser suite is configured.

Keep tests at the agreed account/session and ownership interfaces. Red/green changes should exercise observable behavior, not mock private implementation details. Configuration tests must not print credentials.

## Real Supabase integration — explicit opt-in

`npm run test:integration` uses a separate configuration and skips when RUN_SUPABASE_INTEGRATION is not 1. Skipped tests are not passing backend evidence. The user has deferred these checks; do not connect/provision a backend just because the files exist.

When separately resuming backend checks, prepare an isolated synthetic project with reviewed/applied migrations, an approved allowlist and two distinct verified synthetic accounts. Copy `.env.integration.example` to ignored `.env.integration.local` locally; fill the public endpoint/key and two test-account credentials without putting values in chat or documents. Enable the flag only for that isolated environment. The runner validates public-key configuration and exercises real SDK account/owned-workspace interfaces and direct cross-owner read/write attempts.

The suite covers own access, cross-owner preference isolation and rejection of owner/status changes. It does not yet prove unverified-signup rejection, all callback/SMTP behavior, deployed hook configuration, deletion, records, digests or operational limits. Add those scenarios as their slices are implemented. No privileged/service-role key is required or allowed as a browser integration key.

## Frontend review and visual parity

Run the dev server, then inspect `/__preview?screen=sign-in` and `/__preview?screen=workspace`. Screen/state controls provide populated/empty/loading/error/success/expired/unapproved examples without real auth. Use fictional input only. Actual sign-in routes remain connection-dependent, not demo login.

With a permitted real browser, inspect desktop, medium and narrow widths against DESIGN.md/the accepted HTML reference. Check keyboard focus, form labels/errors, matching passwords, verification/recovery states, mobile detail/back navigation, owner/session changes and absence of startup errors. Record screenshots and intentional differences in the feature plan. If the browser is unavailable, preserve the evidence gap rather than substituting DOM stubs, source checks or HTTP responses.

For account-state corrections, check expired verification keeps its resend form and expired password reset offers recovery. With the isolated backend available, check denied/unavailable protected-route and auth-change redirects display the correct safe message. Existing account/config unit tests do not cover these Vue/router symptoms; retain this gap until a suitable navigation/browser regression seam is agreed and exercised.

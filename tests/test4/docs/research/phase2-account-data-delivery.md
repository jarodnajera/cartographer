# Phase 2 account, data and delivery integration findings

## Question and scope

Which documented Supabase/PostgreSQL behaviors constrain private-account enforcement, password-confirmed erasure, consistent export and meaningful verification? Sources retrieved 2026-10-28. Supabase docs describe the current JavaScript API (no SDK pinned/installed); PostgreSQL current docs resolve to version 18. The eventual Supabase database version and runtime/SDK compatibility must be checked during setup.

## Answer

Auth deletion alone is insufficient for immediate app-access denial because issued JWTs can outlive it. Keep an authoritative active-account check in database policies and privileged execution, and verify the entered password rather than treating the OTP reauthentication method as password proof. Exact-decimal storage and a consistent database snapshot support invoice/export correctness. These conclusions inform proposed implementation, not performed verification.

## Findings

- Supabase says removing an Auth user does not invalidate already-issued JWTs until expiry; deleting the identity removes refresh/session records, and session checks can close sensitive-operation access windows. **Design inference:** RLS and handlers must deny non-active/missing accounts, and a stale token must not recreate deleted settings or records. [User management](https://supabase.com/docs/guides/auth/managing-user-data).
- The administrative deletion method is server-only and requires privileged credentials. **Design inference:** account erasure belongs in an authenticated privileged handler, never a browser admin client. Do not rely on ordinary parent-deletion protections as the erasure mechanism; controlled owner-wide cleanup needs its own reviewed path. [deleteUser](https://supabase.com/docs/reference/javascript/auth-admin-deleteuser).
- `reauthenticate()` sends an OTP; `signInWithPassword()` verifies email/password credentials. **Design proposal:** validate the caller's current identity, verify the submitted password using that identity's email in an isolated nonpersistent Auth client, verify returned user ID matches the caller, then bind the successful check to this deletion request. Never persist/log the password or reauthentication tokens. This is not a built-in one-call delete-with-password guarantee. [reauthenticate](https://supabase.com/docs/reference/javascript/auth-reauthenticate), [password sign-in](https://supabase.com/docs/reference/javascript/auth-signinwithpassword).
- RLS policies and grants govern client operations; privileged service execution bypasses ordinary policies. **Design inference:** test direct cross-user record reads/writes/links, grants, active-account checks and all privileged paths independently of route guards. [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
- PostgreSQL `numeric` is exact, while floating-point types are inexact. **Proposal:** use positive finite numeric amounts; carry decimal strings through JSON/JavaScript to avoid converting exact values into binary floating-point amounts. Do not silently round invalid currency precision. [PostgreSQL 18 numeric types](https://www.postgresql.org/docs/current/datatype-numeric.html).
- At Read Committed, separate statements may see different snapshots; Repeatable Read provides a transaction-wide snapshot. **Proposal:** assemble all export collections in one database statement/snapshot, or use a verified Repeatable Read transaction when multi-statement assembly is necessary. Separate paginated client requests are not a consistency guarantee. [PostgreSQL 18 isolation](https://www.postgresql.org/docs/current/transaction-iso.html).
- Supabase documents pgTAP/database-policy tests; local `supabase test db` requires a started local stack. Vue recommends Vitest for Vite-based unit testing. **Proposal:** database policy/state/concurrency verification plus Vitest for domain/client interfaces; browser-flow checks complement them. These tools are not installed or executed by this planning work. [Database tests](https://supabase.com/docs/guides/database/testing), [CLI test prerequisites](https://supabase.com/docs/reference/cli/supabase-test), [Vue testing](https://vuejs.org/guide/scaling-up/testing.html).

## Conflicts, gaps and open questions

No conflict found between selected sources and agreed product scope. Remaining design work includes deletion/dispatch race ordering, provider idempotency and unknown-send outcomes, scheduler claim leases and same-day retry cutoff. Email vendor, limits and budgets remain deferred launch gates, so no delivery SLA, paid plan, retention duration or recovery target is inferred. Currency metadata/source selection and supported precision require validation before finalizing invoice validation. Local Supabase/container availability, package/runtime compatibility and actual policy behavior have not been checked.

## Sources and versions

Linked official pages above were read on 2026-10-28. PostgreSQL reference version: 18; actual project database version unobserved. Supabase/Vue documentation is unversioned current guidance; no SDK or test-tool package version was selected or installed.

## Follow-up verification — 2026-10-28

- SIX identifies itself as the ISO 4217 maintenance agency and publishes current List One, historical List Three and minor-unit information. This provides the authoritative source for a dated currency/precision table; it does not choose the project's current/historical currency coverage. That remains AT6. [SIX currency-code maintenance and lists](https://www.six-group.com/en/products-services/financial-information/market-reference-data/data-standards.html).
- PostgreSQL 18 documents that STABLE functions use the calling statement's snapshot. Proposal: assemble export collections in a read-only, correctly classified function/single statement so concurrent client edits do not produce unrelated collection snapshots. This must still be demonstrated by integration tests and rechecked against the actual database version. [Function volatility](https://www.postgresql.org/docs/current/xfunc-volatility.html).
- Playwright documents browser-based end-to-end testing with Chromium, Firefox and WebKit. Proposed verification uses it for real-browser account, tracking, Today/settings and export/deletion flows; no package/browser was installed and no script was added. [Playwright introduction](https://playwright.dev/docs/intro).

Currency code normalization, coverage and data updates are project policies rather than claims supplied by the source. The proposal does not introduce exchange-rate data or a paid/live currency API.

## Phase 3 implementation findings — 2026-10-28

The earlier sections describe planning-time observations. Implementation now pins @supabase/supabase-js 2.118.0 and vue-router 5.4.0; package-lock.json records exact dependencies. The installed Supabase client supports an accessToken callback; the gateway uses it to pin each request to a verified captured token without another persistent Auth store. Hosted behavior remains unverified. [Supabase client initialization](https://supabase.com/docs/reference/javascript/initializing), [getUser](https://supabase.com/docs/reference/javascript/auth-getuser), [Vue Router](https://router.vuejs.org/).

SIX historical List Three supplies codes but omits minor-unit precision. The implementation combines dated SIX current/historical codes with published Unicode CLDR 49 fraction/default rules for historical precision; this policy and source dates are captured in lancealot/src/data/CURRENCIES.md. Saved invoice precision remains stable when its currency is unchanged. This supports 294 monetary codes, excluding test/no-currency/metals and non-monetary special units. [SIX lists](https://www.six-group.com/en/products-services/financial-information/market-reference-data/data-standards.html), [Unicode currency fractions](https://unicode.org/reports/tr35/tr35-numbers.html#Supplemental_Currency_Data).

An optional, disabled-by-default Resend adapter records idempotency keys and separates known rejection from unknown acceptance. Resend documents a 24-hour idempotency window; provider idempotency does not replace persistent application tracking. Transport failures, 5xx and ambiguous idempotency conflicts do not trigger blind resend. This is an implementation option, not approval of a vendor, cost, limits or production configuration. [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys), [API errors](https://resend.com/docs/api-reference/errors).

Both Edge handlers explicitly authenticate inside their handlers and use verify_jwt=false configuration accordingly. Entry-point deployment and runtime compatibility remain pending. [Supabase function configuration](https://supabase.com/docs/guides/functions/function-configuration).

Actual local verification: migrations executed by PGlite PostgreSQL 18.6 with an Auth-role shim, six Vitest suites/32 tests and frontend type-check/build. This bounded adaptation provides SQL/state evidence without a configured Supabase project; it does not establish hosted Auth, genuine multi-session concurrency, deployed Edge/Cron or email delivery. Playwright/pgTAP fixtures are authored but unrun. Browser discovery returned no instances. Pricing, region and operating ownership remain unresolved D18 gates.

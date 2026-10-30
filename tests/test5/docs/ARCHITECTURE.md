# Implemented architecture

Status: Account/frontend slice implemented; live backend checks deferred by the user. This is not a deployed-system verification record.

## Frontend and account interfaces

The Vue/TypeScript/Vite application lives in `lancealot/`. `src/main.ts` installs the router and shared CSS. AuthView renders sign-in/up, verification, recovery/reset and callback states in accepted C styling; WorkspaceView renders the guarded shell. Record-entry actions remain disabled because record tracking is the next milestone.

`src/accounts/service.ts` is the public account/session interface: it checks current identity, email verification, active ownership and recovery context. It receives an external gateway rather than creating a provider internally. Unit tests exercise this interface with external SDK fakes; they do not verify provider enforcement.

`supabase-gateway.ts` is the real SDK adapter for password flows, server-validated current user, PKCE exchange and owned workspace reads. `runtime.ts` creates it only from valid public configuration, outside the development preview route. The router admits `/workspace` only after service access is ready and rechecks protected access on auth changes. Denied/unavailable access results remain in memory and are displayed on the sign-in screen after guarded redirects; verification-required access routes to verification. AuthView separates verification expiry/resend from password-recovery expiry. Scoped Playwright account-state re-checks now confirm verification/recovery UI and unconfigured-service navigation; configured-account denial/unavailability still awaits the deferred backend. Database/RLS checks are still necessary even when routing is correct.

## Preview and presentation

`/__preview` is registered only in development. It uses the same Vue screens, scoped fictional props and independent in-memory review state; opening it directly avoids Supabase-client creation. Leaving it reloads the actual sign-in page. Production routing does not provide a demo-login fallback. The earlier HTML design reference remains under docs/design/previews/; no throwaway handlers were copied into the account service.

Shared colors/type/layout are canonical in DESIGN.md. The app bundles Manrope and its OFL license locally. Scoped account-state screenshots/interactions now exist in the feature plan’s browser evidence. Full parity, keyboard/accessibility and workspace checks remain incomplete; a successful build is not visual evidence.

## Prepared backend foundation

The Supabase directory contains a local config template, synthetic allowlist seed and an unapplied SQL migration. The migration proposes restricted signup (Auth hook plus database backstop), automatic per-user workspace creation, verified/allowlisted active-owner RLS and limited preference updates. Users receive no privilege to change owner/status. No real auth/database instance has run these rules; TOML syntax and source review do not establish SQL correctness or enforcement.

ADR 0001 owns selected backend rationale. ADR 0002 owns later resumable deletion coordination. The status field prepares an access gate but does not implement deletion, records, digests or cleanup jobs. D16 providers/plans/region, costs, operating ownership and numeric policies remain unresolved before real-data public beta.

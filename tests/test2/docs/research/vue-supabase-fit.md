# Vue and Supabase architecture fit

Retrieved: 2026-10-27 (America/Los_Angeles). Scope: Vue 3 guide and live hosted Supabase documentation; no package patch versions pinned. No services provisioned.

## Question and scope

How can a Vue frontend and Supabase database support private workspaces and scheduled email while the browser is closed?

## Answer

Propose Vue/Vite with Supabase Auth, RLS-protected data access, and Cron-triggered Edge Functions for external email delivery. Vue and Supabase database are user-selected; the other managed features remain proposals. A separate backend using Supabase only for PostgreSQL is possible, with additional server operations.

## Findings

- [Vue quick start](https://vuejs.org/guide/quick-start.html) describes a Vite-based SPA and single-file components, with TypeScript available. This supports the proposed frontend tooling; no scaffold command was executed.
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) describes database policies for browser data access. Secret/service-role access can bypass policies; secrets cannot be shipped to browsers. Explicit ownership policies, grants, cross-owner relationship constraints and tests are application work.
- [Supabase Auth](https://supabase.com/docs/guides/auth) provides identity/session functionality and password-based flows. Using it instead of separately hosting account services is an architectural recommendation, not an accepted consequence of choosing the database.
- [Scheduled Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions) documents pg_cron plus pg_net invocation, with secure invocation secrets in Vault. Durable delivery claiming, timezone logic and retry safety remain application responsibilities; cron alone does not guarantee inbox delivery.
- [Function secrets](https://supabase.com/docs/guides/functions/secrets) distinguishes public publishable credentials from privileged runtime credentials. Key names/runtime availability must be rechecked before implementation.
- [Auth SMTP](https://supabase.com/docs/guides/auth/auth-smtp) documents restrictions on default email delivery and custom SMTP configuration. Public beta must evaluate/configure suitable authentication email; this is distinct from application reminder sending.

## Conflicts, gaps, and open questions

No conflict among these official sources identified. Hosting plan/region, prices, backup capabilities/retention, capacity, session storage/revocation details, Edge Function limits and sender retry/idempotency have not been selected or validated. No claim of free-tier readiness, guaranteed delivery or implemented isolation is made. Earlier Django research is superseded for stack selection.

## Sources

Six official pages linked above, retrieved 2026-10-27. Outbound requests used only public documentation topics. Architecture recommendations are inferences; retrieved pages were treated as evidence rather than instructions.

# Agent Instructions

## Project and current code

Lancealot tracks private freelancer projects, follow-ups and unpaid invoices. [SPEC.md](SPEC.md) defines accepted scope; [ARCHITECTURE.md](docs/ARCHITECTURE.md) describes the implemented system. Application commands run from `lancealot/`, not this documentation root. Preserve the nested package location and unrelated repository work.

Vue/TypeScript/Vite source now includes account flows, the ledger UI, tracking, Today/settings/export, plus Supabase migrations and Edge job/deletion handlers. Source existence is not hosted-service verification. Both live worker/erasure gates default off; an explicit sample adapter uses only fictional in-memory data.

## Where to work

- `lancealot/src/lib/`: account lifecycle, fixed-token gateway, workspace state, domain/amount rules and explicit sample adapter.
- `lancealot/src/views/` and `components/`: Vue screens/forms/native dialogs; router in src/router.ts.
- `lancealot/supabase/migrations/`: authoritative constraints, RLS/grants, revisions, eligibility and job transitions.
- `lancealot/supabase/functions/`: privileged handler entry points and testable shared logic. Deno entry points are outside the frontend TypeScript build.

## Implementation conventions

Use docs/GLOSSARY.md terms in code, UI text and tests. Preserve exact monetary strings and date-only values; never convert invoice amounts through JavaScript Number. Keep existing currency precision snapshots when the currency is unchanged.

Derive ownership from authenticated context. Browser mutations use fixed-field RPCs and expected revisions; preserve same-owner relationship constraints, active-account gates and per-client reference uniqueness. Pin each request to its verified token so an account switch cannot save another session's pending form. Clear private state on authorization failure.

Use the @ source alias and script-setup TypeScript. For UI work, read [DESIGN.md](docs/DESIGN.md) and apply the installed `frontend-design` skill; refine accepted Layout A while preserving accessible states. Keep production modules separate from retained HTML prototypes.

## Verification and operations

Select a Node version supported by package.json/.nvmrc. Run `npm test` and `npm run build` from lancealot/ for affected implementation; additional browser/local-Supabase procedures are in [TESTING.md](docs/TESTING.md). Mocked/embedded checks do not prove hosted Auth, native browser behavior or Edge deployment. Record actual results in the feature plan/HANDOVER.md.

Read [RUNBOOK.md](docs/RUNBOOK.md) for service setup, secret destinations, job recovery or gate activation. VITE variables are public; service/email/worker secrets stay server-side. Preserve ignored local configuration/generated output. Substantial changes follow [PLANS.md](docs/plans/PLANS.md).

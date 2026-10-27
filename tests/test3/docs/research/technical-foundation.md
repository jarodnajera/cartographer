# Technical foundation options

## Question and scope

Which web foundation fits a desktop-first private-workspace project/invoice tracker
with daily timezone-based digest email? Review implementation options, not costs or
production readiness. No implementation is authorized in the current session.

## Current decision

Superseded proposal: the user selected Vue.js and Supabase PostgreSQL, followed by
Supabase Auth/RLS/Cron/Edge Functions. See [current research](vue-supabase-foundation.md).
The findings below preserve the evaluated alternatives, not current recommendations.

## Answer

**Proposed design inference (D12):** Django with server-rendered pages and PostgreSQL
fits forms/lists with one application and framework authentication/database tooling.
Next.js/PostgreSQL is a credible alternative for a React/TypeScript maintainer;
authentication library/service selection would remain necessary. Neither stack is
selected at this snapshot. A scheduled process and email adapter serve either.

## Findings

- [Django authentication, documentation 5.2](https://docs.djangoproject.com/en/5.2/topics/auth/default/)
  describes users, sessions, permissions, login/logout and password-management
  facilities. **Inference:** useful foundations, not automatic workspace isolation
  or a complete verified-email signup flow; those require explicit application work.
- [Django database support, documentation 5.2](https://docs.djangoproject.com/en/5.2/ref/databases/)
  includes PostgreSQL. Supported Python/database versions and a maintained Django
  release must be pinned at setup; documentation version is not a selected version.
- [Next.js authentication guide](https://nextjs.org/docs/app/guides/authentication)
  covers authentication and authorization and library options. **Inference:** viable
  alternative with auth-library choices compared with Django's integrated base.
- [Render scheduled jobs](https://render.com/docs/cronjobs) supports periodic commands,
  uses UTC schedules, delays a scheduled run if its prior run is active, and bills
  for active compute with a documented minimum. **Inference:** one periodic sweep
  can calculate each user's local date/time in application logic; runtime, startup,
  throughput and cost need validation against the 15-minute handoff target. This
  is an illustrative host, not a selection or pricing quote.
- [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
  documents deduplication of matching requests within a 24-hour window. **Inference:**
  combine provider idempotency with durable application send records; do not assume
  perpetual provider deduplication or promise mathematically exact inbox delivery.

## Conflicts, gaps, and open questions

No source conflict identified. Stack, host and email provider are not selected.
No price estimate, free-tier suitability, installed dependency, setup command, or
end-to-end performance has been verified. Auth choice, data lifecycle, operating
policies, and the remaining design review are awaiting user decisions. Research
establishes viability, not production readiness or acceptance of additional scope.

## Sources

Retrieved 2026-10-27 from the official URLs above. Django docs use 5.2; Next.js and
provider pages are live unpinned documentation. Exact maintained runtime/framework
versions will be verified during setup guidance. Generic public queries only;
retrieved text was used as evidence, not instructions.

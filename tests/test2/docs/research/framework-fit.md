# Framework fit for a small hosted tracking product

Status: Superseded for stack selection by the user-selected Vue/Supabase direction. See [current research](vue-supabase-fit.md). Retained as historical research, not the current design.

Retrieved: 2026-10-27 (America/Los_Angeles). Documentation series: Django 5.2. No dependencies installed.

## Question and scope

Does Django provide a reasonable foundation for server-rendered private workspaces, timezone-aware reminders, and outbound email, without a separate frontend service?

## Answer

Yes, as an architectural recommendation: Django provides authentication, timezone handling, and email interfaces. These capabilities support a proposed modular web application. Application-specific workspace isolation, signup verification, reminder scheduling, retries, and delivery monitoring still require design and implementation.

## Findings

- [Django 5.2 release notes](https://docs.djangoproject.com/en/5.2/releases/5.2/) identify 5.2 as an LTS release and list supported Python series. Use a supported, patched runtime and framework at implementation time rather than pinning an unverified patch today.
- [Authentication documentation](https://docs.djangoproject.com/en/5.2/topics/auth/default/) describes user objects, authentication, permissions, sessions, and password-management workflows. This is not evidence of automatic per-workspace object isolation or a complete verified-email signup flow.
- [Timezone documentation](https://docs.djangoproject.com/en/5.2/topics/i18n/timezones/) describes UTC storage of aware datetimes and conversion for user timezones. Date-only business deadlines still need explicit application semantics.
- [Email documentation](https://docs.djangoproject.com/en/5.2/topics/email/) describes sending interfaces and development/testing backends. Email sending is distinct from scheduling, provider acceptance, and inbox delivery.

## Conflicts, gaps, and open questions

No conflict among these official versioned sources was identified. A search returned mixed patch-version information; no exact latest patch is claimed. Hosting, PostgreSQL version, scheduler mechanism, email vendor, pricing, region, and operational limits are not evaluated. A periodic command plus database delivery records is a design proposal, not a framework guarantee. Provider idempotency capabilities must be checked before claiming safe retries of ambiguous email sends.

## Sources

The four primary documentation links above were retrieved on 2026-10-27. No private project details were included in outbound queries. Recommendations are the assistant's inference from requirements and documented capabilities.

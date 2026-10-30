# Local runbook

## Start the frontend

From `tests/test5/lancealot`, use a compatible Node from package.json and run:

```sh
npm ci --ignore-scripts
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

If npm reports an older Node or missing node:util/styleText, align its PATH/runtime first; installing dependencies under an old Node does not prove they run. The compatible Node must be used by child npm scripts as well.

Review `/__preview?screen=sign-in` or `/__preview?screen=workspace` for selected-C frontend states with fictional data. This route is development-only; it does not authenticate or persist a real workspace. Record-entry actions are placeholders for the next milestone. The earlier complete design reference stays in docs/design/previews/.

Without backend configuration, real account forms show service-not-ready and the guarded workspace does not open. There is no fake-auth fallback. `npm run build` type-checks/builds; `npm run preview -- --host 127.0.0.1` serves an existing production build. No deployment provider or public registration is configured by these commands.

## Connect an isolated backend later

Live backend checks are deferred by explicit user instruction. The [Supabase local-development guide](https://supabase.com/docs/guides/local-development) describes the standard CLI/container prerequisites; neither a runtime nor CLI was available at the readiness inspection. Do not install/provision them implicitly.

When authorized, review the prepared supabase/config.toml, migration and synthetic seed in an isolated environment. The template requires verified email and configures the [Before User Created Hook](https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook); exact template/SQL execution remains unverified. The [CLI config reference](https://supabase.com/docs/guides/local-development/cli/config) explains callback and local email settings. Local ports and Postgres version in the template are development defaults, not production capacity/retention/retry policies. Resolve production values through D16.

Copy `.env.example` to ignored `.env.local` and fill only the Supabase URL and publishable key (or legacy anon key). Privileged keys are never VITE_ values. Restart Vite after configuration changes. Configure exact `/auth/callback` URLs for the origin in use; PKCE code exchange occurs in the frontend adapter. Verification/recovery links need the originating browser’s PKCE context. A refreshed reset screen without recovery context requests a new link rather than assuming an ordinary session authorizes recovery.

Apply/review restrictions and run TESTING.md’s real integration checks before claiming verified accounts or ownership enforcement. The example allowlist contains only reserved synthetic addresses; no real account or password is seeded. A hosted test project also needs separately reviewed sender/configuration and credentials; no plan or purchase is preapproved.

## Secrets, recovery and remaining operations

Local config/credentials remain in ignored files; share variable names and errors without their values. Keep the prepared migration/seed and public examples versioned, not actual keys or passwords. No reset/migration was executed against any data by this slice.

Backend deletion, signup-abuse policies, SMTP/digest delivery, backup/restore, support/operator assignment and numeric operating thresholds remain unverified or deferred. ADR 0002 describes the accepted deletion design, not a runnable recovery procedure. Real-data public beta stays blocked on D16 and the spec’s release gates.

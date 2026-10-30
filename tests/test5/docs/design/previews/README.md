# Lancealot isolated visual comparison

Status: Accepted design reference — structure A / appearance C and cross-screen prototype accepted with DESIGN.md/three plans on 2026-10-30; browser evidence gap retained. Not a production application.

## Open and compare

Open [index.html](index.html) in a browser, or serve this directory locally. From the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory tests/test5/docs/design/previews
```

Then open http://127.0.0.1:8765/?variant=C&screen=projects. A localhost-only server is currently running on port 8765; an HTTP check returned the exact generated file. The command above can restart it after the session ends. If that port is occupied, choose another available port. A direct local-file opening should also load the bundled fonts; browser-specific behavior is not verified.

Use the bottom controls or left/right arrow keys to compare the same screen:

- A, Ledger: Public Sans, compact aligned rows, restrained white workbench and navy sidebar.
- B, Open water: Instrument Sans, more breathing room, pale-blue sidebar and vertical deadline marker.
- C, Blueprint: Manrope, strong project titles, bright list and a deep-blue detail panel.

All retain the selected sidebar/list/detail-panel structure. On narrow screens, select a project to open its full-width detail view and use Back to projects to return. All fixtures are fictional; no real accounts, backend, data storage or email service is connected. Refresh resets changes. C is the selected appearance. The same artifact is now extended across the selected feature screens; final combined structure/appearance/plan acceptance was explicitly given with browser rendering/screenshots still unverified.

## Review controls and states

Select projects; filter Active/Completed/Archived; search; add/edit a project; toggle tasks; complete/archive/restore a project. Archival/completion do not mutate child records. Linked-invoice client reassignment is visibly blocked in this UI demonstration; it does not establish database/RLS enforcement.

Use the State selector to inspect populated, empty, loading, load-error and forced save-error scenarios. Empty/error/loading are simulated views, not actual data loss/network requests. Save-error mode intentionally keeps failing until changed; typed input is retained. Close the form to change scenario. Type & controls opens a specimen of the selected typeface, palette, form, actions and empty/error treatment. The sidebar now opens Today, Clients, Projects, Invoices and Settings. Screen controls additionally open auth/recovery, digest and deletion-receipt views. These are in-memory styled flows, not a completed app or evidence of real services.

## Selected-C final prototype walkthrough

The Screen selector and `screen=` query provide: projects, clients, invoices, today, settings, digest, signin, signup, verify, recovery, reset, deleted. C remains selected by `variant=C`; A/B stay available for comparison history.

1. Projects: select/edit/create; add/edit/complete/reopen tasks; archive/restore/complete/reopen projects. Multiple linked invoices remain visible; changing a project’s client is blocked while invoice links remain.
2. Clients and invoices: create/edit records, archive/restore clients, mark full invoices paid/unpaid. Invoice project choices stay with the selected client. Currency choices are representative fixtures, not the final supported-currency catalog or decimal-validation implementation.
3. Today: qualifying open tasks, approaching/late active project deadlines and overdue unpaid invoices, including unresolved work under archived projects. The fixture date is fixed at 2026-10-30; this is not a deployed scheduler/timezone/DST test. Email digest previews go only to the fictional account and omit free-text notes.
4. Settings: confirm timezone/time and explicitly enable email; email stays off until configured. No email is actually sent. Download JSON produces a real local file containing only fictional in-memory data, not a production schema/restore contract or operational backup.
5. Account deletion: optional export, fictional password re-entry and irreversible confirmation. The receipt distinguishes accepted/pending, incomplete cleanup (Error state) and complete (Success state); no invented duration is shown. No actual auth account/data/backups exist to delete. Screen controls can explicitly reset the fictional account to inspect other flows; a real deleted account must not regain access that way.
6. Auth: sign-in/up, verification/resend, recovery/reset, expired-link/unapproved-email/error/success states. Any entered credentials remain local to the page; use fictional values only. Passing these demonstrations does not establish allowlist enforcement, verified identity, current-session validation or RLS.

The optional export uses the entire current fixture snapshot and keeps currency/date/relationship content; actual snapshot transactionality, stable identifiers, stale-token blocking, cleanup retries, scheduling and external delivery remain implementation requirements in the plans, not browser-preview claims.

The preview chrome is separate from product UI. Query `variant=A`, `B`, or `C` identifies a direction. Arrow shortcuts do not intercept form fields or open dialogs. The isolated artifact is not imported by the application; never promote its demo handlers as production logic.

## Verification and limits

Passed: JavaScript syntax via `node --check` (Node v24.22.1); static local-asset/ID/reference checks; exact-file HTTP response from the localhost server for the earlier comparison; extension-serving checks recorded separately; TTF headers and bundled OFL 1.1 license presence; source hashes; measured color ratios. No application installation/build or real-service test ran.

**Not passed:** opening the page in a real browser, font-load verification, startup-console inspection, desktop/mobile screenshots, layout/focus/interaction testing and rendered screenshot critique. The permitted browser reported no available connection on 2026-10-30. Static checks are not substitutes for these checks. Please review the actual page at desktop and narrow widths, including keyboard focus and error/form states. Human feedback will be recorded separately from agent verification.

Measured pairs used for text: #012a4a on white 14.67:1; #2a6f97 on white 5.50:1; white on #014f86 8.52:1; #012a4a on #a9d6e5 9.39:1; white on #013a63 11.75:1; #a9d6e5 on #013a63 7.52:1; #013a63 on #89c2d9 6.03:1. #468faf on white is 3.62:1, so it is used for non-text boundaries rather than small text. These ratios alone do not establish WCAG compliance.

[Font sources, hashes and licenses](FONT-SOURCES.md) · [Direction rationale](../visual-directions.md) · [Feature plan](../../plans/private-accounts-and-project-tracking.md).

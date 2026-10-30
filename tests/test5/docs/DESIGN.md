# Lancealot Design Guide

Status: Accepted — 2026-10-30, together with the three written plans and prototype structure/appearance; browser rendering/screenshots remain explicitly unverified.
Last updated: 2026-10-30 (America/Los_Angeles).

## Audience, tone and identity

Individual freelancers managing private client work, deadlines and invoices. Precise/professional, minimalist and calm. Use the Lancealot wordmark only; no lance, quest or medieval motif. Use plain verbs and sentence case. Status labels describe domain states, not implementation. Accessibility target remains WCAG 2.2 AA for core flows.

The user supplied the blue palette below and chose self-hosted open-license fonts. No extra logo/brand restrictions or accessibility needs were supplied; do not invent them or infer a waiver of accepted requirements.

## Direction record

Structure A was selected: persistent sidebar, list and detail panel; narrow screens use full-width detail/form views. The user selected appearance C, Blueprint, saying “C looks great” after receiving the actual HTML comparison. Its defining detail is a bright working list beside a deep-blue selected-record panel, with Manrope typography.

A Ledger (compact Public Sans/navy workbench) and B Open water (airy Instrument Sans/pale-blue surfaces) were compared but not selected. No negative verdict or reason for rejecting them was supplied. Keep their preview variants as reference; apply C to the product.

## Design tokens

These named tokens map to the selected preview's CSS custom properties. Exact spacing/type scale is a changeable implementation default preserving the selected hierarchy; ownership, content, accessibility and product behavior remain requirements.

| Role | CSS variable | Value |
| --- | --- | --- |
| Main text | `--ink` | #012a4a |
| Focus/detail plane | `--navy` | #013a63 |
| Primary action | `--blue` | #014f86 |
| Supporting text, light surfaces | `--muted` | #2a6f97 |
| Supporting text, dark surfaces | `--muted` locally | #a9d6e5 |
| Selection/highlight | `--pale` | #a9d6e5 |
| Decorative light divider | `--line` | #cbdfe8 |
| Dark-panel divider | `--line` locally | #468faf |
| Paper | `--surface`, `--paper` | #ffffff |
| Quiet canvas | `--surface-soft`, `--wash` | #f7fafc; C workspace is white |
| Keyboard focus | `--focus` | #014f86 on light; #a9d6e5 on dark |
| Typeface | `--font` | Manrope, sans-serif fallback |
| Small/body/title scale | `--type-small`, `--type-body`, `--type-title` | 12px / 14px / 30px |
| Spacing | `--space-1` through `--space-7` | 4, 8, 12, 16, 24, 32, 48px |
| Control/detail radius | `--radius-control`, selected `--radius` | 3px |
| Dialog radius | `--radius-dialog` | 12px |

Full supplied palette: #012a4a, #013a63, #01497c, #014f86, #2a6f97, #2c7da0, #468faf, #61a5c2, #89c2d9, #a9d6e5. Pale intermediate blues support selection/boundaries; they are not automatically suitable for small text. White and quiet blue-tinted neutrals provide readable surfaces, rather than forcing all ten colors into each view.

Manrope is bundled unchanged with OFL 1.1 and source hashes in [font sources](design/previews/FONT-SOURCES.md). Use local assets with `font-display: swap` and a sans-serif fallback. Never assume downloaded assets are final installed application dependencies. In the selected preview, headings use roughly 600–750 weight, body 400–500, clear tabular amounts/dates and a compact 1.5–1.7 body line height. Keep text blocks below roughly 80 characters where practical. No generic marketing hero, gradient decoration or repeated metric-card grid.

## Components and states

Sidebar wordmark/navigation, list rows, selected-record plane, explicit form labels, state text and clear named actions form the shared system. Lists keep project/client/date context; the record plane contains lifecycle, tasks, linked invoices and notes. Show currency with amounts and never combine unlike-currency totals. Status must remain understandable without color. Auth screens are outside the private workspace, using the same navy plane and typography.

Forms have labeled inputs, preserved entries after failed saves, visible validation, success feedback and loading/disabled states. Use Add project, Save project, Mark paid, Restore project and Delete account permanently consistently. Dialogs have titles, keyboard access and an explicit close/cancel action. Credential forms and the prototype's fake authentication do not establish production identity/security behavior.

Today groups task follow-ups, project deadlines and overdue invoices, including unresolved items under archived projects. Email disabled is distinct from an empty reminder list. Settings separates reminder preferences, export and irreversible deletion. Deletion distinguishes confirmation, request accepted/access blocked, incomplete cleanup and completion; backup expiry is not implied by active-data cleanup. Final policy wording depends on D16 before real-data public beta.

## Motion

No decorative entrance animation. A purposeful focus/expanded-view change may indicate user action; preserve reduced-motion preferences. Do not introduce motion to disguise loading/failure. Prototype state changes are demonstrations, not measured performance.

## Accessibility

Use visible keyboard focus on both light/dark surfaces, explicit labels, appropriate live status/error feedback, logical headings, usable controls and color-independent states. Verify native-dialog focus/escape behavior, narrow-screen navigation and downloads in a real browser before claiming them passed. Production auth/RLS/deletion checks require integration evidence separately.

Measured text contrasts: ink/white 14.67:1; supporting blue/white 5.50:1; white/action blue 8.52:1; ink/pale 9.39:1; white/navy 11.75:1; pale/navy 7.52:1. #468faf/white is 3.62:1, suitable for boundaries rather than small text. Do not infer full WCAG compliance from these calculations.

## Responsive behavior

Desktop preserves sidebar/list/detail hierarchy. The preview switches project detail to a full-width selection view below 940px, with Back to projects preserving list context. Below 600px navigation is horizontal, content is single-column and forms/dialogs fit the viewport. Settings/record pages stack on narrower widths; auth changes from navy-side/form split to a compact vertical flow. These breakpoints are changeable defaults, not device support promises.

Representative pending browser review: approximately 1440px desktop, 768px medium and 390px narrow widths; inspect long titles, currency/date wrapping, keyboard focus, open dialogs and state controls. Neither the CSS nor source review establishes the result.

## Specimen and final styled prototype

[Selected prototype](design/previews/index.html) extends the same artifact used for comparison. Use its Screen selector for Projects, Clients, Invoices, Today, Settings, email digest, sign-in/up, verification, recovery/reset and deletion receipt. State controls expose empty/loading/error/save-error/success/expired-link/unapproved-email views as relevant. Type & controls is the specimen for type, palette, actions, form and empty/error treatment.

All data and account actions are fictional and in memory; refresh resets them. The JSON download contains fictional data only. No actual authentication, RLS, scheduling, email delivery, retained backups or deletion is implemented. [Run/review instructions](design/previews/README.md) separate demonstration coverage from production requirements.

## Visual verification

User feedback selected C on the comparison screen. The user explicitly accepted the final cross-screen artifact and guide together with the three reconciled plans, retaining the browser/screenshot evidence gap. This is human acceptance of the reviewed scope, not a claim that agent visual or interaction checks passed.

Passed: JavaScript syntax, static asset/reference checks, licensed local-font/header/hash checks, measured contrast, and exact-file HTTP serving. The permitted browser again reported no available connection on 2026-10-30. Therefore actual startup, font loading, desktop/mobile rendering, focus/interaction behavior and screenshot critique are **not verified**. No screenshots exist. Source checks and simulated states are not substitutes for this evidence. Preserve the accepted evidence gap in future parity/review work until a permitted browser or explicit human review supplies evidence.

## Phase 3 application comparison status

The first Vue account/workspace frontend slice uses the selected C tokens, local Manrope, bright list/nav and navy detail plane. Its development-only `/__preview` uses fictional props in the same Vue screens; later record/Today/deletion production screens remain subsequent milestones. Build/type checks and module serving passed, but no browser screenshot or interaction parity evidence exists. Do not infer full-feature implementation from either the accepted HTML reference or a compiled Vue shell.

The account slice adds a mobile Sign out action outside the hidden desktop profile, preserving account access across narrow layouts. This is a functional refinement within C, not a new visual direction; it still needs real-browser review.

Scoped account-state Playwright screenshots now exist at desktop/mobile widths; see [browser evidence](plans/evidence/phase4-browser-recheck.json). They confirm the corrected expiry controls render and operate within those states. Full reference parity, accessibility and workspace verification remain open; the earlier unavailable-browser notes describe historical attempts.

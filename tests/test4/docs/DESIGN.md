# Lancealot — Shared UI Design

Status: Accepted — shared design and three reconciled written plans accepted together on 2026-10-28, including D18 launch deferrals.
Layout choice: user selected A on 2026-10-28.
Phase 2a scope/approach confirmed 2026-10-28. These are static designs for Layout A, not implemented screens. Palette/type/spacing remain changeable defaults within the accepted behavior and accessibility requirements. Feature behavior lives in [SPEC](../SPEC.md) and the linked [plans](plans/PLANS.md); domain labels follow [GLOSSARY](GLOSSARY.md).

## Audience and primary job

Individual freelancers need to notice outstanding work, act on it, and keep client/project/invoice records private. Today opens with actual attention items and relevant dates. The product name may use a distinctive wordmark, but the first release needs no knight illustrations, promotional hero, charts or invented revenue metrics.

## Selected layout and considered alternative

### A — Work ledger (selected)

A persistent desktop left navigation holds Today, Clients, Projects and Settings. The main surface has compact, aligned rows grouped by follow-up type. Date and status columns make scanning repeat items easy. A narrow heading/status area shows the confirmed timezone and digest setting; no arbitrary monetary total is displayed.

```text
Lancealot | Today                          Wed 28 Oct
          | America/Los_Angeles      Email: off  [Settings]
Today     |
Clients   | Task follow-ups                         2
Projects  | Send revised estimate | Cedar Studio | Today | [Open]
Settings  | Confirm brief         | Atlas        | Yesterday
          |
          | Project deadlines                       1
          | Launch kit | Cedar Studio | Due in 2 days | [Open]
          |
          | Overdue invoices                        1
          | INV-014 | Atlas | Due 26 Oct | [Open]
```

All names/counts/dates are synthetic examples, not user data. The boldest element is the date/status column beside real work. Dividers separate categories and client contexts; a dashboard card grid is unnecessary. Prefer left alignment, with numbers/amounts aligned consistently in their own columns.

**Fit:** efficient repeated scanning on laptops; navigation stays visible. **Tradeoff:** denser than an agenda, and needs a carefully stacked mobile layout.

### B — Daily agenda (considered, not selected)

Top navigation above a wider, single-column list with larger item rows and one dominant date heading. Keep the same three type groups and actions; show client/project context beneath each title rather than in columns.

```text
Lancealot          Today  Clients  Projects  Settings

Wednesday, 28 October                 Email: off [Settings]
What needs attention

Task follow-ups
Send revised estimate                         Today
Cedar Studio / Launch kit                     [Open]

Project deadlines
Launch kit                             Due in 2 days
Cedar Studio                                  [Open]

Overdue invoices
INV-014                               Due 26 October
Atlas / Site refresh                          [Open]
```

**Fit:** easier reading and direct adaptation to small screens. **Tradeoff:** more vertical scrolling and fewer visible records per laptop screen. No calendar scheduling or draggable agenda is implied.

## Visual defaults for the selected work ledger

Use a cool workbook palette suited to scanning client work and dates. Token names and hex values are provisional defaults:

| Token | Value | Role |
| --- | --- | --- |
| Canvas | #F5F8FC | App background |
| Surface | #FFFFFF | Forms and main record surface |
| Ink | #17263D | Headings/body text |
| Quiet ink | #526176 | Supporting text, never disabled-only instructions |
| Action | #2344AD | Primary actions and keyboard-focus outline |
| Divider | #D7E0EA | Group/row separators, not sole control outlines |

Default status accents: #9A3412 with explicit “Overdue” text; #166534 with “Paid”/“Completed” text. Neutral text handles pending/in-progress states. Never make a pale divider the only input boundary; use a sufficiently contrasting control outline. Color roles must meet contrast requirements in final rendering.

Typography defaults: Georgia for the wordmark/page headings and Trebuchet MS for body/forms, with locally available serif/sans-serif fallbacks. The serif heading marks the freelancer's workspace; the humanist sans keeps repeated dates/statuses legible. No externally hosted font requests are needed. Use tabular numerals where the chosen font supports them; do not substitute monospace data labels everywhere.

Default scale: 28px page heading, 20px section heading, 16px body/control text, 14px secondary text; body line-height 1.5. Keep explanatory text under 75 characters per line. Spacing follows 4/8/12/16/24/32px steps. Use 6px control corners and a slightly larger panel/dialog radius, without ubiquitous shadows. Exact token values remain changeable within accessibility/behavior requirements.

## Responsive and accessibility baseline

- At desktop widths use the selected navigation and row layout. On narrow screens, stack each item with its title, client/project, date/status and labeled actions; essential work must not require horizontal scrolling. Use a labeled navigation disclosure when the desktop navigation no longer fits.
- Check representative 1280px and 390px layouts and reflow at 320 CSS pixels; these are proposed verification fixtures, not a device-support contract.
- Keyboard-operable navigation/forms/dialogs; visible focus; logical heading order and named regions; errors linked to fields. Focus returns to the trigger after a canceled dialog; successful deletion of a row moves focus to the next sensible item/group heading.
- Body text contrast at least 4.5:1; large text and meaningful control boundaries/focus indicators at least 3:1 against adjacent colors. Validate real states instead of assuming palette tokens alone establish compliance.
- Aim for at least 44px action targets. Respect reduced motion; use motion only to explain user-triggered changes. Never use a disappearing toast as the only error/status communication.
- Keep password-manager/paste support; reveal-password control is labeled. Do not expose private record details in logged-out, expired-session or other-user states.

## Shared component states

| Surface | Default and empty | Loading/saving | Error and success |
| --- | --- | --- | --- |
| Record list | Relevant empty action such as Add client | Labeled busy state, retain current filters | Retry inline; never imply an empty list when a fetch failed |
| Record form | Labeled fields and optional-date hints | Preserve entered values; avoid duplicate submissions | Specific field/conflict errors; confirm only after authoritative save |
| State correction | Named current state and explicit action | Prevent repeated transition for that record | Refresh state/reminders on success; explain stale-update rejection |
| Delete record dialog | Name the task/invoice and permanent effect | Disable repeat confirmation | Remain open with retry on failure; remove row only on success |
| Attention groups | Show actionable items; all-clear and first-use guidance differ | Refresh indicator without inventing new results | Keep last data labeled stale on failure; do not say all clear |
| Reminder settings | Confirm timezone; email off until configured/enabled | Save preference as one validated action | Separate save result from last provider acceptance/failure/unknown |
| Account deletion | Separate destructive area, optional export first | Explicit confirmation plus password, then locked state | Failure before lock leaves account active; after lock show pending cleanup, not completed erasure |

## Voice and user-facing information

Sentence case; consistent actions such as Add client, Save changes, Mark paid, Mark unpaid, Reopen task, Archive project and Delete account. Errors tell the person what to fix. Display local dates alongside the confirmed timezone where ambiguity matters; invoice amounts always keep their currency code. Do not label email provider acceptance as inbox delivery or show Cron/RLS/JWT/lease terminology to product users.

## Design critique and boundaries

The selected ledger puts work/date/status alignment first and reserves expressive typography for workspace identity and page headings. Statistical cards are unnecessary for the agreed attention workflow. The agenda is structurally different through top navigation, a single reading column and larger context rows; it is not merely a palette variant.

No imagery, external font dependency, icon package, new design framework or animation subsystem is selected. Existing plain Vue/Vite setup remains unchanged. Static wireframes covered the initial accepted layout. The user subsequently requested an HTML mock UI, authorizing the bounded prototype below; production implementation remains outside that request.

## Reconciled feature designs and final acceptance

- [Accounts/project tracking](plans/private-accounts-project-tracking.md): account access, Clients/Projects, record forms, correction/deletion states.
- [Today/digest](plans/today-daily-digest.md): attention groups, reminder settings and email layout.
- [Export/account deletion](plans/export-account-deletion.md): download/status and password-confirmed irreversible erasure.

Layout A is selected for all three plans: persistent desktop sidebar, aligned compact rows, stacked narrow-screen records and a labeled navigation disclosure when needed. B is retained only as the considered alternative. Account entry/recovery use a focused single form; signed-in record/settings flows share the ledger shell. Reminder email adapts the hierarchy to a readable single column rather than copying application navigation.

The same plans now incorporate the A shell, feature flows/states and behavior/accessibility verification. No accepted product scope changed. The user explicitly accepted the three written plans and this style guide together on 2026-10-28, including Layout A, changeable defaults and D18 launch deferrals. Phase 2b is complete for that scope. This acceptance does not authorize application implementation, prototype execution, service provisioning or deployment.

## Follow-up prototype for visual validation

Written-plan/static-design acceptance remains recorded above. The user then requested an actual HTML mock UI to verify direction; visual validation is reopened for that artifact. [Open the prototype](prototypes/lancealot-ui.html) or read its [run/review notes](prototypes/README.md). Layout A opens by default; the bottom switcher also provides B (agenda) and C (briefing board) for structural comparison. These comparisons do not replace the selected A design without user feedback.

The prototype renders the accepted cool palette, Georgia/Trebuchet typography, work-ledger shell, mobile stacking, Today groups, client/projects, task/invoice corrections, reminder settings and email/export/deletion previews. All data is synthetic and state resets on reload. Sign-in and deletion are visual demonstrations, not implemented security or erasure.

Prototype verdict: Approved by the user on 2026-10-28. The user subsequently authorized Phase 3 with frontend-design refinement. No browser was connected for rendered QA; Node syntax and limited non-browser render/state checks passed. At the prototype-only stage no production source/route, branch, commit, service, dependency or real data was changed. Phase 3 source work is recorded below and in HANDOVER.md; do not describe this artifact as browser-verified or production-ready.

## Phase 3 visual refinement

Prototype verdict: Approved by the user on 2026-10-28, with an explicit request to apply frontend-design during implementation. Preserve Layout A and the cool paper/ink/blue palette. Refine the mark, type spacing, date-column hierarchy and grouped ledger rhythm; retain local Georgia headings and humanist sans-serif forms, restrained corners and explicit status text. First-pass critique: dashboard statistic cards would obscure the actual follow-up workflow; the implementation keeps work rows as the primary surface. Responsive stacking, form feedback and keyboard focus remain required. No new external font/image dependency is selected.

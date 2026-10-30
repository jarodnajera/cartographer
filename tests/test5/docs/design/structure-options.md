# Accounts and project-tracking structure options

Status: Accepted — structure A and appearance C, with the guide/three plans/final prototype accepted on 2026-10-30; browser/screenshot verification remains pending. Related: [first plan](../plans/private-accounts-and-project-tracking.md), [accepted spec](../../SPEC.md), [glossary](../GLOSSARY.md).

## Question and constraints

Choose how a freelancer navigates records and edits work while preserving context. This round selects structure and hierarchy, not palette, typography or brand. The working app remains the Vue/TypeScript starter; an isolated fictional-data preview now exists, with no backend or live data. Desktop first; preserve keyboard use, form labels, clear status text and a usable narrow-screen path.

## Common flow and state coverage

Authentication stays outside the private workspace: approved-email registration, verify-email instructions/resend, sign-in, recovery request, recovery completion, invalid/expired links, unapproved registration, loading and failure states. Successful verified access enters the private workspace; unauthenticated access must not reveal record content. Confirmation/recovery emails are separate from optional reminder-email opt-in.

Workspace navigation exposes Today, Clients, Projects, Invoices and Settings. For this first feature, develop the record structure; Today and Settings content will be reconciled with their own accepted plans instead of duplicating their behavior here. Empty workspace provides clear create-client/project actions; fields needing a client/project cannot reference another owner. Lists support normal, loading, empty and failed-load states. Forms distinguish validation errors, blocked reassignment, failed saves and successful persistence; keep editable input when a save fails.

Project context shows its client, lifecycle, optional deadline, tasks and linked invoices. An archived/completed project exposes the agreed restore/reopen actions without implying child completion/payment. Client archive does not suppress child reminders. Show unresolved tasks and unpaid invoices even under archived projects. Invoice forms retain explicit currency and full paid/unpaid status; they do not offer payment collection or partial-payment controls. Show only choices belonging to the signed-in freelancer and enforce ownership behind the UI.

## Option A — Persistent navigation, list and detail panel

```text
Lancealot | Projects                         Add project
Today    | Project list       | Selected project
Clients  | Client / status    | Client, deadline, lifecycle
Projects | Deadline          | Tasks and linked invoices
Invoices |                   | Edit / complete / archive
Settings |                   |
```

Keep the project list visible while inspecting a selected record in a panel. Create/edit opens an explicit form view within that context; deep linking and a clear close/back action prevent the panel from becoming an inaccessible overlay trap. On narrow screens, use a full-width detail/form view rather than three compressed columns. Suitable when users frequently scan deadlines and switch among several projects; less space is available for long notes/forms.

## Option B — Top navigation and dedicated record pages

```text
Lancealot | Today  Clients  Projects  Invoices  Settings
Projects                                         Add project
Project             Client          Status       Deadline
[Choose a project to open its dedicated page]

Projects / Selected project
Client, deadline, lifecycle    Edit / complete / archive
Tasks and linked invoices     Back to projects
```

List and detail occupy separate pages. Forms use the available width; a consistent back action returns to the list with its prior context. This provides more reading/editing space and a simpler narrow-screen transition, but requires more navigation between projects. Do not add a wizard or page per field.

## Recommendation and unresolved work

The user selected A: persistent sidebar navigation, project list and detail panel. Keep the list visible while inspecting projects; narrow screens use a full-width detail/form view. B was considered for its extra editing space but not selected. The user subsequently selected appearance C; selecting structure alone had not been treated as visual approval.

After selection, run the short brand session, then compare two or three rendered visual directions of the same selected screen. Those directions establish a shared DESIGN.md only after review, with a specimen and final styled prototype. Do not treat these wireframes as visual approval or automatically promote throwaway code into the application.

## Readiness and authorization

The installed frontend-design SKILL.md was located and read on 2026-10-30; it was added by the user after an interrupted turn. Package/source revision is not recorded in the existing skills-lock.json and is unknown. Do not label a source/version verified from the name alone.

Browser runtime setup succeeded, but selection reported no browser and supported discovery returned an empty browser list. Therefore local-page opening and screenshot capture have not passed. No alternate automation workaround or browser/tool installation was attempted. Rendered correctness must remain unverified until a permitted browser is connected or the user explicitly chooses a human-review path.

The user explicitly authorized bounded isolated HTML previews using fictional data on 2026-10-30 after selecting A. This extends planning authorization to preview code only: do not change lancealot/, call real Supabase/email services, install software or integrate a prototype into production. The [isolated HTML comparison](previews/index.html) now exists; browser rendering evidence does not. Browser/screenshot limitations were disclosed with the offer; the user has now accepted the reviewed structure/appearance with the browser/screenshot evidence gap retained; this is not proof of rendered correctness.

## Agreed brand session

B1: precise and professional. B2: minimalist approach and calm colors; user supplied #012a4a, #013a63, #01497c, #014f86, #2a6f97, #2c7da0, #468faf, #61a5c2, #89c2d9, #a9d6e5. No external interface references were supplied. B3: wordmark only. B4: self-hosted open-license fonts. Existing extra logos/colors/restrictions or accessibility needs were not specified; do not invent them or weaken accepted accessibility requirements.

[Visual-direction plan](visual-directions.md) applies this brief to three appearances on structure A. [Preview/run instructions](previews/README.md) provide the actual HTML, specimen and state controls. Appearance C is selected. The [accepted DESIGN.md](../DESIGN.md), extended cross-screen prototype and three written plans received combined acceptance on 2026-10-30. Browser screenshots/rendered critique remain unavailable; do not present static checks as successful visual verification.

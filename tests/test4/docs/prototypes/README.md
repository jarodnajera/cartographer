# Lancealot UI prototype

Question: does the selected Layout A work visually and interactively for freelancer follow-ups, project tracking and data settings?

Open [lancealot-ui.html](lancealot-ui.html) directly in a current browser. It is one self-contained HTML file with no dependencies or network calls. It uses synthetic, in-memory records; reloading/Reset demo restores them. Do not enter a real password; the deletion demonstration uses `demo`.

For an HTTP URL, optionally run `python3 -m http.server 4174 --bind 127.0.0.1` from this directory, then open http://127.0.0.1:4174/lancealot-ui.html. No server was started by this task.

## Layouts and exploration

- `?variant=A`: selected Work ledger, opened by default. Persistent desktop sidebar, aligned date/status rows and stacked mobile rows.
- `?variant=B`: optional Daily agenda comparison, top navigation and spacious reading column.
- `?variant=C`: optional Briefing board comparison, three category columns with per-item context.

Use the floating left/right controls or arrow keys to compare. Inputs/selects/dialogs retain their own keyboard controls. A remains the selected direction; B/C have not been accepted as replacements.

Try Today, Clients, Projects, a project detail, complete/reopen a task, mark paid/unpaid, archive/complete a project, add a task and cancel/confirm individual deletion. The completed Morrow Press project deliberately retains an unresolved task and unpaid invoice. Its child reminders remain visible.

Settings demonstrates in-memory digest preferences, an email preview with no invoice amounts, a synthetic JSON download and a simulated password-confirmed account-lock state. It also offers a sign-in visual preview; credentials are never verified or transmitted. The preview is not a working authentication/deletion system.

The Preview state selector shows populated, all-clear, loading and load-error states on Today. Use the real browser's responsive tools/narrow window to review mobile layout; the prototype does not simulate mobile by shrinking a desktop screenshot.

## Review status and limits

User requested an actual HTML mock UI after accepting static plan/design documents. Prototype verdict: Approved by the user on 2026-10-28; the user authorized Phase 3 and requested frontend-design refinement. The HTML remains a retained prototype; approved production UI is implemented separately in Vue. No branch or commit was made. User feedback may revise the same DESIGN.md and plans; historical written acceptance stays recorded.

Verification performed: Node syntax check, non-browser rendering smoke checks for all three layouts/five screens/four Today states, sample reminder-state checks and email amount exclusion. A mock document object was used for those limited script checks; they do not prove browser rendering, real DOM events or accessibility. Browser runtime discovery found no connected browser, so no browser screenshot, responsive layout check or actual browser-flow verification was possible in this session.

The standalone HTML adapts the installed prototype UI skill to the user's explicit HTML request. It remains a retained experiment outside lancealot/src. Phase 3 now implements the approved A direction in the Vue application, with its own explicit sample workspace; see [HANDOVER.md](../../HANDOVER.md) for current verification and pending live-service gates. Variants, synthetic state and verdict are captured here and in each plan. No branch, commit or deployment was made.

## Blank-screen correction

The first HTML artifact failed in a browser because a global `top()` helper collided with the protected `window.top` property. The initial Node smoke harness lacked that property and missed the failure. Reproduced startup as `SyntaxError: Identifier 'top' has already been declared` with a protected browser-like global, then renamed the helper to renderTopline and enclosed the script in a local function scope.

The initial Layout A markup is now embedded directly in HTML, so a script-disabled preview still has visible content. JavaScript progressively replaces that view for interactive navigation/state. Regression checks include protected-window.top startup, no leaked render global, three layouts/navigation, task completion, Today empty/loading/error/retry, digest preview and simulated deletion/reset. These checks use a DOM stub, not a browser; real browser/layout/accessibility review remains pending because browser discovery still returned no connected instances.

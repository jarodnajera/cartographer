# Lancealot visual directions

Status: Accepted — structure A / appearance C, shared guide and final cross-screen prototype accepted with the written plans on 2026-10-30, retaining the browser evidence gap.

## Agreed brief

Precise/professional, minimalist, calm colors; wordmark only. User supplied this palette: #012a4a, #013a63, #01497c, #014f86, #2a6f97, #2c7da0, #468faf, #61a5c2, #89c2d9, #a9d6e5. Use self-hosted open-license fonts; no user-supplied logo or extra brand/accessibility constraints were specified. Preserve the accepted accessibility target rather than claiming that absence of more constraints waives it.

Structure A is selected: persistent navigation, project list and detail panel. All appearances compare the same fictional project data and states; no real data, backend, authentication or email integration. Preview-code authorization is explicit. Production application stays unchanged.

## Plans before building

| Direction | Concept and defining detail | Core colors | Typography |
| --- | --- | --- | --- |
| A — Ledger | Restrained desktop workbench; compact aligned project rows and a small typographic deadline marker make scanning efficient | Deep ink #012a4a; navy #013a63; action #014f86; selection #a9d6e5; white #ffffff; neutral canvas #f7fafc | Public Sans, practical clear numerals with compact headings |
| B — Open water | Spacious light workspace with a pale-blue navigation surface; a quiet vertical date emphasis in the detail panel gives deadlines hierarchy | Deep ink #012a4a; text #01497c; action #2a6f97; pale blue #a9d6e5; accent #89c2d9; white #ffffff | Instrument Sans, flexible humanist rhythm and a more open type scale |
| C — Blueprint | Bright project list beside a deep-blue selected-project panel; inverted detail typography is the single expressive move | Navy #013a63; ink #012a4a; action #014f86; highlight #61a5c2; pale text #a9d6e5; white #ffffff | Manrope, deliberate strong headings with restrained supporting text |

Align content left; keep date/amount columns legible and amount numerals tabular. Avoid centered marketing content, metric-card grids, decorative gradients, medieval motifs and oversized promotional headings. Project titles, clients, dates, tasks and invoice state are the meaningful content. Distinguish variants by typographic scale, density, surface allocation and selected-detail treatment, not by swapping only an accent color.

Critique before building: a repeated card grid would hide list hierarchy and feel interchangeable with a generic dashboard. Use shared underlying fixtures but let each direction give different weight to project rows and selected details. Keep status text and currency labels explicit. Preserve the selected structure rather than introducing a new navigation model under a visual label.

## Review and evidence

Font source/license and measured contrast are documented with the preview artifact. Brand-approved palette does not mean every foreground/background pair passes text contrast; choose dark/light combinations deliberately. Local files and contrast calculations are not rendered evidence.

Browser recheck on 2026-10-30 still reported no browser. Local opening/screenshots/desktop-mobile visual critique remain unverified. Offer the actual HTML for human review with this gap visible; do not record visual selection or shared DESIGN.md acceptance from this plan alone. The guide is now accepted with that missing evidence explicitly retained; acceptance does not establish rendering verification.

## Preview artifact

[Open the comparison](previews/index.html) and use the bottom direction controls; [run/review instructions](previews/README.md) describe states, limitations and local serving. Self-hosted fonts/licenses are bundled. Syntax, asset and contrast checks passed, but no browser-rendered option or screenshot is verified. The file is delivered for human visual review; the user selected C, Blueprint. The extended cross-screen prototype now defaults to C; final combined plan/design acceptance was explicitly given on 2026-10-30 with the browser evidence gap retained.

## Selection and shared guide

C was selected by the user on 2026-10-30. [Accepted shared design guide](../DESIGN.md) records tokens, components, responsive behavior and evidence limits. A/B were not selected; no negative rationale was supplied. The extended preview reuses the artifact for auth, records, Today/digest and Settings/export/deletion. Original Projects-direction selection was followed by separate explicit acceptance of the guide, cross-screen prototype and three plans, including the stated rendering gap.

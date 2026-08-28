<!-- LEAD-V FRAMEWORK -->
# Builder's Book — Project State

> **How to use this file:**
> Update at the **start** and **end** of every work session.
> At session start: review current state, verify against codebase.
> At session end: update what was completed, log the session, set up next steps.
> This file is always current state, not a log. Replace content — don't append.
> Previous state is preserved in git history.

> Last updated: 2026-08-28 (SITE-P13)
> Updated by: IMPLEMENT — SITE-P13 Phase 1 closure

## Phase Status

> The codebase is the source of truth. `DEVELOPMENT-PLAN.md` tracks planning intent; this table summarizes current phase status. When plan and repo disagree, the repo wins — reconcile the plan to match.

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Bootstrap | Complete | Repo created under the organization with repo-local identity pin; LEAD-V v5 selectively installed and customized; governing documents added |
| 1 | Site scaffold | Complete | TP-002, TP-003, and TP-004 complete; sample-page criterion satisfied via validated rendering in review; drafts 404 publicly by design — first public rendering lands with essay #1. |

## Brand Track

- Status: complete (BRAND-P1 through BRAND-P8, parallel SCOUT session). Logo and site design decisions are closed.
- Track handoff and closed decisions: `design/HANDOFF-BRAND.md`
- Build spec corrections: `design/DESIGN-BUILD-NOTES.md` — this file explicitly OVERRIDES the mockup CSS wherever they conflict. Read it before implementing any design token or component.
- Design token value source: `design/reference/` (extracted mockup HTML/CSS)
- Designer SVGs are delivered and operator-held; intake has not yet been performed. The operator's AI-adjusted production icon (`~/Downloads/TBB_icon_production.svg`) postdates the designer delivery. The queued logo export pass performs intake first: verify the two-SVG delivery, then record the intake diff and optical corrections in `design/reference/`.

## Environment Status

- `.env.local`: does not exist; no local application secrets are required for the completed scaffold
- `.env.production`: does not exist locally; production requires no application secrets
- Site scaffold: provisioned with Next.js 16 App Router, Fumadocs UI/MDX, Tailwind CSS, and semantic design tokens
- Content and search: typed local `book` and `essays` MDX collections, constrained authoring, validation, and static FlexSearch are provisioned
- Hosting: production is live at <https://buildersbook.dev> on the operator's Vercel personal Hobby account using the CLI-deploy model
- DNS: Cloudflare serves `buildersbook.dev`
- Discovery consoles: Google Search Console and Bing Webmaster Tools are verified; sitemaps are submitted
- Database: none — explicitly no database at launch
- Auth: none — no user accounts
- Commands: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm test`

## Known Bugs

None.

## Current Task

Phase 1 is complete. The current task is Phase 2 — TP-005 essay #1.

## What Was Done Last Session

- Deployed production through Vercel CLI, configured Cloudflare DNS, verified Google Search Console and Bing Webmaster Tools, and submitted sitemaps.
- Reconciled the canon collection name from `blog` to `essays`.
- Restored the closed full-form wordmark, “The Builder’s Book,” across the shared component, metadata, and article JSON-LD names.
- Closed Phase 1 with the sample-page criterion satisfied through validated review rendering; draft routes remain public 404s by design.

## Active Blockers

None.

## Open Items

- IndexNow is dormant under CLI deploys because its automation uses the `deployment_status` trigger; it wakes at the Phase 2 Git connection. This is an accepted tradeoff.
- Git integration is deferred to the public flip because the Vercel Hobby plan cannot connect the private organization repository.
- Before the public flip, run a full-history private-data scan: manifest grep across all commits plus a semantic pass. The pre-push hook covers the working tree only.

## Resolved This Session

- The wordmark mismatch is resolved: the full “The Builder’s Book” form is restored site-wide. Mockup evidence is recorded at `design/reference/Builders Book Site.dc.html` lines 47, 157, and 196.

## Immediate Next Tasks (In Order)

1. Phase 2 — TP-005 essay #1.
2. Run the pre-publish hardening batch: SITE-P11.4 M-1 free-text discovery gap (**HARD GATE before essay #1 publishes**), L-1 `design/reference` type-floor scope, and L-2 F-5 disposition record.
3. Run the queued logo export pass. The operator's `~/Downloads/TBB_icon_production.svg` is AI-adjusted post-designer; its intake diff against the designer SVGs in `design/reference/` records optical corrections.

## Session Log

<!-- Track session history. One row per session. Each session's first records commit pins the prior batch's "this commit" placeholder to its final SHA. -->
| Session | Date | Focus | Commit |
|---------|------|-------|--------|
| BOOT-P1–BOOT-P7 | 2026-08-24 | Repository bootstrap, LEAD-V v5 selective install, and template customization | f8dc913, b980528, 75ea816 |
| BOOT-P8 | 2026-08-25 | Governing documents and Phase 1 transition | 9912b1a |
| BOOT-P9 | 2026-08-25 | Brand track artifacts into repo | b47dab9 |
| BOOT-P11 | 2026-08-25 | Plan reconciliation per BOOT-P10.1 audit | 4f5b184 |
| SITE-P3 | 2026-08-26 | Plan reconciliation for design-review scope and private Visibility-layer removal | 33250a4 |
| SITE-P5 | 2026-08-26 | TP-002 Fumadocs scaffold, content foundations, reading UI, and application states | 4e2487f, 3704582, 0d0db37, bdf05d5, 0021032, a57293b |
| SITE-P6 | 2026-08-26 | Independent VERIFY of SITE-P5 — FAIL (H-1, M-1–M-5, L-1–L-12) | — |
| SITE-P7 | 2026-08-26 | Resolve the complete SITE-P6 findings batch | f736b95, b09761b, 16e92e5, 8379c43, 8d49bd9 |
| SITE-P8 | 2026-08-27 | Post-SITE-P7 review; findings carried into the merged SITE-P8/P8x triage | — |
| SITE-P8x | 2026-08-27 | Supplemental review and merged disposition of F-1–F-9 | — |
| SITE-P9 | 2026-08-27 | Resolve the SITE-P8/P8x dialect, naming, protocol, and records findings | 17d2d25, d2a9b8f, 605cc6a, b4a2653 |
| SITE-P10.1 | 2026-08-27 | Amend the batch clause per the operator's 2026-08-26 decision; SITE-P10 correctly halted on the mismatch | 9ac2447 |
| SITE-P10 | 2026-08-27 | TP-003 CI/hardening and TP-004 publication/discovery batch | 56cfedf, cf10a9c, 76ce826, 4910abe, 849e384, ed6d615 |
| SITE-P11 | 2026-08-27 | Cross-family VERIFY of SITE-P10 — PASS WITH FINDINGS (H-1, M-1–M-4, L-1–L-7) | — |
| SITE-P11.1 | 2026-08-27 | Resolve the SITE-P11 boundary, invariant-gate, discovery-test, and hygiene findings | 68b8243, c4ede2d, 7b1c250, 4dd0940 |
| SITE-P11.2 | 2026-08-27 | Cross-family VERIFY of SITE-P11.1 — PASS WITH FINDINGS (F-1–F-7) | — |
| SITE-P11.3 | 2026-08-27 | Close F-1–F-4 and F-7; record the accepted F-5/F-6 dispositions | 9f66d67, 3517642, 5ac4f90, 1ad266e, 6df8306 |
| SITE-P12 | 2026-08-28 | Deploy production through Vercel CLI; configure Cloudflare DNS; verify Google and Bing; submit sitemaps | — |
| SITE-P13 | 2026-08-28 | Reconcile canon collection naming, restore the full wordmark, and close Phase 1 records | 70831ef, a5ac7b9, this commit |

## Session Notes

Production is live through the Vercel CLI-deploy model with Cloudflare DNS and verified Google and Bing discovery consoles. Phase 2 begins with TP-005 essay #1, followed by the pre-publish hardening gate. The private manifest remains operator-local by design: every clone must run `git config core.hooksPath scripts/hooks`, and CI does not invoke the private scanner.

---

## New Session Starter Prompts

### General opener (when resuming without a specific task)

~~~
Continuing Builder's Book development. Follow the Session Protocol.
Read PROJECT_STATE.md and tell me the current status and recommended next task.
Don't start implementation until I confirm.
~~~

### Task-specific template (copy, fill in the brackets, paste)

~~~
Execute [TASK_ID] from [DEVELOPMENT-PLAN.md] — [brief description].

Read the full prompt spec in the dev plan before starting.
[Any extra context: file locations, API keys, design constraints]

Verify: [what success looks like].
When done, report results and propose or update state according to role rules.
Do not commit without explicit human approval.
~~~

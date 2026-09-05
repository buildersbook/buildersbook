<!-- LEAD-V FRAMEWORK -->
# Builder's Book — Project State

Current through: 40c5cb38cd028daab22a96df59f7d858b8500e91

> **How to use this file:**
> Update at the **start** and **end** of every work session.
> At session start: review current state, verify against codebase.
> At session end: update what was completed, log the session, set up next steps.
> This file is always current state, not a log. Replace content — don't append.
> Previous state is preserved in git history.

> Last updated: 2026-09-05 (SITE-P17.2.2)
> Updated by: IMPLEMENT — SITE-P17.2.2 records reconciliation

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
- Final logo SVGs are operator-held. An AI-adjusted production icon (operator-held) postdates them. The queued logo export pass performs intake first: verify the two final SVGs, then record the intake diff and optical corrections in `design/reference/`.

## Environment Status

- `.env.local`: does not exist; no local application secrets are required for the completed scaffold
- `.env.production`: does not exist locally; production requires no application secrets
- Site scaffold: provisioned with Next.js 16 App Router, Fumadocs UI/MDX, Tailwind CSS, and semantic design tokens
- Content and search: typed local `book` and `essays` MDX collections, constrained authoring, validation, and static FlexSearch are provisioned
- Hosting: production hosting on Vercel at <https://buildersbook.dev>, project `buildersbook`, Git-connected to `buildersbook/buildersbook` with `main` as the production branch; auto-deploy on push is proven
- Retired hosting path: personal deploy token (revoked); its environment export was removed
- DNS: Cloudflare serves `buildersbook.dev`; the apex and `www` CNAMEs both target the per-project Vercel hostname and remain DNS-only. The two `_vercel` TXT verification records for the apex and `www` claims are retained by decision; Vercel permits removal after verification, but that risk was not taken
- Discovery consoles: Google Search Console and Bing Webmaster Tools are verified; sitemaps are submitted; IndexNow is proven end-to-end
- Database: none — explicitly no database at launch
- Auth: none — no user accounts
- Commands: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm test`

## Known Bugs

None.

## Current Task

Phase 1 is complete. The current task is SITE-P17.2 — canon reconciliation before the public flip.

## What Was Done Last Session

- SITE-P16 completed CI/runtime alignment at `e04c555`.
- SITE-P17 pre-flip audit returned FLIP-READY WITH FIXES: 3 BLOCKING / 7 HIGH / 4 MED / 3 LOW.
- SITE-P17.1 public-face fixes: `473f321`, `c6bd5c0`, `8c33987`.
- Completed Phase 1 task packets archived.

## Active Blockers

None.

## Open Items

- JS-budget SITE-P15.2 deferred findings: case-insensitive filesystems can accept a case-mismatched path (Linux CI is the case-sensitive compensating control, strengthened by SITE-P16); async-verdict label precedence is diagnostics-only (F2); `checkBudget` orchestration is untested (F3); suffix-walk tail collision is specified behavior (F4); the summary prints twice (F5); and bracket-prefixed route groups are mislabeled but fail closed (F6).
- IndexNow SITE-P15.6 deferred findings: CDATA inside `<loc>` parses silently but is unreachable with the current generator (F4); and the script reads the production alias rather than the event's deployment URL, so alias lag can make a run stale by one deployment before it self-corrects (F5, design note).
- Before the public flip, run a full-history private-data scan: manifest grep across all commits plus a semantic pass. The pre-push hook covers the working tree only.
- Protocol: reconcile WORKING-PROTOCOL checkpoint-commit clause with AGENTS/CLAUDE single-diff authorization (Phase 3, SITE-P17.2-V finding).

## Resolved This Session

- SITE-P16 completed at `e04c555`: Node 22.23.1 + 24 CI matrix, `@types/node` 24.13.3, `erasableSyntaxOnly`, and `.nvmrc`; SITE-P15.6 F3 is closed.

- Hosting supersession is complete: production hosting on Vercel through Git auto-deploy. The retired project and token were removed; the approximately 7m24s migration gap was accepted.
- Permanent JS-budget erratum: commit `2b06d6d` claims its classification rework fixed the remote failure, but cross-family VERIFY SITE-P15.0 proved that logic was dead code on every host because its `existsSync` branch never executed. Commit `4149be9`'s chunk-extraction change was the actual fix. The historical message overstates the result and remains immutable; this entry is the correction.
- SITE-P15.0 verdict: **FAIL**. Commit `de8a7a1` made every first-party accept require a file stat, added reason-coded counters and diagnosable failure paths, and added the script-module floor; `0ddccea` added the seven-test `node:test` suite. Commit `bcaa066` closed SITE-P15.2 F1 by pinning the relative-key accept branch to the filesystem.
- SITE-P15.2 verdict: **PASS WITH FINDINGS**. Deferred F2–F6 and the case-insensitive-filesystem limitation are recorded under Open Items. The gate contract is now tested through `pnpm test` in CI.
- The prior state entry describing IndexNow as “wake proven, run failed, plausibly transient DNS” was wrong. Runs `33247693409` and `33252160628` failed identically because `submit-indexnow.ts` imported application code whose module graph reaches `.mdx`; `tsx`/Node had no `.mdx` loader and raised `ERR_UNKNOWN_FILE_EXTENSION`. The failure was deterministic from creation, never DNS.
- Commit `6161bfa` decoupled IndexNow from the application module graph. The script now uses the deployed sitemap as its URL source, uses built-ins only, fails loudly, provides a `DRY_RUN` guard, and runs under plain Node without pnpm.
- SITE-P15.6 verdict: **PASS WITH FINDINGS**. Commit `df0b278` closed F1 with a constants drift-guard test and F2 by removing the stale `tsx` script entry. Deferred F3–F5 are recorded under Open Items.
- IndexNow first succeeded end-to-end in run `33392406514` on 2026-08-31 (20s), triggered by the `df0b278` deploy.

## Immediate Next Tasks (In Order)

1. Manifest append (six category words), then push e04c555..HEAD.
2. ESSAY-P3 on receipt of the voice-edited essay.
3. Phase 2 — execute TP-005 essay #1 with the pre-publish hardening batch: SITE-P11.4 M-1 free-text discovery gap (**HARD GATE before essay #1 publishes**), L-1 `design/reference` type-floor scope, L-2 F-5 disposition record, and the `EXPECT_NO_PUBLISHED_PAGES` flip in the publish commit.
4. Run the queued non-blocking logo intake. Verify the two final logo SVGs (operator-held SVGs, not in the repository), compare the AI-adjusted production icon (operator-held SVGs, not in the repository), and record the adjustment diff in `design/reference/`.

## Session Log

<!-- Track session history. One row per session. Each session's first records commit pins the prior batch's "this commit" placeholder to its final SHA. -->
| Session | Date | Focus | Commit |
|---------|------|-------|--------|
| BOOT-P1–BOOT-P7 | 2026-08-24 | Repository bootstrap, LEAD-V v5 selective install, and template customization | f8dc913, b980528, 75ea816 |
| BOOT-P8 | 2026-08-25 | Governing documents and Phase 1 transition | 9912b1a |
| BOOT-P9 | 2026-08-25 | Brand track artifacts into repo | b47dab9 |
| BOOT-P11 | 2026-08-25 | Plan reconciliation per BOOT-P10.1 audit | 4f5b184 |
| SITE-P3 | 2026-08-26 | Plan reconciliation for design-review scope and removal of a private framework layer from public scope | 33250a4 |
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
| SITE-P13 | 2026-08-28 | Reconcile canon collection naming, restore the full wordmark, and close Phase 1 records | 70831ef, a5ac7b9, b6ee269 |
| SITE-P14 | 2026-08-29 | Migrate to production hosting on Vercel with Git auto-deploy; diagnose and fix the remote JS-budget failures | 2b06d6d, 4149be9 |
| SITE-P15.0 | 2026-08-29 | Cross-family VERIFY of the JS-budget remote fix — FAIL (filesystem verification was dead code) | — |
| SITE-P15.1 | 2026-08-29 | Rebuild JS-budget classification around filesystem evidence and add contract tests | de8a7a1, 0ddccea |
| SITE-P15.2 | 2026-08-29 | Cross-family VERIFY of SITE-P15.1 — PASS WITH FINDINGS (F1–F6) | — |
| SITE-P15.3 | 2026-08-29 | Close SITE-P15.2 F1 with a relative-key filesystem pin | bcaa066 |
| SITE-P15.4 | 2026-08-30 | Recheck IndexNow failures and correct the diagnosis from transient DNS to deterministic `.mdx` loader failure | — |
| SITE-P15.5 | 2026-08-30 | Decouple IndexNow submission from the application module graph | 6161bfa |
| SITE-P15.6 | 2026-08-30 | Cross-family VERIFY of SITE-P15.5 — PASS WITH FINDINGS (F1–F5) | — |
| SITE-P15.7 | 2026-08-31 | Close IndexNow drift findings, prove the first successful run, and reconcile records | df0b278, c57424e |
| SITE-P16 | 2026-08-31 | Node 22.23.1 + 24 CI matrix, @types/node 24.13.3, erasableSyntaxOnly, .nvmrc | e04c555 |
| SITE-P17 | 2026-09-05 | Pre-flip audit, Grok: FLIP-READY WITH FIXES, 3 BLOCKING / 7 HIGH / 4 MED / 3 LOW | — |
| SITE-P17.1 | 2026-09-05 | Public-face fix batch | 473f321, c6bd5c0, 8c33987 |
| SITE-P17.1.1 | 2026-09-05 | History decision corrected; template markers removed | a6831d1 |
| SITE-P17.1-V | 2026-09-05 | Cross-family VERIFY, Claude Code — PASS WITH FINDINGS | — |
| SITE-P17.2 | 2026-09-05 | Canon reconciled; public-state rule recorded | d62d4d2, fa02157 |
| SITE-P17.2-V | 2026-09-05 | VERIFY, Codex (same-family) — FAIL — superseded | — |
| SITE-P17.2.1 | 2026-09-05 | Canon references corrected; state wording reconciled; protocol deferral recorded | 1cccb59, 0671e7b |
| SITE-P17.2-V2 | 2026-09-05 | Cross-family VERIFY, Claude Code — PASS WITH FINDINGS | — |
| SITE-P17.2.2 | 2026-09-05 | Protocol routed into session start; status pins and state records reconciled | 40c5cb3, this commit |

## Decisions

- Licenses: MIT (code) + CC BY-SA 4.0 (content), 2026-09-05.
- History residue accepted: ancestor commits contain hosting-arrangement wording and local paths; no secrets, no credentials, no private business, client, or third-party names, no local paths beyond a downloads-folder reference; hosting and DNS vendors appear. Not rewritten — a rewrite would invalidate every hash pin in the evidence trail. 2026-09-05.
- Public-state rule: state records carry outcomes and hashes only. Full rule landed in WORKING-PROTOCOL.md at fa02157.

## Session Notes

Production hosting on Vercel uses Git auto-deploy with Cloudflare DNS and verified Google, Bing, and IndexNow discovery. The JS-budget gate is filesystem-backed and tested. SITE-P16 completed CI/runtime alignment at `e04c555`; SITE-P17 arc complete at 40c5cb3; push pending. The private manifest remains operator-local by design: every clone must run `git config core.hooksPath scripts/hooks`, and CI does not invoke the private scanner.

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

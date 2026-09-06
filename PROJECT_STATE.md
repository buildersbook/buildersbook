<!-- LEAD-V FRAMEWORK -->
# Builder's Book — Project State

Current through: b63b16bb268caf6f101e62491501ffaa5f4a5790

> **How to use this file:**
> Update at the **start** and **end** of every work session.
> At session start: review current state, verify against codebase.
> At session end: update what was completed, log the session, set up next steps.
> This file is always current state, not a log. Replace content — don't append.
> Previous state is preserved in git history.

> Last updated: 2026-09-06 (HOST-P2)
> Updated by: IMPLEMENT — HOST-P2

## Phase Status

> The codebase is the source of truth. `DEVELOPMENT-PLAN.md` tracks planning intent; this table summarizes current phase status. When plan and repo disagree, the repo wins — reconcile the plan to match.

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Bootstrap | Complete | Repo created under the organization with repo-local identity pin; LEAD-V v5 selectively installed and customized; governing documents added |
| 1 | Site scaffold | Complete | TP-002, TP-003, and TP-004 complete; sample-page criterion satisfied via validated rendering in review; sample pages remain draft and return 404; essay #1 is the first published content page and is live in production. |
| 2 | Essay #1 and public launch | In progress | Essay #1 is published and live with publication date 2026-09-06; its publication push shipped and populated publication assertions are enabled (`778c95b`, records `ccb61f1`). The public flip and launch announcements remain ahead. |

## Brand Track

- Status: design decisions closed (BRAND-P1 through BRAND-P8); BRAND-P9 canonical icon, site icon set, and avatar exports complete (`f650fa4`, `6bce7af`, handoff `fe46a57`). The lockup is closed as unnecessary: the header composes the canonical icon + live text.
- Track handoff and closed decisions: `design/HANDOFF-BRAND.md`
- Build spec corrections: `design/DESIGN-BUILD-NOTES.md` — this file explicitly OVERRIDES the mockup CSS wherever they conflict. Read it before implementing any design token or component.
- Design token value source: `design/reference/` (extracted mockup HTML/CSS)
- The delivered icon is canonical; normalized geometry matches `design/brand/icon.svg` exactly. The designer’s optical correction from the earlier master and export specifications are recorded in `design/brand/NOTES.md` (`f650fa4`).
- The lockup is omitted: its gap is 7.2 units (0.857 cursor widths), below the required 25.2 units (3.0 cursor widths) (`f650fa4`). The lockup is closed as unnecessary: the header composes the canonical icon + live text.
- The adaptive SVG, 16/32/48px ICO, 180px Apple icon, manifest, and 192/512px PNGs are committed. Six light/dark avatars at 400/800/1024px were exported outside the repository; profile rollout remains ahead (`6bce7af`).
- The header composes the canonical inline icon and live-text wordmark, with 13px navigation labels (`b63b16b`). Production brand assets and derivatives are excluded from MIT and CC BY-SA and are not licensed for reuse (`f650fa4`).

## Environment Status

- Application configuration: the completed scaffold requires no application secrets
- Site scaffold: provisioned with Next.js 16 App Router, Fumadocs UI/MDX, Tailwind CSS, and semantic design tokens
- Content and search: typed local `book` and `essays` MDX collections, constrained authoring, validation, and static FlexSearch are provisioned
- Hosting: production hosting on Vercel in the personal scope at <https://buildersbook.dev>, project `buildersbook`, Git-connected to `buildersbook/buildersbook` with `main` as the production branch; auto-deploy on push is proven; the former-team seat is closed (HOST-P1, `eb0489b`)
- GitHub deployment records: HOST-P2 removed all 25 records containing former-scope status URLs, including the mixed-scope Production record, with operator authorization. Re-listing returned zero deployments; the next push recreates a personal-scope deployment. Environment names remain `Preview` and `Production`.
- DNS: Cloudflare serves `buildersbook.dev`; apex and `www` verification is complete
- Discovery consoles: Google Search Console and Bing Webmaster Tools are verified; sitemaps are submitted; IndexNow is proven end-to-end
- Database: none — explicitly no database at launch
- Auth: none — no user accounts
- Commands: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm test`

## Known Bugs

None.

## Current Task

Public flip. Essay #1 is live, and HOST-P1 completed the hosting move to the Vercel personal scope at `eb0489b`, closing ESSAY-P4-V F-3. HOST-P2 cleaned the GitHub deployment records and implemented the header mark and 13px navigation labels (`b63b16b`). This batch remains local and has not been pushed. Full-history mechanical and semantic review, the public flip, and launch announcements remain ahead.

## What Was Done Last Session

- BRAND-P9-V returned PASS on repo checks; HOST-P1 confirmed the live check at `eb0489b`.
- HOST-P1 completed the move to the Vercel personal scope and closed the former-team seat (`eb0489b`).
- HOST-P2 deactivated and deleted all 25 slug-bearing GitHub deployments with operator authorization. The mixed-scope Production record was included; the re-list is empty.
- The header now renders the canonical mark on the server immediately before live text, with a cap-centered 1em SVG and a 0.437em visible gap. A dedicated header label token raises only the requested labels from 11px to 13px (`b63b16b`).
- Validation, all 18 Node tests, the production build, both-theme headless renders, HTTP checks, search/theme/mobile interactions, and the silent private scan passed. Both reading-route budgets decreased from 36.29 to 36.22 KiB (`b63b16b`).
- The 11px type-floor gate resolves the header token and still rejects a 10px value, a missing token, and an extra override (`b63b16b`).

## Active Blockers

None.

## Open Items

- JS-budget SITE-P15.2 deferred findings: case-insensitive filesystems can accept a case-mismatched path (Linux CI is the case-sensitive compensating control, strengthened by SITE-P16); async-verdict label precedence is diagnostics-only (F2); `checkBudget` orchestration is untested (F3); suffix-walk tail collision is specified behavior (F4); the summary prints twice (F5); and bracket-prefixed route groups are mislabeled but fail closed (F6).
- IndexNow SITE-P15.6 deferred findings: CDATA inside `<loc>` parses silently but is unreachable with the current generator (F4); and the script reads the production alias rather than the event's deployment URL, so alias lag can make a run stale by one deployment before it self-corrects (F5, design note).
- Before the public flip, run a full-history private-data scan: manifest grep across all commits plus a semantic pass. The pre-push hook covers the working tree only.
- Protocol: reconcile WORKING-PROTOCOL checkpoint-commit clause with AGENTS/CLAUDE single-diff authorization (Phase 3, SITE-P17.2-V finding).
- PROJ-A1 F1/G2/G3 remain in Phase 3; F2 remains in Phase 4. A2 logo intake is complete (`f650fa4`, `6bce7af`, `b63b16b`).
- Brand follow-up: profile avatar rollout and an OG/social-card image. No social-card image was built in BRAND-P9.
- ESSAY-P3-V F-3 is queued for post-flip follow-up.
- Phase 1 Markdown ZIP remains deferred until after the public flip.

## Resolved This Session

- ESSAY-P4-V F-3 is closed: production hosting is on the Vercel personal scope, and the former-team seat is closed (HOST-P1, `eb0489b`).
- BRAND-P9-V repo checks passed; HOST-P1 confirmed the live check (`eb0489b`).
- HOST-P2 X-1: the only personal-scope Production deployment also contained a former-scope status. The operator authorized removal of all 25 records; no deployment records remain until the next push.
- HOST-P2 X-2: the type-floor validator now resolves the dedicated header label token without weakening the 11px floor. The 13px value passes; a 10px negative fixture fails (`b63b16b`).
- HOST-P2 X-3: moving static header content to the server reduced both reading-route budgets to 36.22 KiB rather than the expected unchanged 36.29 KiB. The canonical icon paths are absent from client JavaScript (`b63b16b`).
- The lockup is closed as unnecessary: the header composes the canonical icon + live text. The header renders the canonical paths without raw colors or new client behavior (`b63b16b`).

## Immediate Next Tasks (In Order)

1. Obtain the required cross-family review of HOST-P2 before its operator-run push; that push recreates a personal-scope GitHub deployment record.
2. Complete full-history mechanical and semantic review, then proceed with the public flip and launch announcements. Essay #1 is already live and the hosting decision is closed.
3. Follow up on profile avatars and the OG/social-card image. Run ESSAY-P3-V F-3 and Markdown ZIP work after the flip; retain PROJ-A1 F1/G2/G3 for Phase 3 and F2 for Phase 4.

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
| SITE-P17.1 | 2026-09-05 | Public-face fix batch | 473f321, c6bd5c0, 8c33987, 416402b |
| SITE-P17.1.1 | 2026-09-05 | History decision corrected; template markers removed | a6831d1 |
| SITE-P17.1-V | 2026-09-05 | Cross-family VERIFY, Claude Code — PASS WITH FINDINGS | — |
| SITE-P17.2 | 2026-09-05 | Canon reconciled; public-state rule recorded | d62d4d2, fa02157 |
| SITE-P17.2-V | 2026-09-05 | VERIFY, Codex (same-family) — FAIL — superseded | — |
| SITE-P17.2.1 | 2026-09-05 | Canon references corrected; state wording reconciled; protocol deferral recorded | 1cccb59, 0671e7b |
| SITE-P17.2-V2 | 2026-09-05 | Cross-family VERIFY, Claude Code — PASS WITH FINDINGS | — |
| SITE-P17.2.2 | 2026-09-05 | Protocol routed into session start; status pins and state records reconciled | 40c5cb3, 92e0800 |
| SITE-P17.2.2-V | 2026-09-05 | Cross-family VERIFY, Claude Code — PASS WITH FINDINGS | — |
| SITE-P17.2.3 | 2026-09-05 | Permitted vendor classes clarified; planning wording, stale state sections, and session log reconciled | f2201d9, 526cce8 |
| SITE-P17.2.3-V | 2026-09-05 | PASS WITH FINDINGS (F1–F4); folded into ESSAY-P3 | — |
| SITE-P17.1-M | 2026-09-05 | Manifest expanded 25→31; 31 nonblank entries confirmed during ESSAY-P3 | — |
| PROJ-A1 | 2026-09-05 | PASS WITH FINDINGS (1H/8M/4L); folded: D1 D2 D3 E1 G1 A1 C1 C2 L-1; deferred: A2 logo intake, F1/G2/G3 Phase 3, F2 Phase 4 | — |
| ESSAY-P3.1 | 2026-09-05 | D1: content validation gates the package build | e06a9df |
| ESSAY-P3.2 | 2026-09-05 | M-1 and X1: free-text discovery paths, module extraction, regression tests | 7df25de |
| ESSAY-P3.3 | 2026-09-05 | D2/G1: Atom author and populated HTTP export assertions | 9dec7d6 |
| ESSAY-P3.4 | 2026-09-05 | D3: fail-closed empty manifests and scanner regression tests | 59d439d |
| ESSAY-P3.5 | 2026-09-05 | Closed essay #1 imported as an unpublished English MDX source | 074dc34 |
| ESSAY-P3.6 | 2026-09-05 | E1: three reference paragraphs corrected to twenty-three days | 8dfd437 |
| ESSAY-P3.7 | 2026-09-05 | L-1/L-2: CSS-only type-floor scope and F-5 disposition recorded | 672df76 |
| ESSAY-P3.8 | 2026-09-05 | A1: four-line README starting path | 7c70ad3 |
| ESSAY-P3 records | 2026-09-05 | C1/C2 and prior review outcomes reconciled; acceptance results recorded; currency pins implementation commit 8 | 8f4cd7a |
| ESSAY-P3-V | 2026-09-06 | PASS WITH FINDINGS (F-1–F-4); dispositions: F-1 confirmed, F-2 applied, F-3 queued post-flip, F-4 no action | — |
| ESSAY-P4 | 2026-09-06 | Essay #1 published with date 2026-09-06; two September → August corrections; populated publication assertions enabled; sample pages remain draft | 778c95b9263761c0e508ff629def93828a357ce2 |
| ESSAY-P4 records | 2026-09-06 | Publication and review dispositions recorded; publication push shipped and essay is live | ccb61f1 |
| ESSAY-P4-V | 2026-09-06 | PASS WITH FINDINGS (F-1–F-3); F-1/F-2 fixed in BRAND-P9; F-3 → pre-flip hosting decision | — |
| BRAND-P9.1 | 2026-09-06 | Delivered icon sanitized without geometry changes; optical correction measured; lockup gap rejected; production brand license boundary established | f650fa4 |
| BRAND-P9.2 | 2026-09-06 | Token-derived site icon set and six avatar exports; reproducible generator; unchanged reading-route JS budgets | 6bce7af |
| BRAND-P9.3 | 2026-09-06 | Production handoff reconciled; lockup correction and social-card follow-up retained | fe46a57 |
| BRAND-P9 records | 2026-09-06 | Production intake and publication state reconciled | eb0489b |
| BRAND-P9-V | 2026-09-06 | PASS on repo checks; live check confirmed by HOST-P1 | eb0489b |
| HOST-P1 | 2026-09-06 | Production moved to the Vercel personal scope; former-team seat closed; live brand check confirmed | eb0489b |
| HOST-P2 | 2026-09-06 | All 25 slug-bearing GitHub deployments removed; header composes canonical icon + live text; header labels 13px; lockup closed as unnecessary; X-1–X-3 recorded | b63b16b |

## Decisions

- Licenses: MIT (code) + CC BY-SA 4.0 (content), 2026-09-05. Production brand assets and derivatives are excluded from both and are not licensed for reuse (`f650fa4`).
- History rewrite declined to preserve the commit references in the evidence trail (`0671e7b`); full-history review remains required before the public flip.
- Public-state rule: state records carry outcomes and hashes only. Full rule landed in WORKING-PROTOCOL.md at fa02157.

## Session Notes

Production hosting on Vercel in the personal scope uses Git auto-deploy with Cloudflare DNS and verified Google, Bing, and IndexNow discovery. HOST-P1 confirmed the live site and brand assets at `eb0489b` and closed the former-team seat. HOST-P2 removed all 25 slug-bearing GitHub deployment records with operator authorization; the next push recreates a personal-scope record. The header implementation is committed at `b63b16b`; this batch has not been pushed. The lockup is closed as unnecessary: the header composes the canonical icon + live text. Reading-route JavaScript is 36.22 KiB, down from 36.29 KiB. The public flip remains the current task. The private scanner runs on pre-push and stays outside CI by design. No hosted build-command override is tracked in the repository; external Vercel build settings were not inspected in HOST-P2.

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
[Any extra context: file locations, design constraints — never credentials]

Verify: [what success looks like].
When done, report results and propose or update state according to role rules.
Do not commit without explicit human approval.
~~~

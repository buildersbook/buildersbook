<!-- LEAD-V FRAMEWORK -->
# Builder's Book — Project State

Current through: f033a2d0c37cfe5744255e8676601f243c9ec514

> **How to use this file:**
> Update at the **start** and **end** of every work session.
> At session start: review current state, verify against codebase.
> At session end: update what was completed, log the session, set up next steps.
> This file is always current state, not a log. Replace content — don't append.
> Previous state is preserved in git history.

> Last updated: 2026-09-08 (UX-P1)
> Updated by: IMPLEMENT — UX-P1

## Phase Status

> The codebase is the source of truth. `DEVELOPMENT-PLAN.md` tracks planning intent; this table summarizes current phase status. When plan and repo disagree, the repo wins — reconcile the plan to match.

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Bootstrap | Complete | Repo created under the organization with repo-local identity pin; LEAD-V v5 selectively installed and customized; governing documents added |
| 1 | Site scaffold | Complete | TP-002, TP-003, and TP-004 complete; sample-page criterion satisfied via validated rendering in review; sample pages remain draft and return 404; essay #1 is the first published content page and is live in production. |
| 2 | Essay #1 and public launch | Complete — public, unannounced | Essay #1 is published and live with publication date 2026-09-06; its publication push shipped and populated publication assertions are enabled (`778c95b`, records `ccb61f1`). The repo became public on 2026-09-07; production serves `b3be837` after the DESIGN-P1.1 auto-deploy. Announcement is deferred to the operator's launch-readiness gate. |

## Brand Track

- Status: BRAND-P1 through BRAND-P8 design decisions were closed; DESIGN-P1 reopened the functional-text floor and dark palette on live evidence from 2026-09-07. DESIGN-P1.1 further lowers dark backgrounds and neutralizes the palette after operator review. BRAND-P9 canonical icon, site icon set, and avatar exports are complete (`f650fa4`, `6bce7af`, handoff `fe46a57`). The lockup is closed as unnecessary: the header composes the canonical icon + live text.
- Track handoff and closed decisions: `design/HANDOFF-BRAND.md`
- Build spec corrections: `design/DESIGN-BUILD-NOTES.md` — this file explicitly OVERRIDES the mockup CSS wherever they conflict. UX-P1 reconciles its palette values and ratios with DESIGN-P1.1; the current values and contrast fixtures are in `styles/tokens.css` and `scripts/validate-design.ts`.
- Current design token values: `styles/tokens.css`; original mockup values remain archived in `design/reference/`.
- The delivered icon is canonical; normalized geometry matches `design/brand/icon.svg` exactly. The designer’s optical correction from the earlier master and export specifications are recorded in `design/brand/NOTES.md` (`f650fa4`).
- The lockup is omitted: its gap is 7.2 units (0.857 cursor widths), below the required 25.2 units (3.0 cursor widths) (`f650fa4`). The lockup is closed as unnecessary: the header composes the canonical icon + live text.
- The adaptive SVG, 16/32/48px ICO, 180px Apple icon, manifest, and 192/512px PNGs are committed. Six light/dark avatars at 400/800/1024px were exported outside the repository; profile rollout remains ahead (`6bce7af`).
- The header composes the canonical inline icon and live-text wordmark, with 13px navigation labels (`b63b16b`). Production brand assets and derivatives are excluded from MIT and CC BY-SA and are not licensed for reuse (`f650fa4`).

## Environment Status

- Application configuration: the completed scaffold requires no application secrets
- Site scaffold: provisioned with Next.js 16 App Router, Fumadocs UI/MDX, Tailwind CSS, and semantic design tokens
- Content and search: typed local `book` and `essays` MDX collections, constrained authoring, validation, and static FlexSearch are provisioned
- Hosting: production hosting consolidated on the personal Vercel scope at <https://buildersbook.dev>, project `buildersbook`, Git-connected to `buildersbook/buildersbook` with `main` as the production branch (HOST-P1, `eb0489b`). DESIGN-P1 and DESIGN-P1.1 were pushed and auto-deployed successfully, most recently through `b3be837`. FLIP-P1 previously deployed `722ac96` through manual Create Deployment; changing repository visibility did not trigger auto-deploy.
- Repository visibility: public since 2026-09-07; public, unannounced. The active `main-protection` ruleset blocks force-pushes and restricts deletions only.
- GitHub deployment records: HOST-P2 removed all 25 previous records. The API confirms successful Production deployments `6313336300` for DESIGN-P1 at `0e8b079` and `6313680007` for DESIGN-P1.1 at `b3be837`. Environment names remain `Preview` and `Production`.
- DNS: Cloudflare serves `buildersbook.dev`; apex and `www` verification is complete
- Discovery consoles: Google Search Console and Bing Webmaster Tools are verified; sitemaps are submitted; IndexNow succeeded for DESIGN-P1.1 on `deployment_status` (run `34148787578`, `b3be837`); CI also passed (run `34148737160`)
- Database: none — explicitly no database at launch
- Auth: none — no user accounts
- Commands: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm test`

## Known Bugs

None.

## Current Task

UX-P1 is implemented and committed locally with explicit operator authorization: reader controls and the environment-gated LAN fix at `5d29339`, essay publication filtering and metadata at `f033a2d`, and records last in this commit. Acceptance passes; no push was performed. Production remains DESIGN-P1.1 at `b3be837`, public and unannounced.

## What Was Done Last Session

- Reproduced the light-mode template failure: Shiki's light syntax text overrode the code ink on the dark code background. The corrected span selector uses code ink in both themes; light code text is 12.8442:1 and metadata is 5.4025:1. Contrast fixture data covers the code and copied-feedback roles.
- Added mobile-only Search and theme icons, a Search menu item, explicit search opener restoration, panel entry focus, and a keyboard focus wrap. Every header control has a 44×44px minimum target; the mobile mark is 24px and the header remains 65px.
- Added sticky-header scroll clearance, persistent accent underlines for prose links, responsive essay metadata columns, and a non-breaking space before the curriculum arrow.
- Hid unpublished essays from the public index and added an assertion against the rendered page. An injected unpublished title fails that assertion. Book planned/draft rows and discovery exclusions remain unchanged.
- Validation and all 18 Node tests pass. The production build passes with both reading-route budgets at 36.63 KiB, up 0.41 KiB from 36.22 KiB. The 11px floor probe fails and its 12px control passes; all probes were removed. The private scan exits 0.
- Browser checks cover light/dark code colors, desktop and 320px/390px layouts, header target sizes, search dismissal and opener restoration, menu entry focus and keyboard wrapping, and reverse keyboard navigation below the sticky header. Real iPhone review remains with the operator.
- UX-P1 device revision: Safari reproduced an inert menu because Next.js rejected LAN-origin development chunks with HTTP 403 before header hydration. A single opt-in development origin fixes the asset requests and HMR. Safari's iPhone viewport now opens the menu with panel focus and no entry ring; no menu or hit-area change was needed. Validation and build pass with budgets unchanged. This Mac's responsive preset does not emulate touch events; real iPhone retesting remains pending.
- Reconciled design notes to current token values and fixture ratios. Verified DESIGN-P1 and DESIGN-P1.1 production deployment records, DESIGN-P1.1 CI, and IndexNow success; recorded DESIGN-P1-V and UX-R1 outcomes.
- The operator authorized all three proposed commits. The development-origin setting is environment-only; tracked files contain no IP addresses or assignment of the development-origin value. The development server is stopped, and the generated Next.js declaration matches its committed version. Records pin the second implementation commit; no push was performed.

## Active Blockers

None.

## Open Items

- JS-budget SITE-P15.2 deferred findings: case-insensitive filesystems can accept a case-mismatched path (Linux CI is the case-sensitive compensating control, strengthened by SITE-P16); async-verdict label precedence is diagnostics-only (F2); `checkBudget` orchestration is untested (F3); suffix-walk tail collision is specified behavior (F4); the summary prints twice (F5); and bracket-prefixed route groups are mislabeled but fail closed (F6).
- IndexNow SITE-P15.6 deferred findings: CDATA inside `<loc>` parses silently but is unreachable with the current generator (F4); and the script reads the production alias rather than the event's deployment URL, so alias lag can make a run stale by one deployment before it self-corrects (F5, design note).
- Protocol: reconcile WORKING-PROTOCOL checkpoint-commit clause with AGENTS/CLAUDE single-diff authorization (Phase 3, SITE-P17.2-V finding).
- PROJ-A1 F1/G2/G3 remain in Phase 3; F2 remains in Phase 4. A2 logo intake is complete (`f650fa4`, `6bce7af`, `b63b16b`).
- Brand follow-up: profile avatar rollout and an OG/social-card image. No social-card image was built in BRAND-P9.
- ESSAY-P3-V F-3 is queued for post-flip follow-up.
- Phase 1 Markdown ZIP is queued for post-flip follow-up.

## Resolved This Session

- UX-P1 F1–F11 and the LAN development-origin revision are committed locally with explicit operator authorization; acceptance passes and push is pending.
- The design notes now reflect the DESIGN-P1.1 palette and UX-P1 layout, link, hit-area, and focus rules.
- Production, CI, and IndexNow records now pin `b3be837` rather than POST-P1.

## Immediate Next Tasks (In Order)

1. Complete UX-P1 cross-family verification and any remaining real-device review before the operator-run push. All three local commits are authorized; records pin the second implementation commit. UX-P1 is pending push.
2. Assess launch readiness at the operator's gate; announce only when that gate is met. The repo remains public, unannounced.
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
| HOST-P1 | 2026-09-06 | Hosting consolidated on the personal Vercel scope; live brand check confirmed | eb0489b |
| HOST-P2 | 2026-09-06 | All 25 slug-bearing GitHub deployments removed; header composes canonical icon + live text; header labels 13px; lockup closed as unnecessary; X-1–X-3 recorded | b63b16b, 722ac96 |
| HOST-V | 2026-09-07 | PASS on adjudication (initial FAIL superseded); F2–F4 LOW, addressed in POST-P1; full-history scan clean on manifest lines 1–8 and 10–25; line 9 residue accepted — a public product name in two 2026-08-24 framework-template commits (added in `b980528`, removed in `75ea816`), absent from every tree since | 722ac96 |
| FLIP-P1 | 2026-09-07 | Public, unannounced; `main-protection` blocks force-pushes and restricts deletions only; production `722ac96` via manual Create Deployment (no auto-deploy on visibility change); IndexNow succeeded on `deployment_status` (run `34131409014`); anonymous deployments-page 404 resolved via unauthenticated API: HTTP 200, successful Production deployment `6310415010` for `722ac96` | 722ac96 |
| POST-P1 | 2026-09-07 | Reader-facing homepage status; archived design prose notice; four repository-backed ADVERSARY examples; hosting-only state wording; quiet public flip and review dispositions recorded; pushed through `5b1d55d` and auto-deployed successfully (deployment `6311595545`); IndexNow succeeded (run `34137739418`) | 634c338, 836156b, 5d472c0, 5b1d55d |
| POST-P1-V | 2026-09-07 | PASS WITH FINDINGS (3 LOW); run post-push by operator direction | 5b1d55d |
| DESIGN-P1 | 2026-09-07 | Reopened the functional-text floor and dark palette on live evidence; larger labels and marginalia, softer dark body contrast, decorative rules matched to light; validation, build, budgets, contrast, floor probes, and private scan pass; pushed through `0e8b079`; successful Production deployment `6313336300` | f036aa8, b04e4b4, fa2669e, 0e8b079 |
| DESIGN-P1.1 | 2026-09-07 | dark mode moved to fully neutral after operator review of a four-paper comparison found all warm variants still read as brown; ink neutralized as the dominant source of perceived warmth. Revised darker backgrounds; other grays preserve prior paper contrast to the nearest 8-bit value; validation, build, budgets, floor probes, and private scan pass; local browser review approved; light mode unchanged; pushed through `b3be837`; successful Production deployment `6313680007`, CI `34148737160`, and IndexNow `34148787578` | 53137f2, b3be837 |
| DESIGN-P1-V | 2026-09-08 | PASS WITH FINDINGS (1 LOW, 2 INFO); palette-note and production-state reconciliation applied in UX-P1 | b3be837 |
| UX-R1 | 2026-09-08 | First-time-reader review: 8 findings, 3 HIGH; plus 2 operator findings from a real iPhone; implementation scoped by UX-P1 | — |
| UX-P1 | 2026-09-08 | F1–F11 and the environment-gated LAN development-origin revision implemented; validation, build, contrast and floor probes pass; 36.63 KiB reading-route budgets; three commits explicitly authorized; development server stopped; pending push | 5d29339, f033a2d, this commit |

## Decisions

- Licenses: MIT (code) + CC BY-SA 4.0 (content), 2026-09-05. Production brand assets and derivatives are excluded from both and are not licensed for reuse (`f650fa4`).
- History rewrite declined to preserve the commit references in the evidence trail (`0671e7b`); HOST-V adjudication accepted the historical residue recorded above.
- Minimum Viable Launch: flip quiet; announce at the operator's launch-readiness gate. Phase 2 is public, unannounced — announcement deferred to the gate.
- Public-state rule: state records carry outcomes and hashes only. Full rule landed in WORKING-PROTOCOL.md at fa02157.

## Session Notes

Hosting remains on Vercel with Cloudflare DNS and verified Google, Bing, and IndexNow discovery. Production serves DESIGN-P1.1 at `b3be837`; its deployment, CI, and IndexNow records are successful. DESIGN-P1-V returned PASS WITH FINDINGS (1 LOW, 2 INFO). UX-P1 addresses the reader and real-device findings in three explicitly authorized local commits; browser and automated checks pass, with reading-route JavaScript at 36.63 KiB. Real iPhone retesting remains operator-owned. Records are committed last and pin `f033a2d`, the second implementation commit. The development server is stopped; no push was performed. The repository remains public, unannounced. The published essay is immutable and unchanged. The private scanner runs on pre-push and stays outside CI by design.

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

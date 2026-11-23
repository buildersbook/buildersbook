<!-- LEAD-V FRAMEWORK -->
# Builder's Book — Project State

Current through: dc6884dc6a50b5099373c04d6d1c83cc386c230d

> **How to use this file:**
> Update at the **start** and **end** of every work session.
> At session start: review current state, verify against codebase.
> At session end: update what was completed, log the session, set up next steps.
> This file is always current state, not a log. Replace content — don't append.
> Previous state is preserved in git history.

> Last updated: 2026-11-23 (SITE-P18.2)
> Updated by: IMPLEMENT — SITE-P18.2

## Phase Status

> The codebase is the source of truth. `DEVELOPMENT-PLAN.md` tracks planning intent; this table summarizes current phase status. When plan and repo disagree, the repo wins — reconcile the plan to match.

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Bootstrap | Complete | Repo created under the organization with repo-local identity pin; LEAD-V v5 selectively installed and customized; governing documents added |
| 1 | Site scaffold | Complete | TP-002, TP-003, and TP-004 complete; sample-page criterion satisfied via validated rendering in review; sample pages remain draft and return 404; essay #1 is the first published content page and is live in production. |
| 2 | Essay #1 and public launch | Complete — public, unannounced | Essay #1 is published and live with publication date 2026-09-06; its publication push shipped and populated publication assertions are enabled (`778c95b`, records `ccb61f1`). The repo became public on 2026-09-07 and REPO-P1 shipped on 2026-09-18. Production served be81ae1 (deployment 6525316643) as of 2026-11-23, before the SITE-P18 push. Announcement is deferred to the operator's launch-readiness gate. |

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
- Hosting: production on Vercel at <https://buildersbook.dev>, project `buildersbook`, Git-connected to `buildersbook/buildersbook` with `main` as the production branch. REPO-P1 was pushed on 2026-09-18 through `be81ae1` and auto-deployed successfully (deployment `6525316643`). `vercel.json` runs `pnpm validate && pnpm build` on hosting builds (`e37430a`); `package.json` `engines.node` is `>=22 <27` (`c3bc725`).
- Repository visibility: public since 2026-09-07; public, unannounced. The active `main-protection` ruleset blocks force-pushes and restricts deletions only.
- Repository settings: homepage `https://buildersbook.dev`; description matches the README's open-curriculum sentence; topics `ai-agents`, `claude-code`, `codex`, `developer-workflow`, `engineering-practices`, `nextjs`, `fumadocs`, `mdx`, `technical-writing`, and `open-curriculum`; wiki and Projects disabled (REPO-P1).
- Dependabot: weekly Monday grouping schedules `npm-minor-patch` (cap 2 open npm PRs, majors separate) and `actions` (`20529b6`), and ignores semver-major updates for `@types/node` (`c3bc725`). Three Dependabot PRs were open as of 2026-11-23 (#11, #12, #15); SITE-P18 applies the contents of #12 (`c3bc725`) and #15 (`312a441`) and adds the ignore rule covering #11 (`c3bc725`).
- GitHub deployment records: Production served be81ae1 (deployment 6525316643) as of 2026-11-23, before the SITE-P18 push. Earlier successful Production deployments include `6327182276` for UX-P1 at `929e9ec`, `6313336300` for DESIGN-P1 at `0e8b079`, and `6313680007` for DESIGN-P1.1 at `b3be837`.
- DNS: Cloudflare serves `buildersbook.dev`; apex and `www` verification is complete
- Discovery consoles: Google Search Console and Bing Webmaster Tools are verified; sitemaps are submitted; IndexNow succeeded for UX-P1 on `deployment_status` (run `34224207902`, `929e9ec`); CI also passed (run `34224106222`, both Node `22.23.1` and Node `24` lanes)
- Database: none — explicitly no database at launch
- Auth: none — no user accounts
- Commands: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm validate`

## Known Bugs

None.

## Current Task

SITE-P18 clears the PROJ-A2 maintenance backlog across `312a441`–`ce3b2b0`. SITE-P18 changed no rendered page. The Fumadocs update restyled the search dialog (smaller result text) and removed an axe aria-allowed-attr violation in it; accepted by operator decision 2026-11-23. Production served be81ae1 (deployment 6525316643) as of 2026-11-23, before the SITE-P18 push. SITE-P18-V completed cross-family VERIFY. PROJ-A2.1-A completed the ADVERSARY read. The next task is the UX-R2 fix batch.

## What Was Done Last Session

- Recorded PROJ-A2 (PASS WITH FINDINGS: 0 BLOCKING, 3 HIGH, 9 MED, 10 LOW, 5 INFO), UX-R2 (PASS WITH FINDINGS: 0 BLOCKING, 3 HIGH, 10 MED, 12 LOW; production confirmed at `be81ae1`), and the PROJ-A2.1 history-residue disposition for manifest lines 26–31.
- Updated npm dependencies within current majors (`312a441`): Next `16.4.6`, Fumadocs `16.19.7` (`fumadocs-mdx` `15.6.4`), React `19.3.1`, Tailwind `4.3.5`, Zod `4.6.7`, `@types/node` `24.19.2`, and remaining minor/patch devDependencies.
- Applied SHA-pinned GitHub Action updates from PR #12 verified against release tags, expanded CI lanes to Node `22.23.1`, `24`, and `26`, updated `engines.node` to `>=22 <27`, and ignored `@types/node` semver-major updates in `.github/dependabot.yml` (`c3bc725`).
- Reworked `scripts/check-private.sh` and `scripts/hooks/pre-push` to scan git-tracked files only plus pushed commit added diff lines and commit messages, normalize space/hyphen/underscore separators on literal case-insensitive substrings without echoing terms or matched text, preserve fail-closed exit codes, and expand synthetic temp-repo tests (`280cc7a`). Real tree and range scans exited 0.
- Added `vercel.json` with `"buildCommand": "pnpm validate && pnpm build"` so hosting builds execute lint, typecheck, tests, design validation, content validation, and JS budget while excluding the private scanner and Lighthouse lab (`e37430a`).
- Added `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and `Content-Security-Policy: frame-ancestors 'none'` on all routes in `next.config.mjs` with unit test coverage and verified `curl -sI` responses from a local production build including preserved `.md` alternate `X-Robots-Tag` headers (`405b6ab`).
- Added `/essays/agent-enforcement-hooks` to `scripts/lighthouserc.cjs` with thresholds unchanged (`ce3b2b0`).
- Reconciled `PROJECT_STATE.md` and `DEVELOPMENT-PLAN.md` in this records commit, pinning `Current through` to the Dependabot and CI comment corrections (`dc6884dc6a50b5099373c04d6d1c83cc386c230d`).

## Active Blockers

None.

## Open Items

- UX-R2 fix batch (3 HIGH, 10 MED, 12 LOW findings from the 2026-11-23 review).
- Canon status-line reconciliation (`AGENTS.md`, `CLAUDE.md`, and `CODEX.md` still state the public flip is pending).
- Deferred major upgrades: TypeScript 7, ESLint 10, and pnpm 12 (`@types/node` majors are upgraded manually).
- Full Content-Security-Policy: current CSP sets `frame-ancestors 'none'` only; a full CSP is a separate decision.
- Harden the private scanner for file paths, binary files, Git-quoted file names, and untrimmed manifest entries.
- Set a minimum package release age for installs.
- Confirm the hosting build's Node major from the first deployment after the SITE-P18 push.
- JS-budget SITE-P15.2 deferred findings: case-insensitive filesystems can accept a case-mismatched path (Linux CI is the case-sensitive compensating control, strengthened by SITE-P16); async-verdict label precedence is diagnostics-only (F2); `checkBudget` orchestration is untested (F3); suffix-walk tail collision is specified behavior (F4); the summary prints twice (F5); and bracket-prefixed route groups are mislabeled but fail closed (F6).
- IndexNow SITE-P15.6 deferred findings: CDATA inside `<loc>` parses silently but is unreachable with the current generator (F4); and the script reads the production alias rather than the event's deployment URL, so alias lag can make a run stale by one deployment before it self-corrects (F5, design note).
- Protocol: reconcile WORKING-PROTOCOL checkpoint-commit clause with AGENTS/CLAUDE single-diff authorization (Phase 3, SITE-P17.2-V finding).
- PROJ-A1 F1/G2/G3 remain in Phase 3; F2 remains in Phase 4. A2 logo intake is complete (`f650fa4`, `6bce7af`, `b63b16b`).
- Brand follow-up: profile avatar rollout and an OG/social-card image. No social-card image was built in BRAND-P9.
- ESSAY-P3-V F-3 is queued for post-flip follow-up.
- Phase 1 Markdown ZIP is queued for post-flip follow-up.

## Resolved This Session

- PROJ-A2 maintenance backlog cleared across commits `312a441`, `c3bc725`, `280cc7a`, `e37430a`, `405b6ab`, and `ce3b2b0` with all 28 Node tests, validation gates, and production builds passing (reading-route JS at 39.03 KiB).
- `PROJECT_STATE.md` currency reconciled against production `be81ae1` (deployment `6525316643`, REPO-P1 pushed 2026-09-18) and `DEVELOPMENT-PLAN.md` `/accounts` wording corrected as planned and not yet published.

## Immediate Next Tasks (In Order)

1. Execute the UX-R2 fix batch and canon status-line reconciliation.
2. Assess launch readiness at the operator's gate; announce only when that gate is met. The repo remains public, unannounced.
3. Follow up on profile avatars, OG/social-card image, full CSP decision, deferred majors (TypeScript 7, ESLint 10, pnpm 12), ESSAY-P3-V F-3, and Markdown ZIP work; retain PROJ-A1 F1/G2/G3 for Phase 3 and F2 for Phase 4.

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
| UX-P1 | 2026-09-08 | F1–F11 and the environment-gated LAN development-origin revision implemented; validation, build, contrast and floor probes pass; 36.63 KiB reading-route budgets; pushed through `929e9ec`; successful Production deployment `6327182276`, CI `34224106222` on both Node lanes, and IndexNow `34224207902` | 5d29339, f033a2d, 929e9ec |
| UX-P1-V | 2026-09-10 (recorded) | Operator-reported result: Codex, same-family live measurements — PASS; F10 operator-verified on device | 929e9ec |
| UX-P1-V2 | 2026-09-10 (recorded) | Operator-reported result: Claude, cross-family code read — PASS WITH FINDINGS (2 LOW); Finding 1 addressed by the ref reset in REPO-P1; validator wording clarified to renders the essays index route | 929e9ec |
| REPO-P1 | 2026-09-10 | Homepage and curriculum description set; ten topics added; wiki and Projects disabled; seven Dependabot PRs closed without merging; Monday grouping added; search return-focus ref reset; public README and CONTRIBUTING reviewed and approved; validation, build, budgets, and private checks pass; pushed 2026-09-18 (Production deployment `6525316643`) | 20529b6, 17db2a1, d97a99f, be81ae1 |
| PROJ-A2 | 2026-11-23 | Read-only audit (Claude Code, Opus 5.5) — PASS WITH FINDINGS (0 BLOCKING, 3 HIGH, 9 MED, 10 LOW, 5 INFO) | be81ae1 |
| UX-R2 | 2026-11-23 | Read-only review (Claude Code, Fable 5.2) — PASS WITH FINDINGS (0 BLOCKING, 3 HIGH, 10 MED, 12 LOW); production confirmed at `be81ae1`; fixes queued as a UX batch | be81ae1 |
| SITE-P18 | 2026-11-23 | Maintenance batch (Cursor, Gemini 4 Neon): `312a441` npm updates within current majors; `c3bc725` SHA-pinned actions, Node 26 CI lane, `engines.node >=22 <27`, and `@types/node` major ignore; `280cc7a` tracked-only and pushed-range private scanner rework; `e37430a` hosting validation build command in `vercel.json`; `405b6ab` baseline response security headers; `ce3b2b0` published essay added to Lighthouse URLs | 312a441, c3bc725, 280cc7a, e37430a, 405b6ab, ce3b2b0 |
| SITE-P18-V | 2026-11-23 | Claude Code, Opus 5.5, cross-family VERIFY. PASS WITH FINDINGS (0 BLOCKING, 1 HIGH, 3 MED, 6 LOW, 6 INFO). 36 of 36 page screenshots pixel-identical to the pre-batch baseline. The search-dialog restyle (HIGH) was accepted. Clean-host build passes on Node 22 and Node 26. | ce3b2b0 |
| SITE-P18.1 | 2026-11-23 | Codex (GPT-6.2 Sol) removed tool co-author trailers from the unpushed range with trees unchanged, corrected two comments (`dc6884d`), and corrected the records. SITE-P18.2 amended this records commit with the PROJ-A2.1-A outcome. | dc6884d, this commit |
| PROJ-A2.1-A | 2026-11-23 | Cross-family ADVERSARY read (Codex, GPT-6.2 Sol; model name supplied by the operator, the harness reports GPT-6). NOT CONFIRMED as existence-only. Occurrence count matched the earlier scan (2 exact and 5 variant hit lines) with one location corrected. No occurrences in pull-request or issue text, the repository description or topics. Residue accepted by operator decision. | be81ae1 |

## Decisions

- Licenses: MIT (code) + CC BY-SA 4.0 (content), 2026-09-05. Production brand assets and derivatives are excluded from both and are not licensed for reuse (`f650fa4`).
- History rewrite declined to preserve the commit references in the evidence trail (`0671e7b`); HOST-V adjudication accepted the historical residue recorded above. PROJ-A2.1 (2026-11-23): full-history scan of private-manifest lines 26-31. Lines 26-30 are category words (business-arrangement wording, a downloads-folder path, a token name with no value), accepted as residue under the existing history decision (0671e7b). Line 31 is the name of a private product layer; it occurs in earlier revisions of two records files and in one commit subject, and nowhere in the current tree. A cross-family ADVERSARY read (PROJ-A2.1-A, 2026-11-23) did not confirm that history discloses the layer's existence only: early revisions of the development plan also name two planned artifacts and a planned first implementation for it. No implementation, data model, scoring logic, customers or commercial terms appear in history. Accepted as residue with that knowledge by operator decision 2026-11-23; no history rewrite.
- Minimum Viable Launch: flip quiet; announce at the operator's launch-readiness gate. Phase 2 is public, unannounced — announcement deferred to the gate.
- Public-state rule: state records carry outcomes and hashes only. Full rule landed in WORKING-PROTOCOL.md at fa02157.

## Session Notes

Production served be81ae1 (deployment 6525316643) as of 2026-11-23, before the SITE-P18 push. PROJ-A2 (PASS WITH FINDINGS: 0 BLOCKING, 3 HIGH, 9 MED, 10 LOW, 5 INFO) and UX-R2 (PASS WITH FINDINGS: 0 BLOCKING, 3 HIGH, 10 MED, 12 LOW) completed on `be81ae1`, and PROJ-A2.1 dispositioned historical residue for manifest lines 26–31. SITE-P18 clears the PROJ-A2 maintenance backlog across `312a441`–`ce3b2b0`. SITE-P18 changed no rendered page. The Fumadocs update restyled the search dialog (smaller result text) and removed an axe aria-allowed-attr violation in it; accepted by operator decision 2026-11-23. Validation, all 28 Node tests, production builds (reading-route JS at 39.03 KiB), and real private scans pass. Records pin `dc6884d`. The repository remains public, unannounced, and the published essay is unchanged.

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

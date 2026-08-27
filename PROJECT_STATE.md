<!-- LEAD-V FRAMEWORK -->
# Builder's Book — Project State

> **How to use this file:**
> Update at the **start** and **end** of every work session.
> At session start: review current state, verify against codebase.
> At session end: update what was completed, log the session, set up next steps.
> This file is always current state, not a log. Replace content — don't append.
> Previous state is preserved in git history.

> Last updated: 2026-08-27 (SITE-P11.1)
> Updated by: IMPLEMENT — SITE-P11.1 findings batch

## Phase Status

> The codebase is the source of truth. `DEVELOPMENT-PLAN.md` tracks planning intent; this table summarizes current phase status. When plan and repo disagree, the repo wins — reconcile the plan to match.

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Bootstrap | Complete | Repo created under the organization with repo-local identity pin; LEAD-V v5 selectively installed and customized; governing documents added |
| 1 | Site scaffold | In progress | TP-002, TP-003, and TP-004 complete; SITE-P11.1 follow-up VERIFY and production deployment remain |

## Brand Track

- Status: complete (BRAND-P1 through BRAND-P8, parallel SCOUT session). Logo and site design decisions are closed.
- Track handoff and closed decisions: `design/HANDOFF-BRAND.md`
- Build spec corrections: `design/DESIGN-BUILD-NOTES.md` — this file explicitly OVERRIDES the mockup CSS wherever they conflict. Read it before implementing any design token or component.
- Design token value source: `design/reference/` (extracted mockup HTML/CSS)
- Open external dependency: human designer to deliver 2 production SVGs. Not a blocker for any phase; launch requires only a typography-only wordmark and favicon.
- Queued: export-pass work per `design/HANDOFF-BRAND.md`.

## Environment Status

- `.env.local`: does not exist; no local application secrets are required for the completed scaffold
- `.env.production`: does not exist; production environment is not yet provisioned
- Site scaffold: provisioned with Next.js 16 App Router, Fumadocs UI/MDX, Tailwind CSS, and semantic design tokens
- Content and search: typed local `book` and `essays` MDX collections, constrained authoring, validation, and static FlexSearch are provisioned
- Hosting: Vercel personal account; project pending Phase 1
- DNS: Cloudflare for `buildersbook.dev`; configuration pending Phase 1
- Database: none — explicitly no database at launch
- Auth: none — no user accounts
- Commands: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm test`

## Known Bugs

None.

## Current Task

SITE-P11.1 findings batch complete on local `main`; awaiting cross-family VERIFY of the follow-up range

## What Was Done Last Session

- Closed every generated-source import form outside the two audit exceptions and verified all four boundary probes fail lint.
- Replaced design fixtures with repository-wide raw-value and font-size invariants; added the missing light-mode contrast regression pairs.
- Derived discovery exclusions and positive assertions from the live unpublished and published page sets.
- Added the IndexNow route invariant, Lighthouse ignore, main-only push CI with concurrency, and documentation/state reconciliation from SITE-P11.

## Active Blockers

None.

## Open Items

- `AGENTS.md`, `CLAUDE.md`, and `CODEX.md` retain stale `blog` collection references; correcting canon files requires a dedicated prompt.

## Immediate Next Tasks (In Order)

1. SITE-P11.2 cross-family VERIFY of the SITE-P11.1 four-commit range.
2. Operator push local `main` after VERIFY passes.
3. SITE-P12 deploy: Vercel, Cloudflare DNS, Google Search Console, and Bing Webmaster Tools with operator checkpoints.
4. Run the Phase 1 exit check.

## Session Log

<!-- Track session history. One row per session. -->
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
| SITE-P11.1 | 2026-08-27 | Resolve the SITE-P11 boundary, invariant-gate, discovery-test, and hygiene findings | 68b8243, c4ede2d, 7b1c250, this commit |

## Session Notes

The local site and discovery layer are provisioned; Vercel, DNS, and webmaster-tool verification remain pending Phase 1. The private manifest remains operator-local by design: every clone must run `git config core.hooksPath scripts/hooks`, and CI does not invoke the private scanner. Canon collection naming still needs the dedicated reconciliation prompt recorded above.

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

<!-- LEAD-V FRAMEWORK -->
# Builder's Book — Project State

> **How to use this file:**
> Update at the **start** and **end** of every work session.
> At session start: review current state, verify against codebase.
> At session end: update what was completed, log the session, set up next steps.
> This file is always current state, not a log. Replace content — don't append.
> Previous state is preserved in git history.

> Last updated: 2026-08-26 (SITE-P3)
> Updated by: IMPLEMENT — SITE-P3 plan reconciliation

## Phase Status

> The codebase is the source of truth. `DEVELOPMENT-PLAN.md` tracks planning intent; this table summarizes current phase status. When plan and repo disagree, the repo wins — reconcile the plan to match.

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Bootstrap | Complete | Repo created under the organization with repo-local identity pin; LEAD-V v5 selectively installed and customized; governing documents added |
| 1 | Site scaffold | Not started | Next.js (App Router) + Fumadocs scaffold begins after bootstrap |

## Brand Track

- Status: complete (BRAND-P1 through BRAND-P8, parallel SCOUT session). Logo and site design decisions are closed.
- Track handoff and closed decisions: `design/HANDOFF-BRAND.md`
- Build spec corrections: `design/DESIGN-BUILD-NOTES.md` — this file explicitly OVERRIDES the mockup CSS wherever they conflict. Read it before implementing any design token or component.
- Design token value source: `design/reference/` (extracted mockup HTML/CSS)
- Open external dependency: human designer to deliver 2 production SVGs. Not a blocker for any phase; launch requires only a typography-only wordmark and favicon.
- Queued: export-pass work per `design/HANDOFF-BRAND.md`.

## Environment Status

- `.env.local`: does not exist; environment not yet provisioned
- `.env.production`: does not exist; environment not yet provisioned
- Site scaffold: not yet provisioned; no `package.json` exists
- Content and search: local MDX collections and FlexSearch planned for Phase 1; not yet provisioned
- Hosting: Vercel personal account; project pending Phase 1
- DNS: Cloudflare for `buildersbook.dev`; configuration pending Phase 1
- Database: none — explicitly no database at launch
- Auth: none — no user accounts
- Build, test, lint, and dev commands: TBD at Phase 1 site scaffold

## Known Bugs

None.

## Current Task

Phase 1 — site scaffold, not started

## What Was Done Last Session

- BOOT-P1 through BOOT-P7 on 2026-08-24.
- Created `buildersbook/buildersbook` under the organization and pinned the repo-local Git identity.
- Selectively installed the 14 LEAD-V v5 framework files from commit `b9805284`.
- Customized the LEAD-V templates for Builder's Book.

## Active Blockers

None.

## Immediate Next Tasks (In Order)

1. SITE-P4 — draft TP-002 (SCOUT), then Fumadocs scaffold (IMPLEMENT)

## Session Log

<!-- Track session history. One row per session. -->
| Session | Date | Focus | Commit |
|---------|------|-------|--------|
| BOOT-P1–BOOT-P7 | 2026-08-24 | Repository bootstrap, LEAD-V v5 selective install, and template customization | f8dc913, b980528, 75ea816 |
| BOOT-P8 | 2026-08-25 | Governing documents and Phase 1 transition | 9912b1a |
| BOOT-P9 | 2026-08-25 | Brand track artifacts into repo | b47dab9 |
| BOOT-P11 | 2026-08-25 | Plan reconciliation per BOOT-P10.1 audit | 4f5b184 |
| SITE-P3 | 2026-08-26 | Plan reconciliation for design-review scope and private Visibility-layer removal | Pending |

## Session Notes

Environment, services, and deployment are not yet provisioned. The Vercel project is pending Phase 1.

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

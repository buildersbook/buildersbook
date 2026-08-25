<!-- LEAD-V FRAMEWORK -->
# Builder's Book — Project State

> **How to use this file:**
> Update at the **start** and **end** of every work session.
> At session start: review current state, verify against codebase.
> At session end: update what was completed, log the session, set up next steps.
> This file is always current state, not a log. Replace content — don't append.
> Previous state is preserved in git history.

> Last updated: 2026-08-24 (BOOT-P1 through BOOT-P7)
> Updated by: IMPLEMENT — BOOT-P7 template customization

## Phase Status

> The codebase is the source of truth. `DEVELOPMENT-PLAN.md` tracks planning intent; this table summarizes current phase status. When plan and repo disagree, the repo wins — reconcile the plan to match.

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Bootstrap | Complete pending BOOT-P7 commit | Repo created under the organization with repo-local identity pin; LEAD-V v5 selectively installed and customized |
| 1 | Site scaffold | Not started | Next.js (App Router) + Fumadocs scaffold begins after bootstrap |

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

BOOT-P7 — customize the installed LEAD-V v5 templates for Builder's Book. Editing is complete pending human diff review and commit.

## What Was Done Last Session

- BOOT-P1 through BOOT-P7 on 2026-08-24.
- Created `buildersbook/buildersbook` under the organization and pinned the repo-local Git identity.
- Selectively installed the 14 LEAD-V v5 framework files from commit `b9805284`.
- Customized the LEAD-V templates for Builder's Book.

## Active Blockers

None.

## Immediate Next Tasks (In Order)

1. BOOT-P8 — commit `DEVELOPMENT-PLAN.md` and `WORKING-PROTOCOL.md`.

## Session Log

<!-- Track session history. One row per session. -->
| Session | Date | Focus | Commit |
|---------|------|-------|--------|
| BOOT-P1–BOOT-P7 | 2026-08-24 | Repository bootstrap, LEAD-V v5 selective install, and template customization | Pending |

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

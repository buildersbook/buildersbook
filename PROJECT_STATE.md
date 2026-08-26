<!-- LEAD-V FRAMEWORK -->
# Builder's Book — Project State

> **How to use this file:**
> Update at the **start** and **end** of every work session.
> At session start: review current state, verify against codebase.
> At session end: update what was completed, log the session, set up next steps.
> This file is always current state, not a log. Replace content — don't append.
> Previous state is preserved in git history.

> Last updated: 2026-08-26 (SITE-P5)
> Updated by: IMPLEMENT — SITE-P5 TP-002 implementation

## Phase Status

> The codebase is the source of truth. `DEVELOPMENT-PLAN.md` tracks planning intent; this table summarizes current phase status. When plan and repo disagree, the repo wins — reconcile the plan to match.

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Bootstrap | Complete | Repo created under the organization with repo-local identity pin; LEAD-V v5 selectively installed and customized; governing documents added |
| 1 | Site scaffold | In progress | TP-002 complete; TP-003 CI gates and TP-004 discovery layer remain |

## Brand Track

- Status: complete (BRAND-P1 through BRAND-P8, parallel SCOUT session). Logo and site design decisions are closed.
- Track handoff and closed decisions: `design/HANDOFF-BRAND.md`
- Build spec corrections: `design/DESIGN-BUILD-NOTES.md` — this file explicitly OVERRIDES the mockup CSS wherever they conflict. Read it before implementing any design token or component.
- Design token value source: `design/reference/` (extracted mockup HTML/CSS)
- Open external dependency: human designer to deliver 2 production SVGs. Not a blocker for any phase; launch requires only a typography-only wordmark and favicon.
- Queued: export-pass work per `design/HANDOFF-BRAND.md`.

## Environment Status

- `.env.local`: does not exist; no local secrets are required for TP-002
- `.env.production`: does not exist; production environment is not yet provisioned
- Site scaffold: provisioned with Next.js 16 App Router, Fumadocs UI/MDX, Tailwind CSS, and semantic design tokens
- Content and search: typed local `book` and `blog` MDX collections, constrained authoring, validation, and static FlexSearch are provisioned
- Hosting: Vercel personal account; project pending Phase 1
- DNS: Cloudflare for `buildersbook.dev`; configuration pending Phase 1
- Database: none — explicitly no database at launch
- Auth: none — no user accounts
- Commands: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm test`

## Known Bugs

None.

## Current Task

TP-002 complete; Phase 1 site scaffold remains in progress

## What Was Done Last Session

- Implemented the Next.js and Fumadocs site scaffold with pinned compatible dependencies and production webpack builds.
- Added semantic light/dark tokens, Source Serif 4 and JetBrains Mono, and responsive reading layouts.
- Added typed book/blog collections, constrained MDX, validation, Markdown fallbacks, and static FlexSearch.
- Added accessible marginalia, code, citation, footnote, book-index, header, search, theme, mobile-menu, landing, about, and 404 states.
- Verified responsive behavior, keyboard interaction, theme persistence, search results, validation, lint, types, privacy scanning of repository source, and production static generation.

## Active Blockers

None.

## Immediate Next Tasks (In Order)

1. TP-003 — CI content gates and performance budget, including the four design-review gates.
2. TP-004 — discovery layer, including draft/planned noindex and sitemap exclusion.

## Session Log

<!-- Track session history. One row per session. -->
| Session | Date | Focus | Commit |
|---------|------|-------|--------|
| BOOT-P1–BOOT-P7 | 2026-08-24 | Repository bootstrap, LEAD-V v5 selective install, and template customization | f8dc913, b980528, 75ea816 |
| BOOT-P8 | 2026-08-25 | Governing documents and Phase 1 transition | 9912b1a |
| BOOT-P9 | 2026-08-25 | Brand track artifacts into repo | b47dab9 |
| BOOT-P11 | 2026-08-25 | Plan reconciliation per BOOT-P10.1 audit | 4f5b184 |
| SITE-P3 | 2026-08-26 | Plan reconciliation for design-review scope and private Visibility-layer removal | 33250a4 |
| SITE-P5 | 2026-08-26 | TP-002 Fumadocs scaffold, content foundations, reading UI, and application states | 4e2487f, 3704582, 0d0db37, bdf05d5, 0021032, this commit |

## Session Notes

The local site environment is provisioned; Vercel and DNS remain pending Phase 1. Dark `--surface` remains `#1E1B15`; candidate `#29251C` awaits an operator visual decision. `scripts/check-private.sh` currently scans ignored dependency/build directories unless they are omitted; CI wiring and scanner scope belong to TP-003.

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

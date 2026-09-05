<!-- LEAD-V FRAMEWORK v5 -->
# Agent Context — Builder's Book

This file primes any LLM agent (Claude Code, Codex, Cursor, and others) with universal project context. Read it first.

## Rule Zero — The Codebase Is the Only Source of Truth

**This rule takes precedence over every other rule in this document.**

Before trusting any claim made in a handoff document, planning document, framework doc, or session memory, verify against the actual state of the repo. When in doubt, issue a VERIFY or RESEARCH prompt and check.

When the codebase and a document disagree, **the codebase wins.** Update the document, not the codebase.

## Project Overview

**Name:** Builder's Book
**Description:** The Builder's Book — an open curriculum for engineers who build production software by orchestrating AI coding agents. The project combines a public serialized site for essays and book content with open tooling.
**Status:** Phase 1 complete; Phase 2 in progress (essay #1 review-closed; draft operator-held, not yet in the tree; public flip pending). As of `a6831d1`.
**Repository:** `buildersbook/buildersbook`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript |
| Framework | Next.js (App Router) + Fumadocs |
| Content | Local MDX in-repo; typed `book` and `essays` collections |
| Search | FlexSearch |
| Database | None — explicitly no database at launch |
| Auth | None — no user accounts |
| Styling | Tailwind CSS via PostCSS; Fumadocs styles; semantic tokens in `styles/tokens.css` and site styles in `styles/site.css` |
| Hosting | production on Vercel, Git auto-deploy from main. |
| DNS | Cloudflare. |
| Package Manager | pnpm |

## Roles

Four roles, clear handoffs. Tools are adapters. See `roles/ROLES.md` for the canonical role-first definition.

| Role | Responsibility | Write authority | Example adapters |
|------|----------------|-----------------|------------------|
| **SCOUT** | Planning, discovery, strategy, feature scoping, Task Packet / prompt creation | None | Claude.ai — Opus 5 default, Fable 5 on escalation |
| **IMPLEMENT** | Repo-aware execution, code changes, file edits, migrations, tests, mechanical checks | Full (only role that writes files) | Primary: Codex terminal / browser plugin; secondary: Claude Code (Opus 5) |
| **VERIFY** | Independent review of diffs, claims, tests, instructions, and scope adherence | None | Either Codex or Claude Code, operating read-only and propose-only |
| **ADVERSARY** | Different-family critical review for sensitive work, hidden assumptions, edge cases, and blind spots | None | Claude Code (Opus 5) reviews Codex work; Codex reviews Claude work. The implementing family never reviews itself on sensitive scope. |

File changes flow through IMPLEMENT only. VERIFY and ADVERSARY report; IMPLEMENT executes.

## Folder Structure

Tracked paths through depth 2, with workflow, hook, and archive paths expanded; the existing empty `docs/task-packets/` directory is also shown.

FOR REVIEW:
~~~text
buildersbook/
├── .claude/
│   └── commands/
│       └── retro.md
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── ci.yml
│       └── indexnow.yml
├── .gitignore
├── .nvmrc
├── ADVERSARY.md
├── AGENTS.md
├── CLAUDE.md
├── CODEX.md
├── CONTRIBUTING.md
├── DEVELOPMENT-PLAN.md
├── LICENSE
├── LICENSE-CONTENT
├── PROJECT_STATE.md
├── README.md
├── SECURITY.md
├── VERIFY.md
├── WORKING-PROTOCOL.md
├── app/
│   ├── about/
│   ├── api/
│   ├── atom.xml/
│   ├── book/
│   ├── ed028cc6bfe99c09e25c88b51da41e70.txt/
│   ├── essays/
│   ├── layout.tsx
│   ├── llms-full.txt/
│   ├── llms.mdx/
│   ├── llms.txt/
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── robots.ts
│   ├── rss.xml/
│   └── sitemap.ts
├── components/
│   ├── book-index.tsx
│   ├── code-block.tsx
│   ├── code-copy-button.tsx
│   ├── content-shell.tsx
│   ├── footnotes.tsx
│   ├── marginalia.tsx
│   ├── mdx.tsx
│   ├── mobile-menu.tsx
│   ├── renderers/
│   ├── search-dialog.tsx
│   ├── site-header.tsx
│   ├── theme-toggle.tsx
│   └── wordmark.tsx
├── content/
│   ├── book/
│   └── essays/
├── design/
│   ├── DESIGN-BUILD-NOTES.md
│   ├── HANDOFF-BRAND.md
│   └── reference/
├── docs/
│   ├── UPGRADE-GATES.md
│   ├── archive/
│   │   └── task-packets/
│   │       ├── TP-002.md
│   │       ├── TP-003.md
│   │       └── TP-004.md
│   └── task-packets/
├── eslint.config.mjs
├── lib/
│   ├── content/
│   ├── discovery.ts
│   ├── navigation.ts
│   └── source.ts
├── mdx-components.tsx
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── reference/
│   └── GOTCHAS.md
├── roles/
│   └── ROLES.md
├── scripts/
│   ├── check-js-budget.mjs
│   ├── check-js-budget.test.mjs
│   ├── check-private.sh
│   ├── hooks/
│   │   └── pre-push
│   ├── lighthouserc.cjs
│   ├── submit-indexnow.test.mjs
│   ├── submit-indexnow.ts
│   └── validate-design.ts
├── source.config.ts
├── styles/
│   ├── site.css
│   └── tokens.css
├── templates/
│   ├── FEATURE-BRIEF.md
│   └── TASK-PACKET.md
├── tsconfig.json
└── workflow/
    ├── ASSISTANCE-LOOP.md
    ├── DISCIPLINE.md
    └── verification-checklist.md
~~~

## Current State

1. Read `PROJECT_STATE.md` for what we're working on right now.
2. If `FEATURE-BRIEF.md` is present at the repo root, a feature is in-flight — read it for scope and constraints.
3. Read `DEVELOPMENT-PLAN.md` for the multi-phase roadmap.
4. If a Task Packet under `docs/task-packets/` is referenced, read it as the implementation contract for one unit of work.
5. If `HANDOFF.md` is present, read it for continuation context from the previous session. Rule Zero still applies — verify every claim against the codebase.

## Task Packets

For non-trivial implementation, SCOUT should produce a Task Packet: a durable, repo-readable implementation contract created from `templates/TASK-PACKET.md` and stored under `docs/task-packets/`.

IMPLEMENT consumes the Task Packet plus the actual repo source files. Long chat history is not source of truth. If the packet and the repo disagree, the repo wins and IMPLEMENT reports the conflict before editing.

## Key Conventions

- **Component naming:** PascalCase component functions; related exports may share a file, as in `components/footnotes.tsx`.
- **File naming:** Kebab-case component files; App Router entry files use `page.tsx`, `layout.tsx`, and `route.ts`.
- **Import ordering:** No import-order rule is configured in `eslint.config.mjs`; generated collection imports are restricted to `lib/source.ts` and `lib/content/validate.ts`.
- **State management:** React hooks for interactive components; `next-themes` for theme state; Fumadocs `useDocsSearch` for search state.
- **API patterns:** App Router route handlers; `app/api/search/route.ts` exports a static FlexSearch `GET` handler.
- **Error handling:** Content routes call `notFound()` for missing or unpublished pages; clipboard failures are caught and surfaced through component state.
- **Testing:** Content and design validators plus Node's test runner for the JS-budget and IndexNow scripts, composed by `pnpm test`.

## Package Commands

These commands are defined in `package.json` scripts.

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Build Next.js with webpack; the postbuild script runs the JS budget check |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint and design lint |
| `pnpm typecheck` | Run TypeScript without emitting output |
| `pnpm validate:content` | Validate content schemas, MDX, links, and discovery output |
| `pnpm validate:design` | Run design validation |
| `pnpm test:budget` | Run the JS-budget and IndexNow Node tests |
| `pnpm test` | Run content validation, design validation, and script tests |
| `pnpm validate` | Run lint, typecheck, and tests |
| `pnpm perf:budget` | Check the built reading routes against the JS budget |
| `pnpm perf:lab` | Run Lighthouse CI using `scripts/lighthouserc.cjs` |

## Session Conventions

- **Code block labels.** Every code block carries a label: `IMPLEMENT PROMPT (Opus|Sonnet):`, `VERIFY PROMPT:`, `ADVERSARY PROMPT:`, `RESEARCH PROMPT:`, `MANUAL (terminal):`, or `FOR REVIEW:`.
- **Model selection.** Default Opus for judgment; Sonnet for explicitly mechanical tasks.
- **Fresh context per IMPLEMENT prompt.** New session for each prompt unless doing sequential micro-edits on the same file.
- **Task Packet transfer.** For non-trivial work, move SCOUT planning into `docs/task-packets/` instead of relying on chat history.
- `/retro` — records a durable lesson in the retro log (command: `.claude/commands/retro.md`).
- **Commit format.** Commit messages carry a `Context:` block when AI context files changed.
- **Never commit without human review and explicit authorization.** Authorization covers one reviewed diff and one proposed commit message.

## Execution-Lane Protection

Enforcement applies to every write-capable execution lane equally, or it does not exist as mechanism. Where no lane-equal mechanism exists, protection is process: the human commit gate, cross-family ADVERSARY review, and Rule Zero.

## Authorization Model

Three rules, applied every turn. Canonical version lives in `CLAUDE.md`; summary below.

- **List-before-edit (always).** Before editing or creating any file, IMPLEMENT lists every file and waits for confirmation. Applies even when the SCOUT prompt was explicit about file paths.
- **SCOUT prompt authorization.** The SCOUT-issued prompt itself authorizes the task. No separate "can I proceed?" round — read the prompt, list files, wait for the file-list confirmation, execute.
- **Commit authorization.** A commit requires explicit human approval of one specific diff and proposed message. No commit authorization → stop after the diff.

## Sub-Agents

If `.claude/agents/` contains agent definitions, they can be invoked for isolated research tasks. See `roles/ROLES.md` → Research Mode.

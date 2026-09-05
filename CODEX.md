<!-- LEAD-V FRAMEWORK v5 -->
# Builder's Book — Codex Adapter

This file is the Codex-specific entry point for Builder's Book. `AGENTS.md` is the shared project hub and source of truth for portable LEAD-V rules.

## Rule Zero

Verify claims against the repo before acting. Planning docs, handoffs, Task Packets, and chat history can drift. When a document and the repo disagree, the repo wins.

## How to Use Codex

Codex is a repo-aware adapter. In LEAD-V, it often serves as:

- **IMPLEMENT:** execute scoped prompts or Task Packets, make file changes, run checks, and report diffs.
- **Mechanical VERIFY:** run build, lint, tests, grep, diff, and scope checks as a reviewer that reports findings without editing.
- **ADVERSARY:** perform critical review when Codex is different-family from the planner or implementer, or when the human explicitly requests it.

Claude Code, Claude.ai, Cursor, ChatGPT, Gemini, and other tools remain valid adapters when they follow the role boundaries in `AGENTS.md`.

## Execution-Lane Protection

Enforcement applies to every write-capable execution lane equally, or it does not exist as mechanism. Where no lane-equal mechanism exists, protection is process: the human commit gate, cross-family ADVERSARY review, and Rule Zero.

Codex follows the same process contract as every other IMPLEMENT adapter: confirmed file lists, Task Packet scope, required cross-family ADVERSARY review, no commit without human review and explicit authorization, and no push.

## Session Start

At the start of a Codex session:

1. Read `AGENTS.md`.
2. Read `PROJECT_STATE.md`.
3. Read any referenced `FEATURE-BRIEF.md`, `HANDOFF.md`, or Task Packet.
4. Verify the current repo state before trusting planning notes.

## Task Packets

For non-trivial implementation, use a Task Packet under `docs/task-packets/`. The packet transfers planning context from SCOUT to IMPLEMENT without relying on long chat history.

Codex should read the packet, inspect the referenced files, list intended file changes, wait for confirmation, then edit within the approved scope.

## Claude Slash Commands

`.claude/commands/` contains Claude Code adapters. They do not automatically run in Codex. Follow the same workflow intent through Codex tools instead.

## Project Notes

**Tech stack:** TypeScript; Next.js (App Router) + Fumadocs; local MDX with typed `book` and `essays` collections; FlexSearch; pnpm. No database or user accounts at launch. Styling uses Tailwind CSS via PostCSS, Fumadocs styles, and `styles/tokens.css` / `styles/site.css`.

**Repository:** `buildersbook/buildersbook`

**Hosting:** production on Vercel, Git auto-deploy from main.
**DNS:** Cloudflare.

**Status:** Phase 1 complete; Phase 2 in progress (essay #1 review-closed, public flip pending). As of `a6831d1`.

**Common checks:**

- `pnpm dev` — development server.
- `pnpm build` — webpack production build followed by the JS budget check.
- `pnpm lint` — ESLint and design lint.
- `pnpm typecheck` — TypeScript check without emitting output.
- `pnpm test` — content validation, design validation, and script tests.
- `pnpm validate` — lint, typecheck, and tests.
- `pnpm validate:content` — content schemas, MDX, links, and discovery validation.
- `pnpm perf:budget` — built reading-route JS budget check.
- `pnpm perf:lab` — Lighthouse CI using `scripts/lighthouserc.cjs`.

**Adapter preference:**
- SCOUT: Claude.ai — Opus 5 default, Fable 5 on escalation.
- IMPLEMENT: Primary is Codex terminal / browser plugin; secondary is Claude Code (Opus 5).
- VERIFY: Either Codex or Claude Code, read-only and propose-only.
- ADVERSARY: Cross-family and mandatory on sensitive scope. Claude Code (Opus 5) reviews Codex work; Codex reviews Claude work. The implementing family never reviews itself on sensitive scope.

**Sensitive scope:** LEAD-V sanitization for public release; public repo creation; MCP server proprietary boundary. Any work that could expose client data, proprietary business logic from the operator's other projects, or private identity material.

<!-- LEAD-V FRAMEWORK v5 -->
<!-- CUSTOMIZE: Replace [BRACKETED] tokens with your project's specifics -->
# Agent Context — [PROJECT_NAME]

This file primes any LLM agent (Claude Code, Codex, Cursor, and others) with universal project context. Read it first.

## Rule Zero — The Codebase Is the Only Source of Truth

**This rule takes precedence over every other rule in this document.**

Before trusting any claim made in a handoff document, planning document, framework doc, or session memory, verify against the actual state of the repo. When in doubt, issue a VERIFY or RESEARCH prompt and check.

When the codebase and a document disagree, **the codebase wins.** Update the document, not the codebase.

## Project Overview

<!-- CUSTOMIZE: project identity, tech stack, deployment target -->

**Name:** [PROJECT_NAME]
**Description:** [One paragraph — what this project does, who it's for, what problem it solves.]
**Status:** [e.g., Early development, MVP, Production, Maintenance]

## Tech Stack

<!-- CUSTOMIZE -->

| Layer | Technology |
|-------|-----------|
| Language | [e.g., TypeScript strict] |
| Framework | [e.g., Next.js 15] |
| Database | [e.g., PostgreSQL via Supabase] |
| Auth | [e.g., Supabase Auth] |
| Styling | [e.g., Tailwind CSS v4] |
| Hosting | [e.g., Vercel] |
| Package Manager | [e.g., pnpm] |

## Roles

Four roles, clear handoffs. Tools are adapters. See `roles/ROLES.md` for the canonical role-first definition.

| Role | Responsibility | Write authority | Example adapters |
|------|----------------|-----------------|------------------|
| **SCOUT** | Planning, discovery, strategy, feature scoping, Task Packet / prompt creation | None | ChatGPT/GPT, Claude.ai, Gemini, another strong planning model |
| **IMPLEMENT** | Repo-aware execution, code changes, file edits, migrations, tests, mechanical checks | Full (only role that writes files) | Codex app, Claude Code, Cursor, another repo-aware coding agent |
| **VERIFY** | Independent review of diffs, claims, tests, instructions, and scope adherence | None | Claude Code, Codex, ChatGPT/GPT, Gemini, human checklist review |
| **ADVERSARY** | Different-family critical review for sensitive work, hidden assumptions, edge cases, and blind spots | None | Claude, Codex/ChatGPT, Gemini, another different-family reviewer |

File changes flow through IMPLEMENT only. VERIFY and ADVERSARY report; IMPLEMENT executes.

## Folder Structure

~~~
project-root/
├── .claude/
│   ├── commands/        ← Claude Code slash-command adapters
│   ├── rules/           ← Domain-specific rules (JIT-loaded by file path)
│   └── agents/          ← Sub-agent definitions
├── AGENTS.md            ← This file — universal agent context
├── CLAUDE.md            ← Claude Code entry point
├── CODEX.md             ← Codex adapter entry point
├── VERIFY.md            ← Auditor role primer
├── ADVERSARY.md         ← Cross-model auditor role primer
├── .cursorrules         ← Cursor IDE rules (if using Cursor)
├── PROJECT_STATE.md     ← Current session state
├── skills/              ← Composable skill modules
├── templates/
│   ├── FEATURE-BRIEF.md ← Structured input for complex features
│   └── TASK-PACKET.md   ← Durable SCOUT → IMPLEMENT task contract
├── docs/
│   ├── specs/           ← Locked specifications (incl. DEVELOPMENT-PLAN.md if used)
│   ├── guides/          ← Living documentation
│   ├── task-packets/    ← In-flight Task Packet storage
│   ├── handoffs/        ← Archived session handoffs
│   └── research/        ← Archived decision logs
└── src/                 ← [customize — your application code]
~~~

## Current State

1. Read `PROJECT_STATE.md` for what we're working on right now.
2. If `FEATURE-BRIEF.md` is present at the repo root, a feature is in-flight — read it for scope and constraints.
3. If `docs/specs/DEVELOPMENT-PLAN.md` (or project equivalent) is present, read it for the multi-phase roadmap.
4. If a Task Packet under `docs/task-packets/` is referenced, read it as the implementation contract for one unit of work.
5. If `HANDOFF.md` is present, read it for continuation context from the previous session. Rule Zero still applies — verify every claim against the codebase.

## Task Packets

For non-trivial implementation, SCOUT should produce a Task Packet: a durable, repo-readable implementation contract created from `templates/TASK-PACKET.md` and stored under `docs/task-packets/`.

IMPLEMENT consumes the Task Packet plus the actual repo source files. Long chat history is not source of truth. If the packet and the repo disagree, the repo wins and IMPLEMENT reports the conflict before editing.

## Key Conventions

<!-- CUSTOMIZE -->

- **Component naming:** [e.g., PascalCase, one component per file]
- **File naming:** [e.g., kebab-case for utilities, PascalCase for components]
- **Import ordering:** [e.g., external packages first, then internal, then relative]
- **State management:** [e.g., React context, Zustand, Redux]
- **API patterns:** [e.g., server actions, API routes, tRPC]
- **Error handling:** [e.g., try/catch with typed errors, error boundaries for UI]
- **Testing:** [e.g., Vitest for unit tests, Playwright for e2e — or "no tests yet"]

## Claude Code Slash Commands

These commands are Claude Code adapters, not universal commands across all tools. Other agents should perform the same underlying workflow through their own interface.

| Command | Purpose |
|---------|---------|
| `/prime` | Session cold-start audit |
| `/prime-frontend` | Frontend-specific orientation |
| `/handoff` | Draft structured session handoff document |
| `/commit` | Standardized atomic commit with AI context tracking |
| `/verify` | Post-implementation audit |
| `/simplify` | Code simplification audit on recently changed files |
| `/scaffold` | Bootstrap LEAD-V in a new project |
| `/adversary` | Prepare a cross-model ADVERSARY review package |
| `/retro` | Record a durable LEAD-V lesson |

## Session Conventions

- **Code block labels.** Every code block carries a label: `IMPLEMENT PROMPT (Opus|Sonnet):`, `VERIFY PROMPT:`, `ADVERSARY PROMPT:`, `RESEARCH PROMPT:`, `MANUAL (terminal):`, or `FOR REVIEW:`.
- **Model selection.** Default Opus for judgment; Sonnet for explicitly mechanical tasks.
- **Fresh context per IMPLEMENT prompt.** New session for each prompt unless doing sequential micro-edits on the same file.
- **Task Packet transfer.** For non-trivial work, move SCOUT planning into `docs/task-packets/` instead of relying on chat history.
- **Commit format.** Use `/commit` for standardized messages with a `Context:` block when AI context files changed.
- **Never commit without human review and explicit authorization.** Authorization covers one reviewed diff and one proposed commit message.

## Execution-Lane Protection

Enforcement applies to every write-capable execution lane equally, or it does not exist as mechanism. Where no lane-equal mechanism exists, protection is process: the human commit gate, cross-family ADVERSARY review, and Rule Zero.

## Authorization Model

Three rules, applied every turn. Canonical version lives in `CLAUDE.md`; summary below.

- **List-before-edit (always).** Before editing or creating any file, IMPLEMENT lists every file and waits for confirmation. Applies even when the SCOUT prompt was explicit about file paths.
- **SCOUT prompt authorization.** The SCOUT-issued prompt itself authorizes the task. No separate "can I proceed?" round — read the prompt, list files, wait for the file-list confirmation, execute.
- **Commit authorization.** A commit requires explicit human approval of one specific diff and proposed message. No commit authorization → stop after the diff.

## Domain Rules

`.claude/rules/*.md` load just-in-time when you touch matching file paths. Do not read them preemptively — they load on demand.

## Sub-Agents

If `.claude/agents/` contains agent definitions, they can be invoked for isolated research tasks. See `roles/ROLES.md` → Research Mode.

## Reference Docs

When your task involves a specific area, check these directories:

- `docs/specs/` — Locked feature specifications. Read before implementing any spec'd feature.
- `docs/guides/` — Living style and workflow guides. Read before writing code in an area with established conventions.
- `docs/research/` — Archived evaluations and decision logs. Read when you need to understand why a past decision was made.

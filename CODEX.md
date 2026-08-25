<!-- LEAD-V FRAMEWORK v5 -->
<!-- CUSTOMIZE: Replace [BRACKETED] tokens with your project's specifics -->
# [PROJECT_NAME] — Codex Adapter

This file is the Codex-specific entry point for [PROJECT_NAME]. `AGENTS.md` is the shared project hub and source of truth for portable LEAD-V rules.

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

<!-- CUSTOMIZE: Keep under ~20 lines. Add Codex-specific commands, checks, or constraints. -->

**Tech stack:** [e.g., Next.js, Supabase, Tailwind, pnpm]

**Common checks:**
- `[e.g., pnpm typecheck]` — [purpose]
- `[e.g., pnpm test]` — [purpose]

**Adapter preference:**
- SCOUT: [e.g., ChatGPT / Claude.ai / Gemini]
- IMPLEMENT: [e.g., Codex / Claude Code / Cursor]
- VERIFY: [e.g., Codex mechanical checks / Claude Code / human]
- ADVERSARY: [e.g., different-family reviewer for sensitive work]

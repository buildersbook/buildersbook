@AGENTS.md

<!-- LEAD-V FRAMEWORK v5 -->
<!-- CUSTOMIZE: Replace [BRACKETED] tokens with your project's specifics -->
# [PROJECT_NAME] — Claude Code Adapter

This file is the Claude Code adapter for [PROJECT_NAME]. `AGENTS.md` is the shared project hub and source of truth for portable LEAD-V rules; Claude Code reads it through the `@AGENTS.md` include above, then uses this file for Claude-specific execution notes.

## Rule Zero — The Codebase Is the Only Source of Truth

**This rule takes precedence over every other rule in this document.**

Before trusting any claim made in a handoff document, planning document, framework doc, or session memory, verify against the actual state of the repo. When in doubt, issue a VERIFY or RESEARCH prompt and check.

When the codebase and a document disagree, **the codebase wins.** Update the document, not the codebase.

## Project Summary

<!-- CUSTOMIZE: 2 sentences max -->
[PROJECT_NAME] is a [type of application] built with [primary tech stack]. [One sentence about what it does or who it's for.]

## Context Files

Read these at session start:

1. `AGENTS.md` — shared cross-agent context (loaded via `@AGENTS.md` above)
2. `VERIFY.md` — auditor role primer
3. `ADVERSARY.md` — cross-model auditor role primer
4. `PROJECT_STATE.md` — current phase, session log, known bugs

Read these when the task requires them:

- `FEATURE-BRIEF.md` — in-flight feature brief, if a feature is mid-flight
- `docs/task-packets/` — Task Packets for non-trivial SCOUT → IMPLEMENT transfer
- `.claude/rules/*.md` — domain rules, JIT-loaded per task
- `docs/specs/` — locked specifications, as relevant to task

## Roles (summary — see `roles/ROLES.md` for canonical definitions)

- **SCOUT** — Strategic Consultant. Planning, architecture, prompt or Task Packet generation.
- **IMPLEMENT** — Senior Engineer. Writes and modifies code. Claude Code, Codex, Cursor, and other repo-aware tools can serve here.
- **VERIFY** — Auditor. Read-only. Reports findings as text. Claude Code can run verification through `/verify`.
- **ADVERSARY** — Cross-Model Auditor. Read-only. Required on sensitive code and should use a different model family than the planner, implementer, or verifier.

VERIFY and ADVERSARY never modify files. All file changes flow through IMPLEMENT.

## Execution-Lane Protection

Enforcement applies to every write-capable execution lane equally, or it does not exist as mechanism. Where no lane-equal mechanism exists, protection is process: the human commit gate, cross-family ADVERSARY review, and Rule Zero.

Claude Code follows the same process contract as every other IMPLEMENT adapter. Tool-specific controls do not constitute LEAD-V enforcement unless they protect every write-capable execution lane equally.

## Session Protocol

- Start Claude Code sessions with `/prime` — cold-start audit against current repo state.
- One prompt per turn. No plan dumps.
- Every code block carries a label: `IMPLEMENT PROMPT (Opus|Sonnet):`, `VERIFY PROMPT:`, `ADVERSARY PROMPT:`, `RESEARCH PROMPT:`, `MANUAL (terminal):`, or `FOR REVIEW:`.
- Every `IMPLEMENT PROMPT` header specifies Sonnet or Opus. Default to Opus for judgment, Sonnet for explicitly mechanical tasks.
- Fresh Claude Code session for each IMPLEMENT prompt (unless doing sequential micro-edits on the same file).
- For non-trivial SCOUT → IMPLEMENT work, prefer a Task Packet under `docs/task-packets/` over long chat history.
- At the end of every session, VERIFY proposes `PROJECT_STATE.md` updates as text; IMPLEMENT or the human writes them. Do not close a session with stale state.

## Authorization Model

Three distinct rules. All three apply on every turn.

### List-before-edit (always)

Before editing or creating any file, IMPLEMENT lists every file it intends to modify and waits for confirmation. This applies even when the SCOUT prompt was explicit about which files to touch. The confirmation is confirming the file list matches the prompt's intent — not re-authorizing the task.

No exceptions. Not for "one-line fixes," not for "obvious edits."

### SCOUT prompt authorization (the prompt IS the authorization)

When a SCOUT prompt is issued, that prompt itself authorizes the work. IMPLEMENT does not ask "can I proceed?" — it reads the prompt, lists the files it intends to modify, waits for the file-list confirmation, then executes. There is no separate task authorization round; the file-list confirmation is a scope check, not a re-authorization.

### Commit authorization (human-approved)

- **Human approved one specific diff and message** → IMPLEMENT may commit only that staged content with that message.
- **No explicit commit authorization** → IMPLEMENT stops after showing the diff. No commit. Wait for a follow-up prompt with authorization.

Never commit without explicit human diff approval and commit authorization. Pushes remain human-run.

## Claude Code Slash Commands

These are Claude Code adapters for LEAD-V workflow steps. Other tools should follow the same role responsibilities through their own interfaces.

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

## Domain Rules

`.claude/rules/*.md` files load just-in-time when you touch matching file paths. Do not read them preemptively — they load on demand.

---

## [PROJECT-SPECIFIC: customize during /scaffold]

<!-- CUSTOMIZE: Fill during /scaffold. Keep under ~30 lines. -->

**Tech stack:** [e.g., Next.js 15, Supabase, Tailwind v4, pnpm]

**Key commands:**
- `[e.g., pnpm dev]` — [purpose]
- `[e.g., pnpm build]` — [purpose]
- `[e.g., pnpm typecheck]` — [purpose]

**Domain rules:**
- [Project-specific rule 1]
- [Project-specific rule 2]

**Escalation contact:** [OPERATOR_NAME]

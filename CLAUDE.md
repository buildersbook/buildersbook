@AGENTS.md

<!-- LEAD-V FRAMEWORK v5 -->
# Builder's Book — Claude Code Adapter

This file is the Claude Code adapter for Builder's Book. `AGENTS.md` is the shared project hub and source of truth for portable LEAD-V rules; Claude Code reads it through the `@AGENTS.md` include above, then uses this file for Claude-specific execution notes.

## Rule Zero — The Codebase Is the Only Source of Truth

**This rule takes precedence over every other rule in this document.**

Before trusting any claim made in a handoff document, planning document, framework doc, or session memory, verify against the actual state of the repo. When in doubt, issue a VERIFY or RESEARCH prompt and check.

When the codebase and a document disagree, **the codebase wins.** Update the document, not the codebase.

## Project Summary

Builder's Book is a public serialized site and open-tooling repository built with TypeScript, Next.js (App Router), Fumadocs, local MDX, and FlexSearch. It is an open curriculum for engineers who build production software by orchestrating AI coding agents.

## Context Files

Read these at session start:

1. `AGENTS.md` — shared cross-agent context (loaded via `@AGENTS.md` above)
2. `VERIFY.md` — auditor role primer
3. `ADVERSARY.md` — cross-model auditor role primer
4. `PROJECT_STATE.md` — current phase, session log, known bugs
5. `WORKING-PROTOCOL.md` — operator–SCOUT collaboration conventions: prompt protocol, execution boundaries, public-repo hygiene, state discipline

Read these when the task requires them:

- `FEATURE-BRIEF.md` — in-flight feature brief, if a feature is mid-flight
- `docs/task-packets/` — Task Packets for non-trivial SCOUT → IMPLEMENT transfer

## Roles (summary — see `roles/ROLES.md` for canonical definitions)

- **SCOUT** — Strategic Consultant. Claude.ai with Opus 5 by default and Fable 5 on escalation.
- **IMPLEMENT** — Senior Engineer. Codex terminal / browser plugin is primary; Claude Code (Opus 5) is secondary.
- **VERIFY** — Auditor. Either Codex or Claude Code, operating read-only and propose-only. Claude Code runs verification from a VERIFY prompt (read-only).
- **ADVERSARY** — Cross-Model Auditor. Mandatory on sensitive scope. Claude Code (Opus 5) reviews Codex work; Codex reviews Claude work. The implementing family never reviews itself on sensitive scope.

VERIFY and ADVERSARY never modify files. All file changes flow through IMPLEMENT.

## Execution-Lane Protection

Enforcement applies to every write-capable execution lane equally, or it does not exist as mechanism. Where no lane-equal mechanism exists, protection is process: the human commit gate, cross-family ADVERSARY review, and Rule Zero.

Claude Code follows the same process contract as every other IMPLEMENT adapter. Tool-specific controls do not constitute LEAD-V enforcement unless they protect every write-capable execution lane equally.

## Session Protocol

- Start Claude Code sessions with a cold-start audit against current repo state.
- One prompt per turn. No plan dumps.
- Every code block carries a label: `IMPLEMENT PROMPT (Opus|Sonnet):`, `VERIFY PROMPT:`, `ADVERSARY PROMPT:`, `RESEARCH PROMPT:`, `MANUAL (terminal):`, or `FOR REVIEW:`.
- Every `IMPLEMENT PROMPT` header specifies Sonnet or Opus. Default to Opus for judgment, Sonnet for explicitly mechanical tasks.
- Fresh Claude Code session for each IMPLEMENT prompt (unless doing sequential micro-edits on the same file).
- For non-trivial SCOUT → IMPLEMENT work, prefer a Task Packet under `docs/task-packets/` over long chat history.
- `/retro` — records a durable lesson in the retro log (command: `.claude/commands/retro.md`).
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

---

## Project-Specific Context

**Tech stack:** TypeScript; Next.js (App Router) + Fumadocs; local MDX with typed `book` and `essays` collections; FlexSearch; pnpm. Styling uses Tailwind CSS via PostCSS, Fumadocs styles, and `styles/tokens.css` / `styles/site.css`.

**Data model:** No database and no user accounts at launch.

**Repository:** `buildersbook/buildersbook`

**Hosting:** production on Vercel, Git auto-deploy from main.
**DNS:** Cloudflare.

**Status:** Phase 1 complete; Phase 2 in progress (essay #1 review-closed; draft operator-held, not yet in the tree; public flip pending). As of `0671e7b`.

**Key commands:**

- `pnpm dev` — development server.
- `pnpm build` — webpack production build followed by the JS budget check.
- `pnpm lint` — ESLint and design lint.
- `pnpm typecheck` — TypeScript check without emitting output.
- `pnpm test` — content validation, design validation, and script tests.
- `pnpm validate` — lint, typecheck, and tests.
- `pnpm validate:content` — content schemas, MDX, links, and discovery validation.
- `pnpm perf:budget` — built reading-route JS budget check.
- `pnpm perf:lab` — Lighthouse CI using `scripts/lighthouserc.cjs`.

**Domain rules:**
- Keep launch architecture free of database and account dependencies.
- ADVERSARY scope: LEAD-V sanitization for public release; public repo creation; MCP server proprietary boundary. Any work that could expose client data, proprietary business logic from the operator's other projects, or private identity material.

**Escalation contact:** Dustin Matlock

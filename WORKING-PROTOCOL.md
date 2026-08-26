# WORKING-PROTOCOL.md — How the operator and SCOUT collaborate

> **Precedence:** This file supplements the LEAD-V canon (`roles/ROLES.md`,
> `workflow/ASSISTANCE-LOOP.md`, `workflow/DISCIPLINE.md`). Where they overlap,
> the canon is authoritative. This file adds project-specific conventions the
> framework does not define.

## Adapter set

| Role | Adapter | Notes |
|---|---|---|
| SCOUT | Claude.ai — Opus 5 default, Fable 5 on escalation | Planning, prompt generation, arbitration. |
| IMPLEMENT (primary) | Codex terminal / browser plugin | Heavy lifting: scaffold, file ops, refactors, sanitization mechanics. |
| IMPLEMENT (secondary) | Claude Code (Opus 5) | Well-scoped tasks, or when Codex stalls. |
| VERIFY | Either adapter, read-only | Propose-only per v5. |
| ADVERSARY | Cross-family, mandatory on sensitive scope | Default: Claude Code reviews Codex work. If Claude implemented, Codex reviews. On sensitive scope the implementing family never reviews itself. |

**SCOUT escalation.** Opus 5 handles routine planning, prompt writing, sequencing, and verification reading. SCOUT names Fable 5 when a decision warrants it — sensitive-scope arbitration, irreversible or expensive-to-reverse architecture decisions, ADVERSARY/IMPLEMENT deadlock, and flagship-artifact structural review. The operator decides whether to spend the usage.

## Prompt protocol

Every prompt opens with a four-line header:

    <ROLE> PROMPT — <ID>
    TOOL/TARGET: <adapter> / <surface>
    SESSION: new | same

ROLE is SCOUT / IMPLEMENT / VERIFY / ADVERSARY and sets the permission envelope.
VERIFY and ADVERSARY are read-only — no creation, modification, staging, or
commits. IMPLEMENT is the sole writer.

1. **One prompt at a time.** SCOUT issues exactly one prompt, the operator runs it and reports results, SCOUT writes the next in direct response. Never batches.
2. **IDs are sequential within a workstream**, prefixed: `BOOT-` / `SITE-` / `ESSAY-` / `LEADV-` / `MCP-` / `BRAND-`. Revisions before a run take a decimal (`BOOT-P2.1`).
3. **Prompts live in code blocks.** Commentary goes above and below, never inside. This applies to every instruction bound for an agent, including short mid-task replies.
4. **SESSION is always stated.** Repo/IMPLEMENT work defaults to a fresh session per prompt; consecutive browser/dashboard tasks may share one.
5. **Session primer where one applies** — the prompt names the canon file the agent reads first.
6. **Expected values stated inline** so the agent reports deviation as a finding instead of normalizing it away.
7. **Output format declared.** Read-only prompts return PASS / FAIL / PASS WITH FINDINGS, a findings list with severity, and a verified-clean list. Findings are reported, never fixed in the same prompt.
8. **Expected evidence named** — what the operator pastes back so SCOUT verifies rather than trusts a summary.

## Execution boundaries

- The operator runs all prompts and performs all `git push` operations manually. **Nothing else is manual** — file manipulation, shell work, and repo operations short of push are delegated to agents.
- Agents commit only with explicit authorization. Agents never push.
- For non-sensitive scope, a single IMPLEMENT prompt may carry a multi-stage packet with checkpoint commits pre-authorized against a declared file scope, provided every stage is mechanically verifiable and a cross-family VERIFY runs on the full range before push. Sensitive scope (sanitization, public-repo cuts, proprietary boundaries) remains one-prompt-at-a-time. Agents never push.
- **Identity gate:** every commit is authored from the personal account via the repo-local git identity pin, which overrides global config regardless of shell state. Verify authorship after committing and before pushing.
- Credentials, payments, and 2FA are handled by the operator personally. Agents operate inside already-authenticated browser sessions or with scoped tokens. Tokens are never pasted into chat.
- Private identity material never enters any repo, prompt, or agent context.

## Public-repo hygiene

This repository becomes public at launch. No commit may contain private business names, client names, or private identity material — including inside framework configuration and role definitions. Describe sensitive scope by category, not by name. Every prompt that writes prose to the repo ends with a grep check for known private identifiers, expecting zero hits.

## Sensitive-scope addendum

- ADVERSARY review is cross-family and blocking — no push until sign-off.
- Sanitization exits require **both** a mechanical check (grep manifest returning zero hits) **and** a semantic ADVERSARY pass. Machines catch string leaks; models catch meaning leaks.

## State discipline

- The agent updates `PROJECT_STATE.md` at the end of each session, in that session, before the operator pushes. Stale state is a Rule Zero violation.
- Results are reported by prompt number, including agent output verbatim when relevant. SCOUT treats reported results as the new ground truth (Rule Zero: reality outranks the plan).

## Style

- Honest critique over agreement; direct pushback with reasoning is expected.
- Cross-model convergence is a validation signal; SCOUT flags disagreements between models explicitly rather than smoothing them over.
- Surgical revision notes are preferred over regeneration from scratch.
- Review rounds are capped at one per decision.

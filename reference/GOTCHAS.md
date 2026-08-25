# LEAD-V Gotchas

Practical friction points encountered by real framework users. This file is distinct from [`failure-modes.md`](failure-modes.md) — failure modes are systemic failures the framework defends against. Gotchas are friction points: things that trip up a new user, shell quirks, cross-platform surprises, small decisions that waste 30 minutes if you don't know them.

Assume the reader knows v4 basics (four roles, Assistance Loop, FEATURE-BRIEF, Task Packets). This list is running and meant to be appended to as new gotchas surface.

---

## Quick reference

| # | Gotcha | Category |
|---|--------|----------|
| 1 | Commit messages with `!:` or punctuation can trip zsh | Shell |
| 2 | `git log --follow` only traverses committed history | Git |
| 3 | `.gitkeep` should be deleted once real files arrive | Git |
| 4 | Claude Code sessions can lose the working directory | Session |
| 5 | "Fresh context" means a new session, not `/clear` | Session |
| 6 | ADVERSARY is optional on non-sensitive code | Slash command |
| 7 | VERIFY and ADVERSARY never write files | Slash command |
| 8 | Skills auto-load on description match — keep SKILL.md specific | Skill |
| 9 | `@AGENTS.md` at line 1 of CLAUDE.md is an include directive | Template |
| 10 | Template `[BRACKETED]` markers must be replaced before use | Template |
| 11 | VERIFY and ADVERSARY are sequential, not parallel | Role / architecture |
| 12 | Long chat history is not source of truth | Context |
| 13 | Claude slash commands are not universal | Adapter |
| 14 | Codex does not run `.claude/commands/` automatically | Adapter |
| 15 | Same-family SCOUT + IMPLEMENT needs different-family ADVERSARY on sensitive work | Role / architecture |
| 16 | State and handoff files can be stale | Context |

Each row points to the numbered section below. Scan the table first; read the body when a gotcha applies to your current task.

---

## Shell / terminal gotchas

### 1. Commit messages with `!:` or punctuation can trip zsh

The `feat(v4)!:` BREAKING marker, a `:` in the header, and a `;` or `!` in the body can confuse zsh history expansion and quoting. Symptoms: `zsh: event not found`, arguments truncated at semicolons, or the commit opening an editor at the wrong cursor position.

**Workaround:** write the message to a temp file and use `-F`:

~~~
cat > /tmp/commit-msg.txt <<'COMMITEOF'
feat(v4)!: your message here
...
COMMITEOF
git commit -F /tmp/commit-msg.txt
~~~

The quoted heredoc delimiter (`'COMMITEOF'`) disables shell expansion inside the body. The `/commit` slash command uses this pattern by default.

---

## Git workflow gotchas

### 2. `git log --follow` only traverses committed history

Pre-commit, `--follow` will not trace renames because the rename hasn't yet been committed. Use `git status` rename detection instead — it reports renames at 100% similarity before the commit lands. Post-commit, `git log --follow path` walks renames cleanly.

**Practical implication:** when proposing a rename in a SCOUT prompt, verify preserved history pre-commit with `git status` (default rename detection), not `git log --follow`.

### 3. `.gitkeep` files should be deleted once real files arrive

`.gitkeep` is a convention for tracking empty directories in git (git itself tracks files, not directories). Once the directory has a real file, `.gitkeep` is noise. Leaving it behind clutters the tree and confuses future readers who assume it means something.

**Practical implication:** clean up `.gitkeep` in the commit that introduces the first real file in the directory.

---

## Claude Code session gotchas

### 4. Claude Code sessions can lose the working directory

On session resume, after a long idle period, or after certain slash-command sequences, `pwd` may not match the repo you intended to work in. Running `/prime` at session start surfaces this before any file edit.

**Practical implication:** if you're unsure, run `pwd && git status` before the first edit. A misplaced `cd` or a stale resumed session is a 10-second check that saves a reverted commit.

### 5. "Fresh context" means a new Claude Code session, not `/clear`

`/clear` blanks the visible transcript but context can carry subtly through memory, cached tool results, and prior settings. For each IMPLEMENT prompt (unless doing sequential micro-edits on the same file), start a genuinely new session. This is the single most impactful habit against context rot — see [`../workflow/DISCIPLINE.md`](../workflow/DISCIPLINE.md) § Fresh context per prompt.

**Practical implication:** if the current session has executed a previous IMPLEMENT prompt, the next IMPLEMENT prompt goes in a new session, not a `/clear`'d one.

---

## Slash command gotchas

### 6. ADVERSARY is optional on non-sensitive code

UI-only changes, content updates, style edits, and dev-tooling changes don't need cross-model review. Running `/adversary` on every change creates noise, not safety. See [`../workflow/verification-checklist.md`](../workflow/verification-checklist.md) for the sensitive-code classification that determines when ADVERSARY is required.

**Practical implication:** invoke `/adversary` when VERIFY classifies the change as hitting any sensitive-code category. Skip it otherwise.

### 7. VERIFY and ADVERSARY never write files

Both roles are read-only by design — they produce reports, not changes. If a `/verify` or `/adversary` session proposes to edit a file, that's the signal to stop and generate an IMPLEMENT prompt instead.

The temptation to let VERIFY "just fix the one-liner" is real, and it corrupts state discipline: VERIFY's write becomes subsequent sessions' ground truth without IMPLEMENT's discipline (list-before-edit, diff, convention adherence). Same applies to ADVERSARY — an adversarial reviewer that can also fix things loses the adversarial posture.

**Practical implication:** VERIFY or ADVERSARY that proposes a fix → feed the proposal into a scoped IMPLEMENT prompt → fresh session executes → VERIFY re-audits the fix. See [`../workflow/DISCIPLINE.md`](../workflow/DISCIPLINE.md) § State Discipline.

---

## Template / skill gotchas

### 8. Skills auto-load on description match — keep SKILL.md descriptions specific

Skills in `skills/` auto-load when the current task semantically matches the skill's frontmatter description. Too vague (`"helps with frontend work"`) causes false-positive loads that eat context; too specific (`"handles exactly the auth flow in apps/web/lib/auth/server.ts"`) misses true positives.

**Practical implication:** err on specific. For edge cases, add a `triggers:` list to the frontmatter to cover synonyms or related phrasings the description doesn't naturally match.

### 9. `@AGENTS.md` at line 1 of CLAUDE.md is a Claude Code include directive

Claude Code resolves `@file.md` on the first line of CLAUDE.md as a chained context include — AGENTS.md is loaded as if its content were pasted in. Do not strip this line when editing CLAUDE.md. Removing it breaks the AGENTS.md → CLAUDE.md chain, and agents miss shared project context.

**Practical implication:** when templating a new project's CLAUDE.md, preserve the `@AGENTS.md` include. When editing an existing CLAUDE.md, leave line 1 alone.

### 10. Template markers like `[PROJECT_NAME]` must be replaced before use

Files in `root-files/` contain `[BRACKETED]` tokens as placeholders. Copying them into a project without replacing the tokens leaves literal `[PROJECT_NAME]` or `[OPERATOR_NAME]` strings in agent-loaded context, which degrades every prompt that uses them. The `/scaffold` command walks through replacement; a manual copy-paste does not.

**Practical implication:** after copying any root file, grep for bracketed tokens and replace every match, or run `/scaffold` and let it handle the substitution.

---

## Role / architecture gotchas

### 11. VERIFY and ADVERSARY are sequential, not parallel

External frameworks sometimes fan out multiple review agents in parallel and synthesize their findings — Archon's `archon-comprehensive-pr-review` is one example. It's a reasonable pattern for same-family reviewers, and it's tempting to "improve" LEAD-V by running `/verify` and `/adversary` concurrently for faster turnaround.

Don't. ADVERSARY exists to catch the same-model blind spots in VERIFY's output (see [`failure-modes.md`](failure-modes.md) § Failure 10). Its value depends on being a true different-family second opinion — which requires running after VERIFY, on the same codebase, but without access to VERIFY's report. If the two run in parallel, ADVERSARY cannot reference what VERIFY's same-model reasoning already accepted, and SCOUT has no delta to adjudicate. The cross-model adjudication pattern collapses into two unrelated reports.

**Correct pattern:** VERIFY runs first and produces findings. ADVERSARY then runs independently on the same codebase, blind to VERIFY's report. SCOUT adjudicates the two. This is the Phase A→B→C pattern the v4 upgrade itself used — see [`../workflow/ASSISTANCE-LOOP.md`](../workflow/ASSISTANCE-LOOP.md) § Step 4 and [`../roles/ROLES.md`](../roles/ROLES.md) § ADVERSARY.

**Practical implication:** keep VERIFY → ADVERSARY sequential. Parallel review is a throughput optimization that re-opens the failure mode ADVERSARY exists to defend against.

### 12. Long chat history is not source of truth

A long planning chat can feel authoritative because it contains the whole story. It is still not source of truth. The repo is. Planning history can mention files that moved, constraints that changed, or implementation details that never landed.

For non-trivial work, move the implementation contract into a Task Packet under `docs/task-packets/`. The packet should name source-of-truth files, allowed files, forbidden files, assumptions to verify, and verification requirements. IMPLEMENT reads the packet and the repo, not the entire planning transcript.

**Practical implication:** if the next agent needs chat history to succeed, the Task Packet is incomplete.

### 13. Claude slash commands are not universal

`/prime`, `/verify`, `/handoff`, `/commit`, `/adversary`, and the other shipped commands are Claude Code adapters. They remain supported, but they are not portable commands across Codex, Cursor, ChatGPT, Gemini, or other tools.

The workflow is portable; the slash-command syntax is not. Other adapters should follow the same intent through their own interface: orient, inspect, list files, edit within scope, verify, and report.

**Practical implication:** when writing vendor-neutral docs or Task Packets, describe the role workflow, not just "run /command."

### 14. Codex does not run `.claude/commands/` automatically

Codex can read repo files and execute scoped implementation work, but it does not automatically execute Claude Code command files under `.claude/commands/`. If you paste "run /prime" into Codex, you are relying on interpretation, not the Claude Code adapter.

Use `CODEX.md` and [`../docs/guides/codex-adapter.md`](../docs/guides/codex-adapter.md): tell Codex to read `AGENTS.md`, `PROJECT_STATE.md`, the relevant Task Packet, and referenced source files. Then ask it to list intended edits and wait for confirmation.

**Practical implication:** for Codex, write explicit prompts or Task Packets. Do not assume Claude slash commands transfer.

### 15. Same-family SCOUT + IMPLEMENT needs different-family ADVERSARY on sensitive work

If SCOUT and IMPLEMENT use the same model family, they can share blind spots. VERIFY may catch scope and build issues, but it can still share the same reasoning defaults. This is exactly why ADVERSARY exists.

Sensitive work — auth, migrations, scoring, billing, concurrency, rate-limiting, customer data, multi-tenancy — needs a different-family ADVERSARY review before commit when same-family planning and implementation were used. If SCOUT and IMPLEMENT were both OpenAI-family tools, use Claude, Gemini, a qualified human reviewer, or another suitable different-family adapter. If Claude planned or implemented, Codex/GPT/Gemini are common options.

**Practical implication:** "VERIFY passed" is not a substitute for different-family ADVERSARY on sensitive work.

## Context gotchas

### 16. State and handoff files can be stale

`PROJECT_STATE.md`, `HANDOFF.md`, and Task Packets are documents. They can lag behind the repo, especially after interrupted sessions or uncommitted work. Rule Zero still applies: repo state wins.

A stale state file is not evidence that the repo is wrong. It is evidence that the state file needs updating through the normal workflow. VERIFY proposes state changes; IMPLEMENT or the human applies them.

**Practical implication:** start by checking git status, recent commits, and referenced files before trusting state or handoff claims.

---

## Contributing new gotchas

When you hit friction that cost you more than 10 minutes and isn't already in this list, add it. Format: section → short title → body with a concrete workaround or practical implication. Cross-link to [`failure-modes.md`](failure-modes.md) or [`../workflow/DISCIPLINE.md`](../workflow/DISCIPLINE.md) when the gotcha relates to a systemic failure or discipline rule.

This file has no version markers. It grows as friction surfaces.

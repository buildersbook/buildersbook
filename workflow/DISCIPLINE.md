# Discipline

This is the **D** in LEAD-V — the guardrails that prevent AI-assisted development from going off the rails.

Every rule here exists because a real failure was encountered on a production project. None of this is theoretical.

Rules are organized by category, not numbered. The count is not the point. The pattern is: for every class of failure that cost real time to fix, there is a rule that would have prevented it.

---

## Rule Zero — The Codebase Is the Only Source of Truth

**This rule takes precedence over every other rule in this document.**

Before trusting any claim made in a handoff document, planning document, framework doc, or session memory, verify against the actual state of the repo. When in doubt, issue a VERIFY or RESEARCH prompt and check.

When the codebase and a document disagree, **the codebase wins.** Update the document, not the codebase.

*Why this exists:* Handoff documents go stale within hours of being written. Planning documents drift from implementation during execution. In one production project, three separate sessions each assumed a fix was in place because a handoff said so. The fix was not in place. Each session spent hours debugging a problem that the repo would have revealed in 30 seconds. The document lied; the code did not.

**How to apply this rule in practice:**
- Every session starts with assumption-free orientation against the actual state. In Claude Code, `/prime` is the adapter command for this. In Codex, Cursor, or another repo-aware adapter, perform the equivalent orientation by reading `AGENTS.md`, current state/context files, git status, and the relevant Task Packet or Handoff.
- Every handoff claim is verifiable by a grep, a git log, or a `git show`. If a claim can't be verified against the code, it shouldn't be in the handoff.
- When SCOUT, IMPLEMENT, VERIFY, or ADVERSARY notices a contradiction between a document and the repo, the document is wrong until proven otherwise.
- Rule Zero overrides the "follow the plan" instinct. A plan based on stale state is a plan to introduce bugs.

---

## Scope Enforcement

### Execution-lane protection

Enforcement applies to every write-capable execution lane equally, or it does not exist as mechanism. Where no lane-equal mechanism exists, protection is process: the human commit gate, cross-family ADVERSARY review, and Rule Zero.

LEAD-V currently provides no lane-equal enforcement mechanism. The scope rules below are therefore process requirements applied to every IMPLEMENT adapter, with human review at the commit boundary and different-family ADVERSARY review for sensitive work.

### List files before touching them

Before creating or editing any file, the agent must list every file it intends to create or modify and wait for human confirmation.

*Why this exists:* An agent was asked to update a component and silently modified 6 other files to "fix inconsistencies" it noticed. Three of those files were unrelated features that then broke.

### One prompt, one task

Each prompt targets a single, well-defined task. Don't combine "add the login form" and "fix the footer padding" in one prompt.

*Why this exists:* Multi-task prompts produce tangled diffs where it's impossible to tell which change belongs to which task. When something breaks, you can't revert just the bad part.

### One prompt, one handoff (SCOUT's pair rule)

SCOUT generates at most one IMPLEMENT prompt per turn. The human runs it, pastes the result back, and only then does SCOUT generate the next prompt. SCOUT may *outline* upcoming prompts for sequencing purposes, but may not produce executable prompts in a batch.

*Why this exists:* A 6-prompt plan produced up front cannot adapt to what prompt 2 actually discovers. By prompt 4, SCOUT is generating instructions based on what it *thought* would happen, not what actually happened. Adaptive generation beats batch generation every time. This rule is the SCOUT-side complement to IMPLEMENT's "one prompt, one task."

### No files outside scope

The agent must not modify files that weren't specified in the prompt, even if it "notices" something that could be improved.

*Why this exists:* An agent "helpfully" updated import paths across the project while working on a single component. Half the updated paths were wrong.

### Ask when scope is unclear

If the agent encounters a situation where it's unsure whether something is in scope, it must ask rather than assume.

*Why this exists:* An agent interpreted "update the header" as "update the header and the navigation and the mobile menu and the breadcrumbs" because they were all in the same layout file.

---

## Context Freshness

### Fresh context per implementation prompt

Start a fresh implementation context for each IMPLEMENT prompt or Task Packet unless doing sequential micro-edits on the same file set. In Claude Code, that means a new Claude Code session. In Codex, that means a fresh chat. In Cursor, that means a fresh composer. Other repo-aware adapters should follow the same boundary. Don't carry forward context from previous prompts.

*Why this exists:* By prompt P5 in the same session, an agent was hallucinating patterns from P1's file reads that had nothing to do with the current task. The context window was carrying 40,000 tokens of stale tool calls and diffs. A fresh session with just the P5 prompt produced clean output immediately.

This is the single most impactful habit for preventing context rot. Defend it religiously.

### Isolate research from implementation

Codebase exploration and web research should happen in separate context windows from implementation. Use sub-agents for research in a dedicated session; bring only the summary into the planning or implementation window.

*Why this exists:* A planning session that also did deep codebase research accumulated 80,000 tokens before any IMPLEMENT prompts were generated. The agent started confusing patterns from unrelated files it had read during research, producing prompts that mixed up component interfaces.

### One mode per prompt

Don't mix IMPLEMENT, VERIFY, ADVERSARY, and RESEARCH actions in the same prompt. Each prompt should be clearly one mode.

*Why this exists:* A prompt that asked the agent to "implement X and then verify the result" produced a half-built feature with a passing self-assessment. The agent cut corners on implementation to make its own verification pass. Separating the modes means the verifier has no incentive to be lenient — it didn't write the code. The same logic applies to ADVERSARY — you cannot adversarially audit work you authored.

---

## Diff Verification

### Show diffs after every change

After any file change, the agent must show the full content or diff so the human (or VERIFY) can verify what happened.

*Why this exists:* An agent claimed it "only added the new function" but the diff revealed it also reformatted the entire file, changing 200 lines and making git blame useless.

### Review diffs before proceeding

No subsequent task begins until the previous diff has been reviewed and approved. This is the verify step of the Assistance Loop — it is not optional.

*Why this exists:* Skipping verification on step 3 of a 10-step implementation meant a small error in step 3 propagated through steps 4-10, requiring a complete redo.

### No silent changes

If a change isn't visible in the diff, it shouldn't have happened. Agents must not make changes that are invisible to diff review (e.g., modifying whitespace to hide code changes, updating files not tracked by git).

*Why this exists:* An agent embedded configuration changes inside what appeared to be a whitespace-only formatting commit.

---

## Test Discipline

### End-to-end over implementation-coupled

For features (not pure bug fixes), prefer three end-to-end tests over ten unit tests when the choice is forced: one happy path, two distinct error paths. End-to-end tests exercise the feature through its public interface — an HTTP endpoint, a UI flow, a CLI invocation — without calling into internal functions directly. Implementation-coupled tests call internal helpers, mock private collaborators, or assert on internal state. They pass when the implementation is what it is, which is circular, and they are the default output when an AI agent is asked to "write tests" without further specification.

The rule for feature work: SCOUT's IMPLEMENT prompt names the three tests explicitly — their inputs, their expected outputs, their assertion shape — before IMPLEMENT writes them.

*Why this exists:* AI agents asked to "write tests" after writing a feature will produce implementation-coupled tests by default. They mirror the code they just wrote, which means they assert on the exact behavior that code exhibits, which means they cannot distinguish "works correctly" from "does what the code does." Three end-to-end tests written against a specified interface test the contract, not the implementation; they survive refactors and catch regressions that implementation-coupled tests miss entirely.

### The specified-before-written rule

Tests named in the IMPLEMENT prompt before code is written are superior to tests written after the feature as a separate step. When SCOUT generates the IMPLEMENT prompt, it names the three tests as part of the Expected Output block — their inputs, their outputs, their error paths — with enough specificity that a human could read just the test descriptions and understand the feature's contract.

IMPLEMENT then writes the code and the tests together, with the test specification as a constraint on the implementation rather than a post-hoc description of it.

*Why this exists:* "Implement the feature, then write tests" produces two passes where the second pass is shaped by the first. The tests describe the code that was written. "Write the feature such that these three tests pass" produces one pass where the tests are the contract. The code is shaped by the tests, not vice versa. This is the difference between tests that protect the feature and tests that describe the feature.

### Exceptions

Bug fixes get a regression test, not three end-to-end tests. A regression test reproduces the specific bug, fails against the broken code, and passes against the fix. One test, scoped to the bug. Adding end-to-end coverage for the surrounding feature is a separate task.

Sensitive-code changes may require additional tests beyond the three end-to-end default — concurrency tests for race conditions, migration tests for rollback safety, etc. The three-test default is a floor, not a ceiling, and ADVERSARY may identify specific missing tests as findings.

UI-only changes with no business logic do not require tests. Formatting, documentation, and markdown-only changes do not require tests. When in doubt, ask SCOUT.

*Why this exists:* A rigid three-test rule applied to everything produces ceremony, not safety. Bug fixes have a sharper target; sensitive code has a broader one; doc changes have none. The discipline is about matching test scope to what the change is actually doing.

---

## Adversarial Review

### Required on sensitive code

ADVERSARY review is required before commit on sensitive-code changes — work where silent failures compound invisibly before detection. See [`workflow/verification-checklist.md`](verification-checklist.md) § Sensitive-Code Classification for the canonical category list and the automatic-escalation rule (any change touching two or more categories is automatically sensitive regardless of size).

This is not optional for that class of work. Same-model audits share blind spots with the model that wrote the code. An adversarial review from a different model family (Codex, GPT, Gemini) catches what VERIFY structurally cannot.

*Why this exists:* A scoring engine shipped with missing business-subtype mappings that caused entire categories to silently score zero. VERIFY (same-model audit) passed. Codex (different-family audit) flagged the missing mappings immediately. Same-model audits shared the same assumption the scorer had made; the different-model review didn't.

### ADVERSARY reports, never writes

ADVERSARY produces findings only. It does not modify files, does not commit, does not make the fix. When it finds an issue, a targeted IMPLEMENT prompt fixes it; VERIFY audits the fix; ADVERSARY re-reviews if the finding was high-severity.

*Why this exists:* An adversarial reviewer that can also fix things loses the adversarial posture. Its incentive shifts from "find problems" to "find problems I can solve easily."

---

## Architectural Criticality

### Leaf nodes vs. trunks

Define the axis. Leaf nodes are code that nothing else depends on — individual page components, one-off marketing routes, self-contained UI elements, throwaway scripts. Trunks are shared utilities, core data models, design tokens, authentication primitives, scoring algorithms, any module imported by multiple callers. Tech debt in a leaf is contained — when the leaf changes or gets deleted, the debt goes with it. Tech debt in a trunk poisons everything built on top.

The rule: aggressive AI-assisted generation with minimal per-line human review is appropriate for leaves. Trunk changes require human review of every hunk regardless of file size or apparent simplicity.

*Why this exists:* A 22,000-line AI-generated PR shipped successfully at Anthropic because it was concentrated in leaf nodes of the reinforcement learning codebase. The same approach applied to the codebase's trunk modules would have introduced tech debt into every downstream feature built on top. Tech debt is currently the one dimension where you cannot validate AI output without reading the implementation yourself — so containing it to leaves is the operative defense.

### The two-axis call

Architectural criticality (leaf vs. trunk) is independent of sensitive-code classification (blast radius). A marketing landing page is non-sensitive AND a leaf. An RLS policy is sensitive AND a trunk. A shared UI component is non-sensitive but a trunk — tech debt there compounds across every page that imports it. A one-off admin dashboard route can be sensitive (auth boundary) but still a leaf (nothing depends on it).

Both calls must be made before IMPLEMENT begins. Sensitive-code classification determines whether ADVERSARY review is required. Leaf/trunk classification determines how aggressively a prompt can be framed and how much code must be read line-by-line by the human.

*Why this exists:* Conflating the two axes is a common failure. Teams either over-review non-sensitive leaves ("it touched auth-adjacent code, review every line") or under-review non-sensitive trunks ("it's just a util, ship it"). The two calls catch different failure modes; neither is a substitute for the other.

### When in doubt, call it a trunk

If it's ambiguous whether a module is a leaf or a trunk, treat it as a trunk until proven otherwise. The cost of extra review on a leaf is a few minutes; the cost of un-reviewed tech debt in a trunk is measured in weeks of future rework.

Signals a module is a trunk: imported by 2+ callers, exports types used across module boundaries, defines a public API surface, contains shared business logic, or sits on a code path executed by every request.

*Why this exists:* "Leaf or trunk?" is asked at planning time when import graphs are not fully materialized. The conservative default prevents silent trunk-classification errors from letting tech debt through.

Architectural criticality interacts with sensitive-code classification. See [`workflow/verification-checklist.md`](verification-checklist.md) § Sensitive-Code Classification for the blast-radius axis.

---

## Commit Discipline

### Human-authorized agent commits only

Code produced by an AI agent must be reviewed by a human before it is committed. An AI agent may run `git commit` only when the human has explicitly authorized that specific commit after reviewing its full diff and proposed commit message.

One authorization covers exactly one reviewed diff and one commit message. The agent never commits on its own initiative, never pre-stages a commit ahead of human review, never treats task completion as commit authorization, and never batches multiple authorized commits into one run. For sensitive work, the required cross-family ADVERSARY `APPROVE` verdict must correspond to the exact diff being authorized. An edited diff is an unreviewed diff and must be re-reviewed before commit authorization.

*Why this exists:* The TP-2026-0003 compressed-gate incident showed how quickly completion and commit readiness can collapse into one step. The durable boundary is the human decision after diff review, reinforced by independent review and Rule Zero across every write-capable execution lane.

### Atomic commits per task

Each completed task gets its own commit. Don't batch multiple tasks into one commit.

*Why this exists:* A single commit containing 5 different features made it impossible to revert just the one feature that had a bug.

### Commit messages describe the why

Commit messages should explain why the change was made, not just what changed. "Add email validation to prevent invalid signups" is better than "Update SignupForm.tsx."

*Why this exists:* A git history full of "update file" messages made it impossible to understand why changes were made when debugging a regression 3 weeks later.

### Sensitive-code commits require an `Adversary:` trailer

Sensitive-code commits (the categories in [`workflow/verification-checklist.md`](verification-checklist.md) § Sensitive-Code Classification) require an `Adversary:` trailer line in the commit message body. The trailer records whether ADVERSARY review ran, and if so its disposition.

**Format (one line, body-level):**

- `Adversary: reviewed by [model], no findings above [severity]` — or list findings + remediation status
- `Adversary: PENDING — capture in HANDOFF.md before next session`
- `Adversary: skipped — [reason, e.g., "doc-only change in sensitive directory"]`

See [`.claude/commands/commit.md`](../.claude/commands/commit.md) § 4b for the full spec — that file is canonical for commit-message construction; this rule is the guardrail that makes it load-bearing.

*Why this exists:* Without the trailer, ADVERSARY review silently gets skipped on sensitive-code commits. The trailer makes the state explicit — reviewed, pending, or intentionally skipped — so git log carries the audit evidence. A sensitive-code commit without an `Adversary:` trailer is incomplete.

### Include AI context changes in commit messages

When a commit includes changes to agent rules, commands, or documentation, add a `Context:` section to the commit body. This makes the AI layer's evolution visible in git history.

**What counts as AI context changes:**
- `CLAUDE.md`, `AGENTS.md`, `VERIFY.md`, `ADVERSARY.md`
- `.cursorrules`
- `.claude/rules/` — on-demand domain rules
- `.claude/commands/` — slash commands
- `.claude/agents/` — sub-agent definitions
- `skills/` — SKILL.md-formatted domain packs
- `PROJECT_STATE.md`, `DEVELOPMENT-PLAN.md`
- Files in `docs/specs/`, `docs/guides/`, or `lead-framework/`

**Example:**

~~~
feat(blog): add dental blog post template with FAQ schema

Created reusable blog post template optimized for AI search visibility.
Includes FAQ schema markup, internal linking structure, and content
guidelines for dental practice topics.

Context:
- Added .claude/rules/blog.md with blog content conventions
- Updated AGENTS.md blog section with directory structure
- Created skills/blog-content/SKILL.md for blog-focused sessions

Dev plan: P16
~~~

*Why this exists:* Future agents use `git log` to understand project history during session orientation. If context layer changes aren't captured in commits, the AI layer's evolution becomes invisible — you lose the ability to trace why a rule exists or when a command was added.

---

## State Discipline (VERIFY-specific)

### VERIFY does not write files

VERIFY produces reports, not file changes. This includes `PROJECT_STATE.md` — VERIFY proposes the state update as a diff in its report; the human or IMPLEMENT applies it.

*Why this exists:* In v3.x, VERIFY was permitted to update `PROJECT_STATE.md` "as the one exception." In practice this meant VERIFY could write wrong things into state, which subsequent sessions then trusted as ground truth. The 30-second cost of proposing-not-writing is worth the elimination of an entire class of silent state-corruption bugs.

### ADVERSARY does not write files

Same reasoning as VERIFY. ADVERSARY reports. Fixes flow through IMPLEMENT.

---

## Formatting

### Never nest triple backticks

When writing markdown that contains code blocks, never nest triple backticks inside triple backticks. Use indentation (4 spaces) or `~~~` for inner code blocks.

*Why this exists:* Nested backticks break markdown rendering and confuse AI agents that try to parse the output, leading to truncated or malformed responses.

### Consistent file naming

Use lowercase with hyphens for all framework files and docs. Match the project's existing conventions for code files.

*Why this exists:* Mixed naming conventions (camelCase files, PascalCase files, snake_case files) caused agents to guess differently each session, creating inconsistent file structures.

### Anchored gitignore patterns

Root-level gitignore entries must be anchored with a leading slash. `/HANDOFF.md` only matches at the repo root; `HANDOFF.md` matches anywhere in the tree and will collide with case-insensitive filesystems on macOS.

*Why this exists:* An unanchored `HANDOFF.md` pattern silently matched `.claude/commands/handoff.md` on macOS. The slash command was never pushed to the remote. The bug survived multiple fix attempts because everyone assumed the missing file was a commit oversight. Detection: `git check-ignore -v .claude/commands/handoff.md`.

---

## Escalation — Self-Annealing

When an AI agent encounters an error or unexpected result, it follows this escalation sequence before asking the human. This prevents premature escalation while also preventing infinite fix loops.

### Attempt 1 — Apply the likely fix
Identify the most probable cause and apply a targeted fix. Most errors are simple: a missing import, a wrong path, a typo.

If the fix resolves the issue → continue.

### Attempt 2 — Search the codebase for patterns
Search for similar patterns — how is this done elsewhere in the project? Look for existing implementations and adapt.

If a matching pattern is found and the fix works → continue.

### Attempt 3 — Check docs and constraints
Read relevant Layer 3 reference docs (specs, guides) and check project conventions. The answer might be a documented limitation.

If the docs clarify the issue and the fix works → continue.

### Escalate to human
Three attempts failed. Stop and report:
- What was tried (all three attempts)
- What the error is
- What the root cause might be
- What information is missing

**Do not attempt a fourth fix.** Three failed attempts means the agent is missing context it can't find on its own. Continuing to guess wastes time and risks making things worse.

---

## Anti-Rationalizations

AI agents rationalize skipping steps. Recognizing these thought patterns is part of the discipline.

### IMPLEMENT

| The agent thinks… | The correction |
|---|---|
| "This is too small for a fresh session" | It's not. Fresh context per prompt. |
| "I'll just quickly fix this other file too" | No. One prompt, one task. |
| "I already know how this works" | Verify first. Read the file. |
| "Tests aren't needed for this change" | They are. No exceptions. |
| "I'll write quick unit tests that mirror the implementation" | No. Three end-to-end tests against the specified interface. See Test Discipline. |
| "I'll clean up the diff later" | Show the diff now, before proceeding. |
| "This convention doesn't apply here" | It does. Follow the project's Layer 1 rules. |
| "I'll gather more context before starting" | No. Start the task. Ask if blocked. |

### VERIFY

| The agent thinks… | The correction |
|---|---|
| "The implementation looks fine, no need to deep-check" | Always deep-check. That's your job. |
| "I'll approve and just note the issue for later" | No. Fail the audit. Generate a fix prompt. |
| "This file is outside my audit scope but has a bug" | Report it. Don't fix it. Never modify files. |
| "The tests pass so it must be correct" | Tests passing is necessary, not sufficient. Read the diff. |
| "This is just a style issue, not worth flagging" | Flag it. Consistency compounds. |
| "I'll just update PROJECT_STATE.md myself" | No. VERIFY proposes state updates as diffs. Never writes. |

### ADVERSARY

| The agent thinks… | The correction |
|---|---|
| "The author and VERIFY both signed off, it must be correct" | That's why you exist. Same-model audits share blind spots. |
| "I can't find anything wrong" | Look harder. Check race conditions, bypass paths, edge cases. If genuinely nothing — report "no findings" explicitly. |
| "I could just fix this instead of reporting it" | No. ADVERSARY reports. Fixes flow through IMPLEMENT. |
| "This finding is low-severity, not worth reporting" | Report it with severity labeled. Let the human triage. |
| "The author is clearly competent, this is probably fine" | Model the adversary, not the author. |

### SCOUT

| The agent thinks… | The correction |
|---|---|
| "I'll give a plan for the next 5 prompts so we can move fast" | No. One prompt, one handoff. Adaptive beats batched. |
| "The handoff said X is done, I'll build on that" | Verify X is done via VERIFY or direct codebase check. Rule Zero. |
| "This feature is small enough to skip FEATURE-BRIEF" | If you're unsure, fill it in. 5 minutes of structure saves an hour of rework. |
| "I should write the code myself in this reply" | No. SCOUT generates prompts. IMPLEMENT executes. Separation of concerns is the point. |

---

## Quick-Reference Summary

| Category | Rules |
|----------|-------|
| **Rule Zero** | Codebase is the only source of truth |
| **Scope** | List files first · One prompt one task · One prompt one handoff (SCOUT) · No files outside scope · Ask when unclear |
| **Context** | Fresh context per prompt · Isolate research · One mode per prompt |
| **Diffs** | Show diffs · Review before proceeding · No silent changes |
| **Tests** | End-to-end over implementation-coupled · Specified before written · Bug fixes get regression tests |
| **Adversarial** | Required on sensitive code · ADVERSARY reports never writes |
| **Architectural** | Leaf vs. trunk · Two-axis call · Default to trunk |
| **Commits** | Human-authorized agent commits only · Atomic per task · Messages explain why · Track AI context changes |
| **State** | VERIFY doesn't write · ADVERSARY doesn't write |
| **Formatting** | No nested backticks · Consistent naming · Anchored gitignore |
| **Escalation** | Self-annealing — 3 attempts then escalate |

Every rule traces to a real failure. If you want the stories, read [`reference/failure-modes.md`](../reference/failure-modes.md).

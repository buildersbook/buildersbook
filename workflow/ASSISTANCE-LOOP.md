# The Assistance Loop

The **A** in LEAD-V. The repeating cycle that structures how work gets done when you're building with AI tools.

Every task, no matter how small, flows through this loop. Without it, AI-assisted development devolves into "ask, hope, fix what broke." The loop replaces hope with structure.

---

## The Loop (v4)

~~~
        ┌──────────────┐
        │ FEATURE-BRIEF│ (optional — complex features)
        │ Human fills  │
        └──────┬───────┘
               ↓
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │          │  │          │  │          │  │          │  │          │  │          │
  │ RESEARCH │→ │ PACKET / │→ │ EXECUTE  │→ │  VERIFY  │→ │ADVERSARY │→ │  COMMIT  │
  │(optional)│  │  PROMPT  │  │(IMPLEMENT│  │ (VERIFY) │  │(required │  │ (human)  │
  │          │  │ (SCOUT)  │  │          │  │          │  │ on sens. │  │          │
  │          │  │          │  │          │  │          │  │   code)  │  │          │
  └──────────┘  └────┬─────┘  └────┬─────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘
                     ▲              │              │              │              │
                     │              │              │              │              │
                     └──────────────┴──────────────┴──────────────┴──────────────┘
                                   next task or fix prompt
~~~

---

## Work Lanes

The loop has three lanes. Pick the smallest lane that matches the risk.

### Tiny lane

Use direct IMPLEMENT work for small, low-risk changes where a Task Packet would add ceremony without improving clarity. Scope must still be explicit, IMPLEMENT still lists files before editing, VERIFY or the human still reviews the diff, and the human makes the final commit decision.

### Normal lane

For non-trivial implementation work, SCOUT creates a Task Packet using [`templates/TASK-PACKET.md`](../templates/TASK-PACKET.md). IMPLEMENT consumes the Task Packet plus repo source files, performs the scoped work, and VERIFY checks scope, diff, tests, claims, and instructions before human review.

Task Packets are the default transfer layer for non-trivial work. Long chat history is not source of truth. Repo files, canonical docs, and Task Packets are source inputs. If a Task Packet conflicts with the repo, IMPLEMENT reports the conflict instead of guessing. One Task Packet should represent one implementable unit of work.

### Sensitive lane

Sensitive work uses the normal lane plus different-family ADVERSARY review before final acceptance. Sensitive work includes auth, billing, permissions, database/RLS, migrations, scoring logic, customer data, AI-generated recommendations, client-facing trust claims, and other changes where a silent failure can compound before detection.

The sequence is: SCOUT creates the Task Packet, IMPLEMENT executes, VERIFY checks, ADVERSARY attacks assumptions, then the human decides whether to accept and commit.

### Codex-compatible example

ChatGPT/GPT-5.5 can act as SCOUT and create a Task Packet in `docs/task-packets/`. Codex app can act as IMPLEMENT by reading `AGENTS.md`, `PROJECT_STATE.md`, the Task Packet, and the referenced source files, then performing only the scoped implementation. VERIFY reviews the diff and checks. For sensitive work, Claude, Gemini, or another different-family reviewer can act as ADVERSARY before final acceptance.

---

## FEATURE-BRIEF (Optional Input)

For complex features — anything beyond a quick description — work through [`templates/FEATURE-BRIEF.md`](../templates/FEATURE-BRIEF.md) before IMPLEMENT begins. That file defines the human/SCOUT ownership split for FEATURE / EXAMPLES / DOCUMENTATION / GOTCHAS versus SPEC sections; see its Ownership block for the canonical phrasing.

**What goes in FEATURE-BRIEF:**
- **FEATURE** (human) — what to build, why, user-visible behavior
- **EXAMPLES** (human) — existing code in your project that does something similar
- **DOCUMENTATION** (human) — relevant docs, APIs, specifications
- **GOTCHAS** (human) — things AI commonly misses, constraints not obvious from the code
- **SPEC** (SCOUT) — objective, structure, style, testing, boundaries

### When to use it
- Features requiring more than a quick description
- New feature areas where the AI needs significant context
- Tasks where you've seen AI tools miss important constraints
- Work likely to produce multiple Task Packets

### When to skip it
- Bug fixes, small edits, routine tasks
- Work in well-understood areas where SCOUT already has sufficient context

---

## Step 0: Research (Optional)

**Who:** SCOUT identifies the need. The human runs a RESEARCH PROMPT in a separate research session.

**What happens:** SCOUT realizes it doesn't have enough codebase or external context to create a good Task Packet or prompt. Instead of guessing, it produces a RESEARCH PROMPT. The human runs it in a dedicated research context — separate from any IMPLEMENT or VERIFY session. Sub-agents or research adapters explore the codebase or web in isolated context windows, returning summaries. The main session synthesizes findings. The human brings the synthesis back to SCOUT.

### Word caps (v4)

- **Per sub-agent:** under 300 words
- **Single-question synthesis:** under 500 words
- **Multi-domain synthesis (4+ sub-agents):** under 2500 words

In practice, most research is multi-domain. The v3.x flat 300-word cap produced truncation; v4 scales with the research scope.

### Example

~~~
RESEARCH PROMPT (Opus):

Spin up 3 sub-agents in parallel:

Sub-agent A — Scoring engine integrity:
Read apps/web/lib/scanner/scorer/ (all 7 modules). Cross-reference
SCORING-ALGORITHM-SPEC-v1.0.md against implementation. Flag silent
failures, missing checks, weight mismatches. Under 300 words.

Sub-agent B — Security:
Read all Phase 7 RLS migrations + API route auth. Look for privilege
escalation, admin-client overuse, auth bypass. Under 300 words.

Sub-agent C — Data integrity:
Map account_* tables' foreign keys, status machines, RLS coverage.
Flag orphan paths, stuck states, missing CRUD coverage. Under 300 words.

Synthesis: under 2500 words total. File:line refs required.
Severity: relative to a pre-revenue SaaS (no production traffic).
~~~

### When to use Step 0
- Starting a new feature area you haven't worked in recently
- Needing to understand how an unfamiliar part of the codebase works
- Researching external best practices or library comparisons

### When to skip Step 0
- Routine tasks in well-understood areas
- Bug fixes where the problem is already identified
- Tasks where `PROJECT_STATE.md` and the dev plan provide sufficient context

---

## Step 1: Generate Task Packet or Prompt

**Who:** SCOUT (Strategic Consultant), VERIFY (generating fix prompts), or the human directly.

**What happens:** Read the current `PROJECT_STATE.md` and any relevant FEATURE-BRIEF, research report, handoff, spec, or source file. Identify the next task. For normal and sensitive work, create a Task Packet in `docs/task-packets/` using [`templates/TASK-PACKET.md`](../templates/TASK-PACKET.md). For tiny work, a direct structured IMPLEMENT prompt is acceptable.

SCOUT plans and packages the work; it does not write production code. A Task Packet or direct prompt must include:
- **Task** — what to do
- **Context** — files to read
- **Constraints** — what NOT to touch
- **Expected output** — what "done" looks like
- **Verification** — how to confirm it worked
- **Commit message or commit guidance** — ready for human review

**Example:**

~~~
IMPLEMENT PROMPT (Opus):

You are a Senior Engineer working on a Next.js SaaS application.

## Task
Add client-side email validation to the signup form. Validation triggers
on blur (not keystroke) and shows an inline error using the existing
ErrorMessage component.

## Context
- src/components/auth/SignupForm.tsx (the form to modify)
- src/components/auth/LoginForm.tsx (validation pattern to follow)
- src/components/ui/ErrorMessage.tsx (error display component)
- docs/specs/auth-spec.md section 3 (validation requirements)

## Constraints
- Only modify: src/components/auth/SignupForm.tsx
- Do NOT modify: LoginForm.tsx, the API route, or any other files
- Do NOT install new dependencies

## Expected Output
- Signup form validates email on blur
- Invalid emails show inline error using ErrorMessage component
- Valid emails clear the error

## Verification
- `npm run build` passes
- Navigate to /signup, enter invalid email, blur — error appears
- Enter valid email, blur — error clears

## Commit
fix(auth): add client-side email validation to signup form
~~~

The human reviews the prompt before running it. If anything is wrong, fix it now — it's cheaper to fix a prompt than to fix an implementation.

For non-trivial work, the human reviews the Task Packet before running IMPLEMENT. If anything is wrong, fix it now — it's cheaper to fix the packet than to fix an implementation.

### Adapter selection on IMPLEMENT prompts

Claude adapters may specify Sonnet or Opus. Other tools should use the strongest appropriate planning or implementation model available for the task. v4 defaults differently than v3.x:

**v4 default: Opus for judgment, Sonnet for explicitly mechanical tasks.**

| Task type | Model | Why |
|-----------|-------|-----|
| Multi-file refactors, architecture decisions | Opus | System-wide reasoning required |
| Scoring / pricing / billing / security logic | Opus | Silent failures compound |
| UI build with layout/hierarchy decisions | Opus | Design judgment required |
| UI build from detailed spec (every decision locked) | Sonnet | Execution, not judgment |
| Single-file find/replace | Sonnet | Mechanical |
| Bulk file formatting or type regeneration | Sonnet | Mechanical |
| Grep-based audits | Sonnet | Mechanical |

**Rule of thumb:** If you cannot write the complete correct answer in the prompt, it requires judgment — use Opus.

**Who this default is for:** Solo founders and small teams on Pro / Max / Team plans where the plan is the cost ceiling, not per-token. For metered API users at scale, the economics invert — default to the cheaper capable model and escalate when judgment is required.

---

## Step 2: Execute

**Who:** The human runs the Task Packet or prompt. IMPLEMENT executes in Codex app, Claude Code, Cursor, or another repo-aware coding adapter.

**What happens:** The human opens a **fresh** implementation context and gives IMPLEMENT the Task Packet or prompt. IMPLEMENT reads `AGENTS.md`, `PROJECT_STATE.md`, the packet or prompt, and the referenced source files. It verifies packet claims against the repo, lists files before editing, waits for confirmation, and performs only the scoped implementation. The human watches the output and can intervene at any point.

### Critical rules

- **The human runs the prompt, not SCOUT.** SCOUT generates; the human decides whether to execute. No code changes happen without a human choosing to run them.
- **Fresh context for each prompt or Task Packet.** Start a new implementation session for each IMPLEMENT task unless doing sequential micro-edits on the same file. Context from previous prompts is a distractor, not an asset.
- **Repo truth beats packet truth.** If a Task Packet conflicts with the current repo, stop and report the conflict instead of guessing.
- **Intervene if scope slips.** If IMPLEMENT starts touching files that weren't in the constraints, stop it.

---

## Step 3: Verify

**Who:** VERIFY (Auditor), or the human using the verification checklist.

**What happens:** Review the implementation against the original Task Packet or prompt. Check that scope was maintained, no unintended files were changed, tests or checks ran as required, and the result matches the expected output and claims.

Run [`workflow/verification-checklist.md`](verification-checklist.md). In Claude Code, `/verify` is the slash-command adapter for running it as executable steps; other tools should perform the same checks through their own interface.

### VERIFY outputs

VERIFY produces a report. **It does not modify any files.** If `PROJECT_STATE.md` needs updating, VERIFY proposes the update as a diff in its report; the human or a follow-up IMPLEMENT prompt applies it.

### If verification passes -> proceed to Step 4 (if sensitive code) or Step 5 (commit)

### If verification fails

Don't try to manually fix it. VERIFY generates a scoped fix prompt:

~~~
IMPLEMENT PROMPT (Sonnet):

## Task
Fix the email validation trigger in SignupForm.tsx.

## Problem
Validation runs on every keystroke instead of on blur.

## Constraint
Only change the event handler. Do not modify the validation logic itself.

## Verification
Enter invalid email, type slowly — error should NOT appear mid-typing.
Blur — error should appear.
~~~

Then rerun: Generate -> Execute -> Verify.

---

## Step 4: Adversarial Review (required on sensitive code)

**Who:** ADVERSARY — a capable reviewer from a different model family than the one that planned, implemented, or verified the change.

**Required for:**
- Security boundaries (auth, permissions, RLS, authorization, input validation)
- Database migrations and schema changes
- Scoring / pricing / billing logic
- Customer data and multi-tenancy paths
- AI-generated recommendations or outputs users may trust
- Client-facing trust claims
- Race conditions, concurrency, locking, retry logic
- Rate-limiting and abuse prevention
- Anywhere a silent failure would compound invisibly

**Optional for everything else.** UI-only, content, style, dev-tooling → skip ADVERSARY.

**What happens:** The human gives a different-family reviewer the Task Packet, diff, relevant source files or PR, and the contents of [`root-files/ADVERSARY.md`](../root-files/ADVERSARY.md) as the session primer. ADVERSARY hunts for bypasses, race conditions, edge cases, reasoning gaps, and tool-family blind spots that same-family audits structurally miss.

ADVERSARY returns findings in structured format (see [`roles/ROLES.md`](../roles/ROLES.md) → ADVERSARY section).

### If ADVERSARY reports findings

Triage:
- **Legitimate finding -> fix.** SCOUT generates a targeted IMPLEMENT prompt or Task Packet. Cycle back through Verify -> Adversary re-review (if high-severity).
- **Pattern mismatch → document.** Add a note to `.claude/rules/` or the relevant spec explaining why the "wrong" pattern is intentional.
- **False positive -> dismiss with reasoning.** Record the dismissal in the session log.

### If ADVERSARY reports no findings

Good. ADVERSARY must still report what bypass paths it attempted — "no findings" without attempted bypasses is insufficient (it means ADVERSARY didn't look hard).

### Why this step exists

Same-family audits share blind spots with the model that wrote the code. A different-family review catches what VERIFY structurally cannot: a scoring engine silent-failure bug (missing business-subtype mappings) was flagged by Codex after VERIFY passed. Different blind spots catch different bugs. This is not optional for sensitive code.

---

## Step 5: Commit

**Who:** The human. Claude Code users may use `/commit` for standardized message structure; other adapters should follow the same commit discipline through their own interface.

**What happens:** The commit step reviews changes, stages files deliberately, checks for AI context file changes (adds a `Context:` section if so), constructs a conventional commit message, and waits for human approval before committing.

### If AI context files changed

`.cursorrules`, `AGENTS.md`, `CLAUDE.md`, `VERIFY.md`, `ADVERSARY.md`, `.claude/rules/`, `.claude/commands/`, `skills/`, `PROJECT_STATE.md`, or `DEVELOPMENT-PLAN.md` modifications require a `Context:` section in the commit body. This makes AI layer evolution visible in git log and traceable over time.

See [`workflow/DISCIPLINE.md`](DISCIPLINE.md) → Commit Discipline.

---

## Loop Rules

1. **One prompt or Task Packet, one task.** Don't combine unrelated changes in a single implementation unit.
2. **Task Packets are the default for non-trivial work.** Direct prompts are fine for tiny, low-risk changes. Anything with meaningful scope, risk, context, or verification needs a durable repo-readable packet.
3. **One prompt, one handoff.** SCOUT produces at most one executable IMPLEMENT prompt or Task Packet per turn. No plan dumps.
4. **Long chat history is not source of truth.** IMPLEMENT works from the repo, canonical docs, the Task Packet or prompt, and the files it verifies directly.
5. **Always verify before generating the next prompt.** Don't stack prompts. Finish one loop completely before starting the next.
6. **ADVERSARY required on sensitive code.** Not optional.
7. **The human is always in the loop.** No prompt runs without human approval. No implementation proceeds without human oversight. The AI assists — the human decides.
8. **Failed verification restarts the loop, not the whole task.** Targeted fix prompt, not a re-do.
9. **Update state after every successful loop.** `PROJECT_STATE.md` reflects reality at all times.
10. **Fresh context per prompt or Task Packet.** New implementation session for each IMPLEMENT task. The single most impactful discipline against context rot.

---

## Labels

Every code block SCOUT produces MUST have a label header.

| Label | Meaning | What the human does |
|-------|---------|---------------------|
| `TASK PACKET:` | Non-trivial implementable unit with durable repo-readable scope | Save under `docs/task-packets/`, then run in a fresh IMPLEMENT adapter |
| `IMPLEMENT PROMPT (Opus):` | Complex Claude-adapter task — ambiguous scope or architecture | Fresh Claude Code session with Opus |
| `IMPLEMENT PROMPT (Sonnet):` | Mechanical Claude-adapter task — scoped/routine | Fresh Claude Code session with Sonnet |
| `IMPLEMENT PROMPT (Subagent/Opus):` or `(Subagent/Sonnet):` | Batch of independent Claude-adapter tasks with 2-stage review | Fresh Claude Code session — review aggregate diff |
| `CURSOR PROMPT:` | Task benefiting from visual IDE editing | Fresh Cursor session |
| `CODEX PROMPT:` | Task intended for Codex app | Fresh Codex session with repo access |
| `VERIFY PROMPT:` | Audit task | Run in a clean VERIFY adapter |
| `RESEARCH PROMPT:` | Research with isolated context | Separate research session, bring summary back |
| `ADVERSARY PROMPT:` | Cross-model audit | Send to a different-family reviewer with ADVERSARY.md primer |
| `MANUAL (terminal):` | Shell commands for the human | Run directly in terminal |
| `FOR REVIEW:` | Content for the human to read | Do NOT paste anywhere — read and approve |

---

## When to Break the Loop

The loop is designed for implementation work. Skip the formal loop for:

- **Research and planning:** If you're asking SCOUT for architecture advice, you don't need a formal prompt template. Have the conversation.
- **Quick questions:** "What does this function do?" doesn't need a generate/execute/verify cycle.
- **Reading and understanding:** If you're just reading code or docs, there's nothing to verify.

The loop applies whenever an AI agent is making changes to your codebase. If files are being created or modified, run the loop.

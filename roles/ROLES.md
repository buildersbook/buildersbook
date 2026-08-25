# Engineer Roles

The **E** in LEAD-V. Four roles, each with a defined responsibility and a defined handoff.

A solo developer using AI tools is effectively running a small engineering team. Like any team, it works better when roles are clear, handoffs are explicit, and nobody is doing someone else's job.

---

## Role Overview

| Codename | Responsibility | Write authority | Example adapters |
|----------|----------------|-----------------|------------------|
| **SCOUT** | Planning, discovery, strategy, feature scoping, prompt/task-packet creation | None | ChatGPT / GPT-5.5, Claude.ai, Gemini, another strong planning model |
| **IMPLEMENT** | Repo-aware execution, code changes, file edits, migrations, tests, mechanical verification | Full — only role that writes files | Codex app, Claude Code, Cursor, Windsurf, Aider, another repo-aware coding agent |
| **VERIFY** | Independent review of diffs, claims, tests, instructions, and scope adherence | None | Claude Code, Codex, ChatGPT/GPT, Gemini, human checklist review |
| **ADVERSARY** | Hostile/critical review focused on hidden assumptions, edge cases, security, regressions, and tool-family blind spots | None | Claude, Codex/ChatGPT, Gemini, another different-family reviewer |

LEAD-V roles are conceptual responsibilities. Tools are adapters that can perform those responsibilities. A project may use different tools for the same role depending on task type, model quality, repo access, and risk. The human orchestrates all four roles and makes the final judgment.

Slash commands such as `/prime`, `/verify`, `/handoff`, `/commit`, and `/retro` are Claude Code adapters shipped by this repo. They remain supported, but they are not universal across all tools.

## Role vs Tool

Roles define the job to be done. Tools define where that job happens.

- **Role:** SCOUT plans; IMPLEMENT edits; VERIFY audits; ADVERSARY attacks assumptions.
- **Tool:** ChatGPT, Claude.ai, Claude Code, Codex, Cursor, Gemini, and similar systems can fill one or more roles when they have the right access and model quality.
- **Separation:** The role boundary matters more than the vendor. A context that implemented the change is the wrong context to independently verify it.
- **Sensitive work:** When SCOUT and IMPLEMENT come from the same model family, use a different-family ADVERSARY review for sensitive work. Same-family planning and execution can share blind spots.
- **Human control:** No tool substitutes for final human judgment, diff approval, and commit approval. Agent-run commits require explicit human authorization for one reviewed diff and one proposed message.

Enforcement applies to every write-capable execution lane equally, or it does not exist as mechanism. Where no lane-equal mechanism exists, protection is process: the human commit gate, cross-family ADVERSARY review, and Rule Zero.

---

## 1. SCOUT — Strategic Consultant

**Typical adapters:** ChatGPT / GPT-5.5, Claude.ai, Gemini, or another strong planning model.

**When to use:** Before you build, and when you're stuck.

**One-line session opener:** "I need SCOUT to evaluate [problem/decision/architecture] before implementation."

SCOUT handles planning, discovery, architecture decisions, feature scoping, and problem-solving that requires broad thinking. You bring it messy problems and it helps you think through them before any code gets written. A strong SCOUT adapter should preserve durable planning context through project knowledge, uploaded repo context, or repo-readable task packets rather than relying on a long chat transcript.

The mental model for SCOUT's prompt-writing is not "write a structured prompt" but "brief a new employee on their first day." An employee on day one needs a tour of the relevant code, worked examples of the pattern they're asked to follow, the constraints that aren't obvious from reading the files, the failure modes to watch for, and a clear definition of done. A good IMPLEMENT prompt provides exactly this. If SCOUT is tempted to skip context assembly because "the task is simple," reframe: would a new employee succeed on their first day with only the prompt as written? If not, the prompt is incomplete regardless of the task's apparent simplicity.

### Responsible for
- Designing system architecture and data models
- Evaluating technical trade-offs
- Breaking large features into sequenced implementation steps (numbered prompts)
- Reviewing plans and strategies before execution begins
- Running the AI-Native Design Loop: draft → cross-review → synthesize → lock decisions
- Maintaining cross-project memory and context across sessions
- Identifying when research isolation is needed and generating RESEARCH PROMPTs
- Recommending FEATURE-BRIEF for complex features that need structured input
- Creating repo-readable task packets or scoped IMPLEMENT prompts that transfer planning context durably — packets include machine-readable frontmatter declaring status, lane, complexity, file scope, verification commands, and adversary routing
- Specifying the three end-to-end tests in IMPLEMENT prompts for feature work — inputs, outputs, error paths — so tests describe the contract rather than the implementation (see [`workflow/DISCIPLINE.md`](../workflow/DISCIPLINE.md) § Test Discipline)
- Filling the Verifiability Strategy section of FEATURE-BRIEF before any IMPLEMENT prompt is generated (see [`templates/FEATURE-BRIEF.md`](../templates/FEATURE-BRIEF.md) § Verifiability Strategy)
- **Generating exactly one IMPLEMENT prompt per turn** (one prompt, one handoff — see [`workflow/DISCIPLINE.md`](../workflow/DISCIPLINE.md))

### Not responsible for
- Writing production code
- Making file changes (SCOUT is no-write by role)
- Running tests or verifying implementations (that's VERIFY)
- Auditing diffs or enforcing session protocol (that's VERIFY)
- Adversarial code review (that's ADVERSARY)
- Deep codebase exploration (use research mode with sub-agents)

### How to use it
Give SCOUT durable project context: `AGENTS.md`, `PROJECT_STATE.md`, any active FEATURE-BRIEF, and relevant repo excerpts or research summaries. Describe the problem. Ask for a plan, task packet, or prompt, not code. Take the output to IMPLEMENT for execution.

### When to request research isolation
If SCOUT needs to understand a part of the codebase it has not seen, it produces a RESEARCH PROMPT instead of planning without the information. The human runs the research in a separate repo-aware session and brings the summary back to SCOUT.

---

## 2. IMPLEMENT — Senior Engineer

*Previously called FORGE in v2.0.*

**Typical adapters:** Codex app, Claude Code, Cursor, Windsurf, Aider, or another repo-aware coding agent.

**When to use:** To write, modify, and refactor code.

**One-line session opener:** "IMPLEMENT: execute [PROMPT X.Y] — [brief description]."

IMPLEMENT is the execution role. It receives scoped prompts or task packets (from SCOUT, VERIFY, or directly from the human), writes code, makes file changes, runs migrations or tests when needed, and performs mechanical verification. It works with repo access and follows the project's Layer 1 rules.

### Responsible for
- Writing new code and modifying existing files
- Refactoring and restructuring code
- Generating boilerplate, components, and tests
- Running migrations, test commands, typechecks, lint, and other mechanical checks when the prompt requires them
- Following project conventions defined in `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, and `.claude/rules/`
- Explaining code when asked
- Showing diffs after every change
- Executing fix prompts generated by SCOUT or VERIFY — including prompts that remediate ADVERSARY findings
- Running one human-authorized commit when the reviewed diff, proposed message, and Task Packet scope all match

### Not responsible for
- Deciding *what* to build (that's SCOUT or the human)
- Verifying its own output against requirements (that's VERIFY)
- Adversarial review of its own output (that's ADVERSARY)
- Making architectural decisions that affect multiple systems
- Writing state files (VERIFY proposes, human/IMPLEMENT applies)

### IMPLEMENT Guardrails (summary)
1. One prompt, one task — no combining unrelated changes
2. List ALL files to be modified BEFORE editing, wait for confirmation
3. Never touch files outside explicit task scope
4. Show full diffs after every change
5. Never commit without human review and explicit authorization
6. Fresh context per prompt — new session for each IMPLEMENT prompt
7. Follow project conventions at all times

For the complete discipline rules (including Rule Zero, anti-rationalizations, and the full failure context), see [`workflow/DISCIPLINE.md`](../workflow/DISCIPLINE.md).

---

## 3. VERIFY — Auditor

**Typical adapters:** Claude Code, Codex, ChatGPT/GPT, Gemini, another clean reviewer with repo or diff access, or a human checklist pass.

**When to use:** After IMPLEMENT executes, at the start of every session, and periodically for health checks.

**One-line session opener:** "VERIFY: audit — run the cold-start audit and report current state."

VERIFY is the quality gate. It reviews what IMPLEMENT built, checks claims against the repo, enforces session protocol, and catches problems before they compound. VERIFY assumes nothing and verifies against the actual state of the repo (Rule Zero). In Claude Code, `/prime` is the standard cold-start adapter for this audit.

### Responsible for
- **Cold-start audits:** Read `PROJECT_STATE.md`, git log, and codebase state with zero assumptions. In Claude Code, run `/prime`. Report discrepancies.
- **Post-implementation audits:** Review IMPLEMENT diffs for scope compliance, unintended changes, regressions.
- **Session protocol enforcement:** Ensure `PROJECT_STATE.md` is updated *by the human* with VERIFY's proposed content, checklists reflect reality, bugs are logged.
- **Health checks:** Typecheck, lint, build verification, dependency audits.
- **Bug tracking:** Propose additions to Known Bugs when audits find issues.
- **Fix prompt generation:** When verification fails, generate scoped IMPLEMENT prompts targeting only what went wrong.
- **Graduation audits:** When a phase is marked complete, verify all checklist items against the codebase.
- **Session handoffs:** Draft structured handoff documents when sessions get long. In Claude Code, use `/handoff`.

### Not responsible for
- Writing any files (see Rule: VERIFY does not write files in [`workflow/DISCIPLINE.md`](../workflow/DISCIPLINE.md))
- Writing new features (it audits, it doesn't build)
- Making architectural decisions (escalate to SCOUT)
- Making business decisions (escalate to the human)
- Modifying locked specifications in `docs/specs/`
- Performing research (that's a separate mode)
- Adversarial review (that's ADVERSARY — different model family required)

### VERIFY triggers
- Start of a new session (cold-start audit mandatory; `/prime` in Claude Code)
- After any IMPLEMENT prompt execution (post-implementation audit)
- When the human says "audit", "verify", or "health check"
- When `PROJECT_STATE.md` appears stale or inconsistent with the codebase
- After a deployment or environment change
- When a phase is marked complete (graduation audit)
- When a session is getting long or context quality is degrading (`/handoff`)

### Claude Code slash-command adapters

These commands are available when VERIFY runs in Claude Code. Other tools should perform the same checks through their own interface; the commands themselves are not universal.

- `/prime` — session orientation, load project context
- `/handoff` — create structured session handoff document
- `/commit` — drafted by VERIFY, executed by human or authorized IMPLEMENT (VERIFY does not commit; see No-Write Rule)
- `/retro` — record a durable LEAD-V lesson in `docs/retro-log.md`
- `/verify` — post-implementation audit checklist
- `/simplify` — code simplification audit on recently changed files
- `/adversary` — prepare an ADVERSARY review package
- `/scaffold` — bootstrap LEAD-V in a new project

### How to use it
Point at specific files or directories. Give a clear audit scope: "Review the auth module for scope compliance and build health," not "look at everything." Feed its findings back to IMPLEMENT as scoped fix prompts.

---

## 4. ADVERSARY — Cross-Model Auditor

**Typical adapters:** Claude, Codex/ChatGPT, Gemini, or another capable reviewer from a different model family than the one that planned, implemented, or verified the change.

**When to use:** Before commit on sensitive code. This is **required**, not optional, for the categories below.

**One-line session opener:** "ADVERSARY: audit [files / diff / PR] for [security | race conditions | data integrity | scoring accuracy]."

ADVERSARY exists because same-family audits share blind spots with the model family that planned, wrote, or verified the code. When the same family performs multiple roles, those contexts may all miss the same bypass path because their training distributions overlap. A different model family has different blind spots, and therefore catches different bugs.

This is not speculation. It is a documented failure mode: a scoring engine with missing business-subtype mappings silently scored entire categories zero. VERIFY (Claude) passed. A different-family adversarial review flagged the missing mappings immediately. Both reviewers were competent; they just had different blind spots.

### Required for
- Security boundaries — auth, RLS policies, authorization, input validation, session handling
- Database migrations and schema changes
- Scoring, pricing, and billing logic
- Race conditions, concurrency primitives, locking, retry logic
- Rate-limiting and abuse-prevention logic
- Anywhere a silent failure would compound invisibly before detection

### Not required for (but optional)
- UI-only changes with no business logic
- Content updates (copy, documentation)
- Style and formatting changes
- Dev-tooling changes that don't affect production behavior

### Responsible for
- **Hunting for bypass paths:** What inputs or sequences would defeat this check?
- **Race condition analysis:** What happens if two of these run concurrently? What if one fails partway?
- **Migration safety review:** What's the rollback story? What's the zero-downtime story? What's the lock impact?
- **Edge-case probing:** Empty inputs, nil/null, boundary values, unicode, very large inputs, malformed inputs.
- **Reasoning-gap detection:** Places where the author's comment says one thing but the code does another.
- **Same-family-blind-spot detection:** Patterns that VERIFY (same-family audit) would accept because they look correct at a glance.

### Not responsible for
- Writing fixes (fixes flow through IMPLEMENT)
- Modifying any files
- Committing anything
- Style preferences (that's `/simplify`)
- Scope compliance (that's VERIFY)

### How it fits in the loop

~~~
SCOUT → IMPLEMENT → VERIFY → [if sensitive code] ADVERSARY → human authorizes commit
                                      ↓
                        (if findings) IMPLEMENT fixes →
                        VERIFY re-audits → ADVERSARY re-reviews (if high-severity)
~~~

ADVERSARY runs *after* VERIFY passes. Running it before wastes cycles — VERIFY catches scope and build issues faster, and ADVERSARY shouldn't be reviewing broken code.

### ADVERSARY session context

The project root contains `ADVERSARY.md` — the session-opening prompt that defines ADVERSARY's role, rules, and expected output format. Paste it into the different-family review session before handing over the code. The framework template is at [`root-files/ADVERSARY.md`](../root-files/ADVERSARY.md).

### Output format

ADVERSARY returns structured findings:

~~~
## Adversarial Review — [feature/scope]

**Reviewed:** [files / commit range]
**Findings:** N (Critical: N, High: N, Medium: N, Low: N)

### Finding 1 — [Severity] [Title]
**Location:** path/to/file.ts:LINE
**Category:** [Security / Race / Migration / Edge case / Reasoning gap]
**Description:** [What's wrong, one paragraph.]
**Bypass / failure scenario:** [Concrete example of how this goes wrong.]
**Suggested fix direction:** [Not code — direction for the IMPLEMENT prompt.]

### Finding 2 — ...

### No-findings note (if applicable)
"Reviewed [scope]. No findings above Low severity. Attempted bypass paths:
[list what you tried and why they didn't work]."
~~~

The "attempted bypass paths" note is important — it distinguishes "I looked and found nothing" from "I didn't look hard."

### When ADVERSARY is wrong

ADVERSARY is not infallible. Its findings sometimes reflect a pattern mismatch rather than a real bug (e.g., "this should use X pattern" when your project deliberately uses Y). SCOUT (or the human) triages:

- **Legitimate finding → fix.** Generate an IMPLEMENT prompt targeting the finding.
- **Pattern mismatch → document.** Add a note to `.claude/rules/` or the relevant spec explaining why Y is used, so next session's ADVERSARY doesn't re-raise the same finding.
- **False positive → dismiss with reasoning.** Record the dismissal in the session log so the pattern is visible.

---

## Research Mode

Research is a separate mode, not a SCOUT, VERIFY, or ADVERSARY responsibility. When SCOUT needs codebase or web research before generating good prompts:

1. **SCOUT** identifies the research need and produces a `RESEARCH PROMPT:`
2. **Human** runs it in a separate repo-aware session — dedicated context window
3. **Sub-agents** (Agent tool) perform parallel, isolated research
4. **Main session** synthesizes sub-agent findings into a concise report
5. **Human** pastes the report back to SCOUT

### Word caps

- **Per sub-agent:** under 300 words
- **Synthesis (single-question research):** under 500 words
- **Synthesis (multi-domain research, 4+ sub-agents):** under 2500 words

The cap is per-sub-agent, not per-synthesis. A 6-domain audit returning 6 × 300-word summaries synthesizes to roughly 1800 words, which is a reasonable context load for SCOUT. Forcing all that into 300 words produces useless truncation.

### Why research is separate from VERIFY

VERIFY's job is auditing — verifying that what was built matches what was asked. Overloading VERIFY with research responsibilities muddies its purpose and risks carrying research context into audit sessions. Research needs its own clean context window.

### When to use research mode
- Starting a new feature area you haven't worked in recently
- Needing to understand how an unfamiliar part of the codebase works
- Researching external best practices or library comparisons
- Any situation where SCOUT says "I need to understand X before I can plan"

### When to skip it
- Routine tasks in well-understood areas
- Bug fixes where the problem is already identified
- Tasks where `PROJECT_STATE.md` and the development plan provide sufficient context

---

## Mode Discipline

Each prompt should be clearly one mode. Don't mix modes within the same prompt.

- **IMPLEMENT prompts** produce code changes
- **VERIFY prompts** produce audit reports and fix prompts
- **ADVERSARY prompts** produce findings
- **RESEARCH prompts** produce investigation summaries

Some tools allow mode-switching inside one product, but each prompt is labeled one mode. Mixing modes leads to confused output — the agent tries to build and audit simultaneously, doing neither well. This is the lesson behind every one of the anti-rationalization blocks in [`workflow/DISCIPLINE.md`](../workflow/DISCIPLINE.md).

---

## Implementation Tool Adapters

IMPLEMENT needs repo access, file-edit ability, and clear diff visibility. Choose the adapter that best fits the task:

- **Codex app** — strong default for OpenAI-first repo-aware implementation.
- **Claude Code** — strong for Claude-first terminal implementation and Claude slash-command workflows.
- **Cursor** — useful for visual inline diffs, visual CSS work, autocomplete-heavy edits, and IDE-native search/replace.
- **Other repo-aware agents** — valid when they can read the relevant repo context, edit files deliberately, show diffs, and run the required checks.

When using an adapter that does not load `.claude/rules/`, Claude slash commands, or SKILL.md files automatically, include the relevant context directly in the task packet or prompt.

---

## Recommended Tool Mappings

These are starting points, not requirements. Pick the strongest adapter available for each responsibility.

### Default OpenAI-first lane

- **SCOUT:** ChatGPT / GPT-5.5
- **IMPLEMENT:** Codex app
- **VERIFY:** Codex mechanical checks plus independent review when needed
- **ADVERSARY:** Claude, Gemini, or another different-family reviewer

### Claude-first lane

- **SCOUT:** Claude.ai
- **IMPLEMENT:** Claude Code
- **VERIFY:** Claude Code or another independent reviewer
- **ADVERSARY:** Codex, ChatGPT, Gemini, or another different-family reviewer

### Mixed-tool lane

- **SCOUT:** strongest planner available
- **IMPLEMENT:** strongest repo-aware coding environment available
- **VERIFY:** clean diff/check reviewer
- **ADVERSARY:** different-family critical reviewer

### Reduced-tool setups

LEAD-V scales down. If you only have one tool, the human plays SCOUT and the tool mode-switches across IMPLEMENT and VERIFY in fresh contexts. If you do not have a second model family, you lose ADVERSARY coverage. For non-sensitive work this can be acceptable. For auth, migrations, scoring, billing, concurrency, and other risky work, use a different-family reviewer before committing.

LEAD-V currently provides no lane-equal enforcement mechanism. Every write-capable adapter therefore follows the same process controls, including the human commit gate and any required cross-family ADVERSARY review.

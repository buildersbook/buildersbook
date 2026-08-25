# Verification Checklist

This is the checklist VERIFY runs after every IMPLEMENT execution in the Assistance Loop. It is the structural backbone of Step 3 (Verify) and feeds Step 4 (Adversarial Review) when sensitive-code classification triggers. Cross-reference [`DISCIPLINE.md`](DISCIPLINE.md) for the failure stories that motivate each check and [`../roles/ROLES.md`](../roles/ROLES.md) for the role boundaries this checklist enforces — most importantly, VERIFY proposes, ADVERSARY reports, neither writes.

Skip nothing. In Claude Code, `/verify` is the adapter command for running this checklist as executable steps. Other VERIFY adapters should run the same checklist manually or through their own equivalent workflow.

---

## Standard VERIFY Checklist

Run on every IMPLEMENT execution, regardless of sensitivity. If a Task Packet was used, compare behavior against the packet's goal, implementation requirements, frontmatter verification commands, Manual Verification / Acceptance Signals, and done criteria. Rule Zero still applies: repo evidence overrides stale packet claims, and the conflict must be named in the report.

### Scope compliance

- [ ] **File list declared.** IMPLEMENT listed every file it intended to touch before editing and waited for human confirmation.
- [ ] **Modified files match declared scope.** Diff files ⊆ declared files. Any extra file is an immediate fail, even if the change is "obviously correct."
- [ ] **Task Packet scope checked.** If a Task Packet exists, modified files are within its allowed scope and outside its forbidden scope.
- [ ] **Task Packet conflicts reported.** If the Task Packet conflicts with repo evidence, the repo wins and the conflict is reported instead of silently following stale packet instructions.
- [ ] **No out-of-scope edits.** No "helpful" fixes to adjacent files, no import-path sweeps, no formatting passes on untouched code.
- [ ] **No unintended creations.** New files only where the prompt explicitly authorized them.
- [ ] **No unintended deletions.** Removed files or removed symbols match the prompt's stated intent.

### Diff review

- [ ] **Full diff shown.** IMPLEMENT produced a complete diff after the change, not a summary.
- [ ] **Every hunk justified.** Each added, modified, or deleted line traces to a requirement in the prompt or Task Packet.
- [ ] **No silent modifications.** No whitespace-only reformats hiding logic changes. No "drive-by" edits buried in otherwise-expected hunks.
- [ ] **No unexplained deletions.** Removed code either matches the prompt's replace-this instruction or is flagged for explicit review.
- [ ] **No commented-out code.** Old code is deleted, not commented. `// TODO`, `// FIXME`, `// HACK` placeholders are not left behind.

### Build health

- [ ] **Typecheck passes.** Project's typechecker runs clean on the modified scope.
- [ ] **Lint passes.** No new lint errors or warnings in the modified files.
- [ ] **Relevant tests pass.** If tests exist for the touched module, they pass. New test failures mean the change broke something.
- [ ] **No new warnings.** Build output warnings before vs. after — any new warning is a finding.

### Convention adherence

- [ ] **Matches project conventions.** File placement, naming, imports, and patterns match the rules declared in `AGENTS.md`, relevant adapter files such as `CLAUDE.md`, `CODEX.md`, `.cursorrules`, and any domain rules that matched the touched paths.
- [ ] **No unexplained pattern drift.** If the implementation deviates from the established pattern in a nearby file, the prompt must have authorized the deviation.
- [ ] **No surprise dependencies.** New imports come from already-installed packages unless the prompt authorized an install.

### State capture (propose-only)

VERIFY does not write files. These items are proposals in the audit report; the human or a follow-up IMPLEMENT prompt applies them.

- [ ] **PROJECT_STATE.md update proposed** as a diff in the report — current task, last completed, next steps, any new blockers.
- [ ] **Commit message drafted** — conventional prefix, one-line summary, body explaining *why*, `Context:` section if AI context files changed.
- [ ] **Known Bugs additions proposed** for any issues found during audit that are out of scope to fix now.

If any item above fails, VERIFY stops here. It does not proceed to ADVERSARY classification. A targeted fix prompt is generated; the loop restarts at Step 2 (Execute) for the fix.

---

## Sensitive-Code Classification

When the standard checklist passes, VERIFY classifies the change. VERIFY flags → ADVERSARY reviews. The categories below automatically escalate a change to ADVERSARY review.

Sensitive-code classification is the blast-radius axis — what the code can damage. This is distinct from architectural criticality (leaf vs. trunk), which governs how aggressively a prompt can be framed and is covered in [`workflow/DISCIPLINE.md`](DISCIPLINE.md) § Architectural Criticality. Both calls must be made before IMPLEMENT begins.

### Security boundaries

Authentication, authorization, RLS policies, SSRF protection, input validation on network-facing endpoints, cryptographic operations, session handling, secrets management.

### Data integrity

Database migrations, scoring/ranking/calculation logic, financial calculations (pricing, billing, invoicing), any code path where a silent wrong answer is worse than a loud failure.

### Concurrency

Race conditions, locks, queues, background jobs, rate limiters, retry logic, idempotency keys, anything where two simultaneous callers could interact.

### External API integration

Third-party calls where quota, timeouts, partial-failure handling, or webhook idempotency matter. Anything that persists state based on an external response.

### Multi-tenancy

Cross-account data access paths, policy joins more than two hops from `account_id`, admin-client usage, tenant-scoped cache keys.

### Automatic escalation rule

**Any change touching two or more of the categories above is automatically sensitive, even if small.** A five-line change that crosses a security boundary and a concurrency boundary is a five-line change that goes to ADVERSARY.

### Explicit non-sensitive

UI-only changes with no business logic, content and copy updates, style and formatting, dev-tooling changes that don't affect production behavior. Skip ADVERSARY for these.

---

## ADVERSARY Section

ADVERSARY is the cross-model auditor — a different model family than the one that wrote and verified the code. It exists because same-model audits share blind spots with the model that wrote the code. See [`../root-files/ADVERSARY.md`](../root-files/ADVERSARY.md) for the session primer.

### When ADVERSARY runs

- After VERIFY passes and the change hits any sensitive-code category
- When the automatic-escalation rule (two or more categories) triggers
- When SCOUT explicitly requests adversarial review for a non-classified change

ADVERSARY runs *after* VERIFY, not before. VERIFY catches scope and build issues faster, and ADVERSARY should not be reviewing broken code.

### Framing

ADVERSARY assumes bugs exist. Its job is to find them, not to confirm correctness. It models the adversary, not the author. It does not accept "looks correct" as sufficient — it hunts for bypass paths, race conditions, edge cases, and reasoning gaps. If ADVERSARY cannot find a failure after genuine effort, it reports "no findings" *with an explicit list of bypass paths attempted*. No-findings without attempted bypasses is insufficient.

### No-write enforcement

ADVERSARY reports findings only. It does not modify files, does not commit, does not make the fix. IMPLEMENT remediates via a scoped fix prompt; VERIFY re-audits the fix; ADVERSARY re-reviews only for high-severity findings. An adversarial reviewer that can also fix things loses the adversarial posture.

### Required output format

Each finding must include:

- **Severity** — Critical / High / Medium / Low (round up when unsure)
- **Location** — `path/to/file.ts:LINE` or line range
- **Category** — Security / Migration / Scoring / Race / Edge / Reasoning / Other
- **Issue** — one paragraph stating what's wrong
- **Impact** — concrete bypass or failure scenario ("Given X, if Y, then Z instead of W")
- **Recommended fix** — direction for the IMPLEMENT prompt, not code

Findings summary at top: total count by severity. See the full template in [`../roles/ROLES.md`](../roles/ROLES.md) → ADVERSARY Output format.

### Disagreement handling

When ADVERSARY and VERIFY disagree, SCOUT adjudicates. The disagreement itself is a signal worth investigating — it often points at the same-model blind spot that ADVERSARY exists to cover. SCOUT triages into one of three outcomes:

- **Legitimate finding → fix.** Scoped IMPLEMENT prompt targeting the finding. Cycle back through VERIFY and ADVERSARY re-review if high-severity.
- **Pattern mismatch → document.** Add a note to `.claude/rules/` or the relevant spec so future ADVERSARY runs don't re-raise the same finding.
- **False positive → dismiss with reasoning.** Record the dismissal in the session log. A dismissal without reasoning is not a valid outcome.

Do not let VERIFY's confidence override ADVERSARY's finding without adjudication. The entire point of ADVERSARY is to catch what same-family review misses; "VERIFY already approved" is not counter-evidence.

---

## Failure Modes This Checklist Defends Against

Every check above traces to a real failure. See [`../reference/failure-modes.md`](../reference/failure-modes.md) for the full catalog. At minimum this checklist defends against:

- **Scope creep** — agent silently edits adjacent files while working on a named task; caught by the scope-compliance block
- **Silent modifications** — formatting or whitespace edits hide logic changes; caught by the diff-review block
- **Same-model blind spot** — VERIFY and IMPLEMENT share training distributions and share blind spots; caught by sensitive-code classification routing to ADVERSARY (Failure 10, landing in P15)
- **Unverified convention drift** — file placement, import style, or pattern choice drifts from project norms; caught by the convention-adherence block
- **State corruption** — VERIFY writes wrong things into `PROJECT_STATE.md` that subsequent sessions trust as ground truth; caught by the propose-only state-capture rule

For the structured input that precedes this checklist, see [`../templates/FEATURE-BRIEF.md`](../templates/FEATURE-BRIEF.md) (complex features) and [`ASSISTANCE-LOOP.md`](ASSISTANCE-LOOP.md) § Prompt templates (every prompt).

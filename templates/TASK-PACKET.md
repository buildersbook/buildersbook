# Task Packet Template

A Task Packet is a durable, repo-readable implementation contract created by SCOUT and consumed by IMPLEMENT. It transfers planning context into one implementable unit of work without relying on long chat history. The YAML frontmatter is the machine-readable contract used by human dispatch, IMPLEMENT, VERIFY, and any future lane-equal automation. The prose body is the human- and agent-readable context that explains the work.

## How This Differs

- **Feature Brief:** Larger planning and scoping artifact for a feature that may span multiple prompts or sessions.
- **Handoff:** Session continuation note that captures where work stopped and what the next session should know.
- **Task Packet:** One implementable unit of work with explicit context, scope, verification, and done criteria.

## LEAD-V Rules

- Use the repo as the source of truth.
- Do not rely on long chat history.
- If this packet conflicts with the repo, report the conflict before implementing.
- IMPLEMENT must not modify files outside the allowed scope.
- One Task Packet describes one implementable unit of work.
- Human final judgment, diff approval, and commit approval remain required.
- Dispatch-relevant fields live only in the frontmatter and are never duplicated in the prose body.

Enforcement applies to every write-capable execution lane equally, or it does not exist as mechanism. Where no lane-equal mechanism exists, protection is process: the human commit gate, cross-family ADVERSARY review, and Rule Zero.

## Frontmatter Field Reference

| Field | Required | Values / Format | Read by |
|---|---|---|---|
| id | yes | TP-YYYY-NNNN | dispatcher, commit messages, humans |
| status | yes | draft / ready / in-progress / blocked / done | dispatcher (status: ready = queued), humans |
| lane | yes | tiny / normal / sensitive / unattended (reserved) | dispatcher, ADVERSARY routing |
| adapter | yes | claude-code / codex / cursor / other | human dispatcher |
| complexity | yes | judgment / mechanical | model selection via the table in workflow/ASSISTANCE-LOOP.md |
| allowed_files | yes | list of repo-relative paths | human dispatcher, IMPLEMENT, VERIFY |
| forbidden_files | no | list of repo-relative paths | human dispatcher, IMPLEMENT, VERIFY |
| verification | no | list of shell commands runnable from repo root | IMPLEMENT, VERIFY, human commit gate |
| adversary | yes | required / not-required / conditional | Assistance Loop step 5 |
| created | yes | YYYY-MM-DD | humans |
| created_by | no | free text | humans |

Notes:

- `lane: unattended` is reserved — until the Unattended Lane is defined, `lane: unattended` is invalid. Human dispatch and any future lane-equal automation must reject any packet carrying it before execution begins.
- If the same path appears in both `allowed_files` and `forbidden_files`, the packet is invalid. Human dispatch and any future lane-equal automation must reject it before execution begins. Conflicts are fixed in the packet, never resolved by precedence at runtime.
- Status transitions are performed manually by the human or a human-dispatched agent until the dispatcher specification ships. The final pre-review edit sets `status: done`. In that diff, `done` is a declaration of readiness for review, not a claim that ADVERSARY review has already concluded. Done Criteria checkboxes may contain only items checkable at final-diff time, such as edits applied and verification runs passed. ADVERSARY approval is evidenced in the review record, and commit authorization is evidenced by the human's authorization; neither is recorded through a post-approval file edit. An APPROVE verdict applies only to the exact diff reviewed. Any subsequent edit, however small, voids the verdict and requires re-review of the resulting diff before commit authorization. An ADVERSARY `REJECT` reopens the packet: `status` reverts to `in-progress` as part of the next fix-pass diff, then returns to `done` as that pass's final pre-review edit.
- `complexity` encodes the decision, not a model name, so packets stay durable across model generations. The model-selection table in [`../workflow/ASSISTANCE-LOOP.md`](../workflow/ASSISTANCE-LOOP.md) maps the tier to a current model.
- `verification` holds mechanical commands only. Manual checks belong in the prose "Manual Verification / Acceptance Signals" section.
- List exact repo-relative paths in `allowed_files` and `forbidden_files` unless a project-level contract explicitly defines supported glob semantics.

---

**The copyable template begins at the `---` line below.** Copy everything from there to the end of the file into a new packet under `docs/task-packets/`.

---
id: TP-YYYY-NNNN
status: draft
lane: [tiny / normal / sensitive]
adapter: [claude-code / codex / cursor / other]
complexity: [judgment / mechanical]
allowed_files:
  - [path]
  - [path]
forbidden_files:
  - [path]
verification:
  - "[shell command runnable from repo root]"
  - "[shell command runnable from repo root]"
adversary: [required / not-required / conditional]
created: YYYY-MM-DD
created_by: [Name or tool/model, if useful]
---

# [Short task name]

## Related Feature Brief / Spec / Handoff

- Feature Brief: [path or none]
- Spec: [path or none]
- Handoff: [path or none]

## Goal

[What IMPLEMENT should accomplish in one paragraph.]

## Why This Matters

[Why this task exists; user, product, technical, or risk context.]

## Source of Truth / Context Files

- [path] - [why it matters]
- [path] - [why it matters]

If any listed context conflicts with the current repo, the repo wins.

## Files to Inspect First

- [path] - [what to look for]
- [path] - [what to look for]

## Current Assumptions

- [Assumption to verify against the repo before acting]
- [Assumption to verify against the repo before acting]

## Implementation Requirements

- [Requirement]
- [Requirement]
- [Requirement]

## Manual Verification / Acceptance Signals

- [Human-judged check]
- [Human-judged check]
- [Expected output or acceptance signal]

## Adversary Reasoning

- Sensitive-code classes touched: [auth / migrations / scoring / billing / concurrency / rate-limiting / external API / multi-tenancy / none]
- Different-family ADVERSARY review required before commit: [yes / no, with reasoning]

## Rollback Notes

[How to undo or safely back out the change if verification fails.]

## Done Criteria

- [ ] Only files listed in `allowed_files` were modified.
- [ ] Implementation requirements are satisfied.
- [ ] Verification commands pass.
- [ ] `status: done` is set and the resulting full diff is ready for human review.

Closing evidence is external to these checkboxes: an `APPROVE` verdict in the review record and the human's commit authorization. Neither requires a post-approval packet edit.

## Notes / Open Questions

- [Question or note]
- [Question or note]

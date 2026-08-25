---
description: Record a durable LEAD-V retro lesson from a verified failure or success
argument-hint: "[packet-id] [short lesson]"
---

# Retro: Record a Durable Lesson

## Objective

Capture lessons that should shape future SCOUT, IMPLEMENT, VERIFY, or
ADVERSARY behavior without relying on chat history or stale handoff memory.
`/retro` writes to `docs/retro-log.md`, the durable LEAD-V retro log.

## When To Use

Run `/retro` after VERIFY or ADVERSARY identifies a pattern worth preserving:

- a failure mode that escaped an earlier gate
- a review route that was misclassified
- an enforcement or workflow gap that should not recur
- a positive pattern that materially improved review outcome

Do not use `/retro` for ordinary status updates. Those belong in
`PROJECT_STATE.md` or a Task Packet.

## Entry Format

Append one entry to `docs/retro-log.md` using this shape:

~~~markdown
## YYYY-MM-DD — TP-YYYY-NNNN — short title

**Type:** failure | success | process
**Roles involved:** SCOUT / IMPLEMENT / VERIFY / ADVERSARY / human
**Lesson:** One concise paragraph naming the durable rule.
**Action:** The future behavior this lesson changes.
~~~

Keep entries short. Link to the packet, spec, or commit when available. If the
lesson belongs in a canonical rule, create a follow-up Task Packet instead of
letting the retro log become the only source of truth.

## Process

1. Read `docs/retro-log.md`.
2. Verify the packet, diff, review, or commit being summarized against the repo.
3. Append a single structured entry.
4. Show the diff.
5. Stop. Do not commit unless a separate human authorization covers the commit.

## Notes

Proposal 7 was not present in this checkout when this command was created. This
adapter intentionally implements the minimal durable behavior requested by the
release packet: a structured log append with repo verification before recording
the lesson.

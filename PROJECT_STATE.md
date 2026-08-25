<!-- LEAD-V FRAMEWORK -->
# [PROJECT_NAME] — Project State

> **How to use this file:**
> Update at the **start** and **end** of every work session.
> At session start: review current state, verify against codebase.
> At session end: update what was completed, log the session, set up next steps.
> This file is always current state, not a log. Replace content — don't append.
> Previous state is preserved in git history.

> Last updated: [DATE] (Session [N])
> Updated by: [ROLE — e.g., IMPLEMENT after VERIFY proposal — brief description of what changed]

## Phase Status

> The codebase is the source of truth. `DEVELOPMENT-PLAN.md` tracks planning intent; this table summarizes current phase status. When plan and repo disagree, the repo wins — reconcile the plan to match.

<!-- CUSTOMIZE: Replace with your project's actual phases -->
| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | [Infrastructure Setup] | [X done, Y partial, Z not started] | [Key details] |
| 1 | [Phase Name] | [Status] | [Key details] |
| 2 | [Phase Name] | [Status] | [Key details] |

## Environment Status

<!-- CUSTOMIZE: Replace with your project's environment details -->
- `.env.local`: [EXISTS / DOES NOT EXIST] — [what it contains or what's missing]
- `.env.production`: [populated / empty / partial]
- [Service 1, e.g., Stripe]: [Status — registered, keys configured, not configured]
- [Service 2, e.g., Resend]: [Status]
- [Service 3, e.g., Sentry]: [Status]
- [Hosting, e.g., Vercel]: [Status — deployed URL, DNS status]
- [Database, e.g., Supabase]: [Status — local dev works, production configured]
- Build: [PASSING / FAILING] as of [DATE]

## Known Bugs

<!-- CUSTOMIZE: Track bugs as they're found. Remove when fixed. -->
1. [Description of bug, what it affects, and what it should do instead]
2. [Another bug]

## Current Task

<!-- CUSTOMIZE: What are you actively working on right now? Be specific. -->
[Describe the current task. Not "working on auth" but "implementing password
reset flow — email sending is done, need to build the token verification
endpoint and the reset form UI."]

## What Was Done Last Session

<!-- CUSTOMIZE: Brief narrative of what was completed most recently. -->
- [Bullet point of what was done]
- [Another item]
- [Include commit hashes if relevant]

## Active Blockers

<!-- CUSTOMIZE: Is anything stuck or waiting? -->
[List anything blocking progress. If nothing is blocked, write "None."]

## Immediate Next Tasks (In Order)

<!-- CUSTOMIZE: What comes after the current task? Ordered by priority/dependency. -->
1. [Highest priority next task]
2. [Second priority]
3. [Third priority]

## Session Log

<!-- Track session history. One row per session. -->
| Session | Date | Focus | Commit |
|---------|------|-------|--------|
| 1 | [DATE] | [Brief description] | [hash] |

## Session Notes

<!-- Optional — anything the next session needs to know -->
[Warnings, context, or handoff notes. Delete this section if there's nothing to note.]

---

## New Session Starter Prompts

### General opener (when resuming without a specific task)

~~~
Continuing [PROJECT_NAME] development. Follow the Session Protocol.
Read PROJECT_STATE.md and tell me the current status and recommended next task.
Don't start implementation until I confirm.
~~~

### Task-specific template (copy, fill in the brackets, paste)

~~~
Execute [TASK_ID] from [DEVELOPMENT-PLAN.md] — [brief description].

Read the full prompt spec in the dev plan before starting.
[Any extra context: file locations, API keys, design constraints]

Verify: [what success looks like].
When done, report results and propose or update state according to role rules.
Do not commit without explicit human approval.
~~~

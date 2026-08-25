# Feature Brief Template

Feature brief is the structured planning and scoping artifact produced jointly by the human and SCOUT when a feature needs context before IMPLEMENT begins. It replaces v3.x's two-template chain — separate files for context input and engineering decisions — with one consolidated artifact.

## Ownership

The human fills FEATURE / EXAMPLES / DOCUMENTATION / GOTCHAS sections. SCOUT fills the SPEC sections after reviewing the human's inputs. Neither party drafts the whole brief solo.

Each section below carries a `(human)` or `(SCOUT)` marker at its heading so ownership is visible at point-of-fill.

Verifiability Strategy is a SCOUT section — it is the design artifact that lets a reviewer confirm correctness without reading the implementation.

## When to fill this in

- Multi-prompt features where IMPLEMENT needs context across several sessions
- Sensitive-code work (auth, migrations, scoring / pricing / billing, concurrency, rate-limiting)
- Anything where IMPLEMENT needs more than a single prompt's worth of context to execute safely

## When NOT to use this

- Trivial changes, one-file fixes, quick refactors — go direct to an IMPLEMENT prompt
- Bug fixes where the problem is already scoped
- Work in well-understood areas where `PROJECT_STATE.md` plus a single prompt is enough

## Workflow

See the Ownership block above for the split rule. The typical cadence: the human drafts the human-owned sections first; SCOUT reviews those inputs and fills the SPEC-owned sections during planning; the completed brief is shared with IMPLEMENT before the first prompt. SCOUT fills Verifiability Strategy during planning, before any IMPLEMENT prompt is generated — it is the spec-level gate that prevents implementation without a verification plan. SCOUT also updates the Prompt sequence section as work progresses.

---

## Overview (human)

**Feature name:** [PLACEHOLDER]

**One-sentence description:** [PLACEHOLDER — what user-visible behavior changes]

**Rationale:** [PLACEHOLDER — why this is being built; the business or product motivation]

---

## Success Criteria (SCOUT)

Checkbox-style testable criteria. Each item must be specific enough that a human (or VERIFY) can confirm it against the codebase. This is the forcing function for "done."

> **Vague criteria defeat the purpose.** "The API works" is not a criterion. "GET /api/tasks returns 200 with a JSON array where each item has id (number), title (string), status (enum), createdAt (ISO date)" is.

- [ ] [PLACEHOLDER — e.g., GET /api/tasks returns 200 with JSON array; each item has id (number), title (string), status (enum), createdAt (ISO date)]
- [ ] [PLACEHOLDER — e.g., Clicking Add Task opens a modal with title input, priority dropdown, due date picker]
- [ ] [PLACEHOLDER — all validation passes (pnpm typecheck, pnpm lint, pnpm test)]
- [ ] [PLACEHOLDER — no regressions in existing test suite]

---

## Verifiability Strategy (SCOUT)

Before IMPLEMENT writes any code, SCOUT designs how the feature will be verified. The question this section answers is distinct from Success Criteria: Success Criteria defines done; Verifiability Strategy defines how we confirm done without reading the implementation line-by-line.

> **If you cannot articulate a verification plan without reading the generated code, the feature is not ready to implement.** This is the forcing function that prevents "looks right" from replacing "is right." It is the spec-level defense against the same-model blind spot — VERIFY and ADVERSARY catch what they catch, but the strongest position is a feature whose correctness is observable at the interface.

**Observable interface:**
- [PLACEHOLDER — what inputs and outputs a reviewer can inspect to confirm correctness without opening the implementation. e.g., "GET /api/scan returns JSON matching the ScanResult schema; every field's value is traceable to an input parameter or a scored check."]

**Verification approach:**
- [PLACEHOLDER — the primary method. Examples: "Automated end-to-end test covering happy path plus two error paths" / "Stress test running N iterations against known-good fixtures" / "Structural audit — every branch in the scoring logic maps to a specific rubric row in SCORING-ALGORITHM-SPEC-v1.0.md"]

**Reviewability without reading code:**
- [PLACEHOLDER — what a human or VERIFY can check without opening the implementation files. Examples: "Every added check has a log line showing input → intermediate → output" / "Migration adds an invariant that can be verified by a single SELECT" / "New endpoint responses include a trace ID that maps to the code path taken"]

**Failure modes considered:**
- [PLACEHOLDER — what would go wrong silently. Examples: "Scoring returns zero for unknown subtypes instead of erroring" / "Race between two identical requests produces duplicate rows" / "Migration succeeds on empty tables but deadlocks on production data"]

**Architectural criticality:** leaf / trunk / mixed
- [PLACEHOLDER — leaf means contained (nothing imports it); trunk means shared (multiple callers depend on it). Trunk changes require per-hunk human review regardless of verifiability strategy. See [`workflow/DISCIPLINE.md`](../workflow/DISCIPLINE.md) § Architectural Criticality.]

If any placeholder above is "TBD" or the strategy reduces to "read the diff carefully," the feature either needs decomposition into smaller-surface pieces or needs a design change that surfaces the behavior at the interface.

---

## Scope (human)

**In scope:**
- [PLACEHOLDER — bulleted list of what's being built]

**Out of scope:**
- [PLACEHOLDER — what's deliberately excluded; prevents scope creep during IMPLEMENT]

---

## Context (human)

**Existing code to follow:**
- `[PLACEHOLDER/path/to/similar-feature.ext]` — [which pattern applies and why]
- `[PLACEHOLDER/path/to/reference-implementation.ext]` — [what to reuse]

**Relevant documentation:**
- `[PLACEHOLDER — internal spec or doc path, specific section]`
- `[PLACEHOLDER — external URL with the specific section needed]`

**Prior art:**
- [PLACEHOLDER — has something similar been built in this project or referenced from another? point to file / commit / URL]

---

## Engineering Decisions (SCOUT)

**Tech stack / libraries / versions:**
- [PLACEHOLDER — only note new dependencies being introduced; default conventions live in `CLAUDE.md`]

**Project structure — where new files go:**

~~~
[PLACEHOLDER — e.g.:]
[apps/web/app/(marketing)/feature/   → Page routes]
[apps/web/lib/feature/                → Business logic]
[apps/web/components/feature/         → UI components]
[supabase/migrations/                 → Database changes]
~~~

**Code style — snippet from the codebase:**

One real snippet beats three paragraphs. Paste an example of well-written code from this codebase that the new feature should follow.

~~~
[PLACEHOLDER — paste code example here]
~~~

**Naming conventions:**
- [PLACEHOLDER — e.g., camelCase functions, PascalCase components, kebab-case files]

**Testing strategy:**
- Unit: [PLACEHOLDER — what gets unit tested and where]
- Integration: [PLACEHOLDER — what gets integration tested]
- E2E: [PLACEHOLDER — what gets e2e tested, if anything]
- Existing patterns to mirror: `[PLACEHOLDER/path/to/existing/test.spec.ext]`

---

## Commands (SCOUT)

~~~bash
# Build
[PLACEHOLDER — e.g., pnpm build]

# Test
[PLACEHOLDER — e.g., pnpm test]

# Type-check
[PLACEHOLDER — e.g., pnpm typecheck]

# Lint
[PLACEHOLDER — e.g., pnpm lint]

# Dev
[PLACEHOLDER — e.g., pnpm dev]
~~~

---

## Gotchas (human)

Things AI commonly misses, constraints not obvious from the code, edge cases, things to deliberately leave alone.

- [PLACEHOLDER — known limitation or edge case]
- [PLACEHOLDER — pattern that looks wrong but is intentional, with the reason]
- [PLACEHOLDER — dependency version or compatibility note]
- [PLACEHOLDER — convention that differs from framework defaults]
- [PLACEHOLDER — files or functions NOT to touch in this feature]

**Sensitive-code classification.** See `workflow/verification-checklist.md` for the full list. Sensitive-code classes include security boundaries (auth, RLS, authorization, input validation), database migrations, scoring / pricing / billing logic, race conditions / concurrency / locking, and rate-limiting / abuse prevention.

If this feature touches **two or more sensitive-code classes**, flag it here. ADVERSARY review (cross-model audit via Codex / GPT / Gemini) is required after VERIFY passes and before commit — it catches what same-family audits structurally miss.

- Sensitive-code classes touched: [PLACEHOLDER — list classes, or "none"]
- ADVERSARY review required: [PLACEHOLDER — yes / no, with reasoning]

---

## Artifacts to produce (SCOUT)

**Files to create:**
- `[PLACEHOLDER/path/to/new-file.ext]`

**Files to modify:**
- `[PLACEHOLDER/path/to/modified-file.ext]`

**Migrations (if applicable):**
- `[PLACEHOLDER/path/to/migration.sql]`

**Documentation updates (if applicable):**
- `[PLACEHOLDER/path/to/spec-or-guide.md]`

---

## Prompt sequence (SCOUT)

SCOUT fills this in as the feature progresses. One line per prompt — the feature's P-log. Each entry is a short description plus status (pending / in-flight / done / blocked).

- P1: [PLACEHOLDER — task description] — [status]
- P2: [PLACEHOLDER] — [status]
- P3: [PLACEHOLDER] — [status]

---

A filled-in FEATURE-BRIEF stays in the project root (or `docs/features/`) while work is in-flight. Archive to `docs/features/completed/` after merge.

**Rule Zero reminder:** the codebase is the only source of truth, even when a FEATURE-BRIEF is in play. If the brief and the code disagree, the code wins — update the brief, not the code. See `workflow/DISCIPLINE.md`.

# HANDOFF-BRAND.md — Brand Track, Complete

**From:** SCOUT session, brand workstream (BRAND-P1 → BRAND-P8), 2026-08-24/25
**Status:** Track COMPLETE. One external dependency open (designer SVGs). No decisions open.
**Rule Zero note:** Companion artifacts are the truth; this file is the pointer. Where this summary and an artifact disagree, the artifact wins — except the mockup CSS, which DESIGN-BUILD-NOTES.md explicitly corrects.

---

## Closed decisions (non-reopenable)

1. **The mark:** "The Open Spread" — two custom square-bracket cover-forms + centered block cursor (variant 2B). Full spec in the final Claude Design board and the designer brief. Validated by 3-model convergence (Claude, ChatGPT blind pick, Claude Design cold read) + adversarial pass (PASS WITH NOTES, all notes applied).
2. **Wordmark:** Source Serif 4, weight 600, title case, "The Builder's Book," typographic apostrophe U+2019 kerned −1.5% into the r / +1% before the s. Lowercase-monospace direction was considered and rejected — do not resurrect it (one review round tried; it was stale context).
3. **Site design:** editorial ink-on-warm-paper system; two type families only (Source Serif 4 = human, JetBrains Mono = machine); single red accent (#C9503C / #E06A50) = "the editor's red"; 620px/19px ≈ 66ch measure with 168px marginalia column; rationed cursor-block motif. Adversarial verdict: BUILD WITH FIXES — zero design blockers; all 19 fixes triaged into DESIGN-BUILD-NOTES.md.
4. **Accent usage rule (post-review amendment):** light-mode accent is non-text only (fails AA 4.10:1 for text; passes 3:1 non-text). Text is always ink/ink-muted. "Hover turns accent" is deleted.
5. **Token architecture:** semantic CSS custom properties as the single source (Tailwind v4 `@theme`), Fumadocs `--fd-*` variables assigned FROM them, no token build pipeline, no CSS-in-JS. Enforced by CI gates (below).

## Artifacts and where they go at Phase 0

| Artifact | Destination |
|---|---|
| Mockup zip (`Builder_s_Book_Mockup.zip` — HTML/CSS is the token value source) | `design/reference/` in the repo |
| DESIGN-BUILD-NOTES.md (19 triaged fixes; overrides mockup CSS where they conflict) | repo, alongside the plan |
| BRAND-HANDOFF-designer-brief-simple.md + final board PNG | already sent to designer; archive copy in `design/` |
| Round 1/2 exploration boards | internal only, do not commit |

## Plan impact (already-scoped additions, fold into Task Packets when drafted)

- **TP-002:** token file is a named deliverable (seeded from mockup CSS + corrections §1–5 of build notes); shell ≥912px; anchored marginalia grid; h3/h4 system; footnote component; defensive wrapping; code-block overflow/focus; index row grid; required states (404, code-copy, skip link, focus-visible, mobile menu, theme toggle); draft-chapter behavior.
- **TP-003:** four new CI gates — no-raw-values lint, token contrast test (review's failing pairs = regression fixture), 11px functional-text floor, heading-hierarchy check.
- **TP-004:** draft/planned chapters excluded from sitemap + noindex.

## Open external dependency

- **Designer** (existing collaborator, $100, production-only engagement): delivers exactly 2 SVGs — icon alone, lockup with outlined text, filled paths, #000000. May report optical corrections as original→final measurements; if any arrive, record them in the design reference, they do not reopen decisions.

## Queued work (not started, correctly waiting)

1. **Export pass** — one IMPLEMENT session when designer SVGs arrive: favicon 16/32 PNG+ICO from the pixel-grid coordinate spec (in designer brief + final board), avatar set at 62% rule for all platforms in IDENTITY.md, dark variants. Then avatar rollout across profiles (identity register's placeholder-avatar open item).
2. **Site mockup zip → token extraction** happens inside TP-002, not before.
3. Identity register items unchanged: X @buildersbook recheck ~2026-09-23, /accounts page, sameAs JSON-LD (brand track, downstream, never blocks).

## Prompt log

BRAND-P1 ChatGPT concept verdict · P2 Claude Design cold concepts · P3 refinement board · P4 ChatGPT adversarial (PASS WITH NOTES) · P5 final board · P6 brief clarity review (14 edits applied; 0.016em transcription error corrected to board's 0.015em) · P7 site design · P8 site adversarial (BUILD WITH FIXES). Cadence: one review round per decision, held throughout.

## Candidate retro-log entries (for the essay pipeline, not action items)

- Multi-model design review: blind head-to-head + cold read → convergence on bracket territory; ChatGPT's caret kill (construction misread) caught what the originating model missed.
- Stale-context failure: reviewer tried to reopen a closed decision (wordmark) it hadn't been told about — closed-decision lists must travel with every cross-model prompt.
- Review-found contrast failures converted directly into permanent CI regression fixtures (failure→system).

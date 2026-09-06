# HANDOFF-BRAND.md — Brand Production Handoff

**From:** SCOUT session, brand workstream (BRAND-P1 → BRAND-P8), 2026-08-24/25
**Status:** Design decisions closed. BRAND-P9 delivered the canonical icon, site icon set, and avatar exports (`f650fa4`, `6bce7af`). The lockup is closed as unnecessary: the header composes the canonical icon + live text. No lockup is retained in the repository.
**Rule Zero note:** Companion artifacts are the truth; this file is the pointer. Where this summary and an artifact disagree, the artifact wins — except the mockup CSS, which DESIGN-BUILD-NOTES.md explicitly corrects.

---

## Closed decisions (non-reopenable)

1. **The mark:** "The Open Spread" — two custom square-bracket cover-forms + centered block cursor (variant 2B). The canonical production artwork is `design/brand/icon.svg`; `design/brand/NOTES.md` records the designer’s optical correction and the approved export specification. The archived board remains the source for the small favicon grids. Validated by 3-model convergence (Claude, ChatGPT blind pick, Claude Design cold read) + adversarial pass (PASS WITH NOTES, all notes applied).
2. **Wordmark:** Source Serif 4, weight 600, title case, "The Builder's Book," typographic apostrophe U+2019 kerned −1.5% into the r / +1% before the s. Lowercase-monospace direction was considered and rejected — do not resurrect it (one review round tried; it was stale context).
3. **Site design:** editorial ink-on-warm-paper system; two type families only (Source Serif 4 = human, JetBrains Mono = machine); single red accent (#C9503C / #E06A50) = "the editor's red"; 620px/19px ≈ 66ch measure with 168px marginalia column; rationed cursor-block motif. Adversarial verdict: BUILD WITH FIXES — zero design blockers; all 19 fixes triaged into DESIGN-BUILD-NOTES.md.
4. **Accent usage rule (post-review amendment):** light-mode accent is non-text only (fails AA 4.10:1 for text; passes 3:1 non-text). Text is always ink/ink-muted. "Hover turns accent" is deleted.
5. **Token architecture:** semantic CSS custom properties as the single source (Tailwind v4 `@theme`), Fumadocs `--fd-*` variables assigned FROM them, no token build pipeline, no CSS-in-JS. Enforced by CI gates (below).
6. **Site usage:** The lockup is closed as unnecessary: the header composes the canonical icon + live text. The mark is also used for favicons, device icons, and avatars.

## Artifact locations

| Artifact | Destination |
|---|---|
| Mockup zip (`Builder_s_Book_Mockup.zip` — HTML/CSS is the token value source) | `design/reference/` in the repo |
| DESIGN-BUILD-NOTES.md (19 triaged fixes; overrides mockup CSS where they conflict) | repo, alongside the plan |
| Archived final brand board | `design/reference/Builders Book Logo.dc.html` |
| Canonical production icon and intake measurements | `design/brand/icon.svg` and `design/brand/NOTES.md` |
| Brand license boundary | `design/brand/README.md` |
| Site icon set | `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`, `app/manifest.webmanifest`, and `public/icon-{192,512}.png` |
| Avatar PNGs (light/dark, 400/800/1024px) | Exported outside the repository; not committed |
| Round 1/2 exploration boards | internal only, do not commit |

## Plan impact (already-scoped additions, fold into Task Packets when drafted)

- **TP-002:** token file is a named deliverable (seeded from mockup CSS + corrections §1–5 of build notes); shell ≥912px; anchored marginalia grid; h3/h4 system; footnote component; defensive wrapping; code-block overflow/focus; index row grid; required states (404, code-copy, skip link, focus-visible, mobile menu, theme toggle); draft-chapter behavior.
- **TP-003:** four new CI gates — no-raw-values lint, token contrast test (review's failing pairs = regression fixture), 11px functional-text floor, heading-hierarchy check.
- **TP-004:** draft/planned chapters excluded from sitemap + noindex.

## Closed note — lockup

- The lockup gap measures 7.2 units (0.857 cursor widths), below the required 25.2 units (3.0 cursor widths). The lockup is closed as unnecessary: the header composes the canonical icon + live text. Measurements and disposition are recorded in `design/brand/NOTES.md`; the icon set is complete independently.

## Export status and follow-up

1. **Export pass complete** — `pnpm brand:export` reproduces the site assets from the canonical icon, archived favicon grids, and semantic tokens. The 16/32px frames use integer pixels; the 48px frame uses the canonical vector. Avatars use the exact 62% visible-glyph rule. Profile rollout remains ahead.
2. **Token extraction complete** — TP-002 provisioned `styles/tokens.css`; export colors are read directly from that file.
3. **Social-card image** — recommended follow-up, not built in BRAND-P9.
4. Brand track items unchanged: X @buildersbook recheck ~2026-09-23, /accounts page, sameAs JSON-LD (brand track, downstream, never blocks).

## Prompt log

BRAND-P1 ChatGPT concept verdict · P2 Claude Design cold concepts · P3 refinement board · P4 ChatGPT adversarial (PASS WITH NOTES) · P5 final board · P6 brief clarity review (14 edits applied; 0.016em transcription error corrected to board's 0.015em) · P7 site design · P8 site adversarial (BUILD WITH FIXES). Cadence: one review round per decision, held throughout.

BRAND-P9 production intake and license boundary (`f650fa4`); site icons and avatar exports (`6bce7af`). Delivered icon geometry preserved; lockup omitted at intake. Reading-route JavaScript budgets remain 36.29 KiB with unchanged chunk hashes.

## Candidate retro-log entries (for the essay pipeline, not action items)

- Multi-model design review: blind head-to-head + cold read → convergence on bracket territory; ChatGPT's caret kill (construction misread) caught what the originating model missed.
- Stale-context failure: reviewer tried to reopen a closed decision (wordmark) it hadn't been told about — closed-decision lists must travel with every cross-model prompt.
- Review-found contrast failures converted directly into permanent CI regression fixtures (failure→system).

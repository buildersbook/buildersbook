# Design Build Notes — Adversarial Review Triage

**Source:** Cross-model adversarial review of the site design (BRAND-P8, 2026-08-25). Verdict: BUILD WITH FIXES. Zero design blockers; all findings are execution scope.
**Status of the design:** DESIGN-P1 reopened the functional-text floor and dark palette on production evidence, 2026-09-07. The operator reviews the result on production while the site remains unannounced. All other design decisions remain closed. The mockup archive in `design/reference/` is the value source; this file is the correction layer on top of it. Where the two disagree, this file wins.
**How to read this:** Every original finding is assigned to the task packet that owns it. The DESIGN-P1 / DESIGN-P1.1 corrections below supersede the original type-floor and dark-palette values. UX-P1 implements the reader-review fixes within the closed design.

---

## Token-file corrections (TP-002 — apply when creating the token file)

The token file is seeded from the mockup CSS, then corrected as follows:

1. **Accent usage rule (design-level, closed):** in light mode, `--accent` (#C9503C) is **non-text only** — underlines, cursor blocks, rules, position markers, focus indicators. It fails AA for normal text (4.10:1) but passes non-text contrast (3:1). Accent-colored *words* are permitted in dark mode only (#E06A50 passes at 5.4693:1 on the DESIGN-P1.1 paper), but for consistency the default is: text is always `--ink` or `--ink-muted` in both modes. **Delete the "hover text turns accent" behavior** — hover state is underline weight/offset change instead.
2. **New tokens** for rendered values the mockup used without declaring:
   - `--code-muted: #9A9485` (light), `#979797` (dark, DESIGN-P1.1) — code-block metadata. Never substitute light `--ink-muted` here (2.89:1 on light code-bg, fails). Metadata passes at 5.4025:1 on light code-bg and 6.5624:1 on dark code-bg.
   - `--ink-secondary: #444136` (light) — secondary human text (subtitles, standfirst).
   - `--rule-strong: #C9C5B8` (light) — stronger borders where `--rule` is too faint.
   - Reconcile `--surface`: either use it for the chrome strips the mockup painted #E3E1D9, or redefine it to #E3E1D9. One value, one name.
   - DESIGN-P1.1 dark paper is neutral `#161616`, superseding DESIGN-P1's warm charcoal. Dark `--ink: #D6D6D3` gives body contrast 12.4248:1, within the 11:1–12.5:1 reading range. Dark `--ink-muted: #979797` and `--ink-secondary: #B1B1B1` pass normal-text contrast on paper (6.1953:1 and 8.4390:1) and `--surface: #1F1F1F` (5.6430:1 and 7.6867:1); ink on surface is 11.3171:1. Light colors are unchanged.
   - DESIGN-P1.1 decorative dark rules match their light equivalents against paper: `--rule: #2E2E2E` is 1.3326:1 (light 1.3328:1); `--rule-strong: #3A3A3A` is 1.5909:1 (light 1.5838:1). These rules have no 3:1 minimum: §13 makes them decorative, never the sole indicator. The contrast fixture allows a 0.02:1 difference from the corresponding light rule.
3. **Code-block contrast (DESIGN-P1.1 / UX-P1):** dark `--code-bg: #0F0F0F` has only 1.0593:1 contrast against dark paper. The border uses dark `--ink-muted: #979797`, passing the 3:1 boundary requirement on both sides: 6.1953:1 against paper and 6.5624:1 against code-bg. Dark `--code-ink: #D3D3D3` passes at 12.8048:1 on code-bg. In light mode, `--code-ink: #E8E4D8` on `--code-bg: #21201A` is 12.8442:1; `--code-muted: #9A9485` is 5.4025:1. UX-P1 applies code ink to Shiki spans as well as the block: Shiki's light text assumed a light background and made the template unreadable. The fixture roles cover code text, metadata, and the inverse copied-feedback pair, all at least 4.5:1. Dark accent focus indicators pass on paper (5.4693:1), surface (4.9817:1), and code-bg (5.7934:1); light equivalents are 4.1016:1, 3.4151:1, and 3.6513:1. Decorative rules are not boundary substitutes.
4. **Metadata floor (DESIGN-P1; preserved by DESIGN-P1.1):** the functional-text gate is 12px. Kickers, dates, metadata, marginalia labels, and code-block metadata use `--label-size: 0.8125rem` (13px) at weight 500; this generalizes the existing 13px header label token. Marginalia *prose* uses `--marginalia-prose-size: 0.875rem` (14px). Heading anchors and footnote references keep their relative scaling with a 13px minimum. Body (19px desktop), headings, header navigation (13px), layout, and font families are unchanged.
5. **Muted-on-surface check:** `--ink-muted` on the #E3E1D9 surface is 4.31:1 — borderline. Don't put muted functional text on surface strips; use `--ink` there.

## Layout & component rules (TP-002)

6. **Desktop shell arithmetic:** content shell ≥ 912px (40 + 620 + 44 + 168 + 40). Columns must not flex-shrink above the mobile breakpoint; the 620px measure and 168px marginalia are fixed until the fold.
7. **Marginalia architecture:** notes anchor to content blocks in a shared CSS grid — never fixed pixel offsets. Adjacent notes stack without overlap. DOM position stays in logical reading order so mobile folding lands notes at the right point (mockup's inline-fold behavior is the spec).
8. **Defensive wrapping:** `overflow-wrap: anywhere` on titles; no line clamps or fixed title heights. Test at 390px, 320px, and 200% zoom.
9. **Code blocks:** `overflow-x: auto`; overflowing `<pre>` is keyboard-focusable with visible focus; filename in the header shrinks/wraps rather than colliding with the copy control.
10. **Index rows:** book title column is `minmax(0, 1fr)`, titles wrap; below the narrow breakpoint, status moves under the title. Number, title, state remain one logical row. Essay rows use a flexible title and fixed date/status columns; dates do not wrap. Below 40rem, essay metadata stacks beneath the title. Only published essays appear on the public index; book planned-row behavior is unchanged (UX-P1).
11. **Heading system:** define h3 and h4 (size, spacing, anchor-link behavior, mobile scale). Authors never skip levels; the CI heading-hierarchy check enforces it (see TP-003).
12. **Footnotes/citations component:** semantic footnote refs + endnotes, bidirectional links, keyboard focus, target highlighting, long-URL wrapping, both modes. Must exist in the scaffold; no essay with formal citations ships before it does (essay #1 cites via inline links and is unaffected).
13. **Required states:** 404 page (recovery links to Home/Book/Essays, header + skip link intact); accessible code-copy button (default/copied/failed); skip-to-content as first focusable; `:focus-visible` treatment (accent-based — rules are decorative-only and never the sole indicator) on every interactive element; mobile menu with defined open/close, focus trap, Escape, and focus return; theme toggle with accessible name, current-state indication, system default, persisted choice.
   - **Mobile header controls (UX-P1 F2/F7/F11):** below the 57rem fold breakpoint only, Search and theme controls use 20px inline SVG strokes in `currentColor`; desktop keeps its text labels. Accessible names are “Search” and “Switch to light mode” / “Switch to dark mode”. Every header control has a minimum 44×44 CSS px hit area while preserving label size and the 65px header height. The mobile brand mark uses one 24px token; desktop stays unchanged.
   - **Sticky-header clearance (UX-P1 F3):** `html` scroll padding uses `--header-height`; headings, anchor targets, and focusable reading controls add scroll margin for focus outlines. Reverse keyboard navigation must leave the focused link fully visible below the header.
   - **Prose links (UX-P1 F4):** essay and book prose links retain an accent-colored underline at rest; text remains ink. Hover and keyboard focus increase underline thickness and offset. Navigation and cards keep their existing affordance rules.
   - **Dialog focus (UX-P1 F2/F6/F10):** the mobile menu opens with programmatic focus on its panel (`tabindex="-1"`), without an entry ring on touch; links and controls retain keyboard focus indicators. Tab / Shift+Tab wrap inside the menu, Escape closes it, and focus returns to Menu. The open Menu underline stays visible. The menu includes Search, opening the same dialog as the header. Escape, backdrop, and Close restore the search opener; search launched from the menu reopens that menu and focuses its Search item.
14. **Draft-chapter behavior:** published = link; planned = non-link text; repo-visible draft = explicit link to the repository. Never an empty indexable chapter page.

## CI gates (TP-003 — add to the gate list)

15. **No-raw-values lint:** build fails on hex colors, arbitrary Tailwind values (`text-[#...]`), or `font-family` outside the token file.
16. **Token contrast test:** automated check of the declared token pairs against their usage roles (normal text 4.5:1, large text 3:1, non-text 3:1) in both modes. The review's failing pairs are the regression fixture.
17. **Minimum-size check (DESIGN-P1):** no functional text below 12px. The shared label and marginalia-prose tokens have minima of 13px and 14px respectively. An 11px functional-label probe must fail the gate; 12px passes the general floor.
18. **Heading-hierarchy gate:** no skipped heading levels in content.

## Discovery layer (TP-004)

19. Draft/planned chapters excluded from sitemap and set noindex until published (pairs with #14).

## Explicitly deferred

- **Search:** already covered — FlexSearch is in the closed stack and ships at launch.
- **External-link affordance:** links open in the same tab by default; if any link ever opens a new tab, that is disclosed visibly and in the accessible name. No icon system needed at launch.

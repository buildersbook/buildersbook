# The Builder's Book — Development Plan

**Repo:** `buildersbook/buildersbook` (public)
**Governance:** LEAD-V v5 — SCOUT plans · IMPLEMENT is the sole writer · VERIFY propose-only · ADVERSARY cross-family, mandatory on sensitive scope
**Rule Zero:** The codebase is the only source of truth. This plan is Layer 2 state; verify claims against the repo before acting on them.
**Last updated:** 2026-09-05

---

## 0. Operating Constraints

1. **Bootstrapped.** This project is time-boxed alongside the operator's other work. Time-box all infrastructure.
2. **Cadence guardrails (closed):**
   - Max **two artifacts in progress** at any time, across both tracks.
   - **One public artifact per two private ones.**
   - Nothing expands unless it changes a **decision, capability, or portfolio signal**.
3. **Anti-fortress rule:** one review round per decision; converged decisions are closed; content ships before polish.
4. **Minimum viable launch (closed):** scaffold + frontmatter validation + landing + about + **essay #1** + llms.txt + sitemap. Flip quiet; announce at the operator's launch-readiness gate. Everything beyond this trails content — never the reverse.
5. **Identity:** the org owns the repo; all commits are authored from the personal account via a repo-local git identity pin. The private scanner runs on `pre-push`, not `pre-commit`, and stays outside CI by design. First-commit attribution is permanent.
6. **Hosting:** production on Vercel, Git auto-deploy from main.
7. **Private identity material is never committed.** The identity register lives outside all repos. Its public counterpart is the `/accounts` page.

---

## 1. Tracks

| Track | Produces | Ships via |
|---|---|---|
| **Site** | Scaffold, CI content gates, discovery layer, deploy | Task Packets, IMPLEMENT sessions |
| **Content** | Essays, LEAD-V public release, MCP server | Task Packets; ADVERSARY on sensitive scope |
| **Brand** (parallel, non-blocking) | Wordmark + favicon at launch; full logo later | Time-boxed; never blocks a phase exit |

---

## 2. Phases

### Phase 0 — Bootstrap ✅ COMPLETE (2026-08-24)

Repo created under the org with repo-local identity pin; LEAD-V v5 selectively installed (14 files) and customized; governing documents committed.

**Exit condition (met):** repo exists with plan and PROJECT_STATE.md committed from the personal account.

---

### Phase 1 — Site Scaffold

**Track:** Site
**Artifacts:** TP-002 (scaffold), TP-003 (CI gates), TP-004 (discovery layer)
**Feature Brief:** FB-01 — constrained MDX dialect

1. Fumadocs on Next.js App Router, local MDX, FlexSearch, TypeScript, pnpm.
2. **Typed `book` and `essays` collections** — distinct schemas/renderers, shared content registry + link validator.
3. **Constrained MDX dialect** (FB-01): component allowlist with Markdown fallbacks; no arbitrary imports/exports/inline JS. CI validates rendered HTML AND processed `.md` exports.
4. **Locale contract now, translations later** — `contentId`, `locale`, `translationOf`, `sourceRevision`, `translationStatus` frontmatter; unprefixed English URLs; no fallback-language publishing.
5. **Discovery layer** — truthful-lastmod sitemap, RSS/Atom for essays, canonicals, Article/BreadcrumbList JSON-LD, explicit crawler allowances (Googlebot, Bingbot, OAI-SearchBot, PerplexityBot), IndexNow on deploy. llms.txt / llms-full.txt / per-page `.md` via Fumadocs native generation, treated as supplemental alternates (noindex X-Robots-Tag, HTML canonical) — an affordance for agents, not an SEO strategy.
6. **CI content gates:** fail on broken internal links, orphan pages, missing descriptions, duplicate slugs, bad prerequisite refs.
7. **CI performance budget:** <100 KiB compressed first-party JS on reading pages is a hard build gate. Lighthouse reports LCP ≤2.5s and CLS ≤0.1, with TBT ≤200ms as a lab interaction proxy; these timing thresholds are report-only. Lighthouse does not measure field INP (F-5 disposition).
8. Landing + about pages (typography-only wordmark from Brand track).
9. Measurement: Google Search Console + Bing Webmaster Tools (AI Performance dashboard) verified.
10. Offline: the Phase 1 versioned Markdown ZIP in GitHub Releases is explicitly deferred until after the public flip. Also deferred: sharded search, EPUB, PWA.

**Exit condition:** all CI gates pass on main; landing and about live in production at https://buildersbook.dev (Cloudflare DNS, HTTPS resolving); sitemap and llms.txt resolve; a sample page in each collection renders from validated frontmatter; JS budget passes. Site goes live quietly at this point — deployed but unannounced.

---

### Phase 2 — Essay #1 → Public Launch

**Track:** Content
**Artifacts:** TP-005

- **Essay #1: "We Built Agent Enforcement Hooks and Then Killed Them."** Structure: claim → project evidence → counterexample → operating rule → template. Fallback: "Same-Family Blind Spot" (Failure 10).
- Repo flips public.
- One review round max, then publish.
- Announce on X, Bluesky, Dev.to, Reddit (brand handles) and Hacker News (personal handle).

**Exit condition (met):** essay #1 publicly readable, present in RSS and sitemap; repo public, unannounced — announcement deferred to the gate. **Minimum Viable Launch complete.**

---

### Phase 3 — LEAD-V Public Release

**Track:** Content
**Artifacts:** TP-006 (sanitization) · TP-007 (orphaned tests) · TP-009 (adoptions) · TP-010 (public repo + announce essay) · TP-013 (framework drift fixes)
**Feature Briefs:** FB-03 — installable-skill distribution
**⚠ ADVERSARY mandatory:** TP-006 and TP-010.

**Closed 2026-08-26:** a private framework layer ships in no public artifact — out of public scope, excluded at sanitization.

**Repo shape (closed):** fresh public repo `buildersbook/lead-v` initialized from a sanitized snapshot; the private framework repo is archived read-only. Commit-level audit trail preserved as a curated `VERSION-HISTORY.md`.

1. **Sanitization pass** (~23 files): labeling passes; genericize or exclude a project-specific example; exclude `archive/`; reset PROJECT_STATE.md and in-flight task packets.
2. **Rule Zero fix:** remove/archive `tests/lead_enforce/` (7 orphaned Python test files for the retired hook mechanism) with the retirement note.
3. **Framework drift fixes (TP-013)** — found during this project's install, all release blockers:
   - The scaffold command declares v4.0 while the framework declares v5.0, and it omits the v5 `/retro` command. A public framework whose installer trails its docs is not shippable.
   - Install-path references disagree: one root file expects `roles/` and `workflow/` at project root, another points at `lead-framework/workflow/...`.
   - No git tag for v5.0 — latest tag is v4.0.2. Tag the release.
4. **Adoptions (FB-03, TP-009):** installable-skill distribution, à-la-carte Task Packets + ADVERSARY pattern, CONTEXT.md shared-language layer, gated diagnosis loop, grilling step before FEATURE-BRIEF.
5. **README positioning:** state the contrast with composable-tactics repos explicitly — LEAD-V is a complete operating system for agent-driven production work.
6. **Gated input:** orchestration-framework landscape research. If returned, fold into 4–5; if not, proceed. One round, then ship.
7. **Announce essay.**

**Exit condition:** `buildersbook/lead-v` public with ADVERSARY sign-off on sanitization; orphaned tests removed; drift fixes shipped and v5 tagged; announce essay published; private repo archived.

---

### Phase 4 — MCP Server

**Track:** Content
**Artifacts:** TP-011 (server) · TP-012 (publish + announce)
**Feature Brief:** FB-04 — detection-layer scope (schema.org detection, NAP consistency, technical crawlability)
**⚠ ADVERSARY mandatory:** the proprietary boundary. Detection layer only — no weighted scoring, category architecture, or benchmarking logic from the operator's private work.

Begins after Phase 3's announce essay ships.

The server's README cross-links the site and the public framework repo.

**Exit condition:** package installable from npm under the org scope; listed in the MCP registry; ADVERSARY sign-off on the proprietary boundary; announce essay live.

---

### Ongoing — Essay Pipeline

Sources: `failure-modes.md` (11 documented failures), `retro-log.md`, task packets, version history. Extract from evidence; never write generic instruction.

1. Same-Family Blind Spot (Failure 10)
2. LEAD-V release announce (Phase 3)
3. MCP server announce (Phase 4)
4. Further extractions as evidence permits

Each essay is a Task Packet and counts against the two-artifact WIP cap.

---

### Parallel — Brand Track

- **At launch:** typography-only wordmark + favicon. That is the entire launch requirement.
- **Alongside content:** direction brief → AI prototypes for exploration → human designer finalization. Constraints: 16px favicon legible, monochrome-capable, dark/light variants, no gradient-heavy AI look; motif territory = book/block/layers, not robots or sparkles.
- If it competes with a content artifact for the WIP cap, content wins.
- Downstream: replace placeholder avatars, publish `/accounts`, emit `sameAs` JSON-LD.

---

## 3. LEAD-V Artifact Index

| ID | Artifact | Phase | ADVERSARY |
|---|---|---|---|
| TP-001 | Repo bootstrap | 0 ✅ | — |
| TP-002 | Fumadocs scaffold + collections — includes design-token file seeded from `design/reference/` per `DESIGN-BUILD-NOTES.md` §1–5, and layout/component/state requirements per §6–14. Build notes override mockup values on conflict. Note: mockup CSS is inline `style=""` attributes plus a rendered token table, not a `<style>` block. | 1 | — |
| TP-003 | CI content gates + perf budget — plus the four design-review CI gates per `DESIGN-BUILD-NOTES.md` §15–18 (no-raw-values lint, token contrast test with review failures as regression fixtures, 11px functional floor, heading hierarchy). | 1 | — |
| TP-004 | Discovery layer — plus draft/planned-chapter noindex + sitemap exclusion per `DESIGN-BUILD-NOTES.md` §19. | 1 | — |
| TP-005 | Essay #1 | 2 | — |
| TP-006 | LEAD-V sanitization | 3 | **Yes** |
| TP-007 | Orphaned-tests fix | 3 | — |
| TP-009 | Adoptions | 3 | — |
| TP-010 | Public repo + announce | 3 | **Yes** |
| TP-011 | MCP server | 4 | **Yes** |
| TP-012 | npm publish + announce | 4 | — |
| TP-013 | Framework drift fixes | 3 | — |
| FB-01 | Constrained MDX dialect | 1 | — |
| FB-03 | Installable-skill distribution | 3 | — |
| FB-04 | MCP detection-layer scope | 4 | **Yes** |

---

## 4. Open Items

- [ ] Orchestration-framework landscape research: gated input to TP-009, one round.
- [ ] Reserved-handle recheck on/after 2026-09-23 (brand track).
- [ ] Framework rename (decided in principle, name open): collision checks (npm/GitHub/trademark) then close at Phase 3 kickoff; rename + sanitization execute as one pass before TP-006.
- [x] Private-identifier manifest: 31 nonblank entries confirmed during ESSAY-P3. The scanner runs locally on pre-push and remains outside CI by design; an empty or whitespace-only manifest fails closed (`59d439d`).

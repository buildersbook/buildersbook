# Production intake — BRAND-P9

## Canonical icon

The delivered icon is canonical. Normalizing polygon and path vertices, removing duplicate and collinear vertices, and comparing closed contours independently of their start point and winding gives **MISMATCH** between the earlier production master and the delivery. The cursor is identical; both covers differ. The delivered geometry was selected without further changes.

Sanitization converts polygons to filled paths, removes redundant collinear vertices and editor data, and preserves the viewBox `0 0 60.5 57.7` and coordinate precision. The canonical SVG uses `fill="currentColor"` as specified for production intake; its standalone default is black. Its three closed paths reproduce the delivered contours exactly. No text, raster content, external references, comments, or identifying metadata is retained.

## Designer’s optical correction — original → final

All measurements are in the shared icon coordinate system. “Original” means the earlier production master; “final” means the delivered icon now used by the site.

| Measurement | Original | Final |
|---|---:|---:|
| Left cover outer edge, x | 10.6 | 11.1 |
| Left cover inner spine edge, x | 19.0 | 19.5 |
| Left cover terminal tips, x | 23.8 | 24.4 |
| Left cover total width | 13.2 | 13.3 |
| Left spine width | 8.4 | 8.4 |
| Left terminal extension | 4.8 | 4.9 |
| Right cover terminal tips, x | 37.0 | 36.4 |
| Right cover inner spine edge, x | 41.8 | 41.2 |
| Right cover outer edge, x | 50.2 | 49.7 |
| Right cover total width | 13.2 | 13.3 |
| Right spine width | 8.4 | 8.5 |
| Right terminal extension | 4.8 | 4.8 |
| Visible glyph width | 39.6 | 38.6 |
| Left terminal-to-cursor clearance | 2.4 | 1.8 |
| Right terminal-to-cursor clearance | 2.4 | 1.8 |
| Left spine-to-cursor clearance through cursor body | 7.2 | 6.7 |
| Right spine-to-cursor clearance through cursor body | 7.2 | 6.6 |

Vertical coordinates are unchanged: covers span y=10.4–49.0, inner terminal edges are y=17.6 and 41.8, and terminal thickness is 7.2. The cursor remains x=26.2–34.6, y=16.5–43.0, width 8.4 and height 26.5. The final visible glyph bounds are x=11.1–49.7 and y=10.4–49.0: 38.6 × 38.6.

## Open designer item — lockup gap

The delivered lockup was rejected and `lockup.svg` is omitted. At the delivered scale, the icon’s right edge is x=49.7 and the outlined text starts at x=56.9. The gap is **7.2 units / 8.4 = 0.857 cursor widths**, versus the required **3.0 cursor widths = 25.2 units**. No lockup geometry was altered. A corrected delivery remains open for future archive and social-card use; the site uses the icon only and its header remains live text.

## Export specification

- The 16px ICO frame uses the archived board’s integer pixel grid: left spine `(1,2,2,12)`, left terminals `(3,2,2,2)` and `(3,12,2,2)`, mirrored right spine `(13,2,2,12)` and terminals `(11,2,2,2)` and `(11,12,2,2)`, and cursor `(7,4,2,8)`. Tuples are x, y, width, height.
- The 32px ICO frame follows the board’s illustration: each coordinate and dimension in the 16px grid is doubled, without interpolation. Both small frames use transparent backgrounds and token-derived light ink.
- The 48px ICO frame is rasterized from the canonical vector, preserving the source artboard and aspect ratio inside a square transparent canvas.
- The adaptive SVG preserves the canonical viewBox and paths. Its light/dark ink colors are generated from `styles/tokens.css`, selected by `prefers-color-scheme`.
- Apple (180px) and manifest (192px, 512px) icons use opaque light paper and ink from the token file. Their centered visible glyph occupies 62% of the square, leaving room for device crops. Manifest background and theme colors use light paper.
- Light and dark avatars at 400px, 800px, and 1024px use the corresponding paper/ink tokens. Their visible glyph width and height are exactly 62% of the canvas before rasterization, centered independently of the source artboard. Square backgrounds support circular profile crops; no rounded container is drawn.
- Run `pnpm brand:export` to regenerate site assets. The optional `--avatars-dir` argument accepts an absolute output directory outside the repository. Sharp is pinned as a development dependency; generated assets require no browser JavaScript.

The archived board supplies the small favicon grids and visible-glyph crop rule. Intake measurements and the approved 48px vector rasterization supply the remaining export inputs.

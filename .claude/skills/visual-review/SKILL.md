---
name: visual-review
description: Screenshot and visually judge UI quality (clean, easy, polished) with a strict checklist; PASS/FAIL with defects.
---

# Capture
Playwright, screenshots at 1440×900 and 390×844, `deviceScaleFactor: 2`, one per screen/state (default, hover/focus, open overlay, empty, error, long content). Save to `tests/screenshots/<feature>/`. Then Read the images and look.

# Checklist (any miss = defect)
- **Hierarchy**: one clear focal point; primary action obvious; headings > body > meta.
- **Layout**: aligned edges, consistent grid, no overlap, no horizontal scroll.
- **Spacing**: consistent rhythm from tokens; nothing cramped, nothing floating.
- **Typography**: ≤ 3 sizes per view, readable line length, no orphaned wraps.
- **Colour & contrast**: tokens only, WCAG AA text, colour not the sole signal.
- **Clipping/truncation**: no cut-off text, icons, shadows or drawers.
- **Density**: not cluttered; whitespace used on purpose.
- **Consistency**: matches sibling screens (tables, modals, chips, buttons identical).
- **States**: empty/error/loading look designed, not default.
- **Polish**: crisp borders/radii/shadows, icons same weight, no stray debug text.

# Output
**Verdict: PASS | FAIL**, then numbered defects: screenshot · region · problem · expected. Zero tolerance: "okay-ish" is FAIL.

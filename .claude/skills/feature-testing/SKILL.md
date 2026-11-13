---
name: feature-testing
description: Functionally test a running UI end to end with Playwright — every control, flow, loop and cross-feature connection.
---

# Setup
Serve the prototype: `python3 -m http.server 8765` (background) → `http://localhost:8765/<file>.html`. Playwright is pre-installed: `const { chromium } = require('playwright')`; launch with no options. Save specs under `tests/<feature>/` and use `--trace off`.

# Coverage matrix
1. **Controls**: every button, tab, toggle, input, menu, link.
2. **Flows**: happy path start→finish.
3. **Loops**: forward/back/repeat; open→close→reopen; cancel mid-flow; switch tabs/agents and return; refresh; do the same action twice.
4. **Connections**: action in A is reflected in B (counts, lists, badges, drawers, linked pages). Check both directions; look for orphans.
5. **Edge cases**: empty, very long text, many items, invalid input, rapid double-click, error states.
6. **Health**: capture `console` errors, `pageerror`, failed requests.

# Output
Table of scenarios → PASS/FAIL, repro steps and observed vs expected for each failure, test file paths. Only report what you actually ran and observed.

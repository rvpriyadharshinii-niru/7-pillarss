---
name: requirements-check
description: Verify a requirement is actually solved: decompose into acceptance criteria and check each against evidence.
---

# Procedure
1. Quote the requirement verbatim.
2. Decompose into atomic criteria (R1, R2…), including implied ones ("must be discoverable", "works with existing data").
3. For each: locate evidence (file:line, screenshot, test run). Mark **PASS / PARTIAL / MISSING / EXTRA**.
4. Outcome check: could the intended user achieve their goal unaided? If not, not solved even if every box is ticked.
5. Flag scope creep (EXTRA) and regressions to adjacent features.

# Output
| ID | Requirement | Status | Evidence | Needed to close |
Then: **Verdict: SOLVED | NOT SOLVED** + prioritised gap list.

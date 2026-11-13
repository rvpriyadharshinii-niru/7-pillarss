---
name: team-orchestration
description: How the Main Agent runs the 7-agent UI team — pipeline order, hand-offs, quality gates and the report format for the user.
---

# Team pipeline

| # | Agent | Input | Output |
|---|-------|-------|--------|
| 1 | ux-ui-designer | user requirement (verbatim) | `docs/specs/<feature>.md` |
| 2 | design-system-manager | spec | reuse list + new component definitions in `docs/design-system/` |
| 3 | ui-developer | spec + registry | working UI |
| 4 | feature-tester | running UI + spec | functional report |
| 5 | visual-tester | running UI | visual verdict + defects |
| 6 | product-manager | requirement + UI | SOLVED / NOT SOLVED |

Steps 4–6 may run in parallel. Any FAIL goes back to the owner (functional → ui-developer; visual → ui-developer/design-system-manager; gap → designer or developer) and the failed gates re-run.

## Gates
Ship only when feature-tester = all pass, visual-tester = PASS, product-manager = SOLVED. Max 3 loops per issue, then escalate to the user.

## Delegation tips
Give each agent: the verbatim requirement, paths to prior outputs, and the exact deliverable. Small tweak? Skip designer/DS steps only if no new UI pattern or component is involved — say so in the report.

## Report to user
1. Outcome (one sentence). 2. What changed (files, user-visible). 3. Gate results (3 lines). 4. Open items/decisions needing the user. Plain language, no transcripts.

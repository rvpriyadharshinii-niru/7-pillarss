---
name: ui-development
description: Implement UI components with complete state and behaviour, built on the shared design system and tokens. Use for any build/fix of screens, tables, modals, tabs, chips.
---

# Build checklist
1. Read the spec (`docs/specs/`) and `docs/design-system/REGISTRY.md`. Use registered components + tokens only.
2. Structure semantic HTML first; style via tokens/classes, no inline one-offs.
3. State: define what is local vs shared; handle empty/loading/error/success/disabled.
4. Behaviour: every control does something; keyboard (Tab/Enter/Esc/arrows) works; focus moves sensibly on open/close of drawers/modals; Esc closes overlays.
5. Resilience: long text truncates with title/tooltip, narrow widths reflow, no layout shift on load.
6. No console errors; no dead links/buttons; no placeholder text.
7. Self-test in a browser (Playwright) before handing off.

# Escalate
Spec ambiguity or friction → designer. Missing/duplicate component → design-system-manager. Never invent a private variant.

# Handoff note
Files changed · components used/added · states covered · deviations + reason.

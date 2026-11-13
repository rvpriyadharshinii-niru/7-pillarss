---
name: design-system-management
description: Centralise UI into a shared component library with tokens; audit for duplication; keep the component registry accurate.
---

# Artifacts
- `docs/design-system/REGISTRY.md` — one entry per component: name, purpose, variants, states, API/props, usage example, where used.
- `docs/design-system/tokens.md` — colour (primary `#4F46E5`, nav `#1A1F2E`, greys…), type scale, spacing scale, radius, shadow, z-index.

# Workflow
1. **Audit** the codebase (`grep` class names/markup) for repeated patterns: buttons, chips, tables, modals, drawers, tabs, cards, inputs, empty states, toasts.
2. **Decide**: reuse → name the component. Missing → define it (API + states) first.
3. **Extract**: create the single shared implementation; migrate every call site; delete the copies.
4. **Tokenise**: replace hard-coded colour/size/font values with tokens.
5. **Register**: update REGISTRY.md in the same change.

# Rules
Same job ⇒ same component. Variants via props, not copies. No component without a registry entry. Naming: noun-based, consistent. A new component needs ≥ 2 expected uses or a clear core-pattern role.

# Report
Reused · Added · Consolidated (N duplicates removed) · Violations found.

---
name: ux-ui-design
description: Produce a friction-free UX/UI spec grounded in familiar real-world patterns; deep-dive method for genuinely new interactions. Use for any new screen, flow or interaction change.
---

# Method

1. **User & goal** — who, what they want, in what context, what "done" feels like.
2. **Pattern match** — list 2–3 real-world patterns users already know that fit (e.g. inbox list+detail, shopping cart, kanban, wizard, command palette, settings page, spreadsheet). Pick one; state why. Mirror its conventions (placement, labels, icons, gestures) — don't reinvent.
3. **Novel parts** — for anything with no familiar pattern:
   - Define the concept in one plain sentence.
   - Find the nearest metaphor; where it breaks, say how the UI covers the gap.
   - Specify how it teaches itself (label, hint, empty state, example, progressive disclosure).
   - Write a 3-question comprehension check ("what do you expect happens if you click X?") to validate with the user/main agent before build.
4. **Flow** — numbered steps from entry to goal. Count clicks/decisions; minimise both.
5. **States** — empty, loading, partial, error (with recovery), success, disabled, long/overflow content.
6. **Copy** — exact labels, button text (verbs), errors (what happened + what to do), empty-state text.
7. **Friction audit** — go through every step and ask: Is the next action obvious? Is any info required that the app already knows? Any dead end, confirm-for-nothing, hidden control, jargon, modal-on-modal, lost state? Remove each; log removals.
8. **Components** — map every element to a registry component; list new ones needed.
9. **Accessibility** — keyboard order, focus, contrast, hit targets ≥ 40px, labels.

# Spec template (`docs/specs/<feature>.md`)
Goal · Pattern borrowed · Flow · States · Copy · Components (existing / new) · Friction removed · Open questions.

# Zero-friction rules
Defaults over questions. One primary action per view. Reversible over confirm. Inline over modal. Visible over hidden. Familiar over clever.

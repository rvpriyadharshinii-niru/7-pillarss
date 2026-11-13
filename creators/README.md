# Creators — redesigned prototype

The Creators feature from Adam's prototype, re-skinned with a standard design system (shadcn/ui-style: Tailwind slate neutrals, blue primary, Inter). **Logic and navigation are unchanged; only the visual layer is new.** Primary rail, secondary nav and the framed content area are kept as in the original.

Open `index.html` in a browser (single self-contained file; Inter loads from Google Fonts).

## Layout
- `src/app.js` — all prototype logic (from the original; colours/sizes remapped to the design system)
- `src/shell.html` — rail + side nav + app frame markup
- `src/tokens.css` — generated design tokens (`tools/gen-tokens.js`)
- `src/legacy.css` — GENERATED from the original CSS by `tools/transform-css.js` (layout kept, visuals replaced by tokens). Do not hand-edit.
- `src/ds.css` — design-system component layer (`@layer ds`)
- `src/areas/*.css` — page-specific polish (`@layer area`)
- `src/chrome.css` — rail / side-nav / frame, verbatim from the original (`@layer chrome`)
- `reference/` — the original prototype for parity checks

## Build
```bash
npm install
node tools/build.js            # -> index.html   (OUT=path to write elsewhere)
node tools/shots.js out/       # screenshots of every main page (HTML=path to test another build)
```
Cascade order: `legacy < ds < area < chrome`.

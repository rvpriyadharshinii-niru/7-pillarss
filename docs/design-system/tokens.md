# Design tokens

Source of truth: `creators/tools/gen-tokens.js` (palette in `creators/tools/palette.js`) which generates
`creators/src/tokens.css`. Never edit `tokens.css` by hand; add a token to the generator and re-run
`node tools/gen-tokens.js`. Style: shadcn/ui-like (Tailwind slate neutrals, blue primary, Inter).
CSS rules in `ds.css` and `areas/*.css` use tokens only (no raw hex). The two `[style*="#1e40af"]`
selectors in `areas/campaigns.css` are the only hex strings left and they *match* legacy inline values.

## Palette (Tailwind steps)

Each family has steps `50 100 200 300 400 500 600 700 800 900` (slate also has `950`), used as `var(--<family>-<step>)`.

| Family | Role | Anchor steps |
|---|---|---|
| `slate` | neutrals: text, borders, surfaces | 50 muted surface · 100 hairline/track · 200 border · 300 strong border · 400 icon · 500 muted text (min. contrast on white) · 600 secondary text · 700 body-strong · 900 foreground · 950 scrim base |
| `blue` | primary + info | 600 primary · 700 hover/active text · 50 tint · 200 tint border |
| `green` | success / ok | 50 bg · 200 border · 700 text · 500/600 fills |
| `amber` | warning | 50 bg · 200 border · 700 text · 500 fill |
| `red` | destructive / bad | 50 bg · 200 border · 600 text/icon · 700 chip text |
| `violet`, `sky` | chart series, secondary accents | 500 series colour |
| `pink`, `orange` | avatar/chart accents only | 500 |

Chart series order: `blue-600`, `sky-500`, `violet-500`, `amber-500`, `green-500`, `slate-400`.
Tone triplet for chips/notes: **50 background / 200 border / 700 text** of the family.

## Semantic tokens

| Token | Value |
|---|---|
| `--background`, `--card`, `--surface` | `#fff` (page, card, dialog surface) |
| `--surface-muted` | `slate-50` |
| `--foreground`, `--card-foreground` | `slate-900` |
| `--muted-foreground` | `slate-500` |
| `--muted-surface`, `--secondary`, `--accent` | `slate-100` |
| `--border`, `--input` | `slate-200` |
| `--ring` | `blue-500` |
| `--ring-shadow` | `0 0 0 3px color-mix(ring 22%, transparent)` (focus ring on inputs, buttons, cards) |
| `--primary`, `--primary-hover`, `--primary-foreground`, `--primary-soft` | `blue-600`, `blue-700`, `#fff`, `blue-50` |
| `--destructive`, `--success`, `--warning` | `red-600`, `green-600`, `amber-600` |
| `--scrim` | `slate-950` @ 45% (dialog / drawer backdrop) |
| `--canvas` | `slate-100` (app frame backdrop) |
| `--font` | Inter, system fallbacks. `--font-mono` for code |

Legacy aliases kept so old rules resolve into the system: `--r-card` (= `--r-lg`), `--r-ctl` (= `--r-md`),
`--r-frame` (= `--r-xl`), `--shadow-pop` (= `--shadow-lg`).

## Type scale (Inter; weights 400 / 500 / 600 only)

| Token | Size | Use |
|---|---|---|
| `--fs-xs` | 12px | captions, meta, table headers, chips, axis/legend |
| `--fs-sm` | 13px | dense table text, small controls, menu rows |
| `--fs-base` | 14px | body, inputs, default buttons |
| `--fs-lg` | 16px | section / dialog / card titles (600, tracking -.01em) |
| `--fs-xl` | 20px | secondary KPI numbers (600) |
| `--fs-2xl` | 24px | page title (600, -.025em), primary KPI numbers |
| `--fs-3xl` | 30px | big KPI (spend total, gauge score) |

Numbers use `font-variant-numeric: tabular-nums`. No all-caps labels.

## Spacing (4px grid)

`--sp-1` 4 · `--sp-2` 8 · `--sp-3` 12 · `--sp-4` 16 · `--sp-5` 24 · `--sp-6` 32.
Page padding 32 (24 narrow); gap between sections 24; card padding 16 (tiles) or 20 (content cards).

## Control heights

`--control-h` 36px (default). `--control-h-sm` 32px (small buttons, icon buttons, filters, segmented control).
Toolbars (`.ds-toolbar`, `.ac-bar`, `.campl-tools`, `.dk-frow`, `.dk-ptools`, `.ana-bar`) set
`--control-h: var(--control-h-sm)` so every control inside is 32px without per-control rules.

## Radius

`--r-xs` 4 (checkbox) · `--r-sm` 6 (chips, small controls, menu rows) · `--r-md` 8 (buttons, inputs, menus, popovers) ·
`--r-lg` 12 (cards, tables, dialogs) · `--r-xl` 16 (app frame). Pills (999px) only for avatars, progress tracks, switches and status dots.

## Shadows

`--shadow-xs` cards, inputs, buttons · `--shadow-sm` raised/hover cards, active segment · `--shadow-md` menus and popovers ·
`--shadow-lg` dialogs, drawers, FAB, toast. No glows or gradients.

## Z-index (conventions in use)

Sticky table header 3, sticky first column 4-7, popovers 30-60 (`.ac-pop` 40, `.ac-cols-pop` 60), drawer scrim 85, modal backdrop 200.
Not yet tokenised.

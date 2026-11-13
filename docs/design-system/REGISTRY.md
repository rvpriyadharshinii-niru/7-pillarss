# Component Registry

Maintained by the design-system manager. Every shared pattern lives **once** in `creators/src/ds.css` (`@layer ds`,
tokens only, see `tokens.md`). Area files (`creators/src/areas/*.css`, `@layer area`) hold only page-specific layout.
Cascade: `legacy < ds < area < chrome`. Markup in `app.js` keeps its original class names; those names are the "hooks"
below, so a new screen reuses a component by using one of its hooks (or the canonical `ds-*` name) instead of restyling.

Rules: same job = same component. Variants are state/modifier classes, never copies. Before building new UI, find the row
below; if none fits, define the component here (hooks, variants, states) first, then add it to `ds.css`.

| Component | Purpose | Class hooks | Variants | States | Where used |
|---|---|---|---|---|---|
| Button | Action trigger, 36px (32px small) | `.ds-btn` `.btn` `.ac-btn` `.ds-dh-btn` `.pl-bulk-btn` `.bb-btn` `.ac-check` `.ac-link` `.col-btns button` `.myf-foot button` `.tip-f button` | `--primary` (`.btn.primary`, `.ac-btn--primary`), `--outline` (default look), `--ghost` (`.btn.ghost`, `.bb-clear`, `.ac-link`), `--danger` (`.bb-btn.is-danger`), `--sm`, icon: `.ds-btn--icon` `.ds-iconbtn` `.icon-btn` `.ds-dh-back` `.dk-per-step` `.tv-sync` `.myf-x` `.ftip` `.my-funnel` | hover, `.is-on`, `[disabled]` / `.is-disabled` (50%), `[hidden]` (display none, global rule at end of ds.css), focus-visible ring | every screen |
| Add-to menu trigger | Button that opens a menu | `.addto-menu>summary.ds-btn` (a `details.ds-more`) | as Button `--sm` | `[open]`, `.is-disabled` | Discover, My creators, bulk bar |
| Toolbar | Row of filters/search/buttons; forces 32px controls via `--control-h` | `.ds-toolbar` `.ac-bar` `.campl-tools` `.dk-frow` `.dk-ptools` `.ana-bar` | (placement/margins stay in the area file) | | Discover, My creators, tracker, campaigns, dashboard, analytics |
| Text input / select / textarea | Form fields (36px; 32px inside a toolbar) | `.ds-input` `.ds-select` `.ac-input` `.nl-input` `.ds-field *` `.field *` `.addn-area` `.cpm-q` `.myf-select` `.ps-costf input` `.ccs-f input/select` `.oe-m input` `.ana-date` `.ana-chk` `.modal.mk input/select/textarea` | search wrapper: `.ds-input-icon`, `.ds-toolbar .ds-input`, `.ac-bar .ds-search`; inline cell editor: `.ds-cell-input` `.my-select` | focus ring (`--ring-shadow`), placeholder slate-500, `:focus-within` on wrappers | dialogs, toolbars, tables |
| Filter pill | Dropdown trigger with checked/active state | `.ds-filter` (`.is-enh`) `.dk-per-trig` `.dk-cf-btn` | with clear `.ds-filter-x`; menu = Popover | `.is-active` / `.on` (primary-soft), `[aria-expanded]` | Discover, My creators, dashboard, campaign filters |
| Chip / badge / status | 24px, `--r-sm` status label | `.ds-chip` `.chip` `.ds-badge` `.pill` `.status` `.rel` `.life` `.health` `.pl-stage-pill` `.cdh-chip` `.trk-b` `.trk-st` `.ai-verdict` `.cons-pill` `.tier-tag` `.acct-pill` `.my-status` `.my-list-tag` `.col-pill` `.msd-st` `.cq-hstatus` `.ct-tag` `.pl-rv-chip` | tone by state class. ok: `--ok` `--success` `.chip.good` `.life--live` `.health.is-ok` `.trk-b--ok` `.my-status.is-shortlisted` `.ai-verdict.is-strong-fit` `.col-pill--live`; warn: `--warn` `.health.is-warn/-behind` `.pl-stage--approval` `.trk-b--warn` `.my-status.is-in-discussion` `.ai-verdict.is-consider`; bad: `--bad/--danger` `.health.is-over` `.pl-stage--rejected` `.trk-b--bad` `.my-status.is-rejected` `.ai-verdict.is-avoid`; info: `--info` `.rel` `.my-status.is-collaborated`; mute: `--mute` `.life--done` `.health.is-done` `.col-pill--off`. Count chips: `.ds-dh-chip` `.ds-count` `.ds-hcount`; `.ds-beta` | with leading dot `i` (`.life`, `.ai-verdict`) | tables, headers, drawers |
| Removable chip | Active filter value, 28px blue | `.ac-chip` (+ `.ac-x`, `.ac-clear`) | | hover on x | tracker filters |
| Choice chip | Toggleable option pill, 28px | `.disc-chip` `.myf-seg button` `.myf-chips button` `.lnch-chip` `.msd-chip` | | `.on` / `.is-on` (primary-soft) | Discover hero, advanced filters, create-campaign, quick view |
| Segmented control | Mutually exclusive view/metric switch | `.ds-seg` `.ds-viewseg` `.seg` `.ana-seg` `.ac-seg` `.dk-cseg` `.cw-radios` (`.cw-radio`) `.ccs-toggle` `.ps-tabs` (`.ps-tab`) | `.ds-viewseg` is icon-only 32px | `.on` / `.is-on` / `[aria-pressed=true]`, `input:checked+span` | views, charts, analytics, costing sheet, post sheet |
| Tabs (underline) | Page / dialog sections | `.ds-tabs` `.ds-tabrow` `.ds-dh-tabs` `.ac-tabs` `.cpm-tabs` (+ `.cpm-tab`) | | `.on` `.is-on` `[aria-selected=true]` | profile, plan, campaign, dialogs |
| Switch | Boolean toggle | `.ds-switch` `.ac-sw` (input + span) | | `:checked`, focus-visible | tracker column settings |
| Card | White surface, 1px border, `--r-lg`, `--shadow-xs` | `.ds-card` `.card` `.crm-card` `.ds-tile` `.ds-cc` `.rail-card` `.col-card` `.campl-card` `.cov-pipe` `.ana-card` `.ana-stat` `.oe-box` `.pl-hero-i` `.pl-rep-sec` `.ps-card` `.sd-card` `.sd-stat` `.ccs-panel` `.my-card` `.trk-sum` `.dk-ov` `.platform-card` `.summary` `.verdict` `.kpis5` `.ac-card` … | padding: 20 (`.col-card` `.campl-card` `.cov-pipe` `.oe-box` `.pl-rep-sec` `.dk-w` `.dw-cell>*`), 16 (tiles) | interactive hover (border slate-300 + `--shadow-sm`), `.is-done` | all |
| Option card | Selectable choice card/row | `.lnch-opt` `.lnch-goal` `.ccs-card` `.ccs-lk` `.col-mv-opt` `.bulkm-opt` | | hover, `.is-on` (primary border + soft fill) | create campaign, costing, move-to-campaign |
| Note / banner | Inline info or warning | `.ds-note` `.oe-banner` `.ac-note` | `--warn`; `.oe-warn` red | | dialogs, plans, content tracker |
| KPI / stat tile text | 12px muted label over 24px/600 number | label: `.ds-label` `.kpi-label` `.ds-ov-label` `.dk-ov-l` `.sd-stat-h` `.eyebrow`; value: `.ds-value` `.kpi-value` `.ds-ov-val` `.dk-ov-item b`; 20px: `.ds-value--md` `.sd-stat b` `.pl-hero-i b` `.ps-stat b`; 30px: `.ds-value--xl` `.sv-total` `.gauge-num`; sub: `.ds-sub` `.kpi-sub` | | | overview strips, summary tiles, profile |
| KPI overview | Collapsible card with stat cells | `.ds-overview` (+ `.ds-ov-grid` `.ds-ov-stat`), `.dk-acc.dk-ov` (+ `.dk-ov-cells` `.dk-ov-item`) | | `[open]`, `.is-on` cell | My creators, dashboard, campaign overview |
| Table | Header slate-50 12px muted, 13px rows, hairline rows, hover, sticky edges | `.ds-table` (+ `.ds-table-wrap`, `.my-table`, `.ac-table`, `.cp-table`), skins `.ana-table` `.ccs-tbl` `.oe-cmp`, profile `.table` | `.ds-table--dense`, numeric `.ds-num`, checkbox `.ds-cb`, sticky `.ds-sticky-l/-l2/-r`, group header `.ac-grp` (tracker only) | row hover, `.is-selected`, `.is-clickable`, empty `td.ds-empty` | Discover, My creators, campaigns, tracker, collections, dialogs |
| Person cell / avatar | Avatar + name + meta | `.ds-person` `.ds-person-text` `.ds-who` `.ds-avatar` `.ds-namebtn` `.ds-table-title` `.ds-table-meta` | stack: `.ds-avatar-stack` `.col-stack` (+ `.ds-avatar-more` `.col-more-n`) | | tables, cards, drawers |
| Pager | Table pagination | `.ds-pager` `.ds-pager-nav` `.ds-pg` | | `.on` current, `:disabled` | campaigns list, My creators |
| Popover / menu | Floating surface + option rows | surface: `.ds-more-menu` `.ac-pop` `.ds-menu` `.ds-add-menu` `.dk-per-panel` `.dk-cf-panel` `.campl-colmenu` `.disc-cols-pop` `.ac-cols-pop` `.tip-pop`; rows: `.ds-more-menu button` `.ds-menu-item` `.ac-pop-opt` `.dk-per-opt` `.dk-cf-item` `.tg-opt` `.campl-colopt` | row tones `.is-danger` `.is-warn`; heading `.ac-pop-h` | row hover, `.on`/`.is-on` (selected), focus-visible | row menus, filters, views, columns |
| Dialog | Modal shell: header (border) / body / footer (border) | `.modal.mk` (`.mk-body` `.modal-foot` `.mk-x`), `.ac-modal` (`-h` `-body` `-f`), `.disc-cfg` `.addn` (`-head` `-foot`) | size modifiers in area files (`.ac-modal--wide`) | | all dialogs |
| Drawer / side sheet | Right-hand panel + scrim | `.ds-drawer` `.ccs-sheet` `.ac-drawer` `.drawer`; scrim `.scrim` `.ds-drawer-back` `.ccs-back` `.ac-drawer-back` `.ac-modal-back` `.disc-cfg-scrim` | | | quick view, costing, post details, review |
| Progress bar | Track + fill | `.ds-progress` `.cp-bar` `.cov-bar` `.sv-bar` `.sv-share` `.tl-bar` `.oe-track` `.oe-city .oe-t` `.dk-stack2` `.tv-seg-bar` `.col-tierbar` | fill tone `.is-over` `.is-risk` `.is-ok` `.is-warn` | | campaigns, collections |
| Chart legend / axis | Chart furniture | `.ds-legend` `.dw-lg` `.tv-legend` `.legend` `.oe-legend`; axis `.ds-axis` `.tv-yax` `.tv-xax` `.dots-axis` `.gauge-scale`; `.tv-gl` gridline | | | dashboard, profile |
| Empty state | No-data message | `.ds-empty` `.ac-empty` `.msd-empty` `.ccs-empty`; boxed: `.ds-empty--box` `.disc-cfg-empty` `.col-grid>p.ds-caption` | `td.ds-empty` in tables | | tables, lists |
| Bulk / selection bar | Contextual actions for selected rows | `.bulk-bar` `.ac-bulk` (+ `.bb-l` `.bb-r` `.bb-btn` `.bb-clear`) | | | My creators, tracker |
| Page scaffolding | Page gap, title, actions, tab row, crumb | `.ds-page` `.ds-page-title` `.ds-head` `.ds-actions` `.ds-tabrow` `.crumb` `.link` | | | all |

## Known violations (cannot be fixed in CSS alone)

- **Inline styles in `app.js` templates** override tokens and need a documented `!important` in ds/area CSS:
  `.tier-tag` / `.acct-pill` (per-tier colours, `ds.css`), `.sd-ico` (`areas/creators.css`), `.ds-cc-media` (`areas/creators.css`),
  `.col-tierbar i[title^=…]` (`areas/collections.css`), `.tv-org` / `.tv-boo` series colours and the `[style*="#1e40af"]` selectors
  (`areas/campaigns.css`). Fix at source: emit a class instead of `style="background:…"`.
- **Raw hex in `app.js`**: `SIG_COLORS`, `TIER_TAG`, `TIER_BAR`, `PIE_COL`, `DK_ORG/DK_PAID/dkCol`, avatar colours, and the legacy
  `<style>` blocks (`MK_CSS`, `CAMP_QA`, `SH_CSS`, `MSD_CSS`, …) still contain hard-coded colours and sizes inside `@layer legacy`.
  The legacy `.ds-page small,p { color:#1e40af }` style rules are overridden in `areas/campaigns.css` but not removed.
- **`@layer legacy` `!important` on layout** (width/height/margin/display) remains in `legacy.css` and a few `app.js` blocks
  (`.ds-namebtn`, `.ccs-sheet`, `.dk-ov-row`); important in an earlier layer always wins, so area files cannot override those.
- **Tooltip** (`.ftip:hover::after`, `[data-tip]`) is styled by an injected legacy rule with raw `#0f172a`; no ds tooltip component yet.
- **z-index** values are not tokenised.
- Tracker `.ac-bulk` is now the neutral bulk bar (was blue-tinted); `.ac-table` keeps its own dense 36/48px sizing and
  grouped/sticky header rules (page-specific, in `areas/tracker.css`).

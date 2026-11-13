#!/usr/bin/env python3
"""One-off: fixes found by the parity run (F1 mini row while open, F2 disabled Add-to dead click, F3 tracker level-x layout shift, V1 creators caption)."""
import os
base = os.path.join(os.path.dirname(__file__), '..', 'src')

p = os.path.join(base, 'ds.css'); s = open(p).read()
a = ".ds-btn[disabled],.btn[disabled],.ds-btn.is-disabled,.ds-pager button:disabled,.dk-per-step:disabled{opacity:.5;pointer-events:none}"
assert a in s
s = s.replace(a, ".ds-btn[disabled],.btn[disabled],.ds-pager button:disabled,.dk-per-step:disabled{opacity:.5;pointer-events:none}\n.ds-btn.is-disabled{opacity:.5;cursor:not-allowed}  /* stays clickable: the app shows an explanatory toast */")
b = ".dk-mini{display:flex;align-items:center;gap:var(--sp-4);margin-left:auto;font-size:var(--fs-sm);color:var(--slate-600)}"
assert b in s
s = s.replace(b, b + "\n.dk-acc[open] .dk-mini,.dk-ov[open] .dk-mini,.cp-ov[open] .dk-mini,.ds-overview[open] .ds-ov-mini{display:none}  /* summary row only while collapsed */")
open(p, 'w').write(s)

p = os.path.join(base, 'areas', 'tracker.css'); s = open(p).read()
a = ".ac-card .ac-tab-x{position:static;opacity:0;width:0;margin-left:-8px;overflow:hidden;pointer-events:none}"
assert a in s
s = s.replace(a, ".ac-card .ac-tab-x{position:static;opacity:0;pointer-events:none}  /* width reserved: the caret must not shift on hover */")
a2 = ".ac-card .ac-tab:hover .ac-tab-x,.ac-card .ac-tab:focus-within .ac-tab-x{opacity:1;width:24px;margin-left:0;pointer-events:auto}"
assert a2 in s
s = s.replace(a2, ".ac-card .ac-tab:hover .ac-tab-x,.ac-card .ac-tab:focus-within .ac-tab-x{opacity:1;pointer-events:auto}")
open(p, 'w').write(s)

p = os.path.join(base, 'areas', 'campaigns.css'); s = open(p).read()
a = ".cp-table .cp-creators .ds-table-meta{display:none}"
assert a in s
s = s.replace(a, ".cp-table .cp-creators .ds-table-meta{display:inline;color:var(--slate-500);font-size:12px;white-space:nowrap}")
open(p, 'w').write(s)
print('ok')

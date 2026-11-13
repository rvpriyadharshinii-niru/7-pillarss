const { runAll, report } = require('./scen-lib');
const S = {
  'DASH01 dashboard loads: KPI strip, widgets, no errors': async a => { await a.setPage('dashboard'); a.obs('m', await a.m(1500, 0)); a.obs('nWidgets', await a.count('#main .dw-cell')); },
  'DASH02 date range: prev/next month, period menu options, custom range': async a => {
    await a.setPage('dashboard'); await a.A('Previous month'); a.obs('prev', await a.m(400, 0)); await a.A('Next month'); a.obs('next', await a.m(200, 0)); await a.A('Next month').catch(() => {}); a.obs('next2 (future)', await a.m(200, 0));
    await a.C('Period: 1 Oct – 31 Oct').catch(async () => { await a.p.locator('#main [aria-label^="Period"]').first().click(); }); a.obs('period menu', await a.ev(() => [...document.querySelectorAll('#main [role=menuitem],#main [role=option],#main .dk-per-menu button')].filter(e => e.offsetParent).map(e => e.innerText.trim()).slice(0, 20)));
    a.obs('period menu text', await a.m(500, 100));
  },
  'DASH03 period menu: choose every preset': async a => {
    await a.setPage('dashboard'); const first = a.p.locator('#main [aria-label^="Period"]').first(); await first.click(); const items = await a.ev(() => [...document.querySelectorAll('#main [role=menuitem],#main [role=option],#main [class*=per] button')].filter(e => e.offsetParent && e.innerText.trim()).map(e => e.innerText.trim())); a.obs('items', items);
    for (const it of items.slice(0, 12)) { await a.try('period ' + it, async () => { await a.p.locator('#main [aria-label^="Period"]').first().click(); await a.p.locator('#main').getByText(it, { exact: true }).first().click({ timeout: 1500 }); await a.p.waitForTimeout(100); return { m: await a.m(160, 0), lbl: await a.ev(() => document.querySelector('#main [aria-label^="Period"]').getAttribute('aria-label')) }; }); }
  },
  'DASH04 filters: Campaign/Product/Category/Objective/Status/Creator type/Platform/Organic-paid menus (each option)': async a => {
    await a.setPage('dashboard'); const n = await a.count('#main .ds-filter'); a.obs('n filters', n);
    for (let i = 0; i < n; i++) { const vs = await a.ev(i => [...document.querySelectorAll('#main .ds-filter')[i].querySelectorAll('.ds-menu-item')].map(x => x.dataset.v), i); for (const v of vs.slice(0, 6)) { await a.try(`f${i}=${v}`, async () => { await a.pick(i, v); return { kpi: await a.m(260, 120) }; }); } await a.try(`reset f${i}`, () => a.pick(i, vs[0])); }
  },
  'DASH05 campaign multi-select dropdown, search, clear, "Inactive after"': async a => {
    await a.setPage('dashboard'); await a.C('Campaign', '#main'); a.obs('open', await a.m(400, 80)); await a.fillA('Search campaigns', 'plix').catch(() => {}); a.obs('searched', await a.m(300, 80));
    await a.try('select', async () => { await a.p.locator('#main [role=option], #main label:has(input[type=checkbox])').nth(1).click({ timeout: 1500 }); return a.m(300, 0); }); await a.try('clear', () => a.C('Clear', '#main')); a.obs('after', await a.m(300, 0)); await a.try('inactive after', async () => { await a.C('Inactive after'); return a.m(200, 0); });
  },
  'DASH06 widget segmented controls All/Organic/Boosted, Gender/Location/Tier/Concept, views/spend/posts': async a => {
    await a.setPage('dashboard'); for (const t of ['Organic', 'Boosted', 'All', 'Gender', 'Location', 'Tier', 'Concept', 'views', 'spend', 'posts']) { await a.try('seg ' + t, async () => { await a.C(t, '#main'); return { m: await a.m(200, 400) }; }); }
  },
  'DASH07 widget options menu (...), View settings, Export report, Refresh': async a => {
    await a.setPage('dashboard'); for (const t of ['View settings', 'Export report', 'Refresh data', 'Widget options']) { await a.try(t, async () => { await a.A(t, 0); return { t: await a.toast(), lay: await a.lay(300), m: await a.m(150, 0) }; }); await a.key('Escape'); if (await a.layerOpen()) await a.ev(() => closeLayer()); }
  },
  'DASH08 campaign overview accordion open/close [F1 mini summary]': async a => {
    await a.setPage('dashboard'); await a.try('toggle', async () => { await a.p.locator('#main summary').first().click(); return a.ev(() => document.querySelector('#main details').open); }); await a.try('toggle2', async () => { await a.p.locator('#main summary').first().click(); return a.ev(() => document.querySelector('#main details').open); });
    a.obs('mini visible when open?', await a.ev(() => { const d = document.querySelector('#main details[open] .dk-mini, #main details[open] .ds-ov-mini'); return d ? getComputedStyle(d).display : 'none/absent'; }));
  },
  'DASH09 posts list: search, All posts, open post details drawer, tabs, close, deep link post=': async a => {
    await a.setPage('dashboard'); await a.try('search', async () => { await a.p.locator('#main input[placeholder^="Search creator"]').fill('maya'); return a.m(200, 400); });
    await a.try('open post', async () => { await a.C('Open post details'); return { lay: await a.lay(500), hash: (await a.st()).hash }; }); await a.try('close', async () => { await a.key('Escape'); if (await a.layerOpen()) await a.A('Close'); return { lay: await a.layerOpen(), hash: (await a.st()).hash }; });
    await a.try('All posts', async () => { await a.C('All posts'); return { st: await a.st(), lay: await a.lay(200) }; });
  },
  'DASH10 [cross] dashboard counts match campaigns lists & tracker totals': async a => {
    await a.setPage('dashboard'); const kpi = await a.m(400, 0); a.obs('kpi', kpi); await a.setPage('campaigns'); a.obs('active tab count', await a.p.locator('#main button:has-text("Active")').first().innerText()); await a.setPage('tracker'); a.obs('tracker rows', await a.rows());
  },
};
(async () => { const r = await runAll(S, process.argv[2]); report(r, 'dash'); })();

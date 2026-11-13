const { runAll, report } = require('./scen-lib');
const rows = a => a.rows();
const S = {
  'MY01 load: KPIs, 9 rows, columns': async a => { await a.setPage('creators'); a.expect('9 rows', await rows(a), 9); a.obs('m', await a.m(1200, 0)); },
  'MY02 search handle/name; empty; clear': async a => {
    await a.setPage('creators');
    for (const q of ['kylie', '@pavan', 'zzzz', '', 'KYLIE', 'x'.repeat(300), '<b>']) { await a.fillA('Search by handle', q); a.obs('q=' + q.slice(0, 8), { rows: await rows(a), m: await a.m(160, 700) }); }
  },
  'MY03 filters Category/Status/Tier + clear x': async a => {
    await a.setPage('creators'); const n = await a.count('#main .ds-filter');
    for (let i = 0; i < n; i++) { const vs = await a.ev(i => [...document.querySelectorAll('#main .ds-filter')[i].querySelectorAll('.ds-menu-item')].map(x => x.dataset.v), i); for (const v of vs) { await a.pick(i, v); a.obs(`f${i}=${v}`, { rows: await rows(a), kpi: await a.m(120, 100) }); } await a.pick(i, vs[0]); }
    await a.pick(0, 'Worked'); a.obs('x-clear visible', await a.count('#main .ds-filter-x')); await a.A('Clear Category'); a.obs('cleared', await rows(a));
  },
  'MY04 Table/Cards toggle, card select & open': async a => {
    await a.setPage('creators'); await a.C('Cards'); a.obs('cards', { n: await a.count('#main .my-card'), m: await a.m(300, 600) }); await a.A('Select Kylie'); a.obs('bulk', await a.ev(() => (document.querySelector('.bulk-bar') || {}).innerText)); await a.C('Table'); a.obs('table', await rows(a)); a.obs('sel kept', await a.ev(() => S.mySel));
  },
  'MY05 Add creator dialog: paste valid/invalid/dupes/empty, tabs CSV/Doc, cancel, esc': async a => {
    await a.setPage('creators'); await a.C('Add creator'); a.obs('dlg', await a.m(600, 500));
    a.obs('empty add disabled', await a.ev(() => document.querySelector('.disc-cfg-scrim .ds-btn--primary').disabled));
    for (const t of ['Upload CSV', 'Google Doc', 'Paste handles']) { await a.C(t, '#main .disc-cfg-scrim'); a.obs('mode ' + t, await a.ev(() => S.addMode)); }
    await a.p.fill('#addc-input', '@kylie, pavansirisin, @zz_new, !!bad!!, https://instagram.com/vedictoons, @zz_new'); a.obs('typed', await a.m(500, 500));
    await a.C('Add creators', '#main .disc-cfg-scrim'); a.obs('result', { t: await a.toast(), n: await rows(a), open: await a.ev(() => S.addOpen) }); a.obs('rows names', await a.ev(() => [...document.querySelectorAll('#main tbody tr')].map(r => r.innerText.replace(/\s+/g, ' ').slice(0, 25))));
    await a.C('Add creator'); await a.key('Escape'); a.expect('esc closes', await a.ev(() => S.addOpen), false); await a.C('Add creator'); await a.C('Cancel', '#main .disc-cfg-scrim'); a.expect('cancel closes', await a.ev(() => S.addOpen), false);
    await a.C('Add creator'); await a.A('Close'); a.expect('x closes', await a.ev(() => S.addOpen), false);
  },
  'MY06 Add creator: 300 handles & very long handle': async a => {
    await a.setPage('creators'); await a.C('Add creator'); await a.p.fill('#addc-input', Array.from({ length: 300 }, (_, i) => '@bulk_user_' + i).join(', ') + ' @' + 'q'.repeat(300)); await a.C('Add creators', '#main .disc-cfg-scrim'); a.obs('t', await a.toast()); a.obs('n', await rows(a)); a.obs('kpi', await a.m(100, 100));
  },
  'MY07 inline edit: cost, region, deal tier, evaluate select; persists across nav': async a => {
    await a.setPage('creators'); await a.fillA('Cost for Pavan K Sirisin', '12345'); await a.p.keyboard.press('Tab'); await a.fillA('Region for Pavan K Sirisin', 'APAC'); await a.p.keyboard.press('Tab'); await a.fillA('Deal Tier for Pavan K Sirisin', 'Gold'); await a.p.keyboard.press('Tab');
    a.obs('after edit', await a.ev(() => { const r = document.querySelector('#main tbody tr'); return [...r.querySelectorAll('input')].map(i => i.value).join('|'); })); await a.setPage('discover'); await a.setPage('creators');
    a.obs('persist', await a.ev(() => { const r = document.querySelector('#main tbody tr'); return [...r.querySelectorAll('input')].map(i => i.value).join('|'); }));
    await a.fillA('Cost for Kylie', '-5'); await a.p.keyboard.press('Tab'); await a.fillA('Cost for Kylie', '1e3'); await a.p.keyboard.press('Tab'); a.obs('cost invalid', await a.ev(() => document.querySelector('[aria-label="Cost for Kylie"]').value));
    await a.fillA('Region for Kylie', 'R'.repeat(200)); await a.p.keyboard.press('Tab'); a.obs('long region', await a.ev(() => document.querySelector('[aria-label="Region for Kylie"]').value.length));
  },
  'MY08 tags: add, remove, duplicate, empty, long; +N expand': async a => {
    await a.setPage('creators'); const add = async (t) => { await a.p.locator('[aria-label="Add a tag"]').first().fill(t); await a.p.keyboard.press('Enter'); await a.p.waitForTimeout(100); };
    for (const t of ['newtag', 'newtag', '', '   ', 'x'.repeat(80), '<i>']) { await add(t); a.obs('tag ' + t.slice(0, 8), await a.ev(() => document.querySelector('#main tbody tr').innerText.replace(/\s+/g, ' ').slice(-150))); }
    await a.A('Remove tag Gifting'); a.obs('removed', await a.ev(() => document.querySelector('#main tbody tr').innerText.replace(/\s+/g, ' ').slice(-150)));
    await a.setPage('discover'); await a.setPage('creators'); a.obs('persist', await a.ev(() => document.querySelector('#main tbody tr').innerText.replace(/\s+/g, ' ').slice(-150)));
  },
  'MY09 selection: select all, individual, clear; bulk bar count': async a => {
    await a.setPage('creators'); await a.A('Select all creators'); a.obs('all', await a.ev(() => [document.querySelector('.bulk-bar') && document.querySelector('.bulk-bar').innerText, S.mySel.length])); await a.A('Select all creators'); a.obs('none', await a.ev(() => [!!document.querySelector('.bulk-bar'), S.mySel.length]));
    await a.A('Select Kylie'); a.obs('one', await a.ev(() => [document.querySelector('.bulk-bar') && document.querySelector('.bulk-bar').innerText, S.mySel.length])); await a.A('Select Marques'); await a.C('Clear', '.bulk-bar'); a.obs('cleared', await a.ev(() => S.mySel.length));
  },
  'MY10 bulk: every action step (score, fit, plan, status, remove, add to collection/campaign)': async a => {
    await a.setPage('creators'); await a.A('Select Kylie'); await a.A('Select Marques'); await a.A('Select Vedictoons');
    const bb = await a.p.locator('.bulk-bar button, .bulk-bar summary').allInnerTexts(); a.obs('bulk buttons', bb);
    // generate score
    await a.C('Generate score', '.bulk-bar'); a.obs('score modal', await a.m(500, 600)); await a.C('Recent high engagement', '#main .bulkm'); a.obs('score radio', await a.ev(() => S.bulkPosts)); await a.p.locator('.bulkm [aria-label="Fetch fresh data"]').click(); a.obs('fresh', await a.ev(() => S.bulkFresh)); await a.C('Score 3 creators', '#main .bulkm'); a.obs('score done', { t: await a.toast(), open: await a.ev(() => S.bulkOpen) });
    // brand fit
    await a.C('Brand fit', '.bulk-bar'); a.obs('fit modal', await a.m(700, 600)); await a.C('Awareness', '#main .bulkm'); a.obs('obj', await a.ev(() => S.bulkObj)); await a.C('Awareness', '#main .bulkm'); a.obs('obj2', await a.ev(() => S.bulkObj)); await a.p.fill('.bulkm input[type=text]', 'skincare'); await a.C('Cancel', '#main .bulkm'); a.obs('fit cancel', await a.ev(() => S.bulkOpen));
    await a.C('Brand fit', '.bulk-bar'); await a.p.locator('#main .bulkm .bulkm-foot .ds-btn--primary').click(); await a.p.waitForTimeout(100); a.obs('fit done', await a.toast());
    // add to
    await a.C('Add to', '.bulk-bar'); await a.C('Collection', '.bulk-bar'); a.obs('addto coll', await a.lay(400)); await a.C('Add 3 creators', '#layer'); a.obs('addto coll done', { t: await a.toast(), sel: await a.ev(() => S.mySel.length), cols: await a.ev(() => CREATOR_COLLECTIONS.map(c => c.creatorIds.length)) });
    await a.A('Select Kylie'); await a.A('Select Marques'); await a.C('Add to', '.bulk-bar'); await a.C('Campaign', '.bulk-bar'); a.obs('addto camp', await a.lay(300)); await a.C('Add 2 creators', '#layer'); a.obs('addto camp done', { t: await a.toast(), camps: await a.ev(() => CAMP_LIST.slice(0, 3).map(c => c.creatorIds.length)) });
  },
  'MY11 [F2] bulk bar Add to with only 1 creator selected shows guidance toast (orig) - click must open menu': async a => {
    await a.setPage('creators'); await a.A('Select Kylie'); const bb = await a.p.locator('.bulk-bar summary').boundingBox(); await a.p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await a.p.waitForTimeout(120);
    const open = await a.ev(() => document.querySelector('.bulk-bar details').open); a.obs('menu opened by real mouse click on disabled-look Add to', open); a.expect('menu opens (orig behaviour)', open, true);
  },
  'MY11b bulk Remove step: cancel, esc, confirm; KPIs/repo updated': async a => {
    await a.setPage('creators'); await a.A('Select Kylie'); await a.A('Select Marques'); await a.C('Remove', '.bulk-bar'); a.obs('remove modal', await a.m(300, 600)); await a.C('Cancel', '#main .bulkm'); a.obs('rows', await rows(a)); await a.C('Remove', '.bulk-bar'); await a.key('Escape'); a.obs('esc', await a.ev(() => [S.bulkOpen, S.bulkStep])); await a.key('Escape'); a.obs('esc2', await a.ev(() => [S.bulkOpen, S.bulkStep])); await a.C('Remove', '.bulk-bar');
    await a.p.locator('.bulkm .ds-btn--danger').click(); a.obs('removed', { t: await a.toast(), n: await rows(a), kpi: await a.m(100, 100), repo: await a.ev(() => DISC.filter(c => !c.repo).length), sel: await a.ev(() => S.mySel.length) });
  },
  'MY12 Columns popover + configure columns (add/search/toggle/reorder)': async a => {
    await a.setPage('creators'); await a.C('Columns'); a.obs('pop', await a.m(300, 500)); await a.fillA('Find a column', 'ten'); a.obs('find', await a.p.locator('#main input[type=checkbox][aria-label^="Show "]').count());
    await a.fillA('Find a column', ''); await a.p.locator('#main input[aria-label="Show Added"]').click(); a.obs('Added on', await a.m(300, 500)); await a.p.locator('#main input[aria-label="Show Niche"]').click(); a.obs('Niche off', await a.ev(() => [...document.querySelectorAll('#main thead th')].map(t => t.innerText.trim()).join(',')));
    await a.C('Configure columns'); a.obs('cfg', await a.m(500, 500)); await a.key('Escape'); a.obs('esc', await a.ev(() => [S.myCfgOpen, S.myColsOpen]));
  },
  'MY13 quick view side sheet -> full profile -> 6 tabs -> back keeps filter/selection': async a => {
    await a.setPage('creators'); await a.fillA('Search by handle', 'a'); await a.A('Select Kylie'); const r0 = await rows(a);
    await a.p.locator('#main tbody').getByText('Kylie', { exact: true }).first().click(); await a.p.waitForTimeout(150); a.obs('quick', await a.lay(600)); a.obs('quick st', await a.st()); await a.C('Open profile', '#layer'); a.obs('profile', { st: await a.st(), h: (await a.snap()).header.slice(0, 200) });
    for (let i = 0; i < 6; i++) { await a.p.locator('#header button', { hasText: ['Overview', 'Content', 'Content Performance', 'Evaluated Reports', 'Collaborations', 'Audience'][i] }).first().click(); await a.p.waitForTimeout(120); a.obs('tab' + i, { st: (await a.st()).tab, hash: (await a.st()).hash, m: await a.m(250) }); }
    await a.C('My creators', '#header .crumb, #main .crumb'); a.obs('back', { st: await a.st(), q: await a.ev(() => document.querySelector('[aria-label="Search by handle"]').value), rows: await rows(a), sel: await a.ev(() => S.mySel) }); a.expect('rows kept', await rows(a), r0);
  },
  'MY14 profile: Back button, Save creator, Compare, Add to plan, More actions, view toggle': async a => {
    await a.goHash('#/creators/cr1?tab=0'); const hdr = await a.p.locator('#header button').allInnerTexts(); a.obs('header buttons', hdr);
    for (const t of ['Save creator', 'Compare', 'Add to plan', 'More actions', 'Tabs', 'Report']) { try { await a.C(t, '#header'); } catch (e) { a.obs('missing ' + t, 1); continue; } a.obs('after ' + t, { toast: await a.toast(), lay: await a.lay(250), st: await a.st(), m: await a.m(100) }); await a.key('Escape'); if (await a.layerOpen()) await a.ev(() => closeLayer()); }
    await a.C('Back', '#header'); a.obs('after back', await a.st());
  },
  'MY15 profile tab interactions (each tab: click all buttons once, state keeps)': async a => {
    for (let t = 0; t < 6; t++) {
      await a.goHash('#/creators/cr1?tab=' + t); const n = await a.count('#main button:visible'); a.obs('t' + t + ' buttons', n);
      const labels = await a.ev(() => [...document.querySelectorAll('#main button')].filter(b => b.offsetParent).map(b => (b.getAttribute('aria-label') || b.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 30)));
      a.obs('t' + t + ' labels', labels);
      for (let i = 0; i < Math.min(n, 12); i++) { await a.p.locator('#main button:visible').nth(i).click({ timeout: 2000 }).catch(() => {}); await a.p.waitForTimeout(60); if ((await a.st()).page !== 'creators' || (await a.st()).myCreator !== 'cr1') { a.obs(`t${t} b${i} navigated`, await a.st()); await a.goHash('#/creators/cr1?tab=' + t); } else if (await a.layerOpen()) { a.obs(`t${t} b${i} layer`, await a.lay(160)); await a.key('Escape'); if (await a.layerOpen()) await a.ev(() => closeLayer()); } }
      a.obs('t' + t + ' end', { st: await a.st(), m: await a.m(200) });
    }
  },
};
(async () => { const r = await runAll(S, process.argv[2]); report(r, 'my'); })();

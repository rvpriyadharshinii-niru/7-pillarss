const { runAll, report } = require('./scen-lib');
const S = {
  'DISC01 load: counts, columns, toolbar': async a => {
    await a.setPage('discover'); a.obs('m', await a.m(900)); a.obs('rows', await a.rows()); a.expect('22 creators in table', await a.visCount('#main tbody tr'), 22);
  },
  'DISC02 search by name/handle/niche; empty result; clear': async a => {
    await a.setPage('discover');
    for (const q of ['maya', '@mayachen', 'fitness', 'zzzzqq', '   ', 'MAYA', 'a', '<img src=x>', 'x'.repeat(400)]) { await a.fillA('Search creators', q); a.obs('q=' + q.slice(0, 10), { rows: await a.rows(), m: await a.m(250, 200) }); }
    await a.fillA('Search creators', 'zzzzqq'); a.obs('empty-state', await a.m(500, 150)); await a.fillA('Search creators', ''); a.expect('restored', await a.rows(), 22);
  },
  'DISC03 suggestion chips fill the search and filter': async a => {
    await a.setPage('discover'); for (const t of ['Micro beauty creators in India', 'Travel creators in India', 'Mega beauty creators on Instag']) { await a.C(t); a.obs('chip ' + t, { rows: await a.rows(), q: await a.ev(() => (document.querySelector('[aria-label="Search creators"]') || {}).value), st: await a.st() }); }
  },
  'DISC04 advanced filters: open/close, tier, ER, reset, show results': async a => {
    await a.setPage('discover'); await a.A('Advanced filters'); a.obs('open', await a.m(700, 250));
    for (const t of ['Nano', 'Micro', 'Mid-tier', 'Macro', 'Mega']) { await a.C(t, '#main'); a.obs('tier ' + t, { rows: await a.rows(), btn: await a.ev(() => [...document.querySelectorAll('button')].map(b => b.innerText).find(x => /Show results/.test(x))) }); }
    await a.C('>5%'); a.obs('er>5', await a.rows()); await a.C('>8%'); a.obs('er>8', await a.rows());
    await a.C('Reset'); a.obs('reset', await a.rows()); await a.A('Close filters'); a.obs('closed', await a.m(300, 250));
    await a.A('Advanced filters'); await a.C('AI Filter'); a.obs('ai', await a.m(700, 250)); await a.C('Standard');
  },
  'DISC05 filters Source/Platform/tier selects, clear chips': async a => {
    await a.setPage('discover');
    const selects = await a.ev(() => [...document.querySelectorAll('#main select')].map(s => [s.getAttribute('aria-label'), [...s.options].map(o => o.value)]));
    a.obs('selects', selects);
    for (let i = 0; i < selects.length; i++) for (const v of selects[i][1]) { await a.p.locator('#main select').nth(i).selectOption(v); await a.p.waitForTimeout(60); a.obs(`sel ${selects[i][0]}=${v}`, { rows: await a.rows(), m: await a.m(200, 100) }); }
    // reset all
    for (let i = 0; i < selects.length; i++) await a.p.locator('#main select').nth(i).selectOption(selects[i][1][0]); a.obs('all back', await a.rows());
  },
  'DISC06 table/cards toggle keeps results; cards render': async a => {
    await a.setPage('discover'); await a.fillA('Search creators', 'a'); const r = await a.rows();
    await a.C('Cards'); a.obs('cards', { m: await a.m(500, 250), nCards: await a.count('#main article, #main [class*=card]:visible') });
    await a.C('Table'); a.expect('same rows after toggle', await a.rows(), r); a.obs('table', await a.rows());
  },
  'DISC07 Columns popover: toggle each, find column, configure': async a => {
    await a.setPage('discover'); await a.C('Columns'); const names = await a.ev(() => [...document.querySelectorAll('#main input[type=checkbox][aria-label^="Show "]')].map(c => c.getAttribute('aria-label') + ':' + c.checked));
    a.obs('cols', names);
    const n = await a.count('#main input[type=checkbox][aria-label^="Show "]');
    for (let i = 0; i < Math.min(n, 6); i++) { await a.p.locator('#main input[type=checkbox][aria-label^="Show "]').nth(i).click(); a.obs('toggle' + i, await a.m(400, 250)); if (!(await a.count('#main input[type=checkbox][aria-label^="Show "]'))) await a.C('Columns'); }
    await a.key('Escape'); a.obs('esc', await a.ev(() => S.discColsOpen));
  },
  'DISC08 select rows -> bulk bar; Add to My creators/Collection/Campaign': async a => {
    await a.setPage('discover'); const before = await a.ev(() => DISC.filter(c => !c.repo).length);
    await a.A('Select Nicole Pearce'); await a.A('Select Maya Chen'); a.obs('sel2', await a.m(500, 150)); a.obs('bulkbar', await a.ev(() => (document.querySelector('.bulk-bar,[class*=bulk]') || {}).innerText));
    for (const t of ['My creators', 'Collection', 'Campaign']) { const b = await a.p.locator('#main [class*=bulk] button:visible, #main .bulk-bar button:visible').allInnerTexts(); a.obs('bulkbtns', b); break; }
  },
  'DISC09 row Add to > My creators: toast, link goes to My creators, count +1, removed from Discover list state': async a => {
    await a.setPage('discover'); const before = await a.ev(() => DISC.filter(c => !c.repo).length);
    await a.p.locator('#main tbody tr').first().locator('summary').click(); await a.C('My creators', '#main tbody tr'); a.obs('toast', await a.toast()); const after = await a.ev(() => DISC.filter(c => !c.repo).length); a.expect('my count +1', after, before + 1);
    a.obs('row0', await a.m(300, 200)); await a.p.locator('.toast-link').click(); await a.p.waitForTimeout(150); a.obs('after link', await a.st()); a.obs('mycreators', await a.m(220, 190)); a.truthy('Nicole listed', (await a.m(100000)).includes('NicolePearce'));
  },
  'DISC10 row Add to > Collection / Campaign dialogs (open, cancel, apply)': async a => {
    await a.setPage('discover');
    for (const tgt of ['Collection', 'Campaign']) {
      await a.p.locator('#main tbody tr').nth(1).locator('summary').click(); await a.C(tgt, '#main tbody tr'); a.obs(tgt + ' dlg', await a.lay(600)); await a.C('Cancel'); a.expect(tgt + ' closed', await a.layerOpen(), 0);
      await a.p.locator('#main tbody tr').nth(1).locator('summary').click(); await a.C(tgt, '#main tbody tr'); const opts = await a.ev(() => [...document.querySelectorAll('#layer select option, #layer [role=option], #layer .ds-check')].map(o => o.innerText || o.textContent)); a.obs(tgt + ' opts', opts);
      const btn = await a.p.locator('#layer .ds-btn--primary').last().innerText(); a.obs(tgt + ' primary', btn); await a.p.locator('#layer .ds-btn--primary').last().click(); await a.p.waitForTimeout(150); a.obs(tgt + ' applied toast', await a.toast()); a.obs(tgt + ' layer', await a.layerOpen());
    }
    a.obs('collections', await a.ev(() => CREATOR_COLLECTIONS.map(c => c.id + ':' + c.creatorIds.join(','))));
  },
  'DISC11 open creator profile from Discover, 6 tabs, back crumb keeps filter': async a => {
    await a.setPage('discover'); await a.fillA('Search creators', 'maya'); await a.C('Maya Chen'); await a.p.waitForTimeout(200); a.obs('after click name', { st: await a.st(), lay: await a.lay(300), m: await a.m(200) });
    if (await a.layerOpen()) { await a.C('Open profile', '#layer'); } else await a.C('Open profile');
    await a.p.waitForTimeout(200); a.obs('profile', { st: await a.st(), m: await a.m(300) });
    for (const t of ['Overview', 'Content', 'Content Performance', 'Evaluated Reports', 'Collaborations', 'Audience']) { await a.C(t, '#main [role=tablist], #main .tabs, #main'); a.obs('tab ' + t, { tab: (await a.st()).tab, hash: (await a.st()).hash, m: await a.m(250) }); }
    await a.C('Discover', '#main .crumb'); a.obs('back', { st: await a.st(), q: await a.ev(() => (document.querySelector('[aria-label="Search creators"]') || {}).value), rows: await a.rows() });
  },
  'DISC12 row tags: add/remove tag persists across navigation': async a => {
    await a.setPage('discover'); await a.A('Remove tag Q4', 0); a.obs('removed', await a.m(300, 200)); await a.setPage('creators'); await a.setPage('discover'); a.obs('persist', await a.m(300, 200));
  },
};
(async () => { const r = await runAll(S, process.argv[2]); report(r, 'disc'); })();

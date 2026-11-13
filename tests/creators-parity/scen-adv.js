const { runAll, report } = require('./scen-lib');
const S = {
  'ADV01 rapid double-click on Create collection submit (no duplicate)': async a => {
    await a.setPage('collections'); await a.C('New collection'); await a.p.fill('#newColName', 'Dbl'); await a.p.locator('#layer .ds-btn--primary').dblclick().catch(() => {}); await a.p.waitForTimeout(150); a.obs('collections', await a.ev(() => CREATOR_COLLECTIONS.map(c => c.name))); a.obs('layer', await a.layerOpen());
  },
  'ADV02 rapid double-click Add creators + Approve plan + Delete collection confirm': async a => {
    await a.setPage('creators'); await a.C('Add creator'); await a.p.fill('#addc-input', '@dbl_one'); await a.p.locator('.disc-cfg-scrim .ds-btn--primary').dblclick().catch(() => {}); await a.p.waitForTimeout(150); a.obs('rows', await a.rows()); a.obs('toast', await a.toast());
    await a.goHash('#/plan/pl1'); await a.C('Launch campaign', '#main, #header'); await a.p.locator('#layer .ds-btn--primary').dblclick().catch(() => {}); await a.p.waitForTimeout(150); a.obs('plan stage', await a.ev(() => CAMP_PLANS.find(p => p.id === 'pl1').stage)); a.obs('layer', await a.layerOpen());
    await a.setPage('collections'); await a.A('More actions for Skincare creators'); await a.C('Delete collection'); await a.p.locator('#layer .ds-btn--danger').dblclick().catch(() => {}); await a.p.waitForTimeout(150); a.obs('cols', await a.ev(() => CREATOR_COLLECTIONS.map(c => c.name)));
  },
  'ADV03 refresh mid-flow: with dialog / side sheet / profile tab / filters / bulk selection': async a => {
    await a.setPage('creators'); await a.fillA('Search by handle', 'ky'); await a.A('Select Kylie'); await a.p.reload(); await a.p.waitForTimeout(250); a.obs('after reload (search+sel)', { st: await a.st(), q: await a.ev(() => document.querySelector('[aria-label="Search by handle"]') && document.querySelector('[aria-label="Search by handle"]').value), sel: await a.ev(() => S.mySel), rows: await a.rows() });
    await a.C('Add creator'); await a.p.reload(); await a.p.waitForTimeout(250); a.obs('after reload (dialog open)', { open: await a.ev(() => S.addOpen), st: await a.st() });
    await a.p.locator('#main tbody').getByText('Kylie', { exact: true }).first().click(); await a.p.waitForTimeout(150); await a.p.reload(); await a.p.waitForTimeout(250); a.obs('after reload (side sheet)', { lay: await a.layerOpen(), st: await a.st() });
    await a.goHash('#/creators/cr1?tab=3'); await a.p.reload(); await a.p.waitForTimeout(250); a.obs('after reload (profile tab 3)', await a.st());
    await a.setPage('tracker'); await a.try('tracker remove? (skip)', async () => 1); await a.p.reload(); await a.p.waitForTimeout(250); a.obs('after reload tracker', await a.st());
    await a.goHash('#/campaign/ca1?tab=content'); await a.p.reload(); await a.p.waitForTimeout(250); a.obs('after reload campaign content', await a.st());
  },
  'ADV04 state persistence: added creator + plan stage + collection survive reload; reset via settings': async a => {
    await a.setPage('discover'); await a.p.locator('#main tbody tr').first().locator('summary').click(); await a.C('My creators', '#main tbody tr'); await a.goHash('#/plan/pl1'); await a.C('Launch campaign', '#main, #header'); await a.p.locator('#layer .ds-btn--primary').click(); await a.p.waitForTimeout(150);
    await a.p.reload(); await a.p.waitForTimeout(250); a.obs('after reload', { my: await a.ev(() => DISC.filter(c => !c.repo).length), stage: await a.ev(() => CAMP_PLANS.find(p => p.id === 'pl1').stage) });
    await a.goHash('#/settings'); a.obs('settings', await a.m(500, 0)); await a.try('reset', async () => { await a.C('Reset demo data'); await a.p.locator('#layer .ds-btn--danger').click(); await a.p.waitForTimeout(150); return { t: await a.toast(), my: await a.ev(() => DISC.filter(c => !c.repo).length) }; });
  },
  'ADV05 history: forward/back across profile tabs, deep link tab restore, crumb': async a => {
    await a.goHash('#/creators/cr1?tab=0'); await a.goHash('#/creators/cr1?tab=2'); await a.goHash('#/creators/cr2?tab=4'); await a.goHash('#/creators'); for (let i = 0; i < 3; i++) { await a.p.goBack(); await a.p.waitForTimeout(150); a.obs('back' + i, await a.st()); } await a.p.goForward(); await a.p.waitForTimeout(150); a.obs('fwd', await a.st());
  },
  'ADV06 tabs persist while switching between two profiles and back to list': async a => {
    await a.goHash('#/creators/cr1?tab=2'); await a.p.locator('#header button', { hasText: 'Audience' }).first().click(); await a.p.waitForTimeout(100); a.obs('cr1 audience', await a.st()); await a.goHash('#/creators/cr2'); a.obs('cr2 (tab keeps?)', await a.st()); await a.C('My creators', '#header .crumb, #main .crumb'); await a.p.locator('#main tbody').getByText('Kylie', { exact: true }).first().click(); await a.p.waitForTimeout(150); await a.C('Open profile', '#layer'); a.obs('open via quick view', await a.st());
  },
  'ADV07 narrow viewports: horizontal overflow of page + no errors (1024, 768, 390)': async (a, w) => {
    for (const vp of [[1024, 768], [768, 900], [390, 800]]) { await a.p.setViewportSize({ width: vp[0], height: vp[1] }); for (const pg of ['discover', 'creators', 'collections', 'dashboard', 'campaigns', 'tracker']) { await a.setPage(pg); a.obs(`${vp[0]} ${pg} docOverflow`, await a.ev(() => document.documentElement.scrollWidth > innerWidth + 2)); } }
  },
  'ADV08 keyboard: Tab through My creators toolbar, Enter on row opens quick view, Escape closes, focus visible': async a => {
    await a.setPage('creators'); await a.p.focus('[aria-label="Search by handle"]'); for (let i = 0; i < 6; i++) await a.p.keyboard.press('Tab'); a.obs('focus', await a.ev(() => document.activeElement.getAttribute('aria-label') || document.activeElement.innerText.slice(0, 20)));
    await a.try('card enter', async () => { await a.C('Cards'); await a.p.locator('.my-card').first().focus(); await a.p.keyboard.press('Enter'); await a.p.waitForTimeout(150); return { lay: await a.lay(120) }; }); await a.key('Escape'); a.obs('esc', await a.layerOpen());
  },
  'ADV09 console cleanliness: visit every page + every profile tab + campaign/plan': async a => {
    for (const pg of ['discover', 'creators', 'collections', 'dashboard', 'campaigns', 'tracker']) await a.setPage(pg);
    for (let t = 0; t < 6; t++) await a.goHash('#/creators/cr1?tab=' + t); for (const h of ['#/campaign/ca1', '#/campaign/ca2?tab=content', '#/plan/pl1', '#/plan/pl3?tab=creators', '#/settings']) await a.goHash(h);
    a.obs('done', 1);
  },
};
(async () => { const r = await runAll(S, process.argv[2]); report(r, 'adv'); })();

const { runAll, report } = require('./scen-lib');
const PAGES = ['discover', 'creators', 'collections', 'dashboard', 'campaigns', 'tracker'];
const S = {
  'NAV01 every secondary-nav link opens its page and highlights': async a => {
    for (const pg of PAGES) { await a.nav(pg); const s = await a.st(); a.expect('page ' + pg, s.page, pg); a.obs('main-' + pg, (await a.main()).replace(/ /g, '').slice(0, 400)); a.obs('navOn-' + pg, (await a.snap()).navOn); a.obs('hash-' + pg, s.hash); }
  },
  'NAV02 nav group toggles collapse/expand': async a => {
    for (let i = 0; i < 2; i++) { await a.C('Creator', '.nav'); a.obs('creatorOpen' + i, await a.ev(() => document.querySelectorAll('.nav-exp')[0].classList.contains('closed'))); await a.C('Campaigns', '.nav'); a.obs('campOpen' + i, await a.ev(() => document.querySelectorAll('.nav-exp')[1].classList.contains('closed'))); }
  },
  'NAV03 rail items switch module and back': async a => {
    for (const m of ['ci', 'sp', 'ap', 'bm', 'sl', 'creators']) { await a.p.locator(`.rail-item[data-mod="${m}"]`).click(); await a.p.waitForTimeout(150); a.obs('rail-' + m, (await a.snap())); }
  },
  'NAV04 rail footer Requirements popover (empty state)': async a => {
    await a.p.locator('#reqStatusBtn').click(); await a.p.waitForTimeout(150);
    a.obs('reqPop', await a.ev(() => document.getElementById('reqPop').innerText)); a.truthy('popover open', await a.ev(() => document.getElementById('reqPop').classList.contains('open')));
    await a.p.locator('#reqStatusBtn').click(); a.expect('toggles closed', await a.ev(() => document.getElementById('reqPop').classList.contains('open')), false);
  },
  'NAV05 brand switcher search + pick': async a => {
    await a.p.locator('.rail-brand').click(); a.obs('brands', await a.ev(() => document.querySelectorAll('.brand-row').length));
    await a.p.fill('#brandQ', 'dell'); a.obs('brands-dell', await a.ev(() => document.querySelectorAll('.brand-row').length));
    await a.p.fill('#brandQ', 'zzzz'); a.obs('brands-none', await a.ev(() => document.getElementById('brandList').innerText));
    await a.p.fill('#brandQ', ''); await a.p.locator('.brand-row').nth(1).click(); a.obs('picked', await a.toast()); a.obs('initials', await a.ev(() => document.getElementById('railBrand').textContent));
  },
  'NAV06 alerts popover tabs + manage automations link': async a => {
    await a.p.locator('button[aria-label="Alerts"]').click(); await a.C('Unread', '#alertPop'); a.obs('alert', await a.ev(() => document.getElementById('alertPop').innerText));
    await a.C('Manage automations', '#alertPop'); a.obs('after', (await a.snap())); a.obs('st', await a.st());
  },
  'NAV07 account menu items and logout': async a => {
    for (const t of ['Dashboard', 'Active Tasks', 'Media Library', 'Automations', 'MCP', 'Settings']) { await a.p.locator('[aria-label="Account"]').click(); await a.C(t, '#userPop'); a.obs('user-' + t, (await a.snap())); }
    await a.p.locator('[aria-label="Account"]').click(); await a.C('Log out', '#userPop'); a.obs('logout', await a.toast());
  },
  'NAV08 deep links creators/discover tab=0..5, invalid ids and tabs': async a => {
    for (const h of ['#/creators/cr1?tab=0', '#/creators/cr1?tab=1', '#/creators/cr1?tab=2', '#/creators/cr1?tab=3', '#/creators/cr1?tab=4', '#/creators/cr1?tab=5', '#/creators/cr3?tab=3', '#/discover/r0?tab=2', '#/creators/cr1?tab=9', '#/creators/cr1?tab=-1', '#/creators/cr1?tab=abc', '#/creators/nope', '#/discover/nope?tab=1', '#/bogus', '#/', '#/campaign/ca1?tab=creators', '#/campaign/nope', '#/plan/pl1', '#/plan/pl3?tab=creators', '#/plan/nope', '#/settings', '#/dashboard']) {
      await a.goHash(h); const s = await a.snap(); a.obs(h, { st: s.st, hash: s.hash, main: s.main.replace(/ /g, '').slice(0, 300) });
      await a.p.reload(); await a.p.waitForFunction(() => typeof S !== 'undefined'); await a.p.waitForTimeout(120); const s2 = await a.snap(); a.obs('reload ' + h, { st: s2.st, hash: s2.hash, main: s2.main.replace(/ /g, '').slice(0, 300) });
    }
  },
  'NAV09 browser back/forward after navigation': async a => {
    await a.nav('discover'); await a.nav('creators'); await a.goHash('#/creators/cr2?tab=1'); await a.goHash('#/campaign/ca1'); a.obs('s0', await a.st());
    await a.p.goBack(); await a.p.waitForTimeout(200); a.obs('back1', await a.st()); await a.p.goBack(); await a.p.waitForTimeout(200); a.obs('back2', await a.st()); await a.p.goForward(); await a.p.waitForTimeout(200); a.obs('fwd', await a.st());
  },
  'NAV10 rapid nav clicks (20x random) end state consistent': async a => {
    for (let i = 0; i < 20; i++) await a.p.locator(`.nav [data-page="${PAGES[(i * 5) % 6]}"]`).click({ delay: 0 });
    await a.p.waitForTimeout(200); a.obs('end', await a.snap());
  },
};
(async () => { const r = await runAll(S, process.argv[2]); report(r, 'nav'); })();

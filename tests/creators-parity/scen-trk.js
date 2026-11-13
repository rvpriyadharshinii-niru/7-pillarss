const { runAll, report } = require('./scen-lib');
const lv = a => a.ev(() => document.querySelector('[class*=ac-bar]') ? [...document.querySelectorAll('.ac-tab, .ac-lvl-tab')].map(t => t.innerText.replace(/\s+/g, ' ').trim()) : []);
const S = {
  'TRK01 load: levels, stack label, rows': async a => { await a.setPage('tracker'); a.obs('m', await a.m(900, 0)); a.obs('rows', await a.rows()); },
  'TRK02 level caret popover: pick each option (swap), breakdowns, close by outside click/Esc': async a => {
    await a.setPage('tracker'); for (let l = 1; l <= 4; l++) { await a.try('open L' + l, async () => { await a.A('Change what level ' + l + ' shows'); return a.ev(() => S.acPop); }); a.obs('pop L' + l, await a.p.locator('.ac-pop button:visible').allInnerTexts().then(t => t.map(x => x.replace(/\s+/g, ' ').trim()))); await a.key('Escape'); await a.p.mouse.click(5, 5); a.obs('closed L' + l, await a.ev(() => S.acPop)); }
    await a.setPage('tracker'); await a.try('swap', async () => { await a.A('Change what level 1 shows'); await a.p.waitForTimeout(150); await a.p.locator('.ac-pop button').filter({ hasText: 'Creators (Level 2' }).first().click({ timeout: 2000 }); await a.p.waitForTimeout(150); return { m: await a.m(300, 100), stack: await a.ev(() => document.querySelector('#main .ac-btn--stack').parentElement.innerText.replace(/\s+/g, ' ').slice(0, 140)) }; });
    await a.try('breakdown', async () => { await a.A('Change what level 1 shows'); await a.p.locator('.ac-pop button:visible').filter({ hasText: 'Category' }).first().click({ timeout: 2000 }); await a.p.waitForTimeout(150); return { m: await a.m(300, 100) }; });
  },
  'TRK03 [F3] remove level via x; hover must not move the caret target': async a => {
    await a.setPage('tracker'); const c = a.p.locator('[aria-label="Change what level 1 shows"]').first(); const b = await c.boundingBox(); await a.p.mouse.move(b.x + b.width / 2 - 150, b.y + b.height / 2); await a.p.waitForTimeout(150); await a.p.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 4 }); await a.p.waitForTimeout(250); await a.p.mouse.down(); await a.p.mouse.up(); await a.p.waitForTimeout(200);
    a.obs('caret click by mouse path', { pop: await a.ev(() => S.acPop), stack: await a.ev(() => document.querySelector('#main .ac-btn--stack').parentElement.innerText.replace(/\s+/g, ' ').slice(0, 100)) }); a.expect('click at caret opens the level menu', await a.ev(() => S.acPop), 'lvl0');
  },
  'TRK04 remove each level via x then restore via + (keyboard Enter), stack selector': async a => {
    await a.setPage('tracker'); for (const l of [4, 3, 2, 1]) { await a.try('remove ' + l, async () => { await a.A('Remove level ' + l); return { m: await a.m(250, 100), stack: await a.ev(() => document.querySelector('#main .ac-btn--stack').parentElement.innerText.replace(/\s+/g, ' ').slice(0, 110)) }; }); }
    await a.try('stack btn', async () => { await a.C('Stack'); return { m: await a.m(300, 100), pop: await a.ev(() => S.acPop) }; });
  },
  'TRK05 stack dropdown presets': async a => {
    await a.setPage('tracker'); await a.try('open', async () => { await a.p.locator('#main button.ac-btn--stack').first().click(); return a.p.locator('.ac-pop button:visible').allInnerTexts().then(t => t.map(x => x.replace(/\s+/g, ' ').trim())); });
    const items = await a.p.locator('.ac-pop button:visible').allInnerTexts(); for (let i = 0; i < Math.min(items.length, 8); i++) { await a.try('preset ' + i, async () => { if (!(await a.p.locator('.ac-pop').count())) await a.p.locator('#main button.ac-btn--stack').first().click(); await a.p.locator('.ac-pop button:visible').nth(i).click(); await a.p.waitForTimeout(120); return { stack: await a.ev(() => document.querySelector('#main .ac-btn--stack').parentElement.innerText.replace(/\s+/g, ' ').slice(0, 120)), rows: await a.rows() }; }); }
  },
  'TRK06 campaign selector (All campaigns) / filters panel / search': async a => {
    await a.setPage('tracker'); await a.try('all campaigns', async () => { await a.C('All campaigns'); return { pop: await a.ev(() => S.acPop), m: await a.m(300, 100) }; }); await a.key('Escape'); await a.p.mouse.click(5, 5);
    await a.try('filters', async () => { await a.C('Filters'); return { m: await a.m(500, 150) }; }); 
    for (const q of ['plix', 'maya', 'zzzzz', '', '@']) { await a.try('search ' + q, async () => { await a.p.locator('#main input[placeholder^="Search campaigns"]').fill(q); await a.p.waitForTimeout(120); return { rows: await a.rows(), m: await a.m(150, 400) }; }); }
  },
  'TRK07 Columns panel: groups, select all, toggle individual, reorder, persists': async a => {
    await a.setPage('tracker'); await a.try('open cols', async () => { await a.C('Columns'); return a.m(400, 150); }); const n0 = await a.count('#main thead th');
    await a.try('Planned group', () => a.C('Planned', '#main')); await a.try('toggle Followers', async () => { await a.p.locator('#main label:has-text("Followers") input, #main [aria-label="Followers"]').first().click({ timeout: 1500 }); return a.ev(() => [...document.querySelectorAll('#main thead th')].map(t => t.innerText.trim()).slice(0, 14).join(',')); });
    await a.try('select all', () => a.C('Select all')); a.obs('ths', await a.count('#main thead th') - n0);
  },
  'TRK08 tree view toggle + expand/collapse row + collapse all + selection + pin': async a => {
    await a.setPage('tracker'); await a.try('tree off', async () => { await a.C('Tree view'); return { rows: await a.rows(), tree: await a.ev(() => S.acTree) }; }); await a.try('tree on', async () => { await a.C('Tree view'); return { rows: await a.rows() }; });
    await a.try('expand r1', async () => { await a.A('Expand row', 0); return { rows: await a.rows() }; }); await a.try('expand r2', async () => { await a.A('Expand row', 1); return { rows: await a.rows() }; }); await a.try('collapse all', async () => { await a.C('Collapse all rows'); return { rows: await a.rows() }; });
    await a.try('select ca1', async () => { await a.A('Select ca1'); return a.ev(() => document.querySelector('.bulk-bar, [class*=sel-bar], [class*=ac-sel]') ? document.querySelector('.bulk-bar, [class*=sel-bar], [class*=ac-sel]').innerText.replace(/\s+/g, ' ').slice(0, 120) : 'nobar'); });
    await a.try('select all', async () => { await a.A('Select all'); return a.ev(() => document.querySelectorAll('#main tbody input[type=checkbox]:checked').length); });
    await a.try('unpin', async () => { await a.A('Unpin campaign', 0); return a.m(200, 400); }); await a.try('pin', async () => { await a.A('Pin campaign', 0); return a.m(200, 400); });
  },
  'TRK09 drill: click campaign name -> campaign detail, creator name -> profile; back': async a => {
    await a.setPage('tracker'); await a.try('campaign name', async () => { await a.C('Plix October Creator Launch', '#main tbody'); return { st: await a.st(), m: await a.m(120, 0) }; }); await a.setPage('tracker');
    await a.setPage('tracker'); await a.try('expand+creator', async () => { await a.A('Expand row', 0); await a.p.locator('#main tbody .ac-name button.ds-namebtn').nth(1).click({ timeout: 1500 }); await a.p.waitForTimeout(150); return { st: await a.st(), m: await a.m(150, 0) }; });
  },
  'TRK10 inline edit cells + Save view + Export CSV': async a => {
    await a.setPage('tracker'); await a.try('save view', async () => { await a.C('Save view'); return { lay: await a.lay(500), t: await a.toast() }; }); await a.try('save empty name', async () => { await a.p.locator('.ac-modal .ac-btn--primary').click(); return { t: await a.toast(), open: await a.ev(() => S.acSaveOpen) }; }); await a.try('save view name', async () => { await a.p.locator('#acVName').fill('My view ' + 'x'.repeat(50)); await a.p.locator('.ac-modal .ac-btn--primary').click(); await a.p.waitForTimeout(150); return { t: await a.toast(), open: await a.ev(() => S.acSaveOpen), m: await a.m(200, 0), saved: await a.ev(() => (S.acSaved || []).map(v => v.name.length)) }; }); await a.try('saved view in Stack menu', async () => { await a.p.locator('#main button.ac-btn--view').click(); return a.p.locator('.ac-pop button').allInnerTexts().then(t => t.map(x => x.replace(/\s+/g, ' ').trim())); }); await a.key('Escape'); await a.p.mouse.click(5, 5);
    await a.try('Export CSV', async () => { const [dl] = await Promise.all([a.p.waitForEvent('download', { timeout: 2500 }).catch(() => null), a.p.locator('#main [aria-label="Export CSV"], #main button.ac-btn--icon').first().click()]); return { t: await a.toast(), dl: dl ? dl.suggestedFilename().replace(/\d+/g, 'N') : null }; });
    await a.try('editable cells', async () => a.count('#main tbody input:not([type=checkbox]), #main tbody [contenteditable]')); await a.try('edit first number input', async () => { const i = a.p.locator('#main tbody input:not([type=checkbox]):visible').first(); await i.fill('1234', { timeout: 1500 }); await i.press('Enter'); await a.p.waitForTimeout(100); return a.m(150, 400); });
  },
  'TRK11 content review: Open post details from tracker / dashboard post drawer tabs': async a => {
    await a.goHash('#/campaign/ca1?tab=content'); await a.try('open post', async () => { await a.p.locator('#main [aria-label^="Open"], #main button:has-text("View post")').first().click({ timeout: 2000 }); await a.p.waitForTimeout(200); return { lay: await a.lay(500), hash: (await a.st()).hash }; });
    for (const t of ['Overview', 'Performance', 'Comments', 'Audience', 'Details']) await a.try('post tab ' + t, async () => { await a.C(t, '#layer'); return a.lay(200); });
    await a.try('close', async () => { await a.key('Escape'); if (await a.layerOpen()) await a.A('Close'); return { lay: await a.layerOpen(), hash: (await a.st()).hash }; });
    await a.goHash('#/dashboard?post=1'); a.obs('deeplink post', { lay: await a.lay(200), hash: (await a.st()).hash });
  },
};
(async () => { const r = await runAll(S, process.argv[2]); report(r, 'trk'); })();

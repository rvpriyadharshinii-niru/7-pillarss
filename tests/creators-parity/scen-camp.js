const { runAll, report } = require('./scen-lib');
const camps = a => a.ev(() => CAMP_LIST.map(c => c.name + ':' + c.status + ':' + c.creatorIds.length + ':' + c.posts.length));
const plans = a => a.ev(() => CAMP_PLANS.map(c => c.name + ':' + (c.stage || '') + ':' + c.creators.length));
const S = {
  'CAMP01 tabs Draft/Active/Completed counts + list parity': async a => {
    await a.setPage('campaigns'); for (const t of ['Draft', 'Active', 'Completed']) { await a.p.locator(`#main button:has-text("${t}")`).first().click(); await a.p.waitForTimeout(100); a.obs('tab ' + t, { tab: await a.ev(() => S.campTab), rows: await a.rows(), m: await a.m(300, 200) }); }
  },
  'CAMP02 search, sort, Table/Cards, Columns on My campaigns': async a => {
    await a.setPage('campaigns'); for (const q of ['plix', 'zzz', '', 'x'.repeat(200)]) { await a.fillA('Search campaigns', q); a.obs('q=' + q.slice(0, 5), { rows: await a.rows(), m: await a.m(150, 250) }); }
    await a.C('Cards'); a.obs('cards', await a.m(300, 250)); await a.C('Table'); await a.C('Columns'); a.obs('cols', await a.m(300, 250)); await a.key('Escape'); await a.C('Sort: Last updated'); a.obs('sort', await a.m(300, 250));
  },
  'CAMP03 pin/unpin, row more-options menu, select + bulk': async a => {
    await a.setPage('campaigns'); await a.A('Pin campaign', 0); a.obs('pinned', await a.m(200, 250)); await a.A('Unpin campaign', 0); a.obs('unpinned', await a.m(200, 250));
    await a.A('More options for Plix October Creator Launch'); a.obs('menu', await a.p.locator('#main [role=menuitem]:visible').allInnerTexts()); await a.key('Escape'); await a.A('Select Plix October Creator La'.slice(0, 0) || 'Select Night Repair Launch'); a.obs('sel', await a.m(300, 250));
  },
  'CAMP04 New campaign wizard: validation, step 1 -> 2, all fields, create, result in lists': async a => {
    await a.setPage('campaigns'); const before = await camps(a); await a.C('New campaign'); await a.C('Next: creators', '#layer'); a.obs('empty next', { t: await a.toast(), lay: await a.lay(120) });
    const f = a.p.locator('#layer input:not([type=number]):not([type=checkbox]):not([type=radio])').first(); await f.fill('Auto Test Campaign ' + 'Z'.repeat(60)); await a.p.locator('#layer input[type=number]').first().fill('15').catch(() => {}); await a.C('Engagement', '#layer'); await a.C('25–34', '#layer'); await a.C('Women', '#layer'); await a.C('Reel', '#layer'); await a.C('Story', '#layer');
    const txts = a.p.locator('#layer input[type=text], #layer textarea'); const n = await txts.count(); for (let i = 1; i < n; i++) await txts.nth(i).fill('v' + i + ', w' + i).catch(() => {});
    a.obs('filled', await a.lay(700)); await a.C('Next: creators', '#layer'); a.obs('step2', await a.lay(700)); a.obs('step2 buttons', await a.p.locator('#layer button:visible').allInnerTexts());
  },
  'CAMP05 wizard step 2: Back, Cancel/Esc/X mid-flow, re-enter keeps/clears state': async a => {
    await a.setPage('campaigns'); await a.C('New campaign'); await a.p.locator('#layer input[type=text]').first().fill('Half Done'); await a.C('Cancel', '#layer'); a.obs('cancel', await a.layerOpen()); await a.C('New campaign'); a.obs('reopen name', await a.ev(() => document.querySelector('#layer input[type=text]').value));
    await a.key('Escape'); a.obs('esc', await a.layerOpen()); await a.C('New campaign'); await a.A('Close'); a.obs('x', await a.layerOpen()); a.obs('camps unchanged', (await camps(a)).length);
  },
  'CAMP06 wizard full create (no creators) -> campaign appears; with creators': async a => {
    await a.setPage('campaigns'); const before = (await camps(a)).length, pb = (await plans(a)).length; await a.C('New campaign'); await a.p.locator('#layer input[type=text]').first().fill('Created via wizard'); await a.C('Next: creators', '#layer'); a.obs('s2', await a.lay(500));
    const btns = await a.p.locator('#layer button:visible').allInnerTexts(); a.obs('btns', btns);
    for (const lab of ['Create campaign', 'Create', 'Skip', 'Create without creators', 'Create draft']) { const l = a.p.locator(`#layer button:visible:has-text(${JSON.stringify(lab)})`); if (await l.count()) { await l.first().click(); await a.p.waitForTimeout(200); a.obs('clicked ' + lab, { t: await a.toast(), st: await a.st(), camps: (await camps(a)).length - before, plans: (await plans(a)).length - pb, m: await a.m(200) }); break; } }
    await a.setPage('campaigns'); a.obs('lists', { camps: await camps(a), plans: await plans(a) });
  },
  'CAMP07 Import legacy campaign dialog': async a => { await a.setPage('campaigns'); await a.C('Import legacy campaign'); a.obs('dlg', await a.lay(500)); a.obs('btns', await a.p.locator('#layer button:visible').allInnerTexts()); await a.key('Escape'); a.obs('esc', await a.layerOpen()); },
  'CAMP08 open active campaign: all tabs, filters': async a => {
    await a.goHash('#/campaign/ca1'); a.obs('overview', await a.m(500, 0)); const tabs = await a.p.locator('#header button, #main button').filter({ hasText: /^(Overview|Creators \(\d+\)|Content \(\d+\)|Analytics)$/ }).allInnerTexts(); a.obs('tabs', tabs);
    for (const t of ['Creators', 'Content', 'Analytics', 'Overview']) { await a.p.locator('#main button, #header button').filter({ hasText: new RegExp('^' + t) }).first().click(); await a.p.waitForTimeout(120); a.obs('tab ' + t, { st: (await a.st()).hash, m: await a.m(400, 150) }); }
  },
  'CAMP09 campaign page controls: Brief, Tracking configuration, more, back': async a => {
    await a.goHash('#/campaign/ca1'); for (const t of ['Brief', 'Tracking configuration', '⋯']) { try { await a.C(t, '#main'); } catch (e) { a.obs('missing ' + t, 1); continue; } a.obs('after ' + t, { t: await a.toast(), lay: await a.lay(400), m: await a.m(100, 0) }); await a.key('Escape'); if (await a.layerOpen()) await a.ev(() => closeLayer()); }
    await a.A('Back to Campaigns', 0).catch(async () => { await a.p.locator('#header button, #main button').first().click(); }); a.obs('back', await a.st());
  },
  'CAMP10 completed campaign + draft(plan) open': async a => {
    await a.goHash('#/campaign/ca2'); a.obs('completed', await a.m(500, 0)); await a.goHash('#/plan/pl1'); a.obs('plan pl1', await a.m(600, 0)); await a.goHash('#/plan/pl4'); a.obs('plan pl4 (new)', await a.m(600, 0)); await a.goHash('#/plan/pl5'); a.obs('plan pl5 (approved)', await a.m(600, 0)); await a.goHash('#/plan/pl6'); a.obs('plan pl6 (rejected)', await a.m(600, 0));
  },
  'CAMP11 plan detail tabs + buttons (each plan: click every top-level control once)': async a => {
    for (const pl of ['pl1', 'pl3', 'pl4']) {
      await a.goHash('#/plan/' + pl); const labels = await a.ev(() => [...document.querySelectorAll('#main button, #header button')].filter(b => b.offsetParent).map(b => (b.getAttribute('aria-label') || b.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40))); a.obs(pl + ' labels', labels);
      for (let i = 0; i < Math.min(labels.length, 25); i++) { const l = a.p.locator('#main button:visible, #header button:visible').nth(i); await l.click({ timeout: 1500 }).catch(() => {}); await a.p.waitForTimeout(70); const s = await a.st(); const lay = await a.layerOpen(); a.obs(`${pl} b${i} ${labels[i]}`, { page: s.page, hash: s.hash, lay: lay ? await a.lay(120) : 0, t: await a.toast() }); if (lay) { await a.key('Escape'); if (await a.layerOpen()) await a.ev(() => closeLayer()); } if (s.page !== 'plan' || !s.hash.includes(pl)) await a.goHash('#/plan/' + pl); }
    }
  },
  'CAMP12 plan approval: Launch campaign dialog for each plan (blockers vs ok), Review plan, Approve plan, stage + lists': async a => {
    for (const pl of ['pl1', 'pl2', 'pl3', 'pl4', 'pl5', 'pl6', 'pl8']) {
      await a.goHash('#/plan/' + pl); await a.C('Launch campaign', '#main, #header'); a.obs(pl + ' dlg', { lay: await a.lay(700), dis: await a.ev(() => { const b = document.querySelector('#layer .ds-btn--primary'); return b ? b.disabled : null; }), stage: await a.ev(id => CAMP_PLANS.find(p => p.id === id).stage, pl) });
      const ok = await a.ev(() => { const b = document.querySelector('#layer .ds-btn--primary'); return b && !b.disabled && /Approve/.test(b.innerText); });
      if (ok) { await a.p.locator('#layer .ds-btn--primary').click(); await a.p.waitForTimeout(200); a.obs(pl + ' approved', { t: await a.toast(), stage: await a.ev(id => CAMP_PLANS.find(p => p.id === id).stage, pl), st: await a.st(), m: await a.m(300, 0), nCamp: (await camps(a)).length }); }
      else if ((await a.lay(2000)).includes('launchcampaignfromshortlisted')) { await a.try(pl + ' wizard name', () => a.p.locator('#layer input').first().fill('Launched from ' + pl)); await a.try(pl + ' next', () => a.C('Next', '#layer')); a.obs(pl + ' wiz step2', await a.lay(600)); await a.try(pl + ' create', async () => { await a.p.locator('#layer .ds-btn--primary').last().click(); await a.p.waitForTimeout(200); return { t: await a.toast(), st: await a.st(), n: (await camps(a)).length }; }); }
      else { await a.try(pl + ' review plan', () => a.C('Review plan', '#layer')); a.obs(pl + ' after review', { st: await a.st(), lay: await a.layerOpen() }); }
    }
    a.obs('final plans', await plans(a)); await a.setPage('campaigns'); a.obs('lists', await a.m(300, 200));
  },
  'CAMP12b plan approval: invalidated after editing creators/cost (invalidatePlanApproval)': async a => {
    await a.goHash('#/plan/pl5'); a.obs('before', await a.ev(() => CAMP_PLANS.find(p => p.id === 'pl5').stage)); await a.A('Edit cost for ' + await a.ev(() => crOf(CAMP_PLANS.find(p => p.id === 'pl5').shortlisted[0] || CAMP_PLANS.find(p => p.id === 'pl5').creators[0]).name)).catch(e => a.obs('no edit btn', 1));
    const inp = a.p.locator('#main input[type=number]:visible').first(); if (await inp.count()) { await inp.fill('99999'); await inp.press('Enter'); await a.p.waitForTimeout(150); } a.obs('after edit', { stage: await a.ev(() => CAMP_PLANS.find(p => p.id === 'pl5').stage), t: await a.toast() });
    await a.C('Add creators'); a.obs('add creators', await a.lay(300)); 
  },
  'CAMP13 Compare plans: select two draft plans -> compare dialog; 3rd selection behaviour; clear': async a => {
    await a.setPage('campaigns'); await a.p.locator('#main button:has-text("Draft")').first().click(); a.obs('compare disabled', await a.ev(() => [...document.querySelectorAll('#main button')].find(b => /Compare plans/.test(b.innerText)).disabled));
    const cbs = a.p.locator('#main input[type=checkbox][aria-label*="plan comparison"]'); a.obs('n cbs', await cbs.count());
    await cbs.nth(0).check(); a.obs('1 sel', await a.ev(() => S.planCompareIds)); await cbs.nth(1).check(); a.obs('2 sel', await a.ev(() => S.planCompareIds)); a.obs('3rd enabled', await cbs.nth(2).isEnabled()); await a.try('check3', () => cbs.nth(2).check({ timeout: 1500 })); a.obs('3 sel', await a.ev(() => S.planCompareIds));
    await a.C('Compare plans'); a.obs('compare dlg', await a.lay(900)); await a.C('Cancel', '#layer'); await a.try('uncheck', () => cbs.nth(2).uncheck({ timeout: 1500 })); a.obs('after uncheck', await a.ev(() => S.planCompareIds));
  },
  'CAMP13b plan costing sheet: edit cost/note/budget, Score all, row menu, bulk remove/status': async a => {
    await a.goHash('#/plan/pl1'); await a.A('Edit cost for Kylie'); a.obs('cost editor', await a.ev(() => document.activeElement && document.activeElement.outerHTML.slice(0, 120)));
    const inp = a.p.locator('#main input:visible').first(); await inp.fill('12345'); await inp.press('Enter'); await a.p.waitForTimeout(120); a.obs('cost saved', await a.m(200, 400)); a.obs('sidebar', await a.ev(() => (document.querySelector('.pl-side, aside') || {}).innerText));
    await a.C('Score all creators'); a.obs('score all', { t: await a.toast(), lay: await a.lay(200) });
    await a.try('row menu', async () => { await a.A('More actions for Kylie'); return a.p.locator('[role=menuitem]:visible').allInnerTexts(); }); await a.key('Escape');
    for (const t of ['Brief', 'Expected outcome', 'Tags', 'All creators']) { await a.p.locator('#main button').filter({ hasText: new RegExp('^' + t) }).first().click(); await a.p.waitForTimeout(100); a.obs('ptab ' + t, { st: (await a.st()).hash, m: await a.m(300, 200) }); }
  },
  'CAMP14 Create campaign from plan (Draft tab row action)': async a => {
    await a.setPage('campaigns'); await a.p.locator('#main button:has-text("Draft")').first().click(); const before = (await camps(a)).length; await a.C('Create campaign', '#main'); await a.p.waitForTimeout(200); a.obs('after', { st: await a.st(), lay: await a.lay(400), t: await a.toast(), camps: (await camps(a)).length - before });
  },
  'CAMP15 add posts to campaign (content tab) + counts propagate': async a => {
    await a.goHash('#/campaign/ca1?tab=content'); a.obs('content', await a.m(500, 0)); a.obs('btns', await a.p.locator('#main button:visible').allInnerTexts().then(x => x.map(t => t.trim()).filter(Boolean).slice(0, 40)));
    for (const t of ['Add post', 'Add posts', 'Add content', 'Add manually', 'Import posts']) { const l = a.p.locator(`#main button:visible:has-text(${JSON.stringify(t)})`); if (await l.count()) { await l.first().click(); await a.p.waitForTimeout(150); a.obs('clicked ' + t, { lay: await a.lay(500), t: await a.toast() }); a.obs('dlg fields', await a.ev(() => [...document.querySelectorAll('#layer input,#layer select,#layer textarea')].map(i => (i.getAttribute('aria-label') || i.placeholder || i.name || i.id || i.type)))); break; } }
  },
};
(async () => { const r = await runAll(S, process.argv[2]); report(r, 'camp'); })();

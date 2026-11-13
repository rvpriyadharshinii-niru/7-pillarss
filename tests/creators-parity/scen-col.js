const { runAll, report } = require('./scen-lib');
const colNames = a => a.ev(() => CREATOR_COLLECTIONS.map(c => c.name + ':' + c.creatorIds.length));
const S = {
  'COL01 collections list: cards/table toggle, counts': async a => {
    await a.setPage('collections'); a.obs('cards', await a.m(500, 0)); a.expect('3 cards', await a.count('#main .col-card'), 3); await a.C('Table'); a.obs('table', await a.m(500, 0)); await a.C('Cards'); a.obs('cards again', await a.count('#main .col-card'));
  },
  'COL02 create collection: empty name warns, valid, long, dup, special chars; list + persistence': async a => {
    await a.setPage('collections'); await a.C('New collection'); a.obs('dlg', await a.lay(300));
    await a.p.locator('#layer .ds-btn--primary').click(); a.obs('empty', { t: await a.toast(), lay: await a.layerOpen() });
    await a.p.fill('#newColName', 'Alpha <b>x</b>'); await a.p.fill('#newColDesc', 'd'.repeat(500)); await a.p.locator('#layer .ds-btn--primary').click(); a.obs('created', { t: await a.toast(), names: await colNames(a), tot: await a.m(60, 100) });
    for (const nm of ['Alpha <b>x</b>', 'N'.repeat(200), '   spaced   ']) { await a.C('New collection'); await a.p.fill('#newColName', nm); await a.p.locator('#layer .ds-btn--primary').click(); }
    a.obs('after 3 more', await colNames(a)); a.obs('list text', await a.m(500, 100));
    await a.p.reload(); await a.p.waitForTimeout(250); await a.setPage('collections'); a.obs('persist after reload', await colNames(a));
  },
  'COL03 create dialog cancel / x / esc': async a => {
    await a.setPage('collections'); await a.C('New collection'); await a.C('Cancel', '#layer'); a.obs('cancel', await a.layerOpen()); await a.C('New collection'); await a.A('Close'); a.obs('x', await a.layerOpen()); await a.C('New collection'); await a.key('Escape'); a.obs('esc', await a.layerOpen());
  },
  'COL04 open collection, note tip (edit/got it/close), table, back crumb': async a => {
    await a.setPage('collections'); await a.C('Skincare creators', '#main'); a.obs('detail', { st: await a.st(), m: await a.m(500, 0) }); a.obs('note pop', await a.count('.tip-pop'));
    await a.C('Got it'); a.obs('got it', await a.count('.tip-pop')); await a.A('About this page'); a.obs('reopen', await a.count('.tip-pop')); await a.C('Edit', '.tip-pop'); a.obs('edit', await a.lay(300)); await a.key('Escape'); await a.ev(() => closeLayer()); await a.C('Collections', '#header .crumb, #main .crumb, #main'); a.obs('back', await a.st());
  },
  'COL05 detail: Manage creators dialog (toggle, save, cancel) updates counts': async a => {
    await a.ev(() => { setPage('collections'); openCollection('col-skincare'); }); await a.p.waitForTimeout(150); await a.C('Manage creators'); a.obs('dlg', await a.lay(250)); const n0 = await a.count('#layer input.col-choice');
    await a.p.locator('#layer input.col-choice').nth(5).check(); await a.p.locator('#layer input.col-choice').first().uncheck(); await a.C('Cancel', '#layer'); a.obs('cancel keeps', await colNames(a));
    await a.C('Manage creators'); await a.p.locator('#layer input.col-choice').nth(5).check(); await a.p.locator('#layer input.col-choice').first().uncheck(); await a.C('Save', '#layer'); a.obs('saved', await colNames(a)); a.obs('n choices', n0); a.obs('detail', await a.m(300, 300)); await a.setPage('collections'); a.obs('list count', await a.m(200, 100));
  },
  'COL06 detail: select creators, Copy to collection, remove creator via Actions menu': async a => {
    await a.ev(() => { setPage('collections'); openCollection('col-skincare'); }); await a.p.waitForTimeout(150); await a.C('Copy to collection'); a.obs('none selected', await a.toast());
    await a.A('Select Pavan K Sirisin'); await a.A('Select Marques'); a.obs('[orig quirk] selection store', await a.ev(() => [S.collectionSelected, S.mySel])); await a.C('Copy to collection'); a.obs('copy w/ row selection', { t: await a.toast(), lay: await a.layerOpen() });
    await a.ev(() => { S.collectionSelected = ['cr1', 'cr5']; }); await a.C('Copy to collection'); a.obs('copy dlg', await a.lay(300)); await a.p.locator('#colCopyTarget').selectOption('col-micro'); await a.p.locator('#layer .ds-btn--primary').click(); a.obs('copied', { t: await a.toast(), cols: await colNames(a) });
    await a.C('Add to', '.bulk-bar'); await a.C('Collection', '.bulk-bar'); a.obs('bulk add dlg', await a.lay(300));
    await a.ev(() => closeLayer()); await a.A('Actions for Priyanka'); a.obs('menu', await a.p.locator('#main [role=menuitem]:visible').allInnerTexts()); 
  },
  'COL07 Move to campaign dialog from list: tabs, radios, add to new, cancel, apply': async a => {
    await a.setPage('collections'); await a.C('Move to campaign', '#main .col-card'); a.obs('dlg', await a.lay(400)); for (const t of ['Live', 'Draft']) { await a.C(t, '#layer'); a.obs('tab ' + t, await a.lay(300)); }
    await a.C('Cancel', '#layer'); a.obs('cancel', await a.layerOpen()); await a.C('Move to campaign', '#main .col-card'); await a.p.locator('#layer input[type=radio]').nth(2).check(); a.obs('picked', await a.lay(200)); await a.p.locator('#layer .ds-btn--primary').last().click(); await a.p.waitForTimeout(200); a.obs('applied', { t: await a.toast(), st: await a.st(), m: await a.m(200) });
  },
  'COL08 detail Add to campaign ->': async a => {
    await a.ev(() => { setPage('collections'); openCollection('col-micro'); }); await a.p.waitForTimeout(150); await a.C('Add to campaign →'); a.obs('dlg', await a.lay(300)); await a.C('Plix October Creator Launch', '#layer'); a.obs('picked', await a.lay(200)); await a.p.locator('#layer .ds-btn--primary').last().click(); await a.p.waitForTimeout(200); a.obs('after', { t: await a.toast(), st: await a.st(), m: await a.m(300), lay: await a.lay(300) });
  },
  'COL09 delete collection: cancel, confirm, from detail; empty state; persistence': async a => {
    await a.setPage('collections'); await a.A('More actions for Skincare creators'); await a.C('Delete collection'); a.obs('dlg', await a.lay(300)); await a.C('Cancel', '#layer'); a.obs('cancel', await colNames(a));
    await a.A('More actions for Skincare creators'); await a.C('Delete collection'); await a.p.locator('#layer .ds-btn--danger').click(); await a.p.waitForTimeout(100); a.obs('deleted', { t: await a.toast(), n: await colNames(a) });
    for (const nm of ['Micro creators · India', 'Past collaborators']) { await a.A('More actions for ' + nm); await a.C('Delete collection'); await a.p.locator('#layer .ds-btn--danger').click(); await a.p.waitForTimeout(100); }
    a.obs('empty', await a.m(400, 0)); await a.p.reload(); await a.p.waitForTimeout(250); await a.setPage('collections'); a.obs('persist', await a.m(300, 0));
    await a.ev(() => { CREATOR_COLLECTIONS.push({ id: 'x', name: 'Z', description: '', creatorIds: [] }); openCollection('x'); }); await a.p.waitForTimeout(100); a.obs('empty detail', await a.m(500, 0));
  },
  'COL10 delete from detail view navigates to list': async a => {
    await a.ev(() => { setPage('collections'); openCollection('col-repeat'); }); await a.p.waitForTimeout(150); const before = await a.p.locator('#main button').allInnerTexts(); a.obs('detail buttons', before);
    await a.ev(() => collectionDeleteDialog('col-repeat')); await a.p.locator('#layer .ds-btn--danger').click(); await a.p.waitForTimeout(150); a.obs('after', { st: await a.st(), t: await a.toast(), n: await colNames(a) });
  },
  'COL11 cross-link: add creator to collection from My creators row then see in collection + list counts': async a => {
    await a.setPage('creators'); await a.p.locator('#main tbody tr').nth(2).locator('summary').click(); await a.C('Collection', '#main tbody tr'); await a.p.selectOption('#layer select, #layer [role=listbox]', { index: 1 }).catch(() => {}); a.obs('dlg', await a.lay(300)); const prim = a.p.locator('#layer .ds-btn--primary').last(); await prim.click(); await a.p.waitForTimeout(150); a.obs('t', await a.toast()); a.obs('cols', await colNames(a));
    await a.setPage('collections'); a.obs('list', await a.m(250, 100));
  },
};
(async () => { const r = await runAll(S, process.argv[2]); report(r, 'col'); })();

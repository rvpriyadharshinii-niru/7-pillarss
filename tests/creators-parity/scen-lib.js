// Scenario runner: every scenario runs on BOTH builds with the same script; observations are compared, assertions are checked on each.
const L = require('./lib'); const fs = require('fs');
const sleep = (p, ms = 120) => p.waitForTimeout(ms);
function mk(p) {
  const o = { obs: [], asserts: [] };
  const api = {
    p, o,
    obs: (k, v) => o.obs.push([k, typeof v === 'string' ? L.norm(v) : v]),
    expect: (k, got, want) => o.asserts.push({ k, ok: JSON.stringify(got) === JSON.stringify(want), got, want }),
    truthy: (k, v) => o.asserts.push({ k, ok: !!v, got: v, want: 'truthy' }),
    ev: (f, a) => p.evaluate(f, a),
    // real (non-forced) click on first visible element in scope whose text matches
    C: async (txt, scope = '#layer, #main', opt = {}) => {
      const sel = ['button', 'a', 'summary', '[role=tab]', '[role=menuitem]', '[onclick]', 'label'];
      const loc = p.locator(scope).locator(sel.map(s => `${s}:visible:has-text(${JSON.stringify(txt)})`).concat([`[aria-label=${JSON.stringify(txt)}]:visible`]).join(', '));
      const n = await loc.count(); if (!n) throw new Error('no clickable with text ' + txt + ' in ' + scope);
      // prefer exact text match
      let pick = loc.first();
      for (let i = 0; i < Math.min(n, 30); i++) { const t = L.norm((await loc.nth(i).innerText().catch(() => '')) || (await loc.nth(i).getAttribute('aria-label').catch(() => '')) || ''); if (t === L.norm(txt)) { pick = loc.nth(i); break; } }
      await pick.click({ timeout: 3000, ...opt }); await sleep(p, 90); return true;
    },
    A: async (aria, i = 0) => { const l = p.locator(`[aria-label=${JSON.stringify(aria)}]:visible`).nth(i); await l.click({ timeout: 3000 }); await sleep(p, 90); },
    fillA: async (aria, v, i = 0) => { const l = p.locator(`[aria-label=${JSON.stringify(aria)}]:visible`).nth(i); await l.fill(v, { timeout: 3000 }); await sleep(p, 90); },
    nav: async (page) => { await p.locator(`.nav [data-page="${page}"]`).click(); await sleep(p, 150); },
    snap: () => L.snap(p),
    m: async (n = 300, from = 0) => (await L.snap(p)).main.replace(/ /g, '').slice(from, from + n),
    lay: async (n = 300) => (await L.snap(p)).layer.replace(/ /g, '').slice(0, n),
    rows: () => p.locator('#main tbody tr:visible').count(),
    setPage: async pg => { await p.evaluate(pg => setPage(pg), pg); await sleep(p, 150); },
    main: async () => (await L.snap(p)).main,
    st: () => p.evaluate(() => ({ page: S.page, myCreator: S.myCreator, discCreator: S.discCreator, tab: S.tab, campId: S.campId, planId: S.planId, hash: location.hash })),
    count: (sel) => p.locator(sel).count(),
    visCount: (sel) => p.locator(sel + ':visible').count(),
    toast: () => p.evaluate(() => [...document.querySelectorAll('.toast')].map(t => t.innerText.replace(/\s+/g, ' ').trim().toLowerCase()).join('|')),
    layerOpen: () => p.evaluate(() => [...document.getElementById('layer').children].filter(c => !c.classList.contains('toast') && c.tagName !== 'STYLE').length),
    sel: (sel, v) => p.locator(sel).first().selectOption(v),
    key: k => p.keyboard.press(k),
    goHash: async h => { await p.evaluate(h => { location.hash = h; }, h); await sleep(p, 200); },
  };
  return api;
}
async function runAll(scenarios, only) {
  const results = {};
  await L.withBrowser(async B => {
    for (const [name, fn] of Object.entries(scenarios)) {
      if (only && !name.match(only)) continue;
      results[name] = {};
      for (const w of ['orig', 'neu']) {
        const p = await L.newPage(B, w); const api = mk(p);
        try { await fn(api, w); results[name][w] = { ...api.o, errs: p.__errs.slice(0, 5) }; }
        catch (e) { results[name][w] = { ...api.o, crash: e.message.split('\n')[0].slice(0, 160) + ' @' + (e.stack.split('\n').find(l => /scen-/.test(l)) || '').replace(/.*\//, ''), errs: p.__errs.slice(0, 5) }; }
        await p.__ctx.close();
      }
    }
  });
  return results;
}
function report(results, tag) {
  const rows = []; let fails = 0;
  for (const [name, r] of Object.entries(results)) {
    const issues = [];
    for (const w of ['orig', 'neu']) {
      if (r[w].crash) issues.push(`${w} CRASH: ${r[w].crash}`);
      (r[w].asserts || []).filter(a => !a.ok).forEach(a => issues.push(`${w} ASSERT ${a.k}: got ${JSON.stringify(a.got).slice(0, 120)} want ${JSON.stringify(a.want).slice(0, 120)}`));
      (r[w].errs || []).filter(e => !/ERR_FAILED/.test(e)).forEach(e => issues.push(`${w} CONSOLE: ${e.slice(0, 150)}`));
    }
    const oo = r.orig.obs || [], nn = r.neu.obs || [];
    for (let i = 0; i < Math.max(oo.length, nn.length); i++) {
      const a = oo[i], b = nn[i];
      if (!a || !b || a[0] !== b[0] || !L.same(a[1], b[1])) { issues.push(`PARITY ${(a || b)[0]}: orig=${JSON.stringify(a && a[1]).slice(0, 160)} neu=${JSON.stringify(b && b[1]).slice(0, 160)}`); }
    }
    if (issues.length) fails++;
    rows.push({ name, status: issues.length ? 'FAIL' : 'PASS', n: (oo.length) + '/' + (r.orig.asserts || []).length, issues });
  }
  rows.forEach(r => { console.log((r.status + ' ').slice(0, 5), r.name, `(obs/asserts ${r.n})`); r.issues.forEach(i => console.log('      -', i)); });
  console.log(`\n${rows.length - fails}/${rows.length} passed`);
  fs.writeFileSync(`/tmp/claude-0/scen-${tag}.json`, JSON.stringify(results));
}
module.exports = { runAll, report, sleep };

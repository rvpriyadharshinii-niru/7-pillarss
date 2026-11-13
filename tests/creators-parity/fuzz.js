// Seeded random-walk parity fuzzer. Same seed drives both builds; compares snapshot after every step.
// usage: node fuzz.js <seedFrom> <seedTo> [steps=60] [startHash]
const fs = require('fs'); const L = require('./lib');
const [sf, st, steps = 60] = process.argv.slice(2).map(Number);
const mulberry = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const TEXTS = ['', 'a', 'Mamaearth', 'x'.repeat(300), '<b>bold</b>"\'&', '1e9', '-5', '   ', 'Ünïcödé 🎉', '0'];
const NAVS = ['discover', 'creators', 'collections', 'dashboard', 'campaigns', 'tracker'];
const CMP = ['hash', 'st', 'toast', 'layer', 'header', 'main', 'navOn', 'rail', 'pops', 'nOpen'];
async function walk(B, seed) {
  const rnd = mulberry(seed);
  const pg = { orig: await L.newPage(B, 'orig'), neu: await L.newPage(B, 'neu') };
  const log = []; let res = { seed, steps: 0, diff: null, errs: [] };
  try {
    for (let i = 0; i < steps; i++) {
      const r = rnd(); let desc, ok = {};
      if (i === 0 || r < 0.04) { const n = NAVS[Math.floor(rnd() * NAVS.length)]; desc = 'nav:' + n; for (const w of ['orig', 'neu']) await pg[w].evaluate(n => document.querySelector('.nav [data-page="' + n + '"]').click(), n); }
      else if (r < 0.10) { desc = 'escape'; for (const w of ['orig', 'neu']) await pg[w].keyboard.press('Escape'); }
      else if (r < 0.13) { desc = 'back'; for (const w of ['orig', 'neu']) { await pg[w].goBack().catch(() => {}); if (!(await pg[w].evaluate(() => !!document.getElementById('layer')).catch(() => false))) await pg[w].goForward().catch(() => {}); } }
      else if (r < 0.15) { desc = 'forward'; for (const w of ['orig', 'neu']) { await pg[w].goForward().catch(() => {}); if (!(await pg[w].evaluate(() => !!document.getElementById('layer')).catch(() => false))) await pg[w].goBack().catch(() => {}); } }
      else if (r < 0.17) { desc = 'reload'; for (const w of ['orig', 'neu']) { await pg[w].reload(); await pg[w].waitForFunction(() => typeof S !== 'undefined' && document.getElementById('main').innerHTML.length > 50); } }
      else if (r < 0.19) { desc = 'closeLayer'; for (const w of ['orig', 'neu']) await pg[w].evaluate(() => closeLayer()); }
      else {
        const ko = await L.enumerate(pg.orig), kn = await L.enumerate(pg.neu);
        if (!ko.length) { desc = 'no-keys'; }
        else {
          // prefer in-layer elements (dialogs) 60% of time when present
          const lay = ko.filter(k => k[0] === 'L');
          const pool = lay.length && rnd() < 0.7 ? lay : ko;
          const key = pool[Math.floor(rnd() * pool.length)];
          const txt = TEXTS[Math.floor(rnd() * TEXTS.length)];
          desc = 'click:' + key + '|' + txt.slice(0, 8);
          if (!kn.includes(key)) { res.diff = { step: i, desc, kind: 'key-missing-in-new', keysOnlyOrig: ko.filter(k => !kn.includes(k)).slice(0, 5), keysOnlyNew: kn.filter(k => !ko.includes(k)).slice(0, 5) }; break; }
          const locs = {}, infos = {};
          for (const w of ['orig', 'neu']) { locs[w] = pg[w].locator('[data-cz="' + key.replace(/"/g, '\\"') + '"]').first(); infos[w] = await locs[w].evaluate(e => ({ tag: e.tagName, type: e.type })).catch(() => null); }
          const isTyping = i0 => i0 && (i0.tag === 'TEXTAREA' || (i0.tag === 'INPUT' && ['text', 'search', '', 'email', 'url', 'number', 'date'].includes(i0.type)));
          // dry-run: only act if the element is genuinely actionable in BOTH builds (no force-click through overlays)
          for (const w of ['orig', 'neu']) { ok[w] = 'ok'; if (!infos[w]) { ok[w] = 'gone'; continue; } if (infos[w].tag !== 'SELECT' && !isTyping(infos[w])) { try { await locs[w].click({ trial: true, timeout: 800 }); } catch (e) { ok[w] = 'blocked'; } } }
          if (ok.orig !== ok.neu) { (res.noise = res.noise || []).push({ step: i, desc, ok }); desc += ' [SKIPPED actionable-mismatch ' + JSON.stringify(ok) + ']'; ok = {}; }
          else if (ok.orig === 'ok') for (const w of ['orig', 'neu']) {
            const loc = locs[w], info = infos[w];
            try {
              if (info.tag === 'SELECT') { const vals = await loc.evaluate(e => [...e.options].map(o => o.value)); await loc.selectOption(vals[(seed + i) % vals.length], { timeout: 1000 }); }
              else if (isTyping(info)) { if (info.type === 'date') await loc.fill('2026-11-20', { timeout: 1000 }).catch(() => {}); else await loc.fill(info.type === 'number' ? (/^-?[\d.e]+$/.test(txt) ? txt : '5') : txt, { timeout: 1000 }); }
              else await loc.click({ timeout: 1000, noWaitAfter: true });
            } catch (e) { ok[w] = 'err'; }
            await pg[w].mouse.move(0, 0);
          }
          if (ok.orig !== ok.neu) { res.diff = { step: i, desc, kind: 'action-result', ok }; break; }
        }
      }
      for (const w of ['orig', 'neu']) await pg[w].waitForTimeout(40);
      const so = await L.snap(pg.orig), sn = await L.snap(pg.neu);
      log.push(desc); res.steps = i + 1; { const en = pg.orig.__errs.length + pg.neu.__errs.length; if (en !== (res._en || 0)) { (res.errAt = res.errAt || []).push([i, desc]); res._en = en; } }
      const bad = CMP.filter(f => !L.same(so[f], sn[f]));
      if (bad.length) { res.diff = { step: i, desc, kind: 'snapshot', fields: bad.map(f => ['main', 'layer', 'header'].includes(f) ? { f, ...L.wordDiff(String(so[f]), String(sn[f])) } : { f, o: so[f], n: sn[f] }) }; break; }
    }
  } catch (e) { res.diff = res.diff || { kind: 'exception', msg: e.message.slice(0, 120) + ' | ' + (e.stack.split('\n')[1] || '').trim().slice(0, 100) }; }
  res.log = log; res.noise = res.noise || []; res.errs = { orig: pg.orig.__errs.slice(0, 5), neu: pg.neu.__errs.slice(0, 5) };
  for (const w of ['orig', 'neu']) await pg[w].__ctx.close().catch(() => {});
  return res;
}
(async () => {
  await L.withBrowser(async B => {
    const seeds = []; for (let s = sf; s <= st; s++) seeds.push(s);
    const out = await L.pool(seeds, 3, async s => { let r; try { r = await walk(B, s); } catch (e) { r = { seed: s, steps: 0, diff: { kind: 'harness-crash', msg: e.message.slice(0, 100) }, errs: { orig: [], neu: [] }, noise: [] }; } if (r.errAt) console.log('  errAt', JSON.stringify(r.errAt)); console.log('seed', s, 'steps', r.steps, r.diff ? 'DIFF ' + JSON.stringify(r.diff).slice(0, 500) : 'ok', (r.noise.length ? 'NOISE' + r.noise.length + ' ' : '') + ((r.errs.orig.length || r.errs.neu.length) ? 'ERRS ' + JSON.stringify(r.errs).slice(0, 300) : '')); return r; });
    fs.writeFileSync(`/tmp/claude-0/fuzz-${sf}-${st}.json`, JSON.stringify(out));
  });
})();

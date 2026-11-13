// Shared harness: run identical scripted interactions against the redesigned build and the original prototype.
const { chromium } = require('playwright');
const FILES = { orig: 'http://localhost:8765/orig.html', neu: 'http://localhost:8765/index.html' };
const norm = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();

async function newPage(browser, which, hash) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  await ctx.route(u => !/localhost:8765|^data:|^blob:/.test(u.toString()), r => r.abort());
  const page = await ctx.newPage();
  const errs = [];
  page.__errs = errs;
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/net::ERR_FAILED/.test(m.text())) errs.push('console: ' + m.text()); });
  page.on('requestfailed', r => { if (/localhost:8765/.test(r.url())) errs.push('reqfailed: ' + r.url()); });
  page.on('dialog', d => d.accept('x').catch(() => {}));
  page.on('popup', p => p.close().catch(() => {}));
  await page.goto(FILES[which] + (hash ? hash : ''));
  await page.waitForFunction(() => typeof S !== 'undefined' && document.getElementById('main').innerHTML.length > 50);
  page.__ctx = ctx;
  return page;
}

const SNAP_FN = () => {
  const n = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const q = sel => document.querySelector(sel);
  const keys = ['page','myCreator','discCreator','tab','campId','planId','cTab','pTab','campTab','dashTab','collectionId','mod','view','myQ','discFilter','post'];
  const st = {}; keys.forEach(k => { try { if (S[k] !== undefined) st[k] = S[k]; } catch (e) {} });
  const layerEl = q('#layer');
  const toast = [...document.querySelectorAll('.toast')].map(t => n(t.innerText)).join('|');
  const txt = el => { const c = el.cloneNode(true); c.querySelectorAll('style,script').forEach(x => x.remove()); const h = document.createElement('div'); h.style.cssText='position:fixed;left:-9999px;top:0;width:1200px'; h.appendChild(c); document.body.appendChild(h); const t = c.innerText; h.remove(); return n(t); };
  const lay = [...layerEl.children].filter(c => !c.classList.contains('toast')).map(txt).join(' || ');
  const main = q('#main');
  return {
    hash: location.hash, st, toast, layer: lay,
    header: n(q('#header') && q('#header').innerText),
    main: n(main.innerText),
    nTr: main.querySelectorAll('tr').length, nBtn: main.querySelectorAll('button').length,
    nCard: main.querySelectorAll('[class*=card]').length,
    navOn: n([...document.querySelectorAll('.nav .nav-row.on, .nav .nav-row.active, .nav [aria-current]')].map(x => x.innerText).join(',')),
    rail: n([...document.querySelectorAll('.rail-item.on')].map(x => x.innerText).join(',')),
    pops: [...document.querySelectorAll('.rail-pop.open')].map(p => p.id).join(','),
    nOpen: document.querySelectorAll('details[open], .open, .is-open').length,
  };
};
const snap = page => page.evaluate(SNAP_FN);

// Tag + key every actionable element in #main/#layer/#header; returns keys
const ENUM_FN = (scopeSel) => {
  const n = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const out = []; const seen = {};
  document.querySelectorAll('[data-cz]').forEach(e => e.removeAttribute('data-cz'));
  const roots = scopeSel ? [...document.querySelectorAll(scopeSel)] : [...document.querySelectorAll('#layer, #main, #header')];
  const els = [];
  roots.forEach(r => r.querySelectorAll('button, a, [onclick], input, select, textarea, summary, [role=tab], [role=option]').forEach(e => els.push(e)));
  const uniq = [...new Set(els)];
  uniq.forEach(e => {
    const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    if (e.closest('.toast')) return;
    if (e.tagName === 'INPUT' && e.type === 'hidden') return;
    if (e.disabled) return;
    { const dt = e.closest('details'); if (dt && !dt.open && !(e.tagName === 'SUMMARY' && e.parentElement === dt)) return; }
    const where = e.closest('#layer') ? 'L' : e.closest('#header') ? 'H' : 'M';
    // when a layer is open, skip underlying main (modal)
    const t = n(e.getAttribute('aria-label') || e.innerText || e.value || e.placeholder || e.title || '').slice(0, 50);
    let k = where + ':' + e.tagName.toLowerCase() + (e.type ? '[' + e.type + ']' : '') + ':' + t;
    seen[k] = (seen[k] || 0) + 1; k += '#' + seen[k];
    e.setAttribute('data-cz', k);
    out.push(k);
  });
  return out;
};
const enumerate = (page, scope) => page.evaluate(ENUM_FN, scope || null);

async function act(page, key) {
  const loc = page.locator('[data-cz="' + key.replace(/"/g, '\\"') + '"]').first();
  if (!(await loc.count())) return 'missing';
  const info = await loc.evaluate(e => ({ tag: e.tagName, type: e.type, nopts: e.options ? e.options.length : 0 }));
  try {
    if (info.tag === 'SELECT') {
      const vals = await loc.evaluate(e => [...e.options].map(o => o.value));
      await loc.selectOption(vals[vals.length - 1], { timeout: 1500 });
    } else if (info.tag === 'TEXTAREA' || (info.tag === 'INPUT' && ['text', 'search', '', 'email', 'url', 'number'].includes(info.type))) {
      await loc.fill(info.type === 'number' ? '7' : 'ma', { timeout: 1500 });
    } else if (info.tag === 'INPUT' && ['date', 'time'].includes(info.type)) {
      await loc.fill(info.type === 'date' ? '2026-11-20' : '10:00', { timeout: 1500 });
    } else {
      await loc.click({ timeout: 1500, force: true, noWaitAfter: true });
    }
  } catch (e) { return 'err:' + e.message.split('\n')[0].slice(0, 80); }
  await page.mouse.move(0, 0); await page.waitForTimeout(60);
  return 'ok';
}

async function withBrowser(fn) {
  const b = await chromium.launch();
  try { return await fn(b); } finally { await b.close(); }
}

async function pool(items, n, worker) {
  const res = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; res[k] = await worker(items[k], k); } }));
  return res;
}

function wordDiff(a, b, ctx = 6) {
  const A = a.split(' '), B = b.split(' ');
  let i = 0; while (i < A.length && i < B.length && A[i] === B[i]) i++;
  let ea = A.length, eb = B.length; while (ea > i && eb > i && A[ea - 1] === B[eb - 1]) { ea--; eb--; }
  return { at: i, orig: A.slice(Math.max(0, i - ctx), Math.min(ea + ctx, i + 40)).join(' '), neu: B.slice(Math.max(0, i - ctx), Math.min(eb + ctx, i + 40)).join(' ') };
}
module.exports = { FILES, norm, newPage, snap, enumerate, act, withBrowser, pool, wordDiff };

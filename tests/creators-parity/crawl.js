// Click-everything crawler: for each entry point, click every actionable element (fresh page each time) in both builds, diff outcomes.
// usage: node crawl.js [depth] [entryFilter]
const fs = require('fs');
const L = require('./lib');
const depth = +(process.argv[2] || 1); const filt = process.argv[3];
const ENTRIES = {
  discover: p => p.evaluate(() => setPage('discover')),
  creators: p => p.evaluate(() => setPage('creators')),
  collections: p => p.evaluate(() => setPage('collections')),
  collection1: p => p.evaluate(() => { setPage('collections'); openCollection('col-skincare'); }),
  dashboard: p => p.evaluate(() => setPage('dashboard')),
  campaigns: p => p.evaluate(() => setPage('campaigns')),
  tracker: p => p.evaluate(() => setPage('tracker')),
  profile0: p => p.evaluate(() => { setPage('creators'); openMyCreator('cr1', 0); }),
  profile1: p => p.evaluate(() => { setPage('creators'); openMyCreator('cr1', 1); }),
  profile2: p => p.evaluate(() => { setPage('creators'); openMyCreator('cr1', 2); }),
  profile3: p => p.evaluate(() => { setPage('creators'); openMyCreator('cr1', 3); }),
  profile4: p => p.evaluate(() => { setPage('creators'); openMyCreator('cr1', 4); }),
  profile5: p => p.evaluate(() => { setPage('creators'); openMyCreator('cr1', 5); }),
  discprofile: p => p.evaluate(() => { setPage('discover'); S.discCreator='r0'; paintHeader(); paintBody(true); }),
  campaignca1: p => p.goto(p.url().split('#')[0] + '#/campaign/ca1').then(() => p.waitForTimeout(100)),
  campaignca2: p => p.goto(p.url().split('#')[0] + '#/campaign/ca2').then(() => p.waitForTimeout(100)),
  plan1: p => p.goto(p.url().split('#')[0] + '#/plan/pl1').then(() => p.waitForTimeout(100)),
  plan3: p => p.goto(p.url().split('#')[0] + '#/plan/pl3').then(() => p.waitForTimeout(100)),
  plan5: p => p.goto(p.url().split('#')[0] + '#/plan/pl5').then(() => p.waitForTimeout(100)),
  plan4: p => p.goto(p.url().split('#')[0] + '#/plan/pl4').then(() => p.waitForTimeout(100)),
  railpops: p => p.evaluate(() => { railPop('reqPop'); }),
};
async function runPath(which, entry, path) {
  let page;
  try {
    page = await L.newPage(globalThis.B, which);
    await ENTRIES[entry](page); await page.waitForTimeout(80);
    for (const k of path) { await L.enumerate(page); const r = await L.act(page, k); if (r !== 'ok') return { fail: r }; }
    const keys = await L.enumerate(page);
    const s = await L.snap(page);
    return { snap: s, keys, errs: page.__errs.slice() };
  } catch (e) { return { fail: 'ex:' + e.message.slice(0, 100), errs: page.__errs.slice() }; }
  finally { if (page && page.__ctx) await page.__ctx.close().catch(() => {}); }
}
(async () => {
  await L.withBrowser(async B => {
    globalThis.B = B;
    const out = {};
    for (const entry of Object.keys(ENTRIES)) {
      if (filt && !entry.match(filt)) continue;
      const t0 = Date.now();
      out[entry] = { orig: {}, neu: {} };
      for (const which of ['orig', 'neu']) {
        const base = await runPath(which, entry, []);
        out[entry][which][''] = base;
        let frontier = [[]]; let cur = { '': base };
        for (let d = 1; d <= depth; d++) {
          const next = [];
          const jobs = [];
          for (const path of frontier) for (const k of (cur[path.join('>')] || {}).keys || []) jobs.push([...path, k]);
          const res = await L.pool(jobs, 3, j => runPath(which, entry, j));
          jobs.forEach((j, i) => { out[entry][which][j.join('>')] = res[i]; if (res[i].snap && (res[i].snap.layer || res[i].snap.nOpen !== base.snap.nOpen || JSON.stringify(res[i].snap.st) !== JSON.stringify(base.snap.st))) next.push(j); });
          cur = out[entry][which];
          frontier = next;
        }
      }
      console.log(entry, 'orig', Object.keys(out[entry].orig).length, 'neu', Object.keys(out[entry].neu).length, ((Date.now() - t0) / 1000).toFixed(0) + 's');
      fs.writeFileSync(`/tmp/claude-0/crawl-d${depth}.json`, JSON.stringify(out));
    }
  });
})();

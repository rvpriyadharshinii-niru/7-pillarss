// usage: node diff.js crawl.json  -> prints parity diffs
const L = require('./lib'); const fs = require('fs');
const d = JSON.parse(fs.readFileSync(process.argv[2]));
const FIELDS = ['hash', 'st', 'toast', 'layer', 'header', 'main', 'nTr', 'navOn', 'rail', 'pops', 'nOpen'];
let total = 0, same = 0, onlyO = 0, onlyN = 0; const diffs = [];
for (const [entry, v] of Object.entries(d)) {
  const keys = new Set([...Object.keys(v.orig), ...Object.keys(v.neu)]);
  for (const k of keys) {
    const o = v.orig[k], n = v.neu[k];
    if (!o || !n) { (o ? onlyO++ : onlyN++); diffs.push({ entry, k, kind: o ? 'only-in-original' : 'only-in-new' }); continue; }
    total++;
    if (o.fail || n.fail) { if ((o.fail||'').slice(0,3) !== (n.fail||'').slice(0,3) || (o.fail&&!/^err/.test(o.fail)&&o.fail!==n.fail)) diffs.push({ entry, k, kind: 'act-result', o: o.fail, n: n.fail }); else same++; continue; }
    const bad = [];
    for (const f of FIELDS) {
      if (!L.same(o.snap[f], n.snap[f])) bad.push(f === 'main' || f === 'layer' || f === 'header' ? { f, ...L.wordDiff(String(o.snap[f]), String(n.snap[f])) } : { f, o: o.snap[f], n: n.snap[f] });
    }
    const eo = (o.errs || []).join(';'), en = (n.errs || []).join(';');
    const en2 = (n.errs||[]).filter(x=>!/ERR_FAILED/.test(x)).join(';'); if (en2) bad.push({ f: 'errs-new', n: en2.slice(0, 200), o: eo.slice(0, 100) });
    if (bad.length) diffs.push({ entry, k, kind: 'diff', bad }); else same++;
  }
}
console.log({ total, same, onlyO, onlyN, diffs: diffs.length });
fs.writeFileSync(process.argv[2].replace('.json', '.diffs.json'), JSON.stringify(diffs, null, 1));
for (const x of diffs.slice(0, +(process.argv[3] || 40))) console.log(JSON.stringify(x).slice(0, 700));

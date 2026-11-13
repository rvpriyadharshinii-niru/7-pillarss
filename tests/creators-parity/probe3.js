const L=require('./lib');
(async()=>{ await L.withBrowser(async B=>{
 for(const w of ['orig','neu']){
  const p=await L.newPage(B,w); await p.evaluate(()=>setPage('creators')); await p.waitForTimeout(200);
  await L.enumerate(p);
  const r=await L.act(p,'M:button[button]:#1'); await p.waitForTimeout(200);
  console.log(w,r, await p.evaluate(()=>{const e=[...document.querySelectorAll('details.ds-more')].map(d=>d.open+':'+getComputedStyle(d.querySelector('.ds-more-menu')).display); return e.slice(0,4).join(',')+' | '+(document.querySelector('[data-cz="M:button[button]:#1"]')||{}).outerHTML}));
  await p.screenshot({path:`/tmp/claude-0/addto-${w}.png`});
 }
})})();

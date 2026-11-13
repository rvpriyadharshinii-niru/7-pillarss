const L=require('./lib');
(async()=>{ await L.withBrowser(async B=>{
 for(const w of ['orig','neu']){
  const p=await L.newPage(B,w); await p.evaluate(()=>setPage('creators')); await p.waitForTimeout(200);
  await L.enumerate(p); console.log(w,await L.act(p,'M:button[button]:open full profile#5')); await p.waitForTimeout(300);
  console.log(w, await p.evaluate(()=>({st:S.myCreator,tab:S.tab,t:[...document.querySelectorAll('.cr-tl-sec')].map(t=>t.innerText.replace(/\s+/g,' ').slice(0,500))})));
  const el=await p.$('.cr-tl-sec'); if(el) await el.screenshot({path:`/tmp/claude-0/tl-${w}.png`});
 }
})})();

const L=require('./lib');
(async()=>{ await L.withBrowser(async B=>{
 for(const w of ['orig','neu','orig','neu']){
  const p=await L.newPage(B,w); await p.evaluate(()=>{location.hash='#/plan/pl5'}); await p.waitForTimeout(250);
  await p.locator('#main button:has-text("Launch campaign")').click(); await p.waitForTimeout(200);
  await p.locator('#layer input').first().fill('Launched from pl5'); await p.locator('#layer button:has-text("Next")').click(); await p.waitForTimeout(150);
  await p.locator('#layer .ds-btn--primary').last().click(); await p.waitForTimeout(250);
  await p.evaluate(()=>setPage('campaigns')); await p.waitForTimeout(200);
  console.log(w, await p.evaluate(()=>{const r=[...document.querySelectorAll('#main tbody tr')].find(r=>/Launched from pl5/.test(r.innerText)); const c=CAMP_LIST.find(x=>x.name==='Launched from pl5'); return (r?r.innerText.replace(/\s+/g,' '):'norow')+' || '+JSON.stringify({pv:c.plannedVideos,posts:c.posts.length,start:c.start,end:c.end,status:c.status,keys:Object.keys(c).join(',')}) }));
 }
})})();

const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch();
 const p=await b.newPage({viewport:{width:1440,height:900}});
 await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(400);
 console.log(await p.evaluate(()=>({disc:DISC.map(c=>c.id+':'+c.name+':'+!!c.repo),camps:CAMP_LIST.map(c=>c.id+':'+c.name+':'+c.status),plans:CAMP_PLANS.map(c=>c.id+':'+c.name+':'+(c.stage||'')),cols:CREATOR_COLLECTIONS.map(c=>c.id),TABS:TABS})));
 for(const pg of ['discover','creators','collections','dashboard','campaigns','tracker']){
  const r=await p.evaluate(pg=>{setPage(pg);const q=[...document.querySelectorAll('#main button,#main a,#main [onclick],#main input,#main select,#main summary')];return q.length},pg);
  console.log(pg,r);
 }
 await b.close();
})();

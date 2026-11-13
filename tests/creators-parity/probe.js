const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch();
 for(const f of ['orig','index']){
  const p=await b.newPage({viewport:{width:1440,height:900}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  await p.goto('http://localhost:8765/'+f+'.html');await p.waitForTimeout(500);
  console.log(f,errs, await p.evaluate(()=>({hash:location.hash,page:S.page,h:document.getElementById('header').innerText.slice(0,200),m:document.getElementById('main').innerText.slice(0,500)})));
 }
 await b.close();
})();

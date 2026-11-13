// exploratory helper: node ex.js <orig|neu> '<js ops>'   ops use p (page), L, and t() to dump text
const L=require('./lib');
(async()=>{ await L.withBrowser(async B=>{
 const p=await L.newPage(B,process.argv[2]);
 const t=async(n=1500)=>console.log('TEXT>',(await L.snap(p)).main.slice(0,n),'\nLAYER>',(await L.snap(p)).layer.slice(0,n),'\nTOAST>',(await L.snap(p)).toast);
 const click=async(txt,scope='#main, #layer')=>{ const l=p.locator(scope).locator(`button:has-text("${txt}"), a:has-text("${txt}"), summary:has-text("${txt}"), [onclick]:has-text("${txt}"), [aria-label="${txt}"]`).first(); await l.click({timeout:3000}); await p.waitForTimeout(100); };
 const ui=async(sc='#layer, #main')=>console.log('UI>',JSON.stringify(await p.evaluate(sc=>{const o=[];document.querySelectorAll(sc).forEach(r=>r.querySelectorAll('button,a,summary,input,select,textarea,[role=tab]').forEach(e=>{if(!e.offsetParent&&getComputedStyle(e).position!=='fixed')return;const t=(e.getAttribute('aria-label')||e.innerText||e.placeholder||e.value||'').replace(/\s+/g,' ').trim().slice(0,30);o.push((e.tagName[0]+(e.type&&e.type!=='button'&&e.type!=='submit'?':'+e.type:''))+'|'+t)}));return o.filter((x,i,a)=>a.indexOf(x)===i&&!/^B\|$/.test(x)).slice(0,120)},sc))); await eval('(async()=>{'+process.argv[3]+'})()');
 console.log(p.__errs);
})})();

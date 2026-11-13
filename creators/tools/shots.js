// usage: node tools/shots.js outdir [width] -> screenshots every main page
const {chromium}=require('playwright'),path=require('path'),fs=require('fs');
(async()=>{const out=process.argv[2];const w=+process.argv[3]||1440;fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:w,height:900},deviceScaleFactor:1});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(process.env.HTML||path.join(__dirname,'../index.html')));await p.waitForTimeout(800);
for(const pg of ['discover','creators','collections','dashboard','campaigns','tracker']){
  await p.evaluate(pg=>setPage(pg),pg);await p.waitForTimeout(500);
  await p.screenshot({path:`${out}/${pg}.png`,fullPage:false});
}
console.log('errors',JSON.stringify(errs.slice(0,5)));await b.close()})();

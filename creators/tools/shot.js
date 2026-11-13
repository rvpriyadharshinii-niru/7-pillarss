// usage: node tools/shot.js out.png [js-to-eval-before-shot] [width] [height]
const {chromium}=require('playwright');
(async()=>{const [,,out,js,w,h]=process.argv;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w||1440,height:+h||900},deviceScaleFactor:1});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('file://'+require('path').resolve(process.env.HTML||require('path').join(__dirname,'../index.html')));await p.waitForTimeout(800);
if(js)await p.evaluate(js);await p.waitForTimeout(500);
await p.screenshot({path:out});console.log('errors:',JSON.stringify(errs.slice(0,5)));await b.close()})();

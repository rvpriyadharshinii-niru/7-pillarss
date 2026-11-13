// ONE-OFF: app.js injects <style> blocks at runtime (unlayered => they beat the whole design system).
// Wrap each in @layer legacy{} so ds/area/chrome layers win, and drop !important from visual props (important reverses layer order).
const fs=require('fs');const f=__dirname+'/../src/app.js';let js=fs.readFileSync(f,'utf8');
const re=/<style[^>]*>/g;let m;const pos=[];while(m=re.exec(js))pos.push({i:m.index,len:m[0].length});
let wrapped=0,stripped=0;
for(let k=pos.length-1;k>=0;k--){
  const {i,len}=pos[k];const next=pos[k+1];const e=js.indexOf('</style>',i);
  if(e<0||(next&&e>next.i))continue;                       // nested/dynamic style (column hiding): leave alone
  let body=js.slice(i+len,e);
  body=body.replace(/((?:^|[;{\s])(?:color|background(?:-color)?|background-image|border(?:-[a-z]+)*|box-shadow|text-shadow|font-weight|font-size|font-family|text-transform|letter-spacing|border-radius|outline|fill|stroke)\s*:[^;}]*?)\s*!important/g,(a,b)=>{stripped++;return b});
  js=js.slice(0,i+len)+'@layer legacy{'+body+'}'+js.slice(e);wrapped++;
}
fs.writeFileSync(f,js);console.log({wrapped,stripped});

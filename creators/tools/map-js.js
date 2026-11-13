// ONE-OFF: remap hard-coded colours / font sizes / radii inside app.js templates to design-system values (hex, since JS may post-process them).
const fs=require('fs'),{mapColors}=require('./palette');
const f=__dirname+'/../src/app.js';let js=fs.readFileSync(f,'utf8');
const fsSnap=n=>n<=12.49?12:n<=13.49?13:n<=15.49?14:n<=17?16:n<=19?18:n<=21?20:n<=25?24:n<=28?28:30;
const lowFs=n=>n<=11.5?12:fsSnap(n);
const rad=n=>n===0?0:n<=4?4:n<=7?6:n<=10?8:n<=14?12:16;
let c=0;
js=js.replace(/#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{4}\b|#[0-9a-fA-F]{3}\b|rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\)/g,m=>{c++;return mapColors(m,'hex')});
js=js.replace(/font-size:\s*([\d.]+)px/g,(m,n)=>'font-size:'+lowFs(+n)+'px');
js=js.replace(/border-radius:\s*([\d.]+)px/g,(m,n)=>'border-radius:'+rad(+n)+'px');
fs.writeFileSync(f,js);console.log('colours remapped:',c);

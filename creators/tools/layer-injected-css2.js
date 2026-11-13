// ONE-OFF (part 2): plain-CSS template constants (no <style> tag) consumed via <style>${X_CSS}</style>.
const fs=require('fs');const f=__dirname+'/../src/app.js';let js=fs.readFileSync(f,'utf8');
let n=0,s=0;
for(const name of ['SH_CSS','MY_TOOL_CSS','MYF_CSS']){
  const start=js.indexOf('const '+name+'=`');if(start<0){console.log('missing',name);continue}
  const b=start+('const '+name+'=`').length;const e=js.indexOf('`;',b);
  let body=js.slice(b,e);
  if(/\$\{|`/.test(body))console.log('WARN interpolation in',name);
  body=body.replace(/((?:^|[;{\s])(?:color|background(?:-color)?|background-image|border(?:-[a-z]+)*|box-shadow|text-shadow|font-weight|font-size|font-family|text-transform|letter-spacing|border-radius|outline|fill|stroke)\s*:[^;}]*?)\s*!important/g,(a,x)=>{s++;return x});
  js=js.slice(0,b)+'@layer legacy{'+body+'}'+js.slice(e);n++;
}
fs.writeFileSync(f,js);console.log({wrapped:n,stripped:s});

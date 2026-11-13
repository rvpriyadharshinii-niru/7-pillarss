const fs=require('fs'),path=require('path'),r=f=>fs.readFileSync(path.join(__dirname,'../src',f),'utf8');
const areas=fs.existsSync(path.join(__dirname,'../src/areas'))?fs.readdirSync(path.join(__dirname,'../src/areas')).filter(f=>f.endsWith('.css')).sort().map(f=>'areas/'+f):[];
const css=['tokens.css','legacy.css','ds.css',...areas,'chrome.css'].map(r).join('\n');
const b64=f=>fs.readFileSync(path.join(__dirname,'../src/fonts',f)).toString('base64');
const fontCss=`@font-face{font-family:'Inter';font-style:normal;font-weight:400 700;font-display:swap;src:url(data:font/woff2;base64,${b64('inter-latin-ext-var.woff2')}) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'Inter';font-style:normal;font-weight:400 700;font-display:swap;src:url(data:font/woff2;base64,${b64('inter-latin-var.woff2')}) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}`;
const html=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Creators · Prototype</title>
<style>${fontCss}
@layer legacy, ds, area, chrome;
${css}</style>
</head>
<body>
${r('shell.html')}
<script>
${r('app.js')}
</script>
</body>
</html>
`;
const out=process.env.OUT||path.join(__dirname,'../index.html'); fs.mkdirSync(path.dirname(out),{recursive:true}); fs.writeFileSync(out,html); console.log(out,(html.length/1e6).toFixed(2)+'MB');

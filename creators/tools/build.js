const fs=require('fs'),path=require('path'),r=f=>fs.readFileSync(path.join(__dirname,'../src',f),'utf8');
const areas=fs.existsSync(path.join(__dirname,'../src/areas'))?fs.readdirSync(path.join(__dirname,'../src/areas')).filter(f=>f.endsWith('.css')).sort().map(f=>'areas/'+f):[];
const css=['tokens.css','legacy.css','ds.css',...areas,'chrome.css'].map(r).join('\n');
const html=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Creators · Prototype</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>@layer legacy, ds, area, chrome;
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

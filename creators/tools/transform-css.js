// Legacy prototype CSS  ->  (chrome.css verbatim for rail / side-nav / frame) + (legacy.css layout-only, restyled with design-system tokens)
const postcss=require('postcss'),fs=require('fs');
const {mapColors}=require('./palette');
const [,, inFile, outDir]=process.argv;
let css=fs.readFileSync(inFile,'utf8').replace(/^<style>\n/,'');
const root=postcss.parse(css);

const CHROME=/^(html|body)?\s*(\.shell|\.rail[\w-]*|\.rp-[\w-]*|\.ru-[\w-]*|\.alert-[\w-]*|\.brand-[\w-]*|\.rq-[\w-]*|aside\.nav[\w.-]*|\.nav[\w-]*|\.app)(?![\w-])/;
const isChromeSel=s=>{s=s.trim();return CHROME.test(s)&&!/^(html|body)/.test(s)||/^\.app(?![\w-])\s*(:|$)/.test(s)};
// .app descendants are content -> legacy; only the bare frame rule is chrome
const chromeSel=s=>{s=s.trim(); if(/^\.app(?![\w-])/.test(s)) return /^\.app(\s*[:,]|\s*$)/.test(s)||/^\.app(?![\w-\s>+~.\[#:])/.test(s); return CHROME.test(s)&&!/^(html|body)/.test(s)};

const KEEP=new Set(`display position top right bottom left inset inset-inline inset-block z-index flex flex-direction flex-wrap flex-flow flex-grow flex-shrink flex-basis order
align-items align-content align-self justify-content justify-items justify-self place-items place-content place-self gap row-gap column-gap grid grid-template grid-template-columns grid-template-rows grid-template-areas grid-area grid-column grid-row grid-auto-flow grid-auto-columns grid-auto-rows
width height min-width min-height max-width max-height aspect-ratio overflow overflow-x overflow-y overscroll-behavior padding padding-top padding-right padding-bottom padding-left margin margin-top margin-right margin-bottom margin-left
box-sizing white-space text-overflow word-break overflow-wrap hyphens text-align vertical-align line-height float clear columns column-count column-gap content cursor pointer-events user-select
transform transform-origin transition transition-property transition-duration animation animation-name animation-duration animation-delay animation-timing-function animation-fill-mode animation-iteration-count opacity visibility list-style list-style-type list-style-position
resize object-fit object-position table-layout border-collapse border-spacing caption-side appearance scroll-behavior scroll-snap-type scroll-snap-align scroll-margin scroll-padding will-change contain isolation mix-blend-mode backdrop-filter filter clip-path
text-decoration text-decoration-line text-underline-offset font-variant-numeric font-feature-settings text-transform letter-spacing font-style text-wrap -webkit-line-clamp -webkit-box-orient -webkit-box-pack outline-offset
stroke-width stroke-linecap stroke-linejoin fill-opacity stroke-opacity stroke-dasharray stroke-dashoffset pathlength all quotes tab-size writing-mode direction`.split(/\s+/));
const COLORPROP=/^(color|background|background-color|background-image|border(-(top|right|bottom|left))?(-color)?|outline|outline-color|fill|stroke|stop-color|flood-color|caret-color|accent-color|text-decoration-color|column-rule|--[\w-]+)$/;
const SPACING=/^(padding|margin|gap|row-gap|column-gap)(-(top|right|bottom|left))?$/;

const fsSnap=n=>n<=12.49?12:n<=13.49?13:n<=15.49?14:n<=17?16:n<=19?18:n<=21?20:n<=25?24:n<=28?28:30;
const lowFs=n=>n<=11.5?12:fsSnap(n);
const radSnap=n=>n===0?0:n<=4?4:n<=7?6:n<=10?8:n<=14?12:16;
const wSnap=w=>{w=String(w).trim();if(w==='bold'||w==='bolder')return 600;const n=+w;if(!n)return w;return n<=400?400:n===500?500:n<=700?600:700};
const evenPx=v=>v.replace(/(-?\d*\.?\d+)px/g,(m,n)=>{n=parseFloat(n);if(Math.abs(n)<=1)return m;const e=2*Math.round(n/2);return e+'px'});
function shadow(v){
  if(/^\s*none\s*$/i.test(v))return'none';
  if(/var\(/.test(v))return v;
  const first=v.split(/,(?![^(]*\))/)[0];
  const nums=(first.replace(COLOR_STRIP,'').match(/-?\d*\.?\d+(?=px|\s|$)/g)||[]).map(Number);
  const [x=0,y=0,blur=0,spread=0]=nums;
  if(/inset/.test(v))return mapColors(v,'var');
  if(y===0&&x!==0&&spread<0)return mapColors(first,'var');          // directional edge shadow (sticky columns)
  const b=Math.max(...v.split(/,(?![^(]*\))/).map(s=>{const n=(s.replace(COLOR_STRIP,'').match(/-?\d*\.?\d+(?=px|\s|$)/g)||[]).map(Number);return n[2]||0}));
  if(b<=3)return'var(--shadow-xs)'; if(b<=10)return'var(--shadow-sm)'; if(b<=20)return'var(--shadow-md)'; return'var(--shadow-lg)';
}
const COLOR_STRIP=/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g;

function transformDecl(d){
  const p=d.prop.toLowerCase(); let v=d.value;
  if(p.startsWith('--')){ d.value=mapColors(v,'var'); return; }
  if(p==='font'){
    const m=v.match(/^(?:(italic|oblique)\s+)?(?:(\d{3}|bold|normal)\s+)?([\d.]+)px(?:\/([\d.]+(?:px|rem|em)?))?\s+(.+)$/);
    if(m){ const out=[]; if(m[1])out.push(['font-style',m[1]]); if(m[2]&&m[2]!=='normal')out.push(['font-weight',wSnap(m[2])]);
      out.push(['font-size',lowFs(+m[3])+'px']); if(m[4])out.push(['line-height',m[4]]);
      if(/mono/i.test(m[5]))out.push(['font-family','var(--font-mono)']);
      out.forEach(([a,b])=>d.cloneBefore({prop:a,value:String(b),important:false})); d.remove(); return; }
    d.remove(); return;
  }
  if(p==='font-family'){ if(/mono/i.test(v))d.value='var(--font-mono)'; else if(!/inherit/.test(v))d.remove(); return; }
  if(p==='font-size'){ const m=v.match(/^([\d.]+)(px|rem)$/); if(m){const px=m[2]==='rem'?parseFloat(m[1])*16:parseFloat(m[1]);d.value=lowFs(px)+'px';d.important=false;} return; }
  if(p==='font-weight'){ d.value=String(wSnap(v)); d.important=false; return; }
  if(/radius/.test(p)){ if(!/var\(/.test(v)) d.value=v.replace(/([\d.]+)(px|rem)/g,(m,n,u)=>{const px=u==='rem'?n*16:+n;return radSnap(px)+'px'}); d.important=false; return; }
  if(/shadow/.test(p)){ d.value=p==='text-shadow'?'none':shadow(v); d.important=false; return; }
  if(COLORPROP.test(p)){
    d.value=mapColors(v,'var',p==='color'?'text':undefined);
    if(/^border/.test(p)) d.value=d.value.replace(/\b(2|3)px\b/g,'$1px');
    d.important=false; return;
  }
  if(SPACING.test(p)){ if(!/var\(|calc\(/.test(v)) d.value=evenPx(v); return; }
  if(!KEEP.has(p)) d.remove();
}
function transformRule(rule){
  rule.walkDecls(transformDecl);
  if(!rule.nodes||!rule.nodes.length) rule.remove();
}
const chrome=postcss.root(), legacy=postcss.root();
const prefixVars=n=>n.walkDecls(d=>{d.value=d.value.replace(/var\(--/g,'var(--c-'); if(d.prop.startsWith('--'))d.prop='--c-'+d.prop.slice(2)});
let nChrome=0,nLegacy=0;
function splitRule(rule){
  const sels=rule.selectors; const cs=sels.filter(chromeSel), ls=sels.filter(s=>!chromeSel(s));
  const out={c:null,l:null};
  if(cs.length){ const r=rule.clone(); r.selectors=cs; out.c=r; }
  if(ls.length){ const r=rule.clone(); r.selectors=ls; out.l=r; }
  return out;
}
root.each(node=>{
  if(node.type==='comment')return;
  if(node.type==='rule'){
    if(node.selector===':root'||node.selector==='html'&&false){ // tokens: chrome gets the original values under --c-*, legacy gets remapped
      const c=node.clone(); chrome.append(c); const l=node.clone(); transformRule(l); if(l.parent===undefined||l.nodes&&l.nodes.length) legacy.append(l); return; }
    const {c,l}=splitRule(node);
    if(c){chrome.append(c);nChrome++} if(l){transformRule(l); if(l.nodes&&l.nodes.length){legacy.append(l);nLegacy++}}
    return;
  }
  if(node.type==='atrule'){
    if(/^(font-face|charset|import)$/.test(node.name))return;
    if(node.name==='keyframes'||node.name.endsWith('keyframes')){ const k=node.clone(); k.walkDecls(d=>{ if(COLORPROP.test(d.prop.toLowerCase()))d.value=mapColors(d.value,'var') }); legacy.append(k); return; }
    if(['media','supports','container'].includes(node.name)){
      const cw=node.clone({nodes:[]}), lw=node.clone({nodes:[]});
      node.each(ch=>{ if(ch.type!=='rule')return; const {c,l}=splitRule(ch); if(c)cw.append(c); if(l){transformRule(l); if(l.nodes&&l.nodes.length)lw.append(l)} });
      if(cw.nodes.length)chrome.append(cw); if(lw.nodes.length)legacy.append(lw); return;
    }
    legacy.append(node.clone());
  }
});
prefixVars(chrome);
fs.mkdirSync(outDir,{recursive:true});
const wrap=(name,r)=>{const l=postcss.atRule({name:'layer',params:name});l.append(r.nodes.map(n=>n.clone()));return l.toString()};
fs.writeFileSync(outDir+'/chrome.css',wrap('chrome',chrome));
fs.writeFileSync(outDir+'/legacy.css',wrap('legacy',legacy));
console.log({chromeRules:nChrome,legacyRules:nLegacy,chromeBytes:fs.statSync(outDir+'/chrome.css').size,legacyBytes:fs.statSync(outDir+'/legacy.css').size});

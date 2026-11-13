// Design-system palette: Tailwind / shadcn-ui "slate" base + "blue" primary.
// Single source of truth: used to generate ds.css tokens AND to remap legacy colours.
const L = {
  slate: {50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a',950:'#020617'},
  blue:  {50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a'},
  red:   {50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c',800:'#991b1b',900:'#7f1d1d'},
  amber: {50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f'},
  green: {50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d'},
  violet:{50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',800:'#5b21b6',900:'#4c1d95'},
  sky:   {50:'#f0f9ff',100:'#e0f2fe',200:'#bae6fd',300:'#7dd3fc',400:'#38bdf8',500:'#0ea5e9',600:'#0284c7',700:'#0369a1',800:'#075985',900:'#0c4a6e'},
  pink:  {50:'#fdf2f8',100:'#fce7f3',200:'#fbcfe8',300:'#f9a8d4',400:'#f472b6',500:'#ec4899',600:'#db2777',700:'#be185d',800:'#9d174d',900:'#831843'},
  orange:{50:'#fff7ed',100:'#ffedd5',200:'#fed7aa',300:'#fdba74',400:'#fb923c',500:'#f97316',600:'#ea580c',700:'#c2410c',800:'#9a3412',900:'#7c2d12'},
};
const hex2rgb=h=>{h=h.replace('#','');if(h.length<=4)h=[...h].map(c=>c+c).join('');const n=parseInt(h.slice(0,6),16);return{r:n>>16&255,g:n>>8&255,b:n&255,a:h.length===8?parseInt(h.slice(6),16)/255:1}};
const rgb2hsl=({r,g,b})=>{r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0;const l=(mx+mn)/2;
  if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?((g-b)/d+(g<b?6:0)):mx===g?((b-r)/d+2):((r-g)/d+4);h*=60}return{h,s,l}};
const lum={};for(const f in L){lum[f]={};for(const k in L[f])lum[f][k]=rgb2hsl(hex2rgb(L[f][k])).l}
function nearest(fam,l){let best=null,bd=9;for(const k in lum[fam]){const d=Math.abs(lum[fam][k]-l);if(d<bd){bd=d;best=k}}return best}
// returns {fam, step} or {white:true} / {black:true}
function classify(rgb){
  const {h,s,l}=rgb2hsl(rgb);
  if(l>=.992) return {fam:'white'};
  if(l<=.02) return {fam:'black'};
  let fam;
  if(s<.16 || (s<.30 && l>.93) || (l<.2 && s<.5)) fam='slate';
  else if(h>=345||h<12) fam='red';
  else if(h<28) fam='orange';
  else if(h<66) fam='amber';
  else if(h<165) fam='green';
  else if(h<196) fam='sky';
  else if(h<258) fam='blue';
  else if(h<300) fam='violet';
  else fam='pink';
  // very pale tints of any hue -> that hue's 50; keep slate for near-white low-sat
  return {fam, step: nearest(fam,l)};
}
const COLOR_RE=/#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{4}\b|#[0-9a-fA-F]{3}\b|rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\)/g;
function parseColor(s){
  if(s[0]==='#')return hex2rgb(s);
  const m=s.match(/[\d.]+/g).map(Number);return{r:m[0],g:m[1],b:m[2],a:m[3]===undefined?1:m[3]};
}
function mapColor(s,mode,ctx){ // mode 'var' | 'hex'; ctx 'text' makes dark chromatic text neutral
  const c=parseColor(s), k=classify(c);
  if(k.fam==='blue' && (k.step==='900')) k.step='800';
  if(ctx==='text' && ['blue','violet'].includes(k.fam) && ['700','800','900'].includes(k.step) && rgb2hsl(c).l<.4){k.fam='slate';k.step='900';}
  let base;
  if(k.fam==='white') base= mode==='var'?'#fff':'#ffffff';
  else if(k.fam==='black') base= mode==='var'?'var(--slate-950)':L.slate[950];
  else base= mode==='var'?`var(--${k.fam}-${k.step})`:L[k.fam][k.step];
  if(c.a>=.995) return base;
  const pct=Math.round(c.a*100);
  if(mode==='var') return `color-mix(in srgb, ${base} ${pct}%, transparent)`;
  const h=base.replace('#',''); return '#'+h+Math.round(c.a*255).toString(16).padStart(2,'0');
}
const mapColors=(str,mode='var',ctx)=>str.replace(COLOR_RE,m=>mapColor(m,mode,ctx));
module.exports={L,mapColor,mapColors,classify,hex2rgb};

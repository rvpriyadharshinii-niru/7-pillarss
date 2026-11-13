/* ── Main rail modules: each rail item swaps the secondary nav. Items without a built page open a placeholder. ── */
const SP_PLANS=['Summer skincare sprint','Festive hook tests','Wellness reels Q4','Q1 retargeting script'];
const AP_TOP=[['Overview','ph:Overview'],['Messaging Themes','ph:Messaging Themes'],['Collections','ph:Ad Collections']];
const AP_REPORTS=[
  {t:'Top Performing',k:[['Top Creatives','ph:Top Creatives'],['Top Active Ads','ph:Top Active Ads'],['New Launches','ph:New Launches'],['Ad Type Comparison','ph:Ad Type Comparison'],['Landing Page Analysis','ph:Landing Page Analysis'],['Bottom Performers','ph:Bottom Performers']]},
  ['Funnel Analysis','ph:Funnel Analysis'],
  {t:'WoW Comparison',k:[['Account level','ph:WoW Account'],['Creative level','ph:WoW Creative']]}
];
const MODS={
  creators:{title:'Creators',home:'creators',nav:null},
  ci:{title:'Competitor Intelligence',home:'ph:My feed',nav:[
    ['My feed','ph:My feed'],
    ['Track brands','ph:Track brands'],
    {g:'Save',items:[['Collections','ph:Collections'],['DM to save','ph:DM to save']]},
    {g:'Reports',items:[['Quick compare','ph:Quick compare'],['Brand landscape report','ph:Brand landscape report'],['Festive view','ph:Festive view']]}
  ]},
  sp:{title:'Strategy and Planning',home:'ph:Planner',nav:[
    {t:'Planner',drill:'planner',items:[['New plan','ph:New plan']].concat(SP_PLANS.map(n=>[n,'ph:'+n]))},
    {t:'Strategy',drill:'strategy',items:[['Script agent','ph:Script agent'],['Angles','ph:Angles']]}
  ]},
  ap:{title:'Ads Performance',home:'ph:Overview',nav:AP_TOP.concat(AP_REPORTS.flatMap(x=>Array.isArray(x)?[x]:x.k))},
  bm:{title:'Brand Management',home:'ph:My brands',nav:[['My brands','ph:My brands'],['Product','ph:Product']]},
  sl:{title:'Social Listening',home:'ph:Self',nav:[{t:'Self',p:'ph:Self',kids:[['Comments','ph:Comments'],['DMs','ph:DMs'],['Mentions','ph:Mentions']]},['Reviews','ph:Reviews'],['Keywords','ph:Keywords'],['Reddit','ph:Reddit']]}
};
const modFlat=m=>(m.nav||[]).flatMap(x=>Array.isArray(x)?[x]:(x.kids?[[x.t,x.p]].concat(x.kids):(x.items||[])));
const modOfPage=()=>{ for(const k of Object.keys(MODS)){ const m=MODS[k]; if(m.home===S.page||modFlat(m).some(i=>i[1]===S.page)) return k; } return S.mod||'creators'; };
function railGo(mod){ S.mod=mod; S.navDrill=null; setPage(MODS[mod].home); }
const phIsPage=()=>!!(S.page&&S.page.indexOf('ph:')===0);
const RAIL_BRANDS=[['Product Design','CONSTRUCTION'],['Dell','TECHNOLOGY'],['Honey and Spice','FOOD & BEVERAGE'],['HairOriginals','BEAUTY AND PERSONAL CARE'],['Testing 123','ALL'],['Hair Originals','HAIR CARE AND EXTENSIONS']];
let RAIL_BRAND=0, RAIL_BRAND_Q='';
const railIni=n=>{const w=n.split(' ');return (w.length>1?w[0][0]+w[1][0]:n.slice(0,2)).toUpperCase();};
function railBrandList(){
  const box=document.getElementById('brandList'); if(!box) return;
  const q=RAIL_BRAND_Q.trim().toLowerCase();
  box.innerHTML=RAIL_BRANDS.map((b,i)=>[b,i]).filter(([b])=>!q||b[0].toLowerCase().includes(q)).map(([b,i])=>`<button type="button" class="brand-row${i===RAIL_BRAND?' on':''}" onclick="railBrandPick(${i})"><span class="brand-av">${esc(railIni(b[0]))}</span><span class="brand-meta"><b>${esc(b[0])}</b><em>${esc(b[1])}</em></span><i class="brand-radio${i===RAIL_BRAND?' on':''}"></i></button>`).join('')||'<p class="brand-none">No brands match</p>';
  const el=document.getElementById('railBrand'); if(el) el.textContent=railIni(RAIL_BRANDS[RAIL_BRAND][0]);
}
function railBrandPick(i){ RAIL_BRAND=i; railBrandList(); toast('Switched to '+RAIL_BRANDS[i][0]); }
document.addEventListener('click',e=>{ document.querySelectorAll('details.ds-more[open]').forEach(d=>{ if(!d.contains(e.target)||e.target.closest('.ds-more-menu button')) d.open=false; }); });
function railPopClose(){ document.querySelectorAll('.rail-pop.open').forEach(p=>p.classList.remove('open')); }
function railPop(id){
  const el=document.getElementById(id); if(!el) return;
  const open=el.classList.contains('open'); railPopClose();
  if(!open){ el.classList.add('open'); if(id==='brandPop') railBrandList(); if(id==='reqPop') reqOvRender(); }
}
function profGo(page){ railPopClose(); setPage(page); }
function profLogout(){ railPopClose(); toast('Logged out (prototype)'); }
function alertTab(el){ document.querySelectorAll('.alert-tab').forEach(x=>x.classList.toggle('on',x===el)); }
document.addEventListener('click',e=>{ if(!document.body.contains(e.target)||e.target.closest('.rail-foot')) return; railPopClose(); });
function apNavHTML(){
  const row=(l,p,cls)=>`<a class="nav-row ${cls||''}" href="#" data-page="${esc(p)}" onclick="event.preventDefault();setPage('${p}')"><span>${esc(l)}</span></a>`;
  const reports=AP_REPORTS.map(x=>Array.isArray(x)?row(x[0],x[1],''):`<div class="ap-grp${x.t==='Top Performing'?' open':''}"><button class="ap-grp-h" type="button" onclick="this.parentElement.classList.toggle('open')"><span class="ap-chev">›</span>${esc(x.t)}</button><div class="ap-kids">${x.k.map(([l,p])=>row(l,p,'ap-kid')).join('')}</div></div>`).join('');
  return `<div class="ap-head"><span class="nav-title">Ad Accounts</span><button class="ap-connect" type="button" onclick="toast('Connect ad account (prototype)')">Connect</button></div>
    <div class="ap-sel-l">Selected account</div>
    <label class="ap-select"><select onchange="toast('Account switched (demo)')"><option>Demo account A</option><option>Demo account B</option></select></label>
    <div class="ap-demo">Demo data</div>
    ${AP_TOP.map(([l,p])=>row(l,p,'')).join('')}
    <div class="ru-sep"></div>
    <div class="ap-rep-h"><span>Reports</span><button class="ap-plus" type="button" aria-label="New report" onclick="toast('New report (prototype)')">+</button></div>
    ${reports}`;
}
function modNavHTML(mod){
  if(mod==='ap') return apNavHTML();
  if(mod==='sp') return spNavHTML();
  const m=MODS[mod];
  const row=(l,p,sub)=>`<a class="nav-row${sub?' sub':''}" href="#" data-page="${esc(p)}" onclick="event.preventDefault();setPage('${p}')"><span>${esc(l)}</span></a>`;
  const body=(m.nav||[]).map(x=>{
    if(Array.isArray(x)) return row(x[0],x[1],false);
    if(x.kids) return row(x.t,x.p,false)+x.kids.map(([l,p])=>row(l,p,true)).join('');
    let h=`<div class="nav-group">${esc(x.g)}</div>`;
    if(false){
      h+=`<a class="nav-row sub" href="#" onclick="event.preventDefault();openPlanForm('new')"><span>+ Add plan</span></a>`;
      h+=CAMP_PLANS.map(p=>`<a class="nav-row sub plan-row" href="#" title="${esc(p.name)}" onclick="event.preventDefault();openPlan('${p.id}')"><span>${esc(p.name)}</span></a>`).join('');
    }
    return h+(x.items||[]).map(([l,p])=>row(l,p,true)).join('');
  }).join('');
  return `<div class="nav-title">${esc(m.title)}</div>`+body;
}
const NAV_CHEV='<svg class="ico ico-sm" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';
const NAV_BACK='<svg class="ico ico-sm" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>';
function navDrill(key){
  S.navDrill=key;
  const aside=document.querySelector('aside.nav'); if(aside) aside.innerHTML=modNavHTML(S.mod||'sp');
}
function spNavHTML(){
  const m=MODS.sp, row=(l,p)=>`<a class="nav-row sub" href="#" data-page="${esc(p)}" onclick="event.preventDefault();setPage('${p}')"><span>${esc(l)}</span></a>`;
  const d=S.navDrill&&m.nav.find(x=>x.drill===S.navDrill);
  if(d) return `<div class="nav-back-h"><button class="nav-back" type="button" onclick="navDrill(null)">${NAV_BACK}<span>Back</span></button><div class="nav-title">${esc(d.t)}</div></div>`+d.items.map(([l,p])=>row(l,p)).join('');
  return `<div class="nav-title">${esc(m.title)}</div>`+m.nav.map(x=>`<button class="nav-row nav-drill-row" type="button" onclick="navDrill('${x.drill}')"><span>${esc(x.t)}</span>${NAV_CHEV}</button>`).join('');
}
let __CREATORS_NAV=null;
function paintSecNav(){
  if(!document.getElementById('navfix')) document.head.insertAdjacentHTML('beforeend','<style id="navfix">aside.nav .nav-toggle,aside.nav .nav-toggle.on,aside.nav .nav-toggle:focus,aside.nav .nav-toggle:focus-visible,aside.nav .nav-toggle:active{outline:none!important;border:0!important;box-shadow:none!important;color:var(--ink-2)!important;font-weight:500!important;background:none!important}aside.nav .nav-toggle:hover{background:#dbeafe!important}</style>');
  const aside=document.querySelector('aside.nav'); if(!aside) return;
  if(__CREATORS_NAV===null) __CREATORS_NAV=aside.innerHTML;
  const want=S.mod||'creators';
  if(want!=='creators'||aside.dataset.mod!=='creators'){ aside.innerHTML=want==='creators'?__CREATORS_NAV:modNavHTML(want); aside.dataset.mod=want; }
  document.querySelectorAll('.rail-item[data-mod]').forEach(b=>{ const on=b.dataset.mod===want; b.classList.toggle('on',on); on?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'); });
}
function phPageHTML(){
  const label=S.page.slice(3), prof=['AI Chat','Automations','MCP'].includes(label), crumb=prof?'Settings':MODS[modOfPage()].title;
  return `<div class="ph-page"><p class="ph-crumb">${esc(crumb)}</p><h2 class="ph-title">${esc(label)}</h2>
    <div class="ph-empty"><b>Not built yet</b><span>This section is set up in the navigation. Its content will be added in a later step.</span></div></div>`;
}

/* ── Status overlay (above the brand avatar): nothing to show yet ── */
function reqOvRender(){ const b=document.getElementById('reqOvBody'); if(b) b.innerHTML='<div class="alert-empty"><b>Nothing here yet</b></div>'; }
const dateInDays=n=>{const d=new Date(TODAY+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};

/* ════════ DATA (from Creator Intelligence prototype) ════════ */
const BRANDS=[
 {name:'Mamaearth',mark:'m',color:'#15803d',count:3,paid:0,views:'44.8K',eng:'7.86%',last:'Sep 4',cat:'Skincare'},
 {name:'Minimalist',mark:'m.',color:'#1e293b',count:3,paid:1,views:'81.6K',eng:'8.58%',last:'Sep 2',cat:'Skincare'},
 {name:'Adidas',mark:'▲',color:'#0f172a',count:3,paid:1,views:'46.3K',eng:'6.86%',last:'May 25',cat:'Fitness'},
 {name:'Sephora',mark:'S',color:'#0f172a',count:1,paid:1,views:'126.5K',eng:'10.82%',last:'Mar 21',cat:'Beauty'},
 {name:'The Derma Co',mark:'D',color:'#1e40af',count:1,paid:1,views:'59.1K',eng:'7.1%',last:'Aug 12',cat:'Skincare'},
 {name:'Plum',mark:'p',color:'#5b21b6',count:1,paid:0,views:'72.4K',eng:'8.4%',last:'Jul 11',cat:'Beauty'}
];
const TABS=['Overview','Content','Content Performance','Evaluated Reports','Collaborations','Audience'];
const TOPICS=['Food','Wellness','Parenting','Travel','Skincare','Lifestyle','Books','DIY'];
const APPROACHES=['Product showcase','Personal lifestyle','Editorial storytelling','Behind the scenes','Tutorial','Day in the life'];
const TITLES=['The everyday reset','My 5-minute routine','A little weekend ritual','What actually works','The essentials I keep','An honest product test','Sunday slow morning','Three things I learned','Behind my daily routine','Making time for myself','My favorite little finds','A simpler way to do it'];
const FORMATS=['Reel','Reel','Static','Carousel','Video','Short'];
const PASTEL=['#fbcfe8','#dbeafe','#bbf7d0','#fef3c7','#dbeafe','#fef3c7'];
const pastelURI=c=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><rect width="4" height="5" fill="${c}"/></svg>`);
const photo=p=>pastelURI(PASTEL[(p.id-1)%PASTEL.length]);
const POSTS=Array.from({length:36},(_,i)=>{
  const brand=i%3===0?BRANDS[Math.floor(i/3)%6].name:null;
  const classification=i<4?'Paid partnership':i<7?'Likely sponsored':i<12?'Brand mention':'Organic';
  const evaluation=i%9===0?'Flagged':i%4===0?'Evaluated':'Not evaluated';
  return {id:i+1,title:TITLES[i%12],platform:i%4===0?'TikTok':'Instagram',format:FORMATS[i%6],
    date:`2026-${String(9-Math.floor(i/12)).padStart(2,'0')}-${String(25-i%22).padStart(2,'0')}`,
    views:Math.round(18000+(i*3917)%180000),likes:Math.round(800+(i*181)%9000),
    comments:Math.round(20+(i*29)%420),shares:Math.round(40+(i*71)%1300),
    eng:+(4.2+(i*1.37)%8.1).toFixed(2),duration:`0:${String(12+(i*7)%48).padStart(2,'0')}`,
    topic:TOPICS[i%8],approach:APPROACHES[i%6],hook:['Nobody talks about this…','Stop doing this immediately…','This changed everything…','I tried this for 30 days…'][i%4],
    classification,brand,evaluation};
});
const V3PERF={
 All:{count:'142 posts',updated:'Updated 3h ago',metrics:[['Typical views','20.5K','26× follower count'],['Posts per week','4.5','Recent cadence'],['Branded posts','11%','16 of 142'],['Average likes','1.8K','Per post']],formats:[['Video',44],['Carousel',50],['Image',6]]},
 Instagram:{count:'98 posts',updated:'Updated 3h ago',metrics:[['Typical Reel views','24.8K','Per Reel'],['Posts per week','3.2','Instagram cadence'],['Branded posts','12%','12 of 98'],['Average likes','2.1K','Per post']],formats:[['Reels',62],['Carousel',31],['Image',7]]},
 Meta:{count:'44 posts',updated:'Updated 5h ago',metrics:[['Typical video views','12.3K','Per video'],['Posts per week','1.3','Meta cadence'],['Branded posts','9%','4 of 44'],['Average reactions','960','Per post']],formats:[['Video',61],['Image',30],['Link',9]]},
 TikTok:{count:'62 posts',updated:'Updated 3h ago',metrics:[['Typical video views','32.4K','Per video'],['Posts per week','2.1','TikTok cadence'],['Branded posts','8%','5 of 62'],['Average likes','3.2K','Per video']],formats:[['Video',86],['Photo',10],['Other',4]]}
};
const DIMENSIONS=[
 {name:'Topics',color:'#2563eb',items:[['Skincare',28,32,148,820,4.8],['Wellness',22,25,112,640,4.2],['Daily routines',19,22,94,520,3.8],['Books & reading',11,13,59,290,3.5],['DIY',7,8,31,180,2.9]]},
 {name:'Angles',color:'#0284c7',items:[['Problem → Solution',26,30,152,850,5.1],['Personal experience',23,26,117,680,4.4],['Product comparison',15,17,83,420,3.7],['Expert advice',13,15,69,330,3.5],['Before & after',10,12,56,290,3.3]]},
 {name:'Style',color:'#f59e0b',items:[['Talking head',32,37,177,940,4.9],['Product demo',25,29,130,720,4.3],['Voiceover',18,21,88,510,3.9],['B-roll montage',8,9,43,240,3.2],['Text-led',4,4,17,100,2.8]]},
 {name:'Problems Highlighted',color:'#7c3aed',items:[['Dry skin',21,24,120,620,4.7],['Time constraints',18,21,105,570,4.1],['Sensitive skin',14,16,76,440,3.6],['Daily stress',12,14,66,390,3.4],['Product confusion',9,10,49,310,3.1]]},
 {name:'Products',color:'#ef4444',items:[['Face serum',24,28,146,790,4.6],['Moisturizer',19,22,108,610,4.2],['Sunscreen',17,20,96,540,3.9],['Cleansers',12,14,65,370,3.4],['Hair care',9,10,48,260,3.1]]}
];
const DESC=['Everyday','Budget','Seasonal','Beginner','Quick','Premium','Morning','Weekly','Personal','Trending','Simple','Expert','Routine','Short-form','Summer','Winter','Travel','Family','Sustainable'];
const DIMS=DIMENSIONS.map(d=>{
  const base=d.items.map((r,i)=>({id:i,name:r[0],posts:r[1],volume:r[2],likes:r[3],comments:r[4],engagement:r[5]}));
  const filler=Array.from({length:95},(_,i)=>{
    const o=d.items[i%d.items.length], posts=2+(i*7)%26;
    return {id:5+i,name:DESC[i%DESC.length]+' '+o[0].toLowerCase(),posts,volume:Math.round(posts/142*1000)/10,likes:Math.round((13+(i*17)%170)*10)/10,comments:60+(i*43)%760,engagement:Math.round((1.2+((i*13)%57)/10)*10)/10};
  });
  return {...d,short:d.name==='Problems Highlighted'?'Problems':d.name,rows:[...base,...filler]};
});
const CREATIVE=[
 {name:'Creative positioning',summary:'Approachable lifestyle storytelling grounded in everyday routines.',detail:'The creator positions recommendations as useful parts of a daily routine rather than overt advertising. Compare personally-led posts with direct product promotions.',evidence:'12 example posts'},
 {name:'Core content pillars',summary:'Wellness, lifestyle, books and practical advice anchor the content.',detail:'Wellness and lifestyle themes recur most frequently. Explore whether these pillars overlap with a prospective brand’s category.',evidence:'8 content pillars'},
 {name:'Preferred formats',summary:'Short-form video drives discovery; carousels support depth.',detail:'Reels and other short-form formats support awareness; carousels offer opportunities for step-by-step education. Compare engagement and saves by format.',evidence:'5 creative formats'},
 {name:'Hook patterns',summary:'Personal hooks and questions create accessible entry points.',detail:'Question-based openings, first-person promises and concise problem statements are recurring hooks. Inspect posts that generated above-average engagement.',evidence:'9 recurring hooks'},
 {name:'Storytelling patterns',summary:'First-hand experiences and demonstrations build credibility.',detail:'Stories built around personal experience and product demonstrations tend to provide useful context for brand messaging.',evidence:'11 storytelling patterns'},
 {name:'Posting cadence',summary:'Consistent publishing supports ongoing audience familiarity.',detail:'Examine posting frequency and gaps before planning a time-sensitive campaign. Publishing consistency matters as much as total creative volume.',evidence:'3-month sample'},
 {name:'Strengths',summary:'Relatable tone and tangible product use are recurring advantages.',detail:'Relatable explanations, personal credibility and practical tips are the main creative strengths visible in the sample.',evidence:'7 positive signals'},
 {name:'Weaknesses',summary:'Some commercial messages have limited supporting detail.',detail:'Some posts do not clearly establish a use case or a persuasive benefit. Validate performance before committing to a content direction.',evidence:'4 improvement areas'},
 {name:'Opportunities',summary:'Expand high-performing wellness and product-education themes.',detail:'There is room to test more tutorial sequences, comparative demonstrations and serialized content within the successful topics.',evidence:'6 test opportunities'},
 {name:'Brand collaboration approaches',summary:'Repeat brand partnerships work best when naturally integrated.',detail:'The strongest collaborations feel editorially aligned with the creator’s recurring interests rather than inserted as isolated promotions.',evidence:'6 partner brands'},
 {name:'Audience communication style',summary:'A conversational, accessible tone suits engaged communities.',detail:'Accessible language and a conversational presentation style help connect a creator narrative to practical audience needs.',evidence:'24 comment samples'},
 {name:'Recommendations',summary:'Prioritize authentic demonstrations and test clearer calls to action.',detail:'Build briefs around familiar subjects, show the product in context and measure engagement quality rather than views alone.',evidence:'5 proposed actions'}
];
const COLLABS=[
 {id:1,type:'Brands',name:'Mamaearth',signal:'Brand mention',date:'2026-09-05',post:4},
 {id:101,type:'Brands',name:'Mamaearth',signal:'Paid partnership',date:'2026-09-22',post:3},
 {id:2,type:'Brands',name:'Mamaearth',signal:'Brand placement',date:'2026-07-14',post:13},
 {id:3,type:'Brands',name:'Mamaearth',signal:'Paid partnership',date:'2026-05-17',post:25},
 {id:4,type:'Brands',name:'Minimalist',signal:'Brand placement',date:'2026-09-20',post:1},
 {id:5,type:'Brands',name:'Minimalist',signal:'Paid partnership',date:'2026-06-10',post:19},
 {id:6,type:'Brands',name:'Adidas',signal:'Brand mention',date:'2026-08-12',post:7},
 {id:102,type:'Brands',name:'Adidas',signal:'Brand placement',date:'2026-08-27',post:9},
 {id:7,type:'Brands',name:'Sephora',signal:'Brand placement',date:'2026-04-24',post:28},
 {id:8,type:'Brands',name:'The Derma Co',signal:'Brand mention',date:'2026-10-10',post:8},
 {id:9,type:'Brands',name:'Plum',signal:'Paid partnership',date:'2026-03-19',post:32},
 {id:10,type:'People',name:'@wellnesswithamy',signal:'Collaborator',date:'2026-09-09',post:6},
 {id:11,type:'People',name:'@readwithmaya',signal:'Caption mention',date:'2026-09-26',post:10},
 {id:12,type:'People',name:'@stylebyjules',signal:'Caption mention',date:'2026-08-18',post:14},
 {id:13,type:'People',name:'@dailywithsam',signal:'Collaborator',date:'2026-07-05',post:16},
 {id:14,type:'People',name:'@plantbasedliv',signal:'Caption mention',date:'2026-06-12',post:22},
 {id:15,type:'People',name:'@readwithmaya',signal:'Collaborator',date:'2026-05-14',post:29},
 {id:16,type:'People',name:'@stylebyjules',signal:'Caption mention',date:'2026-10-09',post:3},
 {id:201,type:'Brands',name:'Mamaearth',signal:'Paid partnership',date:'2026-10-12',post:3,ours:true},
 {id:202,type:'Brands',name:'Mamaearth',signal:'Brand placement',date:'2026-08-18',post:16,ours:true},
 {id:203,type:'Brands',name:'Mamaearth',signal:'Paid partnership',date:'2026-07-22',post:22,ours:true}
];
const OUR_COLOR='#ec4899';
const SIG_COLORS={'Paid partnership':'#16a34a','Collaborator':'#7c3aed','Brand mention':'#3b82f6','Caption mention':'#3b82f6','Brand placement':'#f59e0b'};
const CAMPAIGNS=['Diwali Gifting 2026','Winter Denim Drop','Wellness Creators Q4','Summer Lifestyle Launch'];
const CANDIDATES=['Alex Rivera','Taylor Woods','Morgan Lee','Sam Patel','Avery Brooks'];
const ANSWERS=[
 ['Why is authenticity flagged?','Authenticity is 62/100 because at least one analysed post shows an unusual relationship between views and engagement. Nine posts were read; one selected post was unavailable.'],
 ['How does sponsored content perform?','In the demo comparison, organic posts show median views of 94.6K versus 49.1K for sponsored posts. Engagement is 8.00% versus 8.25%. Small sample sizes warrant caution.'],
 ['Is the audience right for Mamaearth?','Nicole’s audience skews female, which supports relevance, but the United States leads her audience geography while the Mamaearth campaign targets India. Review audience fit before committing.'],
 ['What formats work best?','Reels are the strongest example format in this demo, with 126.1K typical views and +54% uplift versus the illustrative baseline.']
];

/* ════════ HELPERS ════════ */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(n);
const ico=(d,c='')=>`<svg class="ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I={
 table:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 doc:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
 upload:'<path d="M12 16V4m0 0L7 9m5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
 download:'<path d="M12 3v12m0 0 5-5m-5 5-5-5M4 17v3h16v-3"/>',
 export:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
 heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
 filledHeart:'<path fill="currentColor" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
 compare:'<path d="M7 4v16M7 4L3 8M7 4l4 4M17 20V4M17 20l4-4M17 20l-4-4"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 more:'<circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/>',
 chevDown:'<path d="M6 9l6 6 6-6"/>',
 chevRight:'<path d="M9 6l6 6-6 6"/>',
 chevL:'<path d="M15 6l-6 6 6 6"/>',
 back:'<path d="M15 6l-6 6 6 6"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
 calc:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
 list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
 play:'<path fill="currentColor" d="M7 5v14l12-7z"/>',
 check:'<path d="M20 6L9 17l-5-5"/>',
 x:'<path d="M18 6L6 18M6 6l12 12"/>',
 alert:'<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
 refresh:'<path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5"/>',
 external:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
 sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 heartSm:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
 comment:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
 link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
 download:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
 export:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
 layers:'<path d="M12 2l10 5-10 5L2 7z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',
 star:'<path fill="currentColor" stroke="none" d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9L7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>'
};
const icon=(k,c='')=>ico(I[k],c);
const deepLink=(tab,label)=>`<a class="deeplink" href="#" onclick="event.preventDefault();switchTab(${tab})" aria-label="Open ${esc(label)}" title="Open ${esc(label)}">${icon('external','ico-sm')}</a>`;
const brandMark=(b,size='')=>`<span class="brand-mark ${size}" style="background:${b.color}">${esc(b.mark)}</span>`;
const kpi=(l,v,s)=>`<div class="kpi"><div class="kpi-label">${l}</div><div class="kpi-value">${v}</div><div class="kpi-sub">${s}</div></div>`;
const statusOf=p=>p.evaluation==='Flagged'?'Suspicious':p.evaluation==='Evaluated'?'Healthy':'Not evaluated';
const statusPill=p=>p.evaluation==='Flagged'?'<span class="pill warn">Suspicious</span>':p.evaluation==='Evaluated'?'<span class="pill ok">Healthy</span>':'<span class="pill">Not evaluated</span>';
const v36Format=p=>p.format==='Carousel'?'Carousel':(['Reel','Video','Short'].includes(p.format)?'Video':'Image');
const dateShort=d=>new Date(d+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'});

/* ════════ STATE ════════ */
const S={
  tab:0, saved:false, menu:null, campaigns:[], notes:[],
  relationship:'Not contacted', owner:'Unassigned',
  recentTopic:'',
  perfTab:'All', perfPeriod:'3m',
  content:{q:'',format:'All formats',platform:'All',sort:'Newest',collection:'All',view:'Grid'},
  selected:new Set(), carousel:{},
  post:null, postTab:'Overview',
  page:'creators', myCreator:null, myQ:'', myStatus:'All', myTier:'All', myGender:'All', myState:'All', mySpoc:'All', mySel:[], discFilter:'', discSource:'All content', discTier:'All', discAdded:[], discCreator:null, discTab:0, view:'tabs', perfSub:0, perfPlat:'Instagram', perfDim:0, perfSel:0, perfQ:'', perfAll:false, perfDetailSel:null,
  creativeDim:0, metric:'Views', brandFilter:'All', monthFilter:'All',
  report:'Authenticity', brand:'Mamaearth', campaign:'Diwali Gifting 2026', reportStatus:'Ready', reportRefreshed:false, postsRead:9,
  collab:{type:'Brands',period:6,signal:'All',sortKey:'name',sortDir:1},
  audience:'Overview', fitMode:false
};

/* ════════ LAYER (drawers, modals, toasts) ════════ */
const TOAST_WARN=/^(No |Nothing |Enter |Paste |Select |Add at least |Pick |Choose |Those creators already|This campaign has no )/;
const TOAST_ICO={ok:'<path d="m5 12 5 5 9-10"/>',warn:'<path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/>'};
/* Add confirmation with an overlink to the place it was added to (stays 5s so it can be clicked) */
/* label = bold heading, text = sentence before the list name, link = overlink to the list/campaign */
function addToast(label,text,link,fn){ toast('',{title:label,sub:text,action:{label:link,fn},ms:5000}); }
/* opt.action {label, fn} adds a button; a toast with an action stays longer so it can be clicked */
function toast(msg,opt){
  const l=document.getElementById('layer');
  document.querySelectorAll('.toast').forEach(x=>x.remove());
  const kind=TOAST_WARN.test(String(msg))?'warn':'ok';
  const t=document.createElement('div'); t.className='toast toast--'+kind; t.setAttribute('role','status');
  /* Every toast uses the agreed layout: icon, bold title, optional sub line and overlink, close button */
  const title=opt&&opt.title?opt.title:String(msg);
  const hasSub=!!(opt&&(opt.sub||opt.action));
  const body=`<span class="toast-msg"><b class="toast-title">${esc(title)}</b>${hasSub?`<span class="toast-sub">${esc(opt.sub||'')}${opt&&opt.action?` <a href="#" class="toast-link">${esc(opt.action.label)}</a>`:''}</span>`:''}</span>`;
  t.innerHTML=`<span class="toast-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${TOAST_ICO[kind]}</svg></span>${body}`;
  t.classList.add('toast--rich');
  const x=document.createElement('button'); x.type='button'; x.className='toast-x'; x.setAttribute('aria-label','Close'); x.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  x.onclick=()=>t.remove(); t.appendChild(x);
  if(opt&&opt.action){
    const a=t.querySelector('.toast-link'); if(a) a.onclick=e=>{ e.preventDefault(); t.remove(); opt.action.fn(); };
  }
  l.appendChild(t); clearTimeout(toast._t); toast._t=setTimeout(()=>t.remove(),(opt&&opt.ms)||(opt&&opt.action?5000:2800));
}
function closeLayer(){ document.querySelectorAll('#layer > *').forEach(n=>n.remove()); if(typeof syncHash==='function') syncHash(); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&document.querySelector('#layer > *')) closeLayer(); });
function showDrawer(title,body,cls=''){
  closeLayer();
  document.getElementById('layer').insertAdjacentHTML('beforeend',`<div class="scrim" onclick="closeLayer()"></div><aside class="drawer ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="drawer-head"><span>${title}</span><button class="icon-btn" onclick="closeLayer()" aria-label="Close">${icon('x')}</button></div><div class="drawer-body" id="drawerBody">${body}</div></aside>`);
}
const MK_CSS=`<style>
.modal.mk{width:min(480px,92vw);padding:24px;gap:0;border-radius:16px;color:#0f172a;font-size:14px;line-height:1.5}
.modal.mk>h2{font-size:18px;font-weight:700;line-height:1.3;margin:0 40px 6px 0;color:#0f172a;letter-spacing:-.01em}
.modal.mk .mk-x{position:absolute;top:18px;right:18px;width:32px;height:32px;padding:0;border:0;background:transparent;color:#0f172a;border-radius:8px;display:grid;place-items:center;cursor:pointer}
.modal.mk .mk-x:hover{background:#eff6ff}
.modal.mk .mk-x svg{display:block}
.modal.mk .mk-body{display:flex;flex-direction:column;gap:18px;margin-top:16px}
.modal.mk .mk-body>p,.modal.mk .mk-body .ds-caption{margin:0;font-size:14px;line-height:1.5;color:#0f172a}
.modal.mk .ds-dlg{display:flex;flex-direction:column;gap:18px;padding:0;width:100%;max-width:none;box-sizing:border-box}
.modal.mk .ds-dlg>.ds-caption{margin:0 !important;font-size:14px;color:#0f172a;line-height:1.5}
.modal.mk .ds-form{display:flex;flex-direction:column;gap:16px;width:100%;max-width:none;grid-template-columns:none;box-sizing:border-box}
.modal.mk .ds-field,.modal.mk label.ds-field{display:flex;flex-direction:column;gap:6px;width:100%;margin:0}
.modal.mk .ds-field>span{font-size:13px;font-weight:600;color:#0f172a}
.modal.mk input:not([type=checkbox]):not([type=radio]),.modal.mk select,.modal.mk textarea{width:100%;box-sizing:border-box;min-height:40px;padding:9px 12px;border:1px solid #bfdbfe;border-radius:8px;background:#ffffff;color:#0f172a;font:inherit;font-size:14px;outline:none}
.modal.mk textarea{min-height:88px;resize:vertical}
.modal.mk input:focus,.modal.mk select:focus,.modal.mk textarea:focus{border-color:#1d4ed8;box-shadow:0 0 0 3px #1d4ed824}
.modal.mk .mk-body [role=tablist]{margin:0;border-bottom:1px solid #e2e8f0}
.modal.mk .mk-body [role=tablist]+*{margin-top:12px !important}
.modal.mk .mk-body [role=tablist] [role=tab]{padding:10px 2px;margin-right:18px;font-size:14px;font-weight:600}
.modal.mk .mk-body .mk-scroll,.modal.mk .mk-body .lnch-list,.modal.mk .mk-body .ac-list{max-height:min(340px,46vh);overflow:auto;padding:2px 4px 6px 2px}
.modal.mk .col-mv-dlg{display:flex;flex-direction:column;gap:14px}
.modal.mk .ds-form{margin:0 !important}
.modal.mk .ds-tabrow{margin:0 !important}
.modal.mk .col-mv-list{max-height:300px;overflow:auto;padding:2px 2px 4px;margin:0}
.modal.mk .mk-body .ds-caption:last-child{margin-top:-4px !important}
.modal.mk .mk-body small,.modal.mk .mk-body .ds-table-meta,.modal.mk .mk-body .ds-caption,.modal.mk .mk-body p,.modal.mk .mk-body span{color:#0f172a}
.modal.mk .modal-foot{display:flex;justify-content:flex-end;align-items:center;gap:10px;margin:24px 0 0;padding:0}
.modal.mk .modal-foot .ds-btn,.modal.mk .modal-foot .btn{height:40px;min-width:96px;padding:0 18px;border-radius:8px;font-size:14px;font-weight:600;line-height:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;cursor:pointer}
.modal.mk .modal-foot .ds-btn--outline,.modal.mk .modal-foot .btn{background:#ffffff;border:1px solid #bfdbfe;color:#0f172a}
.modal.mk .modal-foot .ds-btn--primary{background:#1e40af;border:1px solid #1e40af;color:#ffffff}
.modal.mk .modal-foot .ds-btn--danger{background:#b91c1c;border:1px solid #b91c1c;color:#ffffff}
.modal.mk .modal-foot .ds-btn[disabled]{opacity:.5;cursor:not-allowed}
</style>`;
function showModal(title,body,footer){
  closeLayer();
  const x=`<button type="button" class="mk-x" aria-label="Close" title="Close" onclick="closeLayer()">${X_SVG.replace('<svg ','<svg style="display:block" ')}</button>`;
  document.getElementById('layer').insertAdjacentHTML('beforeend',`${MK_CSS}<div class="scrim" onclick="closeLayer()"></div><div class="modal mk" role="dialog" aria-modal="true" aria-label="${esc(title)}">${x}<h2>${title}</h2><div class="mk-body">${body}</div><div class="modal-foot">${/closeLayer\(\)"[^>]*>(Cancel|Close|Done)</.test(footer||'')?'':'<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button>'}${footer}</div></div>`);
}
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeLayer(); if(S.menu){ S.menu=null; paintHeader(); } } });
document.addEventListener('click',e=>{ if(S.menu && !e.target.closest('[data-menu]')){ S.menu=null; paintHeader(); } });

/* ════════ HEADER (main + compact sticky bar) ════════ */
function toggleMenu(name){ S.menu=S.menu===name?null:name; paintHeader(); }
function creatorOf(){ const id=detailId(); return DISC.find(x=>x.id===id)||DISC[0]; }
function initialsOf(n){ return String(n||'').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase(); }
function actionsHTML(){
  const c=creatorOf(), camp=S.campaigns.length, inPlans=CAMP_PLANS.filter(p=>p.creators.includes(c.id)).length;
  return `
  ${inPlans?`<span class="ds-dh-chip">In ${inPlans} plan${inPlans>1?'s':''}</span>`:''}
  <a class="ds-dh-icon" href="https://www.instagram.com/${encodeURIComponent(c.handle.replace(/^@/,''))}/" target="_blank" rel="noopener" aria-label="Open ${esc(c.name)} on Instagram">${icon('external','ico-sm')}</a>
  <button class="ds-dh-icon ${S.saved?'heart-on':''}" onclick="toggleSave()" aria-label="${S.saved?'Remove from saved':'Save creator'}" aria-pressed="${S.saved}">${icon(S.saved?'filledHeart':'heart','ico-sm')}</button>
  <div class="dd" data-menu>
    <button class="ds-dh-btn ${S.menu==='compare'?'is-on':''}" onclick="toggleMenu('compare')" aria-expanded="${S.menu==='compare'}">${icon('compare','ico-sm')}Compare ${icon('chevDown','ico-sm')}</button>
    ${S.menu==='compare'?`<div class="menu" role="menu"><div class="head">Compare with creator</div><div class="search menu-search">${icon('search')}<input placeholder="Search available creators" oninput="filterCandidates(this.value)"></div><div id="cands">${CANDIDATES.map(n=>`<button data-person onclick="pickCandidate('${n}')"><span class="ring"></span>${n}</button>`).join('')}</div></div>`:''}
  </div>
  <div class="dd" data-menu>
    <button class="ds-dh-btn ds-dh-btn--primary" onclick="toggleMenu('plan')" aria-expanded="${S.menu==='plan'}">${icon('plus','ico-sm')}Add to plan ${icon('chevDown','ico-sm')}</button>
    ${S.menu==='plan'?`<div class="menu menu-plan" role="menu"><button type="button" role="menuitem" onclick="S.menu=null;paintHeader();cpOpen(['${c.id}'])">${icon('target','ico-sm')}Add to campaign</button></div>`:''}
  </div>
  <div class="dd" data-menu>
    <button class="ds-dh-icon" onclick="toggleMenu('more')" aria-label="More actions" aria-expanded="${S.menu==='more'}">${icon('more','ico-sm')}</button>
    ${S.menu==='more'?`<div class="menu" role="menu"><div class="head">Creator actions</div>
      <button onclick="copyLink()">${icon('link')}Copy profile link</button>
      <a target="_blank" rel="noopener" href="https://www.instagram.com/">${icon('external')}Open Instagram</a>
      <a target="_blank" rel="noopener" href="https://www.facebook.com/">${icon('external')}Open Meta</a>
      <a target="_blank" rel="noopener" href="https://www.tiktok.com/">${icon('external')}Open TikTok</a>
      <hr>
      <button onclick="ccsOpen('profile','${c.id}')">${icon('calc','ico-sm')}Estimate creator rate</button>
      <button onclick="refreshData()">${icon('refresh')}Refresh creator data</button>
      <button onclick="exportProfile()">${icon('export')}Export profile</button></div>`:''}
  </div>`;
}
function tabsHTML(){
  return TABS.map((t,i)=>`<button role="tab" class="tab ${S.tab===i?'active':''}" aria-selected="${S.tab===i}" onclick="switchTab(${i})">${t}</button>`).join('');
}
function paintHeader(){
  syncNav();
  if(limitedDetail()){ document.getElementById('header').innerHTML=''; document.getElementById('compact').innerHTML=''; return; }
  if(phIsPage()){ document.getElementById('header').innerHTML=''; document.getElementById('compact').innerHTML=''; return; }
  if(listPage()&&!detailId()){ document.getElementById('header').innerHTML=''; document.getElementById('compact').innerHTML=''; return; }
  const c=creatorOf(), first=initialsOf(c.name);
  const badges=[c.tier,c.source].map(t=>`<span class="ds-dh-badge">${esc(t)}</span>`).join('');
  const meta=[esc(c.handle),`${fmt(c.followers)} followers`,...c.tags.map(esc)].map(x=>`<span>${x}</span>`).join('<span class="ds-dh-sep">·</span>');
  document.getElementById('header').innerHTML=`${crumbHTML()}
    <header class="ds-dh">
      <div class="ds-dh-top">
        <button class="ds-dh-back" onclick="${S.page==='creators'?"setPage('creators')":"closeDiscCreator()"}" aria-label="Back">${dsBackSvg}</button>
        <div class="ds-dh-avatar ${S.saved?'saved':''}" style="background:${AV_PAL[avHash(c.id)%AV_PAL.length]};color:#ffffff">${esc(first)}</div>
        <div class="ds-dh-text">
          <div class="ds-dh-name"><h1>${esc(c.name)}</h1>${badges}</div>
          <div class="ds-dh-meta">${meta}</div>
        </div>
        <div class="ds-dh-actions">${actionsHTML()}</div>
      </div>
      <div class="ds-dh-tabrow">${S.view==='report'?'':`<nav class="ds-dh-tabs" role="tablist" aria-label="Creator profile tabs">${tabsHTML()}</nav>`}<div class="ds-seg ds-viewseg" role="tablist" aria-label="View">${[['tabs','Tabs'],['report','Report']].map(([k,l])=>`<button role="tab" class="${S.view===k?'on':''} ds-view-ico" aria-selected="${S.view===k}" aria-label="${l}" title="${l}" onclick="setView('${k}')">${icon(VIEW_ICO[k],'ico-sm')}</button>`).join('')}</div></div>
    </header>`;
  document.getElementById('compact').innerHTML=`<div class="compact-inner">
    <div class="compact-row">
      <button class="icon-btn" onclick="${S.page==='creators'?"setPage('creators')":"closeDiscCreator()"}" aria-label="Back">${icon('back')}</button>
      ${dsAv(c.id,c.name)}<strong class="compact-name">${esc(c.name)}</strong>
      <div class="actions">${actionsHTML()}</div>
    </div>
    ${S.view==='report'?'':`<nav class="tabs" role="tablist">${tabsHTML()}</nav>`}</div>`;
}
function toggleSave(){ S.saved=!S.saved; S.menu=null; paintHeader(); toast(S.saved?'Creator saved':'Creator removed from saved'); }
function filterCandidates(v){ const q=v.trim().toLowerCase(); document.querySelectorAll('[data-person]').forEach(e=>e.style.display=e.textContent.toLowerCase().includes(q)?'':'none'); }
function pickCandidate(n){ S.menu=null; paintHeader(); toast(n+' selected for comparison · demo'); }
function copyLink(){ navigator.clipboard?.writeText(location.href).catch(()=>{}); S.menu=null; paintHeader(); toast('Profile link copied'); }
function refreshData(){ S.menu=null; paintHeader(); toast('Demo profile refresh completed'); }
function exportProfile(){
  const txt=`Nicole Pearce — Creator Intelligence (Demo)\nEngagement: 7.74%\nAuthenticity: 62\nBrand fit (Mamaearth): 92\nBrands: ${BRANDS.map(b=>b.name).join(', ')}`;
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'})); a.download='nicole-pearce-demo-summary.txt'; a.click(); URL.revokeObjectURL(a.href);
  S.menu=null; paintHeader();
}

/* ════════ NAVIGATION ════════ */
function switchTab(i){ S.tab=i; if(!detailId()) S.page='profile'; S.view='tabs'; S.menu=null; paintHeader(); paintBody(true); window.scrollTo(0,0); }
function jump(i,sub){
  if(sub!==undefined){ if(i===2) S.perfSub=['Performance Overview','Creative Insights'].indexOf(sub)<0?0:['Performance Overview','Creative Insights'].indexOf(sub); if(i===3) S.report=sub; if(i===5) S.audience=sub; }
  switchTab(i);
}
const TH_ICO={'creator':()=>DISC_COL_PATHS.creator,'campaign':()=>DISC_COL_PATHS.creator,'campaign manager':()=>DISC_COL_PATHS.creator,'spoc':()=>DISC_COL_PATHS.creator,'tier':()=>DISC_COL_PATHS.tier,'followers':()=>DISC_COL_PATHS.followers,'creators':()=>DISC_COL_PATHS.followers,'lifecycle':()=>'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m8 12 3 3 5-5"/>','status':()=>'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m8 12 3 3 5-5"/>','product':()=>'<path d="M20 7 12 3 4 7v10l8 4 8-4z"/><path d="M4 7l8 4 8-4M12 11v10"/>','concept':()=>'<path d="M4 6h16M4 12h10M4 18h7"/>','type':()=>'<path d="M4 6h16M4 12h10M4 18h7"/>','last live':()=>'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>','reels':()=>'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18M12 3v18"/>','progress':()=>'<path d="M4 20V10M10 20V4M16 20v-6M22 20H2"/>','views':()=>DISC_COL_PATHS.views,'avg views':()=>DISC_COL_PATHS.views,'organic':()=>DISC_COL_PATHS.views,'paid':()=>DISC_COL_PATHS.views,'cpv':()=>DISC_COL_PATHS.views,'er%':()=>DISC_COL_PATHS.engagement,'engagement':()=>DISC_COL_PATHS.engagement,'cost':()=>'<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>','brand fit':()=>'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>','authenticity':()=>OV_PATHS.shield};
function tblStyleHeads(){
  document.querySelectorAll('.ds-table thead th').forEach(th=>{
    if(th.closest('.pl-cmp')) return;
    if(th.querySelector('.my-th,input,select,button')) return;
    const label=th.textContent.trim(); if(!label) return;
    const k=label.toLowerCase().replace(/\s+/g,' ');
    const path=(TH_ICO[k]||(()=>COL_ICO_LABEL[k]||COL_ICO_GRID))();
    const svg=`<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
    th.innerHTML=`<span class="my-th">${svg}${th.innerHTML}</span>`;
  });
}
function dkInsHTML(x){
  const P={CONCEPT:'<path d="M20 12 12 20l-8-8V4h8z"/><circle cx="8" cy="8" r="1.5"/>',FORMAT:'<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/>',PRODUCT:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>','PAID REACH':'<path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a4 4 0 0 1 0 6"/>'};
  const d=P[String(x.tag).toUpperCase()]||'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>';
  return `<div class="dk-ins"><div class="dk-ins-h"><i class="dk-ins-ico"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg></i><span class="dk-ins-tag">${x.tag}</span></div><b class="dk-ins-t">${x.t}</b><span class="dk-ins-r">${x.r}</span></div>`;
}
function paintBody(fade){ stateBoot(); paintBodyRaw(fade); tblStyleHeads(); stateSave(); }
const CAMP_QA=`<style class="camp-qa">
.ds-page h1,.cdh-title h1{font-size:20px!important;line-height:1.25!important;font-weight:600!important;letter-spacing:-.01em}
.ds-avatar,.ds-avatar-more,.ct-thumb,.dk-boost{font-size:12px!important}
.ds-page .ds-avatar-stack .ds-avatar,.ds-page .cp-creators .ds-avatar,.ds-page .ds-avatar-stack .ds-avatar-more{font-size:12px!important}
.ds-page .cp-table tr>*:nth-last-child(2){min-width:190px}
.ds-page .cp-table .cp-creators{min-width:170px}
.ds-page .crumb,.ds-page .crumb .link{color:#1e40af!important}
.ds-page .dk-ov-row{grid-template-columns:repeat(4,minmax(0,1fr))!important}
.ds-page .cp-table .ds-sticky-l2{min-width:240px}
.ds-page .tv-m3 *{white-space:normal!important;overflow:visible!important;text-overflow:clip!important}
.ds-page .pl-hero-i b{white-space:normal!important;overflow:visible!important}
.ds-table-meta,.ds-caption,.ds-page-desc,.ds-note,.cdh-meta,.ct-link,.ct-muted,.dk-ov-l,.dw-s,.tl-meta,.ds-page small,.ds-page p{color:#1e40af!important}
.my-th,.dw-dots,.ds-page summary.ds-btn{color:#0f172a!important}
[style*="6b7280"],[style*="9ca3af"],[style*="4b5563"],[style*="107, 114, 128"],[style*="156, 163, 175"]{color:#1e40af!important}
.ds-page .ds-btn--sm{height:34px!important;min-height:34px!important}
.ds-page .ds-btn:not(.ds-btn--sm):not(.ds-btn--icon){height:36px!important;min-height:36px!important}
.ds-page .ds-btn--icon{width:34px!important;height:34px!important;min-width:34px!important}
.ds-namebtn{white-space:normal!important;text-align:left;height:auto!important;min-height:24px;line-height:1.35;overflow-wrap:anywhere}
.ds-page small,.ds-page .dk-ov-l,.ds-page .dw-s,.ds-page .tl-meta{white-space:normal!important;overflow-wrap:anywhere}
.ds-page button.link{min-height:24px;display:inline-flex;align-items:center}
.ds-cb input[type=checkbox]{width:18px;height:18px;margin:0}
.ds-filter-x{min-width:24px;min-height:24px}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
</style>`;

function isInMy(id){const c=crOf(id);return !!c&&!c.repo;}
const PERSIST_KEY='adam_state_v1';
let __stateBooted=false;
function stateBoot(){ if(__stateBooted)return; __stateBooted=true;
 try{const v=JSON.parse(localStorage.getItem(PERSIST_KEY)||'null'); if(!v)return;
  if(Array.isArray(v.plans)){CAMP_PLANS.length=0; v.plans.forEach(x=>CAMP_PLANS.push(x));}
  if(Array.isArray(v.camps)){CAMP_LIST.length=0; v.camps.forEach(x=>CAMP_LIST.push(x));}
  if(v.repo)DISC.forEach(c=>{if(c.id in v.repo)c.repo=v.repo[c.id];});
 }catch(e){}
}
function stateSave(){ try{localStorage.setItem(PERSIST_KEY,JSON.stringify({plans:CAMP_PLANS,camps:CAMP_LIST,repo:Object.fromEntries(DISC.map(c=>[c.id,!!c.repo]))}));}catch(e){} }
function planPostsFor(ids,product){ return (ids||[]).map((cid,i)=>({id:'po'+Date.now()+'_'+i,creator:cid,product:product||'',date:'',views:0,organic:0,paid:0,cost:0,concept:'',format:'Post',url:''})); }

function paintBodyRaw(fade){ paintSecNav();
  const main=document.getElementById('main');
  if(phIsPage()){ main.innerHTML=phPageHTML(); document.body.classList.remove('report-mode'); document.getElementById('header').innerHTML=''; document.getElementById('compact').innerHTML=''; syncNav(); return; }
  const views=[pOverview,pContent,pPerformance,pReports,pCollabs,pAudience];
  document.body.classList.toggle('report-mode', S.view==='report');
  main.innerHTML=(listPage()&&!detailId())?(S.page==='discover'?discoverHTML():S.page==='creators'?creatorsListHTML():S.page==='collections'?collectionsHTML():S.page==='collection'?collectionDetailHTML():S.page==='shortlist'?shortlistHTML():S.page==='content-tracker'?contentTrackerHTML():S.page==='dashboard'?dashboardHTML():S.page==='tracker'?dashboardHTML():S.page==='plan'?planDetailHTML():S.page==='campaign'?campaignDetailHTML():S.page==='settings'?settingsHTML():campaignsHTML()):(limitedDetail()?basicProfilePageHTML(crOf(detailId())):(S.view==='report'?reportHTML():views[S.tab]()));
  if(fade){ main.classList.remove('fade-in'); void main.offsetWidth; main.classList.add('fade-in'); }
  if(['campaigns','campaign','plan','tracker'].includes(S.page)) main.insertAdjacentHTML('afterbegin',CAMP_QA);
  placeCaret();
  syncHash();
}
function placeCaret(){
  const a=document.querySelector('.verdict.is-active'), r=document.querySelector('.report-body');
  if(!a||!r) return;
  const ar=a.getBoundingClientRect(), rr=r.getBoundingClientRect();
  r.style.setProperty('--caret-x', Math.round(ar.left+ar.width/2-rr.left)+'px');
}
window.addEventListener('resize',()=>placeCaret());

/* ════════ OVERVIEW (tab 0) ════════ */
function pOverview(){
  return `<div class="with-rail">
  <div class="stack">
    ${crTimelineHTML()}
    <section class="section">
      <div class="summary">
        <div class="section-head in-card"><h2>AI creator summary${deepLink(3,'Evaluated reports')}</h2><button class="btn sm ask-head" onclick="openAssistant()">${icon('sparkle','ico-sm')}Ask about this creator</button></div>
        <div class="takeaway">${icon('sparkle','ico-sm ai-ico')}<span>Worth considering for lifestyle campaigns, subject to authenticity and audience checks.</span></div>
        <p>${rptFirst()} creates relatable lifestyle and wellness content through everyday routines, personal stories and practical recommendations. Her approachable style suits discovery-focused campaigns, while audience fit and unusual engagement signals deserve closer review.</p>
        <div class="insights dk-ins-grid">
          <div class="dk-ins"><span class="dk-ins-tag">Strength</span><b class="dk-ins-t">Consistent wellness and everyday-lifestyle themes</b></div>
          <div class="dk-ins"><span class="dk-ins-tag">Strength</span><b class="dk-ins-t">Experience collaborating with six brands</b></div>
          <div class="dk-ins"><span class="dk-ins-tag">Validate</span><b class="dk-ins-t">Authenticity signals in one evaluated post</b></div>
          <div class="dk-ins"><span class="dk-ins-tag">Validate</span><b class="dk-ins-t">Audience geography against campaign targets</b></div>
        </div>
        <div class="between"><strong style="font-size:13px;color:var(--ink-strong)">Evaluated reports</strong></div>
        <div class="reports">
          ${gaugeCard('Authenticity',94,'Review','warn',['9 posts analysed','Refreshed 20h ago'],'Authenticity')}
          ${gaugeCard('Brand Fit',72,'Good fit','good',['36 posts analysed','Refreshed 1d ago'],'Brand Fit')}
        </div>
        
      </div>
    </section>

    <section class="section">
      <div class="card perf">
        <div class="section-head in-card"><h2>How their posts perform${deepLink(1,'Content')}</h2><span class="muted" style="font-size:12px">Public data</span></div>
        <div class="between"><div class="seg" role="tablist">${['All','Instagram','Meta','TikTok'].map(p=>`<button role="tab" class="${S.perfTab===p?'on':''}" aria-selected="${S.perfTab===p}" onclick="setPerfTab('${p}')">${p}</button>`).join('')}</div><span class="muted" style="font-size:12px">${V3PERF[S.perfTab].count} · ${V3PERF[S.perfTab].updated}</span></div>
        <div class="metrics" id="perfMetrics">${perfMetricsHTML()}</div>
        <div class="format-bar" id="perfFormat">${perfFormatHTML()}</div>
      </div>
    </section>

    <section class="section">
      <div class="card">
        <div class="section-head in-card"><h2>Recent posts${deepLink(1,'Content')}</h2></div>
        <div class="row" style="margin-bottom:12px">${['Wellness','Lifestyle','Books','DIY','Personal storytelling','Product demos'].map(t=>`<button class="chip btn-like ${S.recentTopic===t?'on':''}" aria-pressed="${S.recentTopic===t}" onclick="toggleRecentTopic('${t}')">${t}</button>`).join('')}</div>
        <div class="thumbs">${recentPosts().map(p=>`<button class="thumb" onclick="openPost(${p.id})" aria-label="Open ${esc(p.title)}"><img class="media" src="${photo(p)}" alt="" loading="lazy"></button>`).join('')}</div>
      </div>
    </section>

  </div>
  <aside class="stack">
    <div class="rail-card">
      <div class="rail-head"><h3>Creator information</h3></div>
      <div class="info"><span>Instagram</span><strong><a href="https://www.instagram.com/${rptHandle()}/" target="_blank" rel="noopener">@${rptHandle()}</a> · ${fmt(rptCreator().followers)}</strong></div>
      ${(rptCreator().platforms||[]).includes('TikTok')?`<div class="info"><span>TikTok</span><strong><a href="https://www.tiktok.com/@${rptHandle()}" target="_blank" rel="noopener">@${rptHandle()}</a></strong></div>`:''}
      <div class="info"><span>CRM owner</span><strong>${esc(S.owner)}</strong></div>
      <div class="info"><span>Contact</span><strong>${rptHandle()}@creatormail.example</strong></div>
    </div>
    <div class="rail-card">
      <div class="rail-head"><h3>Relationship</h3></div>
      <div class="info"><span>Status</span><span class="status">${esc(S.relationship)}</span></div>
      <div class="info"><span>Owner</span><strong>${esc(S.owner)}</strong></div>
      <div class="info"><span>Last interaction</span><strong>${S.notes.length?'Recently':'None yet'}</strong></div>
      <p class="note-box">${esc(S.notes.length?S.notes[S.notes.length-1]:'No notes yet.')}</p>
      <div class="rail-actions"><button class="btn sm" onclick="recordDialog()">Record interaction</button><button class="btn sm" onclick="noteDialog()">Add note</button></div>
    </div>
    <div class="rail-card brands-card">
      <div class="rail-head"><h3>Brands worked with${deepLink(4,'Brand performance')}</h3><button class="icon-btn sm" onclick="jump(4)" aria-label="Open brand performance">${icon('list','ico-sm')}</button></div>
      <div class="brands-sum">
        <div class="avatar-stack">${BRANDS.slice(0,4).map(b=>brandMark(b,'sm')).join('')}<span class="avatar-more">+${BRANDS.length-4}</span></div>
        <div><strong>${BRANDS.length} brands</strong><span class="sub">${BRANDS.reduce((t,b)=>t+b.count,0)} collabs · ${BRANDS.reduce((t,b)=>t+b.paid,0)} paid</span></div>
      </div>
      ${BRANDS.slice(0,4).map(b=>`<button class="rail-row" onclick="openBrand('${b.name}')">${brandMark(b,'sm')}<span class="grow">${esc(b.name)}</span><span class="muted">${b.count} posts</span></button>`).join('')}
    </div>
    <div class="rail-card">
      <div class="rail-head"><h3>In your plans</h3><button class="link" onclick="openCampaignPick()">Add to plan</button></div>
      ${[['Diwali Gifting 2026',72,'Shortlisted','good'],['Winter Denim Drop',61,'Considering','']].map(c=>`<button class="rail-row" onclick="openCampaignDetail('${c[0]}',${c[1]})"><span class="grow">${c[0]}</span><span class="chip ${c[3]}">${c[2]}</span></button>`).join('')}
    </div>
    <div class="rail-card">
      <div class="rail-head"><h3>In campaigns</h3><button class="link" onclick="openCampaignPick()">Manage</button></div>
      ${(S.campaigns.length?S.campaigns:['Autumn Wellness Launch']).map((n,i)=>`<button class="rail-row" onclick="openCampaignDetail('${esc(n)}',${78+i*3})"><span class="grow">${esc(n)}</span><span class="fit"><strong>${78+i*3}</strong><small>Fit</small></span><span class="chip good">Added</span></button>`).join('')}
    </div>
    <div class="rail-card">
      <div class="rail-head"><h3>Audience snapshot${deepLink(5,'Audience')}</h3></div>
        <strong style="font-size:14px;color:var(--ink-strong)">Predominantly women aged 25–34</strong>
        <p class="note" style="margin-top:4px">United States is the leading estimated geography. Review platform-level differences before using audience data for targeting.</p>
        <div class="row aud-tags" style="margin-top:14px">${['Target: Women 25–34','Lifestyle shoppers','Wellness interests','Books & reading','DIY enthusiasts','US audience'].map(t=>`<span class="chip">${t}</span>`).join('')}<span class="chip warn">Geography to verify</span></div>
      
    </div>
  </aside></div>`;
}
function perfMetricsHTML(){ const d=V3PERF[S.perfTab]; return d.metrics.map(([l,v,s])=>`<div><div class="kpi-label">${l}</div><div class="kpi-value">${v}</div><div class="kpi-sub">${s}</div></div>`).join(''); }
function perfFormatHTML(){ const d=V3PERF[S.perfTab], c=['#3b82f6','#60a5fa','#93c5fd']; return `<span>Format</span><div class="format-track">${d.formats.map((f,i)=>`<span style="flex:${f[1]};background:${c[i]}" title="${f[0]} ${f[1]}%"></span>`).join('')}</div><div class="legend">${d.formats.map((f,i)=>`<span><i style="background:${c[i]}"></i>${f[0]} ${f[1]}%</span>`).join('')}</div>`; }
function setPerfTab(p){
  S.perfTab=p;
  document.querySelectorAll('.card.perf .seg button').forEach(b=>{const on=b.textContent===p;b.classList.toggle('on',on);b.setAttribute('aria-selected',on);});
  document.querySelector('.card.perf .muted').textContent=V3PERF[p].count+' · '+V3PERF[p].updated;
  document.getElementById('perfMetrics').innerHTML=perfMetricsHTML();
  document.getElementById('perfFormat').innerHTML=perfFormatHTML();
}
function toggleRecentTopic(t){ S.recentTopic=S.recentTopic===t?'':t; paintBody(); }
function recentPosts(){
  const k=({'Personal storytelling':'personal','Product demos':'product'})[S.recentTopic]||S.recentTopic.toLowerCase();
  const a=POSTS.filter(p=>!k||[p.topic,p.approach,p.title].some(x=>x.toLowerCase().includes(k)));
  return (a.length?a:POSTS).slice(0,5);
}

/* ════════ CONTENT LIBRARY (tab 1) ════════ */
function pContent(){
  const total=POSTS.length, views=POSTS.reduce((t,p)=>t+p.views,0), likes=POSTS.reduce((t,p)=>t+p.likes,0), comments=POSTS.reduce((t,p)=>t+p.comments,0);
  const videos=POSTS.filter(p=>v36Format(p)==='Video').length, carousel=POSTS.filter(p=>v36Format(p)==='Carousel').length, images=total-videos-carousel;
  const C=S.content;
  return `<div class="stack">
    <p class="cn-sub">Browse and evaluate creator posts across platforms. All content is sample data.</p>
    <details class="kacc" open><summary class="kacc-h">Key figures</summary><div class="kpis5">
      <div><div class="kpi-label">Engagement rate</div><div class="kpi-value">${((likes+comments)/views*100).toFixed(2)}%</div><div class="kpi-sub">Like rate ${(likes/views*100).toFixed(2)}% · Comment rate ${(comments/views*100).toFixed(2)}%</div></div>
      <div><div class="kpi-label">Per post</div><div class="kpi-value">${fmt(Math.round(views/total))}</div><div class="kpi-sub">Avg views · Likes ${fmt(Math.round(likes/total))} · Comments ${Math.round(comments/total)}</div></div>
      <div><div class="kpi-label">Content mix</div><div class="kpi-value">${total}<small> posts</small></div><div class="mixbar"><span style="flex:${videos};background:#3b82f6"></span><span style="flex:${carousel};background:#60a5fa"></span><span style="flex:${images};background:#93c5fd"></span></div><div class="kpi-sub">Video ${videos} · Carousel ${carousel} · Image ${images}</div></div>
      <div><div class="kpi-label">Posting</div><div class="kpi-value">${(total/12).toFixed(1)}</div><div class="kpi-sub">Posts / week · Branded ${POSTS.filter(p=>!!p.brand).length}</div></div>
    </div></details>
    <div class="toolbar">
      <div class="seg" role="tablist" aria-label="Collections" id="collections">${collectionOptions().map(([n,c])=>`<button class="${C.collection===n?'on':''}" aria-pressed="${C.collection===n}" onclick="setCollection('${n}')">${n} · ${c}</button>`).join('')}</div>
      <span class="sep"></span>
      <div class="search">${icon('search')}<input id="q" placeholder="Caption or hashtag" aria-label="Search captions" value="${esc(C.q)}" oninput="setContent('q',this.value)"></div>
      <select class="field" aria-label="Format" onchange="setContent('format',this.value)">${['All formats','Reel','Carousel','Static','Video','Short'].map(o=>`<option ${C.format===o?'selected':''}>${o}</option>`).join('')}</select>
      <select class="field" aria-label="Platform" onchange="setContent('platform',this.value)">${['All','Instagram','TikTok'].map(o=>`<option ${C.platform===o?'selected':''}>${o}</option>`).join('')}</select>
      <select class="field" aria-label="Sort" onchange="setContent('sort',this.value)">${['Newest','Oldest','Most viewed','Highest engagement'].map(o=>`<option ${C.sort===o?'selected':''}>${o}</option>`).join('')}</select>
      <div class="view" role="group" aria-label="View">
        <button class="${C.view==='Grid'?'on':''}" onclick="setView('Grid')" aria-label="Grid view" aria-pressed="${C.view==='Grid'}">${icon('grid','ico-sm')}</button>
        <button class="${C.view==='List'?'on':''}" onclick="setView('List')" aria-label="List view" aria-pressed="${C.view==='List'}">${icon('list','ico-sm')}</button>
      </div>
    </div>
    <div id="contentBody">${contentBodyHTML()}</div>
  </div>`;
}
function collectionOptions(){
  return [['All',POSTS.length],['Evaluated',POSTS.filter(p=>p.evaluation==='Evaluated'||p.evaluation==='Flagged').length],['Branded',POSTS.filter(p=>p.classification==='Paid partnership').length],['Flagged',POSTS.filter(p=>p.evaluation==='Flagged').length]];
}
function setCollection(n){ S.content.collection=n; document.querySelectorAll('#collections button').forEach(b=>{const on=b.textContent.startsWith(n+' ·');b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);}); paintContentBody(); }
function setContent(k,v){ S.content[k]=v; paintContentBody(); }
function resetContent(){ S.content={...S.content,q:'',format:'All formats',platform:'All',collection:'All'}; paintBody(); }
function filteredPosts(){
  const C=S.content, q=C.q.trim().toLowerCase();
  let a=POSTS.filter(p=>{
    if(q && ![p.title,p.topic,p.approach,p.brand||'',p.classification].some(x=>x.toLowerCase().includes(q))) return false;
    if(C.platform!=='All' && p.platform!==C.platform) return false;
    if(C.format!=='All formats' && p.format!==C.format) return false;
    if(C.collection==='Evaluated' && p.evaluation==='Not evaluated') return false;
    if(C.collection==='Branded' && p.classification!=='Paid partnership') return false;
    if(C.collection==='Flagged' && p.evaluation!=='Flagged') return false;
    return true;
  });
  if(C.sort==='Oldest') a=a.slice().reverse();
  if(C.sort==='Most viewed') a=a.slice().sort((x,y)=>y.views-x.views);
  if(C.sort==='Highest engagement') a=a.slice().sort((x,y)=>y.eng-x.eng);
  return a;
}
function paintContentBody(){ document.getElementById('contentBody').innerHTML=contentBodyHTML(); }
function contentBodyHTML(){
  const a=S.view==='report'?filteredPosts().slice(0,4):filteredPosts();
  if(!a.length) return `<div class="empty">No posts match these filters. <button class="link" onclick="resetContent()">Show all posts</button></div>`;
  const n=S.selected.size;
  const bulk=n?`<div class="bulk" role="region" aria-label="Selection actions"><strong>${n} post${n===1?'':'s'} selected</strong><button class="btn primary sm" onclick="campaignDialog()">${icon('plus','ico-sm')}Add to plan</button><button class="btn sm" onclick="createReportDialog()">Create new evaluation report</button><button class="btn sm" onclick="clearSelection()">Clear selection</button></div>`:'';
  if(S.content.view==='Grid') return bulk+`<div class="grid-posts">${a.map(galleryCard).join('')}</div>`;
  return bulk+`<div class="table"><table>
    <thead><tr><th class="cb"></th><th>Media</th><th>Content</th><th>Format</th><th>Published</th><th>Views</th><th>Likes</th><th>Comments</th><th>Evaluation</th></tr></thead>
    <tbody>${a.map(p=>`<tr>
      <td class="cb"><input type="checkbox" aria-label="Select ${esc(p.title)}" ${S.selected.has(p.id)?'checked':''} onchange="toggleSelected(${p.id},this.checked)"></td>
      <td><img class="thumb-sm" src="${photo(p)}" alt="" loading="lazy" onclick="openPost(${p.id})"></td>
      <td><button class="title-btn" onclick="openPost(${p.id})">${esc(p.title)}</button></td>
      <td>${v36Format(p)}</td><td>${p.date}</td><td>${fmt(p.views)}</td><td>${fmt(p.likes)}</td><td>${fmt(p.comments)}</td><td>${statusOf(p)}</td>
    </tr>`).join('')}</tbody></table></div>`;
}
function mediaRatio(p,f){
  if(f==='Video') return '9/14';
  if(f==='Carousel') return '4/5';
  return ['1/1','4/5','3/4','4/5'][p.id%4];
}
function galleryCard(p){
  const f=v36Format(p), sel=S.selected.has(p.id), slide=S.carousel[p.id]||0;
  const src=f==='Carousel'?pastelURI(PASTEL[(p.id-1+slide)%PASTEL.length]):photo(p);
  return `<article class="post ${sel?'sel':''}" tabindex="0" onclick="openPost(${p.id})" onkeydown="if(event.key==='Enter')openPost(${p.id})">
    <div class="ig-head"><span class="ig-user">${p.platform==='TikTok'?icon('play','ico-sm'):icon('user','ico-sm')} @${rptHandle()}</span><span class="muted">${icon('more','ico-sm')}</span></div>
    <div class="post-media" style="aspect-ratio:${mediaRatio(p,f)}">
      <img class="media" src="${src}" alt="${esc(p.title)}" loading="lazy">
      <input type="checkbox" class="post-check" aria-label="Select ${esc(p.title)}" ${sel?'checked':''} onclick="event.stopPropagation()" onchange="toggleSelected(${p.id},this.checked)">
      <span class="fmt">${f==='Video'?'Reel':f}</span>
      ${f==='Video'?`<span class="play">${icon('play')}</span>`:''}
      ${f==='Carousel'?`<button class="carousel-btn left" onclick="event.stopPropagation();carouselStep(${p.id},-1)" aria-label="Previous slide">${icon('chevL','ico-sm')}</button><button class="carousel-btn right" onclick="event.stopPropagation();carouselStep(${p.id},1)" aria-label="Next slide">${icon('chevRight','ico-sm')}</button>`:''}
    </div>
    <div class="post-meta">
      <div class="post-top"><span>${statusPill(p)}</span><span>${dateShort(p.date)}</span></div>
      <div class="post-title">${esc(p.title)}</div>
      <div class="post-stats"><span>${icon('eye','ico-sm')}${fmt(p.views)}</span><span>${icon('heartSm','ico-sm')}${fmt(p.likes)}</span><span>${icon('comment','ico-sm')}${fmt(p.comments)}</span></div>
    </div>
  </article>`;
}
function carouselStep(id,d){ S.carousel[id]=((S.carousel[id]||0)+d+3)%3; paintContentBody(); }
function toggleSelected(id,on){ on?S.selected.add(id):S.selected.delete(id); paintContentBody(); }
function clearSelection(){ S.selected.clear(); paintContentBody(); }
function createReportDialog(){
  const n=S.selected.size;
  showModal('Create evaluation report',`<p class="note">${n} selected posts will be included in a new illustrative evaluation.</p>`,
    `<button class="btn primary" onclick="createReport()">Create report</button>`);
}
function createReport(){ const n=S.selected.size; closeLayer(); S.selected.clear(); S.report='Authenticity'; switchTab(3); toast(n+' posts added to evaluation selection'); }
function campaignDialog(){ openCampaignPick(); }

/* ════════ POST INSPECTOR ════════ */
/* One entry point for both post kinds: campaign posts (string ids) and content posts (numeric ids). */
function openPost(id){
  S.post=id;
  if(CAMP_LIST.some(c=>c.posts.some(p=>p.id===id))){ openCampaignPost(id); }
  else { S.postTab='Overview'; renderPost(); }
  syncHash();
}
function renderPost(){
  const p=POSTS.find(x=>x.id===S.post), ix=POSTS.findIndex(x=>x.id===S.post)+1;
  const suspect=p.evaluation==='Flagged';
  const related=[p,...POSTS.filter(x=>x.id!==p.id&&x.topic===p.topic).slice(0,5)];
  const tabs=['Overview','Authenticity','Comments','Audience'];
  const body=`
  <div class="pi-bar">
    <div class="row"><span class="chip ${suspect?'warn':'good'}">${suspect?'Suspicious':p.evaluation==='Evaluated'?'Evaluated':'Not evaluated'}</span><span class="muted" style="font-size:12px">${suspect?'Some engagement signals need a closer look':esc(p.title)}</span></div>
    <div class="row">
      <span class="muted" style="font-size:12px">Post ${ix} of ${POSTS.length}</span>
      <button class="icon-btn" onclick="stepPost(-1)" aria-label="Previous post">${icon('chevL','ico-sm')}</button>
      <button class="icon-btn" onclick="stepPost(1)" aria-label="Next post">${icon('chevRight','ico-sm')}</button>
      <button class="btn sm" onclick="openExternal('${p.platform==='TikTok'?'https://www.tiktok.com/':'https://www.instagram.com/'}')">${icon('external','ico-sm')}View post</button>
      <button class="icon-btn" onclick="copyLink()" aria-label="Copy post link">${icon('link','ico-sm')}</button>
    </div>
  </div>
  <div class="pi-grid">
    <aside class="stack" style="gap:10px">
      <div class="card" style="padding:0;overflow:hidden">
        <div class="ig-head"><span class="ig-user">@${rptHandle()}</span><span class="muted">${p.platform==='TikTok'?'♪':icon('user','ico-sm')}</span></div>
        <div class="post-media" style="aspect-ratio:4/5"><img class="media" src="${photo(p)}" alt="${esc(p.title)}"><span class="dur">${p.format} · ${p.duration}</span></div>
        <div style="padding:10px 12px;display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--muted-2)">
          <div class="post-stats"><span>${icon('eye','ico-sm')}${fmt(p.views)}</span><span>${icon('heartSm','ico-sm')}${fmt(p.likes)}</span><span>${icon('comment','ico-sm')}${fmt(p.comments)}</span></div>
          <p style="font-size:13px;color:var(--ink-2)">${esc(p.title)}</p><span>${p.date}</span>
        </div>
      </div>
      <div class="thumb-strip">${related.map(x=>`<button class="pi-mini ${x.id===p.id?'active':''}" onclick="openPost(${x.id})" title="${esc(x.title)}"><img src="${photo(x)}" alt=""></button>`).join('')}</div>
    </aside>
    <section class="stack" style="gap:12px;min-width:0">
      <div class="seg" role="tablist" aria-label="Post detail">${tabs.map(t=>`<button role="tab" class="${S.postTab===t?'on':''}" aria-selected="${S.postTab===t}" onclick="setPostTab('${t}')">${t}${t==='Authenticity'&&suspect?' <span class="dot-warn"></span>':''}</button>`).join('')}</div>
      <div id="postPanel">${postPanel(p)}</div>
    </section>
  </div>`;
  showDrawer(`Post details`,body,'wide');
}
function setPostTab(t){
  S.postTab=t;
  document.querySelectorAll('#drawerBody .seg button').forEach(b=>{const on=b.textContent.trim().startsWith(t);b.classList.toggle('on',on);b.setAttribute('aria-selected',on);});
  document.getElementById('postPanel').innerHTML=postPanel(POSTS.find(x=>x.id===S.post));
}
function stepPost(d){ const i=POSTS.findIndex(x=>x.id===S.post); S.post=POSTS[(i+d+POSTS.length)%POSTS.length].id; renderPost(); }
function openExternal(u){ window.open(u,'_blank','noopener'); }
function postPanel(p){
  const panel=(title,sub,inner)=>`<div class="card"><div class="card-title"><h3>${title}</h3><span class="muted" style="font-size:12px">${sub}</span></div>${inner}</div>`;
  if(S.postTab==='Overview') return panel('Post overview',`${p.date} · ${p.platform}`,
    `<div class="grid g4" style="margin-bottom:10px">${[['Views',fmt(p.views)],['Likes',fmt(p.likes)],['Comments',fmt(p.comments)],['Shares',fmt(p.shares)]].map(x=>`<div><div class="kpi-label">${x[0]}</div><div class="kpi-value" style="font-size:18px">${x[1]}</div></div>`).join('')}</div>
     ${[['Caption',p.title],['Format',p.format],['Topic',p.topic],['Creative approach',p.approach],['Brand',p.brand||'Organic'],['Engagement rate',p.eng+'%'],['Published',p.date]].map(x=>`<div class="info"><span>${x[0]}</span><strong>${esc(x[1])}</strong></div>`).join('')}`);
  if(S.postTab==='Authenticity'){
    const flagged=p.evaluation==='Flagged', rate=((p.likes+p.comments)/p.views*100).toFixed(2);
    const sig=[
      ['Engagement',rate+'%','Engagement relative to its observed views',flagged?'warn':'good',[['Views',fmt(p.views)],['Likes',fmt(p.likes)],['Comments',fmt(p.comments)],['Shares',fmt(p.shares)]]],
      ['Comments','100','Comment behavior in the available sample','good',[['Comments sampled',Math.min(p.comments,16)],['Timing bursts','0'],['Estimated rate',(p.comments/p.views*100).toFixed(2)+'%'],['Status','Available']]],
      ['People commenting','98%','Profiles reviewed have plausible activity','good',[['Profiles checked','15'],['Plausible accounts','14'],['Unclear accounts','1'],['Status','Sampled']]]
    ];
    return panel('Authenticity','From the latest available evaluation',
      `<div class="alert-box ${flagged?'warn':'good'}"><strong>${flagged?'This post needs a closer look':'Engagement appears consistent'}</strong><p>${flagged?'Views are high relative to likes and comments. Examine the signals below before drawing a conclusion.':'Available signals show no major anomalies in this example. This is not proof of authenticity.'}</p></div>
       ${sig.map((x,i)=>`<details class="acc sig" ${i===0?'open':''}><summary><span class="sigdot ${x[3]}"></span><div class="sig-copy"><strong>${x[0]}</strong><span>${x[2]}</span></div><div class="sig-val">${x[1]}</div></summary><div class="grid g4" style="padding:4px 16px 14px">${x[4].map(v=>`<div><span class="kpi-label">${v[0]}</span><strong class="sig-detail">${v[1]}</strong></div>`).join('')}</div></details>`).join('')}
       <div class="between" style="margin-top:10px"><span class="note">Branded: ${p.brand?'Yes':'No'} · Evaluation: ${p.evaluation}</span><button class="link" onclick="setPostTab('Comments')">See comments ${icon('chevRight','ico-sm')}</button></div>`);
  }
  if(S.postTab==='Comments'){
    const sample=[['ananya_reads','Love how clearly you explained this!'],['the.wellness.edit','This is useful — saving for later.'],['nina.lifestyle','Could you share more details?'],['everydaymira','I tried something similar and it worked well.']];
    return panel('Comments',`${fmt(p.comments)} total · example sample`,
      `<div class="grid g4" style="margin-bottom:10px">${[['Comments',fmt(p.comments)],['Comment rate',(p.comments/p.views*100).toFixed(2)+'%'],['Sample reviewed',Math.min(p.comments,16)],['Timing bursts','0']].map(x=>`<div><div class="kpi-label">${x[0]}</div><div class="kpi-value" style="font-size:18px">${x[1]}</div></div>`).join('')}</div>
       ${sample.map(c=>`<div class="comment"><span class="initials">${c[0][0].toUpperCase()}</span><div><strong>@${c[0]}</strong><p>${c[1]}</p></div></div>`).join('')}`);
  }
  return panel('Post audience','Illustrative estimated insights',
    `<div class="grid g4" style="margin-bottom:12px">${[['Estimated reach',fmt(Math.round(p.views*.72))],['Primary market','US'],['Top age group','25–34'],['Women','67%']].map(x=>`<div><div class="kpi-label">${x[0]}</div><div class="kpi-value" style="font-size:18px">${x[1]}</div></div>`).join('')}</div>
     <div class="age-chart">${[25,52,89,63,34,17].map((n,i)=>`<div><span style="height:${n}%" title="${n}% relative index"></span><small>${['13–17','18–24','25–34','35–44','45–54','55+'][i]}</small></div>`).join('')}</div>
     <div class="row" style="margin-top:12px">${['Wellness shoppers','Lifestyle','Beauty','Books','DIY'].map(t=>`<span class="chip">${t}</span>`).join('')}</div>`);
}

/* ════════ CONTENT PERFORMANCE (tab 2) ════════ */
function pPerformance(){
  const subs=['Performance Overview','Creative Insights'];
  const cc=creatorOf(), cm=mx(cc), cpvN=cc.views>0&&cm.cost?cm.cost/cc.views:null;
  const cpvTile=`<div class="card" id="perf-cpv" style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap"><div><span class="kpi-label">Average CPV</span><strong class="card-h" style="display:block;font-size:24px">${cpvN!=null?'₹'+cpvN.toFixed(2):'—'}</strong></div><p class="note" style="margin:0;max-width:420px">${cm.cost&&cc.views?`${rupees(cm.cost)} creator cost ÷ ${exactN(cc.views)} average views`:'Set a creator cost in My creators to calculate CPV'}</p></div>`;
  return `<div class="stack">
    <div><h1 class="page-title">Content performance</h1><p class="section-sub">Understand creative effectiveness, platform results, and commercial track record.</p></div>
    ${cpvTile}
    <div class="seg" role="tablist" aria-label="Performance sections">${subs.map((t,i)=>`<button role="tab" class="${S.perfSub===i?'on':''}" aria-selected="${S.perfSub===i}" onclick="setPerfSub(${i})">${t}</button>`).join('')}</div>
    ${S.perfSub===1?creativeHTML():perfOverviewHTML()}
  </div>`;
}
function setPerfSub(i){ S.perfSub=i; paintBody(true); }
function perfOverviewHTML(){
  const plat=S.perfPlat, d=DIMS[S.perfDim];
  return `  <div class="card stack" style="gap:14px">
    <div class="between"><div><strong class="card-h">Content Strategy</strong><p class="note">Select a dot or top item to inspect top-performing classifications and related creatives.</p></div>
      <div class="row"><div class="search">${icon('search')}<input placeholder="Search classifications" aria-label="Search classifications" value="${esc(S.perfQ)}" oninput="setPerfQ(this.value)"></div><button class="btn sm" onclick="toggleShowAll()">${S.perfAll?'Top 30':'Show all 100'}</button></div></div>
    <div class="seg" role="tablist" aria-label="Dimension">${DIMS.map((x,i)=>`<button class="${S.perfDim===i?'on':''}" aria-selected="${S.perfDim===i}" onclick="setDim(${i})">${x.short}</button>`).join('')}</div>
    <div class="legend-row chart-meta"><span><i style="background:${d.color}"></i>${d.name}</span><span>X = creative volume</span><span>Y = engagement rate</span><span id="plottedCount"></span></div>
    <div id="perfArea">${perfAreaHTML()}</div>
  </div>`;
}
function setDim(i){ S.perfDim=i; S.perfSel=0; S.perfQ=''; S.perfAll=false; paintBody(); }
function setPerfQ(v){ S.perfQ=v; S.perfSel=0; paintPerfArea(); }
function toggleShowAll(){ S.perfAll=!S.perfAll; paintBody(); }
function pickRow(id){ S.perfSel=id; paintPerfArea(); }
function dotsHTML(rows,color,sel){
  const sorted=rows.slice().sort((a,b)=>(b.engagement-a.engagement)||(b.posts-a.posts)).slice(0,10);
  const avg=sorted.reduce((s,r)=>s+r.engagement,0)/Math.max(1,sorted.length);
  const max=Math.max(8,...sorted.map(r=>r.engagement));
  const x=v=>(v/max*100).toFixed(2)+'%';
  return `<div class="dots">
    <div class="dots-axis"><span></span><span class="dots-scale">${[0,2,4,6,8].filter(v=>v<=max).map(v=>`<em style="left:${x(v)}">${v}%</em>`).join('')}</span><span></span></div>
    ${sorted.map(r=>`<button class="dot-row ${r.id===sel.id?'on':''}" onclick="pickRow(${r.id})" aria-pressed="${r.id===sel.id}"><span class="dot-name">${esc(r.name)}</span><span class="dot-track"><i class="dot-avg" style="left:${x(avg)}"></i><span class="dot-pt ${r.engagement>=avg?'up':'down'}" style="left:${x(r.engagement)};${r.engagement>=avg?`background:${color}`:''}"></span></span><span class="dot-val">${r.engagement}%</span><span class="dot-vol">${r.volume}% of posts</span></button>`).join('')}
    <div class="dots-foot">Average of these ${sorted.length}: <strong>${avg.toFixed(1)}%</strong></div>
  </div>`;
}
function paintPerfArea(){ const el=document.getElementById('perfArea'); if(el) el.innerHTML=perfAreaHTML(); }
function filteredDimRows(){ const q=S.perfQ.trim().toLowerCase(); return DIMS[S.perfDim].rows.filter(r=>!q||r.name.toLowerCase().includes(q)); }
function perfAreaHTML(){
  const d=DIMS[S.perfDim], all=filteredDimRows();
  if(!all.length) return '<div class="empty">No classifications match your search.</div>';
  const plotted=S.perfAll?all:all.slice().sort((a,b)=>b.posts-a.posts).slice(0,30);
  const sel=all.find(r=>r.id===S.perfSel)||all[0];
  const ranked=all.slice().sort((a,b)=>(b.engagement-a.engagement)||(b.posts-a.posts)).slice(0,8);
  return `<div class="cols2" style="align-items:start;${perfViewNow()==='Dots'?'grid-template-columns:minmax(0,1fr)':''}">
    <div class="stack" style="gap:10px;min-width:0">
      <div class="between"><strong class="card-h" style="font-size:13px">Against average</strong><span class="note">${({Dots:'Dot = engagement rate · dashed line = average',Bubble:'X: creative volume · Y: engagement · size: likes'})[S.perfView||'Dots']}</span></div>
      ${dotsHTML(all,d.color,sel)}
      <div class="sel-card"><div><strong>${esc(sel.name)}</strong><span class="selected-tag">Selected classification</span></div>
        <div class="grid g4 stats-row">${[['Posts',sel.posts],['Creative volume',sel.volume+'%'],['Likes',sel.likes+'K'],['Eng. rate',sel.engagement+'%']].map(v=>`<div><small>${v[0]}</small><strong>${v[1]}</strong></div>`).join('')}</div>
        <div class="between"><span class="chip">${({Dots:'Dot = engagement rate',Bubble:'Bubble size = Likes'})[S.perfView||'Dots']}</span><button class="link" onclick="openBucket(${sel.id})">View creatives ${icon('chevRight','ico-sm')}</button></div></div>
    </div>
    ${perfViewNow()==='Dots'?'':`    <div class="stack" style="gap:8px;min-width:0">
      <div class="list-head"><strong>Top ${esc(d.name)}</strong><span>${all.length} total</span></div>
      <div class="list">${ranked.map((r,i)=>`<button class="list-item ${r.id===sel.id?'on':''}" aria-selected="${r.id===sel.id}" onclick="openBucket(${r.id})"><span class="rank">${i+1}</span><span class="name">${esc(r.name)}</span><span class="stat">${r.posts} posts</span><span class="stat">${r.engagement}% ER</span></button>`).join('')}</div>
      <p class="note">Click a ranked item to open example creatives in the drawer.</p>
    </div>
`}
  </div>`;
}
function strategyRelatedPosts(item,dim){
  const t=(item.name||'').toLowerCase(); let base=[];
  if(dim==='Topics') base=POSTS.filter(p=>t.includes(p.topic.toLowerCase())||p.topic.toLowerCase().includes(t));
  else if(dim==='Angles'){ if(/problem|solution/.test(t)) base=POSTS.filter(p=>/tutorial|product showcase/i.test(p.approach)); else if(/personal/.test(t)) base=POSTS.filter(p=>/personal|day in the life/i.test(p.approach)); else if(/comparison/.test(t)) base=POSTS.filter(p=>/editorial|product/i.test(p.approach)); else if(/expert/.test(t)) base=POSTS.filter(p=>/tutorial|editorial/i.test(p.approach)); else base=POSTS.filter(p=>/behind|tutorial/i.test(p.approach)); }
  else if(dim==='Style'){ if(/talking/.test(t)) base=POSTS.filter(p=>/Reel|Video|Short/.test(p.format)); else if(/product demo/.test(t)) base=POSTS.filter(p=>/Product showcase|Tutorial/.test(p.approach)); else if(/voice/.test(t)) base=POSTS.filter(p=>/Reel|Video|Short/.test(p.format)); else if(/b-roll/.test(t)) base=POSTS.filter(p=>/Carousel|Static/.test(p.format)); else base=POSTS.filter(p=>/Static|Carousel/.test(p.format)); }
  else if(dim==='Problems Highlighted') base=POSTS.filter(p=>['Skincare','Wellness','Lifestyle'].includes(p.topic));
  else if(dim==='Products') base=POSTS.filter(p=>p.brand||/product/i.test(p.approach));
  let idx=(item.id||0)%POSTS.length;
  while(base.length<6){ const p=POSTS[idx%POSTS.length]; if(!base.some(x=>x.id===p.id)) base.push(p); idx+=3; }
  return base.slice(0,8);
}
function bucketHTML(id){
  const d=DIMS[S.perfDim], r=d.rows.find(x=>x.id===id);
  const related=strategyRelatedPosts(r,d.name);
  return `<div class="card"><div class="between"><div><div class="eyebrow">${d.name} · Top-performing classification</div><h2 style="font-size:18px;margin-top:4px;color:var(--ink-strong)">${esc(r.name)}</h2></div><span class="chip ai">${related.length} creatives</span></div>
     <div class="grid g5" style="margin-top:12px">${[['Posts',r.posts],['Creative volume',r.volume+'%'],['Likes',r.likes+'K'],['Comments',r.comments],['Eng. rate',r.engagement+'%']].map(v=>`<div><small class="kpi-label">${v[0]}</small><strong class="sig-detail">${v[1]}</strong></div>`).join('')}</div></div>
     <div class="toolbar" style="margin-top:6px"><select class="field"><option>Content type</option><option>Reel</option><option>Carousel</option><option>Static</option></select><select class="field"><option>Published date</option><option>Last 30 days</option><option>Last 90 days</option><option>Last 1 year</option></select><span class="sep"></span><select class="field"><option>Sort by</option><option>Newest</option><option>Highest views</option><option>Highest engagement</option></select><span class="chip">${related.length} creatives</span></div>
     <p class="note">Illustrative content examples related to this classification.</p>
     <div class="grid-posts">${related.map(p=>galleryCard(p)).join('')}</div>
     <div class="between"><span class="note">Select a card to inspect the post in detail.</span><button class="btn primary sm" onclick="closeLayer();setContentQuery('${esc(r.name)}')">Explore in Content tab</button></div>`;
}
function openBucket(id){
  const d=DIMS[S.perfDim], r=d.rows.find(x=>x.id===id);
  showDrawer(esc(r.name), bucketPicker(id)+bucketHTML(id), 'wide');
}
function bucketPicker(id){
  const d=DIMS[S.perfDim];
  return `<div class="bucket-pick"><label class="eyebrow" for="bucketSel">${esc(d.name)} classification</label><select id="bucketSel" class="field full" onchange="switchBucket(+this.value)">${d.rows.map(x=>`<option value="${x.id}" ${x.id===id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div>`;
}
function switchBucket(id){
  const d=DIMS[S.perfDim], r=d.rows.find(x=>x.id===id);
  const head=document.querySelector('.drawer-head > span'), bodyEl=document.getElementById('drawerBody');
  if(!head||!bodyEl) return;
  head.textContent=r.name;
  bodyEl.innerHTML=bucketPicker(id)+bucketHTML(id);
  bodyEl.scrollTop=0;
}
function setContentQuery(q){ S.content.q=q; switchTab(1); }

/* Creative insights */
function creativeHTML(){
  const i=S.creativeDim, d=CREATIVE[i], met=S.metric;
  const territories=[['Food',22],['Wellness',17],['Parenting',11],['Travel',8],['Skincare',8],['Other',34]];
  const formats=[['Reel','126.1K','9.3%',11,'+54%'],['Short','122K','8.8%',5,'+49%'],['Static','84.4K','7.1%',6,'−8%'],['Video','75.8K','6.8%',7,'−4%'],['Carousel','58.6K','5.9%',7,'−12%']];
  const combos=[['Personal recommendation × Wellness','111.9K','+37%','Wellness'],['Product showcase × Food','108.2K','+29%','Food']];
  const hooks=[['Nobody talks about this…',9,119,9.2],['Stop doing this immediately…',7,102,8.7],['This changed everything…',11,95,8.1],['I tried this for 30 days…',9,88,7.4]];
  return `<div class="stack">
    <div class="card">
      <div class="between dim-head"><strong class="card-h">Content strategy dimensions</strong><span class="chip">${CREATIVE.length} dimensions</span></div>
      <div class="grid g4 dim-grid">${CREATIVE.map((x,j)=>`<button class="tile ${i===j?'on':''}" aria-pressed="${i===j}" onclick="setCreative(${j})"><strong>${x.name}</strong></button>`).join('')}</div>
    <div class="dim-detail" id="creativeDetail">
      <div class="between"><strong class="card-h">${d.name}</strong><span class="chip ai">${icon('sparkle','ico-sm')} AI interpretation</span></div>
      <p style="font-size:14px;color:var(--ink-2);margin:6px 0 0">${d.summary}</p>
      <div class="between" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line-soft)"><span class="note">Evidence basis: <strong style="color:var(--ink-strong)">${d.evidence}</strong></span><button class="link" onclick="switchTab(1)">Explore content ${icon('chevRight','ico-sm')}</button></div>
    </div>
    </div>
    <div class="card dna"><div class="between"><strong class="card-h">Creative DNA</strong><button class="link" onclick="toast('Creative DNA regenerated (demo)')">${icon('refresh','ico-sm')} Regenerate</button></div>
      <p class="dna-text">Approachable lifestyle stories and product demos. Reels outperform static posts, especially with a personal-recommendation hook.</p></div>
    <div class="grid g2">
      <div class="card"><div class="card-title"><h2>Core territories</h2></div>${donutHTML(territories.map(t=>({l:t[0],v:t[1]})))}</div>
      <div class="card"><div class="card-title"><h2>How they create</h2></div><div class="grid g2">${APPROACHES.map(a=>`<button class="btn approach" onclick="filterApproach('${a}')"><span>${a}</span><span class="muted">${POSTS.filter(p=>p.approach===a).length}</span></button>`).join('')}</div></div>
    </div>
    <section class="section"><div class="section-head"><h2>What works</h2><div class="seg" role="tablist">${['Views','Engagement'].map(m=>`<button class="${met===m?'on':''}" aria-selected="${met===m}" onclick="setMetric('${m}')">${m}</button>`).join('')}</div></div>
      <div class="card"><div class="grid g5">${formats.map(f=>`<div><div class="kpi-label">${f[0]}</div><div class="kpi-value">${met==='Views'?f[1]:f[2]}</div><div class="kpi-sub">${f[3]} posts · <span class="${f[4].startsWith('+')?'up':'down'}">${f[4]}</span> vs baseline</div></div>`).join('')}</div>
      <p class="note" style="margin-top:12px">Benchmark uplift compares each format with the illustrative all-post baseline.</p></div></section>
    <section class="section"><div class="section-head"><h2>Winning combinations</h2></div>
      <div class="grid g2">${combos.map(c=>`<div class="card"><div class="between"><strong style="color:var(--ink-strong)">${c[0]}</strong><span class="chip good">${c[2]} uplift</span></div><p class="note" style="margin:4px 0 10px">4 posts · median views ${c[1]}</p><div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">${POSTS.filter(p=>p.topic===c[3]).slice(0,2).map(p=>galleryCard(p)).join('')}</div></div>`).join('')}</div></section>
    <section class="section"><div class="section-head"><h2>Hook library</h2></div>
      <div class="table"><table><thead><tr><th>Hook</th><th>Usage</th><th>Average views</th><th>Engagement</th><th>Examples</th></tr></thead>
      <tbody>${hooks.map((h,k)=>`<tr><td>${h[0]}</td><td>${h[1]}</td><td>${h[2]}K</td><td>${h[3]}%</td><td><button class="link" onclick="openPost(${k+1})">View example ${icon('chevRight','ico-sm')}</button></td></tr>`).join('')}</tbody></table></div></section>
  </div>`;
}
function setCreative(i){ S.creativeDim=i; paintBody(); }
function setMetric(m){ S.metric=m; paintBody(); }
function filterApproach(a){ S.content.q=a; switchTab(1); toast('Content library opened. Clear search to browse all posts.'); }

function brandTableCard(){
  const shown=S.brandFilter==='All'?BRANDS:BRANDS.filter(b=>b.name===S.brandFilter);
  return `<div class="between"><strong class="card-h">Brand performance</strong>
      <div class="row"><select class="field" aria-label="Filter brand" onchange="setBrandFilter(this.value)">${['All',...BRANDS.map(b=>b.name)].map(n=>`<option ${S.brandFilter===n?'selected':''}>${n}</option>`).join('')}</select><button class="btn sm" onclick="setBrandFilter('All')">Reset</button></div></div>
    <div class="table"><table><thead><tr><th>Brand</th><th>Relationship</th><th>Content</th><th>Avg views</th><th>Engagement</th><th>Paid</th><th>Last seen</th><th>Evidence</th></tr></thead>
      <tbody>${shown.map(b=>`<tr><td>${brandLine(b)}</td><td><span class="rel ${b.count>1?'':'one'}">${b.count>1?'Repeat':'One-off'}</span></td><td class="num">${b.count}</td><td class="num">${b.views}</td><td class="num">${b.eng}</td><td class="num">${b.paid}</td><td>${b.last}</td><td><button class="link" onclick="openBrand('${b.name}')">View details ${icon('chevRight','ico-sm')}</button></td></tr>`).join('')}</tbody></table></div>`;
}
/* Brand performance (sub-tab) */
function setBrandFilter(v){ S.brandFilter=v; paintBody(); }
function pickCell(name,month){ S.brandFilter=name; S.monthFilter=month; paintBody(); }
function brandLine(b){ return `<div class="row" style="flex-wrap:nowrap">${brandMark(b,'sm')}<strong style="font-weight:500;color:var(--ink-strong)">${esc(b.name)}</strong></div>`; }
function openBrand(name){
  const b=BRANDS.find(x=>x.name===name), related=POSTS.filter(p=>p.brand===name);
  showDrawer(`<span class="row" style="gap:10px">${brandMark(b,'sm')}<span>${esc(b.name)}</span></span>`,
    `<p class="note">${b.cat} · ${b.count} collaborations · ${b.paid} confirmed paid</p>
     <div class="grid g4">${[['Average views',b.views],['Engagement',b.eng],['Confirmed paid',b.paid],['Last seen',b.last]].map(x=>`<div class="card" style="padding:12px 14px"><div class="kpi-label">${x[0]}</div><div class="kpi-value" style="font-size:16px">${x[1]}</div></div>`).join('')}</div>
     <div class="section-head" style="margin-top:6px"><h2>Associated content</h2></div>
     ${related.length?`<div class="grid-posts">${related.map(galleryCard).join('')}</div>`:'<div class="empty">No linked post examples in the demo dataset.</div>'}
     <div class="row" style="margin-top:8px"><button class="btn primary" onclick="filterBrand('${b.name}')">View brand performance</button><button class="btn" onclick="closeLayer()">Close</button></div>`);
}
function filterBrand(name){ S.brandFilter=name; closeLayer(); jump(4); }

/* ════════ EVALUATED REPORTS (tab 3) ════════ */
function pReports(){
  const isAuth=S.report!=='Brand Fit';
  return `<div class="with-rail reports-tab"><div class="stack">
    <div class="grid g2">
      ${verdictCard('Authenticity','94','Authentic','Engagement looks organic across the posts we read.','8 of 9 posts read healthy. One post warrants a closer look.',['9 posts','244 comments','20h ago'])}
      ${verdictCard('Brand Fit',String(CAMPAIGN_SCORES[S.campaign]),fitLabel(CAMPAIGN_SCORES[S.campaign]),'Worth a conversation. Check topic coverage first.','Audience alignment is promising. Validate gifting content before outreach.',['9 posts','12 signals','6 brands','20h ago'])}
    </div>
    <section class="card report-body">
      ${isAuth?authenticityHTML():brandFitHTML()}
    </section>
  </div><aside class="stack">${isAuth?authRailHTML():brandRailHTML()}
    <div class="rail-card hist"><div class="rail-head"><h3>Report history</h3></div>
      ${[['Authenticity','Oct 20, 2026 · 94 · Authentic'],['Brand fit · Diwali Gifting 2026','Oct 18, 2026 · 72 · Good fit']].map(x=>`<div class="info"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('')}</div></aside></div>`;
}
function verdictCard(name,score,label,headline,desc,foot){
  const on=S.report===name, when=foot[foot.length-1];
  const eyebrow=`${icon(name==='Brand Fit'?'target':'shield','ico-sm ev-ico')}<span>${name}</span>`;
  const scoped=name==='Brand Fit'?`<div class="ev-sub">Scored for ${esc(S.campaign)}</div>`:'';
  const footer=`Read from `+foot.slice(0,-1).map(x=>`<strong>${x}</strong>`).join(' · ');
  return `<div class="card verdict ${on?'is-active':''}" role="button" tabindex="0" aria-pressed="${on}" onclick="selectReport('${name}')" onkeydown="if(event.key==='Enter')selectReport('${name}')">
    <div class="verdict-main">
      <div class="score-col"><div class="score">${score}<small>/100</small></div><span class="score-label">${label}</span></div>
      <div class="verdict-copy"><div class="eyebrow-sm">${eyebrow}</div>${scoped}<div class="headline">${headline}</div><div class="desc">${desc}</div></div>
    </div>
    <div class="verdict-foot"><span>${footer}</span><span class="verdict-acts"><span class="when">${when}</span>
      <button class="icon-btn sm" title="Change sample posts" aria-label="Change sample posts for ${name}" onclick="event.stopPropagation();changePosts()">${icon('edit','ico-sm')}</button>
      <button class="icon-btn sm" title="Refresh ${name} evaluation" aria-label="Refresh ${name}" onclick="event.stopPropagation();${name==='Brand Fit'?'runBrandFit()':'refreshReport()'}">${icon('refresh','ico-sm')}</button></span></div>
  </div>`;
}
function selectReport(name){ S.report=name; paintBody(); }
const FINDINGS=[['good','People commenting appear real','98% look real','Commenter profiles mostly credible.'],['good','Comments read like real conversation','0 timing bursts','No concentrated comment bursts.'],['warn','Views do not always match engagement','1 of 9 flagged','One post has unusual views for its engagement.'],['muted','Comment quality could not be measured','Not measured','No reliable text-quality check available.']];
function signChip(k){ return `<span class="sign ${k}">${k==='good'?icon('check','ico-sm'):k==='warn'?icon('alert','ico-sm'):'○'}</span>`; }
function authenticityHTML(){
  const deeper=[['How the score is calculated','The demonstration score combines commenter credibility, conversation patterns, engagement consistency, and available evidence. Actual production weighting is not represented here.'],['All authenticity signals','Commenter credibility: positive. Timing bursts: none found. Engagement consistency: one anomaly. Comment quality: not measured.'],['Notes from the evaluation',S.notes.length?S.notes.join(' · '):'No team notes yet. Add notes from the sidebar or creator overview.'],['Evidence and limitations','9 of 10 selected posts were available. Public signals cannot prove authenticity with certainty.']];
  return `<div class="between"><div><h2 class="report-h">Authenticity report</h2><p class="section-sub">Engagement credibility and supporting evidence</p></div><span class="chip good">9 posts analysed</span></div>
    <div class="stack" style="gap:10px"><div class="section-head"><h3>Verdict criteria</h3></div><div class="crit-list">
      ${FINDINGS.map(f=>`<div class="info finding">${signChip(f[0])}<div style="flex:1"><strong>${f[1]}</strong><p class="note">${f[3]}</p></div><span class="fvalue">${f[2]}</span></div>`).join('')}</div>
    </div>`;
}
const BF_STRENGTHS=['Audience matches your brand profile','High reach with real commenters','Warm, personal tone suits gifting'];
const BF_CONCERNS=['Little gifting content, so no proof of conversion','Authenticity read from only 2 posts'];
const STAGES=[
  {name:'Audience',w:35,score:84,q:'Do they reach the people you sell to?',a:'Women 25–34 in metros, close to your festive-gifters profile.',d:'Mostly women 25–34 in metros. India is secondary.'},
  {name:'Performance',w:30,score:78,q:'Does engagement hold up, and is it real?',a:'Reach is 26× followers. Authenticity came back 93 from a thin sample.',d:'Reach is 26× followers. Based on 9 posts, so directional.'},
  {name:'Content',w:20,score:70,q:'Is this the kind of content you want to be in?',a:'Styling reels shot at home, which the brief prefers.',d:'Home-styled reels match the brief’s format.'},
  {name:'Topics',w:15,score:48,q:'Do they cover what you asked for?',a:'Ethnic wear appears often; gifting only twice in 142 posts.',d:'Ethnic wear in 31 of 142 posts. Gifting appears twice, only as outfit captions. No fast-fashion hauls.',links:['Show the 2 gifting posts','Show 31 ethnic wear posts'],open:true}
];
function fitLabel(s){ return s>=70?'Good fit':s>=55?'Fair fit':'Weak fit'; }
const EVALUATED_CAMPAIGNS=['Diwali Gifting 2026','Winter Denim Drop'];
const CAMPAIGN_SCORES={'Diwali Gifting 2026':72,'Winter Denim Drop':61,'Wellness Creators Q4':58,'Summer Lifestyle Launch':49};
function brandFitHTML(){
  const c=S.campaign, evaluated=EVALUATED_CAMPAIGNS.includes(c);
  return `<div class="between"><div><h2 class="report-h">Brand Fit · ${esc(c)}</h2><p class="section-sub">Campaign-specific fit for this creator</p></div><span class="chip ai">${evaluated?'Evaluated':'Not evaluated'}</span></div>
  ${evaluated?`<div class="stack" style="gap:10px"><div class="section-head"><h3>Stage scores</h3></div>
      <div class="stage-list">${STAGES.map(s=>`<details class="stage"${s.open?' open':''}><summary><div class="stage-name"><strong>${s.name}</strong><span>${s.w}% of the score</span></div><div class="stage-score ${s.score>=70?'good':s.score>=55?'fair':'weak'}">${s.score}</div><div class="stage-q"><span class="ask">${s.q}</span> ${s.a}</div>${icon('chevRight','ico-sm stage-chev')}</summary>
        <div class="stage-body"><p class="note">${s.d}</p>${s.links?`<div class="stage-links">${s.links.map(l=>`<button class="link" onclick="switchTab(1)">${l}</button>`).join('')}</div>`:''}</div></details>`).join('')}</div></div>
    <div class="sc-grid">
      <div class="stack" style="gap:10px"><div class="section-head"><h3>Strengths</h3></div>
        <div class="sc-card">${BF_STRENGTHS.map(t=>`<div class="sc-item good">${icon('check','ico-sm')}<span>${t}</span></div>`).join('')}</div></div>
      <div class="stack" style="gap:10px"><div class="section-head"><h3>Concerns</h3></div>
        <div class="sc-card">${BF_CONCERNS.map(t=>`<div class="sc-item warn">${icon('alert','ico-sm')}<span>${t}</span></div>`).join('')}</div></div>
    </div>
    `
  :`<div class="empty"><strong class="empty-h">Not evaluated for ${esc(c)}</strong>Fit scores are specific to a campaign. Run an evaluation to score this creator against it.<div style="margin-top:12px"><button class="btn primary" onclick="runBrandFit()">Run brand fit evaluation</button></div></div>`}`;
}
function authRailHTML(){
  return `<div class="rail-card"><div class="rail-head"><h3>This evaluation</h3></div>
    <div class="info"><span>Status</span><span class="chip good">${S.reportRefreshed?'Refreshed':'Ready'}</span></div>
    <div class="info"><span>Evaluated</span><strong>${S.reportRefreshed?'Just now':'20h ago'}</strong></div>
    <div class="info"><span>Posts selected</span><strong>10</strong></div>
    <div class="info"><span>Posts analysed</span><strong>${S.postsRead}</strong></div>
    <div class="info"><span>Comments read</span><strong>244</strong></div>
    <div class="rail-sub"><span class="eyebrow">What's analysed</span>
      <ul class="analysed">
        <li>Engagement rate and its spread across the selected posts</li>
        <li>Comment quality and commenter account patterns</li>
        <li>Share of likes and comments from unusual sources</li>
        <li>Audience overlap with brand-safe follower profiles</li>
      </ul></div>
    <div class="row" style="margin-top:10px"><button class="btn sm primary" onclick="refreshReport()">${icon('refresh','ico-sm')}Re-evaluate</button><button class="btn sm" onclick="changePosts()">Edit posts</button></div></div>`;
}
function brandRailHTML(){
  const c=S.campaign;
  return `<div class="rail-card"><div class="rail-head"><h3>Scored for</h3></div>
    <select class="field full" aria-label="Campaign" onchange="setCampaign(this.value)">${CAMPAIGNS.map(n=>`<option ${c===n?'selected':''}>${esc(n)}</option>`).join('')}</select>
    <div class="rail-sub"><span class="eyebrow">What's analysed</span>
      <ul class="analysed">
        <li>Content relevance to the campaign's category</li>
        <li>Audience geography against the campaign's target markets</li>
        <li>Audience gender balance against the campaign's target</li>
        <li>Past experience in the category</li>
        <li>Overlap with competing brand relationships</li>
      </ul></div>
    <div class="row" style="margin-top:10px"><button class="btn sm primary" onclick="runBrandFit()">${icon('refresh','ico-sm')}Re-evaluate</button><button class="btn sm" onclick="toast('Opening the brief on the plan (demo)')">Edit brief</button></div></div>`;
}
function setCampaign(name){ S.campaign=name; paintBody(); }
function refreshReport(){
  showModal('Refresh evaluation',`<p class="note">This will simulate refreshing the ${S.report} report. Existing results remain visible until completion.</p>`,
    `<button class="btn primary" onclick="confirmRefresh()">Refresh</button>`);
}
function confirmRefresh(){ S.reportRefreshed=true; S.reportStatus='Refreshed'; closeLayer(); paintBody(); toast('Demo evaluation refreshed. Score unchanged.'); }
function runBrandFit(){ closeLayer(); toast('Brand fit evaluation queued for '+S.brand+' (demo)'); }
function changePosts(){
  showModal('Change posts used in evaluation',`<p class="note">Select example posts for a new report. This changes local coverage only.</p><div class="check-list">${POSTS.slice(0,10).map(p=>`<label class="check-row"><input type="checkbox" name="evalposts" checked value="${p.id}">${esc(p.title)} · ${p.format}</label>`).join('')}</div>`,
    `<button class="btn primary" onclick="saveEvalPosts()">Save selection</button>`);
}
function saveEvalPosts(){
  const n=document.querySelectorAll('input[name=evalposts]:checked').length;
  S.postsRead=Math.max(0,n-1); closeLayer(); paintBody(); toast('Evaluation post selection updated (demo)');
}

/* ════════ COLLABORATIONS (tab 4) ════════ */
function pCollabs(){
  const C=S.collab, P=C.period;
  const end=new Date(Date.UTC(2026,9,22)), start=new Date(Date.UTC(2026,9-P,22)), range=end-start;
  const dt=d=>new Date(d+'T12:00:00Z');
  const inWin=COLLABS.filter(e=>e.type===C.type&&dt(e.date)>=start&&dt(e.date)<=end);
  const visible=inWin.filter(e=>C.signal==='All'||e.signal===C.signal);
  const names=[...new Set(inWin.map(e=>e.name))];
  const allNames=[...new Set(COLLABS.filter(e=>e.type===C.type).map(e=>e.name))];
  const signals=C.type==='Brands'?['Paid partnership','Brand placement','Brand mention']:['Collaborator','Caption mention'];
  const pos=d=>Math.max(1.2,Math.min(98.8,(dt(d)-start)/range*100));
  const months=Array.from({length:P},(_,i)=>{const d=new Date(Date.UTC(2026,9-P+i+1,1));return {key:d.toISOString().slice(0,7),l:d.toLocaleString('en-US',{month:'short',timeZone:'UTC'})};});
  const ticks=Array.from({length:P},(_,i)=>{const d=new Date(Date.UTC(2026,9-P+i+1,1));return {l:d.toLocaleString('en-US',{month:'short',timeZone:'UTC'}),y:d.getUTCFullYear(),p:(d-start)/range*100};}).filter(t=>t.p>=0&&t.p<=100);
  const signalsFound=signals.map(n=>({n,c:inWin.filter(e=>e.signal===n).length})).filter(s=>s.c);
  const rows=names.map(n=>{
    const ev=visible.filter(e=>e.name===n);
    const groups=Object.values(ev.reduce((acc,e)=>{const k=e.date.slice(0,7);(acc[k]??=[]).push(e);return acc;},{}));
    const b=BRANDS.find(x=>x.name===n);
    return `<div class="tl-row"><div class="tl-label">${b?brandMark(b,'sm'):`<span class="brand-mark sm person">♙</span>`}<strong title="${esc(n)}">${esc(n)}</strong><span class="tl-count">${ev.length}</span></div>
      <div class="tl-track">${groups.map(g=>{const e=g[0];return `<button class="tl-dot" style="left:${pos(e.date)}%;background:${SIG_COLORS[e.signal]}" title="${esc(e.name)} · ${g.length} collaboration${g.length===1?'':'s'} · ${e.date.slice(0,7)}" aria-label="View ${g.length} collaborations for ${esc(e.name)}" onclick="openCollab(${e.id})">${g.length}</button>`}).join('')}</div></div>`;
  }).join('');
  return `<div class="stack">
    <div class="between">
      <h1 class="page-title">Collaboration calendar</h1>
      <div class="row"><div class="seg" role="tablist">${['Brands','People'].map(t=>`<button class="${C.type===t?'on':''}" aria-selected="${C.type===t}" onclick="setCollab('type','${t}')">${t}<span class="count">${new Set(COLLABS.filter(e=>e.type===t).map(e=>e.name)).size}</span></button>`).join('')}</div>
        <div class="seg" role="tablist" aria-label="Time period">${[1,3,6].map(m=>`<button class="${P===m?'on':''}" aria-selected="${P===m}" onclick="setCollab('period',${m})">${m}M</button>`).join('')}</div></div>
    </div>
    <div class="row chips-row"><span class="muted" style="font-size:12px">Strongest signal</span>
      ${['All',...signals].map(s=>`<button class="chip btn-like ${C.signal===s?'on':''}" aria-pressed="${C.signal===s}" onclick="setCollab('signal','${s}')">${s!=='All'?`<i class="dot" style="background:${SIG_COLORS[s]}"></i>`:''}${s}</button>`).join('')}</div>
    <div class="kpis5 collab-kpis">
      <div><div class="kpi-label">Collaborations</div><div class="kpi-value">${inWin.length}</div><div class="kpi-sub">posts in the last ${P} month${P>1?'s':''}</div></div>
      <div><div class="kpi-label">${C.type}</div><div class="kpi-value">${names.length}</div><div class="kpi-sub">${allNames.length} in total · across those posts</div></div>
      <div><div class="kpi-label">Collaboration signals</div><div class="stackbar thin">${signalsFound.map(x=>`<span style="flex:${x.c};background:${SIG_COLORS[x.n]}" title="${x.n}: ${x.c}"></span>`).join('')}</div>
        <div class="legend">${signalsFound.map(x=>`<span><i style="background:${SIG_COLORS[x.n]}"></i>${x.n} ${inWin.length?Math.round(x.c/inWin.length*100):0}%</span>`).join('')||'<span>No activity this period</span>'}</div></div>
    </div>
    <section class="section"><div class="section-head"><h2>Collaboration activity</h2><span class="row" style="gap:10px">${visible.some(e=>e.ours)?`<span class="chip" style="background:${OUR_COLOR}22;color:${OUR_COLOR}">● Our brand</span>`:''}<span class="muted" style="font-size:12px">Select a highlighted cell to filter the brand table</span></span></div>
      <div class="card matrix" style="grid-template-columns:140px repeat(${P},minmax(0,1fr))">
        <span class="eyebrow">Brand</span>${months.map(m=>`<span class="eyebrow center">${m.l}</span>`).join('')}
        ${names.map(n=>`<span class="mname">${esc(n)}</span>${months.map(m=>{const ev=visible.filter(e=>e.name===n&&e.date.slice(0,7)===m.key);if(!ev.length)return '<span class="cell-empty"></span>';const c=ev.some(e=>e.ours)?OUR_COLOR:SIG_COLORS[ev[0].signal];return `<button class="cell" style="background:${c}22;color:${c}" title="${esc(n)} · ${m.l} · ${ev.length} collaboration${ev.length===1?'':'s'}" onclick="pickCell('${esc(n)}','${m.l}')">${ev.length}</button>`;}).join('')}`).join('')}
      </div>
    </section>
    <div class="between muted" style="font-size:12px"><span>Showing ${visible.length} of ${inWin.length} collaboration signals</span>${C.signal!=='All'?'<button class="link" onclick="setCollab(\'signal\',\'All\')">Clear signal filter</button>':''}</div>
    <div class="stack">${brandTableCard()}</div>
  </div>`;
}
function setCollab(k,v){ S.collab[k==='type'?'type':k==='period'?'period':'signal']=v; if(k==='type') S.collab.signal='All'; paintBody(); }
function openCollab(id){
  const e=COLLABS.find(x=>x.id===id), p=POSTS.find(x=>x.id===e.post)||POSTS[0], b=BRANDS.find(x=>x.name===e.name);
  const d=new Date(e.date+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
  showDrawer(`<span class="row" style="gap:10px">${b?brandMark(b,'sm'):''}<span>${esc(e.name)}</span></span>`,
    `<p class="note">${e.type==='Brands'?'Brand collaboration':'Creator collaboration'}</p>
     <div class="row"><span class="chip" style="background:${SIG_COLORS[e.signal]}22;color:${SIG_COLORS[e.signal]}">● ${e.signal}</span><span class="chip">${d}</span></div>
     <div class="grid g3"><div class="card" style="padding:12px 14px"><div class="kpi-label">Content</div><div class="kpi-value" style="font-size:16px">1 linked post</div></div><div class="card" style="padding:12px 14px"><div class="kpi-label">Views</div><div class="kpi-value" style="font-size:16px">${fmt(p.views)}</div></div><div class="card" style="padding:12px 14px"><div class="kpi-label">Engagement</div><div class="kpi-value" style="font-size:16px">${p.eng}%</div></div></div>
     <div class="section-head" style="margin-top:6px"><h2>Associated creative</h2></div>
     <div class="grid-posts">${galleryCard(p)}</div>`);
}

/* ════════ AUDIENCE (tab 5) ════════ */
function pAudience(){
  const A=S.audience, detail=A!=='Overview';
  const AUD={Instagram:{q:60,g:80,ages:[1,34,44,16,5],us:70,ind:13},TikTok:{q:61,g:81,ages:[3,39,41,14,3],us:64,ind:17},Meta:{q:58,g:76,ages:[2,30,40,20,8],us:66,ind:15}};
  const d=AUD[detail?A:'Instagram'], gender=d.g;
  const seg=`<div class="seg" role="tablist">${['Overview','Instagram','Meta','TikTok'].map(x=>`<button class="${A===x?'on':''}" aria-selected="${A===x}" onclick="setAudience('${x}')">${x}</button>`).join('')}</div>`;
  const overview=`<div class="grid g3">${['Instagram','Meta','TikTok'].map(x=>{ const k=SLUG_OF[x]; return `<button class="card platform-card pc-${k}" onclick="setAudience('${x}')"><span class="pc-head"><span class="pc-logo">${PC_ICON[x]}</span><strong>${x}</strong></span><span class="pc-score"><b>${AUD[x].q}</b><small>/100 audience quality</small></span><span class="pc-rows"><span class="pc-row"><span>Gender</span><b>${AUD[x].g}% female</b></span><span class="pc-row"><span>Top location</span><b>United States</b></span></span><span class="link">View details ${icon('chevRight','ico-sm')}</span></button>`;}).join('')}</div>`;
  const ages=d.ages;
  const PIE_COL=['#2563eb','#fbbf24','#22c55e','#ec4899','#3b82f6'];
  const pie=parts=>{let off=0;const C=2*Math.PI*38;const segs=parts.filter(p=>p.v>0).map((p,i)=>{const len=p.v/100*C;const s=`<circle r="38" cx="60" cy="60" fill="none" stroke="${PIE_COL[i]}" stroke-width="18" stroke-dasharray="${len} ${C-len}" stroke-dashoffset="${-off}" transform="rotate(-90 60 60)"/>`;off+=len;return s;}).join('');
    return `<div class="pie-wrap"><svg viewBox="0 0 120 120" class="pie" role="img" aria-label="${parts.map(p=>p.l+' '+p.v+'%').join(', ')}">${segs}</svg><ul class="pie-legend">${parts.map((p,i)=>`<li><i style="background:${PIE_COL[i]}"></i><span>${p.l}</span><b>${p.v}%</b></li>`).join('')}</ul></div>`;};
  const ageLabels=['13–17','18–24','25–34','35–44','45+'];
  const demo=`<div class="grid g3">
    <div class="card"><div class="card-title"><h2>Gender</h2></div>
      ${pie([{l:'Female',v:gender},{l:'Male',v:100-gender}])}</div>
    <div class="card"><div class="card-title"><h2>Age</h2></div>
      ${pie(ageLabels.map((l,i)=>({l,v:ages[i]})))}</div>
    <div class="card"><div class="card-title"><h2>Location</h2></div>
      ${pie([{l:'United States',v:d.us},{l:'India',v:d.ind},{l:'UK',v:8},{l:'Other',v:100-d.us-d.ind-8}])}
      <div class="info"><span>Top city</span><strong>Los Angeles</strong></div><div class="info"><span>Language</span><strong>English</strong></div></div>
  </div>`;
  const quality=`<div class="card"><div class="between"><strong>Audience quality</strong><span class="chip warn">${d.q}/100 · Moderate · estimated</span></div>
    <div class="info"><span>Real active followers</span><strong>Mixed</strong></div><div class="info"><span>Low bot/fake-follower signal</span><strong>Healthy</strong></div><div class="info"><span>Consistent growth</span><strong>Mixed</strong></div>
    <p class="note">Estimated signals, not an exact follower verification.</p></div>`;
  const affinity=`<section class="section"><div class="section-head"><h2>Audience brand affinity</h2></div><div class="card row" style="gap:20px">${[['WOW','67%','#6d28d9'],['mCaffeine','77%','#9a3412'],['Gymshark','71%','#1e293b']].map(x=>`<div class="row" style="flex-wrap:nowrap"><span class="brand-mark sm" style="background:${x[2]}">${x[0][0]}</span><strong style="font-weight:500">${x[0]}</strong><span class="chip" title="Estimated brand affinity">${x[1]} est.</span></div>`).join('')}</div></section>`;
  const interests=detail?`<section class="section"><div class="section-head"><h2>Top interests</h2></div><div class="card row">${['Lifestyle','Wellness','Tech','Beauty','DIY'].map(x=>`<span class="chip">${x}</span>`).join('')}</div></section>`:'';
  const fit=`<section class="section"><div class="section-head"><h2>Target audience fit</h2><button class="btn sm ${S.fitMode?'on':''}" onclick="toggleFit()">${S.fitMode?'Exit fit inspection':'Inspect against a campaign'}</button></div>
    <div class="card"><div class="between"><strong>Brand-specific audience alignment</strong><span class="chip ai">Contextual interpretation</span></div>
      <p class="note">${S.fitMode?'Review alignment and limitations using the contextual panel alongside demographics.':'Select “Inspect against a campaign” to open the dedicated audience-fit context panel. General demographics remain full-width.'}</p>
      ${S.fitMode?`<div class="grid g3" style="margin-top:12px">${[['Geography','Review','US leads the audience; verify the selected campaign’s target markets.'],['Gender','Potential fit','Female-skewing audience aligns with some lifestyle categories.'],['Interests','Potential fit','Lifestyle and wellness topics overlap with relevant products.']].map(x=>`<div class="takeaway-box"><strong>${x[0]} · ${x[1]}</strong><p class="note">${x[2]}</p></div>`).join('')}</div>`:''}
      <div class="row" style="margin-top:10px"><button class="btn sm" onclick="jump(3,'Brand Fit')">Open Brand Fit report</button></div></div></section>`;
  const main=`<div class="stack aud-tab">
    <div><h1 class="page-title">Audience intelligence</h1><p class="section-sub">Platform audiences are shown separately. Cross-platform overlap is unknown.</p><div style="margin-top:12px">${seg}</div></div>
    <section class="signals-block">
      <div class="kpis5 signals-grid">
        <div class="ctx"><span>Audience quality</span><strong>69</strong><small>Moderate · estimated</small></div>
        <div class="ctx"><span>Performance reliability</span><strong class="warn-t">Weak</strong><small>Review anomalies</small></div>
        <div class="ctx"><span>Evidence coverage</span><strong>34/36</strong><small>Available analysed posts</small></div>
        <div class="ctx"><span>Commercial history</span><strong>6 brands</strong><small>12 collaborations</small></div>
      </div><div class="section-head signals-title"><h2>Creator evaluation signals</h2></div></section>
    ${detail?demo:overview}
    ${affinity}
    ${detail?quality:''}
    ${interests}
    ${fit}
    <div class="note">Illustrative public-data estimates · refreshed 20h ago. Cross-platform audience overlap unknown.</div>
  </div>`;
  return S.fitMode?`<div class="with-rail">${main}${fitRail()}</div>`:main;
}
function setAudience(a){ S.audience=a; paintBody(); }
function toggleFit(){ S.fitMode=!S.fitMode; paintBody(); }
function fitRail(){
  return `<aside class="stack"><div class="rail-card"><div class="rail-head"><h3>Audience-fit context</h3></div>
    <label class="note" style="display:block;margin-bottom:6px">Selected campaign</label>
    <select class="field full" aria-label="Selected campaign" onchange="setCampaign(this.value)">${CAMPAIGNS.map(n=>`<option ${S.campaign===n?'selected':''}>${esc(n)}</option>`).join('')}</select>
    <div class="info" style="margin-top:8px"><span>Target market</span><strong>Requires verification</strong></div>
    <div class="info"><span>Primary audience</span><strong>Female-skewing</strong></div>
    <div class="info"><span>Interests</span><strong>Lifestyle, wellness</strong></div>
    <p class="note" style="margin-top:10px">Campaign targets are illustrative. Validate before treating these as a confirmed match.</p>
    <div class="row" style="margin-top:8px"><button class="btn sm" onclick="toggleFit()">Close inspection</button></div></div>
    <div class="rail-card"><div class="rail-head"><h3>Data coverage</h3></div><div class="info"><span>Source</span><strong>Estimated platform signals</strong></div><div class="info"><span>Refreshed</span><strong>20h ago</strong></div><div class="info"><span>Cross-platform overlap</span><strong>Unknown</strong></div></div></aside>`;
}

/* ════════ CAMPAIGNS, NOTES, RECORD ════════ */
function openCampaignPick(){
  showModal('Add Nicole to a campaign',
    `<input class="field full" placeholder="Search campaigns" oninput="filterCampaignRows(this.value)">
     <div class="check-list" id="campList">${CAMPAIGNS.map(n=>`<label class="check-row campaign-row"><input type="checkbox" name="camp" value="${n}" ${S.campaigns.includes(n)?'checked':''}>${n}</label>`).join('')}</div>`,
    `<button class="btn primary" onclick="saveCampaigns()">Save to campaigns</button>`);
}
function filterCampaignRows(v){ document.querySelectorAll('.campaign-row').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(v.toLowerCase())?'':'none'); }
function saveCampaigns(){ S.campaigns=[...document.querySelectorAll('input[name=camp]:checked')].map(x=>x.value); closeLayer(); paintHeader(); paintBody(); toast('Campaign associations updated'); }
function openCampaignDetail(name,fit){
  showDrawer('Campaign details',`<div class="card"><div class="eyebrow">Campaign</div><h2 style="font-size:18px;margin:6px 0 12px;color:var(--ink-strong)">${esc(name)}</h2>
    <div class="info"><span>Creator</span><strong>Nicole Pearce</strong></div>
    <div class="info"><span>Campaign fit score</span><strong>${fit}/100</strong></div>
    <div class="info"><span>Status</span><strong>${S.campaigns.includes(name)?'Added':'Shortlisted'}</strong></div>
    <p class="note" style="margin-top:12px">Campaign details are illustrative. This is a separate fit score from brand-level fit.</p>
    <div class="row" style="margin-top:12px"><button class="btn primary" onclick="closeLayer();jump(3,'Brand Fit')">View Brand Fit</button></div></div>`);
}
function recordDialog(){
  showModal('Record interaction',
    `<label class="note">Interaction type</label><select id="itype" class="field full"><option>Contacted</option><option>Replied</option><option>Meeting scheduled</option></select>
     <label class="note">Notes</label><textarea id="inote" class="field full area" placeholder="Add a brief note"></textarea>`,
    `<button class="btn primary" onclick="saveInteraction()">Save interaction</button>`);
}
function saveInteraction(){
  S.relationship=document.getElementById('itype').value;
  const n=document.getElementById('inote').value.trim(); if(n) S.notes.push(n);
  closeLayer(); paintBody(); toast('Interaction recorded');
}
function noteDialog(){
  showModal('Add creator note',`<textarea id="newNote" class="field full area" placeholder="What should your team know?"></textarea>`,
    `<button class="btn primary" onclick="saveNote()">Save note</button>`);
}
function saveNote(){ const n=document.getElementById('newNote').value.trim(); if(!n){ toast('Enter a note'); return; } S.notes.push(n); closeLayer(); paintBody(); toast('Note saved'); }

/* ════════ ASK ADAM ════════ */
function openAssistant(){
  showDrawer('✦ Ask Adam · Demo assistant',`<p class="note">Explore suggested questions. Responses use illustrative prototype data, not a live AI model.</p>
    <div class="stack" style="gap:8px">${ANSWERS.map((q,i)=>`<button class="btn q-btn" onclick="assistantAnswer(${i})">${q[0]} ${icon('chevRight','ico-sm')}</button>`).join('')}</div>
    <div id="assistantAnswer" class="card soft" style="margin-top:14px"><span class="muted">Choose a question to view a contextual answer.</span></div>`);
}
function assistantAnswer(i){ document.getElementById('assistantAnswer').innerHTML=`<strong>Demo answer</strong><p class="note" style="margin-top:6px">${ANSWERS[i][1]}</p>`; }

/* ════════ INIT ════════ */
window.addEventListener('scroll',()=>{ const c=document.getElementById('compact'), on=window.scrollY>158; if(c.classList.contains('show')!==on){ c.classList.toggle('show',on); on?c.removeAttribute('inert'):c.setAttribute('inert',''); } },{passive:true});
document.getElementById('compact').setAttribute('inert','');
document.getElementById('askBtn').addEventListener('click',openAssistant);

/* Donut helper (global) */
function donutHTML(parts){
  const COL=['#2563eb','#fbbf24','#22c55e','#ec4899','#3b82f6','#60a5fa'];
  let off=0; const C=2*Math.PI*38;
  const segs=parts.filter(p=>p.v>0).map((p,i)=>{const len=p.v/100*C;const s=`<circle r="38" cx="60" cy="60" fill="none" stroke="${COL[i%COL.length]}" stroke-width="18" stroke-dasharray="${len} ${C-len}" stroke-dashoffset="${-off}" transform="rotate(-90 60 60)"/>`;off+=len;return s;}).join('');
  return `<div class="pie-wrap"><svg viewBox="0 0 120 120" class="pie" role="img" aria-label="${parts.map(p=>p.l+' '+p.v+'%').join(', ')}">${segs}</svg><ul class="pie-legend">${parts.map((p,i)=>`<li><i style="background:${COL[i%COL.length]}"></i><span>${p.l}</span><b>${p.v}%</b></li>`).join('')}</ul></div>`;
}

/* ════════ REPORT VIEW (all tabs as one long page) ════════ */
function setView(v){ S.view=v; paintHeader(); paintBody(true); window.scrollTo(0,0); }
function withPerfSub(i,fn){ const k=S.perfSub; S.perfSub=i; try{ return fn(); } finally { S.perfSub=k; } }
const rptCreator=()=>DISC.find(x=>x.id===S.myCreator)||DISC[0];
const rptFirst=()=>esc(rptCreator().name.split(' ')[0]);
const rptHandle=()=>esc(rptCreator().handle.replace(/^@/,''));
function reportHTML(){
  const secs=[
    ['Overview',()=>pOverview()],
    ['Content',()=>pContent()],
    ['Performance overview',()=>withPerfSub(0,pPerformance)],
    ['Creative insights',()=>withPerfSub(1,pPerformance)],
    ['Evaluated reports',()=>pReports()],
    ['Collaborations',()=>pCollabs()],
    ['Audience',()=>pAudience()]
  ];
  const RPT_ICO=['<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>','<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15l5-5 4 4 3-3 6 6"/>','<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>','<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>','<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>','<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-4-6.3"/>','<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'];
  const navItems=secs.map(([name],i)=>`<button type="button" data-rpt="rpt-${i}" class="${i===0?'on':''}" onclick="reportJump('rpt-${i}')">${discSvg(RPT_ICO[i]||RPT_ICO[0],15)}<span>${name}</span></button>`).join('');
  setTimeout(reportSpy,0);
  return `<div class="report-layout"><div class="report-view">
    ${secs.map(([name,fn],i)=>`<section class="report-sec" id="rpt-${i}"><h2 class="report-h">${name}</h2>${fn()}</section>`).join('')}
  </div><nav class="report-nav" aria-label="Report sections">${navItems}</nav></div>`;
}
function reportJump(id){ const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); }
function reportSpy(){
  const secs=[...document.querySelectorAll('.report-sec')], nav=[...document.querySelectorAll('.report-nav button')];
  if(!secs.length||!nav.length||!('IntersectionObserver' in window)) return;
  const io=new IntersectionObserver(entries=>{ entries.forEach(en=>{ if(en.isIntersecting) nav.forEach(b=>b.classList.toggle('on',b.dataset.rpt===en.target.id)); }); },{rootMargin:'-15% 0px -70% 0px'});
  secs.forEach(x=>io.observe(x));
}

function perfViewNow(){ return S.view==='report'?'Dots':(S.perfView||'Dots'); }

/* Overview score gauge (pastel zones, marker, scale) */
function gaugeCard(name,score,chip,chipCls,foot,tab){
  return `<button class="report gauge-card" onclick="jump(3,'${tab}')" aria-label="${name} ${score} out of 100, open report">
    <div class="gauge-top"><span class="report-name">${name}</span><span class="chip ${chipCls}">${chip}</span></div>
    <div class="gauge-num">${score}<small>/100</small></div>
    <div class="gauge">
      <div class="gauge-zones"><i style="flex:50;background:#fbcfe8"></i><i style="flex:20;background:#ffedd5"></i><i style="flex:15;background:#fef3c7"></i><i style="flex:15;background:#dcfce7"></i></div>
      <span class="gauge-mark" style="left:${score}%"></span>
      <div class="gauge-scale"><span style="left:0%">0</span><span style="left:50%">50</span><span style="left:70%">70</span><span style="left:85%">85</span><span style="left:100%">100</span></div>
    </div>
    <div class="report-foot"><span>${foot[0]}</span><span>${foot[1]}</span></div>
  </button>`;
}

/* ════════ DISCOVER (Creator > Discover) ════════ */
const DISC=[
 {id:'cr1',name:'Pavan K Sirisin',handle:'@pavansirisin',followers:776,views:20500,tier:'Nano',tags:['Skincare'],source:'Self',collabs:2,likes:1250,last:'2d ago'},
 {id:'cr2',name:'Kylie',handle:'@kyliejenner',followers:380600000,views:2500000,tier:'Mega',tags:['Beauty'],source:'Inspiration',collabs:0,likes:186000,last:'1d ago'},
 {id:'cr3',name:'Vedictoons',handle:'@vedictoons',followers:178,views:8200,tier:'Nano',tags:['Wellness'],source:'Competitor',collabs:3,likes:410,last:'6d ago'},
 {id:'cr4',name:'Gaurav Sunil',handle:'@gaurav_kaizoku',followers:272100,views:102000,tier:'Macro',tags:['Lifestyle'],source:'Competitor',collabs:6,likes:5300,last:'3d ago'},
 {id:'cr5',name:'Marques',handle:'@marquesbrownlee',followers:10800000,views:1100000,tier:'Mega',tags:['Tech'],source:'Inspiration',collabs:2,likes:40500,last:'1d ago'},
 {id:'cr6',name:'The Souled Store',handle:'@thesouledstore',followers:2200000,views:106600,tier:'Mega',tags:['Fashion'],source:'Competitor',collabs:4,likes:870,last:'4d ago'},
 {id:'cr7',name:'Priyanka',handle:'@priyankachopra',followers:92800000,views:2200000,tier:'Mega',tags:['Beauty'],source:'Inspiration',collabs:2,likes:53000,last:'1d ago'},
 {id:'cr8',name:'Ananya Beauty',handle:'@ananyabeauty',followers:45000,views:35200,tier:'Micro',tags:['Skincare'],source:'Self',collabs:5,likes:1640,last:'2d ago'},
 {id:'cr9',name:'Riya (sample)',handle:'@riya_sample',followers:14200,views:31000,tier:'Micro',tags:['Skincare'],source:'Discover',collabs:0,likes:1600,last:'Never'},
];
function syncNav(){ syncPinned(); const cur={plan:'campaigns',shortlist:'campaigns',campaign:'campaigns',collection:'collections','content-tracker':'campaigns'}[S.page]||S.page; document.querySelectorAll('.nav a.nav-row[data-page]').forEach(a=>{ const on=a.dataset.page===cur; a.classList.toggle('on',on); on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'); }); }
function setPage(p){ if(p==='shortlist'){ p='campaigns'; S.campTab='draft'; } if(p==='tracker') S.dashTab='tracker'; else if(p==='dashboard'&&S.dashTab==='tracker') S.dashTab='overview'; S.page=p; S.discCreator=null; S.myCreator=null; paintHeader(); paintBody(true); window.scrollTo(0,0); }
function addDisc(id){ if(!isInMy(id)) S.discAdded.push(id); const dc0=DISC.find(x=>x.id===id); if(dc0)dc0.repo=false; paintBody(); { const dc=DISC.find(x=>x.id===id); addToast('Successfully added',`${dc?dc.name:'Creator'} has been successfully added to`,'My creators',()=>{ S.discCreator=null; setPage('creators'); }); } }

function listPage(){ return ['discover','creators','collections','collection','shortlist','dashboard','tracker','campaigns','content-tracker','plan','campaign','settings'].includes(S.page); }
function detailId(){ return S.page==='discover'?S.discCreator:S.page==='creators'?S.myCreator:null; }
function crumbHTML(){
  const id=detailId(); if(!id) return '';
  const root=S.page==='discover'?'Discover':'My creators';
  const c=DISC.find(x=>x.id===id)||{name:''};
  return `<div class="crumb"><button class="link" onclick="closeDetail()">${root}</button> / ${esc(c.name)}</div>`;
}
function closeDetail(){ if(S.page==='discover') S.discCreator=null; else S.myCreator=null; paintHeader(); paintBody(true); window.scrollTo(0,0); }
function openMyCreator(id,tab=0){ if(S.page==='discover')S.discCreator=id; S.myCreator=id; S.tab=tab; S.menu=null; paintHeader(); paintBody(true); window.scrollTo(0,0); }
/* ── Creator side panel (row name click): summary, shortlist scores, timeline ── */
function creatorActivity(c){
  const posts=CAMP_LIST.flatMap(camp=>camp.posts.filter(p=>p.creator===c.id).map(p=>({...p,campaign:camp.name})));
  const plans=CAMP_PLANS.filter(p=>(p.shortlisted||[]).includes(c.id));
  return {posts,plans};
}
const shortDate=d=>{ const t=new Date(d); return isNaN(t)?esc(d||''):t.toLocaleDateString('en-GB',{day:'numeric',month:'short'}); };
const rnd=seed=>{let x=(seed>>>0)||7;return()=>{x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;return (x%10000)/10000;};};
const pad2=n=>String(n).padStart(2,'0');
/* Creator overview: the dashboard's Posts timeline, scoped to this creator */
function setCrPer(v){ S.crPer=v; paintBody(); }
function setCrCust(k,v){ S.crCust={...(S.crCust||{}),[k]:v}; paintBody(); }
function crTimelineHTML(){
  const id=S.myCreator, per=S.crPer||'all', cust=S.crCust||{};
  const camps=CAMP_LIST.filter(x=>(x.creatorIds||[]).includes(id)).map(x=>({...x,posts:x.posts.filter(p=>p.creator===id)}));
  const rr=rangeOf(per,cust), crMonthly=!(rr&&rr.from.slice(0,7)===rr.to.slice(0,7));
  return `<section class="section cr-tl-sec">${periodBarHTML({scope:'This creator only',value:per,cust,opts:PERIOD_OPTS,set:'setCrPer(',setCust:'setCrCust'})}<div class="dk-main dw-grid cr-tl-grid${crMonthly?' cr-tl-mo':''}"><div class="dw-cell dw-full" data-w="timeline">${timelineHTML({camps,value:per,cust,scope:'This creator only',title:'Posts timeline',split:true})}</div></div></section>`;
}
function isEvaluatedCreator(c){return !!c&&isInMy(c.id)&&mx(c).auth!=null;}
function limitedDetail(){const id=detailId(); const c=id?crOf(id):null; return !!c&&!isEvaluatedCreator(c);}
function evaluateCreatorNow(id){const c=crOf(id); if(!c)return; if(!isInMy(id))addToCreator(id,'my'); MYC[id]={...(MYC[id]||{}),auth:60+avHash(id)%36}; paintBody(); toast(`${c.name} evaluated`);}
function unevaluatedCtas(c){return isInMy(c.id)?`<button class="ds-btn ds-btn--primary" onclick="closeLayer();evaluateCreatorNow('${c.id}')">Evaluate</button>`:`<button class="ds-btn ds-btn--primary" onclick="closeLayer();addToCreator('${c.id}','my')">Add to my creators</button>`;}

const SH_CSS=`
.sh-wrap{padding:0 24px 28px;color:#0f172a}
.sh-visit{display:flex;align-items:center;gap:12px;margin-top:20px;padding-bottom:20px;border-bottom:1px solid #e2e8f0}
.sh-visit-t{min-width:0;flex:1;display:flex;flex-direction:column}
.sh-visit-t b{font-size:14px;font-weight:600;color:#0f172a}
.sh-visit-t span{font-size:13px;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sh-link{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:8px;background:#1d4ed8;color:#ffffff;font-weight:600;font-size:13px;text-decoration:none;white-space:nowrap}
.sh-link svg{stroke:#ffffff}
.sh-tiles{display:grid;grid-template-columns:1fr 1fr;gap:1px;margin-top:20px;background:#e2e8f0;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden}
.sh-tile{display:flex;gap:12px;align-items:center;padding:14px 16px;background:#ffffff;min-width:0}
.sh-tile>div{min-width:0}
.sh-tile span{display:block;font-size:12px;font-weight:500;color:#0f172a}
.sh-tile b{display:block;font-size:16px;font-weight:700;color:#0f172a;margin-top:2px}
.sh-ico{width:auto;height:auto;border:0;background:none;color:#1d4ed8;display:inline-flex;flex:none}
.sh-cta{display:flex;gap:12px;align-items:flex-start;margin-top:16px;padding:14px 16px;border-left:3px solid #1d4ed8;background:#eff6ff}
.sh-cta b{display:block;font-size:14px;font-weight:600;color:#0f172a}
.sh-cta p{margin:2px 0 0;font-size:13px;color:#0f172a;line-height:1.5}
.sh-cta svg{color:#1d4ed8;stroke:#1d4ed8;margin-top:1px;flex:none}
.sh-h{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:700;color:#0f172a;margin:28px 0 12px}
.sh-h svg{stroke:#1d4ed8}
.sh-posts{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.sh-post{min-width:0}
.sh-post-media{aspect-ratio:3/4;position:relative;border-radius:8px;background:#dbeafe;overflow:hidden}
.sh-kind{position:absolute;left:8px;top:8px;background:#ffffff;color:#0f172a;font-size:12px;font-weight:600;padding:3px 8px;border-radius:6px}
.sh-post-meta{display:flex;flex-direction:column;gap:2px;padding:8px 2px 0;font-size:12px;color:#0f172a}
.sh-post-meta span:first-child{font-weight:600}
.sh-parts{display:grid;gap:10px}
.sh-part{display:flex;gap:12px;align-items:flex-start;padding:14px 0;border-bottom:1px solid #e2e8f0}
.sh-part b{display:block;font-size:14px;font-weight:600;color:#0f172a}
.sh-part p{margin:2px 0 0;font-size:13px;color:#0f172a;line-height:1.5}
`;
const SH_I={
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-4-6.3"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 pin:'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 award:'<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
 coin:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"/>',
 check:'<circle cx="12" cy="12" r="9"/><path d="M8 12l2.5 2.5L16 9"/>',
 spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
 ext:'<path d="M14 3h7v7M10 14 21 3M21 14v7H3V3h7"/>'
};
function sheetPlat(c){ const pl=(c.platforms&&c.platforms[0])||'Instagram'; const h=encodeURIComponent(String(c.handle||'').replace(/^@/,'')); const map={Instagram:`https://www.instagram.com/${h}/`,YouTube:`https://www.youtube.com/@${h}`,TikTok:`https://www.tiktok.com/@${h}`,Facebook:`https://www.facebook.com/${h}`}; const name=map[pl]?pl:'Instagram'; return {name,url:map[name]}; }
function sheetWrap(x){ return `<div class="sh-wrap"><style>${SH_CSS}</style>${x}</div>`; }
function sheetVisit(c){ const p=sheetPlat(c); return `<div class="sh-visit"><div class="sh-visit-t"><b>${esc(p.name)} profile</b><span>${esc(c.handle)}</span></div><a class="sh-link" href="${p.url}" target="_blank" rel="noopener">Visit ${esc(p.name)}${discSvg(SH_I.ext,13)}</a></div>`; }
function sheetTile(ico,cls,label,val){ return `<div class="sh-tile"><span class="sh-ico">${discSvg(ico,17)}</span><div><span>${label}</span><b>${val}</b></div></div>`; }
function sheetPart(cls,ico,title,text){ return `<div class="sh-part"><span class="sh-ico">${discSvg(ico,17)}</span><div><b>${title}</b><p>${text}</p></div></div>`; }
function sheetPosts(c){
  const r=discRng(discSeedRepo('shpost'+c.id)), kinds=['Reel','Carousel','Post'];
  const grads=['linear-gradient(135deg,#bfdbfe,#60a5fa)','linear-gradient(135deg,#fbcfe8,#ec4899)','linear-gradient(135deg,#bbf7d0,#22c55e)'];
  return [0,1,2].map(i=>{ const k=kinds[Math.floor(r()*3)], v=Math.round((c.views||1000)*(0.6+r()*0.9)), lk=Math.round(v*(0.05+r()*0.05));
    return `<div class="sh-post"><div class="sh-post-media"><span class="sh-kind">${k}</span></div><div class="sh-post-meta"><span>${fmt(v)} views</span><span>${fmt(lk)} likes</span></div></div>`; }).join('');
}
function sheetLimitedBody(c){
  const m=mx(c);
  return sheetWrap(`${sheetVisit(c)}
  <div class="sh-tiles">${sheetTile(SH_I.users,'blue','Followers',fmt(c.followers))}${sheetTile(SH_I.eye,'violet','Avg views',fmt(c.views))}${sheetTile(SH_I.pin,'pink','Location',esc(c.country||m.state||'—'))}${sheetTile(SH_I.award,'amber','Tier',esc(c.tier||'—'))}</div>
  <div class="sh-cta">${discSvg(SH_I.spark,18)}<div><b>Not evaluated yet</b><p>Add to My creators to see scores, rates, collaborations and audience.</p></div></div>
  <h3 class="sh-h">${discSvg(SH_I.eye,16)}Recent posts</h3><div class="sh-posts">${sheetPosts(c)}</div>
  <h3 class="sh-h">${discSvg(SH_I.coin,16)}Partnerships</h3>
  <div class="sh-parts">
    ${sheetPart('green',SH_I.coin,'Rates','No rate card on record yet. Rates appear after evaluation.')}
    ${sheetPart('amber',SH_I.check,'Collaborations','No brand collaborations on record yet.')}
    ${sheetPart('sky',SH_I.users,'Audience','Audience breakdown is available after evaluation.')}
  </div>`);
}
function unevaluatedExtra(c){return `<span class="qv-action-add">${unevaluatedCtas(c)}</span><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="blacklistCreator('${c.id}')">Blacklist</button>`;}
function basicProfilePageHTML(c){const back=S.page==='discover'?'Discover':'My creators';return `<div class="ds-page"><nav class="ds-crumb"><button class="ds-link" onclick="closeDetail()">${back}</button><span>/</span><span>${esc(c.name)}</span></nav><div class="ds-head"><div><h1 class="ds-page-title">${esc(c.name)}</h1><p class="ds-page-desc">${esc(c.handle)} · Not evaluated yet</p></div><div class="ds-actions">${unevaluatedCtas(c)}</div></div>${sheetLimitedBody(c)}</div>`;}
const SOC_SVG={
 ig:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
 meta:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 12c0-2.6 1.4-4.8 3.4-4.8 1.9 0 3 2 4.6 4.8l1 1.7c1.6 2.8 2.7 4.8 4.6 4.8 2 0 3.4-2.2 3.4-4.8s-1.4-4.8-3.4-4.8c-1.9 0-3 2-4.6 4.8"/></svg>'
};
function sheetSocialHTML(c){ const p=sheetPlat(c); return `<style>.sh-soc{display:inline-flex;gap:4px;margin-right:6px}.sh-soc a{width:32px;height:32px;display:grid;place-items:center;border-radius:8px;color:#0f172a;text-decoration:none}.sh-soc a:hover{background:#eff6ff;color:#1d4ed8}.sh-soc svg{display:block}</style><span class="sh-soc"><a href="${p.url}" target="_blank" rel="noopener" aria-label="Open ${p.name}" title="Open ${p.name}">${SOC_SVG.ig}</a><a href="https://www.meta.com/" target="_blank" rel="noopener" aria-label="Meta" title="Meta">${SOC_SVG.meta}</a></span>`; }

const MSD_CSS=`<style>
.msd{display:grid;grid-template-columns:240px minmax(0,1fr);color:#0f172a;font-size:14px;min-height:100%;background:#ffffff}
.msd-rail{border-right:1px solid #f1f5f9;padding:22px 20px 32px;display:flex;flex-direction:column;gap:26px;min-width:0;background:#f8fafc}
.msd-main{padding:22px 26px 36px;display:flex;flex-direction:column;gap:28px;min-width:0}
.msd-h{display:flex;align-items:center;justify-content:space-between;margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#0f172a}
.msd-h small{font-size:12px;font-weight:500;letter-spacing:0;text-transform:none;color:#64748b}
.sd-ico{width:30px;height:30px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;flex:none}
.sd-ico svg{display:block}
.sd-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.sd-stat{border:1px solid #f1f5f9;border-radius:12px;padding:14px;min-width:0;background:#ffffff}
.sd-stat-h{display:flex;flex-direction:column;align-items:flex-start;gap:10px;font-size:12px;color:#0f172a;font-weight:500;white-space:nowrap}
.sd-stat b{display:block;margin-top:10px;font-size:20px;font-weight:700;letter-spacing:-.01em;white-space:nowrap}
.sd-stat b small{font-size:12px;font-weight:500;margin-left:3px;color:#0f172a}
.sd-stat b.is-pend{font-size:14px;font-weight:600}
.sd-stat em{display:block;font-style:normal;font-size:12px;color:#0f172a;margin-top:2px}
.sd-card{border:1px solid #f1f5f9;border-radius:12px;padding:16px;background:#ffffff;min-width:0}
.sd-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.sd-verdict{border-radius:12px;padding:16px;background:linear-gradient(135deg,#eff6ff,#eff6ff);border:1px solid #dbeafe}
.sd-verdict ul{margin:10px 0 0;padding:0;list-style:none;display:grid;gap:7px;font-size:13px;line-height:1.45}
.sd-verdict li{display:flex;gap:8px}
.sd-verdict li:before{content:'';width:6px;height:6px;border-radius:50%;background:#6d28d9;margin-top:7px;flex:none}
.sd-donut{display:flex;align-items:center;gap:16px}
.sd-donut-l{display:grid;gap:6px;font-size:13px}
.sd-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px}
.msd-posts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.msd-post .m{aspect-ratio:3/4;border-radius:12px;background:linear-gradient(160deg,#eff6ff,#dbeafe);position:relative;overflow:hidden;border:1px solid #dbeafe}
.msd-post .m i{position:absolute;left:8px;top:8px;background:#ffffff;font-style:normal;font-size:12px;font-weight:600;padding:3px 8px;border-radius:16px}
.msd-post p{margin:8px 0 0;font-size:12px;line-height:1.4}
.msd-post p b{display:block;font-weight:600;font-size:13px}
.msd-bar{display:grid;grid-template-columns:64px minmax(0,1fr) 38px;gap:10px;align-items:center;font-size:13px;padding:6px 0}
.msd-bar i{display:block;height:6px;border-radius:16px;background:#f1f5f9;overflow:hidden}
.msd-bar i em{display:block;height:100%;border-radius:16px}
.msd-empty{font-size:13px;color:#0f172a;margin:0;padding:12px 0}
.msd-camp{display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid #f1f5f9;font-size:13px}
.msd-camp:last-child{border-bottom:0}
button.msd-camp{width:100%;background:none;border:0;border-bottom:1px solid #f1f5f9;font:inherit;color:#0f172a;text-align:left;cursor:pointer;border-radius:0;padding:11px 0}
button.msd-camp:hover span:first-child{color:#1d4ed8;text-decoration:underline}
button.msd-chip{font:inherit;cursor:pointer}
.msd-rail .msd-chip,.msd-rail button.msd-chip{font-family:inherit;font-size:12px;line-height:1.3;font-weight:500;padding:5px 10px;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left;color:#0f172a;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px}
.msd-camp>span:first-child{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.msd-st{font-size:12px;font-weight:600;padding:3px 9px;border-radius:16px}
.msd-st.is-active{background:#f0fdf4;color:#15803d}
.msd-st.is-done{background:#eff6ff;color:#6d28d9}
.msd-st.is-other{background:#f1f5f9;color:#0f172a}
.msd-plat{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #f1f5f9}
.msd-plat:last-child{border-bottom:0}
.msd-plat span{min-width:0}
.msd-plat b{display:block;font-weight:600;font-size:13px}
.msd-plat small{font-size:12px;color:#0f172a}
.msd-chips{display:flex;flex-wrap:wrap;gap:6px}
.msd-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border:1px solid #e2e8f0;border-radius:16px;font-size:12px;color:#0f172a;background:#ffffff;text-decoration:none}
a.msd-chip:hover{border-color:#1d4ed8;color:#1d4ed8}
@media (max-width:820px){.msd{grid-template-columns:1fr}.msd-rail{border-right:0;border-bottom:1px solid #f1f5f9}.sd-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.msd-posts{grid-template-columns:repeat(2,minmax(0,1fr))}.sd-two{grid-template-columns:1fr}}
</style>`;
const SD_TINT={blue:['#eff6ff','#1d4ed8'],violet:['#eff6ff','#6d28d9'],rose:['#fdf2f8','#be185d'],green:['#f0fdf4','#15803d'],amber:['#fffbeb','#c2410c'],indigo:['#eff6ff','#1d4ed8'],slate:['#f1f5f9','#0f172a']};
const sdIco=(ico,t)=>`<span class="sd-ico" style="background:${SD_TINT[t][0]};color:${SD_TINT[t][1]}">${discSvg(ico,15)}</span>`;
function msdHTML(c){
  const m=mx(c), ev=m.auth!=null, bf=bfScore(c);
  const real=creatorActivity(c).posts.slice().sort((x,y)=>String(y.date).localeCompare(String(x.date)));
  const recent=real.slice(0,3);
  const r=discRng(discSeedRepo('msd'+c.id));
  const female=Math.round(38+r()*34);
  const ages=[['13–17',3+r()*5],['18–24',20+r()*15],['25–34',30+r()*12],['35–44',12+r()*10],['45+',4+r()*8]];
  const tot=ages.reduce((a,x)=>a+x[1],0); const agesP=ages.map(([l,v])=>[l,Math.round(v/tot*100)]);
  const others=MY_CITIES.filter(x=>x!==m.state);
  const geo=[[m.state||'—',42],[others[0]||'—',27],[others[1]||'—',15]];
  const months=['Jun','Jul','Aug','Sep','Oct','Nov'];
  const base=c.views||1000;
  const vals=months.map(()=>base*(0.6+r()*0.9));
  const vmax=Math.max(...vals);
  const bars=vals.map((v,i)=>{const bw=26,gap=(280-6*bw)/5,x=10+i*(bw+gap),h=Math.max(6,Math.round(v/vmax*72)),y=94-h;return `<rect x="${x.toFixed(1)}" y="${y}" width="${bw}" height="${h}" rx="7" fill="${i===5?'#1d4ed8':'#dbeafe'}"/><text x="${(x+bw/2).toFixed(1)}" y="${y-5}" text-anchor="middle" font-size="9" font-weight="600" fill="#0f172a">${fmt(Math.round(v))}</text><text x="${(x+bw/2).toFixed(1)}" y="112" text-anchor="middle" font-size="10" fill="#0f172a">${months[i]}</text>`;}).join('');
  const chart=`<svg viewBox="0 0 300 120" width="100%" role="img" aria-label="Views by month, sample data">${bars}</svg>`;
  const f=female, donut=`<svg viewBox="0 0 36 36" width="92" height="92" aria-hidden="true"><circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" stroke-width="4"/><circle cx="18" cy="18" r="15.9" fill="none" stroke="#1d4ed8" stroke-width="4" stroke-linecap="round" stroke-dasharray="${f} ${100-f}" stroke-dashoffset="25"/><text x="18" y="20.5" text-anchor="middle" font-size="7" font-weight="700" fill="#0f172a">${f}%</text></svg>`;
  const ageBars=agesP.map(([l,v])=>`<div class="msd-bar"><span>${esc(l)}</span><i><em style="width:${v}%;background:#6d28d9"></em></i><span>${v}%</span></div>`).join('');
  const geoBars=geo.map(([l,v])=>`<div class="msd-bar"><span>${esc(l)}</span><i><em style="width:${v}%;background:#15803d"></em></i><span>${v}%</span></div>`).join('');
  const cpk=(m.cost&&c.views)?'₹'+Math.round(m.cost/c.views*1000):'—';
  const camps=campsOfCreatorAll(c.id);
  const plats=(c.platforms&&c.platforms.length?c.platforms:['Instagram']);
  const pl=sheetPlat(c);
  const stat=(ico,t,l,v,sub,pend)=>`<div class="sd-stat"><div class="sd-stat-h">${sdIco(ico,t)}<span>${l}</span></div><b class="${pend?'is-pend':''}">${v}${sub?`<small>${sub}</small>`:''}</b>${pend?'<em>Needs evaluation</em>':''}</div>`;
  const stats=`<div class="sd-stats">${stat(SH_I.users,'blue','Followers',fmt(c.followers))}${stat(SH_I.spark,'rose','Engagement',m.engagement+'%')}${stat(SH_I.eye,'violet','Avg views',fmt(c.views))}${ev?stat(SH_I.check,'green','Authenticity',m.auth,'/100'):stat(SH_I.check,'green','Authenticity','—',null,true)}${ev?stat(SH_I.award,'indigo','Brand fit',bf,'/100'):stat(SH_I.award,'indigo','Brand fit','—',null,true)}${stat(SH_I.coin,'amber','Latest cost',m.cost?rupees(m.cost):'—')}</div>`;
  const verdict=ev
    ?`<div class="sd-verdict"><div class="msd-h" style="margin:0"><span>AI verdict</span>${aiVerdictPill(c)}</div><ul><li>Engagement ${m.engagement}% for a ${esc(c.tier)} creator</li><li>Authenticity ${m.auth}/100 · Brand fit ${bf}/100</li><li>About ${cpk} per 1K views at the latest cost</li></ul></div>`
    :`<div class="sd-verdict"><div class="msd-h" style="margin:0"><span>AI verdict</span><small>Needs data</small></div><ul><li>Evaluate this creator to see authenticity, brand fit and a recommendation.</li></ul></div>`;
  const postTiles=recent.length
    ?`<div class="msd-posts">${recent.map(p=>`<div class="msd-post"><div class="m"><i>${esc(p.kind||'Post')}</i></div><p><b>${fmt(p.views||0)} views</b>${esc(p.campaign||'')}</p></div>`).join('')}</div>`
    :'<p class="msd-empty">No campaign posts yet.</p>';
  const campStatus=st=>{const k=String(st||'').toLowerCase(); return `<span class="msd-st ${k==='active'?'is-active':k==='completed'?'is-done':'is-other'}">${esc(st||'')}</span>`;};
  const campList=camps.length
    ?camps.map(x=>`<button type="button" class="msd-camp" onclick="closeLayer();openCampaign('${x.id}')"><span>${esc(x.name)}</span>${campStatus(x.status)}</button>`).join('')
    :'<p class="msd-empty">Not in any campaign yet.</p>';
  const rail=`<div><h5 class="msd-h">Relationship</h5><div class="sd-card" style="padding:12px 14px"><div class="msd-plat" style="border:0;padding:0"><span><b>${esc(m.status||'—')}</b><small>Status</small></span></div><div class="msd-plat" style="border:0;padding:8px 0 0"><span><b>${esc(m.owner||'Unassigned')}</b><small>SPOC</small></span></div></div></div>
    <div><h5 class="msd-h">Profiles</h5>${plats.map(pf=>`<div class="msd-plat">${pf==='Instagram'?`<span class="sd-ico" style="background:#fdf2f8;color:#be185d">${SOC_SVG.ig}</span>`:sdIco(SH_I.ext,'blue')}<span><b>${esc(pf)}</b><small>${esc(c.handle)}</small></span></div>`).join('')}</div>
    <div><h5 class="msd-h">Collaborations <small>${camps.length}</small></h5><div class="msd-chips">${camps.length?camps.slice(0,6).map(x=>`<button type="button" class="msd-chip" onclick="closeLayer();openCampaign('${x.id}')">${esc(x.name)}</button>`).join(''):'<span class="msd-empty" style="padding:0">None yet</span>'}</div></div>
    <div><h5 class="msd-h">Links</h5><a class="msd-chip" href="${pl.url}" target="_blank" rel="noopener">Visit ${esc(pl.name)} ${discSvg(SH_I.ext,12)}</a></div>`;
  const main=`<div class="msd-main">${stats}${verdict}
    <section><h5 class="msd-h">Views trend <small>Sample data</small></h5><div class="sd-card">${chart}</div></section>
    <section><h5 class="msd-h">Recent posts <small>${real.length} total</small></h5>${postTiles}</section>
    <section><h5 class="msd-h">Audience <small>Sample data</small></h5><div class="sd-two"><div class="sd-card"><div class="sd-donut"><div>${donut}</div><div class="sd-donut-l"><span><i class="sd-dot" style="background:#1d4ed8"></i>Female ${f}%</span><span><i class="sd-dot" style="background:#dbeafe"></i>Male ${100-f}%</span></div></div></div><div class="sd-card">${ageBars}</div></div><div class="sd-card" style="margin-top:12px"><h6 class="msd-h" style="margin:0 0 4px">Top locations</h6>${geoBars}</div></section>
    <section><h5 class="msd-h">Campaigns with Plix <small>${camps.length}</small></h5><div class="sd-card" style="padding:4px 16px">${campList}</div></section></div>`;
  return `${MSD_CSS}<div class="msd"><aside class="msd-rail">${rail}</aside>${main}</div>`;
}
function openCreatorSide(id){
  const c=DISC.find(x=>x.id===id); if(!c) return; S.cqFromMy=false;
  const m=mx(c);
  const extra=sheetSocialHTML(c)+`<span class="qv-action-add">${addToMenuHTML(c.id,isInMy(c.id))}</span><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="blacklistCreator('${c.id}')">Blacklist</button><button class="ds-btn ds-btn--ghost ds-btn--sm qv-open" onclick="closeLayer();openMyCreator('${c.id}')">Open full profile ↗</button>`;
  openDrawer(`${dsAv(c.id,c.name).replace('class="ds-avatar"','class="ds-avatar cq-hav"')}<span>${esc(c.name)}</span><span class="cq-hstatus"><i></i>${esc(m.status)}</span>`,`${esc(c.handle)} · ${esc(m.state)} · ${esc(c.tier)}`,msdHTML(c),isEvaluatedCreator(c)?extra:sheetSocialHTML(c)+unevaluatedExtra(c));
  const d=document.querySelector('#layer .ds-drawer'); if(d) d.classList.add('ds-drawer--side','cq-drawer');
}

function openMyQuick(id){
  const c=DISC.find(x=>x.id===id); if(!c) return;
  S.cqFromMy=true;
  const m=mx(c);
  const extra=`<button class="ds-btn ds-btn--ghost ds-btn--sm qv-open" onclick="closeLayer();openMyCreator('${c.id}')">Open profile</button>`;
  openDrawer(`${dsAv(c.id,c.name).replace('class="ds-avatar"','class="ds-avatar cq-hav"')}<span>${esc(c.name)}</span>`,`${esc(c.handle)} · ${esc(m.state)} · ${esc(c.tier)}`,msdHTML(c),extra);
  const d=document.querySelector('#layer .ds-drawer'); if(d) d.classList.add('ds-drawer--side','cq-drawer');
}
function toggleMySel(id,on){ S.mySel=on?[...new Set([...S.mySel,id])]:S.mySel.filter(x=>x!==id); paintBody(); }
function setMy(k,v){ S[k]=v; paintBody(); }
function setMyQ(v){ S.myQ=v; paintBody(); const i=document.querySelector('.ds-toolbar input'); if(i){ i.focus(); i.setSelectionRange(v.length,v.length); } }
const MYC={cr1:{owner:'Ankit',status:'In discussion',cost:5000,auth:93,engagement:62.24,hist:1},cr2:{owner:'Karan',status:'Shortlisted',cost:300000,auth:86,engagement:2.9,hist:0},cr3:{owner:'Unassigned',status:'Considering',cost:3500,auth:null,engagement:4.2,hist:0},cr4:{owner:'Ankit',status:'Collaborated',cost:25000,auth:91,engagement:4.8,hist:1},cr5:{owner:'Karan',status:'Considering',cost:120000,auth:95,engagement:3.7,hist:0},cr6:{owner:'Unassigned',status:'Considering',cost:50000,auth:94,engagement:0.11,hist:0},cr7:{owner:'Karan',status:'Collaborated',cost:210000,auth:88,engagement:2.4,hist:1},cr8:{owner:'Ankit',status:'Collaborated',cost:9500,auth:92,engagement:5.3,hist:1}};
const MY_CITIES=['Mumbai','Delhi','Bangalore','Pune','Chennai','Hyderabad','Kolkata'];
const mx=c=>{const h=avHash(c.id), ov=(S.myCF||{})[c.id]||{};return {owner:'Unassigned',status:'Considering',cost:0,auth:null,engagement:c.engagement??0,hist:0,gender:h%3===0?'M':'F',state:MY_CITIES[h%MY_CITIES.length],...(MYC[c.id]||{}),...(ov.cost!==undefined&&ov.cost!==''?{cost:Number(ov.cost)||0}:{})};};
/* ════════ Shared components from the design-system screenshots ════════ */
const dsPageHead=({title,beta=false,desc='',actions=''})=>`<div class="ds-head"><div><h1 class="ds-page-title">${title}${beta?'<span class="ds-beta">BETA</span>':''}</h1>${desc?`<p class="ds-page-desc">${desc}</p>`:''}</div><div class="ds-actions">${actions}</div></div>`;
const dsSortTh=(label,num=false)=>`<th class="${num?'ds-num':''}"><span class="ds-sort">${label}<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 15 5 5 5-5M7 9l5-5 5 5"/></svg></span></th>`;
const OV_PATHS={users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-4-6.3"/>',shield:'<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="m9 12 2 2 4-4"/>',layers:'<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2-4.5-4.4 6.2-.9z"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>'};
const dsOverview=(title,stats)=>`<details class="ds-card ds-overview" open><summary><span class="ds-ov-chev">${discSvg('<path d="m6 9 6 6 6-6"/>',16)}</span><span class="ds-ov-title">${title}</span><span class="ds-ov-mini">${stats.map(s=>`<span class="ds-ov-mini-item"><span class="ds-ov-mini-ico">${discSvg(OV_PATHS[s.ico||'target'],14)}</span><b>${s.value}</b>${s.of?`<small>${s.of}</small>`:''}</span>`).join('')}</span></summary><div class="ds-ov-grid">${stats.map(s=>`<div class="ds-ov-stat"><span class="ds-ov-label"><span class="ds-ov-mini-ico">${discSvg(OV_PATHS[s.ico||'target'],14)}</span>${s.label}</span><span class="ds-ov-val">${s.value}${s.of?` <small>${s.of}</small>`:''}</span>${s.sub?`<span class="ds-caption">${s.sub}</span>`:''}</div>`).join('')}</div></details>`;
const dsPager=total=>{const shown=Math.min(50,total);return `<div class="ds-pager"><span class="ds-caption">Rows: <b>${shown}</b></span><span class="ds-caption">Showing 1–${shown} of ${total}</span><span class="ds-pager-nav"><button class="ds-iconbtn" disabled aria-label="Previous page">‹</button><button class="ds-pg is-on" aria-current="page">1</button><button class="ds-iconbtn" ${total<=shown?'disabled':''} aria-label="Next page">›</button></span></div>`};
const dsContentCard=(c,added)=>`<article class="ds-cc">
  <header class="ds-cc-head"><span class="ds-cc-plat" aria-hidden="true">${esc(c.source.slice(0,2).toUpperCase())}</span><span class="ds-cc-name"><button class="ds-namebtn" onclick="openCreatorSide('${c.id}')">${esc(c.name)}</button></span><span class="ds-cc-acts">${added?'<span class="disc-added">Added</span>':`<button class="ds-iconbtn" aria-label="Add ${esc(c.name)} to My creators" onclick="addDisc('${c.id}')">${icon('plus','ico-sm')}</button>`}<button class="ds-iconbtn" aria-label="Open ${esc(c.name)} profile" onclick="openCreatorSide('${c.id}')">${icon('user','ico-sm')}</button></span></header>
  <div class="ds-cc-media" style="${pastelStyle(c.id)}"><span class="ds-cc-dur">${fmt(c.views)} views</span><span class="ds-cc-tag">${esc(c.tier)}</span><span class="ds-cc-bar">${icon('play','ico-sm')}<i></i><span>${fmt(c.likes)} likes</span></span></div>
  <div class="disc-cats" style="padding:0 12px 8px">${catChips(c)}</div><footer class="ds-cc-foot"><span class="ds-caption">${esc(c.handle)}</span>${dsBadge(c.source)}</footer></article>`;
const dsCb=(name,checked=false,onchange='')=>`<td class="ds-cb"><input type="checkbox" aria-label="Select ${esc(name)}" ${checked?'checked':''} ${onchange?`onchange="${onchange}"`:''}></td>`;
const dsRowIcons=items=>`<span class="ds-row-icons">${items.map(i=>`<button type="button" class="${i.danger?'is-danger':''}" title="${esc(i.label)}" aria-label="${esc(i.label)}" onclick="${i.go}">${icon(i.ic,'ico-sm')}</button>`).join('')}</span>`;
const dsStatus=t=>{const map={'In Progress':'info','Pending':'warn','Delivered':'success','Active':'success','Completed':'info','Cancelled':'danger','Draft':'outline','Shortlisted':'success','Considering':'warn','In discussion':'info','Collaborated':'success','Not contacted':'outline','Self':'success','Competitor':'warn','Inspiration':'info'};return dsBadge(t,map[t]||'outline')};
/* ── My creators: column component (show/hide, reorder, custom columns) ── */
const MY_DEFAULT_COLS=['niche','followers','views','cost','er','brandfit','authenticity','verdict','content','strategy','status','evaluate','region','dealtier','shortlists','campaigns','added','medianViews','expCpv','bestViews','bestCpv','consistency','momentum','tags'];
const MY_EXTRA_COLS=['tier','gender','state','cpv','ongoing','spoc','score'];
const myEval=c=>{ const rng=discRng(discSeedRepo('content'+c.id)); const total=17+Math.floor(rng()*190); const m=mx(c); return {total,analysed:m.auth!=null?total:0}; };
const myAddedAgo=c=>['2mo ago','5w ago','3w ago','1w ago'][avHash(c.id)%4];
const myLink=(label,fn)=>`<button type="button" class="my-link" onclick="event.stopPropagation();${fn}">${label}</button>`;
const MY_COL_LABEL={tags:'Tags',niche:'Niche',medianViews:'Median views',expCpv:'Expected CPV',bestViews:'Best case views',bestCpv:'Best case CPV',consistency:'Consistency',momentum:'Momentum',verdict:'AI verdict',views:'Avg views',launch:'Launch',brandfit:'Brand Fit',evaluate:'Evaluate',region:'Region',dealtier:'Deal Tier',followers:'Followers',tier:'Tier',gender:'Gender',state:'State',cost:'Cost',cpv:'CPV',er:'Engagement',authenticity:'Authenticity',content:'Content',strategy:'Strategy Report',added:'Added',campaigns:'Campaigns',shortlists:'In lists',ongoing:'Ongoing campaigns',spoc:'SPOC',score:'Score',status:'Status'};
const MY_COL_NUM=new Set(['views','followers','cost','cpv','er','score','ongoing','medianViews','expCpv','bestViews','bestCpv','momentum']);
function ensureMyCols(){ if(S.myCols&&!S.myCols.some(c=>c.key==='tags')) S.myCols=[...S.myCols,{key:'tags',on:true}]; if(!S.myCols){ S.myCols=[...MY_DEFAULT_COLS.map(k=>({key:k,on:true})),...MY_EXTRA_COLS.map(k=>({key:k,on:false}))]; S.myCustom={}; S.myCF={}; } }
/* Lists a creator belongs to (any list they were added to, via Add to list) */
const listsOfCreator=id=>CAMP_PLANS.filter(p=>(p.creators||[]).includes(id));
const campsOfCreatorAll=id=>CAMP_LIST.filter(c=>(c.creatorIds||[]).includes(id));
/* Chips: first two names, then +N with a hover tooltip listing the rest */
function myChipsHTML(names,empty,kind=''){
  if(!names.length) return `<span class="ds-table-meta">${esc(empty)}</span>`;
  const shown=names.slice(0,2).map(n=>`<span class="my-list-tag${kind?' is-'+kind:''}">${esc(n)}</span>`).join(''), rest=names.slice(2);
  return `<span class="my-lists">${shown}${rest.length?`<span class="my-chip-more" tabindex="0" aria-label="${esc(rest.join(', '))}">+${rest.length}<span class="my-chip-tip" role="tooltip">${rest.map(n=>`<span>${esc(n)}</span>`).join('')}</span></span>`:''}</span>`;
}
const campsOfCreator=id=>CAMP_LIST.filter(c=>c.status==='Active'&&(c.creatorIds||[]).includes(id)).map(c=>c.name);
const hoverCount=(items,title)=>`<span class="ds-hcount" tabindex="0" data-title="${esc(title)}" data-items="${esc(items.join('|'))}">${items.length}</span>`;
const myColLabel=k=>(S.myLabelOv&&S.myLabelOv[k])||MY_COL_LABEL[k]||(S.myCustom[k]&&S.myCustom[k].label)||k;
const bfScore=c=>{let h=7; for(const ch of String(c.id)) h=(h*31+ch.charCodeAt(0))|0; return 52+Math.abs(h)%45;};
function brandFitCell(c){ const v=bfScore(c), t=v>=80?'good':v>=65?'mid':'low'; return `<span class="bf-score is-${t}"><i></i>${v}<small>/100</small></span>`; }
function aiVerdictOf(c){ const m=mx(c); if(m.auth==null) return 'Needs data'; const sc=Math.round((m.auth+bfScore(c))/2); return sc>=75?'Strong fit':sc>=60?'Consider':'Avoid'; }
function aiVerdictPill(c){ const v=aiVerdictOf(c), k=v.toLowerCase().replace(/[^a-z]+/g,'-'); return `<span class="ai-verdict is-${k}"><i aria-hidden="true"></i>${v}</span>`; }

const MY_GROUPS=[
 {id:'expected',label:'Expected · median',cols:['medianViews','expCpv'],sum:'medianViews'},
 {id:'best',label:'Best case · P75',cols:['bestViews','bestCpv','consistency','momentum'],sum:'bestViews'}
];
function myDepth(c){
  const r=discRng(discSeedRepo('depth'+c.id)), cost=mx(c).cost||0, views=c.views||0;
  const medianViews=Math.round(views*(0.85+r()*0.3)), posts=4+Math.floor(r()*9);
  const bestViews=Math.round(views*(1.15+r()*0.6));
  const cons=+(1+r()*2.4).toFixed(1), mom=Math.round(-80+r()*130);
  const spark=Array.from({length:6},()=>r());
  return {cost,medianViews,posts,expCpv:cost&&medianViews?cost/medianViews:null,bestViews,bestCpv:cost&&bestViews?cost/bestViews:null,cons,mom,spark};
}
function myCostCell(v){ return v==null?'<span class="my-plain is-muted">Add cost</span>':`<span class="my-plain"><b>₹${v.toFixed(2)}</b></span>`; }
function sparkSvg(vals){ const w=64,h=20; const pts=vals.map((v,i)=>`${(i*w/(vals.length-1)).toFixed(1)},${(h-2-v*(h-4)).toFixed(1)}`).join(' '); return `<svg class="mom-spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`; }
function myGrpToggle(id){ const g={...(S.myGrp||{})}; g[id]=!g[id]; S.myGrp=g; paintBody(); }
function myViewItems(cols){
  const out=[];
  cols.forEach(col=>{
    const g=MY_GROUPS.find(x=>x.cols.includes(col.key));
    if(!g){ out.push({key:col.key}); return; }
    if(!(S.myGrp||{})[g.id]){ if(col.key===g.sum) out.push({key:col.key,grp:g,collapsed:true}); return; }
    const firstKey=g.cols.find(k=>cols.some(c=>c.key===k));
    out.push({key:col.key,grp:g,first:col.key===firstKey});
  });
  return out;
}
function myHeadHTML(it){
  const lab=esc(myColLabel(it.key)), ico=discSvg(myColIco(it.key),15);
  const chev=d=>discSvg(d?'<path d="m6 9 6 6 6-6"/>':'<path d="m9 6 6 6-6 6"/>',14);
  if(it.collapsed) return `<button type="button" class="my-grp-btn" aria-expanded="false" onclick="myGrpToggle('${it.grp.id}')">${chev(false)}${esc(it.grp.label)}</button>`;
  if(it.first) return `<button type="button" class="my-grp-btn" aria-expanded="true" onclick="myGrpToggle('${it.grp.id}')">${chev(true)}${esc(it.grp.label)}</button><span class="my-th">${ico}${lab}</span>`;
  return `<span class="my-th">${ico}${lab}</span>`;
}
function myCellHTML(k,c,m){
  switch(k){
    case 'verdict': return aiVerdictPill(c);
    case 'tags': return tagCellHTML(c.id);
    case 'niche': return `<div class="disc-cats">${catChips(c,2)}</div>`;
    case 'medianViews': { const d=myDepth(c); return `<span class="my-plain"><b>${fmt(d.medianViews)}</b><small>${d.posts} posts</small></span>`; }
    case 'expCpv': return myCostCell(myDepth(c).expCpv);
    case 'bestViews': return fmt(myDepth(c).bestViews);
    case 'bestCpv': return myCostCell(myDepth(c).bestCpv);
    case 'consistency': { const d=myDepth(c), t=d.cons<1.6?['is-ok','Consistent']:d.cons<2.5?['is-warn','Variable']:['is-low','Volatile']; return `<span class="cons-pill ${t[0]}">${t[1]} · ${d.cons.toFixed(1)}×</span>`; }
    case 'momentum': { const d=myDepth(c), cls=d.mom>10?'is-up':d.mom<-10?'is-down':'is-flat', arr=d.mom>10?'▲':d.mom<-10?'▼':'→', sg=d.mom>0?'+':d.mom<0?'−':''; return `<span class="mom ${cls}">${sparkSvg(d.spark)}<b>${arr} ${sg}${Math.abs(d.mom)}%</b></span>`; }
    case 'followers': return fmt(c.followers);
    case 'tier': return esc(c.tier);
    case 'gender': return esc(m.gender);
    case 'state': return esc(m.state);
    case 'cost': return `<input class="ds-cell-input ds-cell-num" type="number" min="0" step="100" aria-label="Cost for ${esc(c.name)}" value="${Number(m.cost)||0}" onclick="event.stopPropagation()" onchange="setMyCF('${c.id}','cost',Math.max(0,Number(this.value)||0));toast('Creator cost saved');paintBody()">`;
    case 'cpv': return c.views>0&&m.cost?'₹'+(m.cost/c.views).toFixed(2):'—';
    case 'er': return m.engagement+'%';
    case 'campaigns': return myChipsHTML(campsOfCreatorAll(c.id).map(x=>x.name),'No campaigns yet','camp');
    case 'shortlists': return myChipsHTML(listsOfCreator(c.id).map(p=>p.name),'Not in a list','list');
    case 'ongoing': return hoverCount(campsOfCreator(c.id),'Ongoing campaigns');
    case 'spoc': return m.owner&&m.owner!=='Unassigned'?`<span class="ds-avatar ds-avatar--sm ds-spoc" style="background:${AV_PAL[avHash(m.owner)%AV_PAL.length]};color:#ffffff" title="${esc(m.owner)}">${esc(initialsOf(m.owner))}</span>`:'<span class="ds-table-meta">—</span>';
    case 'score': { const sc=m.auth; const cls=sc==null?'':sc>=80?' is-ok':sc>=60?' is-warn':' is-low'; return `<span class="ds-score-val${cls}">${sc??'—'}</span>`; }
    case 'status': return `<span class="my-status is-${String(m.status).toLowerCase().replace(/[^a-z]+/g,'-')}">${esc(m.status)}${discSvg('<path d="m6 9 6 6 6-6"/>',14)}</span>`;
    case 'authenticity': {
      if(m.auth==null) return myLink('Evaluate',`toast('Evaluate · demo')`);
      const v=m.auth>=80?dsBadge('Authentic','success'):m.auth>=60?dsBadge('Mixed','warn'):dsBadge('Review','danger');
      const at=m.auth>=80?'good':m.auth>=60?'mid':'low';
      return `<span class="my-auth"><span class="bf-score is-${at}"><i></i>${m.auth}<small>/100</small></span>${v}${myLink('View',`toast('Authenticity report · demo')`)}</span>`;
    }
    case 'content': { const r=myEval(c); return `<span class="my-plain"><b>${r.analysed}</b><small>/${r.total} analysed</small></span>`; }
    case 'strategy': return m.auth==null?myLink('Evaluate',`toast('Evaluate · demo')`):myLink('View Report',`toast('Strategy report · demo')`);
    case 'views': return c.views?fmt(c.views):'—';
    case 'launch': { const v=(S.myCF[c.id]||{}).launch||''; return `<label class="my-date"><span class="${v?'':'is-empty'}">${v?esc(shortDate(v)):'Pick a date'}</span><input type="date" aria-label="Launch for ${esc(c.name)}" value="${esc(v)}" onchange="setMyCF('${c.id}','launch',this.value);paintBody()"></label>`; }
    case 'brandfit': return brandFitCell(c);
    case 'evaluate': { const v=(S.myCF[c.id]||{}).evaluate||'Choose one'; return `<select class="my-select${v==='Choose one'?' is-empty':''}" aria-label="Evaluate for ${esc(c.name)}" onclick="event.stopPropagation()" onchange="setMyCF('${c.id}','evaluate',this.value);paintBody()">${['Choose one','Good fit','Needs review','Not a fit'].map(o=>`<option ${o===v?'selected':''}>${o}</option>`).join('')}</select>`; }
    case 'added': return `<span class="my-added">${myAddedAgo(c)}</span>`;
    default: { const v=(S.myCF[c.id]||{})[k]||''; return `<input class="ds-cell-input" aria-label="${esc(myColLabel(k))} for ${esc(c.name)}" placeholder="Add text" value="${esc(v)}" onchange="setMyCF('${c.id}','${k}',this.value)">`; }
  }
}
function setMyCF(cid,k,v){ S.myCF[cid]=S.myCF[cid]||{}; S.myCF[cid][k]=v; }

const COL_ICO_GRID='<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>';
const COL_ICO_LABEL={
 'account type':'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M14 10h4M14 14h3"/>',
 'category':'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
 'location':'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 'platform':'<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',
 'avg likes':'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
 'found in':'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
 'collabs':'<circle cx="12" cy="12" r="9"/><path d="M8 12l2.5 2.5L16 9"/>',
 'last seen':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 'sync':'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
 'region':'<path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2z"/><path d="M9 3v16M15 5v16"/>',
 'deal tier':'<rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20M16 15h2"/>',
 'content':'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m10 8 6 4-6 4z"/>',
 'in lists':'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
 'campaigns':'<path d="M3 11v2a1 1 0 0 0 1 1h2l6 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a4 4 0 0 1 0 6"/>',
 'ongoing campaigns':'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
 'spoc':'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="m17 11 2 2 4-4"/>',
 'score':'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
 'added':'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>',
 'state':'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 'cpv':'<path d="M3 16a9 9 0 0 1 18 0"/><path d="m12 16 4-4"/>',
 'cost':'<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
 'evaluate':'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
 'authenticity':'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
 'brand fit':'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'
};
const COL_ICO_KEY={
 niche:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
 medianViews:'<path d="M4 20V10M10 20V4M16 20v-6M22 20H2"/>',
 expCpv:COL_ICO_LABEL['cost'],
 bestViews:'<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
 bestCpv:COL_ICO_LABEL['cost'],
 consistency:'<path d="M2 12h4l2-4 3 8 3-8 2 4h6"/>',
 momentum:'<path d="M7 17 17 7M8 7h9v9"/>',
 verdict:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
 followers:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-4-6.3"/>',
 views:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 launch:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 brandfit:COL_ICO_LABEL['brand fit'],
 evaluate:COL_ICO_LABEL['evaluate'],
 region:COL_ICO_LABEL['region'],
 dealtier:COL_ICO_LABEL['deal tier'],
 tier:'<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
 gender:'<circle cx="12" cy="8" r="4"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/>',
 state:COL_ICO_LABEL['state'],
 cost:COL_ICO_LABEL['cost'],
 cpv:COL_ICO_LABEL['cpv'],
 er:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
 campaigns:COL_ICO_LABEL['campaigns'],
 shortlists:COL_ICO_LABEL['in lists'],
 ongoing:COL_ICO_LABEL['ongoing campaigns'],
 spoc:COL_ICO_LABEL['spoc'],
 score:COL_ICO_LABEL['score'],
 status:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m8 12 3 3 5-5"/>',
 authenticity:COL_ICO_LABEL['authenticity'],
 content:COL_ICO_LABEL['content'],
 strategy:'<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',
 added:COL_ICO_LABEL['added']
};
function myColIco(k){ return COL_ICO_KEY[k]||COL_ICO_GRID; }
function myColsToggleBtn(){ return `<button type="button" class="ds-btn ds-btn--outline ds-btn--sm${S.myColsOpen?' is-on':''}" aria-expanded="${!!S.myColsOpen}" onclick="myColsToggle()">${discSvg(COLS_SVG,14)}Columns</button>`; }
function myColsToggle(){ S.myColsOpen=!S.myColsOpen; paintBody(); }
/* Add to list: search and pick one of the shortlists */
function myRowMenu(id,btn){
  const open=S.myRowMenu&&S.myRowMenu.id===id;
  if(open){ S.myRowMenu=null; paintBody(); return; }
  const r=btn.getBoundingClientRect();
  S.myRowMenu={id,x:Math.round(r.right),y:Math.round(r.bottom+6)}; paintBody();
}
/* Direct add to a campaign */
function myRowAct(kind,id){
  if(kind==='plan'){ S.myRowMenu=null; return cpOpen([id]); }
  if(kind==='uncollect'){ S.myRowMenu=null; collectionRemove(S.collectionId,id); return; }
  S.myRowMenu=null; paintBody();
  const c=DISC.find(x=>x.id===id); const who=c?c.name:'Creator';
  const msg={report:'Opening report for '+who,evaluate:'Evaluate '+who+' with options',plan:'Add '+who+' to a campaign',remove:'Remove '+who+' from My creators'}[kind];
  toast(msg+' · demo');
}
function myRowMenuHTML(){
  const m=S.myRowMenu; if(!m) return '';
  const it=(kind,label,ico,cls='')=>`<button type="button" role="menuitem" class="my-menu-item${cls}" onclick="myRowAct('${kind}','${m.id}')">${discSvg(ico,16)}<span>${label}</span></button>`;
  return `<div class="my-menu" role="menu" style="top:${m.y}px;left:${m.x}px">
    ${it('report','View report',OV_PATHS.layers)}
    <div class="my-menu-sep" role="separator"></div>
    ${S.page==='collection'?it('uncollect','Remove from collection','<path d="M18 6 6 18M6 6l12 12"/>'):''}
    ${it('remove','Remove profile','<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',' is-danger')}
  </div>`;
}
/* Keep the Columns list's scroll position and search text when the page re-renders */
function keepColsPanel(fn){
  const l=document.querySelector('.disc-cols-list'), sc=l?l.scrollTop:0;
  const q=document.querySelector('.disc-cols-search input'), qv=q?q.value:'';
  fn();
  const n=document.querySelector('.disc-cols-list'); if(n) n.scrollTop=sc;
  const q2=document.querySelector('.disc-cols-search input');
  if(q2&&qv){ q2.value=qv; discColSearch(qv); }
}
function myColToggle(k){ const c=S.myCols.find(x=>x.key===k); if(c) c.on=!c.on; S.myColsOpen=true; keepColsPanel(()=>paintBody()); }
function myColsPanel(){
  const cols=S.myCols, shown=cols.filter(c=>c.on).length, total=cols.length+1;
  const plus=discSvg('<path d="M12 5v14M5 12h14"/>',14), dots=discSvg('<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',14);
  const pin=discSvg('<path d="M12 17v5M9 3h6l-1 6 3 3H7l3-3-1-6z"/>',14), sliders=discSvg('<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',14);
  return `<div class="disc-cols-pop" role="dialog" aria-label="Columns">
    <div class="disc-cols-head"><div><strong>Columns</strong><span>${shown+1} of ${total} shown · applied as you go</span></div><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="myCfgOpen()">${plus}Add</button></div>
    <div class="disc-cols-search"><input type="search" placeholder="Find a column" aria-label="Find a column" oninput="discColSearch(this.value)"></div>
    <ul class="disc-cols-list">
      <li class="disc-col-row is-locked" data-name="creator"><span class="disc-col-drag" aria-hidden="true"></span><input type="checkbox" checked disabled aria-label="Creator"><span class="disc-col-ico" aria-hidden="true">${discSvg(DISC_COL_PATHS.creator)}</span><span class="disc-col-name">Creator</span><span class="disc-col-lock" aria-label="Pinned">${pin}</span></li>
      ${cols.map(c=>`<li class="disc-col-row" data-name="${esc(myColLabel(c.key).toLowerCase())}"><span class="disc-col-drag" aria-hidden="true">${dots}</span><input type="checkbox" ${c.on?'checked':''} onchange="myColToggle('${c.key}')" aria-label="Show ${esc(myColLabel(c.key))}"><span class="disc-col-ico" aria-hidden="true">${discSvg(myColIco(c.key))}</span><span class="disc-col-name">${esc(myColLabel(c.key))}</span></li>`).join('')}
    </ul>
    <div class="disc-cols-foot"><button type="button" class="ds-btn ds-btn--ghost ds-btn--sm" onclick="myCfgOpen()">${sliders}Configure columns</button></div>
  </div>`;
}
/* Configure columns dialog for My creators */
function myCfgOpen(){
  ensureMyCols();
  S.myColsOpen=false; S.myCfgOpen=true;
  S.myCfgDraft={order:S.myCols.map(c=>c.key),on:Object.fromEntries(S.myCols.map(c=>[c.key,c.on])),labels:{...(S.myLabelOv||{})},custom:Object.keys(S.myCustom||{}).map(k=>({key:k,label:S.myCustom[k].label})),sel:null,drag:null};
  paintBody();
}
function myCfgClose(){ S.myCfgOpen=false; S.myCfgDraft=null; paintBody(); }
function myCfgDone(){
  const d=S.myCfgDraft;
  S.myCols=d.order.map(k=>({key:k,on:d.on[k]!==false}));
  S.myCustom=Object.fromEntries(d.custom.map(c=>[c.key,{label:c.label}]));
  S.myLabelOv=d.labels;
  myCfgClose();
}
function myCfgLabel(d,k){ const c=d.custom.find(x=>x.key===k); return c?c.label:(MY_COL_LABEL[k]||k); }
function myCfgSelect(k){ S.myCfgDraft.sel=k; discRepaint(); }
function myCfgToggle(k){ const d=S.myCfgDraft; d.on={...d.on,[k]:d.on[k]===false}; discRepaint(); }
function myCfgRename(k,v){ const d=S.myCfgDraft; const t=(v||'').trim(); if(d.custom.some(c=>c.key===k)) d.custom=d.custom.map(c=>c.key===k?{...c,label:t||'New column'}:c); else d.labels={...d.labels,[k]:t}; const r=document.querySelector(`.disc-cfg-row[data-id="${k}"] .disc-cfg-name`); if(r) r.textContent=t||myCfgLabel(d,k); }
function myCfgDelete(k){ const d=S.myCfgDraft; d.custom=d.custom.filter(c=>c.key!==k); d.order=d.order.filter(x=>x!==k); d.sel=null; discRepaint(); }
function myCfgNew(){ const d=S.myCfgDraft; const k='cf'+Date.now(); d.custom=[...d.custom,{key:k,label:'New column'}]; d.order=[...d.order,k]; d.on={...d.on,[k]:true}; d.sel=k; discRepaint(); }
function myCfgDrag(k){ S.myCfgDraft.drag=k; }
function myCfgDrop(target){ const d=S.myCfgDraft; if(!d.drag||d.drag===target){ d.drag=null; return; } const ord=d.order.filter(x=>x!==d.drag); ord.splice(ord.indexOf(target),0,d.drag); d.order=ord; d.drag=null; discRepaint(); }
function myCfgHTML(){
  const d=S.myCfgDraft;
  const items=d.order.map(k=>({k,label:myCfgLabel(d,k),on:d.on[k]!==false,custom:d.custom.some(c=>c.key===k)}));
  const shown=items.filter(i=>i.on).length+1;
  const sel=items.find(i=>i.k===d.sel)||null;
  const dots=discSvg('<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',14);
  const pin=discSvg('<path d="M12 17v5M9 3h6l-1 6 3 3H7l3-3-1-6z"/>',14), plus=discSvg('<path d="M12 5v14M5 12h14"/>',14);
  const row=i=>`<li class="disc-cfg-row${d.sel===i.k?' is-sel':''}" draggable="true" data-id="${i.k}" ondragstart="myCfgDrag('${i.k}')" ondragover="event.preventDefault()" ondrop="event.preventDefault();myCfgDrop('${i.k}')" onclick="myCfgSelect('${i.k}')">
      <span class="disc-cfg-grip" aria-hidden="true">${dots}</span>
      <input type="checkbox" ${i.on?'checked':''} onclick="event.stopPropagation()" onchange="myCfgToggle('${i.k}')" aria-label="Show ${esc(i.label)}">
      <span class="disc-cfg-ico" aria-hidden="true">${discSvg(i.custom?'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>':myColIco(i.k))}</span>
      <span class="disc-cfg-name">${esc(i.label)}</span></li>`;
  const sep='<li class="disc-cfg-sep" aria-hidden="true"></li>';
  const creatorRow=`<li class="disc-cfg-row is-locked"><span class="disc-cfg-grip" aria-hidden="true"></span><input type="checkbox" checked disabled aria-label="Creator"><span class="disc-cfg-ico" aria-hidden="true">${discSvg(DISC_COL_PATHS.creator)}</span><span class="disc-cfg-name">Creator</span><span class="disc-cfg-pin">${pin}</span></li>${sep}`;
  const editor=sel?`<div class="disc-cfg-editor">
      <h4>${esc(sel.label)}</h4>
      <label class="disc-cfg-field"><span>Name</span><input value="${esc(sel.label)}" oninput="myCfgRename('${sel.k}',this.value)"></label>
      <label class="disc-cfg-check"><input type="checkbox" ${sel.on?'checked':''} onchange="myCfgToggle('${sel.k}')"><span>Show in table</span></label>
      ${sel.custom?`<button type="button" class="ds-btn ds-btn--ghost ds-btn--sm disc-cfg-del" onclick="myCfgDelete('${sel.k}')">Delete column</button>`:''}
    </div>`:`<div class="disc-cfg-empty">
      <span class="disc-cfg-empty-ico">${discSvg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>',22)}</span>
      <strong>Select a column to edit</strong>
      <p>Rename it, hide it, or see what the table has fixed in place.</p>
      <button type="button" class="ds-btn ds-btn--outline" onclick="myCfgNew()">${plus}New column</button>
    </div>`;
  return `<div class="disc-cfg-scrim" onclick="if(event.target===this)myCfgClose()">
    <div class="disc-cfg" role="dialog" aria-modal="true" aria-label="Configure columns">
      <div class="disc-cfg-head"><div><h3>Configure columns</h3><p>Reorder them, hide the ones you don't need, and make columns of your own.</p></div><button type="button" class="ds-iconbtn" aria-label="Close" onclick="myCfgClose()">&times;</button></div>
      <div class="disc-cfg-split">
        <div class="disc-cfg-list">
          <div class="disc-cfg-listhead"><div><strong>Columns</strong><span>${shown} of ${items.length+1} shown</span></div><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="myCfgNew()">${plus}New column</button></div>
          <ul>${creatorRow}${items.map(row).join('')}</ul>
        </div>
        <div class="disc-cfg-edit">${editor}</div>
      </div>
      <div class="disc-cfg-foot"><button type="button" class="ds-btn ds-btn--ghost" onclick="myCfgClose()">Cancel</button><button type="button" class="ds-btn ds-btn--primary" onclick="myCfgDone()">Done</button></div>
    </div></div>`;
}
const MY_FILTER=(k,label,arr,val)=>`<label class="ds-filter${val!=='All'?' is-active':''}"><span>${val!=='All'?esc(val):label}</span><select aria-label="${label}" onchange="setMy('${k}',this.value)">${['All',...arr].map(x=>`<option value="${esc(x)}" ${x===val?'selected':''}>${esc(x)}</option>`).join('')}</select>${val!=='All'?`<button class="ds-filter-x" aria-label="Clear ${label}" onclick="event.preventDefault();setMy('${k}','All')">×</button>`:''}</label>`;
/* ── Bulk actions: one toolbar button, one modal with a step per action ── */
const BULK_OPTS=[
  {k:'score',t:'Generate score',d:'Authenticity score for each creator. Runs one job per creator.',ico:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'},
  {k:'fit',t:'Brand fit',d:'Score each creator’s content against your brand profile.',ico:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'},
  {k:'remove',t:'Remove',d:'Take these creators out of My creators.',ico:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',danger:true}
];
const bulkSelected=()=>S.mySel.map(id=>DISC.find(c=>c.id===id)).filter(Boolean);
function bulkBarHTML(){
  const sel=bulkSelected(), n=sel.length, hist=sel.filter(c=>mx(c).hist>0).length;
  const btn=o=>`<button type="button" class="bb-btn${o.danger?' is-danger':''}" onclick="bulkRun('${o.k}')">${discSvg(o.ico,15)}${o.t}</button>`;
  return `<div class="bulk-bar" role="region" aria-label="Selection actions"><div class="bb-l"><b>${n} creator${n===1?'':'s'} selected</b><span>${hist} with collaboration history</span></div><div class="bb-r">${BULK_OPTS.filter(o=>o.k!=='remove').map(btn).join('')}${mySelAddMenuHTML()}${BULK_OPTS.filter(o=>o.k==='remove').map(btn).join('')}<span class="bb-sep"></span><button type="button" class="bb-clear" onclick="clearMySel()">Clear</button></div></div>`;
}
function bulkRun(k){ S.bulkOpen=true; S.bulkStep=k; paintBody(); }
function clearMySel(){ S.mySel=[]; S.bulkOpen=false; S.bulkStep=null; paintBody(); }
function bulkOpen(){
  if(S.mySel.length<2){ const w=document.querySelector('.bulk-wrap'); if(w){ w.classList.add('is-tip'); clearTimeout(w._t); w._t=setTimeout(()=>w.classList.remove('is-tip'),2200); } return; }
  S.bulkOpen=true; S.bulkStep=null; paintBody();
}
function bulkClose(){ S.bulkOpen=false; S.bulkStep=null; paintBody(); }
function bulkGo(step){ S.bulkStep=step; paintBody(); }
function bulkSet(k,v){ S[k]=v; paintBody(); }
function toggleMyAll(on){ const ids=S.myVisIds||[]; S.mySel=on?[...new Set([...S.mySel,...ids])]:S.mySel.filter(x=>!ids.includes(x)); paintBody(); }
function bulkApply(kind,val){
  const sel=bulkSelected(), n=sel.length;
  if(kind==='status'){ sel.forEach(c=>{ MYC[c.id]={...(MYC[c.id]||{}),status:val}; }); toast(`${n} creator${n>1?'s':''} set to ${val} · demo`); }
  else if(kind==='score'){ toast(`Scoring queued for ${n} creators · demo`); }
  else if(kind==='fit'){ const ready=sel.filter(c=>mx(c).auth!=null).length; toast(`Brand fit queued for ${ready} creator${ready===1?'':'s'} · demo`); }
  else if(kind==='plan'){ const p=CAMP_PLANS.find(x=>x.id===S.bulkPlan); if(p) addToast('Successfully added',`${n} creator${n>1?'s':''} ${n>1?'have':'has'} been successfully added to`,p.name,()=>openPlan(p.id)); else toast(`${n} creator${n>1?'s':''} added to the plan · demo`); }
  else if(kind==='remove'){ S.mySel=[]; toast(`${n} creator${n>1?'s':''} removed from My creators · demo`); }
  S.bulkOpen=false; S.bulkStep=null; paintBody();
}
function bulkModalHTML(){
  const sel=bulkSelected(), n=sel.length, step=S.bulkStep;
  const opt=o=>`<button type="button" class="bulkm-opt${o.danger?' is-danger':''}" onclick="bulkGo('${o.k}')"><span class="bulkm-ico">${discSvg(o.ico,18)}</span><span class="bulkm-txt"><b>${o.t}</b><small>${o.d}</small></span>${discSvg('<path d="m9 6 6 6-6 6"/>',16)}</button>`;
  const title=step?BULK_OPTS.find(o=>o.k===step).t:'Bulk actions';
  const back='';
  const foot=(primary,dis=false,danger=false)=>`<div class="bulkm-foot"><button type="button" class="ds-btn ds-btn--ghost" onclick="bulkClose()">Cancel</button><button type="button" class="ds-btn ${danger?'ds-btn--danger':'ds-btn--primary'}" ${dis?'disabled':''} onclick="bulkApply('${step}',S.bulkStatusVal)">${primary}</button></div>`;
  let body='';
  if(!step){
    body=`<div class="bulkm-list">${BULK_OPTS.map(opt).join('')}</div>`;
  } else if(step==='score'){
    const posts=S.bulkPosts||'branded', fresh=!!S.bulkFresh;
    const radio=(k,t,d)=>`<button type="button" role="radio" aria-checked="${posts===k}" class="bulkm-radio${posts===k?' on':''}" onclick="bulkSet('bulkPosts','${k}')"><span class="bulkm-rdot"></span><span><b>${t}</b><small>${d}</small></span></button>`;
    body=`<div class="bulkm-note is-ok"><span class="bulkm-check">${discSvg('<path d="m5 12 5 5 9-10"/>',14)}</span><span><b>${n} creator${n>1?'s':''}</b> ready to score</span></div>
      <div class="bulkm-card"><div class="bulkm-card-h"><b>Posts to read</b><small>Picked for each creator by a strategy, up to the workspace limit.</small></div>
        ${radio('branded','Branded posts first','Prioritise sponsored and partnership posts, then fill with high engagement.')}
        ${radio('recent','Recent high engagement','Most recent posts, sorted by engagement.')}</div>
      <div class="bulkm-card bulkm-row"><div><b>Fetch fresh data</b><small>Reuses what was fetched in the last week.</small></div>
        <button type="button" role="switch" aria-checked="${fresh}" class="bulkm-switch${fresh?' on':''}" aria-label="Fetch fresh data" onclick="bulkSet('bulkFresh',${!fresh})"><span></span></button></div>
      <p class="bulkm-hint">Scoring needs each creator’s strategy report. It generates on its own after the sync.</p>`;
    body+=foot(`${discSvg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',15)}Score ${n} creator${n>1?'s':''}`);
    return bulkWrap(title,n,back,body,'');
  } else if(step==='fit'){
    const skipped=sel.filter(c=>mx(c).auth==null), ready=n-skipped.length, obj=S.bulkObj||null;
    const chip=k=>`<button type="button" class="bulkm-chip${obj===k?' on':''}" aria-pressed="${obj===k}" onclick="bulkSet('bulkObj',${obj===k?'null':`'${k}'`})">${k}</button>`;
    body=`<div class="bulkm-note is-ok"><span class="bulkm-check">${discSvg('<path d="m5 12 5 5 9-10"/>',14)}</span><span><b>${ready} creator${ready===1?'':'s'}</b> ready to score</span></div>`
      +(skipped.length?`<div class="bulkm-note is-warn"><span class="bulkm-check is-warn">${discSvg('<path d="M6 6l12 12M18 6 6 18"/>',14)}</span><span><b>${skipped.length} creator${skipped.length===1?'':'s'}</b> will be skipped<ul>${skipped.map(c=>`<li>${esc(c.handle)} — content analysis not ready</li>`).join('')}</ul></span></div>`:'')
      +`<div class="bulkm-card"><div class="bulkm-card-h"><b>Objective</b><small>Shifts how much each category counts. Leave it unset to weight them as your profile does.</small></div>
        <div class="bulkm-chips">${['Awareness','Engagement','Conversion'].map(chip).join('')}</div></div>
      <div class="bulkm-card"><div class="bulkm-card-h"><b>Topics</b><small>What the creator has to cover, and what rules them out.</small></div>
        <label class="bulkm-field"><span>Must cover</span><input type="text" placeholder="e.g. skincare" aria-label="Must cover"></label></div>`;
    body+=foot(`${discSvg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',15)}Score ${ready} creator${ready===1?'':'s'}`,ready===0);
    return bulkWrap(title,n,back,body,'');
  } else if(step==='plan'){
    S.cpBulk=sel.map(c=>c.id);
    body=`<p class="bulkm-hint bulkm-hint--lg">Add the ${n} selected creator${n>1?'s':''} to a draft or live campaign. You pick the campaign first, then Draft or Live.</p><div class="bulkm-foot"><button type="button" class="ds-btn ds-btn--primary" onclick="bulkClose();cpOpen(S.cpBulk)">Choose campaign</button></div>`;
    return bulkWrap(title,n,back,body,'');
  } else if(step==='status'){
    const st=[['Shortlisted','Shortlist all','M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 21l1.2-6.5L2.5 9.9 9.1 9z'],['Rejected','Reject all','M10 15v4a3 3 0 0 0 3 3l4-9V2H6.7a2 2 0 0 0-2 1.7l-1.4 9A2 2 0 0 0 5.3 15z'],['Added','Reset to Added','M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h9']];
    body=`<div class="bulkm-list">${st.map(([v,t,p])=>`<button type="button" class="bulkm-opt" onclick="bulkApply('status','${v}')"><span class="bulkm-ico">${discSvg(`<path d="${p}"/>`,18)}</span><span class="bulkm-txt"><b>${t}</b><small>Set ${n} creator${n>1?'s':''} to ${v.toLowerCase()}.</small></span></button>`).join('')}</div>`;
    return bulkWrap(title,n,back,body,'');
  } else if(step==='remove'){
    body=`<p class="bulkm-hint bulkm-hint--lg">Remove ${n} creator${n>1?'s':''} from My creators. You can add them back from Discover.</p>`;
    body+=`<div class="bulkm-foot"><button type="button" class="ds-btn ds-btn--ghost" onclick="bulkClose()">Cancel</button><button type="button" class="ds-btn ds-btn--danger" onclick="bulkApply('remove')">Remove ${n} creator${n>1?'s':''}</button></div>`;
    return bulkWrap(title,n,back,body,'');
  }
  return bulkWrap(title,n,back,body,'');
}
function bulkWrap(title,n,back,body,_){
  return `<div class="disc-cfg-scrim" onclick="if(event.target===this)bulkClose()"><div class="bulkm" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="bulkm-head">${back}<div class="bulkm-title"><h3>${title}</h3><span class="bulkm-count">${n} creator${n===1?'':'s'}</span></div><button type="button" class="ds-iconbtn" aria-label="Close" onclick="bulkClose()">&times;</button></div>
    <div class="bulkm-body">${body}</div></div></div>`;
}
function myCatOk(c){const k=S.myCat||'All'; if(k==='Worked')return mx(c).hist>0; if(k==='Rejected')return mx(c).status==='Rejected'; if(k==='Blacklisted')return (S.blacklisted||[]).includes(c.id); return true;}
function myCatFilterHTML(){
 const base=DISC.filter(c=>!c.repo), cur=S.myCat||'All';
 const opts=[['All','All creators',base.length],['Worked','Worked with us',base.filter(c=>mx(c).hist>0).length],['Rejected','Rejected',base.filter(c=>mx(c).status==='Rejected').length],['Blacklisted','Blacklisted',base.filter(c=>(S.blacklisted||[]).includes(c.id)).length]];
 const cur_l=(opts.find(o=>o[0]===cur)||opts[0])[1];
 return `<label class="ds-filter${cur!=='All'?' is-active':''}"><span>${cur!=='All'?esc(cur_l):'Category'}</span><select aria-label="Category" onchange="setMy('myCat',this.value)">${opts.map(([v,l,n])=>`<option value="${v}" ${v===cur?'selected':''}>${l} (${n})</option>`).join('')}</select>${cur!=='All'?`<button class="ds-filter-x" aria-label="Clear Category" onclick="event.preventDefault();setMy('myCat','All')">×</button>`:''}</label>`;
}
function mySelAddMenuHTML(){
 const n=S.mySel.length, off=n<2;
 return `<details class="ds-more addto-menu"><summary class="ds-btn ds-btn--outline ds-btn--sm${off?' is-disabled':''}" aria-disabled="${off}">Add to ⌄</summary><div class="ds-more-menu" role="menu">
 <button type="button" role="menuitem" onclick="mySelAddDialog('collection')">Collection</button>
  <button type="button" role="menuitem" onclick="mySelAddDialog('campaign')">Campaign</button>
 </div></details>`;
}
function mySelAddDialog(target){
 const sel=bulkSelected(), ids=sel.map(c=>c.id);
 if(ids.length<2)return toast('Select more than 1 creator to access this');
 colBoot();
 const defs={collection:{title:'Add selected creators to collection',label:'Collection',items:CREATOR_COLLECTIONS.map(x=>({id:x.id,name:x.name,meta:`${(x.creatorIds||[]).length} creators`}))},plan:{title:'Add selected creators to campaign plan',label:'Campaign plan',items:CAMP_PLANS.map(x=>({id:x.id,name:x.name,meta:`${planStageOf(x)} · ${x.shortlisted.length} shortlisted`}))},campaign:{title:'Add selected creators to campaign',label:'Campaign',items:CAMP_LIST.map(x=>({id:x.id,name:x.name,meta:`${x.status} · ${(x.creatorIds||[]).length} creators`}))}}[target];
 if(!defs||!defs.items.length)return toast('No matching destination is available');
 const opts=defs.items.map(x=>`<option value="${esc(x.id)}">${esc(x.name)} · ${esc(x.meta)}</option>`).join('');
 dlg(defs.title,`${ids.length} creators selected. Choose where to add them.`,`<label class="ds-field"><span>${defs.label}</span><select id="mySelTargetId">${opts}</select></label>`,`<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="mySelAddApply('${target}',document.getElementById('mySelTargetId').value)">Add ${ids.length} creators</button>`);
}
function mySelAddApply(target,id){
 const ids=bulkSelected().map(c=>c.id); if(!ids.length)return;
 colBoot();
 if(target==='collection'){const c=colOf(id);if(!c)return;c.creatorIds=c.creatorIds||[];ids.forEach(x=>{if(!c.creatorIds.includes(x))c.creatorIds.push(x);});colSave();}
 if(target==='plan'){const p=planOf(id);if(!p)return;p.creators=p.creators||[];ids.forEach(x=>{if(!p.creators.includes(x))p.creators.push(x);});invalidatePlanApproval(p);}
 if(target==='campaign'){const c=campOf(id);if(!c)return;c.creatorIds=c.creatorIds||[];ids.forEach(x=>{if(!c.creatorIds.includes(x))c.creatorIds.push(x);});}
 const n=ids.length; S.mySel=[]; S.bulkOpen=false; closeLayer(); paintBody(); toast(`${n} creators added successfully`);
}
function tierMixText(list){
 const order=['Nano','Micro','Macro','Mega'];
 const parts=order.map(t=>[t,list.filter(c=>c.tier===t).length]).filter(([,k])=>k>0).map(([t,k])=>`${t} ${k}`);
 return parts.length?parts.join(' · '):'No creators yet';
}
function myCardsHTML(list){
  if(!list.length) return '<div class="ds-empty">No matching creators. Try another search or filter.</div>';
  return `<div class="my-card-grid">${list.map(c=>{const m=mx(c), sel=S.mySel.includes(c.id);
    const fact=(l,v)=>`<div><dt>${l}</dt><dd>${v}</dd></div>`;
    return `<article class="my-card${sel?' is-selected':''}" tabindex="0" onclick="openMyQuick('${c.id}')" onkeydown="if(event.key==='Enter')openMyQuick('${c.id}')">
      <div class="my-card-top"><span onclick="event.stopPropagation()"><input type="checkbox" aria-label="Select ${esc(c.name)}" ${sel?'checked':''} onchange="toggleMySel('${c.id}',this.checked)"></span>${dsAv(c.id,c.name)}<div class="my-card-id"><b>${esc(c.name)}</b><span>${esc(c.handle)}</span></div></div>
      <div class="my-card-tags">${tierTag(c.tier)}${aiVerdictPill(c)}<span class="my-status is-${String(m.status).toLowerCase().replace(/[^a-z]+/g,'-')}">${esc(m.status)}</span></div>
      <dl class="my-card-facts">${fact('Followers',fmt(c.followers))}${fact('Avg views',fmt(c.views))}${fact('Engagement',(m.engagement??'—')+'%')}${fact('Cost',m.cost?rupees(m.cost):'—')}${fact('Authenticity',m.auth==null?'Not evaluated':m.auth+'/100')}${fact('Added',esc(myAddedAgo(c)))}</dl>
      <div class="my-card-foot" onclick="event.stopPropagation()">${addToMenuHTML(c.id,true)}<button type="button" class="ds-btn ds-btn--ghost ds-btn--sm" onclick="openMyCreator('${c.id}')">Open profile ↗</button></div>
    </article>`;}).join('')}</div>`;
}
function creatorsListHTML(scopeIds,headHTML){ S.advScope='my';
  ensureMyCols();
  const base=scopeIds?scopeIds.map(id=>crOf(id)).filter(Boolean):DISC.filter(c=>!c.repo);
  const q=S.myQ.toLowerCase().trim();
  const match=c=>{const m=mx(c);return [c.name,c.handle,m.owner,c.tags.join(' ')].join(' ').toLowerCase().includes(q)
    &&(S.myStatus==='All'||m.status===S.myStatus)&&(S.myTier==='All'||c.tier===S.myTier)
    &&(S.myGender==='All'||m.gender===S.myGender)&&(S.myState==='All'||m.state===S.myState)&&(S.mySpoc==='All'||m.owner===S.mySpoc)&&myCatOk(c)&&myAdvMatch(c,S.myAdv);};
  const list=base.filter(match).filter(c=>tagFilterOK('my',c.id));
  const uniq=f=>[...new Set(DISC.map(c=>mx(c)[f]))].filter(Boolean).sort();
  const cols=S.myCols.filter(c=>c.on);
  const items=myViewItems(cols);
  S.myVisIds=list.map(c=>c.id); const allSel=S.myVisIds.length>0&&S.myVisIds.every(id=>S.mySel.includes(id));
  const person=c=>`<div class="ds-person">${dsAv(c.id,c.name)}<div class="ds-person-text"><span class="ds-table-title">${esc(c.name)}</span><span class="ds-table-meta">${esc(c.handle)}</span></div></div>`;
  const rows=list.map(c=>{const m=mx(c);const sel=S.mySel.includes(c.id);
    return `<tr class="is-clickable ${sel?'is-selected':''}" tabindex="0" onclick="openMyQuick('${c.id}')" onkeydown="if(event.key==='Enter')openMyQuick('${c.id}')"><td class="ds-cb" onclick="event.stopPropagation()"><input type="checkbox" aria-label="Select ${esc(c.name)}" ${sel?'checked':''} onchange="toggleMySel('${c.id}',this.checked)"></td><td><div class="my-who">${person(c)}<span class="my-who-acts" onclick="event.stopPropagation()">${dsRowIcons([{ic:'user',label:'Open profile',go:`openCreatorSide('${c.id}')`},{ic:'external',label:'Open full profile',go:`openMyCreator('${c.id}')`}])}</span></div></td>${items.map(it=>`<td class="${MY_COL_NUM.has(it.key)?'ds-num':''}${it.grp?' is-grp':''}">${myCellHTML(it.key,c,m)}</td>`).join('')}<td class="my-act" onclick="event.stopPropagation()"><span onclick="event.stopPropagation()">${addToMenuHTML(c.id,true)}</span><button type="button" class="my-more" aria-label="Actions for ${esc(c.name)}" aria-haspopup="menu" onclick="event.stopPropagation();myRowMenu('${c.id}',this)">${discSvg('<circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/>',16)}</button></td></tr>`;}).join('');
  const heads=items.map(it=>`<th class="${MY_COL_NUM.has(it.key)?'ds-num':''}${it.grp?' is-grp':''}">${myHeadHTML(it)}</th>`).join('');
  return `<div class="ds-page">
    ${headHTML||dsPageHead({title:'My creators',beta:true,desc:'The creators you track, their relationships, costs and campaign history.',actions:`<button class="ds-btn ds-btn--outline" onclick="toast('Export · demo')">${icon('export','ico-sm')}Export</button><button class="ds-btn ds-btn--primary" onclick="openAddDisc()">${icon('plus','ico-sm')}Add creator</button>`})}
    ${dsOverview('Overview',[
      {label:'Creators',ico:'users',value:base.length,sub:scopeIds?'In this collection':'In your workspace'},
      {label:'Evaluated',ico:'shield',value:base.filter(c=>mx(c).hist>0).length,of:'of '+base.length,sub:'With collaboration history'},
      {label:'Campaigns linked',ico:'layers',value:3,sub:'Across active plans'},
      {label:'Avg authenticity',ico:'star',value:'91',of:'/ 100',sub:'Illustrative sample'},...(scopeIds?[{label:'Tier mix',ico:'users',value:tierMixText(base),sub:'Creators by tier in this collection'}]:[])])}
    <div class="ds-toolbar my-tools">
      ${myAdvBtnHTML()}<div class="ds-input"><span class="ds-input-icon">${icon('search','ico-sm')}</span><input aria-label="Search by handle" placeholder="Search by handle" value="${esc(S.myQ)}" oninput="setMyQ(this.value)"></div>
      
      ${myCatFilterHTML()}${MY_FILTER('myStatus','Status',['Added','Considering','Shortlisted','Collaborated','In discussion','Rejected'],S.myStatus)}
      ${MY_FILTER('myTier','Tier',['Nano','Micro','Macro','Mega'],S.myTier)}
      <span class="ds-spacer"></span>${dsViewSeg('myView',[['table','Table'],['cards','Cards']],S.myView||'table')}<button class="ds-btn ds-btn--outline" onclick="autoScoreMy()">${icon('sparkle','ico-sm')}Score unevaluated</button><span class="my-vdiv" aria-hidden="true"></span>
      <span class="disc-cols-wrap">${myColsToggleBtn()}${S.myColsOpen?myColsPanel():''}</span>
    </div>
        ${S.mySel.length?bulkBarHTML():''}
    <div class="disc-split">${S.myAdvOpen?discAdvPanel():''}<div class="disc-main">
    ${S.myView==='cards'?myCardsHTML(list):`<div class="ds-table-wrap my-wrap"><table class="ds-table ds-table--wide ds-table--dense my-table"><thead><tr><th class="ds-cb"><input type="checkbox" aria-label="Select all creators" ${allSel?'checked':''} onchange="toggleMyAll(this.checked)"></th><th><span class="my-th">${discSvg(DISC_COL_PATHS.creator,15)}Creator</span></th>${heads}<th class="my-act-th" aria-label="Actions"></th></tr></thead>
      <tbody>${rows||`<tr><td colspan="${items.length+3}" class="ds-empty">No matching creators. Try another search or filter.</td></tr>`}</tbody></table></div>`}
    ${dsPager(list.length)}
    </div></div>
  ${S.addOpen?addCreatorsHTML():''}${S.bulkOpen?bulkModalHTML():''}${S.myCfgOpen&&S.myCfgDraft?myCfgHTML():''}${myRowMenuHTML()}</div>`;
}
/* One shared popover for hover lists (avoids clipping inside the scrolling table) */
function hpopShow(t){
  let pop=document.getElementById('hpop'); if(!pop){ pop=document.createElement('div'); pop.id='hpop'; pop.className='ds-hpop'; document.body.appendChild(pop); }
  const items=(t.dataset.items||'').split('|').filter(Boolean);
  pop.innerHTML=`<b>${esc(t.dataset.title||'')}</b>${items.length?items.map(n=>`<span>${esc(n)}</span>`).join(''):'<span class="ds-table-meta">None yet</span>'}`;
  const r=t.getBoundingClientRect(); pop.style.display='block';
  const left=Math.min(window.innerWidth-pop.offsetWidth-12, Math.max(12, r.left+r.width/2-pop.offsetWidth/2));
  pop.style.left=left+'px'; pop.style.top=(r.bottom+8)+'px';
}
function hpopHide(){ const pop=document.getElementById('hpop'); if(pop) pop.style.display='none'; }
document.addEventListener('mouseover',e=>{ const t=e.target.closest&&e.target.closest('.ds-hcount'); if(t) hpopShow(t); });
document.addEventListener('mouseout',e=>{ const t=e.target.closest&&e.target.closest('.ds-hcount'); if(t&&!(e.relatedTarget&&t.contains(e.relatedTarget))) hpopHide(); });
document.addEventListener('focusin',e=>{ const t=e.target.closest&&e.target.closest('.ds-hcount'); if(t) hpopShow(t); });
document.addEventListener('focusout',e=>{ if(e.target.closest&&e.target.closest('.ds-hcount')) hpopHide(); });
function closeDiscCreator(){ S.discCreator=null; paintHeader(); paintBody(true); window.scrollTo(0,0); }
/* ── Add Creators dialog: paste handles or import a CSV ── */
/* 12b: score creators that have no authenticity evaluation yet */
function autoScoreMy(){
  const todo=DISC.filter(c=>mx(c).auth==null);
  if(!todo.length) return toast('Every creator is already scored');
  todo.forEach(c=>{ MYC[c.id]={...(MYC[c.id]||{}),auth:60+avHash(c.id)%36}; });
  paintBody(); toast(`${todo.length} creator${todo.length===1?'':'s'} auto-scored`);
}
function openAddDisc(){ S.addOpen=true; S.addPlan=null; S.addMode='paste'; S.addText=''; S.addCsv=null; S.addDocUrl=''; S.addDocErr=''; paintBody(); }
/* Add creators to a shortlist uses the same popup as My creators; submitted creators also join the shortlist */
function openAddToPlan(pid){ S.addOpen=true; S.addPlan=pid; S.addMode='paste'; S.addText=''; S.addCsv=null; paintBody(); }
function addcClose(){ S.addOpen=false; S.addPlan=null; paintBody(); }
function addcNorm(h){ return String(h||'').trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i,'').replace(/[\/?#].*$/,'').replace(/^@/,'').toLowerCase(); }
function addcHandles(){
  if(S.addMode==='csv'||S.addMode==='file') return [...new Set(((S.addCsv&&S.addCsv.items)||[]).filter(x=>!x.err).map(x=>x.h))];
  return [...new Set(String(S.addText||'').split(/[\s,]+/).map(addcNorm).filter(Boolean))];
}
/* Each uploaded row is checked; rows that fail are fixed inline, as in Add posts */
function addcCheck(raw){
  const r=String(raw||'').trim(); if(!r) return {h:'',err:'Empty row'};
  const h=addcNorm(r); if(!/^[a-z0-9._]{1,30}$/.test(h)) return {h,err:'Not a valid Instagram handle'};
  return {h,err:null};
}
/* Parse an uploaded creator CSV into columns and rows; the header row names each column */
function addcParse(text){
  const split=l=>l.split(',').map(x=>x.trim().replace(/^"|"$/g,''));
  const lines=String(text||'').split(/\r?\n/).filter(l=>l.trim());
  if(!lines.length) return {cols:['Handle'],rows:[]};
  const head=split(lines[0]), isHead=head.some(h=>/^(handle|username|instagram|name)$/i.test(h));
  const cols=isHead?head:['Handle'];
  const rows=(isHead?lines.slice(1):lines).map(l=>{ const v=split(l), o={}; cols.forEach((c,i)=>{ o[c]=v[i]??''; }); if(!isHead) o.Handle=v[0]??''; return o; });
  return {cols,rows};
}
function addcItems(cols,rows){
  const key=cols.find(c=>/^(handle|username|instagram)$/i.test(c))||cols[0];
  return rows.map(row=>({raw:row[key]||'',row,key,...addcCheck(row[key]||'')}))
    .filter(x=>x.raw.trim()&&!/^(handle|username|instagram|@handle)$/i.test(x.raw.trim()));
}
function addcDemoFile(){
  const text=[
    'Name,Handle,Cost,Owner,Followers,Avg views,View plan,Boosting plan,Collaboration type',
    'Priya Kapoor,priya.kapoor,15000,Karan,42000,38000,Yes,No,Gifting',
    'Rahul M,@rahul_m,12000,Ankit,18000,15000,No,Yes,Paid',
    'Ananya Beauty,ananya beauty,20000,Karan,95000,70000,Yes,Yes,Paid',
    'Sid Stylist,sid-stylist,9000,Ankit,12000,9000,No,No,Gifting',
    'Vedictoons,vedictoons,25000,Karan,130000,110000,Yes,No,Paid',
    'Kiran Nair,kiran!nair,8000,Ankit,6000,5000,No,No,Gifting',
    'Gaurav Sunil,gaurav_kaizoku,40000,Karan,310000,260000,Yes,Yes,Paid',
    'Maya Wellness,maya.wellness,11000,Ankit,27000,22000,No,Yes,Gifting',
    'Foodie Jaipur,foodie#jaipur,7000,Karan,8000,6000,Yes,No,Gifting',
    'Plix Creator,plix.creator.07,14000,Ankit,21000,19000,Yes,Yes,Paid'].join('\n');
  const {cols,rows}=addcParse(text);
  return {name:'creator-upload-sample.csv',cols,items:addcItems(cols,rows)};
}
function addcFixRow(i,val){ const it=S.addCsv&&S.addCsv.items[i]; if(!it) return; const was=!it.err; it.raw=val; if(it.row) it.row[it.key||'Handle']=val; Object.assign(it,addcCheck(val)); if(was!==!it.err) toast(!it.err?'Row fixed and moved to Accepted':'Row moved to Needs fixing'); paintBody(); }
function addcDrop(i){ if(!S.addCsv) return; S.addCsv.items.splice(i,1); toast('Row removed'); paintBody(); }
function addcDelFile(e){ e.preventDefault(); e.stopPropagation(); S.addCsv=null; S.addcView=null; S.addDocUrl=''; toast('Google Doc removed'); paintBody(); }
function addcDocKey(e){ if(e.key==='Enter'){ e.preventDefault(); addcDocRead(); } }
function addcDocRead(){
  const url=(S.addDocUrl||'').trim();
  if(!/docs\.google\.com\/(?:document|spreadsheets)\/d\/[\w-]{6,}/.test(url)){ S.addDocErr=url?'That is not a Google Doc link. Paste the link from Share › Copy link.':'Paste a Google Doc link first.'; paintBody(); return; }
  const d=addcDemoFile(); d.name='Google Doc'; S.addCsv=d; S.addDocErr=''; S.addcView=null; paintBody(); toast(`${d.items.length} rows read from the doc · demo`);
}
function addcView(v){ S.addcView=v; paintBody(); }
const ADDC_CUSTOM_HEAD=c=>!tplOf('creators').base.some(b=>b.toLowerCase()===String(c).toLowerCase());
/* Preview of the uploaded file: one column per CSV header (custom columns marked), with accepted and needs-fixing views */
function addcPreviewHTML(csv){
  const items=csv.items, okN=items.filter(x=>!x.err).length, badN=items.length-okN;
  const view=S.addcView||(badN?'bad':'ok');
  const list=items.map((x,i)=>({x,i})).filter(o=>view==='bad'?o.x.err:!o.x.err);
  const pill=(v,label,n,cls)=>`<button type="button" class="ap-fpill ${cls}${view===v?' on':''}" aria-pressed="${view===v}" onclick="addcView('${v}')"><i></i>${label}<b>${n}</b></button>`;
  const hk=csv.cols.find(c=>/^(handle|username|instagram)$/i.test(c))||csv.cols[0];
  const head=csv.cols.map(c=>`<th class="${ADDC_CUSTOM_HEAD(c)?'is-custom':''}">${esc(c)}${ADDC_CUSTOM_HEAD(c)?'<small>Custom</small>':''}</th>`).join('');
  const body=list.map(({x,i})=>`<tr class="${x.err?'is-bad':''}">${csv.cols.map(c=>{
      if(c===hk) return x.err?`<td><input class="addc-in" aria-label="Handle row ${i+1}" value="${esc(x.raw)}" onchange="addcFixRow(${i},this.value)"></td>`:`<td>@${esc(x.h)}</td>`;
      return `<td>${esc(x.row?x.row[c]??'':'')||'<span class="addc-dash">—</span>'}</td>`;}).join('')}
      <td class="${x.err?'addc-why':'addc-ready'}">${x.err?esc(x.err):'Ready'}</td><td><button type="button" class="ap-x" aria-label="Remove row ${i+1}" onclick="addcDrop(${i})">×</button></td></tr>`).join('');
  const table=list.length
    ?`<div class="addc-tbl-wrap"><table class="addc-tbl"><thead><tr>${head}<th>Check</th><th></th></tr></thead><tbody>${body}</tbody></table></div>`
    :`<p class="addc-empty">${view==='bad'?'Nothing needs fixing.':'No accepted creators yet.'}</p>`;
  return `<div class="ap-filter" role="tablist">${pill('bad','Needs fixing',badN,'bad')}${pill('ok','Accepted',okN,'ok')}</div>${table}`;
}
function addcBadNote(){ const nb=(S.addMode==='csv'&&S.addCsv)?S.addCsv.items.filter(x=>x.err).length:0; return nb?` · ${nb} need${nb===1?'s':''} fixing`:''; }
function addcSync(){ const n=addcHandles().length; const c=document.getElementById('addc-count'); if(c) c.textContent=n; const sm=document.getElementById('addc-sum'); if(sm) sm.textContent=n; const bn=document.getElementById('addc-badnote'); if(bn) bn.textContent=addcBadNote(); const ch=document.getElementById('addc-chips'); if(ch) ch.innerHTML=addcChipsHTML(); const b=document.getElementById('addc-submit'); if(b) b.disabled=!n; }
function addcInput(v){ S.addText=v; addcSync(); }
function addcMode(m){ S.addMode=m; paintBody(); }
function addcFile(input){
  const f=input.files&&input.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{ const {cols,rows}=addcParse(String(r.result)); S.addCsv={name:f.name,cols,items:addcItems(cols,rows).slice(0,500)}; S.addcView=null; paintBody(); };
  r.readAsText(f);
}
function addcSubmit(){
  const hs=addcHandles(); if(!hs.length) return;
  let added=0; const ids=[];
  const csvRows=(S.addMode==='csv'||S.addMode==='file')?(S.addCsv?S.addCsv.items.filter(x=>!x.err):[]):[];
  const rowFor=h=>csvRows.find(x=>x.h===h);
  hs.forEach((h,i)=>{
    const existing=DISC.find(c=>c.handle==='@'+h);
    const row=rowFor(h), data=row&&row.row||{};
    const id=existing?existing.id:'my'+Date.now()+i;
    if(!existing){
      const name=(data.Name||'').trim()||h.split(/[._]+/).filter(Boolean).map(w=>w[0].toUpperCase()+w.slice(1)).join(' ')||h;
      DISC.unshift({id,name,handle:'@'+h,followers:Number(String(data.Followers||'').replace(/,/g,''))||0,views:Number(String(data['Avg views']||'').replace(/,/g,''))||0,tier:'Nano',tags:[],source:'Inspiration',collabs:0,likes:0,last:'Just now',country:'—',engagement:0,platforms:['Instagram']});
      added++;
    }
    ids.push(id);
    if(row){ // CSV cost and custom columns are kept against the creator
      const ov={...((S.myCF||{})[id]||{})};
      if(data.Cost) ov.cost=Number(String(data.Cost).replace(/[^0-9.]/g,''))||0;
      Object.entries(data).forEach(([k,v])=>{ if(ADDC_CUSTOM_HEAD(k)&&v!=='') ov[k]=v; });
      S.myCF={...(S.myCF||{}),[id]:ov};
    }
  });
  const pid=S.addPlan; let joined=0;
  if(pid&&planOf(pid)){ const p=planOf(pid); const before=(p.creators||[]).length; p.creators=[...new Set([...(p.creators||[]),...ids])]; joined=p.creators.length-before; }
  S.addOpen=false; S.addPlan=null; S.addText=''; S.addCsv=null; S.addcView=null; paintBody();
  const base=added?`${added} creator${added>1?'s':''} added to My creators`:'Those creators are already in My creators';
  if(pid&&joined) addToast('Successfully added',`${joined} creator${joined>1?'s':''} ${joined>1?'have':'has'} been successfully added to`,planOf(pid).name,()=>openPlan(pid));
  else toast(pid?'Those creators are already in this shortlist':base);
}
function addcChipsHTML(){
  const hs=addcHandles();
  if(!hs.length) return '<span class="addn-empty">Handles you add will appear here</span>';
  return hs.slice(0,60).map(h=>`<span class="addn-chip">@${esc(h)}<button type="button" aria-label="Remove @${esc(h)}" onclick="addcRemove('${esc(h)}')">&times;</button></span>`).join('')+(hs.length>60?`<span class="addn-more">+${hs.length-60} more</span>`:'');
}
function addcRemove(h){
  if(S.addMode==='csv'&&S.addCsv){ S.addCsv.items=S.addCsv.items.filter(x=>x.h!==h); paintBody(); return; }
  else { S.addText=addcHandles().filter(x=>x!==h).join('\n'); const ta=document.getElementById('addc-input'); if(ta) ta.value=S.addText; }
  addcSync();
}
function addCreatorsHTML(){
  const m=S.addMode||'paste', n=addcHandles().length, csv=S.addCsv;
  const at='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>';
  const upl=discSvg('<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',20), dl=discSvg('<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',16);
  const kb=discSvg('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/>',18), fi=discSvg('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',18);
  const opt=(k,ic,t,d)=>`<button type="button" role="tab" aria-selected="${m===k}" class="addn-opt ${m===k?'on':''}" onclick="addcMode('${k}')"><span class="addn-opt-ico">${ic}</span><span class="addn-opt-txt"><b>${t}</b><small>${d}</small></span></button>`;
  const right=m==='file'?`<div class="addn-pane"><label class="addn-drop"><input type="file" accept=".csv,text/csv" hidden onchange="addcFile(this)"><span class="addn-drop-ico">${upl}</span>${csv&&csv.name!=='Google Doc'?`<span class="addn-drop-title">${esc(csv.name)}</span><span class="addn-drop-sub">${csv.items.length} row${csv.items.length===1?'':'s'} read from the file</span>`:'<span class="addn-drop-title"><a>Choose a CSV</a> or drop it here</span><span class="addn-drop-sub">One Instagram handle per row</span>'}</label><div class="addn-tpl"><span>Need the column names?</span><button type="button" class="addn-link" onclick="downloadTemplate('creators')">${dl}Download template</button></div><details class="addn-help"><summary>How importing works</summary><ul><li>Use one Instagram handle per row, or the first column for handles.</li><li>A header row (handle or username) is skipped.</li><li>Handles already in My creators are not added twice.</li></ul></details></div>`:m==='paste'
    ?`<div class="addn-pane"><div class="addn-row"><label class="addn-label" for="addc-input">Instagram handles</label><span class="addn-count"><span id="addc-count">${n}</span> / 500</span></div>
        <textarea id="addc-input" class="addn-area" rows="4" placeholder="e.g. @pavansirisin, kyliejenner or https://instagram.com/vedictoons" oninput="addcInput(this.value)" autocomplete="off">${esc(S.addText||'')}</textarea>
        <p class="addn-note">Separate with commas, spaces or new lines. Works with handles, @handles and profile links.</p>
        <div class="addn-chips" id="addc-chips">${addcChipsHTML()}</div></div>`
    :`<div class="addn-pane">
        <div class="addn-row"><label class="addn-label" for="addc-doc">Google Doc link</label>${csv?`<span class="addn-count">${csv.items.length} row${csv.items.length===1?'':'s'} read · demo</span>`:''}</div>
        <div style="display:flex;gap:8px;align-items:center"><input id="addc-doc" class="nl-input" style="margin-top:0" value="${esc(S.addDocUrl||'')}" placeholder="https://docs.google.com/document/d/…" oninput="S.addDocUrl=this.value" onkeydown="addcDocKey(event)" autocomplete="off">${csv?`<button type="button" class="ds-btn ds-btn--ghost" style="flex:none" onclick="addcDelFile(event)">Remove</button>`:''}<button type="button" class="ds-btn ds-btn--outline" style="flex:none" onclick="addcDocRead()">Read doc</button></div>
        ${S.addDocErr?`<p class="addn-note" style="color:#b91c1c">${esc(S.addDocErr)}</p>`:`<p class="addn-note">Set the doc to Anyone with the link can view. Max. 500 handles.</p>`}
        ${csv?addcPreviewHTML(csv):''}
        <details class="addn-help"><summary>How importing works</summary><ul><li>Put the creators in a table in the doc, one Instagram handle per row, or one handle per line.</li><li>A header row (handle or username) is skipped.</li><li>Handles already in My creators are not added twice.</li></ul></details></div>`;
  return `<div class="disc-cfg-scrim" onclick="if(event.target===this)addcClose()">
    <div class="addn" role="dialog" aria-modal="true" aria-label="Add Creators">
      <div class="addn-head"><div><h3>Add Creators</h3><p>${S.addPlan?'Bring Instagram creators into My Creators and this shortlist.':'Bring Instagram creators into My Creators.'}</p></div><button type="button" class="ds-iconbtn" aria-label="Close" onclick="addcClose()">${X_SVG}</button></div>
      <div class="addn-body">
        <div class="addn-side" role="tablist" aria-label="Add method">${opt('paste',kb,'Paste handles','Type or paste a list')}${opt('file',upl,'Upload CSV','Spreadsheet, one handle per row')}${opt('csv',fi,'Google Doc','Paste a Google Doc link')}
          </div>
        ${right}
      </div>
      <div class="addn-foot"><span class="addn-sum"><b id="addc-sum">${n}</b> creator${n===1?'':'s'} ready<span class="ap-badnote" id="addc-badnote">${addcBadNote()}</span></span><div class="addn-actions"><button type="button" class="ds-btn ds-btn--ghost" onclick="addcClose()">Cancel</button><button type="button" id="addc-submit" class="ds-btn ds-btn--primary" ${n?'':'disabled'} onclick="addcSubmit()">${m==='paste'?'Add creators':'Import'}</button></div></div>
    </div></div>`;
}
const DISC_META={
  cr1:{country:'India',engagement:5.1,platforms:['Instagram','YouTube']},
  cr2:{country:'United States',engagement:3.2,platforms:['Instagram','TikTok']},
  cr3:{country:'India',engagement:6.4,platforms:['YouTube']},
  cr4:{country:'India',engagement:4.4,platforms:['Instagram','TikTok']},
  cr5:{country:'United States',engagement:7.2,platforms:['YouTube','TikTok']},
  cr6:{country:'India',engagement:2.6,platforms:['Instagram']},
  cr7:{country:'India',engagement:3.8,platforms:['Instagram','TikTok']},
  cr8:{country:'India',engagement:5.9,platforms:['Instagram']}
};

/* Creator data pulled from the repo's creator generator (same names, seeded followers and engagement). */
  const CR2_NAMES_REPO = [
    ['Nicole Pearce','nicolepearce',['instagram','tiktok'],['Lifestyle','Books','DIY'],'United States'],
    ['Maya Chen','mayachen.co',['instagram','youtube'],['Skincare','Beauty'],'United States'],
    ['Arjun Rao','arjunrao.fit',['instagram','tiktok'],['Fitness','Wellness'],'India'],
    ['Lily Osei','lilyosei',['tiktok','instagram'],['Fashion','Thrifting'],'United Kingdom'],
    ['Diego Fuentes','diegofuentes',['youtube','instagram'],['Tech','Gadgets'],'Mexico'],
    ['Priya Nair','priya.cooks',['instagram'],['Food','Home cooking'],'India'],
    ['Jordan Blake','jordanblake',['tiktok'],['Comedy','Lifestyle'],'United States'],
    ['Sofia Marin','sofiamarin',['instagram','youtube'],['Travel','Photography'],'Spain'],
    ['Amara Johnson','amarajohnson',['instagram','tiktok'],['Beauty','Skincare'],'United States'],
    ['Ben Carter','bencarterfit',['youtube','instagram'],['Fitness','Nutrition'],'Canada'],
    ['Hana Kobayashi','hanak.style',['instagram'],['Fashion','Minimalism'],'Japan'],
    ['Tariq Hassan','tariqhassan',['tiktok','youtube'],['Tech','Reviews'],'United Arab Emirates'],
    ['Ella Brennan','ellabrennan',['instagram','tiktok'],['Parenting','Lifestyle'],'Ireland'],
    ['Marcus Webb','marcuswebb',['youtube'],['Finance','Productivity'],'United States'],
    ['Zara Iqbal','zaraiqbal',['instagram','tiktok'],['Beauty','Haircare'],'Pakistan'],
    ['Noah Kim','noahkim.eats',['instagram','youtube'],['Food','Reviews'],'South Korea'],
    ['Ivy Thompson','ivythompson',['tiktok','instagram'],['Skincare','Wellness'],'Australia'],
    ['Leo Santos','leosantos',['instagram'],['Fitness','Lifestyle'],'Brazil']
  ];
function discSeedRepo(str){ let h=0; for(let i=0;i<str.length;i++) h=(h*31+str.charCodeAt(i))>>>0; return h||1; }
function discRng(seed){ let s=seed>>>0; return function(){ s=(s+0x6D2B79F5)|0; let t=Math.imul(s^(s>>>15),1|s); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; }; }
const REPO_PLAT={instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube'};
const DISC_REPO=CR2_NAMES_REPO.map((base,idx)=>{
  const handle=base[1]+'';
  const rng=discRng(discSeedRepo('cr2creator'+idx+handle));
  const followers=Math.round(20000+rng()*2000000);
  const engagement=Math.round((1.5+rng()*8)*100)/100;
  const views=Math.round(followers*(0.3+rng()*0.6));
  const tier=followers<10000?'Nano':followers<100000?'Micro':followers<1000000?'Macro':'Mega';
  return {id:'r'+idx,name:base[0],handle:'@'+handle,followers,views,tier,tags:base[3],
    source:['Self','Competitor','Inspiration'][idx%3],collabs:(idx%5)+1,likes:Math.round(views*engagement/100),
    last:['1d ago','3d ago','1w ago'][idx%3],country:base[4],engagement,
    platforms:base[2].map(p=>REPO_PLAT[p]||p),repo:true};
});
DISC.push(...DISC_REPO);
DISC.forEach(c=>Object.assign(c,DISC_META[c.id]||{}));
const DISC_ADV_EMPTY={cat:'',location:'',minFollowers:'',maxFollowers:'',minEng:'',maxEng:'',avgViewsMin:'',avgViewsMax:'',minCost:'',maxCost:'',audienceCountry:'',ages:[],gender:'',interests:[],languages:[],audienceQuality:'',collab:'any',sponsored:[],brandSearch:'',prompt:''};
const DISC_TOPICS=['Skincare','Lifestyle','Beauty','Wellness','Fitness','Fashion','Food','Tech','Travel','Parenting'];
const DISC_LANGS=['English','Hindi','Hinglish','Spanish','French','German','Japanese','Korean','Tamil'];
const DISC_AGES=['13-17','18-24','25-34','35-44','45+'];
const DISC_PLATFORMS=['Instagram','TikTok','YouTube'];
function advMatchWith(c,a){
  if(a.cat&&!(c.tags||[]).includes(a.cat)) return false;
  if(a.location&&c.country!==a.location) return false;
  if(a.minFollowers&&c.followers<Number(a.minFollowers)) return false;
  if(a.maxFollowers&&c.followers>Number(a.maxFollowers)) return false;
  if(a.minEng&&c.engagement<Number(a.minEng)) return false;
  if(a.maxEng&&c.engagement>Number(a.maxEng)) return false;
  if(a.avgViewsMin&&c.views<Number(a.avgViewsMin)) return false;
  if(a.avgViewsMax&&c.views>Number(a.avgViewsMax)) return false;
  if(a.minCost&&(mx(c).cost||0)<Number(a.minCost)) return false;
  if(a.maxCost&&(mx(c).cost||0)>Number(a.maxCost)) return false;
  return true;
}
function advMatch(c){ return advMatchWith(c,S.discAdv||DISC_ADV_EMPTY); }
function catChips(c,n=2){ const t=c.tags||[]; return t.slice(0,n).map(x=>`<span class="ds-chip">${esc(x)}</span>`).join('')+(t.length>n?`<span class="ds-chip">+${t.length-n}</span>`:''); }
function advK(){ return S.advScope==='my'?{d:'myAdvDraft',a:'myAdv'}:{d:'discDraft',a:'discAdv'}; }
function discDraft(){ const K=advK(); return S[K.d]||{db:S.discDb||'Creator database',mode:'Standard',...DISC_ADV_EMPTY,...(S[K.a]||{})}; }
function discRepaint(){ const sc=document.querySelector('.disc-adv-body'); const top=sc?sc.scrollTop:0; paintBody(); const n=document.querySelector('.disc-adv-body'); if(n) n.scrollTop=top; }
function discDraftSet(k,v){ S[advK().d]={...discDraft(),[k]:v}; discRepaint(); }
function discToggleArr(k,v){ const cur=[...(discDraft()[k]||[])]; const i=cur.indexOf(v); if(i>=0) cur.splice(i,1); else cur.push(v); S[advK().d]={...discDraft(),[k]:cur}; discRepaint(); }
function discDraftPatch(o){ S[advK().d]={...discDraft(),...o}; discRepaint(); }
function discReset(){ S[advK().d]={db:'Creator database',mode:'Standard',...DISC_ADV_EMPTY}; discRepaint(); }
function discDraftCount(){ const d=discDraft(); if(d.db==='Meta Marketplace') return 0; const base=S.advScope==='my'?DISC.filter(c=>!c.repo):DISC; return base.filter(c=>advMatchWith(c,d)).length; }
function discApply(){
  const K=advK(), d=discDraft();
  S[K.a]={...DISC_ADV_EMPTY,...d};
  if(S.advScope!=='my') S.discDb=d.db;
  S[K.d]=null; paintBody();
}
const MY_TOOL_CSS=`

.my-funnel{position:relative;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid #bfdbfe;border-radius:8px;background:#ffffff;color:#1e40af;cursor:pointer;flex:none}
.my-funnel:hover{border-color:#1d4ed8;color:#1d4ed8}
.my-funnel.is-on{background:#eff6ff;border-color:#bfdbfe;color:#1e40af}
.my-funnel b{position:absolute;top:-6px;right:-6px;min-width:17px;height:17px;border-radius:16px;background:#1d4ed8;color:#ffffff;font-size:12px;line-height:17px;text-align:center;padding:0 4px}
.ai-verdict{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;padding:3px 9px;border-radius:16px;background:#f1f5f9;color:#475569;white-space:nowrap}
.ai-verdict i{width:8px;height:8px;border-radius:50%;background:currentColor;display:inline-block}
.ai-verdict.is-strong-fit{background:#dcfce7;color:#15803d}
.ai-verdict.is-consider{background:#fffbeb;color:#92400e}
.ai-verdict.is-avoid{background:#fee2e2;color:#b91c1c}
.ai-verdict.is-needs-data{background:#f1f5f9;color:#64748b}
.my-card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;margin-top:4px}
.my-card{background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;cursor:pointer;display:flex;flex-direction:column;gap:12px}
.my-card:hover{border-color:#bfdbfe}
.my-card.is-selected{border-color:#1d4ed8;box-shadow:0 0 0 1px #1d4ed8 inset}
.my-card-top{display:flex;align-items:center;gap:10px;min-width:0}
.my-card-id{min-width:0;flex:1}
.my-card-id b{display:block;font-size:14px;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.my-card-id span{font-size:12px;color:#64748b}
.my-card-tags{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.my-card-facts{display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;margin:0}
.my-card-facts dt{font-size:12px;color:#64748b}
.my-card-facts dd{margin:2px 0 0;font-size:14px;color:#0f172a;font-weight:500}
.my-card-foot{display:flex;justify-content:space-between;align-items:center;margin-top:auto;gap:8px}

.ds-more-menu button{display:flex;align-items:center;gap:8px}
.ds-more-menu button svg{flex:none;color:#64748b}
.my-grp-btn{all:unset;display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-weight:600;color:#1e293b}
.my-grp-btn:hover{color:#1d4ed8}
.my-grp-btn:focus-visible{outline:2px solid #1d4ed8;outline-offset:2px;border-radius:4px}
th.is-grp{background:#eff6ff}
td.is-grp{background:#eff6ff}
.my-plain.is-muted{color:#94a3b8}
.cons-pill{display:inline-flex;font-size:12px;font-weight:500;padding:3px 8px;border-radius:16px;white-space:nowrap}
.cons-pill.is-ok{background:#dcfce7;color:#15803d}
.cons-pill.is-warn{background:#fffbeb;color:#92400e}
.cons-pill.is-low{background:#fee2e2;color:#b91c1c}
.mom{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:500;white-space:nowrap}
.mom.is-up{color:#15803d}
.mom.is-down{color:#b91c1c}
.mom.is-flat{color:#64748b}
.mom-spark{flex:none}

/* Column group headers and the new depth columns: no grey */
.my-table thead .my-grp-btn,
.my-table thead th .my-grp-btn{appearance:none;-webkit-appearance:none;background:transparent;border:0;border-radius:0;box-shadow:none;padding:0;margin:0;display:inline-flex;flex-direction:row;align-items:center;gap:6px;white-space:nowrap;font:inherit;font-weight:600;color:#0f172a;cursor:pointer}
.my-table thead .my-grp-btn:hover{color:#1d4ed8}
.my-table th.is-grp,.my-table td.is-grp{background:transparent}
.my-table .my-plain small{color:#0f172a}
.my-table .my-plain.is-muted{color:#1d4ed8}
.mom.is-flat{color:#0f172a}
.my-card-facts dt,.my-card-id span{color:#0f172a}

/* My creators table: no grey text or icons */
.my-table thead th,.my-table thead .my-th,.my-table .my-th svg,.my-table .my-grp-btn svg{color:#0f172a}
.my-table .ds-table-meta,.my-table .ds-table-title,.my-table .my-plain small,.my-table .my-plain,.my-table .ds-chip,.my-table .my-act summary,.my-table .my-act .ds-more summary,.my-table .ds-hcount{color:#0f172a}
.my-table .my-act svg,.my-table .my-more svg,.my-table .ds-more summary svg{color:#0f172a;stroke:#0f172a}
.my-table .my-grp-btn svg{stroke:#0f172a}

/* My creators table: force ink text, no grey anywhere in the table */
.ds-page .my-table, .ds-page .my-table *{color:#0f172a !important}
.ds-page .my-table .my-grp-btn:hover{color:#1d4ed8 !important}
.ds-page .my-table .my-plain.is-muted{color:#1d4ed8 !important}

/* Controls: bordered Add to, one-line menu items, clear filter button */
.addto-menu>summary.ds-btn{border:1px solid #1d4ed8 !important;background:#ffffff !important;color:#1d4ed8 !important;border-radius:8px !important}
.addto-menu>summary.ds-btn svg{color:#1d4ed8 !important;stroke:#1d4ed8 !important}
.ds-more-menu button{display:flex !important;flex-direction:row !important;align-items:center !important;gap:10px !important;white-space:nowrap}
.ds-more-menu button svg{flex:none;color:#1d4ed8 !important;stroke:#1d4ed8 !important}
.my-funnel{width:38px;height:38px;border:1px solid #1d4ed8 !important;background:#eff6ff !important;color:#1d4ed8 !important;border-radius:8px !important}
.my-funnel:hover{background:#dbeafe !important}
.my-funnel svg{stroke:#1d4ed8}

/* Selection bar: white, matching the filter toolbar above it */
.ds-page .bulk-bar{background:#eff6ff;color:#0f172a;border:1px solid #bfdbfe;box-shadow:none;border-radius:12px;padding:10px 12px;margin:0 0 12px}
.ds-page .bulk-bar{margin-bottom:0 !important}
.ds-page .bulk-bar+.disc-split{margin-top:0 !important;padding-top:0 !important}
.ds-page .bulk-bar .bb-l b{color:#0f172a}
.ds-page .bulk-bar .bb-l span{color:#0f172a}
.ds-page .bulk-bar .bb-btn,.ds-page .bulk-bar .bb-clear{background:#ffffff;border:1px solid #bfdbfe;color:#0f172a;border-radius:8px}
.ds-page .bulk-bar .bb-btn:hover{border-color:#1d4ed8;color:#1d4ed8}
.ds-page .bulk-bar .bb-btn svg{color:#1d4ed8;stroke:#1d4ed8}
.ds-page .bulk-bar .bb-btn.is-danger{color:#b91c1c;border-color:#fecaca}
.ds-page .bulk-bar .bb-btn.is-danger svg{color:#b91c1c;stroke:#b91c1c}
.ds-page .bulk-bar .bb-clear{color:#1d4ed8;border-color:#bfdbfe}
.ds-page .bulk-bar .bb-sep{background:#bfdbfe}
.ds-page .bulk-bar .addto-menu>summary.ds-btn{background:#ffffff !important;border:1px solid #1d4ed8 !important;color:#1d4ed8 !important}
.ds-page .bulk-bar .addto-menu>summary.is-disabled{opacity:.5;border-color:#bfdbfe !important;color:#64748b !important}

.my-funnel{position:relative;display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;padding:0;border:1px solid #1d4ed8;border-radius:8px;background:#ffffff;color:#1d4ed8;cursor:pointer;flex:none}
.my-funnel:hover,.my-funnel.is-on{background:#eff6ff}
.my-funnel svg{stroke:#1d4ed8}
.my-funnel b{position:absolute;top:-7px;right:-7px;min-width:18px;height:18px;border-radius:16px;background:#1d4ed8;color:#ffffff;font-size:12px;line-height:18px;text-align:center;padding:0 4px}
.addto-menu>summary.ds-btn{list-style:none;border:1px solid #1d4ed8;background:#ffffff;color:#1d4ed8;border-radius:8px}
.addto-menu>summary.ds-btn svg{stroke:#1d4ed8}
.ds-more-menu button{display:flex;flex-direction:row;align-items:center;gap:10px;white-space:nowrap}
.ds-more-menu button svg{flex:none;stroke:#1d4ed8}
.my-table thead .my-grp-btn{appearance:none;background:transparent;border:0;padding:0;margin:0;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;font:inherit;font-weight:600;color:#0f172a;cursor:pointer}
.my-table thead .my-grp-btn:hover{color:#1d4ed8}
.my-table thead .my-grp-btn svg{stroke:#1d4ed8}
.my-table th.is-grp,.my-table td.is-grp{background:transparent}
`;
function myAdvBtnHTML(){ const n=myAdvCount(S.myAdv); const fun='<path d="M3 4h18l-7 8.5V19l-4 2v-8.5z"/>'; return `<style>${MY_TOOL_CSS}${MYF_CSS}</style><button type="button" class="my-funnel ftip${S.myAdvOpen?' is-on':''}" onclick="openMyAdvanced()" data-tip="Advanced filters" aria-label="Advanced filters${n?', '+n+' active':''}">${discSvg(fun,16)}${n?`<b>${n}</b>`:''}</button>`; }
function openMyAdvanced(){ S.advScope='my'; S.myAdvOpen=!S.myAdvOpen; S.myAdvDraft=null; paintBody(); }
function closeAdvPanel(){ if(S.advScope==='my') openMyAdvanced(); else openDiscAdvanced(); }
function discParseAi(text){
  const t=text.toLowerCase(), out={};
  const toN=(n,u)=>Number(n)*(u==='k'?1e3:u==='m'?1e6:1);
  const r=t.match(/(\d+(?:\.\d+)?)\s*(k|m)?\s*(?:-|–|to)\s*(\d+(?:\.\d+)?)\s*(k|m)?\s*followers/);
  if(r){ out.minFollowers=String(toN(r[1],r[2])); out.maxFollowers=String(toN(r[3],r[4])); }
  const u=t.match(/(?:under|below|less than)\s*(\d+(?:\.\d+)?)\s*(k|m)?\s*followers/);
  if(u&&!r) out.maxFollowers=String(toN(u[1],u[2]));
  const e=t.match(/(?:over|above|more than|>)\s*(\d+(?:\.\d+)?)\s*%/); if(e) out.minEng=e[1];
  const ue=t.match(/(?:under|below|less than)\s*(\d+(?:\.\d+)?)\s*%/); if(ue) out.maxEng=ue[1];
  const alias={indian:'India',india:'India',american:'United States','united states':'United States',usa:'United States',us:'United States'};
  const hit=Object.keys(alias).find(k=>new RegExp('\\b'+k+'\\b').test(t)); if(hit) out.location=alias[hit];
  const cat=[...new Set(DISC.flatMap(c=>c.tags||[]))].find(x=>t.includes(x.toLowerCase())); if(cat) out.cat=cat;
  const pf=DISC_PLATFORMS.find(x=>t.includes(x.toLowerCase())); if(pf) S.discPlatform=pf;
  return out;
}
function discAiSearch(){
  const txt=(document.getElementById('discAiPrompt')||{value:''}).value.trim();
  S.discDraft={...discDraft(),...DISC_ADV_EMPTY,...discParseAi(txt),prompt:txt};
  discApply();
}
function advPanelHTML(){
  const d=discDraft(), cats=[...new Set(DISC.flatMap(c=>c.tags||[]))].sort(), countries=[...new Set(DISC.map(c=>c.country))].sort();
  const seg=(k,opts)=>`<div class="ds-seg" role="tablist">${opts.map(o=>`<button type="button" role="tab" aria-selected="${d[k]===o}" class="${d[k]===o?'on':''}" onclick="discDraftSet('${k}','${o}')">${o}</button>`).join('')}</div>`;
  const chip=(label,on,fn)=>`<button type="button" class="ds-btn ds-btn--outline ds-btn--sm${on?' is-on':''}" onclick="${fn}">${label}</button>`;
  const fPresets=[['Nano','','10000'],['Micro','10000','100000'],['Mid-tier','100000','500000'],['Macro','500000','1000000'],['Mega','1000000','']];
  const ePresets=[['>2%','2',''],['>5%','5',''],['>8%','8','']];
  const presetRow=(list,minK,maxK)=>`<div class="disc-chips">${list.map(p=>chip(p[0],d[minK]===p[1]&&d[maxK]===p[2],`discDraftPatch({${minK}:'${p[1]}',${maxK}:'${p[2]}'})`)).join('')}</div>`;
  const engRow=ePresets.map(p=>chip(p[0],d.minEng===p[1]&&!d.maxEng,`discDraftPatch({minEng:'${p[1]}',maxEng:''})`)).join('');
  const range=(minK,maxK,minPh,maxPh,step='')=>`<div class="disc-range"><input class="ds-input" type="number" min="0" ${step} placeholder="${minPh}" value="${esc(d[minK]||'')}" onchange="discDraftSet('${minK}',this.value)"><span>—</span><input class="ds-input" type="number" min="0" ${step} placeholder="${maxPh}" value="${esc(d[maxK]||'')}" onchange="discDraftSet('${maxK}',this.value)"></div>`;
  const field=(label,inner)=>`<div class="disc-sub"><span class="disc-sublabel">${label}</span>${inner}</div>`;
  const dd=(k,label,opts,allLabel)=>{ const cur=opts.includes(d[k])?d[k]:''; return `<label class="ds-filter disc-field${cur?' is-active':''}"><span>${esc(cur||allLabel)}</span><select aria-label="${label}" onchange="discDraftSet('${k}',this.value)"><option value="" ${!cur?'selected':''}>${allLabel}</option>${opts.map(o=>`<option value="${esc(o)}" ${cur===o?'selected':''}>${esc(o)}</option>`).join('')}</select></label>`; };
  const chk=(k,v,label,disabled=false)=>`<label class="disc-opt${disabled?' is-off':''}"><input type="checkbox" ${disabled?'disabled':''} ${(d[k]||[]).includes(v)?'checked':''} onchange="discToggleArr('${k}','${v}')"><span>${label}</span></label>`;
  const radio=(k,v,label,disabled=false)=>`<label class="disc-opt${disabled?' is-off':''}"><input type="radio" name="disc-${k}" ${disabled?'disabled':''} ${(d[k]||'')===v?'checked':''} onchange="discDraftSet('${k}','${v}')"><span>${label}</span></label>`;
  const grp=(title,inner,note='')=>`<details class="disc-grp" open><summary>${title}</summary><div class="disc-grp-body">${inner}${note?`<p class="disc-note">${note}</p>`:''}</div></details>`;
  const creator=grp('Creator',
    field('Location',dd('location','Location',countries,'Any location'))+
    field('Category',dd('cat','Category',cats,'Any category'))+
    field('Followers',range('minFollowers','maxFollowers','Min','Max')+presetRow(fPresets,'minFollowers','maxFollowers'))+
    field('Engagement rate',range('minEng','maxEng','Min %','Max %','step="0.1"')+`<div class="disc-chips">${engRow}</div>`)+
    field('Avg views',range('avgViewsMin','avgViewsMax','Min','Max'))+field('Cost (₹)',range('minCost','maxCost','Min ₹','Max ₹')));
  const audience=grp('Audience',
    field('Audience location',dd('audienceCountry','Audience location',countries,'Any location'))+
    field('Age',`<div class="disc-opts">${DISC_AGES.map(a=>chk('ages',a,a)).join('')}</div>`)+
    field('Gender',`<div class="disc-opts">${radio('gender','','Any')}${radio('gender','female','Majority female')}${radio('gender','male','Majority male')}</div>`)+
    field('Interests',`<div class="disc-opts">${DISC_TOPICS.map(t=>chk('interests',t,t)).join('')}</div>`)+
    field('Language',`<div class="disc-opts">${DISC_LANGS.map(l=>chk('languages',l,l)).join('')}</div>`)+
    field('Audience quality',`<div class="disc-opts">${radio('audienceQuality','','Any')}${radio('audienceQuality','80','High quality (80+)')}${radio('audienceQuality','65','Good quality (65+)')}</div>`),
    'Audience data isn’t in the Discover sample yet, so these fields don’t narrow results.');
  const intel=grp('Intelligence',
    field('Authenticity',`<label class="ds-filter disc-field is-off"><span>Any</span></label>`)+
    field('Brand fit',`<label class="ds-filter disc-field is-off"><span>Any</span></label>`)+
    field('Evaluation status',`<div class="disc-opts">${['Ready','Needs evaluation','Needs content','Processing','Failed'].map(x=>`<label class="disc-opt is-off"><input type="checkbox" disabled><span>${x}</span></label>`).join('')}</div>`),
    'Authenticity and Brand Fit aren’t available for undiscovered creators — they run once a creator is added to My Creators.');
  const commercial=grp('Commercial',
    field('Brand collaborations',`<div class="disc-opts">${radio('collab','any','Any')}${radio('collab','yes','Has collaborations')}${radio('collab','no','No detected collaborations')}</div>`)+
    field('Sponsored content',`<div class="disc-opts">${chk('sponsored','paid','Confirmed paid partnerships')}${chk('sponsored','likely','Likely sponsored content')}${chk('sponsored','mention','Brand mentions')}</div>`)+
    field('Brands worked with',`<input class="ds-input" type="text" placeholder="Search brands…" value="${esc(d.brandSearch||'')}" onchange="discDraftSet('brandSearch',this.value)">`),
    'Brand data isn’t in the Discover sample yet, so these fields don’t narrow results.');
  const aiBox=`<section class="disc-sec"><span class="disc-sublabel">Describe the creators</span>
     <textarea id="discAiPrompt" class="ds-input" rows="3" style="width:100%;padding:8px;height:auto" placeholder="e.g. Indian skincare creators with 100K–500K followers and over 5% engagement">${esc(d.prompt||'')}</textarea>
     <div class="disc-foot"><span class="ds-caption">Reads ranges, country, category, platform and engagement from your sentence.</span><button class="ds-btn ds-btn--primary" onclick="discAiSearch()">Search</button></div></section>`;
  return `<div class="disc-adv-sec"><section class="disc-sec">
      ${field('Search mode',seg('mode',['Standard','AI Filter']))}
    </section>
    ${d.mode==='AI Filter'?aiBox:''}
    ${creator}</div><!--foot-->
    <div class="disc-foot disc-adv-foot">
      <button class="ds-btn ds-btn--ghost" onclick="discReset()">Reset</button>
      <button class="ds-btn ds-btn--primary" onclick="discApply()">Show results (${discDraftCount()})</button>
    </div>`;
}
function openDiscAdvanced(){ S.discAdvOpen=!S.discAdvOpen; if(S.discAdvOpen) S.discDraft=null; paintBody(); }

const MY_ADV_EMPTY={period:'90',format:[],perf:'Combined',cost:'All'};
function myAdvCount(a){ a=a||{}; return (a.format||[]).length+(a.cost&&a.cost!=='All'?1:0)+(a.perf&&a.perf!=='Combined'?1:0)+(a.period&&a.period!=='90'?1:0); }
function myAdvMatch(c,a){ a=a||{}; const cost=mx(c).cost||0; if(a.cost==='quote'&&!(cost>0)) return false; if(a.cost==='none'&&cost>0) return false; return true; }
function myAdvRepaint(){ const b=document.querySelector('.myf-body'), sc=b?b.scrollTop:0; paintBody(); const n=document.querySelector('.myf-body'); if(n) n.scrollTop=sc; }
function myAdvSet(k,v){ S.myAdv={...MY_ADV_EMPTY,...(S.myAdv||{}),[k]:v}; myAdvRepaint(); }
function myAdvToggle(k,v){ const a={...MY_ADV_EMPTY,...(S.myAdv||{})}; const cur=[...(a[k]||[])]; const i=cur.indexOf(v); if(i>=0) cur.splice(i,1); else cur.push(v); S.myAdv={...a,[k]:cur}; myAdvRepaint(); }
function myAdvReset(){ S.myAdv={...MY_ADV_EMPTY}; myAdvRepaint(); }
const MYF_CSS=`
.myf{width:272px;flex:none;background:#ffffff;border:1px solid #bfdbfe;border-radius:12px;display:flex;flex-direction:column;overflow:hidden;align-self:flex-start}
.myf-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;border-bottom:1px solid #e2e8f0}
.myf-head strong{display:block;font-size:14px;color:#0f172a}
.myf-head span{display:block;font-size:12px;color:#0f172a;margin-top:2px}
.myf-x{width:30px;height:30px;border:1px solid #bfdbfe;border-radius:8px;background:#ffffff;color:#0f172a;cursor:pointer;font-size:16px;line-height:1;flex:none}
.myf-body{padding:0 16px;max-height:62vh;overflow:auto}
.myf-sec{padding:14px 0;border-bottom:1px solid #e2e8f0}
.myf-sec:last-child{border-bottom:0}
.myf-sec h4{margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#0f172a}
.myf-seg{display:flex;flex-wrap:wrap;gap:6px}
.myf-seg button,.myf-chips button{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border:1px solid #bfdbfe;border-radius:16px;background:#ffffff;color:#0f172a;font:inherit;font-size:13px;cursor:pointer;white-space:nowrap}
.myf-seg button.on,.myf-chips button.on{border-color:#1d4ed8;background:#eff6ff;color:#1d4ed8;font-weight:600}
.myf-chips{display:flex;flex-wrap:wrap;gap:6px}
.myf-chips button i{font-style:normal;font-weight:700}
.myf-select{width:100%;padding:9px 12px;border:1px solid #bfdbfe;border-radius:8px;background:#ffffff;color:#0f172a;font:inherit;font-size:14px}
.myf-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 16px;border-top:1px solid #e2e8f0}
.myf-foot button{padding:8px 12px;border:1px solid #bfdbfe;border-radius:8px;background:#ffffff;color:#0f172a;font:inherit;font-size:13px;cursor:pointer}
.myf-foot span{font-size:13px;color:#0f172a}

.ftip{position:relative}.ftip:hover::after,.ftip:focus-visible::after{content:attr(data-tip);position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#0f172a;color:#ffffff;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:12px;font-weight:500;line-height:1;padding:7px 9px;border-radius:6px;white-space:nowrap;z-index:60;pointer-events:none}`;
function myAdvPanelHTML(){
  const a={...MY_ADV_EMPTY,...(S.myAdv||{})}, n=myAdvCount(a);
  const count=DISC.filter(c=>!c.repo&&myAdvMatch(c,a)).length;
  const seg=(k,opts)=>`<div class="myf-seg" role="radiogroup">${opts.map(([v,l])=>`<button type="button" role="radio" aria-checked="${a[k]===v}" class="${a[k]===v?'on':''}" onclick="myAdvSet('${k}','${v}')">${l}</button>`).join('')}</div>`;
  const chip=(k,v,l)=>{ const on=(a[k]||[]).includes(v); return `<button type="button" aria-pressed="${on}" class="${on?'on':''}" onclick="myAdvToggle('${k}','${v}')">${on?'<i>✓</i>':''}${l}</button>`; };
  return `<aside class="myf" aria-label="Filters">
    <div class="myf-head"><div><strong>Filters</strong><span>${n?n+' active':'None active'}</span></div><button type="button" class="myf-x" aria-label="Close filters" onclick="closeAdvPanel()">×</button></div>
    <div class="myf-body">
      <section class="myf-sec"><h4>Period</h4>${seg('period',[['30','Last 30 days'],['90','Last 90 days']])}</section>
      <section class="myf-sec"><h4>Format</h4><div class="myf-chips">${chip('format','Reels','Reels')}${chip('format','Stories','Stories')}${chip('format','Static','Static posts')}${chip('format','Carousel','Carousel posts')}</div></section>
      <section class="myf-sec"><h4>Performance</h4>${seg('perf',[['Organic','Organic'],['Sponsored','Sponsored collaboration'],['Combined','Combined']])}</section>
      <section class="myf-sec"><h4>Cost</h4><select class="myf-select" aria-label="Cost" onchange="myAdvSet('cost',this.value)"><option value="All" ${a.cost==='All'?'selected':''}>All</option><option value="quote" ${a.cost==='quote'?'selected':''}>Has a quote</option><option value="none" ${a.cost==='none'?'selected':''}>No quote yet</option></select></section>
    </div>
    <div class="myf-foot"><button type="button" onclick="myAdvReset()">Reset all</button><span>${count} creator${count===1?'':'s'}</span></div>
  </aside>`;
}
function discAdvPanel(){ if(S.advScope==='my') return myAdvPanelHTML(); return `<aside class="disc-adv" aria-label="Advanced filters"><div class="disc-adv-head"><strong>Filters</strong><button type="button" class="ds-iconbtn" aria-label="Close filters" onclick="closeAdvPanel()">&times;</button></div><div class="disc-adv-body">${advPanelHTML().split('<!--foot-->')[0]}</div>${advPanelHTML().split('<!--foot-->')[1]}</aside>`; }
/* ── Discover table columns: one per filter, shown or hidden from the Columns picker ── */
const DISC_COLS=[
  {id:'creator',label:'Creator',locked:true},
  {id:'type',label:'Account type'},
  {id:'category',label:'Category'},
  {id:'location',label:'Location'},
  {id:'platform',label:'Platform'},
  {id:'tier',label:'Tier'},
  {id:'followers',label:'Followers',sort:true},
  {id:'engagement',label:'Engagement'},
  {id:'views',label:'Avg views',sort:true},
  {id:'likes',label:'Avg likes',sort:true,off:true},
  {id:'source',label:'Found in'},
  {id:'collabs',label:'Collabs',sort:true,off:true},
  {id:'last',label:'Last seen',off:true}
];
const DISC_NUM={followers:1,engagement:1,views:1,likes:1,collabs:1};
/* Account type and sync state are separate columns (not part of the name cell) */
const accountTypeOf=c=>c.accountType||((c.tags||[]).some(t=>/brand|business/i.test(t))||c.source==='Competitor'?'Business':(avHash(c.id)%5===0?'Personal':'Creator'));
const acctPill=c=>{ const t=accountTypeOf(c); return `<span class="acct-pill is-${t.toLowerCase()}">${t}</span>`; };
const syncStateOf=c=>{ const h=avHash(c.id); return h%7===0?'delayed':h%5===2?'syncing':'synced'; };
const syncCellOf=c=>{
  const st=syncStateOf(c), h=avHash(c.id);
  if(st==='syncing') return `<span class="sync is-busy"><i class="sync-spin" aria-hidden="true"></i>Syncing…</span>`;
  if(st==='delayed') return `<span class="sync is-delayed" tabindex="0"><i aria-hidden="true"></i>Taking longer than usual<button type="button" class="sync-retry" aria-label="Restart sync for ${esc(c.name)}" onclick="event.stopPropagation();toast('Sync restarted · demo')">${discSvg('<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',13)}</button><span class="sync-tip" role="tooltip"><b>Taking longer than usual</b><span>This sync has been running for over 30 minutes and is still retrying. Restart it to try again.</span><small>Last updated Oct 5, 2026 · 6:32 PM</small></span></span>`;
  return `<span class="sync is-ok"><i aria-hidden="true"></i>Synced <small>${['2h','1d','3d','5h'][h%4]} ago</small></span>`;
};
const DISC_CELL={
  type:c=>acctPill(c),
  sync:c=>syncCellOf(c),
  category:c=>`<div class="disc-cats">${catChips(c,1)}</div>`,
  location:c=>esc(c.country||'—'),
  platform:c=>esc((c.platforms||[]).join(', ')),
  tier:c=>tierTag(c.tier),
  followers:c=>fmt(c.followers),
  engagement:c=>`${Number(c.engagement||0).toFixed(2)}%`,
  views:c=>fmt(c.views),
  likes:c=>fmt(c.likes),
  source:c=>dsStatus(c.source),
  collabs:c=>String(c.collabs),
  last:c=>esc(c.last)
};
const DISC_COL_PATHS={
  creator:'<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',
  category:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  location:'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  platform:'<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',
  tier:'<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
  followers:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-4-6.3"/>',
  engagement:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  views:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  likes:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
  source:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  collabs:'<circle cx="12" cy="12" r="9"/><path d="M8 12l2.5 2.5L16 9"/>',
  type:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5h8v2"/>',
  sync:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  last:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'
};
const discSvg=(p,w=16)=>`<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const DISC_FIELD_OPTS={
  country:['Location',c=>esc(c.country||'—')],
  platforms:['Platforms',c=>esc((c.platforms||[]).join(', '))],
  tags:['Categories',c=>catChips(c,3)],
  source:['Found in',c=>dsStatus(c.source)],
  collabs:['Collabs',c=>String(c.collabs)],
  last:['Last seen',c=>esc(c.last)],
  handle:['Handle',c=>esc(c.handle)]
};
function discSettings(){ return {order:S.discColOrder||[],on:S.discColOn||{},labels:S.discColLabel||{},custom:S.discCustom||[]}; }
function discColsFrom(src){
  const base=[...DISC_COLS,...(src.custom||[])];
  const ord=src.order||[];
  if(ord.length) base.sort((a,b)=>{ const ia=ord.indexOf(a.id), ib=ord.indexOf(b.id); return (ia<0?999:ia)-(ib<0?999:ib); });
  return base.map(c=>({...c,label:(src.labels||{})[c.id]||c.label,on:c.locked?true:(c.id in (src.on||{})?src.on[c.id]:!c.off)}));
}
function discCols(){ return discColsFrom(discSettings()); }
function discCellFor(col,c){ return col.custom?DISC_FIELD_OPTS[col.field][1](c):DISC_CELL[col.id](c); }
function discColToggle(id){ const cur=Object.fromEntries(discCols().map(c=>[c.id,c.on])); cur[id]=!cur[id]; S.discColOn=cur; S.discColsOpen=true; keepColsPanel(()=>discRepaint()); }
function discColsToggle(){ S.discColsOpen=!S.discColsOpen; paintBody(); }
function discColSearch(q){ q=q.trim().toLowerCase(); document.querySelectorAll('.disc-col-row').forEach(r=>{ r.style.display=r.dataset.name.includes(q)?'':'none'; }); }
function discColsBtn(){ return `<button type="button" class="ds-btn ds-btn--outline ds-btn--sm${S.discColsOpen?' is-on':''}" aria-expanded="${!!S.discColsOpen}" onclick="discColsToggle()">${discSvg(COLS_SVG,14)}Columns</button>`; }
function discColsPanel(){
  const cols=discCols(), shown=cols.filter(c=>c.on).length;
  const plus=discSvg('<path d="M12 5v14M5 12h14"/>',14), dots=discSvg('<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',14);
  const pin=discSvg('<path d="M12 17v5M9 3h6l-1 6 3 3H7l3-3-1-6z"/>',14), lock=discSvg('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',14);
  const sliders=discSvg('<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',14);
  return `<div class="disc-cols-pop" role="dialog" aria-label="Columns">
    <div class="disc-cols-head"><div><strong>Columns</strong><span>${shown} of ${cols.length} shown · applied as you go</span></div><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="discCfgOpen()">${plus}Add</button></div>
    <div class="disc-cols-search"><input type="search" placeholder="Find a column" aria-label="Find a column" oninput="discColSearch(this.value)"></div>
    <ul class="disc-cols-list">${cols.map(c=>`<li class="disc-col-row${c.locked?' is-locked':''}" data-name="${esc(c.label.toLowerCase())}">
      <span class="disc-col-drag" aria-hidden="true">${dots}</span>
      <input type="checkbox" ${c.on?'checked':''} ${c.locked?'disabled':''} onchange="discColToggle('${c.id}')" aria-label="Show ${esc(c.label)}">
      <span class="disc-col-ico" aria-hidden="true">${discSvg(DISC_COL_PATHS[c.id])}</span>
      <span class="disc-col-name">${esc(c.label)}</span>
      ${c.locked?`<span class="disc-col-lock" aria-label="Pinned">${c.id==='creator'?pin:lock}</span>`:''}
    </li>`).join('')}</ul>
    <div class="disc-cols-foot"><button type="button" class="ds-btn ds-btn--ghost ds-btn--sm" onclick="discCfgOpen()">${sliders}Configure columns</button></div>
  </div>`;
}
/* ── Configure columns dialog: reorder, hide, rename, add your own ── */
function discCfgOpen(){
  const cols=discCols();
  S.discColsOpen=false; S.discCfgOpen=true;
  S.discCfgDraft={order:cols.map(c=>c.id),on:Object.fromEntries(cols.map(c=>[c.id,c.on])),labels:{...(S.discColLabel||{})},custom:[...(S.discCustom||[])],sel:null,drag:null};
  paintBody();
}
function discCfgClose(){ S.discCfgOpen=false; S.discCfgDraft=null; paintBody(); }
function discCfgDone(){ const d=S.discCfgDraft; S.discColOrder=d.order; S.discColOn=d.on; S.discColLabel=d.labels; S.discCustom=d.custom; discCfgClose(); }
function discCfgSelect(id){ S.discCfgDraft.sel=id; discRepaint(); }
function discCfgToggle(id){ const d=S.discCfgDraft; const c=discColsFrom(d).find(x=>x.id===id); d.on={...d.on,[id]:!c.on}; discRepaint(); }
function discCfgRename(id,v){ const d=S.discCfgDraft; const t=(v||'').trim(); d.labels={...d.labels,[id]:t}; const r=document.querySelector(`.disc-cfg-row[data-id="${id}"] .disc-cfg-name`); if(r) r.textContent=t||(discColsFrom(d).find(x=>x.id===id)||{}).label||''; }
function discCfgField(id,v){ const d=S.discCfgDraft; d.custom=d.custom.map(c=>c.id===id?{...c,field:v}:c); discRepaint(); }
function discCfgDelete(id){ const d=S.discCfgDraft; d.custom=d.custom.filter(c=>c.id!==id); d.order=d.order.filter(x=>x!==id); d.sel=null; discRepaint(); }
function discCfgNew(){ const d=S.discCfgDraft; const id='c'+Date.now(); d.custom=[...d.custom,{id,label:'New column',custom:true,field:'country'}]; d.on={...d.on,[id]:true}; d.order=[...d.order,id]; d.sel=id; discRepaint(); }
function discCfgDrag(id){ S.discCfgDraft.drag=id; }
function discCfgDrop(target){ const d=S.discCfgDraft; if(!d.drag||d.drag===target||target==='creator') { d.drag=null; return; } const ord=d.order.filter(x=>x!==d.drag); ord.splice(ord.indexOf(target),0,d.drag); d.order=ord; d.drag=null; discRepaint(); }
function discCfgHTML(){
  const d=S.discCfgDraft, cols=discColsFrom(d), shown=cols.filter(c=>c.on).length;
  const sel=cols.find(c=>c.id===d.sel)||null;
  const dots=discSvg('<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',14);
  const pin=discSvg('<path d="M12 17v5M9 3h6l-1 6 3 3H7l3-3-1-6z"/>',14), lock=discSvg('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',14);
  const plus=discSvg('<path d="M12 5v14M5 12h14"/>',14);
  const row=c=>`<li class="disc-cfg-row${c.locked?' is-locked':''}${d.sel===c.id?' is-sel':''}" ${c.locked?'':'draggable="true"'} data-id="${c.id}" ondragstart="discCfgDrag('${c.id}')" ondragover="event.preventDefault()" ondrop="event.preventDefault();discCfgDrop('${c.id}')" onclick="discCfgSelect('${c.id}')">
      <span class="disc-cfg-grip" aria-hidden="true">${c.locked?'':dots}</span>
      <input type="checkbox" ${c.on?'checked':''} ${c.locked?'disabled':''} onclick="event.stopPropagation()" onchange="discCfgToggle('${c.id}')" aria-label="Show ${esc(c.label)}">
      <span class="disc-cfg-ico" aria-hidden="true">${discSvg(c.custom?'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>':DISC_COL_PATHS[c.id])}</span>
      <span class="disc-cfg-name">${esc(c.label)}</span>
      ${c.locked?`<span class="disc-cfg-pin">${c.id==='creator'?pin:lock}</span>`:''}
    </li>`;
  const sep='<li class="disc-cfg-sep" aria-hidden="true"></li>';
  const list=cols.map((c,i)=>(i===1?sep:'')+row(c)).join('');
  const actionsRow=`${sep}<li class="disc-cfg-row is-locked"><span class="disc-cfg-grip" aria-hidden="true"></span><input type="checkbox" checked disabled aria-label="Actions"><span class="disc-cfg-ico" aria-hidden="true"></span><span class="disc-cfg-name">Actions</span><span class="disc-cfg-pin">${pin}</span></li>`;
  const editor=sel?`<div class="disc-cfg-editor">
      <h4>${esc(sel.label)}</h4>
      <label class="disc-cfg-field"><span>Name</span><input value="${esc(sel.label)}" ${sel.locked?'disabled':''} oninput="discCfgRename('${sel.id}',this.value)"></label>
      <label class="disc-cfg-check"><input type="checkbox" ${sel.on?'checked':''} ${sel.locked?'disabled':''} onchange="discCfgToggle('${sel.id}')"><span>Show in table</span></label>
      ${sel.custom?`<label class="disc-cfg-field"><span>Data</span><select onchange="discCfgField('${sel.id}',this.value)">${Object.keys(DISC_FIELD_OPTS).map(k=>`<option value="${k}" ${sel.field===k?'selected':''}>${DISC_FIELD_OPTS[k][0]}</option>`).join('')}</select></label>
      <button type="button" class="ds-btn ds-btn--ghost ds-btn--sm disc-cfg-del" onclick="discCfgDelete('${sel.id}')">Delete column</button>`:''}
      ${sel.locked?`<p class="disc-note">${sel.id==='creator'?'Creator stays pinned at the left of the table.':''}</p>`:''}
    </div>`:`<div class="disc-cfg-empty">
      <span class="disc-cfg-empty-ico">${discSvg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>',22)}</span>
      <strong>Select a column to edit</strong>
      <p>Rename it, hide it, or see what the table has fixed in place.</p>
      <button type="button" class="ds-btn ds-btn--outline" onclick="discCfgNew()">${plus}New column</button>
    </div>`;
  return `<div class="disc-cfg-scrim" onclick="if(event.target===this)discCfgClose()">
    <div class="disc-cfg" role="dialog" aria-modal="true" aria-label="Configure columns">
      <div class="disc-cfg-head"><div><h3>Configure columns</h3><p>Reorder them, hide the ones you don't need, and make columns of your own.</p></div><button type="button" class="ds-iconbtn" aria-label="Close" onclick="discCfgClose()">&times;</button></div>
      <div class="disc-cfg-split">
        <div class="disc-cfg-list">
          <div class="disc-cfg-listhead"><div><strong>Columns</strong><span>${shown} of ${cols.length} shown</span></div><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="discCfgNew()">${plus}New column</button></div>
          <ul>${list}${actionsRow}</ul>
        </div>
        <div class="disc-cfg-edit">${editor}</div>
      </div>
      <div class="disc-cfg-foot"><button type="button" class="ds-btn ds-btn--ghost" onclick="discCfgClose()">Cancel</button><button type="button" class="ds-btn ds-btn--primary" onclick="discCfgDone()">Done</button></div>
    </div></div>`;
}
function addToMenuHTML(creatorId,inMyCreators=false){
 const I={plus:'<path d="M12 5v14M5 12h14"/>',chev:'<path d="m6 9 6 6 6-6"/>',user:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>',bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',flag:'<path d="M4 21V4h12l-2 4 2 4H4"/>',megaphone:'<path d="M3 11v2a1 1 0 0 0 1 1h2l6 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a4 4 0 0 1 0 6"/>',userX:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 11l5 5M21 11l-5 5"/>'};
 return `<details class="ds-more addto-menu"><summary class="ds-btn ds-btn--outline ds-btn--sm">${discSvg(I.plus,14)}Add to${discSvg(I.chev,13)}</summary><div class="ds-more-menu" role="menu">
 ${inMyCreators?`<button type="button" role="menuitem" class="is-danger" onclick="removeFromMy('${creatorId}')">${discSvg(I.userX,15)}Remove from My creators</button>`:`<button type="button" role="menuitem" onclick="addToCreator('${creatorId}','my')">${discSvg(I.user,15)}My creators</button>`}
 <button type="button" role="menuitem" onclick="openAddToTarget('${creatorId}','collection')">${discSvg(I.bookmark,15)}Collection</button>
  <button type="button" role="menuitem" onclick="openAddToTarget('${creatorId}','campaign')">${discSvg(I.megaphone,15)}Campaign</button>
 </div></details>`;
}
/* Removes a creator from My creators (they stay in Discover and collections) */
function removeFromMy(creatorId){
  const c=crOf(creatorId); if(!c) return;
  c.repo=true; S.discAdded=(S.discAdded||[]).filter(x=>x!==creatorId);
  paintBody(); toast(`${c.name} removed from My creators`);
}
function addToCreator(creatorId,target,id){
 const c=crOf(creatorId);if(!c)return;
 if(target==='my'){
  if(!isInMy(creatorId))S.discAdded.push(creatorId);
  c.repo=false;
  paintBody();toast(`${c.name} added to My creators`);return;
 }
 if(target==='collection'){
  colBoot();const col=colOf(id);if(!col)return;
  col.creatorIds=col.creatorIds||[];if(!col.creatorIds.includes(creatorId))col.creatorIds.push(creatorId);colSave();
  closeLayer();paintBody();toast(`${c.name} added to ${col.name}`);return;
 }
 if(target==='plan'){
  const p=planOf(id);if(!p)return;
  p.creators=p.creators||[];if(!p.creators.includes(creatorId))p.creators.push(creatorId);
  invalidatePlanApproval(p);closeLayer();paintBody();toast(`${c.name} added to ${p.name}`);return;
 }
 if(target==='campaign'){
  const camp=campOf(id);if(!camp)return;
  camp.creatorIds=camp.creatorIds||[];if(!camp.creatorIds.includes(creatorId))camp.creatorIds.push(creatorId);
  closeLayer();paintBody();toast(`${c.name} added to ${camp.name}`);return;
 }
}
function blacklistCreator(id){
 const c=crOf(id);if(!c)return;
 S.blacklisted=S.blacklisted||[];if(!S.blacklisted.includes(id))S.blacklisted.push(id);
 closeLayer();paintBody();toast(`${c.name} added to blacklist`);
}
function openAddToTarget(creatorId,target){
 const c=crOf(creatorId);if(!c)return;
 if(target==='campaign'){ cpOpen([creatorId]); return; }
 colBoot();
 const defs={
  collection:{title:'Add to collection',desc:'Choose a reusable creator collection.',label:'Collection',items:CREATOR_COLLECTIONS.map(x=>({id:x.id,name:x.name,meta:`${(x.creatorIds||[]).length} creators`}))},
  plan:{title:'Add to campaign plan',desc:'The creator joins the plan’s candidate pool. They are not shortlisted automatically.',label:'Campaign plan',items:CAMP_PLANS.map(x=>({id:x.id,name:x.name,meta:`${planStageOf(x)} · ${x.shortlisted.length} shortlisted`}))},
  campaign:{title:'Add to campaign',desc:'Choose an existing campaign to associate this creator with.',label:'Campaign',items:CAMP_LIST.map(x=>({id:x.id,name:x.name,meta:`${x.status} · ${(x.creatorIds||[]).length} creators`}))}
 }[target];
 if(!defs||!defs.items.length)return toast('No matching destination is available');
 const opts=defs.items.map(x=>`<option value="${esc(x.id)}">${esc(x.name)} · ${esc(x.meta)}</option>`).join('');
 dlg(defs.title,`${esc(c.name)} · ${esc(c.handle)}<p class="ds-caption">${defs.desc}</p>`,
  `<label class="ds-field"><span>${defs.label}</span><select id="addToTargetId">${opts}</select></label>`,
  `<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="addToCreator('${creatorId}','${target}',document.getElementById('addToTargetId').value)">Add creator</button>`);
}
function clearDiscSel(){S.discSel=[];paintBody();}
function toggleDiscSel(id,on){const a=new Set(S.discSel||[]);on?a.add(id):a.delete(id);S.discSel=[...a];paintBody();}
function toggleDiscAll(on){const ids=S.discVisIds||[];const a=new Set(S.discSel||[]);ids.forEach(id=>on?a.add(id):a.delete(id));S.discSel=[...a];paintBody();}
function discBulkBarHTML(){
 const ids=(S.discSel||[]).filter(id=>DISC.some(c=>c.id===id)),n=ids.length;if(!n)return '';
 const btn=(label,t)=>`<button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="discBulkAction('${t}')">${label}</button>`;
 return `<div class="ds-bulk" role="region" aria-label="Discover bulk actions"><b>${n} creator${n===1?'':'s'} selected</b><span class="ds-caption">Apply an action to the selected creators</span><span class="ds-spacer"></span>${btn('My creators','my')}${btn('Collection','collection')}${btn('Campaign','campaign')}${btn('Add tag','tag')}<button type="button" class="ds-btn ds-btn--ghost ds-btn--sm" onclick="clearDiscSel()">Clear</button></div>`;
}
/* Custom tags in Discover: filter by keyword first, then tag the results (or a selection) in one go */
function discTagOpen(scope){
 const ids=scope==='all'?(S.discVisIds||[]):(S.discSel||[]).filter(id=>DISC.some(c=>c.id===id));
 if(!ids.length) return toast('No creators to tag');
 S.discTagIds=[...ids];
 const kw=(S.discFilter||'').trim(), pool=[...new Set(DISC.flatMap(c=>crTagsOf(c.id)))].sort((a,b)=>a.localeCompare(b));
 dlg('Add a custom tag',`${ids.length} creator${ids.length===1?'':'s'}${kw&&scope==='all'?` matching “${esc(kw)}”`:' selected'} will get this tag.`,
  `<label class="ds-field"><span>Tag</span><input id="discTagName" list="discTagPool" maxlength="32" placeholder="e.g. Diwali skincare" autocomplete="off" onkeydown="if(event.key==='Enter'){event.preventDefault();discTagApply()}"><datalist id="discTagPool">${pool.map(t=>`<option value="${esc(t)}">`).join('')}</datalist></label>`,
  `<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="discTagApply()">Add tag</button>`);
 setTimeout(()=>document.getElementById('discTagName')?.focus(),0);
}
function discTagApply(){
 const name=dlgVal('discTagName').replace(/\s+/g,' '); if(!name) return toast('Enter a tag name');
 const ids=S.discTagIds||[]; let n=0;
 ids.forEach(id=>{ const t=crTagsOf(id); if(!t.some(x=>x.toLowerCase()===name.toLowerCase())){ crTagsSet(id,[...t,name]); n++; } });
 S.discTagIds=null; S.discSel=[]; closeLayer(); paintBody();
 toast(n?`“${name}” added to ${n} creator${n===1?'':'s'}`:`All of them already have “${name}”`);
}
function discBulkAction(target){
 if(target==='tag') return discTagOpen('sel');
 const ids=(S.discSel||[]).filter(id=>DISC.some(c=>c.id===id));if(!ids.length)return;
 if(target==='campaign'){ cpOpen(ids); return; }
 if(target==='my'){ids.forEach(id=>{const c=crOf(id);if(!isInMy(id))S.discAdded.push(id);if(c)c.repo=false;});S.discSel=[];paintBody();toast(`${ids.length} creator${ids.length===1?'':'s'} added to My creators`);return;}
 colBoot();
 const defs={collection:{title:'Add selected creators to collection',label:'Collection',items:CREATOR_COLLECTIONS.map(x=>({id:x.id,name:x.name,meta:`${(x.creatorIds||[]).length} creators`}))},plan:{title:'Add selected creators to campaign plan',label:'Campaign plan',items:CAMP_PLANS.map(x=>({id:x.id,name:x.name,meta:`${planStageOf(x)} · ${x.shortlisted.length} shortlisted`}))},campaign:{title:'Add selected creators to campaign',label:'Campaign',items:CAMP_LIST.map(x=>({id:x.id,name:x.name,meta:`${x.status} · ${(x.creatorIds||[]).length} creators`}))}}[target];
 if(!defs||!defs.items.length)return toast('No matching destination is available');
 const opts=defs.items.map(x=>`<option value="${esc(x.id)}">${esc(x.name)} · ${esc(x.meta)}</option>`).join('');
 dlg(defs.title,`${ids.length} creators selected. Choose where to add them.`,`<label class="ds-field"><span>${defs.label}</span><select id="discBulkTargetId">${opts}</select></label>`,`<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="discBulkApply('${target}',document.getElementById('discBulkTargetId').value)">Add ${ids.length} creators</button>`);
}
function discBulkApply(target,id){
 const ids=(S.discSel||[]).filter(cid=>DISC.some(c=>c.id===cid));if(!ids.length)return;
 colBoot();
 if(target==='collection'){const c=colOf(id);if(!c)return;c.creatorIds=c.creatorIds||[];ids.forEach(cid=>{if(!c.creatorIds.includes(cid))c.creatorIds.push(cid);});colSave();}
 if(target==='plan'){const p=planOf(id);if(!p)return;p.creators=p.creators||[];ids.forEach(cid=>{if(!p.creators.includes(cid))p.creators.push(cid);});invalidatePlanApproval(p);}
 if(target==='campaign'){const c=campOf(id);if(!c)return;c.creatorIds=c.creatorIds||[];ids.forEach(cid=>{if(!c.creatorIds.includes(cid))c.creatorIds.push(cid);});}
 const n=ids.length;S.discSel=[];closeLayer();paintBody();toast(`${n} creator${n===1?'':'s'} added successfully`);
}

const DISC_TRY=['Micro beauty creators in India with ER above 4%','Macro skincare creators on Instagram','Mega beauty creators on Instagram','Micro skincare creators in India','Macro beauty creators with 50k-300k followers','Travel creators in India'];
function discTryHTML(){return `<div class="disc-try"><span class="disc-try-lab">Try:</span>${DISC_TRY.map(q=>`<button type="button" class="disc-chip" onclick="discTry('q','${q}')">${esc(q)}</button>`).join('')}</div>`;}
const AI_STOP=new Set(['creators','creator','in','with','for','on','the','and','who','have','done','above','below','over','under','followers','collabs','collab','of','a','an','to','er','india']);
const AI_FILTER_WORDS=['nano','micro','macro','mega','instagram','tiktok','youtube'];
function aiParse(q){const w=String(q||'').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);return {tier:['Nano','Micro','Macro','Mega'].find(t=>w.includes(t.toLowerCase())),platform:['Instagram','TikTok','YouTube'].find(p=>w.includes(p.toLowerCase())),terms:w.filter(x=>!AI_STOP.has(x)&&!AI_FILTER_WORDS.includes(x)&&!/^\d/.test(x))};}
function aiMatch(c,q){const p=aiParse(q);const hay=[c.name,c.handle,c.tier,...(c.tags||[])].join(' ').toLowerCase();if(p.tier&&c.tier!==p.tier)return false;return p.terms.every(t=>hay.includes(t));}
function discTry(kind,v){ if(kind==='tier')S.discTier=v; else { const p=aiParse(v); if(p.platform)S.discPlatform=p.platform; S.discFilter=v; } paintBody(); }
/* ===== Manual creator tags + shared Add-to-campaign picker ===== */
const TG_CSS=`<style>
/* Tags column: one basic style for every table (Discover, My creators, Draft plan, Live campaign) */
.tg-cell{display:flex;gap:4px;align-items:center;flex-wrap:nowrap;white-space:nowrap;min-width:0;font-size:12px;line-height:1.2}
.tg-cell .ds-chip{height:22px;padding:0 7px;font-size:12px;max-width:104px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:#ffffff;cursor:default;font-weight:400}
.tg-x{border:0;background:none;padding:0;margin-left:4px;cursor:pointer;color:#94a3b8;font-size:12px;line-height:1;opacity:0}
.tg-chip:hover .tg-x,.tg-chip:focus-within .tg-x,.tg-x:focus-visible{opacity:1}
.tg-x:hover{color:#1e40af}
.tg-x:focus-visible{outline:2px solid #1d4ed8;outline-offset:1px}
button.tg-more{cursor:pointer;font:inherit;position:relative}
button.tg-more:hover{background:#f8fafc}
.tg-more:hover::after,.tg-more:focus-visible::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#0f172a;color:#ffffff;font:500 12px/1.3 system-ui,-apple-system,sans-serif;padding:6px 8px;border-radius:6px;white-space:nowrap;z-index:5;pointer-events:none}
.tg-in{font:inherit;font-size:12px;width:76px;flex:none;border:1px solid transparent;border-radius:4px;padding:2px 4px;height:22px;box-sizing:border-box;background:transparent;color:#0f172a}
.tg-in::placeholder{color:#94a3b8}
.tg-in:hover{border-color:#dbeafe}
.tg-in:focus{outline:none;border-color:#1d4ed8;background:#ffffff;width:116px}
.tg-edit{border:0;background:none;cursor:pointer;color:#64748b;padding:4px;border-radius:6px;display:inline-flex}
.tg-edit:hover{background:#f1f5f9;color:#0f172a}
.tg-menu{min-width:220px;max-height:320px;overflow:auto}
.tg-opt{display:flex;gap:8px;align-items:center;padding:7px 10px;font-size:13px;color:#0f172a;border-radius:6px;cursor:pointer}
.tg-opt:hover{background:#f1f5f9}
.tg-clear{margin:4px 6px 2px;font-size:12px;color:#1d4ed8;background:none;border:0;cursor:pointer;padding:4px}
.tg-empty{padding:8px 10px;font-size:12px;color:#64748b}
</style>`;
const CR_TAG_SEED={cr1:['Gifting','Priority'],cr2:['Celebrity','Hold'],cr3:['Wellness','Budget','Reels'],cr4:['Q4','Shortlist','Reels'],cr5:['Tech','Long-term'],cr6:['Fashion','Sale','Q4'],cr7:['Beauty'],cr8:['Skincare','Local']};
const CR_TAG_POOL=['Priority','Shortlist','Q4','Reels','Budget','Gifting','Long-term','Sale','Local','Hold'];
function crTagsOf(cid){
  if(S.crTags&&S.crTags[cid]) return S.crTags[cid];
  if(CR_TAG_SEED[cid]) return CR_TAG_SEED[cid];
  const h=avHash(cid); return [CR_TAG_POOL[h%CR_TAG_POOL.length], CR_TAG_POOL[(h>>>5)%CR_TAG_POOL.length]].filter((x,i,a)=>a.indexOf(x)===i);
}
function crTagsSet(cid,arr){ S.crTags=S.crTags||{}; S.crTags[cid]=arr; }
function tagCellHTML(cid,ro){
  const t=crTagsOf(cid), open=!!(S.tgExp&&S.tgExp[cid]);
  if(ro&&!t.length) return '<span class="ds-table-meta">—</span>';
  const shown=open?t:t.slice(0,2), rest=t.slice(2);
  const chips=shown.map((x,i)=>`<span class="ds-chip tg-chip" title="${esc(x)}">${esc(x)}<button type="button" class="tg-x" aria-label="Remove tag ${esc(x)}" onclick="event.stopPropagation();tagRemoveAt('${cid}',${i})">×</button></span>`).join('');
  const more=rest.length?`<button type="button" class="ds-chip tg-more" data-tip="${esc(rest.join(', '))}" aria-expanded="${open}" aria-label="${rest.length} more tags: ${esc(rest.join(', '))}" onclick="event.stopPropagation();tagToggleMore('${cid}')">${open?'Show less':'+'+rest.length}</button>`:'';
  if(ro) return `<div class="tg-cell" onclick="event.stopPropagation()">${chips}${more}</div>`;
  return `<div class="tg-cell" onclick="event.stopPropagation()">${chips}${more}<input class="tg-in" data-tgin="${cid}" placeholder="+ Add tag" maxlength="32" aria-label="Add a tag" onkeydown="event.stopPropagation();if(event.key==='Enter'){event.preventDefault();tagAddInline('${cid}',this)}"></div>`;
}
function tagToggleMore(cid){ S.tgExp=S.tgExp||{}; S.tgExp[cid]=!S.tgExp[cid]; paintBody(); }
function tagAddInline(cid,el){
  const name=(el.value||'').trim().replace(/\s+/g,' ');
  if(!name) return;
  const t=crTagsOf(cid);
  if(t.some(x=>x.toLowerCase()===name.toLowerCase())){ toast('That tag is already on this creator'); return; }
  crTagsSet(cid,[...t,name]); paintBody();
  setTimeout(()=>document.querySelector(`[data-tgin="${cid}"]`)?.focus(),0);
}
function tagRemoveAt(cid,i){ const t=crTagsOf(cid); crTagsSet(cid,t.filter((_,j)=>j!==i)); paintBody(); }
/* Filter: multi-select dropdown. A creator matches when it has any selected tag. */
function tagFilterOK(key,cid){ const s=(S.tagF&&S.tagF[key])||[]; return !s.length||crTagsOf(cid).some(t=>s.includes(t)); }
function tagMenuToggle(key){ S.tagMenu=S.tagMenu===key?null:key; paintBody(); }
function tagFilterSet(key,i,on){
  const all=S.tagAllList||[], tag=all[i]; if(tag==null) return;
  S.tagF=S.tagF||{}; const cur=S.tagF[key]||[];
  S.tagF[key]=on?[...new Set([...cur,tag])]:cur.filter(x=>x!==tag);
  paintBody();
}
function tagFilterClear(key){ S.tagF=S.tagF||{}; S.tagF[key]=[]; paintBody(); }
function tagFilterHTML(key){
  const sel=(S.tagF&&S.tagF[key])||[];
  const all=[...new Set(DISC.flatMap(c=>crTagsOf(c.id)))].sort((a,b)=>a.localeCompare(b));
  S.tagAllList=all;
  const open=S.tagMenu===key;
  const body=all.length?all.map((t,i)=>`<label class="tg-opt"><input type="checkbox" ${sel.includes(t)?'checked':''} onchange="tagFilterSet('${key}',${i},this.checked)"> ${esc(t)}</label>`).join(''):'<div class="tg-empty">No tags yet. Add tags from a creator row.</div>';
  return `${TG_CSS}<div class="dd" data-tgmenu><button type="button" class="ds-btn ds-btn--outline ds-btn--sm${sel.length?' is-on':''}" aria-haspopup="listbox" aria-expanded="${open}" onclick="event.stopPropagation();tagMenuToggle('${key}')">Tags${sel.length?` · ${sel.length}`:''} ${icon('chevDown','ico-sm')}</button>${open?`<div class="menu tg-menu" role="listbox" aria-multiselectable="true">${body}${sel.length?`<button type="button" class="tg-clear" onclick="tagFilterClear('${key}')">Clear tags</button>`:''}</div>`:''}</div>`;
}
/* Add creators to a campaign. One picker for both kinds: the user picks the campaign first, then the Draft or Live tab. */
const CP_CSS=`<style>
.cpm{display:flex;flex-direction:column;gap:14px}
.cpm-who{display:flex;align-items:center;gap:12px;min-width:0}
.cpm-who .ds-avatar{flex:none}
.cpm-who-txt{display:flex;flex-direction:column;min-width:0}
.cpm-who-txt b{font-size:14px;font-weight:600;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cpm-who-txt span{font-size:12px;color:#64748b;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cpm-tabs{display:flex;gap:12px;border-bottom:1px solid #dbeafe;overflow-x:auto}
.cpm-tab{font:inherit;font-size:13px;font-weight:500;background:none;border:0;padding:8px 0 10px;flex:none;color:#64748b;cursor:pointer;display:inline-flex;gap:4px;align-items:center;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap}
.cpm-tab:hover{color:#1e40af}
.cpm-tab.is-on{color:#0f172a;font-weight:600;border-bottom-color:#1d4ed8}
.cpm-tab i{font-style:normal;font-size:12px;color:#64748b;font-weight:500}
.cpm-q{font:inherit;font-size:13px;width:100%;box-sizing:border-box;height:36px;border:1px solid #bfdbfe;border-radius:8px;padding:0 12px;background:#ffffff;color:#0f172a;margin-top:12px}
.cpm-q::placeholder{color:#94a3b8}
.cpm-q:focus{outline:none;border-color:#1d4ed8;box-shadow:0 0 0 3px #eff6ff}
.cpm-list{display:flex;flex-direction:column;max-height:320px;overflow:auto;margin-top:8px;border:1px solid #dbeafe;border-radius:8px}
.cpm-item,.cpm-new{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:0;border-bottom:1px solid #f1f5f9;background:#ffffff;padding:12px 14px;cursor:pointer;font:inherit;color:inherit;border-radius:0}
.cpm-item:hover,.cpm-new:hover{background:#f8fafc}
.cpm-item:focus-visible,.cpm-new:focus-visible{outline:2px solid #1d4ed8;outline-offset:-2px}
.cpm-item.is-on{background:#eff6ff}
.cpm-radio{width:16px;height:16px;border-radius:16px;border:1.5px solid #bfdbfe;flex:none;background:#ffffff}
.cpm-item.is-on .cpm-radio{border-color:#1d4ed8;background:#1d4ed8;box-shadow:inset 0 0 0 3px #ffffff}
.cpm-txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.cpm-name{display:flex;align-items:center;gap:8px;min-width:0}
.cpm-name b{font-size:14px;color:#0f172a;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cpm-item.is-on .cpm-name b{font-weight:600}
.cpm-txt small{font-size:12px;color:#64748b}
.cpm-new{border-top:1px solid #dbeafe;border-bottom:0;color:#1d4ed8}
.cpm-new .cpm-txt b{color:#1d4ed8;font-weight:600;font-size:14px}
.cpm-new-ico{width:16px;height:16px;display:grid;place-items:center;font-size:16px;line-height:1;color:#1d4ed8;flex:none}
.cpm-empty{padding:28px 12px;text-align:center;color:#64748b;font-size:13px}
.cpm-sum{font-size:13px;color:#1e40af}
.cpm-sum b{color:#0f172a;font-weight:600}
</style>`;
/* Campaigns for the picker, grouped by status. Plans that are still being prepared are Draft; launched ones are Live. */
const CP_CATS=[['all','All'],['live','Live'],['draft','Draft'],['paused','Paused'],['completed','Completed']];
function cpAll(){
  const camps=CAMP_LIST.map(c=>({id:c.id,kind:'camp',name:c.name,cat:c.status==='Active'?'live':c.status==='Completed'?'completed':c.status==='Paused'?'paused':'draft',status:c.status,n:(c.creatorIds||[]).length,meta:`${(c.creatorIds||[]).length} creators · ${(c.posts||[]).length} posts`}));
  const plans=CAMP_PLANS.filter(p=>planStageOf(p)!=='Active').map(p=>{const st=planStageOf(p);
    const cat=st==='On Hold'?'paused':st==='Completed'?'completed':'draft';
    return {id:p.id,kind:'plan',name:p.name,cat,status:st,n:(p.creators||[]).length,meta:`${(p.creators||[]).length} creators · ${p.product||'Campaign plan'}`};});
  return [...camps,...plans];
}
const CP_BADGE={live:['success','Live'],draft:['outline',null],paused:['warn',null],completed:['outline',null]};
function cpItems(cat){ const all=cpAll(); return cat==='all'?all:all.filter(x=>x.cat===cat); }
function cpOpen(ids){
  const list=(ids||[]).filter(id=>crOf(id));
  if(!list.length) return toast('Select at least one creator');
  S.cp={ids:list,tab:'all',pick:null,q:''};
  cpPaint();
}
function cpPaint(){
  const s=S.cp; if(!s) return;
  const n=s.ids.length;
  const q=s.q.toLowerCase().trim();
  const inTab=cpItems(s.tab);
  const items=inTab.filter(x=>!q||x.name.toLowerCase().includes(q));
  const picked=s.pick?cpAll().find(x=>x.id===s.pick):null;
  const first=crOf(s.ids[0])||{};
  const who=n===1
    ?`${dsAv(first.id,first.name)}<div class="cpm-who-txt"><b>${esc(first.name||'')}</b><span>${esc(first.handle||'')}</span></div>`
    :`<div class="cpm-who-txt"><b>${n} creators</b><span>${s.ids.slice(0,3).map(id=>esc(cNameOf(id))).join(', ')}${n>3?` +${n-3} more`:''}</span></div>`;
  const tabs=CP_CATS.map(([k,l])=>`<button type="button" role="tab" aria-selected="${s.tab===k}" class="cpm-tab${s.tab===k?' is-on':''}" onclick="cpTab('${k}')">${l}<i>${cpItems(k).length}</i></button>`).join('');
  const badge=x=>{const [kind,lbl]=CP_BADGE[x.cat]||['outline'];return dsBadge(lbl||x.status,kind);};
  const rows=items.length?items.map(x=>{const on=s.pick===x.id;
    return `<button type="button" role="radio" aria-checked="${on}" class="cpm-item${on?' is-on':''}" onclick="cpPick('${x.id}')"><span class="cpm-radio" aria-hidden="true"></span><span class="cpm-txt"><span class="cpm-name"><b>${esc(x.name)}</b>${badge(x)}</span><small>${esc(x.meta)}</small></span></button>`;}).join('')
    :`<div class="cpm-empty">No ${s.tab==='all'?'':CP_CATS.find(c=>c[0]===s.tab)[1].toLowerCase()+' '}campaigns${q?' match this search':' yet'}.</div>`;
  const summary=picked?`Adds ${n===1?`<b>${esc(cNameOf(s.ids[0]))}</b>`:`<b>${n} creators</b>`} to <b>${esc(picked.name)}</b>.`:'Select a campaign to add ' + (n===1?'this creator':'these creators')+'.';
  const newRow=`<button type="button" class="cpm-new" onclick="cpNewCampaign()"><span class="cpm-new-ico" aria-hidden="true">+</span><span class="cpm-txt"><b>New campaign with ${n===1?'this creator':'these creators'}</b><small>Opens the campaign form with the selection</small></span></button>`;
  const body=`${CP_CSS}<div class="cpm">
    <div class="cpm-who">${who}</div>
    <div><div class="cpm-tabs" role="tablist" aria-label="Campaign status">${tabs}</div>
    <input class="cpm-q" type="search" placeholder="Search campaigns" aria-label="Search campaigns" value="${esc(s.q)}" oninput="cpSearch(this.value)">
    <div class="cpm-list" role="radiogroup" aria-label="Campaigns">${rows}${newRow}</div></div>
    <div class="cpm-sum" aria-live="polite">${summary}</div></div>`;
  showModal(n===1?'Add to campaign':`Add ${n} creators to a campaign`,body,`<button type="button" class="ds-btn ds-btn--primary" ${s.pick?'':'disabled'} onclick="cpSubmit()">${picked?`Add to ${esc(picked.name)}`:'Add'}</button>`);
  setTimeout(()=>{ const el=document.querySelector('.cpm-q'); if(el&&s.q){ el.focus(); el.setSelectionRange(el.value.length,el.value.length); } },0);
}
function cpTab(k){ if(!S.cp) return; S.cp.tab=k; S.cp.pick=null; cpPaint(); }
function cpPick(id){ if(!S.cp) return; S.cp.pick=id; cpPaint(); }
function cpSearch(v){ if(!S.cp) return; S.cp.q=v; cpPaint(); }
/* New campaign from the picker: the campaign form opens with these creators as the starting selection */
function cpNewCampaign(){
  if(!S.cp) return;
  const ids=[...S.cp.ids]; S.cp=null; closeLayer();
  S.ccPresetPending=ids; openCampaignForm('new');
}
function cpSubmit(){
  const s=S.cp; if(!s||!s.pick) return;
  const it=cpAll().find(x=>x.id===s.pick); if(!it) return;
  let added=0;
  if(it.kind==='plan'){ const p=planOf(it.id); p.creators=p.creators||[]; s.ids.forEach(id=>{ if(!p.creators.includes(id)){ p.creators.push(id); added++; } }); }
  else { const c=CAMP_LIST.find(x=>x.id===it.id); c.creatorIds=c.creatorIds||[]; s.ids.forEach(id=>{ if(!c.creatorIds.includes(id)){ c.creatorIds.push(id); added++; } }); }
  const n=s.ids.length;
  S.cp=null; if(n>1){ S.discSel=[]; S.mySel=[]; }
  closeLayer(); paintBody();
  toast(added?`${added} creator${added===1?'':'s'} added to ${it.name}`:`Already in ${it.name}`);
}
function collectionAddCampaign(id){ const c=colOf(id); if(c) cpOpen(c.creatorIds||[]); }
if(!window.__tgDdBound){
  window.__tgDdBound=true;
  document.addEventListener('click',e=>{
    if((S.tagMenu)&&!e.target.closest('[data-tgmenu]')){ S.tagMenu=null; paintBody(); }
  });
}
function discoverHTML(){ S.advScope='disc';
  const q=S.discFilter.toLowerCase().trim();
  const dbMeta=S.discDb==='Meta Marketplace';
  const list=dbMeta?[]:DISC.filter(c=>!(S.blacklisted||[]).includes(c.id)&&aiMatch(c,S.discFilter)&&(S.discTier==='All'||c.tier===S.discTier)&&(S.discSource==='All content'||c.source===S.discSource)&&advMatch(c)&&(c.platforms||['Instagram']).includes(S.discPlatform||'Instagram')&&tagFilterOK('disc',c.id));
  list.sort((a,b)=>Number(isInMy(a.id))-Number(isInMy(b.id)));
  const count=k=>DISC.filter(c=>c.source===k).length;
  const collabs=DISC.reduce((n,c)=>n+c.collabs,0);
  const view=S.discView||'table';
  const adv=S.discAdv||DISC_ADV_EMPTY, advN=['cat','location','minFollowers','maxFollowers','minEng','maxEng','avgViewsMin','avgViewsMax','audienceCountry','gender','audienceQuality','brandSearch'].filter(k=>adv[k]).length+['ages','interests','languages','sponsored'].reduce((n,k)=>n+(adv[k]||[]).length,0)+(adv.collab&&adv.collab!=='any'?1:0);
  const advBtn=`<style>.ftip{position:relative}.ftip:hover::after,.ftip:focus-visible::after{content:attr(data-tip);position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#0f172a;color:#ffffff;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:12px;font-weight:500;line-height:1;padding:7px 9px;border-radius:6px;white-space:nowrap;z-index:60;pointer-events:none}</style><button type="button" class="ds-btn ds-btn--outline ds-btn--sm ftip${S.discAdvOpen?' is-on':''}" style="width:36px;height:36px;padding:0;justify-content:center;border-color:#1d4ed8;color:#1d4ed8" onclick="openDiscAdvanced()" data-tip="Advanced filters" aria-label="Advanced filters">${discSvg('<path d="M3 4h18l-7 8.5V19l-4 2v-8.5z"/>',16)}${advN?`<span class="ds-count">${advN}</span>`:''}</button>`;
  const srcOpts=[['All content','All content'],['Self','Self'],['Competitor','Competitor'],['Inspiration','Inspiration']];
  const tierOpts=['All','Nano','Micro','Macro','Mega'].map(t=>[t,t]);
  const clear=(S.discFilter||S.discTier!=='All'||S.discSource!=='All content'||advN)?`<button class="ds-btn ds-btn--ghost ds-btn--sm" onclick="S.discFilter='';S.discTier='All';S.discSource='All content';S.discDb='Creator database';S.discAdv={...DISC_ADV_EMPTY};paintBody()">Clear filters</button>`:'';
  const searchIco='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
  const micIco='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
  const lensIco='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3.5"/></svg>';
  const hero=`<section class="disc-hero"><h2>Find creators worth tracking</h2><p>Search creators by name, @handle or niche, then explore their content and performance.</p>
    <div class="disc-gsearch disc-search"><span class="disc-gsearch-ico">${searchIco}</span><span class="disc-ai-ico" title="AI-powered search" aria-hidden="true">${icon('sparkle','ico-sm')}</span><input aria-label="Search creators" placeholder="Search creators or @handles, e.g. AI influencer for New York" value="${esc(S.discFilter)}" oninput="setPageState('discFilter',this.value,'.disc-search input')"><button type="button" class="disc-gicon" aria-label="Search by voice" title="Search by voice" onclick="toast('Voice search · demo')">${micIco}</button></div>${discTryHTML()}</section>`;
  const vis=discCols().filter(c=>c.on&&c.id!=='creator');
  const head=vis.map(c=>c.sort?dsSortTh(esc(c.label),true):`<th>${esc(c.label)}</th>`).join('');
  const rowCells=c=>vis.map(col=>`<td class="${DISC_NUM[col.id]?'ds-num':col.id==='last'?'ds-table-meta':''}">${discCellFor(col,c)}</td>`).join('');
  S.discVisIds=list.map(c=>c.id);
  const allSel=list.length&&list.every(c=>(S.discSel||[]).includes(c.id));
  const table=`<div class="ds-table-wrap"><table class="ds-table ds-table--wide ds-table--scroll"><thead><tr><th class="ds-cb ds-sticky-l"><input type="checkbox" aria-label="Select all visible creators" ${allSel?'checked':''} onchange="toggleDiscAll(this.checked)"></th><th class="ds-sticky-l2">Creator</th>${head}<th>Tags</th><th class="ds-sticky-r">Actions</th></tr></thead>
      <tbody>${list.map(c=>{const added=isInMy(c.id);return `<tr>${dsCb(c.name,(S.discSel||[]).includes(c.id),`toggleDiscSel('${c.id}',this.checked)`).replace('<td class="ds-cb">','<td class="ds-cb ds-sticky-l">')}<td class="ds-sticky-l2"><div class="ds-name-row">${dsPerson(c,'openCreatorSide')}${dsRowIcons([{ic:'user',label:'Open profile',go:`openCreatorSide('${c.id}')`},{ic:'external',label:'Open Instagram',go:`window.open('https://www.instagram.com/${encodeURIComponent(c.handle.replace(/^@/,''))}/','_blank')`}])}</div></td>${rowCells(c)}<td>${tagCellHTML(c.id,true)}</td><td class="ds-sticky-r"><div class="ds-row-end">${added?'<span class="disc-added">Added</span>':''}${addToMenuHTML(c.id,added)}</div></td></tr>`;}).join('')||`<tr><td colspan="${vis.length+3}" class="ds-empty">No matching creators. Try another search or filter.</td></tr>`}</tbody></table></div>`;
  const cards=`<div class="ds-cc-grid">${list.map(c=>dsContentCard(c,isInMy(c.id))).join('')||'<div class="ds-empty">No matching creators. Try another search or filter.</div>'}</div>`;
  return `<div class="ds-page">
    <div class="disc-compact-head">${dsPageHead({title:'Discover creators',beta:true})}</div>
    ${hero}
    <div class="ds-toolbar">
      ${advBtn}
      ${dsFilter('discDb','Source',[['Creator database','Creator database'],['Meta Marketplace','Meta Marketplace']],S.discDb||'Creator database')}
      ${dsFilter('discPlatform','Platform',[['Instagram','Instagram'],['TikTok','TikTok'],['YouTube','YouTube']],S.discPlatform||'Instagram')}
      ${dsFilter('discSource','Found in',srcOpts,S.discSource)}
      ${dsFilter('discTier','Tier',tierOpts,S.discTier)}${tagFilterHTML('disc')}
      <span class="disc-matches"><b>${list.length.toLocaleString('en-IN')}</b> ${list.length===1?'match':'matches'}</span>
      ${clear}
      <span class="ds-spacer"></span>
      <span class="disc-cols-wrap">${discColsBtn()}${S.discColsOpen?discColsPanel():''}</span>
      ${dsViewSeg('discView',[['table','Table'],['cards','Cards']],view)}
    </div>
    <div class="disc-split">${S.discAdvOpen?discAdvPanel():''}<div class="disc-main">
    ${dbMeta?'<div class="ds-note">Meta Marketplace isn’t connected in this workspace yet.</div>':''}
    <div class="disc-results-h"><h3>Some creators tailored for your brand</h3><span class="ds-table-meta">${list.length} creators</span>${(S.discFilter||'').trim()&&list.length?`<button type="button" class="ds-btn ds-btn--outline ds-btn--sm" style="margin-left:auto" onclick="discTagOpen('all')">${icon('plus','ico-sm')}Tag these ${list.length}</button>`:''}</div>
    ${discBulkBarHTML()}${view==='cards'?cards:table}
    ${dsPager(list.length)}
    </div></div>
    ${S.discCfgOpen&&S.discCfgDraft?discCfgHTML():''}
  </div>`;
}

/* ════════ CAMPAIGN PAGES (Shortlist · Dashboard · My campaigns) — DS restyle ════════ */
const CAMP_PLANS=[
 {id:'pl1',name:'QA plan (Claude test)',brief:'QA: festive gifting sets',product:'Plix Festive Gift Box (Set of 3)',objective:'Conversion',format:'Reel',budget:120000,creators:['cr1','cr2','cr3','cr4','cr5','cr6','cr9'],shortlisted:['cr1','cr2'],created:'2026-10-21',stage:'Approval',targetViews:300000,products:['Plix Festive Gift Box (Set of 3)'],productNotes:'Festive gifting, premium packaging',audience:{ages:['18–24','25–34'],gender:'All',locations:['Bengaluru','Mumbai'],words:'Gifting for family'},content:{mustCover:['Unboxing'],mustAvoid:['Competitor brands'],formats:['Reel'],tone:'Warm',keyMessages:['Set of 3']},compare:{benchmarks:['cr2'],competitorExclusive:true,notes:''},comments:'Client wants two more Reel creators in Bengaluru. Hold the budget until approval.'},
 {id:'pl2',name:'Lets go',brief:'get free items at each 500 spent',product:'Plix Vitamin C Glow Serum 30 ml',objective:'Conversion',format:'Reel',budget:85000,creators:['cr3','cr4','cr5','cr6'],shortlisted:[],created:'2026-10-13',stage:'Creators added',targetViews:200000,products:['Plix Vitamin C Glow Serum 30 ml'],productNotes:'Free gift at each 500 spent',audience:{ages:['25–34','35–44'],gender:'Women',locations:['India'],words:''},content:{mustCover:['Glow routine'],mustAvoid:[],formats:['Reel'],tone:'Upbeat',keyMessages:['Free gift']},compare:{benchmarks:[],competitorExclusive:false,notes:''},comments:'Shortlisting in progress. Waiting on Karan for creator rates before finalising the budget split across the four creators.'}
];
const MK=(id,name,product,goal,format,budget,tv,creators,shortlisted,created,stage,comments,ages,locs)=>({id,name,brief:`${goal} push for ${product}`,product,products:[product],objective:goal,format,budget,targetViews:tv,creators,shortlisted,created,stage,comments,audience:{ages,gender:'All',locations:locs,words:''},content:{mustCover:[],mustAvoid:[],formats:[format],tone:'',keyMessages:[]},compare:{benchmarks:[],competitorExclusive:false,notes:''}});
CAMP_PLANS.push(
 MK('pl3','Diwali gifting 2026','Plix Festive Gift Box (Set of 3)','Awareness','Reel',150000,400000,['cr1','cr3','cr5','cr7'],['cr1'],'2026-10-18','Approval',"Waiting on Priyanka's rate card.",['18–24','25–34'],['India']),
 MK('pl4','Vitamin C always-on','Plix Vitamin C Glow Serum 30 ml','Conversion','Reel',90000,250000,['cr2','cr4','cr6'],[],'2026-10-08','New','',['25–34','35–44'],['India','Bengaluru']),
 MK('pl5','Gentle face wash sampling','Plix Gentle Face Wash 100 ml','Engagement','Carousel',60000,120000,['cr3','cr8'],['cr8'],'2026-10-10','Approved','Approved by Karan. Briefs go out Monday.',['18–24'],['India']),
 MK('pl6','Hydra Gel micro push','Plix Hydra Gel Cream 50 g','Awareness','Static',45000,80000,['cr4','cr5','cr7','cr8'],[],'2026-09-30','Rejected','Rejected: audience overlaps a competitor campaign.',['25–34','35–44','45+'],['India']),
 MK('pl7','Sunscreen teaser','Plix Sunscreen SPF 50','Engagement','Story',70000,150000,['cr1','cr2'],['cr1','cr2'],'2026-10-15','Creators added','Two creators shortlisted. Third waiting on brief approval.',['18–24','25–34'],['India','Delhi']),
 MK('pl8','Festive combos, full roster','Plix Festive Gift Box (Set of 3)','Conversion','Reel',200000,500000,['cr1','cr2','cr3','cr4','cr5','cr6','cr7','cr8'],['cr2','cr6','cr7'],'2026-10-20','Approval','Largest list yet. Split budget by creator tier.',['18–24','25–34','35–44'],['India']),
 MK('pl9','Wellness reels Q4','Plix Gentle Face Wash 100 ml','Engagement','Reel',55000,180000,['cr3','cr6'],[],'2026-10-01','Creators added','Cost per creator is above target for two of them.',['25–34'],['Karnataka','Maharashtra']),
 MK('pl10','Men grooming test','Plix Men Grooming Kit','Awareness','Reel',110000,220000,['cr4','cr5'],[],'2026-10-12','New','',['18–24','25–34'],['India']),
 MK('pl11','Mega creator collab','Plix Vitamin C Glow Serum 30 ml','Conversion','Story',300000,900000,['cr2'],[],'2026-10-22','Creators added','Mega creator. Rate needs finance approval.',['18–24','25–34','35–44'],['USA','India']),
 MK('pl12','Summer glow reactivation','Plix Hydra Gel Cream 50 g','Engagement','Carousel',40000,90000,['cr7','cr8','cr1'],['cr7'],'2026-09-14','Approved','Approved for the October launch.',['25–34'],['India'])
);
const CAMP_LIST=[
 {id:'ca1',name:'Plix October Creator Launch',product:'Plix Vitamin C Glow Serum 30 ml',category:'Beauty',status:'Active',legacy:false,tracking:true,created:'2026-09-25',budget:180000,plannedVideos:14,linedUp:4,manager:'Ankit',creatorIds:['cr1','cr4','cr8'],posts:[
  {id:'po1',creator:'cr1',product:'Plix Vitamin C Glow Serum 30 ml',date:'2026-10-05',views:75000,organic:60000,paid:15000,cost:8500,concept:'How-to',format:'Carousel',url:'https://instagram.com/p/demo1'},
  {id:'po2',creator:'cr4',product:'Plix Vitamin C Glow Serum 30 ml',date:'2026-10-12',views:130000,organic:100000,paid:30000,cost:26000,concept:'Before/After',format:'Post',url:'https://instagram.com/p/demo2'},
  {id:'po3',creator:'cr8',product:'Plix Gentle Face Wash 100 ml',date:'2026-10-19',views:44000,organic:44000,paid:0,cost:0,concept:'Review',format:'Reel',url:'https://instagram.com/p/demo3'}]},
 {id:'ca2',name:'Plix Festive Push 2025',product:'Plix Festive Gift Box (Set of 3)',category:'Wellness',status:'Completed',legacy:true,tracking:false,created:'2025-09-01',budget:30000,plannedVideos:5,linedUp:0,manager:'Karan',creatorIds:['cr4','cr8'],posts:[
  {id:'po4',creator:'cr4',product:'Plix Festive Gift Box (Set of 3)',date:'2025-10-04',views:98000,organic:98000,paid:0,cost:0,concept:'Gifting',format:'Reel',url:'https://instagram.com/p/old1'},
  {id:'po5',creator:'cr8',product:'Plix Festive Gift Box (Set of 3)',date:'2025-10-13',views:33000,organic:24000,paid:9000,cost:8000,concept:'Unboxing',format:'Reel',url:'https://instagram.com/p/old2'}]},
 {id:'ca3',name:'Plix Summer Glow 2025',product:'Plix Hydra Gel Cream 50 g',category:'Beauty',status:'Completed',legacy:true,tracking:false,created:'2025-04-02',budget:150000,plannedVideos:3,linedUp:0,manager:'Ankit',creatorIds:['cr1','cr7'],posts:[
  {id:'po6',creator:'cr1',product:'Plix Hydra Gel Cream 50 g',date:'2025-04-19',views:19500,organic:19500,paid:0,cost:4200,concept:'Review',format:'Reel',url:'https://instagram.com/p/old3'},
  {id:'po7',creator:'cr7',product:'Plix Hydra Gel Cream 50 g',date:'2025-04-21',views:1900000,organic:1500000,paid:400000,cost:160000,concept:'Routine',format:'Reel',url:'https://instagram.com/p/old4'}]}
];
/* Demo scale: 18 campaigns, up to 100 posts and 8–14 creators each. Seeded so every load is identical. */
(function scaleDemoData(){
  let seed=20261030; const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  const pick=a=>a[Math.floor(rnd()*a.length)];
  const ids=DISC.map(x=>x.id);
  const prods=[...new Set(CAMP_LIST.map(c=>c.product))];
  const names=['Summer Hydration Drive','Gentle Care Launch','Glow Week Sprint','Festive Gifting 2026','Retinol Starter Kit','Monsoon Routine Push','Creator Reels Q4','Sensitive Skin Trial','Night Repair Launch','Body Care Refresh','Oily Skin Edit','Men Grooming Test','Travel Kit Promo','Mini Size Sampling','Winter Barrier Campaign'];
  const concepts=['How-to','Review','Before/After','Routine','Unboxing','Gifting','Testimonial'];
  const formats=['Reel','Post','Carousel'];
  const today='2026-10-29';
  const addDays=(d,n)=>{const t=new Date(d+'T12:00:00');t.setDate(t.getDate()+n);return t.toISOString().slice(0,10);};
  const fillPosts=(c,target,crew)=>{
    /* a creator has at most 3 posts in one campaign; each creator gets its own quota of 1-3 */
    const cnt={}; c.posts.forEach(p=>{cnt[p.creator]=(cnt[p.creator]||0)+1;});
    const quota={}; crew.forEach(id=>{ quota[id]=Math.max(cnt[id]||0,1+Math.floor(rnd()*3)); });
    const capN=Math.min(target,Object.values(quota).reduce((a,b)=>a+b,0));
    for(let j=c.posts.length;j<capN;j++){
      const open=crew.filter(id=>(cnt[id]||0)<quota[id]); if(!open.length) break;
      const who=pick(open); cnt[who]=(cnt[who]||0)+1;
      const span=Math.max(1,(new Date(today)-new Date(c.created))/864e5);
      const date=addDays(c.created,Math.floor(rnd()*span));
      const v=1000+Math.floor(rnd()*rnd()*160000);
      const paid=rnd()<0.3?Math.floor(v*(0.2+rnd()*0.3)):0;
      c.posts.push({id:'g'+c.id+'_'+j,creator:who,product:rnd()<0.8?c.product:pick(prods),date,views:v,organic:v-paid,paid,cost:paid?Math.round(paid*(0.2+rnd()*0.3)):0,concept:pick(concepts),format:pick(formats),url:'https://instagram.com/p/g'+c.id+'_'+j});
    }
  };
  const crewOf=(c,size)=>{const set=[...c.creatorIds];while(set.length<size){const x=pick(ids);if(!set.includes(x))set.push(x);}return set;};
  CAMP_LIST.forEach((c,i)=>{
    const size=8+Math.floor(rnd()*7);
    c.creatorIds=crewOf(c,Math.max(size,c.creatorIds.length));
    c.owners=c.owners||{}; c.fees=c.fees||{};
    fillPosts(c,100,c.creatorIds);
  });
  names.forEach((name,i)=>{
    const id='ca'+(4+i), created=`2026-${String(1+(i%10)).padStart(2,'0')}-${String(1+Math.floor(rnd()*27)).padStart(2,'0')}`;
    const c={id,name,product:pick(prods),category:pick(['Beauty','Wellness']),status:i%3?'Active':'Completed',legacy:false,tracking:i%4!==0,created,budget:150000+Math.floor(rnd()*20)*10000,plannedVideos:15+Math.floor(rnd()*20),linedUp:0,manager:pick(['Ankit','Karan','Priya','Rahul']),creatorIds:[],posts:[],lined:[],owners:{},fees:{}};
    c.creatorIds=crewOf(c,8+Math.floor(rnd()*7));
    fillPosts(c,20+Math.floor(rnd()*81),c.creatorIds);
    CAMP_LIST.push(c);
  });
})();

const exactN=n=>Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0});
const cNameOf=id=>(DISC.find(x=>x.id===id)||{name:id}).name;
const cFirstOf=id=>cNameOf(id).split(' ')[0];
const rupees=n=>'₹'+Math.round(Number(n||0)).toLocaleString('en-IN');
const cpvOf=(cost,views)=>views?'₹'+(cost/views).toFixed(2):'—';
const sumOf=(arr,k)=>arr.reduce((s,x)=>s+(Number(x[k])||0),0);
const campViews=c=>sumOf(c.posts,'views'), campSpend=c=>sumOf(c.posts,'cost');
const PASTELS=[['#dbeafe','#1e40af'],['#fce7f3','#be185d'],['#dcfce7','#15803d'],['#fef3c7','#92400e'],['#ede9fe','#1d4ed8'],['#e0f2fe','#075985'],['#ffedd5','#c2410c']];
const pastelOf=seed=>{let h=0;String(seed||'').split('').forEach(ch=>h=(h*31+ch.charCodeAt(0))>>>0);return PASTELS[h%PASTELS.length];};
const pastelStyle=seed=>{const [bg,fg]=pastelOf(seed);return `background:${bg};color:${fg};border-color:transparent`;};
const dsMediaVideo=seed=>`<span class="ds-media" style="${pastelStyle(seed)}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="14" height="14" rx="2"/><path d="m16 10 6-3v10l-6-3"/></svg></span>`;
const dsMedia=seed=>`<span class="ds-media" style="${pastelStyle(seed)}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg></span>`;
const AV_PAL=['#7c3aed','#9d174d','#1d4ed8','#c2410c','#075985','#15803d','#1e40af','#c2410c','#be185d','#1e40af'];
const avHash=v=>{let h=0;for(const ch of String(v))h=(h*31+ch.charCodeAt(0))>>>0;return h;};
const dsAv=(seed,name)=>`<span class="ds-avatar" style="background:${AV_PAL[avHash(seed)%AV_PAL.length]}" title="${esc(name||'')}">${esc(initialsOf(name||'?'))}</span>`;
const dsStack=ids=>`<div class="ds-avatar-stack">${ids.slice(0,3).map(id=>dsAv(id,cNameOf(id))).join('')}${ids.length>3?`<span class="ds-avatar-more">+${ids.length-3}</span>`:''}</div>`;
const dsBadge=(t,v='')=>`<span class="ds-badge${v?' ds-badge--'+v:''}">${esc(t)}</span>`;
/* creator tier as a coloured tag: each tier has its own hue */
const TIER_TAG={Nano:['#eff6ff','#5b21b6'],Micro:['#f0fdf4','#166534'],Macro:['#eff6ff','#1d4ed8'],Mega:['#fffbeb','#c2410c']};
const tierTag=t=>{ const c=TIER_TAG[t]||['#f1f5f9','#1e40af']; return `<span class="tier-tag is-${String(t||'none').toLowerCase()}" style="background:${c[0]};color:${c[1]}">${esc(t||'—')}</span>`; };
function setPageState(k,v,focus){ S[k]=v; paintBody(); if(focus){ const i=document.querySelector(focus); if(i){ i.focus(); i.setSelectionRange(v.length,v.length); } } }
const dsSearch=(k,label,val)=>`<div class="ds-input"><span class="ds-input-icon">${icon('search','ico-sm')}</span><input aria-label="${label}" placeholder="${label}" value="${esc(val)}" oninput="setPageState('${k}',this.value,'.ds-toolbar input')"></div>`;
const dsFilter=(k,label,opts,val)=>{const cur=opts.find(o=>o[0]===val)||opts[0];const on=val!=='All'&&val!=='All content';return `<label class="ds-filter${on?' is-active':''}"><span>${on?esc(cur[1]):label}</span><select aria-label="${label}" onchange="setPageState('${k}',this.value)">${opts.map(([v,l])=>`<option value="${v}" ${v===val?'selected':''}>${esc(l)}</option>`).join('')}</select>${on?`<button class="ds-filter-x" aria-label="Clear ${label}" onclick="event.preventDefault();setPageState('${k}','All')">×</button>`:''}</label>`;};

const PLAN_STAGES=['New','Creators added','Approval','Approved','Rejected'];
const planStageOf=p=>p.stage||(p.creators.length?'Creators added':'New');
const stageSlug=s=>s.toLowerCase().replace(/\s+/g,'-');
/* ════════ COLLECTIONS (reusable creator pools, independent of planners and campaigns) ════════ */
const COL_KEY='creator_studio_collections_v2';
let CREATOR_COLLECTIONS=[
{id:'col-skincare',name:'Skincare creators',description:'Reusable pool of skincare-focused creators.',creatorIds:['cr1','cr3','cr5','cr7'],savedAt:'2026-10-20',savedBy:'Riya Sharma',lastOpenedAt:'2026-11-06',lastOpenedBy:'You'},
{id:'col-micro',name:'Micro creators · India',description:'Micro creators with strong India audience relevance.',creatorIds:['cr2','cr4','cr6','cr8'],savedAt:'2026-09-12',savedBy:'Arjun Mehta',lastOpenedAt:'2026-11-05',lastOpenedBy:'Neha'},
{id:'col-repeat',name:'Past collaborators',description:'Creators with previous collaboration history.',creatorIds:['cr1','cr2','cr6'],savedAt:'2026-09-01',savedBy:'Ananya Iyer',lastOpenedAt:'2026-11-01',lastOpenedBy:'You'}];
function colBoot(){try{const v=JSON.parse(localStorage.getItem(COL_KEY)||'null');if(Array.isArray(v))CREATOR_COLLECTIONS=v;}catch(e){}}
function colSave(){try{localStorage.setItem(COL_KEY,JSON.stringify(CREATOR_COLLECTIONS));}catch(e){}}
function colOf(id){return CREATOR_COLLECTIONS.find(x=>x.id===id);}
function openCollection(id){S.collectionId=id;S.collectionSelected=[];S.page='collection';paintHeader();paintBody(true);}
function collectionNew(){dlg('Create collection','A reusable creator group, independent of campaign plans and campaigns.',`<div style="display:flex;flex-direction:column;gap:16px;grid-column:1 / -1;width:100%"><label class="ds-field" style="display:flex;flex-direction:column;gap:6px;width:100%"><span style="font-size:13px;font-weight:600;color:#0f172a">Collection name</span><input id="newColName" placeholder="e.g. Skincare creators" style="width:100%;box-sizing:border-box;height:40px;padding:0 12px;border:1px solid #bfdbfe;border-radius:8px;font:inherit;font-size:14px;color:#0f172a;background:#ffffff;outline:none"></label><label class="ds-field" style="display:flex;flex-direction:column;gap:6px;width:100%"><span style="font-size:13px;font-weight:600;color:#0f172a">Description <span style="font-weight:400">(optional)</span></span><textarea id="newColDesc" rows="3" style="width:100%;box-sizing:border-box;min-height:88px;padding:10px 12px;border:1px solid #bfdbfe;border-radius:8px;font:inherit;font-size:14px;color:#0f172a;background:#ffffff;resize:vertical;outline:none"></textarea></label></div>`,`<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="collectionCreateDo()">Create collection</button>`);}
function collectionCreateDo(){const name=(document.getElementById('newColName')?.value||'').trim();if(!name)return toast('Enter a collection name');const description=(document.getElementById('newColDesc')?.value||'').trim();const id='col-'+Date.now();CREATOR_COLLECTIONS.unshift({id,name,description,creatorIds:[]});colSave();closeLayer();paintBody();toast('Collection created');}
function collectionManage(id){const c=colOf(id);if(!c)return;const rows=DISC.filter(x=>!x.repo).map(x=>`<label class="ds-check"><input type="checkbox" class="col-choice" value="${x.id}" ${c.creatorIds.includes(x.id)?'checked':''}><span>${dsAv(x.id,x.name)} ${esc(x.name)}</span></label>`).join('');dlg('Manage creators',esc(c.name),`<div class="ds-form">${rows}</div>`,`<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="collectionManageSave('${id}')">Save</button>`);}
function collectionManageSave(id){const c=colOf(id);if(!c)return;c.creatorIds=[...document.querySelectorAll('.col-choice:checked')].map(x=>x.value);colSave();closeLayer();paintBody();}
function collectionRemove(cid,id){const c=colOf(cid);if(!c)return;c.creatorIds=c.creatorIds.filter(x=>x!==id);colSave();paintBody();}
function collectionToggle(id,on){const a=new Set(S.collectionSelected||[]);on?a.add(id):a.delete(id);S.collectionSelected=[...a];paintBody();}
function collectionCopyDialog(cid){colBoot();const ids=S.collectionSelected||[];if(!ids.length)return toast('Select creators first');const others=CREATOR_COLLECTIONS.filter(c=>c.id!==cid);if(!others.length)return toast('Create another collection first');dlg('Add selected to another collection',`${ids.length} selected creators will be added to the collection you choose. They stay in this collection.`,`<div class="ds-form"><label class="ds-field"><span>Collection</span><select id="colCopyTarget">${others.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label></div>`,`<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="collectionCopyDo()">Add to collection</button>`);}
function collectionCopyDo(){colBoot();const t=colOf(document.getElementById('colCopyTarget')?.value);const ids=S.collectionSelected||[];if(!t||!ids.length)return;ids.forEach(id=>{if(!t.creatorIds.includes(id))t.creatorIds.push(id);});colSave();closeLayer();paintBody();toast(`${ids.length} creators added to ${t.name}`);}
const TIER_ORDER=['Nano','Micro','Macro','Mega'];
const TIER_ABBR={Nano:'Na',Micro:'Mi',Macro:'Ma',Mega:'Me'};
const TIER_BAR={Nano:'#0369a1',Micro:'#1d4ed8',Macro:'#6d28d9',Mega:'#d97706'};
const NOTE_KEY='adam_collection_notes_v1';
const NOTE_DEFAULTS={
 list:{lead:'Tip:',body:'Copy creators from a collection into a campaign plan to evaluate them.'},
 detail:{lead:'Collection is not a campaign plan.',body:'Removing a creator here does not remove them from any campaign plan.'}
};
function noteGet(key){try{const v=JSON.parse(localStorage.getItem(NOTE_KEY)||'null');if(v&&v[key])return v[key];}catch(e){}return NOTE_DEFAULTS[key];}
function noteSaveAll(key,val){let all={};try{all=JSON.parse(localStorage.getItem(NOTE_KEY)||'{}')||{};}catch(e){}all[key]=val;try{localStorage.setItem(NOTE_KEY,JSON.stringify(all));}catch(e){}}
const TIP_CSS=`<style>.tip-slot{position:relative;display:inline-block;margin:0}.tip-i{width:24px;height:24px;border-radius:16px;border:1.5px solid #1d4ed8;background:#ffffff;color:#1d4ed8;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;margin:0;flex:none;line-height:0}.tip-i svg{display:block;width:14px;height:14px}.tip-pop{position:absolute;top:calc(100% + 8px);left:0;width:320px;max-width:80vw;background:#ffffff;border:1px solid #bfdbfe;border-radius:12px;box-shadow:0 10px 30px #0f172a24;padding:14px 36px 14px 16px;z-index:40;font:14px/1.5 system-ui,sans-serif;color:#0f172a;text-align:left}.tip-pop b{display:block;font-weight:600;margin-bottom:4px}.tip-pop p{margin:0}.tip-x{position:absolute;top:8px;right:8px;width:24px;height:24px;border:0;background:transparent;color:#0f172a;cursor:pointer;font-size:18px;line-height:1;border-radius:6px;padding:0}.tip-f{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}.tip-f button{padding:6px 12px;border-radius:8px;border:1px solid #bfdbfe;background:#ffffff;color:#0f172a;font:inherit;font-size:13px;cursor:pointer}.tip-f .tip-ok{background:#1d4ed8;border-color:#1d4ed8;color:#ffffff}</style>`;
function tipSeen(key){ try{ return localStorage.getItem('adam_tip_'+key)==='1'; }catch(e){ return !!(S.tipSeen&&S.tipSeen[key]); } }
function tipMark(key){ try{ localStorage.setItem('adam_tip_'+key,'1'); }catch(e){} S.tipSeen={...(S.tipSeen||{}),[key]:true}; }
function noteHTML(key){ const n=noteGet(key); const open=S.noteOpen===key||(!tipSeen(key)&&S.noteOpen!==key+':closed'); return `${TIP_CSS}<div class="tip-slot"><button type="button" class="tip-i" aria-label="About this page" aria-expanded="${open}" title="About this page" onclick="noteToggle('${key}')"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M8 7.2v4.3"/><circle cx="8" cy="4.6" r=".6" fill="currentColor" stroke-width="1.2"/></svg></button>${open?`<div class="tip-pop" role="dialog" aria-label="${esc(n.lead)}"><button type="button" class="tip-x" aria-label="Close" onclick="noteDismiss('${key}')">×</button><b>${esc(n.lead)}</b><p>${esc(n.body)}</p><div class="tip-f"><button type="button" onclick="noteEdit('${key}')">Edit</button><button type="button" class="tip-ok" onclick="noteDismiss('${key}')">Got it</button></div></div>`:''}</div>`; }
function noteToggle(key){ S.noteOpen=(S.noteOpen===key||(!tipSeen(key)&&S.noteOpen!==key+':closed'))?key+':closed':key; paintBody(); }
function noteDismiss(key){ tipMark(key); S.noteOpen=key+':closed'; paintBody(); }
function noteEdit(key){const n=noteGet(key);dlg('Edit note','Changes apply to this page.',`<div class="ds-form"><label class="ds-field"><span>Heading</span><input id="noteLead" value="${esc(n.lead)}"></label><label class="ds-field"><span>Note</span><textarea id="noteBody" rows="4">${esc(n.body)}</textarea></label></div>`,`<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="noteSave('${key}')">Save note</button>`);}
function noteSave(key){const lead=(document.getElementById('noteLead')?.value||'').trim(),body=(document.getElementById('noteBody')?.value||'').trim();if(!lead&&!body)return toast('Add some note text first');noteSaveAll(key,{lead,body});closeLayer();paintBody();toast('Note saved');}
const colQuoted=c=>{const cs=c.creatorIds.map(id=>crOf(id)).filter(Boolean);const costs=cs.map(x=>Number(mx(x).cost)||0);return {n:cs.length,cost:costs.reduce((s,v)=>s+v,0),quoted:costs.filter(v=>v>0).length,er:cs.length?cs.reduce((s,x)=>s+(Number(mx(x).engagement)||0),0)/cs.length:0,tiers:TIER_ORDER.map(t=>[t,cs.filter(x=>x.tier===t).length])};};
const colDate=iso=>iso?new Date(iso+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'}):'—';
function tierBarHTML(t){
 const tot=t.reduce((s,[,k])=>s+k,0);
 if(!tot)return '<span class="ds-table-meta">No creators</span>';
 const bar=t.filter(([,k])=>k).map(([n,k])=>`<i style="width:${(k/tot*100).toFixed(1)}%;background:${TIER_BAR[n]}" title="${n} ${k}"></i>`).join('');
 const txt=t.filter(([,k])=>k).map(([n,k])=>`${TIER_ABBR[n]} ${k}`).join(' · ');
 return `<div class="col-tier"><div class="col-tierbar">${bar}</div><span class="ds-table-meta">${txt}</span></div>`;
}
function colMoreHTML(c){return `<details class="ds-more col-more"><summary class="ds-btn ds-btn--ghost ds-btn--sm" aria-label="More actions for ${esc(c.name)}">⋯</summary><div class="ds-more-menu" role="menu"><button type="button" role="menuitem" class="col-danger" onclick="collectionDeleteDialog('${c.id}')">Delete collection</button></div></details>`;}
function colActionsHTML(c){return `<div class="ds-actions col-acts"><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openCollection('${c.id}')">Open</button><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="collectionMoveDialog('${c.id}')">Move to campaign</button>${colMoreHTML(c)}</div>`;}
function colTableHTML(list){
 if(!list.length)return '<p class="ds-caption">No collections yet.</p>';
 const rows=list.map(c=>{const q=colQuoted(c);return `<tr><td><button class="ds-namebtn" onclick="openCollection('${c.id}')">${esc(c.name)}</button></td><td class="ds-num">${q.n}</td><td class="ds-num">${q.cost?rupees(q.cost):'—'}<div class="ds-table-meta">${q.quoted} quoted</div></td><td>${tierBarHTML(q.tiers)}</td><td class="ds-num">${q.n?q.er.toFixed(1)+'%':'—'}</td><td>${colDate(c.savedAt)}<div class="ds-table-meta">${esc(c.savedBy||'—')}</div></td><td>${colDate(c.lastOpenedAt)}<div class="ds-table-meta">${esc(c.lastOpenedBy||'—')}</div></td><td class="col-note" style="max-width:260px;font-size:13px;color:#0f172a;line-height:1.4">${esc(c.description||'—')}</td><td>${colActionsHTML(c)}</td></tr>`;}).join('');
 return `<div class="ds-table-wrap"><table class="ds-table"><thead><tr><th>Collection</th><th class="ds-num">Creators</th><th class="ds-num">Quoted cost</th><th>Tier mix</th><th class="ds-num">Avg ER</th><th>Saved</th><th>Last opened</th><th>Note</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
const COL_CSS=`<style>.col-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0;padding:0}.ds-page>.col-bar{margin:0}.col-total{font-size:14px;font-weight:600;color:#0f172a}.col-stack{display:flex;align-items:center;min-height:32px}.col-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:6px}.col-stats span{display:block;font-size:12px;color:#0f172a}.col-stats b{display:block;margin-top:2px;font-size:14px;font-weight:600;color:#0f172a}.col-stack .ds-avatar,.col-stack .col-more-n{width:28px;height:28px;border-radius:16px;border:2px solid #ffffff;margin-left:-8px;font-size:12px;font-weight:700;display:grid;place-items:center;flex:none;box-sizing:content-box}.col-stack>*:first-child{margin-left:0}.col-more-n{background:#eff6ff;color:#1d4ed8}.col-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}.col-card{background:#ffffff;border:1px solid #bfdbfe;border-radius:12px;padding:18px;display:flex;flex-direction:column;gap:8px;min-width:0}.col-count{font-size:12px;font-weight:600;color:#0f172a}.col-name{all:unset;cursor:pointer;font-size:16px;font-weight:700;color:#0f172a;line-height:1.3}.col-name:hover{text-decoration:underline}.col-desc{margin:0;font-size:14px;line-height:1.5;color:#0f172a;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:42px}.col-foot{margin-top:auto;padding-top:14px;display:flex;align-items:center;justify-content:space-between;gap:8px;border-top:1px solid #f1f5f9}.col-btns{display:flex;gap:8px;min-width:0;flex-wrap:wrap}.col-btns button{white-space:nowrap;padding:7px 12px;border:1px solid #bfdbfe;border-radius:8px;background:#ffffff;color:#1d4ed8;font:inherit;font-size:13px;font-weight:600;cursor:pointer}.col-btns button:hover{border-color:#1d4ed8}.col-more{position:relative;flex:none}</style>`;
function colAvatarsHTML(c){ const cs=c.creatorIds.map(id=>crOf(id)).filter(Boolean); const show=cs.slice(0,5); const more=cs.length-show.length; return show.map(x=>dsAv(x.id,x.name)).join('')+(more>0?`<span class="col-more-n">+${more}</span>`:''); }
function collectionsHTML(){
 colBoot();
 const view=S.colView||'cards';
 const list=CREATOR_COLLECTIONS;
 const cards=list.map(c=>`<article class="col-card"><span class="col-count" style="font-size:13px;font-weight:500;color:#0f172a">${c.creatorIds.length} creators</span><button class="col-name" style="all:unset;cursor:pointer;font-size:18px;font-weight:700;color:#0f172a;line-height:1.3;letter-spacing:-.01em" onclick="openCollection('${c.id}')">${esc(c.name)}</button><p class="col-desc">${esc(c.description||'No description added.')}</p><div class="col-stats"><div><span>Quoted cost</span><b>${colQuoted(c).cost?rupees(colQuoted(c).cost):'—'}</b></div><div><span>Avg ER</span><b>${colQuoted(c).n?colQuoted(c).er.toFixed(1)+'%':'—'}</b></div><div><span>Last opened</span><b>${colDate(c.lastOpenedAt)}</b></div></div>${tierBarHTML(colQuoted(c).tiers)}<div class="col-stack">${colAvatarsHTML(c)}</div><div class="col-foot"><div class="col-btns"><button type="button" onclick="openCollection('${c.id}')">Open</button><button type="button" onclick="collectionMoveDialog('${c.id}')">Move to campaign</button></div>${colMoreHTML(c)}</div></article>`).join('');
 const body=view==='table'?colTableHTML(list):`${COL_CSS}<div class="col-grid">${cards||'<p class="ds-caption">No collections yet.</p>'}</div>`;
 return `<div class="ds-page"><div class="ds-head"><div><h1 class="ds-page-title">Collections</h1><p class="ds-page-desc">Reusable creator groups by niche, market or relationship. Independent of campaigns.</p></div><div class="ds-actions"><button class="ds-btn ds-btn--primary" onclick="collectionNew()">${icon('plus','ico-sm')}New collection</button></div></div><div class="col-bar"><span class="col-total">${list.length} collection${list.length===1?'':'s'}</span>${dsViewSeg('colView',[['cards','Cards'],['table','Table']],view)}</div>${body}</div>`;
}
function collectionDeleteDialog(cid){
 const c=colOf(cid); if(!c)return;
 dlg('Delete collection',`This removes "${esc(c.name)}" from your collections. Creators stay in My creators, and campaign plans and campaigns that already include them are not changed.`,'',
 `<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--danger" onclick="collectionDelete('${cid}')">Delete collection</button>`);
}
function collectionDelete(cid){
 colBoot(); const i=CREATOR_COLLECTIONS.findIndex(x=>x.id===cid); if(i>-1)CREATOR_COLLECTIONS.splice(i,1); colSave();
 closeLayer();
 if(S.page==='collection'&&S.collectionId===cid){S.collectionId=null;setPage('collections');}
 else paintBody();
 toast('Collection deleted');
}
function collectionMoveDialog(cid){
 colBoot(); const c=colOf(cid); if(!c)return;
 const ids=c.creatorIds||[]; if(!ids.length)return toast('Add creators to this collection first');
 const draftPlans=CAMP_PLANS.filter(p=>planStageOf(p)!=='Active');
 const liveCamps=CAMP_LIST.filter(k=>k.status==='Active');
 const planOpts=draftPlans.map(p=>`<label class="col-mv-opt"><input type="radio" name="colMvTarget" value="plan:${p.id}" onchange="collectionMovePick('${cid}')"><span class="col-mv-body"><span class="col-mv-title">${esc(p.name)}<span class="col-pill col-pill--off">${esc(planStageOf(p))}</span></span><span class="ds-table-meta">${(p.creators||[]).length} creators in pool</span></span></label>`).join('')||'<p class="ds-caption">No draft campaign plans.</p>';
 const campOpts=liveCamps.map(k=>`<label class="col-mv-opt"><input type="radio" name="colMvTarget" value="camp:${k.id}" onchange="collectionMovePick('${cid}')"><span class="col-mv-body"><span class="col-mv-title">${esc(k.name)}<span class="col-pill col-pill--live">${esc(k.status)}</span></span><span class="ds-table-meta">${(k.creatorIds||[]).length} creators · Created ${colDate(k.created)}</span></span></label>`).join('')||'<p class="ds-caption">No live campaigns.</p>';
 const newOpt=`<label class="col-mv-opt"><input type="radio" name="colMvTarget" value="new" onchange="collectionMovePick('${cid}')"><span class="col-mv-body"><span class="col-mv-title">New campaign plan with these creators</span><span class="ds-table-meta">Creates a draft to review, approve and launch</span></span></label>`;
 dlg(`Add ${ids.length} creators to a campaign`,'They join the campaign plan or campaign you pick. Scores and simulation update against the campaign brief.',
 `<div class="col-mv-dlg"><div class="ds-tabrow"><div class="ds-tabs" role="tablist"><button type="button" role="tab" id="colMvTabDraft" class="on" aria-selected="true" onclick="collectionMoveTab('draft')">Draft</button><button type="button" role="tab" id="colMvTabLive" aria-selected="false" onclick="collectionMoveTab('live')">Live</button></div></div>`+
 `<div class="col-mv-list" id="colMvPanelDraft">${planOpts}</div><div class="col-mv-list" id="colMvPanelLive" hidden>${campOpts}</div><div class="col-mv-list">${newOpt}</div>`+
 `<p class="ds-caption" id="colMvCheck">Choose a target to check for overlaps.</p></div>`,
 `<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" id="colMvGo" disabled onclick="collectionMoveDo('${cid}')">Add to campaign</button>`);
}
function collectionMoveTab(t){
 const draft=t==='draft';
 document.getElementById('colMvTabDraft')?.classList.toggle('on',draft);
 document.getElementById('colMvTabLive')?.classList.toggle('on',!draft);
 document.getElementById('colMvTabDraft')?.setAttribute('aria-selected',String(draft));
 document.getElementById('colMvTabLive')?.setAttribute('aria-selected',String(!draft));
 const pd=document.getElementById('colMvPanelDraft'), pl=document.getElementById('colMvPanelLive');
 if(pd)pd.hidden=!draft; if(pl)pl.hidden=draft;
 document.querySelectorAll('input[name="colMvTarget"]').forEach(r=>{r.checked=false;});
 document.querySelectorAll('.col-mv-opt').forEach(l=>l.classList.remove('is-on'));
 const go=document.getElementById('colMvGo'); if(go){go.disabled=true;go.textContent='Add to campaign';}
 const chk=document.getElementById('colMvCheck'); if(chk)chk.textContent='Choose a target to check for overlaps.';
}
function collectionMovePick(cid){
 const v=document.querySelector('input[name="colMvTarget"]:checked')?.value, go=document.getElementById('colMvGo'), chk=document.getElementById('colMvCheck');
 if(!v||!go||!chk)return;
 document.querySelectorAll('.col-mv-opt').forEach(l=>l.classList.toggle('is-on',!!l.querySelector('input:checked')));
 go.disabled=false;
 if(v==='new'){go.textContent='Open campaign form';chk.textContent='A new campaign starts with these creators.';return;}
 const c=colOf(cid); if(!c)return;
 let name='', existing=[];
 if(v.startsWith('plan:')){const p=planOf(v.slice(5)); if(!p)return; name=p.name; existing=p.creators||[];}
 else {const k=campOf(v.slice(5)); if(!k)return; name=k.name; existing=k.creatorIds||[];}
 const ov=(c.creatorIds||[]).filter(id=>existing.includes(id)).length;
 go.textContent='Add to '+name;
 chk.textContent=ov?`${ov} ${ov===1?'creator is':'creators are'} already in ${name}.`:`No overlaps with ${name}.`;
}
/* Draft plan from a collection: keeps the journey Collection → Plan → Approval → Launch */
function collectionNewPlan(c,ids){
  const nid='pl'+Date.now(), d=plDraftFrom(null);
  d.name=c.name+' plan'; d.goal='Conversion'; d.formats=['Reel'];
  CAMP_PLANS.unshift({id:nid,creators:ids.slice(),shortlisted:[],created:TODAY,...plFields(d)});
  return nid;
}
function collectionMoveDo(cid){
 colBoot(); const c=colOf(cid), v=document.querySelector('input[name="colMvTarget"]:checked')?.value; if(!c||!v)return;
 const ids=(c.creatorIds||[]).slice();
 if(v==='new'){const nid=collectionNewPlan(c,ids);closeLayer();openPlan(nid);toast(`Draft plan created with ${ids.length} creators`);return;}
 if(v.startsWith('plan:')){
  const p=planOf(v.slice(5)); if(!p)return;
  p.creators=p.creators||[]; ids.forEach(id=>{if(!p.creators.includes(id))p.creators.push(id);});
  invalidatePlanApproval(p);
  closeLayer(); paintBody(); toast(`${ids.length} creators added to ${p.name}`); return;
 }
 const k=campOf(v.slice(5)); if(!k)return;
 k.creatorIds=k.creatorIds||[]; ids.forEach(id=>{if(!k.creatorIds.includes(id))k.creatorIds.push(id);});
 c.campaignId=k.id; colSave();
 closeLayer(); paintBody(); toast(`${ids.length} creators added to ${k.name}`);
}
function collectionDetailHTML(){colBoot();const c=colOf(S.collectionId);if(!c)return notFoundDS();const sel=new Set(S.collectionSelected||[]);const rows=c.creatorIds.map(id=>crOf(id)).filter(Boolean).map(x=>{const v=mx(x);return `<tr><td class="ds-cb"><input type="checkbox" ${sel.has(x.id)?'checked':''} onchange="collectionToggle('${x.id}',this.checked)"></td><td><button class="ds-namebtn" onclick="openCreatorSide('${x.id}')">${dsAv(x.id,x.name)} ${esc(x.name)}</button><div class="ds-table-meta">${esc(x.handle)}</div></td><td>${tierTag(x.tier)}</td><td class="ds-num">${fmt(x.followers)}</td><td class="ds-num">${v.engagement}%</td><td>${v.state||'—'}</td><td><button class="ds-btn ds-btn--ghost ds-btn--sm" onclick="collectionRemove('${c.id}','${x.id}')">Remove</button></td></tr>`}).join('');return creatorsListHTML(c.creatorIds,`<nav class="ds-crumb"><button class="ds-link" onclick="setPage('collections')">Collections</button><span>/</span><span>${esc(c.name)}</span></nav><div class="ds-head"><div><h1 class="ds-page-title" style="display:flex;align-items:center;gap:10px">${esc(c.name)}<span class="tip-inline" style="display:inline-flex">${noteHTML('detail')}</span></h1><p class="ds-page-desc">${esc(c.description||'Reusable creator group')} · ${c.creatorIds.length} creators</p></div><div class="ds-actions"><button class="ds-btn ds-btn--outline" onclick="collectionCopyDialog('${c.id}')">Copy to collection</button><button class="ds-btn ds-btn--outline" onclick="collectionManage('${c.id}')">Manage creators</button><button class="ds-btn ds-btn--primary" onclick="collectionAddCampaign('${c.id}')">Add to campaign →</button></div></div>`);}
/* ════════ CONTENT TRACKER (cross-campaign post queue; same post record as each campaign) ════════ */
function contentTrackerHTML(){
 const q=(S.trackerQ||'').toLowerCase().trim(),cf=S.trackerCampaign||'All',sf=S.trackerStatus||'All';
 const rows=CAMP_LIST.flatMap(c=>(c.posts||[]).map(p=>({c,p,cr:crOf(p.creator)}))).filter(x=>(cf==='All'||x.c.id===cf)&&(!q||[x.c.name,x.p.product,x.p.format,x.p.concept,x.cr?.name,x.cr?.handle,x.p.url].join(' ').toLowerCase().includes(q))).filter(x=>sf==='All'||(sf==='Tracked'?!!x.p.url:!x.p.url));
 const views=rows.reduce((a,x)=>a+(Number(x.p.views)||0),0),tracked=rows.filter(x=>x.p.url).length;
 const body=rows.map(({c,p,cr})=>`<tr><td><button class="ds-namebtn" onclick="openCampaignPost('${p.id}')">${esc(p.format||'Post')} · ${esc(p.concept||p.product||'Content')}</button><div class="ds-table-meta">${esc(p.url||'URL not added')}</div></td><td>${cr?`<button class="ds-namebtn" onclick="openCreatorSide('${cr.id}')">${esc(cr.name)}</button>`:'—'}</td><td><button class="ds-namebtn" onclick="openCampaignQuick('${c.id}')">${esc(c.name)}</button></td><td><span class="trk-st ${p.url?'ok':'wait'}">${p.url?'Tracked':'Awaiting URL'}</span></td><td class="ds-num">${p.views?exactN(p.views):'—'}</td><td><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openCampaignPost('${p.id}')">Inspect post</button></td></tr>`).join('');
 const kpi=(l,v)=>`<div class="ds-card" style="padding:12px 14px"><span class="ds-caption">${l}</span><b class="ds-num" style="display:block;font-size:20px;margin-top:4px">${v}</b></div>`;
 return `<div class="ds-page"><div class="ds-head"><div><h1 class="ds-page-title">Content tracker</h1><p class="ds-page-desc">A cross-campaign operational queue. Each row is the same post record shown inside its campaign.</p></div></div><div class="ds-note"><b>One content record, two contexts.</b> Campaign tracking is scoped to one campaign. This tracker lets you monitor all campaigns together.</div><div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px">${kpi('Posts',rows.length)}${kpi('Tracked',tracked)}${kpi('Awaiting URL',rows.length-tracked)}${kpi('Total views',exactN(views))}</div><div class="ds-toolbar ds-toolbar--wrap"><div class="ds-input"><span class="ds-input-icon">${icon('search','ico-sm')}</span><input placeholder="Search posts, creators or campaigns" value="${esc(S.trackerQ||'')}" oninput="S.trackerQ=this.value;paintBody()"></div><label class="ds-filter"><span>Campaign</span><select onchange="S.trackerCampaign=this.value;paintBody()">${[['All','All campaigns'],...CAMP_LIST.map(c=>[c.id,c.name])].map(([v,l])=>`<option value="${esc(v)}" ${cf===v?'selected':''}>${esc(l)}</option>`).join('')}</select></label><label class="ds-filter"><span>Tracking</span><select onchange="S.trackerStatus=this.value;paintBody()">${[['All','All statuses'],['Tracked','Tracked'],['Awaiting','Awaiting URL']].map(([v,l])=>`<option value="${v}" ${sf===v?'selected':''}>${l}</option>`).join('')}</select></label></div><div class="ds-card"><div class="ds-table-wrap"><table class="ds-table ds-table--wide"><thead><tr><th>Post</th><th>Creator</th><th>Campaign</th><th>Tracking</th><th class="ds-num">Views</th><th></th></tr></thead><tbody>${body||'<tr><td colspan="6" class="ds-caption">No posts match these filters.</td></tr>'}</tbody></table></div></div></div>`;
}

/* ════════ PLAN APPROVAL (campaign launch requires an approved campaign plan) ════════ */
function invalidatePlanApproval(p){
 if(p&&(p.stage==='Approved'||p.stage==='Rejected')){p.stage='Approval';p.approvalStatus='Pending';p.approvedAt=null;p.approvedBy=null;}
}
function setPlanStage(id,v){
 const p=planOf(id);if(!p)return;
 if(v==='Approved'){openPlanApproval(id);return;}
 p.stage=v;p.approvalStatus=v==='Rejected'?'Rejected':null;paintBody();toast(`Plan moved to ${v}`);
}
function openPlanApproval(id){
 const p=planOf(id);if(!p)return;
 const wasRejected=planStageOf(p)==='Rejected';
 const est=p.shortlisted.reduce((s,cid)=>s+plCost(p,cid),0),blockers=[];
 if(!p.shortlisted.length)blockers.push('Shortlist at least one creator.');
 if(!p.budget||p.budget<=0)blockers.push('Set a planned budget.');
 if(est>p.budget)blockers.push(`Shortlisted creator estimates exceed the budget by ${rupees(est-p.budget)}.`);
 if(wasRejected)blockers.push('This plan was rejected. Review and edit it before resubmitting.');
 p.stage='Approval';
 const warn=blockers.length?`<div class="ds-note ds-note--warn"><b>Review required</b><ul>${blockers.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:'<div class="ds-note">No blocking checks found. You can approve this plan.</div>';
 dlg('Review and approve plan','Final approval is required before campaign launch. You can edit the plan later and submit it for approval again.',
 `<dl class="pl-rv-grid">${planRv('Plan',esc(p.name))}${planRv('Objective',esc(p.objective||'—'))}${planRv('Creators shortlisted',p.shortlisted.length)}${planRv('Planned budget',rupees(p.budget))}${planRv('Estimated shortlisted cost',rupees(est))}${planRv('Remaining planned budget',rupees((p.budget||0)-est))}</dl>${warn}`,
 `<button class="ds-btn ds-btn--outline" onclick="closeLayer();openPlan('${id}')">Review plan</button><button class="ds-btn ds-btn--primary" ${blockers.length?'disabled':''} onclick="applyPlanApproval('${id}')">Approve plan</button>`);
}
function applyPlanApproval(id){
 const p=planOf(id);if(!p)return;
 const est=p.shortlisted.reduce((s,cid)=>s+plCost(p,cid),0);
 if(!p.shortlisted.length||!p.budget||est>p.budget)return toast('Resolve the plan review checks before approval');
 p.stage='Approved';p.approvedAt=TODAY;p.approvedBy='You';p.approvalStatus='Approved';
 closeLayer();paintBody();toast('Plan approved. Campaign launch is now enabled.');
}
function deletePlan(id){ const i=CAMP_PLANS.findIndex(p=>p.id===id); if(i>-1) CAMP_PLANS.splice(i,1); closeLayer(); paintBody(); toast('List deleted · demo'); }
function openDeletePlan(id){ const p=planOf(id); if(!p) return; dlg('Delete list',`This removes "${esc(p.name)}" and its shortlisted creators from the plan. Campaigns already created from it are not affected.`,'',
  `<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--danger" onclick="deletePlan('${id}')">Delete list</button>`); }
function openPlanComment(id){ const p=planOf(id); if(!p) return; dlg('Comments',esc(p.name),`<label class="ds-field"><span>Comments</span><textarea id="plCmt" rows="4">${esc(p.comments||'')}</textarea></label>`,
  `<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="savePlanComment('${id}')">Save</button>`); }
function savePlanComment(id){ const p=planOf(id); if(p){ p.comments=dlgVal('plCmt'); } closeLayer(); paintBody(); toast('Comment saved · demo'); }
function planCardHTML(p){
  const pct=Math.max(7,p.shortlisted.length/Math.max(p.creators.length,1)*100), st=planStageOf(p);
  return `<div class="ds-card ds-plan">
    <div><span class="ds-table-title">${esc(p.name)}</span><div class="ds-table-meta">${esc(p.brief)}</div></div>
    <div class="ds-plan-tags">${dsBadge(p.objective)}${dsBadge(p.product)}${dsBadge(p.format)}<span class="pl-stage-pill pl-stage--${stageSlug(st)}">${esc(st)}</span></div>
    <div class="ds-plan-mini"><span>Creators<b>${p.creators.length}</b></span><span>Shortlisted<b>${p.shortlisted.length}</b></span><span>Budget<b>${rupees(p.budget)}</b></span></div>
    <div class="ds-progress"><i style="width:${pct}%"></i></div>
    <div class="ds-caption">${p.creators.map(cFirstOf).join(' · ')}</div>
    <div class="ds-plan-foot"><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openFromPlan('${p.id}')">${icon('plus','ico-sm')}Create campaign</button></div>
  </div>`;
}
function plNoteEdit(id){ setPageState('plNoteEdit',id,'.pl-note-in'); }
function plNoteSave(id,v){ if(S.plNoteEdit!==id) return; const p=planOf(id); if(p) p.comments=(v||'').trim(); S.plNoteEdit=null; paintBody(); }
function plNoteKey(e,id){ if(e.key==='Enter'){ e.preventDefault(); plNoteSave(id,e.target.value); } else if(e.key==='Escape'){ S.plNoteEdit=null; paintBody(); } }
function plNoteCell(p){
  if(S.plNoteEdit===p.id) return `<input class="pl-note-in" aria-label="Comments for ${esc(p.name)}" value="${esc(p.comments||'')}" placeholder="Add a note" onblur="plNoteSave('${p.id}',this.value)" onkeydown="plNoteKey(event,'${p.id}')">`;
  return `<div class="pl-note" role="button" tabindex="0" aria-label="Edit comments for ${esc(p.name)}" onclick="plNoteEdit('${p.id}')" onkeydown="if(event.key==='Enter'){plNoteEdit('${p.id}')}">${p.comments?`<span class="pl-clamp">${esc(p.comments)}</span>`:'<span class="pl-note-empty">+ Add a note</span>'}</div>`;
}
function stageSelHTML(p,st){
  return `<span class="pl-stage-wrap"><select class="pl-stage pl-stage--${stageSlug(st)}" aria-label="Status for ${esc(p.name)}" onchange="setPlanStage('${p.id}',this.value)">${PLAN_STAGES.map(s=>`<option ${s===st?'selected':''}>${s}</option>`).join('')}</select></span>`;
}
function openNewList(){ S.nlOpen=true; S.nlStep=1; S.nlMode='paste'; S.nlName=''; S.nlText=''; S.nlCsv=null; S.nlDocUrl=''; S.nlDocErr=''; S.nlFull=false; S.plDraft=plDraftFrom(null); S.plDraft.goal='Conversion'; S.plDraft.formats=['Reel']; paintBody(); }
function nlDocKey(e){ if(e.key==='Enter'){ e.preventDefault(); nlDocRead(); } }
function nlDocRead(){
  const url=(S.nlDocUrl||'').trim(); const mm=url.match(/docs\.google\.com\/(?:document|spreadsheets)\/d\/([\w-]{6,})/);
  if(!mm){ S.nlCsv=null; S.nlDocErr=url?'That is not a Google Doc link. Paste the link from Share › Copy link.':''; paintBody(); return; }
  let h=0; for(const ch of mm[1]) h=(h*31+ch.charCodeAt(0))>>>0;
  const pool=DISC.map(x=>x.handle.replace(/^@/,'').toLowerCase()); const k=Math.min(pool.length,8+h%5), s=pool.length?h%pool.length:0;
  const picked=Array.from({length:k},(_,i)=>pool[(s+i)%pool.length]);
  S.nlCsv={name:'Google Doc',handles:[...new Set(picked)]}; S.nlDocErr=''; paintBody();
}
function nlClose(){ S.nlOpen=false; paintBody(); }
function nlParse(v){ const hs=[...new Set(String(v||'').split(/[\s,]+/).map(addcNorm).filter(Boolean))].slice(0,500); return hs.length?{name:'Pasted links',handles:hs}:null; }
function nlSetMode(m){ S.nlMode=m; S.nlDocErr=''; S.nlCsv=m==='paste'?nlParse(S.nlText):null; paintBody(); }
function nlGoStep(k){ if(k===2&&!(S.nlName||'').trim()){ toast('Name the list first'); return; } S.nlStep=k; paintBody(); }
function nlPaste(v){ S.nlText=v; S.nlCsv=nlParse(v); nlSync(); }
function nlSync(){ const hasName=(S.nlName||'').trim().length>0, n=S.nlCsv?S.nlCsv.handles.length:0; const nx=document.getElementById('nl-next'); if(nx) nx.disabled=!hasName; const sb=document.getElementById('nl-submit'); if(sb) sb.disabled=!(hasName&&n>0); const c=document.getElementById('nl-count'); if(c) c.textContent=n; const sm=document.getElementById('nl-sum'); if(sm) sm.textContent=n; }
function nlFile(input){
  const f=input.files&&input.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{ const rows=String(r.result).split(/\r?\n/).map(l=>addcNorm(l.split(',')[0])).filter(x=>x&&!/^(handle|username|instagram)$/i.test(x)); S.nlCsv={name:f.name,handles:[...new Set(rows)].slice(0,500)}; paintBody(); };
  r.readAsText(f);
}
function nlCreate(){
  const name=(S.nlName||'').trim(); if(!name||!S.nlCsv) return;
  const matched=[], missing=[];
  S.nlCsv.handles.forEach(h=>{ const c=DISC.find(x=>x.handle.replace(/^@/,'').toLowerCase()===h); if(c) matched.push(c.id); else missing.push(h); });
  const nid='pl'+Date.now();
  CAMP_PLANS.unshift({id:nid,creators:[...new Set(matched)],shortlisted:[],created:TODAY,stage:matched.length?'Creators added':'New',comments:'',...plFields(S.plDraft),name});
  S.nlOpen=false; S.nlCsv=null;
  openPlan(nid);
  addToast('List created',`with ${matched.length} creator${matched.length===1?'':'s'}${missing.length?` (${missing.length} skipped)`:''} in`,name,()=>openPlan(nid));
}
function nlToggleFull(){ S.nlFull=!S.nlFull; paintBody(); }
function nlSyncShort(){
  const d=S.plDraft; if(!d) return; S.nlName=d.name||'';
  const set=(id,v)=>{ const el=document.getElementById(id); if(el&&document.activeElement!==el) el.value=v; };
  set('nl-name',d.name||''); set('nl-prod',(d.products||[])[0]||''); set('nl-obj',d.goal||'Conversion'); set('nl-fmt',(d.formats||[])[0]||'Reel'); set('nl-budget',d.budget||'');
  nlSync();
}
function newListHTML(){
  const step=S.nlStep||1, m=S.nlMode||'paste', csv=S.nlCsv, n=csv?csv.handles.length:0, name=S.nlName||'';
  const upl=discSvg('<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',20);
  const kb=discSvg('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/>',18);
  const fi=discSvg('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',18);
  const gd=discSvg('<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',18);
  const stepBtn=(k,t,d)=>`<button type="button" class="lnch-step${step===k?' is-on':step>k?' is-done':''}" ${step===k?'aria-current="step"':''} onclick="nlGoStep(${k})"><span class="lnch-num">${step>k?'✓':k}</span><span class="lnch-st"><b>${t}</b><small>${d}</small></span></button>`;
  const stepper=`<nav class="lnch-stepper" aria-label="New list steps">${stepBtn(1,'Brief','Name and campaign basics')}<span class="lnch-conn"></span>${stepBtn(2,'Creators','Add creators to the list')}</nav>`;
  const d=S.plDraft||plDraftFrom(null);
  const briefPane=`<div class="nl-fields">
      <label class="nl-f nl-f--full"><span>List name</span><input id="nl-name" class="nl-input" value="${esc(name)}" placeholder="e.g. Diwali micro creators" oninput="S.nlName=this.value;S.plDraft.name=this.value;nlSync()" autocomplete="off"></label>
      <label class="nl-f"><span>Product</span><input id="nl-prod" class="nl-input" value="${esc((d.products||[])[0]||'')}" placeholder="e.g. Plix Vitamin C Glow Serum" oninput="S.plDraft.products=this.value.trim()?[this.value.trim()]:[]" autocomplete="off"></label>
      <label class="nl-f"><span>Objective</span><select id="nl-obj" class="nl-input" onchange="S.plDraft.goal=this.value">${PL_GOALS.map(g=>`<option ${g.k===(d.goal||'Conversion')?'selected':''}>${g.k}</option>`).join('')}</select></label>
      <label class="nl-f"><span>Format</span><select id="nl-fmt" class="nl-input" onchange="S.plDraft.formats=[this.value]">${['Reel','Post','Carousel'].map(o=>`<option ${o===((d.formats||[])[0]||'Reel')?'selected':''}>${o}</option>`).join('')}</select></label>
      <label class="nl-f"><span>Budget (₹)</span><input id="nl-budget" class="nl-input" type="number" min="0" step="500" inputmode="numeric" value="${esc(d.budget||'')}" placeholder="0" oninput="S.plDraft.budget=Number(this.value)||0" autocomplete="off"></label>
    </div>
    <button type="button" class="nl-acc-btn" aria-expanded="${!!S.nlFull}" onclick="nlToggleFull()"><span>${S.nlFull?'Hide full brief':'Show full brief'}</span><span class="nl-acc-ch${S.nlFull?' is-open':''}" aria-hidden="true">&#dc262622;</span></button>
    ${S.nlFull?`<div class="nl-full" id="plLeft">${plLeftHTML(d)}</div>`:''}`;
  const methods=`<div class="nl-methods" role="tablist" aria-label="Add creators by">${[['csv',fi,'Upload CSV','Spreadsheet, one handle per row'],['paste',kb,'Paste links','Handles, @handles or profile links'],['doc',gd,'Google Doc','Doc with one handle per row']].map(([k,ic,t,d])=>`<button type="button" role="tab" aria-selected="${m===k}" class="addn-opt ${m===k?'on':''}" onclick="nlSetMode('${k}')"><span class="addn-opt-ico">${ic}</span><span class="addn-opt-txt"><b>${t}</b><small>${d}</small></span></button>`).join('')}</div>`;
  const pane=m==='csv'
    ?`<label class="addn-drop"><input type="file" accept=".csv,text/csv" hidden onchange="nlFile(this)"><span class="addn-drop-ico">${upl}</span>${csv&&csv.name!=='Pasted links'&&csv.name!=='Google Doc'?`<span class="addn-drop-title">${esc(csv.name)}</span><span class="addn-drop-sub">${n} handle${n===1?'':'s'} read from the file</span>`:`<span class="addn-drop-title"><a>Choose a CSV</a> or drop it here</span><span class="addn-drop-sub">One Instagram handle per row</span>`}</label>`
    :m==='paste'
    ?`<textarea id="nl-text" class="addn-area" rows="5" placeholder="e.g. @pavansirisin, kyliejenner or https://instagram.com/vedictoons" oninput="nlPaste(this.value)" autocomplete="off">${esc(S.nlText||'')}</textarea><p class="addn-note">Separate with commas, spaces or new lines.</p>`
    :`<div style="display:flex;gap:8px;align-items:center"><input id="nl-doc" class="nl-input" value="${esc(S.nlDocUrl||'')}" placeholder="https://docs.google.com/document/d/…" oninput="S.nlDocUrl=this.value" onkeydown="nlDocKey(event)" autocomplete="off"><button type="button" class="ds-btn ds-btn--outline" style="flex:none" onclick="nlDocRead()">Read doc</button></div>
      ${S.nlDocErr?`<p class="addn-note" style="color:#b91c1c">${esc(S.nlDocErr)}</p>`:csv&&csv.name==='Google Doc'?`<p class="addn-note"><b>${n}</b> handle${n===1?'':'s'} read from the doc · demo</p>`:`<p class="addn-note">Set the doc to Anyone with the link can view.</p>`}`;
  const creatorsPane=`${methods}${pane}<p class="addn-note nl-skip">Handles not in My creators are skipped. The list is created with the matched creators.</p>`;
  const hasName=name.trim().length>0;
  const foot=step===1
    ?`<span class="addn-sum">Next: add creators</span><div class="addn-actions"><button type="button" class="ds-btn ds-btn--ghost" onclick="nlClose()">Cancel</button><button type="button" id="nl-next" class="ds-btn ds-btn--primary" ${hasName?'':'disabled'} onclick="nlGoStep(2)">Next: creators</button></div>`
    :`<span class="addn-sum"><b id="nl-sum">${n}</b> creator handle${n===1?'':'s'} ready</span><div class="addn-actions"><button type="button" class="ds-btn ds-btn--ghost" onclick="nlGoStep(1)">Back</button><button type="button" id="nl-submit" class="ds-btn ds-btn--primary" ${hasName&&n>0?'':'disabled'} onclick="nlCreate()">Create list</button></div>`;
  return `<div class="disc-cfg-scrim" onclick="if(event.target===this)nlClose()">
    <div class="addn nl-dlg" role="dialog" aria-modal="true" aria-label="New list">
      <div class="addn-head"><div><h3>New list</h3><p>${step===1?'Name the list and set the campaign basics.':'Add creators to the list.'}</p></div><button type="button" class="ds-iconbtn" aria-label="Close" onclick="nlClose()">${X_SVG}</button></div>
      <div class="nl-body">${stepper}${step===1?briefPane:creatorsPane}</div>
      <div class="addn-foot">${foot}</div>
    </div></div>`;
}
/* shortlist budget: click to edit, Enter or blur saves, Escape cancels (same pattern as plan cost cells) */
function plBudEdit(id){ S.plBudEdit=id; paintBody(); setTimeout(()=>{ const i=document.querySelector('.pl-bud-in'); if(i){ i.focus(); i.select(); } },0); }
function plBudSave(pid,v){ if(S.plBudEdit!==pid) return; const p=planOf(pid); const n=Math.round(Number(String(v||'').replace(/[^\d.]/g,''))); if(p&&String(v||'').trim()!==''&&isFinite(n)&&n>=0){ p.budget=n; toast('Budget saved'); } S.plBudEdit=null; paintBody(); }
function plBudKey(e,pid){ if(e.key==='Enter'){ e.preventDefault(); plBudSave(pid,e.target.value); } else if(e.key==='Escape'){ S.plBudEdit=null; paintBody(); } }
function plBudCell(p){
  if(S.plBudEdit===p.id) return `<input class="pl-note-in pl-cost-in pl-bud-in" type="number" min="0" step="500" inputmode="numeric" value="${p.budget??''}" aria-label="Budget for ${esc(p.name)}" onclick="event.stopPropagation()" onblur="plBudSave('${p.id}',this.value)" onkeydown="plBudKey(event,'${p.id}')">`;
  return `<div class="pl-note pl-bud-cell" role="button" tabindex="0" title="Click to edit budget" onclick="event.stopPropagation();plBudEdit('${p.id}')" onkeydown="if(event.key==='Enter'){event.stopPropagation();plBudEdit('${p.id}')}">${rupees(p.budget)}</div>`;
}
function planCompareToggle(id,on){
 const a=new Set(S.planCompareIds||[]);
 if(on){if(a.size>=2){toast('Compare two plans at a time');paintBody();return;}a.add(id);}else a.delete(id);
 S.planCompareIds=[...a];if(a.size<2)S.planCompareOpen=false;paintBody();
}
function planCompareClear(){S.planCompareIds=[];S.planCompareOpen=false;paintBody();}
function openPlanCompare(){
 const ids=(S.planCompareIds||[]).filter(id=>CAMP_PLANS.some(p=>p.id===id)).slice(0,2);
 if(ids.length!==2)return toast('Select two campaign plans to compare');
 dlg('Compare campaign plans','Compare strategy, creator pool, delivery expectations and budget before choosing a plan to approve.','<div class="pl-cmp-dlg">'+planCompareHTML(ids)+'</div>','<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button>');
}
function planCompareHTML(ids){
 const plans=ids.map(planOf).filter(Boolean);if(plans.length!==2)return '';
 const [a,b]=plans, cost=p=>p.shortlisted.reduce((s,id)=>s+plCost(p,id),0);
 const metrics=[
 ['Objective',p=>p.objective||'—'],['Product',p=>planProds(p).join(', ')||'—'],['Plan status',p=>planStageOf(p)],
 ['Creators in pool',p=>p.creators.length],['Shortlisted creators',p=>p.shortlisted.length],
 ['Planned budget',p=>rupees(p.budget)],['Estimated shortlisted cost',p=>rupees(cost(p))],
 ['Budget headroom',p=>rupees((p.budget||0)-cost(p))],['Target views',p=>p.targetViews?exactN(p.targetViews):'Not set'],
 ['Target CPV',p=>p.targetViews&&cost(p)?'₹'+(cost(p)/p.targetViews).toFixed(2):'—'],
 ['Formats',p=>(p.content?.formats||[p.format]).filter(Boolean).join(', ')||'—'],['Audience locations',p=>(p.audience?.locations||[]).join(', ')||'Any'],
 ['Age ranges',p=>(p.audience?.ages||[]).join(', ')||'Any'],['Gender',p=>p.audience?.gender||'All'],
 ['Must cover',p=>(p.content?.mustCover||[]).join(', ')||'—'],['Must avoid',p=>(p.content?.mustAvoid||[]).join(', ')||'—']
 ];
 return `<div class="ds-table-wrap"><table class="ds-table pl-cmp"><thead><tr><th class="pl-cmp-k">Review criteria</th><th><button class="ds-namebtn" onclick="openPlan('${a.id}')">${esc(a.name)}</button></th><th><button class="ds-namebtn" onclick="openPlan('${b.id}')">${esc(b.name)}</button></th></tr></thead><tbody>${metrics.map(([l,f])=>`<tr><th>${l}</th><td>${esc(String(f(a)))}</td><td>${esc(String(f(b)))}</td></tr>`).join('')}</tbody></table></div>`;
}
function shortlistHTML(){
  const q=(S.planQ||'').toLowerCase().trim(), view=S.planView||'table';
  const stg=S.planStage||'All', ob=S.planObj||'All', fm=S.planFmt||'All';
  const plans=CAMP_PLANS.filter(p=>[p.name,p.brief,p.product,p.objective,p.format,p.comments].join(' ').toLowerCase().includes(q))
    .filter(p=>(stg==='All'||planStageOf(p)===stg)&&(ob==='All'||p.objective===ob)&&(fm==='All'||p.format===fm));
  const evaluated=new Set(CAMP_PLANS.flatMap(p=>p.creators)).size;
  const compareIds=(S.planCompareIds||[]).filter(id=>CAMP_PLANS.some(p=>p.id===id)).slice(0,2);
  const compareBar=`<div class="ds-toolbar ds-toolbar--wrap" style="align-items:center"><span class="ds-caption">${compareIds.length}/2 plans selected</span><span class="ds-spacer"></span><button class="ds-btn ds-btn--outline ds-btn--sm" ${compareIds.length!==2?'disabled':''} onclick="openPlanCompare()">Compare plans</button><button class="ds-btn ds-btn--ghost ds-btn--sm" onclick="planCompareClear()">Clear</button></div>`;
  const comparison='';
  const body=view==='cards'
    ? `<div class="ds-cards">${plans.map(planCardHTML).join('')||'<div class="ds-empty">No matching campaign plans. Try another search or filter.</div>'}</div>`
    : `<div class="ds-table-wrap"><table class="ds-table ds-table--wide pl-table"><thead><tr><th class="ds-cb" aria-label="Compare plans"></th><th>Campaign plan</th><th>Product</th><th>Objective</th><th>Format</th><th class="ds-num">Creators</th><th class="ds-num">Shortlisted</th><th class="ds-num">Budget</th><th>Created</th><th>Status</th><th>Comments</th><th class="ds-sticky-r">Action</th></tr></thead>
      <tbody>${plans.map(p=>{ const st=planStageOf(p); return `<tr class="is-clickable" tabindex="0" onclick="openPlan('${p.id}')" onkeydown="if(event.key==='Enter'&&event.target===this)openPlan('${p.id}')">
        <td class="ds-cb" onclick="event.stopPropagation()"><input type="checkbox" aria-label="Select ${esc(p.name)} for plan comparison" ${compareIds.includes(p.id)?'checked':''} onchange="planCompareToggle('${p.id}',this.checked)"></td><td><button class="ds-namebtn" onclick="event.stopPropagation();openPlan('${p.id}')">${esc(p.name)}</button><div class="ds-table-meta">${esc(p.brief)}</div></td>
        <td>${esc(p.product)}</td><td>${ctTag(p.objective)}</td><td>${fmtTag(p.format)}</td>
        <td class="ds-num">${p.creators.length}</td><td class="ds-num">${p.shortlisted.length}</td><td class="ds-num">${plBudCell(p)}</td><td>${esc(p.created)}</td>
        <td onclick="event.stopPropagation()">${stageSelHTML(p,st)}</td>
        <td class="pl-cmt" onclick="event.stopPropagation()">${plNoteCell(p)}</td>
        <td class="ds-sticky-r" onclick="event.stopPropagation()"><div class="pl-actions"><details class="ds-more"><summary class="ds-btn ds-btn--outline ds-btn--sm" aria-label="More options for ${esc(p.name)}">⋯</summary><div class="ds-more-menu"><button onclick="openFromPlan('${p.id}')">Launch campaign</button><button onclick="openPlan('${p.id}')">Open list</button><button onclick="openPlanComment('${p.id}')">Edit comments</button><button class="is-danger" onclick="openDeletePlan('${p.id}')">Delete list</button></div></details></div></td></tr>`;}).join('')||'<tr><td colspan="11" class="ds-empty">No matching lists.</td></tr>'}</tbody></table></div>`;
  return `<div class="ds-page">
    <div class="ds-head"><div><h1 class="ds-page-title">Campaign plan</h1><p class="ds-page-desc">Set a target once, then add creators to it. When a campaign plan is ready, create a campaign from it.</p></div>
      <div class="ds-actions"><button class="ds-btn ds-btn--primary" onclick="openNewList()">${icon('plus','ico-sm')}New list</button></div></div>
    ${dsOverview('Overview',[
      {label:'Campaign plans',ico:'layers',value:CAMP_PLANS.length,sub:'Total plans'},
      {label:'Creators evaluated',ico:'users',value:evaluated,sub:'Across all plans'},
      {label:'Total planned budget',ico:'target',value:rupees(sumOf(CAMP_PLANS,'budget')),sub:'Sum of plan budgets'}])}
    <div class="ds-toolbar ds-toolbar--wrap pl-tools">${dsSearch('planQ','Search plans, product, comments',S.planQ||'')}${dsFilter('planStage','Status',[['All','All statuses'],...PLAN_STAGES.map(s=>[s,s])],stg)}${dsFilter('planObj','Objective',[['All','All objectives'],...uniq(CAMP_PLANS.map(p=>p.objective)).map(x=>[x,x])],ob)}${dsFilter('planFmt','Format',[['All','All formats'],...uniq(CAMP_PLANS.map(p=>p.format)).map(x=>[x,x])],fm)}<span class="ds-spacer"></span><span class="ds-table-meta">${plans.length} plans</span>${dsViewSeg('planView',[['table','Table'],['cards','Cards']],view)}</div>
    ${compareBar}${comparison}${body}
    ${S.nlOpen?newListHTML():''}
  </div>`;
}

/* ════════ DASHBOARD + MY CAMPAIGNS (uploaded-prototype layout, DS components) ════════ */
const CR_EXTRA={cr1:{gender:'Male',state:'Karnataka'},cr2:{gender:'Female',state:'California'},cr3:{gender:'Other',state:'Maharashtra'},cr4:{gender:'Male',state:'Karnataka'},cr5:{gender:'Male',state:'New York'},cr6:{gender:'Other',state:'Maharashtra'},cr7:{gender:'Female',state:'Maharashtra'},cr8:{gender:'Female',state:'Karnataka'}};
const crAttr=(id,k)=>{const c=crOf(id)||{};return k==='tier'?c.tier:(CR_EXTRA[id]||{})[k];};
const dashState=()=>S.dash||(S.dash={period:'thisMonth',category:'All',product:'All',gender:'All',state:'All',tier:'All',concept:'All',campaign:'All',cstat:'All',csort:'All',tmetric:'all',day:'',recent:'14'});
function setDash(k,v){ S.dash={...dashState(),[k]:v}; paintBody(); }
function periodOK(date,per,cust){ const r=rangeOf(per,cust); return !r||(date>=r.from&&date<=r.to); }
function dashPosts(){
  const f=dashState();
  return [...CAMP_LIST].sort((a,b)=>a.created.localeCompare(b.created))
    .filter(c=>inCamp(f,c.id))
    .filter(c=>f.category==='All'||c.category===f.category)
    .flatMap(c=>c.posts.map(p=>({...p,campaignId:c.id,campaignName:c.name,category:c.category}))).filter(p=>dashExtraOK(p,f))
    .filter(((seen)=>p=>!seen.has(p.id)&&seen.add(p.id))(new Set()))
    .filter(p=>(!f.day||p.date.startsWith(f.day))&&periodOK(p.date,f.period,{from:f.from,to:f.to})&&(f.product==='All'||p.product===f.product)&&(f.concept==='All'||p.concept===f.concept)
      &&(f.gender==='All'||crAttr(p.creator,'gender')===f.gender)&&(f.state==='All'||crAttr(p.creator,'state')===f.state)&&(f.tier==='All'||crAttr(p.creator,'tier')===f.tier));
}
/* Dashboard filter row (above the campaign overview): objective, status, creator type, platform, organic / paid */
const dashObjOf=c=>((CAMP_PLANS.find(p=>p.product===c.product)||{}).objective)||'Unplanned';
function dashCampOK(c,f){
  const ob=f.objective||'All', st=f.dstatus||'All';
  return (ob==='All'||dashObjOf(c)===ob)&&(st==='All'||(st==='Active'?c.status==='Active':c.status!=='Active'));
}
function dashExtraOK(p,f){
  const c=CAMP_LIST.find(x=>x.id===p.campaignId);
  const pl=f.platform||'All', md=f.mode||'All', ct=f.ctype||'All';
  return (!c||dashCampOK(c,f))&&(pl==='All'||campPlatform(p)===pl)&&(md==='All'||(md==='organic'?p.paid===0:p.paid>0))&&(ct==='All'||crAttr(p.creator,'tier')===ct);
}
function dashFilterRowHTML(){
  const f=dashState();
  const objs=uniq(CAMP_LIST.map(c=>dashObjOf(c)));
  const tiers=uniq(CAMP_LIST.flatMap(c=>(c.creatorIds||[]).map(id=>crAttr(id,'tier'))));
  return `<div class="dk-frow" role="group" aria-label="Dashboard filters">${dashCampFilterHTML()}${dsFilterD('product','Product',[['All','All products'],...dashProducts().map(x=>[x,x])],f.product||'All')}${dsFilterD('category','Category',[['All','All categories'],...uniq(CAMP_LIST.map(c=>c.category).filter(Boolean)).map(x=>[x,x])],f.category||'All')}${dsFilterD('objective','Objective',[['All','All objectives'],...objs.map(x=>[x,x])],f.objective||'All')}${dsFilterD('dstatus','Status',[['All','All statuses'],['Active','Live'],['Completed','Completed']],f.dstatus||'All')}${dsFilterD('ctype','Creator type',[['All','All creator types'],...tiers.map(x=>[x,x])],f.ctype||'All')}${dsFilterD('platform','Platform',[['All','All platforms'],['Instagram','Instagram'],['TikTok','TikTok']],f.platform||'All')}${dsFilterD('mode','Organic / Paid',[['All','Combined'],['organic','Organic'],['paid','Paid']],f.mode||'All')}${dwSettingsHTML()}</div>`;
}
function dsFilterD(k,label,opts,val){
  const cur=opts.find(o=>o[0]===val)||opts[0]; const on=val!=='All';
  return `<label class="ds-filter${on?' is-active':''}"><span>${on?esc(cur[1]):label}</span><select aria-label="${label}" onchange="setDash('${k}',this.value)">${opts.map(([v,l])=>`<option value="${esc(v)}" ${v===val?'selected':''}>${esc(l)}</option>`).join('')}</select>${on?`<button class="ds-filter-x" aria-label="Clear ${label}" onclick="event.preventDefault();setDash('${k}','All')">×</button>`:''}</label>`;
}
const uniq=a=>[...new Set(a.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b)));
/* Sentiment is not classified by the backend yet: show a placeholder instead of invented values */
const SENT_NA_TIP='Comment sentiment is not classified yet. It appears here once the backend classifier is connected.';
const sentNAHTML=(extra='')=>`<div class="sent-na${extra}" title="${SENT_NA_TIP}"><span class="sent-na-t">Not yet available</span><span class="sent-na-s">Comment sentiment is not classified yet</span></div>`;
function segRows(posts,keyFn){
  const groups={};
  posts.forEach(p=>{const k=keyFn(p)||'Unknown';(groups[k]=groups[k]||[]).push(p);});
  return Object.entries(groups).map(([name,ps])=>({name,posts:ps,views:sumOf(ps,'views'),spend:sumOf(ps,'cost')})).sort((a,b)=>b.views-a.views);
}
const COLS_SVG='<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>';
const X_SVG='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
function openDrawer(title,sub,bodyHTML,headExtra='',cls=''){
  closeLayer();
  document.getElementById('layer').insertAdjacentHTML('beforeend',`<div class="ds-drawer-back" onclick="if(event.target===this)closeLayer()"><aside class="ds-page ds-drawer${cls?' '+cls:''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="ds-drawer-head"><div><h2>${title}</h2><p>${sub}</p></div><div class="ds-drawer-actions">${headExtra}<button class="ds-icon-btn" aria-label="Close" title="Close" onclick="closeLayer()" style="width:32px;height:32px;padding:0;border:0;background:transparent;box-shadow:none;display:grid;place-items:center;color:#0f172a;border-radius:8px">${X_SVG.replace('<svg ','<svg style="display:block" ')}</button></div></div><div class="ds-drawer-body">${bodyHTML}</div></aside></div>`);
}

const DK_DEFS={'Published posts':'Posts published within the selected filters','Total views':'Lifetime views on posts published in the selected period (not views gained in it)','Total spend':'Sum of post costs for posts published in the period: creator fees and boost spend','Blended CPV':'Total spend divided by total views, paid and organic','Paid CPV':'Paid spend divided by paid views only'};
function dashJump(id){ const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); }
const DK_PAL=['#2563eb','#16a34a','#fbbf24','#ef4444','#8b5cf6','#0284c7','#64748b'];
const DK_ORG='#1e40af', DK_PAID='#0ea5e9';
const DK_DEF={cperf_spend:'spend',cperf_split:'views'};
const dkMetric=(k,d)=>(S.dashM||{})[k]||d||DK_DEF[k]||'views';
const dkVal=(rows,m)=>rows.map(r=>({...r,v:m==='spend'?r.spend:m==='posts'?r.posts.length:r.views}));
const dkFmt=(m,v)=>m==='spend'?rupees(v):m==='posts'?String(v):exactN(v);
const dkCol=i=>DK_PAL[i%DK_PAL.length];
const dkPlural=(n,w)=>`${n} ${n===1?w:w+'s'}`;
const dkEmptyState=(t,s='')=>`<div class="dk-empty" role="status"><span class="dk-empty-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg></span><b>${t}</b>${s?`<small>${s}</small>`:''}</div>`;
function dkHead(key,title,sub,link=''){
  return dwHead({title,sub,actions:`${link}${dwMenu(key,title)}`});
}
function dkSettings(key,title){
  const cur=dkMetric(key);
  showModal(`${esc(title)} settings`,`<p class="ds-caption">Choose what this widget measures.</p><div class="dk-opts">${[['views','Views'],['spend','Spend'],['posts','Posts']].map(([v,l])=>`<label class="dk-opt"><input type="radio" name="dkm" value="${v}" ${cur===v?'checked':''}><span>${l}</span></label>`).join('')}</div>`,`<button class="ds-btn ds-btn--primary" onclick="dkApply('${key}')">Apply</button>`);
}
function dkApply(key){
  const v=document.querySelector('#layer input[name=dkm]:checked')?.value||'views';
  S.dashM={...(S.dashM||{}),[key]:v}; closeLayer(); paintBody();
}
const dkEmpty=()=>'<div class="ds-empty">No data for this filter.</div>';
/* two-line rows; 'split' adds the organic / paid stack per row */
function dkRich(rows,m,mode='',kind=''){
  const d=dkVal(rows,m), tot=d.reduce((s,r)=>s+r.v,0)||1;
  return `<div class="dk-rich">${d.map((r,i)=>{
    const org=sumOf(r.posts,'organic'), paid=sumOf(r.posts,'paid'), t=(org+paid)||1;
    const stack=mode==='split'?`<div class="dk-stack2"><i style="width:${(org/t*100).toFixed(1)}%;background:${DK_ORG}" title="Organic"></i><i style="width:${(paid/t*100).toFixed(1)}%;background:${DK_PAID}" title="Paid"></i></div>`:'';
    const meta=mode==='split'?`<span>${(org/t*100).toFixed(0)}% organic · ${(paid/t*100).toFixed(0)}% paid</span>`:`<span>${dkPlural(r.posts.length,'post')} · ${rupees(r.spend)}</span>`;
    return `<div class="dk-rr${kind?' is-click':''}"${kind?` role="button" tabindex="0" data-name="${esc(r.name)}" onclick="openDimSide('${kind}',this.dataset.name)" onkeydown="if(event.key==='Enter')this.click()"`:''}><div class="dk-rr-top"><span class="dk-hb-l" title="${esc(r.name)}"><i class="dk-sw" style="background:${dkCol(i)}"></i>${esc(r.name)}</span><b>${dkFmt(m,r.v)}</b><small>${(r.v/tot*100).toFixed(0)}%</small></div>${stack}<div class="dk-rr-meta">${meta}${mode==='split'?`<span>${dkPlural(r.posts.length,'post')} · ${rupees(r.spend)}</span>`:''}</div></div>`;
  }).join('')||dkEmpty()}</div>`;
}
/* donut with colour-coded legend */
function dkDonut(rows,m){
  const d=dkVal(rows,m);
  if(!d.some(r=>r.v>0)) return `<div class="dk-empty-wrap">${dkEmptyState('No data yet','Breakdown appears once posts go live.')}</div>`;
  const tot=d.reduce((s,r)=>s+r.v,0), RING=2*Math.PI*46;
  let off=0;
  const arcs=d.map((r,i)=>{const len=(r.v/tot*RING); const el=`<circle class="dk-arc" cx="60" cy="60" r="46" fill="none" stroke="${dkCol(i)}" stroke-width="16" stroke-dasharray="${len.toFixed(2)} ${RING.toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 60 60)"><title>${esc(r.name)}: ${dkFmt(m,r.v)} (${(r.v/tot*100).toFixed(0)}%)</title></circle>`; off+=len; return el;}).join('');
  const legend=d.map((r,i)=>`<div title="${esc(r.name)}: ${dkFmt(m,r.v)} (${(r.v/tot*100).toFixed(0)}%)"><span><i class="dk-sw" style="background:${dkCol(i)}"></i>${esc(r.name)}</span><b>${dkFmt(m,r.v)} · ${(r.v/tot*100).toFixed(0)}%</b></div>`).join('');
  return `<div class="dk-donut-wrap dk-donut-sm"><svg viewBox="0 0 120 120" class="dk-donut" role="img" aria-label="Breakdown"><circle cx="60" cy="60" r="46" fill="none" stroke="#f1f5f9" stroke-width="16"/>${arcs}</svg><div class="dk-donut-c dk-donut-c--sm"><b>${dkFmt(m,tot)}</b><span>total</span></div></div><div class="dk-list">${legend||'<div><span>No data</span><b>—</b></div>'}</div>`;
}
const DK_STATS=[['All','Total campaigns','Campaigns in scope','Unique campaigns in the selected scope. Each campaign is counted once.'],['Active','Running','Lifecycle: active','Campaigns whose lifecycle status is Active as of today. Can overlap with Live now.'],['Live','Live now','Published in last 30 days','Running campaigns with at least one post published in the last 30 days (as of 29 Oct 2026).'],['Completed','Completed','Lifecycle: completed','Campaigns marked completed. Not counted as running.']];
const daysAgo=d=>Math.round((new Date(TODAY+'T12:00:00')-new Date(d+'T12:00:00'))/864e5);
function dashScopeCamps(){ const f=dashState(); return CAMP_LIST.filter(c=>(inCamp(f,c.id))&&(f.category==='All'||c.category===f.category)&&dashCampOK(c,f)&&(!f.product||f.product==='All'||c.posts.some(p=>p.product===f.product))); }
const dashProducts=()=>uniq(CAMP_LIST.flatMap(c=>c.posts.map(p=>p.product)));
const DK_SVG=d=>`<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const DK_ICO={total:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',running:'<path d="M6 4l14 8-14 8z"/>',live:'<circle cx="12" cy="12" r="2.5"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>',completed:'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>',
  posts:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',views:'<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',spend:'<path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6M12 2v20"/>',blended:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',paid:'<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>'};
/* Collapsed metric cards show their key figures on the summary row; hidden when open */
function dkMiniHTML(items){ return `<span class="dk-mini">${items.map(([ico,v,of])=>`<span class="dk-mini-item">${DK_SVG(DK_ICO[ico])}<b>${v}</b>${of?`<small>${of}</small>`:''}</span>`).join('')}</span>`; }
function dashStatusHTML(){
  const scope=dashScopeCamps(), cur=dashState().cstat||'All';
  const posts=dashPosts();
  const counts={All:scope.length,Active:scope.filter(c=>c.status==='Active').length,Completed:scope.filter(c=>c.status!=='Active').length};
  const planned=scope.reduce((a,c)=>a+Number(c.plannedVideos||0),0);
  const pct=planned?Math.round(posts.length/planned*100):0;
  const views=sumOf(posts,'views'), spend=sumOf(posts,'cost');
  const paidPosts=posts.filter(p=>p.paid>0), paidSpend=sumOf(paidPosts,'cost'), paidViews=sumOf(posts,'paid');
  const avg=posts.length?exactN(Math.round(views/posts.length)):'—';
  const defOf=k=>(DK_STATS.find(x=>x[0]===k)||[])[3]||'';
  const item=(k,l,v,ico,sub)=>`<button type="button" class="dk-ov-item${cur===k?' is-on':''}" title="${esc(defOf(k))}" aria-pressed="${cur===k}" onclick="setDash('cstat','${cur===k&&k!=='All'?'All':k}')"><span class="dk-ov-l">${DK_SVG(DK_ICO[ico])}${l}</span><b>${v}</b>${sub?`<small>${sub}</small>`:''}</button>`;
  const stat=(l,v,ico,sub,title,spk)=>`<div class="dk-ov-item dk-ov-static" title="${esc(title||'')}"><span class="dk-ov-l">${DK_SVG(DK_ICO[ico])}${l}</span>${spk?`<span class="ov-vr"><b>${v}</b>${spk}</span>`:`<b>${v}</b>`}${sub?`<small>${sub}</small>`:''}</div>`;
  const dayMap={}; posts.forEach(p=>{const d=dayMap[p.date]||(dayMap[p.date]={v:0,s:0,n:0}); d.v+=p.views||0; d.s+=p.cost||0; d.n+=1;});
  const dayKeys=Object.keys(dayMap).sort(); const sr=k=>dayKeys.map(d=>dayMap[d][k]);
  return `<details class="dk-ov dk-acc" ${S.dashOvOpen===false?'':'open'} ontoggle="S.dashOvOpen=this.open"><summary class="dk-p2-head dk-acc-h"><span class="dk-acc-chev">${DK_SVG('<path d="M6 9l6 6 6-6"/>')}</span><span class="dk-acc-t">Campaign overview</span>${dkMiniHTML([['running',counts.Active,`/ ${counts.All}`],['live',posts.length,`/ ${planned}`],['views',exactN(views)],['spend',rupees(spend)]])}</summary>
    <div class="dk-ov-cells" role="group" aria-label="Campaign and post overview"><div class="dk-ov-grp"><span class="dk-ov-gl">Delivery</span><div class="dk-ov-row dk-ov-row--2">${item('Active','Campaigns running',`${counts.Active} / ${counts.All}`,'running',`${counts.Completed} completed · ${counts.All} total`)}${stat('Published posts',`${posts.length} / ${planned}`,'live',`${pct}% of planned posts`,'Posts published in the selected period against the planned posts of these campaigns',ovSpark(sr('n'),'#0ea5e9'))}</div></div><div class="dk-ov-grp"><span class="dk-ov-gl">Performance</span><div class="dk-ov-row dk-ov-row--4">${stat('Total views',exactN(views),'views',`Avg ${avg} per post`,DK_DEFS['Total views'],ovSpark(sr('v'),'#1e40af')).replace('dk-ov-item dk-ov-static','dk-ov-item dk-ov-static dk-ov-vr')}${stat('Total spent',rupees(spend),'spend',`Across ${posts.length} ${posts.length===1?'post':'posts'}`,DK_DEFS['Total spend'],ovSpark(sr('s'),'#fcd34d'))}${stat('Avg CPV',cpvOf(spend,views),'blended','All spend ÷ all views')}${stat('Paid CPV',paidViews?cpvOf(paidSpend,paidViews):'—','paid',`Paid spend ÷ ${exactN(paidViews)} paid views`)}</div></div></div>
  </details>`;
}

function ovSpark(vals,color){
  return ''; // sparklines removed from the overview metric cards
  const w=110,h=34; if(!vals||vals.length<2||vals.every(v=>!v)) return '';
  const mx=Math.max(...vals,1);
  const pts=vals.map((v,i)=>[i*(w/(vals.length-1)), h-3-(v/mx)*(h-8)]);
  const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join('');
  const last=pts[pts.length-1];
  return `<svg class="ov-spk" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="${line}L${w} ${h}L0 ${h}Z" fill="${color}" opacity=".12"/><path d="${line}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="2.4" fill="${color}"/></svg>`;
}

const inCamp=(f,id)=>f.campaign==='All'||f.campaign.split(',').includes(id);
function dashCampFilterHTML(){
  const f=dashState(), sel=f.campaign==='All'?[]:f.campaign.split(','), q=(S.dashCampQ||'').toLowerCase().trim();
  const opts=CAMP_LIST.filter(c=>!q||c.name.toLowerCase().includes(q));
  return `<details class="dk-cf" ${S.dashCampOpen?'open':''} ontoggle="S.dashCampOpen=this.open"><summary class="ds-btn ds-btn--outline ds-btn--sm dk-cf-btn${sel.length?' is-on':''}">Campaign${sel.length?` <b class="ds-count">${sel.length}</b>`:''}<span class="dk-cf-chev" aria-hidden="true">${DK_SVG('<path d="M6 9l6 6 6-6"/>')}</span></summary><div class="dk-cf-panel">${campSearchBox('dashCampQ','Search campaigns')}<div class="dk-cf-list">${opts.map(c=>`<label class="dk-cf-item"><input type="checkbox" ${sel.includes(c.id)?'checked':''} onchange="dashToggleCamp('${c.id}')"><span>${esc(c.name)}</span></label>`).join('')||'<span class="ds-caption">No campaigns match</span>'}</div><div class="dk-cf-foot"><button type="button" class="ds-btn ds-btn--ghost ds-btn--sm" onclick="setDash('campaign','All')">All campaigns</button></div></div></details>`;
}
function dashToggleCamp(id){ const f=dashState(); let sel=f.campaign==='All'?[]:f.campaign.split(','); sel=sel.includes(id)?sel.filter(x=>x!==id):[...sel,id]; setDash('campaign',sel.length?sel.join(','):'All'); }
function tvPick(el){ const wrap=el.closest('.tv-chart'); const rows=JSON.parse(wrap.dataset.rows||'[]'), x=rows[+el.dataset.i]; if(!x||!x.key) return; dayActivity(x); }
function dayActivity(x){
  const ps=dashPosts().filter(p=>p.date===x.key).sort((p,q)=>q.views-p.views);
  const TONES=['#1e40af','#0ea5e9','#fcd34d','#3b82f6','#fb923c','#2563eb'];
  const ini=n=>n.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  const views=sumOf(ps,'views'), spend=sumOf(ps,'cost');
  const list=ps.length?ps.map((p,i)=>{const c=crOf(p.creator)||{name:p.creator||'Creator'}, boosted=p.paid>0;
    return `<div class="da-row"><span class="da-av" style="background:${TONES[i%TONES.length]}">${esc(ini(c.name))}</span>
      <div class="da-main"><b>${esc(c.name)}</b><small>${esc(p.campaignName||'—')} · ${esc(p.format||'Post')}</small></div>
      <span class="da-tag${boosted?' is-b':''}">${boosted?'Boosted':'Organic'}</span>
      <b class="da-v">${exactN(p.views)}<small>views</small></b></div>`;}).join(''):'<p class="da-empty">No posts went live on this day.</p>';
  const body=`<div class="da-sum"><span><b>${ps.length}</b> post${ps.length===1?'':'s'}</span><span><b>${exactN(views)}</b> views</span><span><b>${rupees(spend)}</b> spend</span></div><div class="da-list">${list}</div>`;
  showModal(`Activity on ${campDate(x.key)}`,body,`<button class="ds-btn ds-btn--outline" onclick="closeLayer();setDash('day','${x.key}')">Filter dashboard to this day</button>`);
}
/* 11a: insights and recommendations, computed from the posts in view */
function dashInsights(posts){
  const out=[], group=key=>{ const m={}; posts.forEach(p=>{ const k=key(p); if(!k) return; const g=m[k]||(m[k]={k,n:0,v:0,cost:0}); g.n++; g.v+=p.views; g.cost+=p.cost; }); return Object.values(m).filter(g=>g.n>=2); };
  const avgV=g=>exactN(Math.round(g.v/g.n));
  const byConcept=group(p=>p.concept||'Post').sort((a,b)=>b.v/b.n-a.v/a.n)[0];
  if(byConcept) out.push({tag:'Concept',t:`${esc(byConcept.k)} leads on reach`,r:`Posts in this concept average ${avgV(byConcept)} views across ${byConcept.n} posts. Brief more creators on it.`});
  const byFormat=group(p=>p.format).sort((a,b)=>b.v/b.n-a.v/a.n);
  if(byFormat.length>1) out.push({tag:'Format',t:`${esc(byFormat[0].k)}s outperform`,r:`${esc(byFormat[0].k)}s average ${avgV(byFormat[0])} views against ${avgV(byFormat[byFormat.length-1])} for ${esc(byFormat[byFormat.length-1].k)}s. Prefer ${esc(byFormat[0].k)} in the next briefs.`});
  const costed=group(p=>p.cost>0&&p.views?p.product:null).map(g=>({...g,cpv:g.cost/g.v})).sort((a,b)=>a.cpv-b.cpv);
  if(costed.length>1) out.push({tag:'Product',t:`${esc(costed[0].k)} is the most efficient`,r:`It costs ${cpvOf(costed[0].cost,costed[0].v)} per view, against ${cpvOf(costed[costed.length-1].cost,costed[costed.length-1].v)} for ${esc(costed[costed.length-1].k)}. Review spend on the costlier product.`});
  const views=sumOf(posts,'views'), paid=sumOf(posts,'paid');
  if(views) { const share=Math.round(paid/views*100); out.push({tag:'Paid reach',t:share>=40?'Paid reach is carrying the views':'Organic leads the reach',r:share>=40?`${share}% of views are paid. Test more organic-led briefs to lower cost per view.`:`Only ${share}% of views are paid, so boosting is a small lever here.`}); }
  return out;
}
function dashInsightsHTML(posts){
  const items=dashInsights(posts);
  if(!items.length) return '';
  return `<div class="ds-card dk-w dk-insights" id="dash-insights">${dwHead({title:`<span class="dk-ins-ttl">Insights${icon('sparkle','ico-sm ai-ico')}</span>`,sub:'Recommendations from the posts in view'})}
    <div class="dk-ins-grid">${items.map(dkInsHTML).join('')}</div></div>`;
}
function dashAlertsHTML(){
  const f=dashState(), days=parseInt(f.recent,10)||14, scope=dashScopeCamps(), posts=dashPosts();
  const items=[];
  const totS=scope.reduce((a,c)=>a+campSpend(c),0), totV=scope.reduce((a,c)=>a+campViews(c),0), port=totV?totS/totV:0;
  scope.forEach(c=>{
    const last=c.posts.map(p=>p.date).sort().pop(), ago=last?daysAgo(last):null, sp=campSpend(c), vw=campViews(c), bud=Number(c.budget||0);
    if(c.status==='Active'&&(ago==null||ago>days)) items.push({tone:'warn',tag:'Inactive',c,text:ago==null?'No posts yet':`no posts in ${days} days`});
    if(bud&&sp>bud) items.push({tone:'bad',tag:'Over budget',c,text:`${Math.round(sp/bud*100)}% of budget`});
    if(c.status==='Active'&&c.tracking&&c.posts.length<Number(c.plannedVideos||0)) items.push({tone:'warn',tag:'Behind plan',c,text:`${c.posts.length} of ${c.plannedVideos} posts`});
    if(vw&&port&&sp/vw>2*port) items.push({tone:'bad',tag:'High CPV',c,text:`CPV ${cpvOf(sp,vw)}`});
  });
  const viral=posts.filter(isViral).sort((a,b)=>viralRatio(b)-viralRatio(a)).slice(0,3).map(p=>({tone:'info',tag:'Viral',c:CAMP_LIST.find(c=>c.id===p.campaignId),text:`${exactN(p.views)} views · ${viralRatio(p).toFixed(1)}× creator average`}));
  items.unshift(...viral);
  const sorted=posts.map(p=>p.views).sort((a,b)=>a-b), med=sorted.length?sorted[Math.floor(sorted.length/2)]:0;
  posts.filter(p=>med&&p.views>=5*med).sort((a,b)=>b.views-a.views).slice(0,3).forEach(p=>items.push({tone:'info',tag:'Spike',c:CAMP_LIST.find(c=>c.id===p.campaignId),text:`${exactN(p.views)} views`}));
  const gaps=posts.filter(p=>!crAttr(p.creator,'gender')||!crAttr(p.creator,'state')).length;
  if(gaps) items.push({tone:'info',tag:'Data gap',c:null,text:`${gaps} posts, creator data missing`,act:['dash-breakdowns','View breakdowns']});
  const noCr=posts.filter(p=>!crOf(p.creator)).length;
  if(noCr) items.push({tone:'bad',tag:'Missing creator',c:null,text:`${noCr} posts`,act:['dash-posts','View posts']});
  const allPosts=CAMP_LIST.flatMap(c=>c.posts.map(p=>({...p,campaignId:c.id,campaignName:c.name})));
  const win=(a,b)=>allPosts.filter(p=>{const d=daysAgo(p.date);return d>=a&&d<=b;});
  const recentW=win(0,6), priorW=win(7,13);
  if(recentW.length>=3&&priorW.length>=3){ const ra=sumOf(recentW,'views')/recentW.length, pa=sumOf(priorW,'views')/priorW.length, ch=pa?Math.round((ra/pa-1)*100):0; if(Math.abs(ch)>=50) items.push({tone:ch<0?'bad':'warn',tag:'Views change',c:null,text:`${ch<0?'down':'up'} ${Math.abs(ch)}% vs prior week`,act:['dash-posts','View posts']}); }
  const SLOTS=5; const shown=items.slice(0,SLOTS), more=items.length-shown.length;
  const WHY={Inactive:'Running campaigns should keep publishing',['Over budget']:'Spend has passed the planned budget',['Behind plan']:'Fewer posts than planned',['High CPV']:'Costs more per view than the portfolio average',Spike:'Far above the typical post, worth checking',['Data gap']:'Unknown creator data hides real segments',['Missing creator']:'Posts without a creator cannot be attributed',['Views change']:'Recent posts are performing very differently',Viral:'Far above this creator’s own average'};
  return `<div class="ds-card dk-w dk-alerts" id="dash-alerts">
    ${dwHead({title:'Needs attention',sub:`${items.length} item${items.length===1?'':'s'} · status as of ${campDate(TODAY)}`,actions:`${dsFilterD('recent','Inactive after',[['7','7 days'],['14','14 days'],['30','30 days']],String(days))}${dwMenu('alerts')}`})}
    <div class="dk-alert-list">${shown.map(a=>`<div class="na-row"><span class="na-dot na-dot--${a.tone}"></span><div class="na-main">${a.c?`<button class="ds-namebtn na-name" onclick="openCampaign('${a.c.id}')">${esc(a.c.name)}</button>`:`<b class="na-name">${esc(a.tag)}</b>`}<span class="na-text">${esc(a.text)}</span></div>${a.act?`<button class="ds-namebtn na-act" onclick="dashJump('${a.act[0]}')">${a.act[1]} ›</button>`:`<span class="na-tag">${a.tag}</span>`}</div>`).join('')}${Array.from({length:SLOTS-shown.length},(_,k)=>`<div class="na-row na-row--empty">${(k===0&&!shown.length)?'<span class="na-text">Nothing needs attention in this scope.</span>':''}</div>`).join('')}${more>0?`<span class="ds-caption">+${more} more</span>`:''}</div>
  </div>`;
}
function axisN(v){ return v>=1e6?(v/1e6).toFixed(v%1e6===0?0:1)+'M':v>=1e3?Math.round(v/1e3)+'K':String(Math.round(v)); }
const TMODES=[['all','All'],['organic','Organic'],['paid','Boosted']];
function tmodeHTML(mode){ return `<div class="ds-seg dk-tmode" role="tablist" aria-label="Views series">${TMODES.map(([k,l])=>`<button type="button" class="${mode===k?'on':''}" role="tab" aria-selected="${mode===k}" onclick="setDash('tmetric','${k}')">${l}</button>`).join('')}</div>`; }
function dashTrendHTML(posts,f0,key='trend'){
  const f=f0||dashState(), mode=f.tmetric||'all';
  const head=dwHead({title:'Views trend',sub:'Lifetime views by post publish date',actions:dwMenu(key)});
  if(!posts.length) return `<section class="tv dk-trend is-empty">${head}${dkEmptyState('No published posts in this period.','Views appear here once posts go live.')}</section>`;
  const r=rangeOf(f.period,{from:f.from,to:f.to}), ds=posts.map(p=>p.date).sort();
  const lo=r?r.from:ds[0], hi=r?r.to:ds[ds.length-1];
  const daily=lo.slice(0,7)===hi.slice(0,7);
  let buckets;
  if(daily){ const ym=lo.slice(0,7), d0=+lo.slice(8), d1=+hi.slice(8); buckets=Array.from({length:d1-d0+1},(_,i)=>{const dk=`${ym}-${pad2(d0+i)}`; return {key:dk,label:String(d0+i),t:campDate(dk),inB:p=>p.date===dk};}); }
  else buckets=monthsBetween(lo.slice(0,7),hi.slice(0,7)).map(m=>({key:m,label:tlMonLabel(m),t:tlMonLong(m),inB:p=>p.date.slice(0,7)===m}));
  const n=buckets.length;
  const rows=buckets.map(b=>{const d=posts.filter(b.inB);return {key:b.key,label:b.label,t:b.t,n:d.length,nb:d.filter(p=>p.paid>0).length,v:sumOf(d,'views'),o:sumOf(d,'organic'),b:sumOf(d,'paid'),starts:0};});
  const first={}; posts.filter(p=>p.paid>0).forEach(p=>{ if(!first[p.campaignId]||p.date<first[p.campaignId]) first[p.campaignId]=p.date; });
  Object.values(first).forEach(d=>{ const row=rows.find(x=>x.key===(daily?d:d.slice(0,7))); if(row) row.starts++; });
  const series=mode==='organic'?['o']:mode==='paid'?['b']:['v','o','b'];
  const stacked=mode!=='organic'&&mode!=='paid';
  const yv=(x,k)=>k==='b'&&stacked?x.o+x.b:x[k];
  const top=Math.max(1,...rows.flatMap(x=>series.map(k=>yv(x,k))));
  const mag=Math.pow(10,Math.floor(Math.log10(top))), yMax=Math.ceil(top/mag)*mag;
  const W=1000,T=8,B=236;
  const col={v:'#fcd34d',o:'#1e40af',b:'#0ea5e9'};
  const lines=series.map(k=>{const pts=rows.map((x,i)=>`${(i/Math.max(1,n-1)*W).toFixed(1)},${(B-yv(x,k)/yMax*(B-T)).toFixed(1)}`).join(' ');return `<polyline points="${pts}" fill="none" stroke="${col[k]}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"${k==='v'?' stroke-dasharray="5 4"':''}/>`;}).join('');
  const svg=`<svg class="dk-trend-svg" viewBox="0 0 ${W} 240" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>`;
  const ticks=[0,1,2,3,4].map(i=>`<span style="bottom:${(i/4*100).toFixed(2)}%">${axisN(yMax*i/4)}</span>`).join('');
  const grid=[0,1,2,3,4].map(i=>`<i class="tv-gl" style="bottom:${(i/4*100).toFixed(2)}%"></i>`).join('');
  const markers=rows.map((x,i)=>x.starts?`<span class="dk-boost" style="left:${(i/Math.max(1,n-1)*100).toFixed(2)}%" title="${x.starts} campaign${x.starts===1?'':'s'} started boosting">▲</span>`:'').join('');
  const cols=rows.map((x,i)=>`<div class="tv-col" data-i="${i}" onmouseenter="tvHover(this)"></div>`).join('');
  const every=daily?5:Math.max(1,Math.ceil(n/8));
  const xl=rows.map((x,i)=>`<span>${(i%every===0||i===n-1)?esc(x.label):''}</span>`).join('');
  const data=esc(JSON.stringify(rows.map(x=>({key:x.key,t:x.t,n:x.n,v:x.v,o:x.o,b:x.b,nb:x.nb}))));
  const legend=`<div class="tv-legend">${series.includes('v')?'<span><i style="background:#fcd34d"></i>Total</span>':''}${series.includes('o')?'<span><i class="tv-org"></i>Organic</span>':''}${series.includes('b')?'<span><i class="tv-boo"></i>Boosted</span>':''}<span><b class="dk-boost-key">▲</b>Boost starts</span></div>`;
  const org=sumOf(posts,'organic'), paidV=sumOf(posts,'paid'), totV=(org+paidV)||1;
  const bp=posts.filter(p=>p.paid>0), bSpend=sumOf(bp,'cost');
  const op=(org/totV*100).toFixed(1), pp=(paidV/totV*100).toFixed(1);
  const m3=(l,v,sub,ic)=>`<div class="tv-m3"><span>${ic?DK_SVG(ic):''}${l}</span><b>${v}</b></div>`;
  const m3s=(l,v,p)=>`<div class="tv-m3"><span>${l}</span><b>${v}</b><small>${p}% of views</small></div>`;
  const side=`<div class="tv-side tv-sidex"><div class="tv-seg"><div class="tv-seg-bar" role="img" aria-label="Organic ${op}%, boosted ${pp}%"><i style="width:${op}%;background:${DK_ORG}"></i><i style="width:${pp}%;background:${DK_PAID}"></i></div></div><div class="tv-m3row">${m3s('Organic views',exactN(org),op)}${m3s('Boosted views',exactN(paidV),pp)}${m3('Boosted spend',rupees(bSpend),'')}</div></div>`;
  return `<section class="tv tv--split dk-trend" aria-label="Views trend"><div class="tv-main">${head}
    <div class="dk-trend-legend">${tmodeHTML(mode)}${legend}</div>
    <div class="tv-chart" data-rows="${data}" onmouseleave="tvLeave(this)">
      <div class="tv-frame"><div class="tv-yax">${ticks}</div><div class="tv-plot">${grid}${svg}${markers}<div class="tv-cols">${cols}</div><div class="tv-tip" hidden></div></div></div>
      <div class="tv-xax">${xl}</div>
    </div>
  </div>${side}</section>`;
}
function cwCountry(id){ const c=crOf(id)||{}; if(c.country&&c.country!=='—') return c.country; return (DISC_META[id]||{}).country||'Unknown'; }
function cwState(id){ return crAttr(id,'state')||'Unknown'; }
function dkSetM(k,v){ S.dashM={...(S.dashM||{}),[k]:v}; paintBody(); }
function cwAgg(ps,m){ return m==='spend'?sumOf(ps,'cost'):m==='posts'?ps.length:sumOf(ps,'views'); }
function cwGroupBy(ps,fn){ const g={}; ps.forEach(p=>{const k=fn(p); (g[k]=g[k]||[]).push(p);}); return g; }
function cwCountryRows(list,m,total,depth){
  return list.map((c,i)=>{
    const sg=cwGroupBy(c.ps,p=>cwState(p.creator));
    const kids=Object.entries(sg).map(([k,ps])=>({k,ps,v:cwAgg(ps,m)})).sort((x,y)=>y.v-x.v);
    const inner=kids.map(x=>`<div class="cw-row cw-child"><span class="cw-name">${esc(x.k)}</span><span class="cw-bar"><i style="width:${(x.v/(c.v||1)*100).toFixed(1)}%"></i></span><b>${dkFmt(m,x.v)}</b><small>${Math.round(x.v/(c.v||1)*100)}%</small></div>`).join('');
    return `<details class="cw-cty${depth?' cw-cty--sub':''}" ${i===0&&depth===0?'open':''}><summary class="cw-row cw-top"><span class="cw-name"><i class="cw-caret"></i>${esc(c.k)}</span><span class="cw-bar"><i style="width:${(c.v/(total||1)*100).toFixed(1)}%"></i></span><b>${dkFmt(m,c.v)}</b><small>${Math.round(c.v/(total||1)*100)}%</small></summary><div class="cw-kids">${inner}</div></details>`;
  }).join('');
}
function cwLocationHTML(posts,m){
  const total=cwAgg(posts,m)||1;
  const groups=cwGroupBy(posts,p=>cwCountry(p.creator));
  const list=Object.entries(groups).map(([k,ps])=>({k,ps,v:cwAgg(ps,m)})).sort((x,y)=>y.v-x.v);
  if(!list.length) return dkEmpty();
  const top=list.slice(0,4), rest=list.slice(4);
  let html=cwCountryRows(top,m,total,0);
  if(rest.length){
    const restPs=rest.flatMap(c=>c.ps), restV=cwAgg(restPs,m);
    const sub=cwCountryRows(rest,m,restV||1,1);
    html+=`<details class="cw-cty cw-cty--others"><summary class="cw-row cw-top"><span class="cw-name"><i class="cw-caret"></i>Others <em class="cw-n">${rest.length} countries</em></span><span class="cw-bar"><i style="width:${(restV/total*100).toFixed(1)}%"></i></span><b>${dkFmt(m,restV)}</b><small>${Math.round(restV/total*100)}%</small></summary><div class="cw-kids">${sub}</div></details>`;
  }
  return `<div class="cw-loc">${html}</div>`;
}
function cwSegBar(rows,m){
  const d=dkVal(rows,m).sort((x,y)=>y.v-x.v), tot=d.reduce((s,r)=>s+r.v,0)||1;
  if(!d.length) return dkEmpty();
  const bar=d.map((r,i)=>`<i style="width:${(r.v/tot*100).toFixed(2)}%;background:${dkCol(i)}" title="${esc(r.name)} · ${dkFmt(m,r.v)}"></i>`).join('');
  const list=d.map((r,i)=>`<div class="cw-seg-row"><span class="cw-name"><i class="dk-sw" style="background:${dkCol(i)}"></i>${esc(r.name)}</span><small>${r.posts.length} post${r.posts.length===1?'':'s'}</small><small>${cpvOf(r.spend,r.views)} CPV</small><b>${dkFmt(m,r.v)}</b><small class="cw-pct">${(r.v/tot*100).toFixed(1)}%</small></div>`).join('');
  return `<div class="cw-seg"><div class="cw-segbar" role="img" aria-label="Segmented bar">${bar}</div><div class="cw-seg-list">${list}</div></div>`;
}
function dashCreatorWidgetHTML(posts,unkG,unkS,key='creators'){
  const t=S.dashCTab||'gender', m=dkMetric('creators','views');
  const tabs=[['gender','Gender'],['location','Location'],['tier','Tier'],['concept','Concept']];
  const sub={gender:`Share of ${m==='spend'?'spend':m==='posts'?'posts':'views'} · ${unkG}% unknown`,location:`Country, then state · ${unkS}% unknown`,tier:'Creators grouped by tier',concept:'Which concepts drive the results'}[t];
  let body;
  if(t==='gender') body=`<div class="cw-gender">${dkDonut(segRows(posts,p=>crAttr(p.creator,'gender')),m)}</div>`;
  else if(t==='location') body=cwLocationHTML(posts,m);
  else if(t==='tier') body=cwSegBar(segRows(posts,p=>crAttr(p.creator,'tier')),m);
  else body=cwSegBar(segRows(posts,p=>p.concept),m);
  const radios=[['views','Views'],['spend','Spend'],['posts','Posts']].map(([v,l])=>`<label class="cw-radio"><input type="radio" name="cwm" value="${v}" ${m===v?'checked':''} onchange="dkSetM('creators','${v}')"><span>${l}</span></label>`).join('');
  return `<div class="ds-card dk-w dk-cwidget">
    ${dwHead({title:'Creators',sub,actions:dwMenu(key)})}
    <div class="cw-bar-row"><div class="ds-seg dk-cseg" role="tablist" aria-label="Creator breakdown">${tabs.map(([k,l])=>`<button type="button" role="tab" aria-selected="${t===k}" class="${t===k?'on':''}" onclick="setPageState('dashCTab','${k}')">${l}</button>`).join('')}</div>
      <div class="cw-radios" role="radiogroup" aria-label="Measure">${radios}</div></div>
    <div class="dk-cwidget-body">${body}</div></div>`;
}
function dashTopCreatorsHTML(posts,opts={}){
  const avg=posts.length?sumOf(posts,'views')/posts.length:0;
  const g=cwGroupBy(posts.filter(p=>p.creator),p=>p.creator);
  const rows=Object.entries(g).map(([id,ps])=>{
    const views=sumOf(ps,'views'), planned=ps.length*avg, delta=planned?(views-planned)/planned*100:0;
    const camps=Object.entries(cwGroupBy(ps,p=>p.campaignName||'—')).sort((a,b)=>b[1].length-a[1].length);
    const campLabel=camps.length>1?`${esc(camps[0][0])} <em class="tc-more">+${camps.length-1}</em>`:esc(camps[0]?camps[0][0]:'—');
    return {id,name:(crOf(id)||{}).name||id,n:ps.length,views,delta,campLabel:opts.hideCampaign?'':campLabel};
  }).sort((a,b)=>b.views-a.views).slice(0,5);
  if(!rows.length) return '';
  const maxV=rows[0].views||1, TC_TONE=['#1e40af','#0ea5e9','#fcd34d','#3b82f6','#fb923c'];
  const ini=n=>n.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  return `<div class="ds-card dk-w dk-topc">
    ${dwHead({title:'Top creators',sub:'Ranked by views',actions:dwMenu('topc')})}
    <ol class="tl-list">${rows.map((r,i)=>`<li class="tl-row">
      <span class="tl-rank">${i+1}</span>
      <span class="tl-av" style="background:${TC_TONE[i%TC_TONE.length]}">${esc(ini(r.name))}</span>
      <div class="tl-main">
        <div class="tl-l1"><span class="tl-name">${esc(r.name)}</span><b class="tl-views">${exactN(r.views)}</b></div>
        <div class="tl-bar"><i style="width:${(r.views/maxV*100).toFixed(1)}%"></i></div>
        <div class="tl-l2"><span class="tl-meta">${r.n} post${r.n===1?'':'s'}${r.campLabel?` · ${r.campLabel}`:''}</span><span class="tl-delta ${r.delta>=0?'is-up':'is-down'}" title="Views vs planned (avg views per post × posts)">${r.delta>=0?'▲':'▼'} ${Math.abs(r.delta).toFixed(1)}%</span></div>
      </div></li>`).join('')}</ol>
  </div>`;
}
function dashTabsHTML(){
  return ''; /* the single-tab bar is gone: campaign analytics lives in Campaign tracker */
}
function dashboardHTML(){
  const t=S.dashTab==='tracker'?'tracker':'overview';
  const want=t==='tracker'?'tracker':'dashboard';
  if((S.page==='dashboard'||S.page==='tracker')&&S.page!==want){ S.page=want; syncNav(); }
  const tabs=dashTabsHTML();
  if(t==='overview') return dashboardOverviewHTML(tabs);
  const head=t==='tracker'
    ?['Campaign tracker','Every campaign with its live analytics in one table. Select a campaign name to open its detail view.']
    :['Cumulative dashboard','Every campaign in one table. Select rows to filter the levels to their right.'];
  return `<div class="ds-page">
    <div class="ds-head"><div><h1 class="ds-page-title">${head[0]}</h1><p class="ds-page-desc">${head[1]}</p></div></div>
    ${t==='tracker'?'':tabs}
    ${allCampaignsHTML(true)}
  </div>`;
}
const DW_LIST=[['ov','Campaign overview'],['insights','Insights'],['timeline','Posts timeline'],['trend','Views trend'],['creators','Creator performance'],['product','Product performance'],['posts','All posts'],['alerts','Needs attention'],['topc','Top creators'],['sent','Sentiment'],['budget','Spend vs budget']];
const dwOn=k=>!((S.dwHide||{})[k]);
const DW_DEF={budget:'half',cp_sent:'full',ov:'full',insights:'full',timeline:'half',trend:'half',creators:'full',product:'half',alerts:'half',topc:'half',sent:'half',posts:'full',cp_timeline:'half',cp_trend:'half',cperf_spend:'half',cp_creators:'full'};
const dwSizeOf=k=>(S.dwSize||{})[k]||DW_DEF[k]||'half';
const DW_MAIN=['timeline','trend','creators','product','sent','posts'];
const CP_W=['cp_timeline','cp_trend','cperf_spend','cp_sent','cp_creators'];
const CW=(k,h)=>`<div class="dw-cell dw-${dwSizeOf(k)}${S.dwPop===k?' is-pop':''}" data-w="${k}">${h}</div>`;
const W=(k,h)=>dwOn(k)?`<div class="dw-cell dw-${dwSizeOf(k)}${S.dwPop===k?' is-pop':''}" data-w="${k}">${h}</div>`:'';
const WA=(k,h)=>dwOn(k)?h:'';
function dwSizeToggle(k){ if(!DW_MAIN.includes(k)&&!CP_W.includes(k)) return; S.dwSize={...(S.dwSize||{}),[k]:dwSizeOf(k)==='full'?'half':'full'}; S.dwPop=k; paintBody(); setTimeout(()=>{ if(S.dwPop===k){ S.dwPop=null; document.querySelector(`[data-w="${k}"]`)?.classList.remove('is-pop'); } },320); }
function dwRemove(k){ S.dwHide={...(S.dwHide||{}),[k]:true}; paintBody(); }
function dwHead(o){ const {title,sub='',legend='',actions=''}=o;
  return `<header class="dw-head"><div class="dw-hl"><span class="dw-t">${title}</span>${sub?`<span class="dw-s">${sub}</span>`:''}</div>${actions?`<div class="dw-ha">${actions}</div>`:''}</header>${legend?`<div class="dw-lg">${legend}</div>`:''}`; }
function dwMenu(k,measure=null){
  const dash=DW_LIST.some(x=>x[0]===k), full=dwSizeOf(k)==='full', sizable=(dash&&DW_MAIN.includes(k))||CP_W.includes(k);
  if(!dash&&!measure&&!sizable) return '';
  return `<details class="ds-more dw-more"><summary class="dw-dots" aria-label="Widget options" title="Widget options">⋯</summary><div class="ds-more-menu">${measure?`<button type="button" onclick="dkSettings('${k}','${esc(measure)}')">Change measure…</button>`:''}${sizable?`<button type="button" onclick="dwSizeToggle('${k}')">${full?'Shorten to half width':'Expand to full width'}</button>`:''}${dash?`<button type="button" class="is-danger" onclick="dwRemove('${k}')">Remove widget</button>`:''}</div></details>`;
}
function dwToggle(k){ const cur={...(S.dwHide||{})}; if(cur[k]) delete cur[k]; else cur[k]=true; S.dwHide=cur; S.dwOpen=true; paintBody(); }
function dwShowAll(){ S.dwHide={}; S.dwOpen=true; paintBody(); }
function dwSettingsHTML(){
  const shown=DW_LIST.filter(([k])=>dwOn(k)).length;
  return `<span class="disc-cols-wrap"><button type="button" class="dk-view-btn${S.dwOpen?' is-on':''}" aria-expanded="${!!S.dwOpen}" aria-label="View settings" title="View settings" onclick="S.dwOpen=!S.dwOpen;paintBody()">${DK_SVG('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',16)}</button>${S.dwOpen?`<div class="disc-cols-pop dk-view-pop" role="dialog" aria-label="Widgets shown">
    <div class="disc-cols-head"><div><strong>Widgets</strong><span>${shown} of ${DW_LIST.length} shown · applied as you go</span></div></div>
    <ul class="disc-cols-list">${DW_LIST.map(([k,l])=>`<li class="disc-col-row" data-name="${esc(l.toLowerCase())}"><input type="checkbox" ${dwOn(k)?'checked':''} onchange="dwToggle('${k}')" aria-label="Show ${esc(l)}"><span class="disc-col-name">${esc(l)}</span></li>`).join('')}</ul>
    <div class="disc-cols-foot"><button type="button" class="ds-btn ds-btn--ghost ds-btn--sm" onclick="dwShowAll()">Show all widgets</button></div>
  </div>`:''}</span>`;
}
/* Spend vs budget: post spend per campaign against the campaign budget */
function dashBudgetHTML(posts,scope){
  /* all-time spend per campaign (the budget is not period-bound, so spend is not either) */
  const rows=scope.map(c=>({c,spent:sumOf(c.posts||[],'cost'),budget:Number(c.budget)||0}))
    .sort((a,b)=>(b.budget?b.spent/b.budget:-1)-(a.budget?a.spent/a.budget:-1));
  const withB=rows.filter(r=>r.budget>0);
  const totS=withB.reduce((a,r)=>a+r.spent,0), totB=withB.reduce((a,r)=>a+r.budget,0), pct=totB?totS/totB*100:0;
  const total=withB.length?`<div class="sv-total"><b>${rupees(totS)}</b><span>of ${rupees(totB)} budget across ${withB.length} campaign${withB.length===1?'':'s'}${pct?` · ${Math.round(pct)}% used`:''}</span></div><div class="cp-bar sv-bar"><i style="width:${Math.min(100,pct)}%"></i></div>`:'<p class="ds-caption">No campaign budgets set in this scope.</p>';
  const list=rows.map(({c,spent,budget})=>{
    const pc=budget?spent/budget*100:0, note=!budget?'No budget set':spent>budget?`Over by ${rupees(spent-budget)}`:`${Math.round(pc)}% of ${rupees(budget)} used`;
    return `<div class="sv-row"><span class="sv-who">${esc(c.name)}<small>${note}</small></span><span class="sv-amt">${rupees(spent)}</span><span class="sv-share" aria-hidden="true"><i style="width:${Math.min(100,pc)}%"></i></span></div>`;
  }).join('')||dkEmptyState('No campaigns in this period.','Campaigns appear here once they are in scope.');
  return `<div class="ds-card dk-w dk-compact sv${rows.length?'':' is-empty'}">${dkHead('budget','Spend vs budget','All-time spend against each campaign budget')}${total}<div class="sv-rows">${list}</div></div>`;
}
function dashboardOverviewHTML(tabsHTML){
  const f=dashState();
  const productView=!!f.product&&f.product!=='All';
  const posts=dashPosts();
  const views=sumOf(posts,'views'), spend=sumOf(posts,'cost'), org=sumOf(posts,'organic'), paid=sumOf(posts,'paid');
  const tot=(org+paid)||1;
  const RING=2*Math.PI*46, orgPct=(org/tot*100).toFixed(1), paidPct=(paid/tot*100).toFixed(1);
  const orgArc=(org/tot*RING).toFixed(2), paidArc=(paid/tot*RING).toFixed(2);
  const products=uniq(CAMP_LIST.flatMap(c=>c.posts.map(p=>p.product)));
  const concepts=uniq(CAMP_LIST.flatMap(c=>c.posts.map(p=>p.concept)));
  const cats=uniq(CAMP_LIST.map(c=>c.category));
  const gens=uniq(CR_EXTRA && Object.values(CR_EXTRA).map(x=>x.gender));
  const states=uniq(Object.values(CR_EXTRA).map(x=>x.state));
  const tiers=uniq(DISC.map(c=>c.tier));
  const hasFilters=Object.entries(f).some(([k,v])=>!['period','from','to','postAttr','postSort','csort','tmetric','recent'].includes(k)&&v!=='All'&&v!=='');
  const campCount=new Set(posts.map(p=>p.campaignId)).size;
  const scope=CAMP_LIST.filter(c=>(inCamp(f,c.id))&&(f.category==='All'||c.category===f.category));
  const live=scope.some(c=>c.tracking&&c.status==='Active');
  const avg=posts.length?exactN(Math.round(views/posts.length)):'—';
  const paidPosts=posts.filter(p=>p.paid>0), paidSpend=sumOf(paidPosts,'cost'), paidViews=sumOf(posts,'paid');
  const attrF=f.postAttr||'All', sortF=f.postSort||'All';
  let postsView=posts.filter(p=>attrF==='All'||(attrF==='organic'?p.organic>=p.paid:p.paid>p.organic));
  const dq=(S.dashQ||'').toLowerCase().trim();
  if(S.apCamp&&S.apCamp!=='All') postsView=postsView.filter(p=>p.campaignId===S.apCamp);
  postsView=postsView.filter(p=>!dq||`${cNameOf(p.creator)} ${p.product} ${p.concept} ${p.campaignName}`.toLowerCase().includes(dq));
  postsView=[...postsView].sort((a,b)=>sortF==='spend'?b.cost-a.cost:sortF==='date'?b.date.localeCompare(a.date):sortF==='cpv'?(a.views?a.cost/a.views:9e9)-(b.views?b.cost/b.views:9e9):b.views-a.views);
  const DPER=20, dpages=Math.max(1,Math.ceil(postsView.length/DPER)), dpg=Math.min(Math.max(1,Number(S.dashPage)||1),dpages);
  const postsShown=postsView.slice((dpg-1)*DPER,dpg*DPER);
  const pctOf=fn=>posts.length?Math.round(posts.filter(p=>!fn(p)).length/posts.length*100):0;
  const unkG=pctOf(p=>crAttr(p.creator,'gender')), unkS=pctOf(p=>crAttr(p.creator,'state'));
  const rowsG=segRows(posts,p=>crAttr(p.creator,'gender'));
  const rowsS=segRows(posts,p=>crAttr(p.creator,'state'));
  const rowsT=segRows(posts,p=>crAttr(p.creator,'tier'));
  const rowsC=segRows(posts,p=>p.concept);
  const rowsP=segRows(posts,p=>p.product);
  return `<div class="ds-page">
    <div class="ds-head dk-head"><div>
        <h1 class="ds-page-title">Cumulative dashboard</h1></div>
      <div class="dk-head-actions">${periodCtrlHTML({value:f.period,cust:{from:f.from,to:f.to},opts:PERIOD_OPTS,set:"setDash('period',",setCust:'setDash'})}<button type="button" class="ds-btn ds-btn--outline ds-btn--icon" aria-label="Export report" title="Export report" onclick="exportDashboard()">${icon('download','ico-sm')}</button></div></div>

    ${tabsHTML}
    ${dashFilterRowHTML()}
    ${productView?`<p class="ds-caption" style="margin:0 0 12px">Product view: <b>${esc(f.product)}</b> across ${campCount} campaign${campCount===1?'':'s'}. Needs attention and Spend vs budget are hidden here because budgets and alerts apply to whole campaigns.</p>`:''}
    ${W('ov',dashStatusHTML())}
    ${W('insights',dashInsightsHTML(posts))}
    <div class="dk-shell"><div class="dk-main dw-grid">${W('timeline',timelineHTML({camps:CAMP_LIST,value:f.period,cust:{from:f.from,to:f.to},scope:'across all campaigns',title:'Posts timeline',split:true,dwKey:'timeline'}))}
    ${W('trend',dashTrendHTML(posts))}
    
    ${W('creators',dashCreatorWidgetHTML(posts,unkG,unkS))}
    ${productView?'':W('budget',dashBudgetHTML(posts,scope))}
    ${W('product',`<div class="dk-row2">
      <div class="ds-card dk-w">${dkHead('product','Product performance','Views and spend by product',`<button type="button" class="ds-namebtn dk-wlink" onclick="dashJump('dash-posts')">All posts ›</button>`)}${dkRich(rowsP,dkMetric('product'),'split','product')}</div>
    </div>`)}
    ${W('sent',`<div class="ds-card dk-w dk-sent">${dkHead('sentiment','Sentiment','Tone of comments · not yet available')}${sentNAHTML()}</div>`)}
    ${W('posts',`<div class="ds-card dk-w dk-posts" id="dash-posts">
      ${dkHead('posts','All posts',`${postsView.length} of ${posts.length} shown`)}
      <div class="ds-toolbar ds-toolbar--wrap dk-ptools">
        ${campSearchBox('dashQ','Search creator, product, campaign or concept')}
        ${dsFilter('apCamp','Campaign',[['All','All campaigns'],...dashScopeCamps().map(c=>[c.id,c.name])],S.apCamp||'All')}
        ${dsFilterD('postAttr','Attribution',[['All','All attribution'],['organic','Mostly organic'],['paid','Mostly paid']],attrF)}
        ${dsFilterD('postSort','Sort',[['All','Most views'],['spend','Most spend'],['cpv','Lowest CPV'],['date','Newest first']],sortF)}
      </div>
      ${postsView.length?`<div class="dk-scroll dk-scroll-posts">${postTableHTML(postsView,true)}</div>`:'<p class="ds-empty">No posts match these filters. Widen the period or clear filters.</p>'}
    </div>`)}
    </div><aside class="dk-widgets">${productView?'':WA('alerts',dashAlertsHTML())}${WA('topc',dashTopCreatorsHTML(posts))}</aside></div>
    </div>`;
}

/* Concept / product side panel: Details (summary of the group) and Content (its posts) */
function openDimSide(kind,name,tab='details'){
  const ps=dashPosts().filter(p=>kind==='concept'?p.concept===name:p.product===name);
  const all=dashPosts(), views=sumOf(ps,'views'), share=sumOf(all,'views')?views/sumOf(all,'views')*100:0;
  const org=sumOf(ps,'organic'), paid=sumOf(ps,'paid'), spend=sumOf(ps,'cost'), enc=encodeURIComponent(name).replace(/'/g,'%27');
  const tabs=`<div class="ds-seg dk-side-tabs" role="tablist" aria-label="Section"><button type="button" role="tab" aria-selected="${tab==='details'}" class="${tab==='details'?'on':''}" onclick="openDimSide('${kind}',decodeURIComponent('${enc}'),'details')">Details</button><button type="button" role="tab" aria-selected="${tab==='content'}" class="${tab==='content'?'on':''}" onclick="openDimSide('${kind}',decodeURIComponent('${enc}'),'content')">Content (${ps.length})</button></div>`;
  let body;
  if(tab==='content'){
    body=`<div class="dk-scroll dk-scroll-posts">${ps.length?postTableHTML([...ps].sort((a,b)=>b.views-a.views),true):'<p class="ds-empty">No posts in this group for the selected period.</p>'}</div>`;
  } else {
    const byC={}; ps.forEach(p=>{(byC[p.creator]=byC[p.creator]||[]).push(p);});
    const creators=Object.entries(byC).map(([id,xs])=>({id,n:xs.length,v:sumOf(xs,'views')})).sort((a,b)=>b.v-a.v).slice(0,5);
    const stat=(l,v,sub)=>`<div class="ds-card dk-side-stat"><span class="ds-label">${l}</span><span class="ds-value">${v}</span>${sub?`<span class="ds-caption">${sub}</span>`:''}</div>`;
    body=`<div class="dk-side-stats">${stat('Total views',exactN(views),`${share.toFixed(0)}% of views in this period`)}${stat('Spend',rupees(spend),ps.length?`${rupees(spend/ps.length)} per post`:'')}${stat('Blended CPV',cpvOf(spend,views),'Spend ÷ total views')}${stat('Posts',ps.length,`${new Set(ps.map(p=>p.creator)).size} creators`)}</div>
      <div class="ds-card dk-side-split"><span class="ds-label">Organic vs boosted</span><div class="dk-stack2"><i style="width:${(org/((org+paid)||1)*100).toFixed(1)}%;background:${DK_ORG}"></i><i style="width:${(paid/((org+paid)||1)*100).toFixed(1)}%;background:${DK_PAID}"></i></div><span class="ds-caption">${exactN(org)} organic · ${exactN(paid)} boosted</span></div>
      <div class="ds-card dk-side-split"><span class="ds-label">Top creators</span>${creators.map(c=>`<div class="dk-side-row"><span>${esc(cNameOf(c.id))}</span><b>${exactN(c.v)}</b><small>${c.n} post${c.n===1?'':'s'}</small></div>`).join('')||'<span class="ds-caption">No posts in this period</span>'}</div>`;
  }
  openDrawer(esc(name),`${kind==='concept'?'Creative concept':'Product'} · ${ps.length} post${ps.length===1?'':'s'}`,tabs+body);
  const d=document.querySelector('#layer .ds-drawer'); if(d) d.classList.add('ds-drawer--side');
}
/* Individual export: one campaign's live and lined-up posts as CSV */
function exportCampaign(id){
  const c=campOf(id); if(!c) return;
  const live=c.posts.map(p=>({...p,status:'Live'})), lined=linedOf(c).map(p=>({...p,status:'Lined up',date:''}));
  const rows=[...live,...lined];
  if(!rows.length){ toast('This campaign has no posts to export yet'); return; }
  const q=v=>`"${String(v??'').replace(/"/g,'""')}"`;
  const head=['Link','Campaign','Creator','Product','Format','Type','Status','Concept','Live date','Organic views','Paid views','Views','Cost'];
  const lines=[head.map(q).join(','),...rows.map(p=>[p.url||'',c.name,cNameOf(p.creator),p.product||c.product||'',p.format||'',p.boost||p.paid>0?'Boosted':'Organic',p.status,p.concept||'',p.date||'',p.organic||0,p.paid||0,p.views||0,p.cost||0].map(q).join(','))];
  const slug=c.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/csv'})); a.download=`campaign-${slug}-${TODAY}.csv`; a.click(); URL.revokeObjectURL(a.href);
  toast(`Successfully exported ${rows.length} post${rows.length===1?'':'s'} from ${c.name}`);
}
function exportDashboard(){
  const rows=dashPosts(), camps=new Set(rows.map(p=>p.campaignId));
  if(!rows.length){ toast('No posts to export for these filters'); return; }
  const q=v=>`"${String(v??'').replace(/"/g,'""')}"`;
  const head=['Link','Campaign','Creator','Product','Format','Type','Concept','Live date','Organic views','Paid views','Views','Cost'];
  const lines=[head.map(q).join(','),...rows.map(p=>[p.url||'',p.campaignName,cNameOf(p.creator),p.product,p.format||'',p.paid>0?'Boosted':'Organic',p.concept,p.date,p.organic,p.paid,p.views,p.cost].map(q).join(','))];
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/csv'})); a.download=`consolidated-posts-${TODAY}.csv`; a.click(); URL.revokeObjectURL(a.href);
  toast(`Successfully exported ${rows.length} post${rows.length===1?'':'s'} from ${camps.size} campaign${camps.size===1?'':'s'}`);
}
let CAMP_SORT='latest';
/* ── Phase 1 analytics: overall timeline, campaign pipeline, creator campaign history ── */
const tlMonLabel=m=>new Date(m+'-01T12:00:00').toLocaleDateString('en-US',{month:'short',year:'numeric'});
const tlMonLong=m=>new Date(m+'-01T12:00:00').toLocaleDateString('en-US',{month:'long',year:'numeric'});
const tlAll=(camps=CAMP_LIST)=>camps.flatMap(c=>c.posts.map(p=>({...p,campaignId:c.id,campaignName:c.name})));
/* ── Period model: one range definition shared by the dashboard and campaign pages ── */
const MON_RE=/^\d{4}-\d{2}$/;
const PERIOD_OPTS=[['thisMonth','This month'],['lastMonth','Last month'],['last3','Last 3 months'],['last12','Last 12 months'],['lastYear','Last year'],['custom','Custom range'],['all','All time']];
function monthEnd(m){ const [y,mo]=m.split('-').map(Number); return new Date(Date.UTC(y,mo,0)).getUTCDate(); }
function shiftMonth(m,d){ const [y,mo]=m.split('-').map(Number); return new Date(Date.UTC(y,mo-1+d,1)).toISOString().slice(0,7); }
function monthsBetween(a,b){ const out=[]; let [y,m]=a.split('-').map(Number); const [y2,m2]=b.split('-').map(Number); while(y<y2||(y===y2&&m<=m2)){ out.push(`${y}-${pad2(m)}`); if(++m>12){m=1;y++;} } return out; }
function rangeOf(v,cust){
  const cur=TODAY.slice(0,7), y=Number(TODAY.slice(0,4));
  const mr=m=>({from:m+'-01',to:`${m}-${pad2(monthEnd(m))}`});
  if(MON_RE.test(v||'')) return mr(v);
  if(v==='thisMonth') return mr(cur);
  if(v==='lastMonth') return mr(shiftMonth(cur,-1));
  if(v==='last3') return {from:shiftMonth(cur,-2)+'-01',to:mr(cur).to};
  if(v==='last12') return {from:shiftMonth(cur,-11)+'-01',to:mr(cur).to};
  if(v==='lastYear') return {from:`${y-1}-01-01`,to:`${y-1}-12-31`};
  if(v==='custom'){ const back=new Date(Date.parse(TODAY+'T00:00:00Z')-29*864e5).toISOString().slice(0,10); const from=(cust&&cust.from)||back, to=(cust&&cust.to)||TODAY; return from<=to?{from,to}:{from:to,to:from}; }
  return null;
}
function periodMonthsOf(camps){ return uniq([...tlAll(camps).map(p=>p.date.slice(0,7)),TODAY.slice(0,7)]).reverse(); }
function tlSummary(ps){
  const boosted=ps.filter(p=>p.paid>0);
  return {n:ps.length,views:sumOf(ps,'views'),nBoost:boosted.length,nOrg:ps.length-boosted.length,bViews:sumOf(ps,'paid'),oViews:sumOf(ps,'organic'),camps:new Set(ps.map(p=>p.campaignId)).size};
}
function tvHover(el){
  const wrap=el.closest('.tv-chart'); if(!wrap) return;
  const rows=JSON.parse(wrap.dataset.rows||'[]'), x=rows[+el.dataset.i]; if(!x) return;
  const tip=wrap.querySelector('.tv-tip'), plot=tip.parentElement; tip.hidden=false;
  tip.innerHTML=`<b>${esc(x.t)}</b><span>${x.n} post${x.n===1?'':'s'} · ${x.nb} boosted</span><span>${exactN(x.v)} views</span><span class="tv-tip-split"><i class="tv-org"></i>Organic ${exactN(x.o)}</span><span class="tv-tip-split"><i class="tv-boo"></i>Boosted ${exactN(x.b)}</span>`;
  const cr=el.getBoundingClientRect(), pr=plot.getBoundingClientRect();
  tip.style.left=Math.min(Math.max(0,cr.left-pr.left+cr.width/2-90),pr.width-180)+'px';
  wrap.querySelectorAll('.tv-col.is-on').forEach(h=>h.classList.remove('is-on')); el.classList.add('is-on');
}
function tvLeave(wrap){ const t=wrap.querySelector('.tv-tip'); if(t) t.hidden=true; wrap.querySelectorAll('.tv-col.is-on').forEach(h=>h.classList.remove('is-on')); }
function timelineHTML(o){
  const {camps,value,cust,scope,title,split}=o;
  const r=rangeOf(value,cust);
  const all=tlAll(camps), ps=all.filter(p=>!r||(p.date>=r.from&&p.date<=r.to));
  const s=tlSummary(ps);
  const daily=!!r&&r.from.slice(0,7)===r.to.slice(0,7);
  let buckets;
  if(daily){
    const ym=r.from.slice(0,7), d0=+r.from.slice(8), d1=+r.to.slice(8);
    buckets=Array.from({length:d1-d0+1},(_,i)=>{const dk=`${ym}-${pad2(d0+i)}`; return {key:dk,t:campDate(dk),label:String(d0+i),match:p=>p.date===dk};});
  } else {
    const months=periodMonthsOf(camps);
    const span=r?monthsBetween(r.from.slice(0,7),r.to.slice(0,7)):monthsBetween(months[months.length-1],months[0]);
    buckets=span.map(m=>({key:m,t:tlMonLong(m),label:tlMonLabel(m),match:p=>p.date.slice(0,7)===m}));
  }
  const rows=buckets.map(b=>{const d=ps.filter(b.match), nb=d.filter(p=>p.paid>0).length;
    return {...b,n:d.length,nb,no:d.length-nb,o:sumOf(d,'organic'),b:sumOf(d,'paid'),v:sumOf(d,'views')};});
  const n=rows.length, maxN=Math.max(1,...rows.map(x=>x.n)), step=Math.max(1,Math.ceil(maxN/4)), ymax=step*4;
  const every=daily?5:Math.max(1,Math.ceil(n/8));
  const ticks=[0,1,2,3,4].map(i=>`<span style="bottom:${(step*i/ymax*100).toFixed(2)}%">${step*i}</span>`).join('');
  const grid=[0,1,2,3,4].map(i=>`<i class="tv-gl" style="bottom:${(step*i/ymax*100).toFixed(2)}%"></i>`).join('');
  const cols=rows.map((x,i)=>{
    const stack=x.n?`<div class="tv-stk" style="height:${(x.n/ymax*100).toFixed(2)}%"><i class="tv-boo" style="height:${(x.nb/x.n*100).toFixed(2)}%"></i><i class="tv-org" style="height:${(x.no/x.n*100).toFixed(2)}%"></i></div>`:'';
    return `<div class="tv-col" data-i="${i}" onmouseenter="tvHover(this)"${split?' onclick="tvPick(this)"':''}>${stack}</div>`;
  }).join('');
  const xl=rows.map((x,i)=>`<span>${(i%every===0||i===n-1)?esc(x.label):''}</span>`).join('');
  const data=esc(JSON.stringify(rows.map(x=>({key:x.key,t:x.t,n:x.n,v:x.v,o:x.o,b:x.b,nb:x.nb}))));
  const boostShare=s.views?s.bViews/s.views*100:0;
  const chart=`<div class="tv-chart" data-rows="${data}" onmouseleave="tvLeave(this)">
      <div class="tv-frame"><div class="tv-yax">${ticks}</div><div class="tv-plot">${grid}<div class="tv-cols">${cols}</div><div class="tv-tip" hidden></div></div></div>
      <div class="tv-xax">${xl}</div>
    </div>`;
  const head=dwHead({title:esc(title),sub:daily?'Posts per day':'Posts per month',actions:o.dwKey?dwMenu(o.dwKey):'',legend:'<div class="tv-legend"><span><i class="tv-org"></i>Organic</span><span><i class="tv-boo"></i>Boosted</span></div>'});
  const empty=s.n?'':'<p class="tv-empty">No posts went live in this period.</p>';
  const kp=(l,v,sub,ic)=>`<div class="tv-kpi"><span>${ic?DK_SVG(ic):''}${l}</span><b>${v}</b></div>`;
  const busiest=rows.reduce((a,b)=>b.n>a.n?b:a,rows[0]||{n:0,t:'—'});
  const activeN=rows.filter(x=>x.n).length, unit=daily?'day':'month';
  const side=`<div class="tv-side">${kp('Busiest '+unit,busiest.n?esc(busiest.t):'—','',TV_ICO.cal)}${kp('Active '+unit+'s',activeN,'',TV_ICO.chk)}${kp('Boosted share',s.n?Math.round(s.nBoost/s.n*100)+'%':'0%','',TV_ICO.bolt)}${kp('Views in period',exactN(s.views),'',TV_ICO.eye)}</div>`;
  return `<section class="tv ${split?'tv--split':''}" aria-label="${esc(title)}"><div class="tv-main">${head}${chart}${empty}</div>${split?side:''}</section>`;
}
/* Period control: one dropdown, custom dates when chosen, icon-only Sync */
function periodShort(v,cust){
  const r=rangeOf(v,cust); if(!r) return 'All time';
  const yr=r.from.slice(0,4)!==TODAY.slice(0,4)||r.to.slice(0,4)!==TODAY.slice(0,4);
  const f=d=>new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',Object.assign({day:'numeric',month:'short',timeZone:'UTC'},yr?{year:'numeric'}:{}));
  return `${f(r.from)} – ${f(r.to)}`;
}
function periodCtrlHTML(o){
  const {value,cust,opts,set,setCust}=o;
  const label=periodShort(value,cust);
  const items=opts.map(([v,l])=>`<button type="button" class="dk-per-opt${v===value?' is-on':''}" role="option" aria-selected="${v===value}" onclick="S.perOpen=${v==='custom'?'true':'false'};${set}'${v}')">${v===value?DK_SVG('<path d="M5 12l5 5 9-10"/>'):'<span class="dk-per-tick"></span>'}<span>${esc(l)}</span></button>`).join('');
  const dates=value==='custom'?`<div class="dk-per-dates"><label><span>From</span><input type="date" value="${esc((cust&&cust.from)||'')}" max="${TODAY}" onchange="${setCust}('from',this.value)"></label><label><span>To</span><input type="date" value="${esc((cust&&cust.to)||'')}" max="${TODAY}" onchange="${setCust}('to',this.value)"></label></div>`:'';
  /* a single month can step back and forward one month at a time */
  const curM=TODAY.slice(0,7), mo=value==='thisMonth'?curM:value==='lastMonth'?shiftMonth(curM,-1):(MON_RE.test(value||'')?value:null);
  const step=mo?`<button type="button" class="dk-per-step" aria-label="Previous month" title="Previous month" onclick="${set}'${shiftMonth(mo,-1)}')"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>`:'';
  const stepN=mo?`<button type="button" class="dk-per-step" aria-label="Next month" title="Next month" ${shiftMonth(mo,1)>curM?'disabled':''} onclick="${set}'${shiftMonth(mo,1)}')"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>`:'';
  return `<div class="tv-ctrl dk-per-wrap">${step}<details class="dk-per" ${S.perOpen?'open':''} ontoggle="S.perOpen=this.open"><summary class="dk-per-trig" aria-label="Period: ${esc(label)}"><span class="dk-per-cal">${DK_SVG('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>')}</span><span class="dk-per-val">${esc(label)}</span><span class="dk-cf-chev">${DK_SVG('<path d="M6 9l6 6 6-6"/>')}</span></summary><div class="dk-per-panel" role="listbox" aria-label="Period">${items}${dates}</div></details>${stepN}<button type="button" class="ds-btn ds-btn--outline ds-btn--icon tv-sync" aria-label="Refresh data" title="Refresh" onclick="syncData()">${DK_SVG('<path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 4v5h-5"/>')}</button></div>`;
}
function periodBarHTML(o){ return `<div class="tv-bar"><span class="tv-sub">${esc(o.scope)} · data as of ${campDate(TODAY)}</span>${periodCtrlHTML(o)}</div>`; }
function syncData(){ S.lastSync=new Date(); toast('Dashboard refreshed · demo'); paintBody(); }
function setCampCust(k,v){ S.cCust={...(S.cCust||{}),[k]:v}; paintBody(); }

function campPipeHTML(c){
  const pub=c.posts.length, lined=linedOf(c).length, plan=Math.max(Number(c.plannedVideos||0),pub), open=Math.max(0,plan-pub-lined);
  const sp=campSpend(c), bd=Number(c.budget||0), pct=bd?sp/bd*100:0;
  const h=c.status!=='Active'?['Closed','done']:(bd&&sp>bd)?['Over budget','over']:(c.tracking&&pub<plan)?['Needs attention','warn']:['On track','ok'];
  return `<section class="cov-pipe" aria-label="Delivery pipeline">
    <div class="cov-head"><span class="ds-section-title">Delivery pipeline <small class="ds-caption">All time</small></span><span class="health is-${h[1]}">${h[0]}</span></div>
    <div class="cov-steps"><div><span>Published</span><b>${pub}</b></div><div><span>Lined up</span><b>${lined}</b></div></div>
    <div class="cp-bar cov-bar"><i class="is-pub" style="width:${pub/plan*100}%"></i><i class="is-line" style="width:${lined/plan*100}%"></i></div>
    <p class="ds-caption">${pct?`Spend is ${Math.round(pct)}% of the ${rupees(bd)} budget.`:'No budget set.'}</p>
  </section>`;
}
function campPager(total,pg,pages,per,key='campPage'){
  const from=total?(pg-1)*per+1:0, to=Math.min(total,pg*per), nums=[];
  for(let k=1;k<=pages;k++){ if(k===1||k===pages||Math.abs(k-pg)<=1) nums.push(k); else if(nums[nums.length-1]!=='…') nums.push('…'); }
  return `<div class="ds-pager"><span class="ds-caption">Showing ${from}–${to} of ${total}</span><span class="ds-pager-nav"><button class="ds-iconbtn" ${pg<=1?'disabled':''} aria-label="Previous page" onclick="setPageState('${key}',${pg-1})">‹</button>${nums.map(x=>x==='…'?'<span class="ds-caption">…</span>':`<button class="ds-pg${x===pg?' is-on':''}" aria-current="${x===pg?'page':'false'}" onclick="setPageState('${key}',${x})">${x}</button>`).join('')}<button class="ds-iconbtn" ${pg>=pages?'disabled':''} aria-label="Next page" onclick="setPageState('${key}',${pg+1})">›</button></span></div>`;
}
const PIN_STAR='<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.3l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z"/></svg>';
const pinnedIds=()=>S.pinned||CAMP_LIST.slice(0,3).map(c=>c.id); // default: first three campaigns pinned
function starBtn(id){ const on=pinnedIds().includes(id); return `<button type="button" class="cp-star${on?' is-on':''}" aria-pressed="${on}" aria-label="${on?'Unpin':'Pin'} campaign" title="${on?'Unpin from navigation':'Pin to navigation'}" onclick="event.stopPropagation();toggleStar('${id}')">${PIN_STAR}</button>`; }
function toggleStar(id){ const a=pinnedIds(); S.pinned=a.includes(id)?a.filter(x=>x!==id):[...a,id]; syncPinned(); paintBody(true); }
function syncPinned(){
  const el=document.getElementById('navPinned'); if(!el) return;
  const list=pinnedIds().map(id=>CAMP_LIST.find(c=>c.id===id)).filter(Boolean);
  el.innerHTML=list.length?`<div class="nav-div" role="separator"></div><div class="nav-group">Pinned</div>${list.map(c=>`<a class="nav-row nav-pin" href="#" title="${esc(c.name)}" onclick="event.preventDefault();openCampaign('${c.id}')">${PIN_STAR}<span>${esc(c.name)}</span></a>`).join('')}`:'';
}
/* ════════ ALL CAMPAIGNS: stacked levels, selection cascade, filters, saved views, table, content review, paid plans ════════ */
const AC_NA='<span class="ac-na" title="Not connected to a data source">N/A</span>';
const AC_DASH='<span class="ac-dash">—</span>';
const AC_IC={
  camp:'<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M16 8a5 5 0 0 1 0 8"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
  grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  inf:'<path d="M18 12c-2.5-3-4.5-4-6-4a4 4 0 0 0 0 8c1.5 0 3.5-1 6-4s4.5-4 6-4a4 4 0 0 1 0 8c-1.5 0-3.5-1-6-4z"/>',
  list:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  bolt:'<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  down:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  save:'<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7M8 20v-6h8v6"/>',
  filter:'<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
  cols:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
  gear:'<circle cx="8" cy="8" r="2.5"/><circle cx="16" cy="16" r="2.5"/><path d="M10.5 8H20M4 8h1.5M4 16h9.5M18.5 16H20"/>',
  inbox:'<path d="M4 13l2.5-8h11L20 13v6H4z"/><path d="M4 13h5a3 3 0 0 0 6 0h5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  chevD:'<path d="M6 9l6 6 6-6"/>',
  chevR:'<path d="M9 6l6 6-6 6"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
};
const acIc=(k,c='')=>`<svg class="ac-ico ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${AC_IC[k]||''}</svg>`;
const AC_DIM={
  campaign:{label:'Campaigns',one:'Campaign',ent:true,icon:'camp'},
  creator:{label:'Creators',one:'Creator',ent:true,icon:'users'},
  post:{label:'Posts',one:'Post',ent:true,icon:'grid'},
  ad:{label:'Paid ads',one:'Paid ad',ent:true,icon:'inf'},
  tier:{label:'Creator type',cat:'Creator',icon:'users',get:a=>crAttr(a.cid,'tier')||'Unknown'},
  category:{label:'Category',cat:'Campaign',icon:'camp',get:a=>a.c.category||'Unknown'},
  product:{label:'Product',cat:'Campaign',icon:'camp',get:a=>a.c.product||'Unknown'},
  objective:{label:'Objective',cat:'Campaign',icon:'camp',get:a=>dashObjOf(a.c)},
  cstatus:{label:'Campaign status',cat:'Campaign',icon:'camp',get:a=>a.c.status==='Active'?'Live':'Completed'},
  state:{label:'State',cat:'Geography',icon:'list',get:a=>crAttr(a.cid,'state')||'Unknown'},
  format:{label:'Content format',cat:'Content',icon:'grid',get:a=>a.p?a.p.format:null},
  concept:{label:'Concept',cat:'Content',icon:'list',get:a=>a.p?(a.p.concept||'Post'):null},
  boost:{label:'Paid state',cat:'Content',icon:'bolt',get:a=>a.p?(a.p.paid>0?'Boosted':'Organic'):null}
};
const AC_STACKS=[
  ['campaign,creator,post,ad','Campaign › Creator › Post › Paid ad'],
  ['tier,state,creator,post','Creator type › State › Creator › Post'],
  ['cstatus,objective,campaign,post','Campaign status › Objective › Campaign › Post'],
  ['boost,format,post,creator','Paid state › Format › Post › Creator'],
  ['category,product,campaign,creator','Category › Product › Campaign › Creator']
];
const AC_DEF_SLOTS=['campaign','creator','post','ad'];
const AC_PRESETS=[
  {name:'All campaigns',st:{acView:'All',acFilters:[],acSlots:[...AC_DEF_SLOTS],acActive:0,acSort:null}},
  {name:'Live campaigns',st:{acView:'Live',acFilters:[],acSlots:[...AC_DEF_SLOTS],acActive:0,acSort:null}},
  {name:'Boosted posts',st:{acView:'Boosted',acFilters:[],acSlots:[...AC_DEF_SLOTS],acActive:2,acSort:{k:'paidSpend',dir:-1}}},
  {name:'Needs review',st:{acView:'Review',acFilters:[],acSlots:[...AC_DEF_SLOTS],acActive:2,acSort:null}},
  {name:'Top organic creators',st:{acView:'All',acFilters:[],acSlots:['creator','campaign','post','ad'],acActive:0,acSort:{k:'views',dir:-1}}}
];
const acDims=()=>S.acSlots||AC_DEF_SLOTS;
const acSel=i=>(S.acSelS&&S.acSelS[i])||[];
function acSetSel(i,arr){ S.acSelS=[0,1,2,3].map(j=>j===i?arr:acSel(j)); }
function acPersist(){ try{ localStorage.setItem('adam_ac_v1',JSON.stringify({custom:S.acCustom||[],vals:S.acCustVals||{},views:S.acSaved||[],plans:S.acPlans||{}})); }catch(e){} }
(function acLoad(){ try{ const s=JSON.parse(localStorage.getItem('adam_ac_v1')||'null'); if(s){ S.acCustom=s.custom||[]; S.acCustVals=s.vals||{}; S.acSaved=s.views||[]; S.acPlans=s.plans||{}; } }catch(e){} })();
let lastTops=[], lastFlat=[];
function adIdOf(p){ let h=7; for(const ch of p.id) h=(h*31+ch.charCodeAt(0))>>>0; return '5258'+String(h).padStart(10,'0'); }
function adNameOf(p,cr){ return 'IG_Boost_'+String(cr.handle||'').replace(/[^a-z0-9]/gi,'')+'_'+String(p.format||'').replace(/\s/g,''); }
/* atoms: one published post, or one planned creator with no post yet, inside one campaign */
function acAtomsAll(){
  const r=rangeOf(S.acPeriod||'all'), out=[];
  for(const c of CAMP_LIST){
    const seen=new Set();
    for(const p of c.posts){ if(r&&(p.date<r.from||p.date>r.to)) continue; seen.add(p.creator); out.push({c,cid:p.creator,p}); }
    for(const cid of c.creatorIds||[]) if(!seen.has(cid)) out.push({c,cid,p:null});
  }
  return out;
}
function acKeys(dim,a){
  if(dim==='campaign') return [a.c.id];
  if(dim==='creator') return [a.c.id+':'+a.cid];
  if(dim==='post') return a.p?[a.p.id]:[];
  if(dim==='ad') return a.p&&a.p.paid>0?[a.p.id]:[];
  const v=AC_DIM[dim].get(a); return v==null?[]:[v];
}
const AC_FIELDS={
  tier:{label:'Creator type',type:'cat',get:a=>crAttr(a.cid,'tier'),opts:()=>['Mega','Macro','Micro','Nano']},
  category:{label:'Category',type:'cat',get:a=>a.c.category,opts:()=>uniq(CAMP_LIST.map(c=>c.category))},
  product:{label:'Product',type:'cat',get:a=>a.c.product,opts:()=>uniq(CAMP_LIST.map(c=>c.product))},
  objective:{label:'Objective',type:'cat',get:a=>dashObjOf(a.c),opts:()=>uniq(CAMP_LIST.map(c=>dashObjOf(c)))},
  cstatus:{label:'Campaign status',type:'cat',get:a=>a.c.status==='Active'?'Live':'Completed',opts:()=>['Live','Completed']},
  state:{label:'State',type:'cat',get:a=>crAttr(a.cid,'state'),opts:()=>uniq(CAMP_LIST.flatMap(c=>c.creatorIds||[]).map(id=>crAttr(id,'state')))},
  format:{label:'Content format',type:'cat',get:a=>a.p&&a.p.format,opts:()=>uniq(CAMP_LIST.flatMap(c=>c.posts.map(p=>p.format)))},
  concept:{label:'Concept',type:'cat',get:a=>a.p&&(a.p.concept||'Post'),opts:()=>uniq(CAMP_LIST.flatMap(c=>c.posts.map(p=>p.concept||'Post')))},
  boost:{label:'Paid state',type:'cat',get:a=>a.p?(a.p.paid>0?'Boosted':'Organic'):null,opts:()=>['Boosted','Organic']},
  followers:{label:'Creator followers',type:'num',get:a=>(crOf(a.cid)||{}).followers},
  views:{label:'Post views',type:'num',get:a=>a.p?a.p.views:null},
  cpv:{label:'Organic CPV (₹)',type:'num',get:a=>a.p&&a.p.organic?a.p.cost/a.p.organic:null},
  date:{label:'Publishing date',type:'date',get:a=>a.p?a.p.date:null}
};
function acTest(f,a){
  const F=AC_FIELDS[f.field], v=F.get(a);
  if(F.type==='cat') return f.values.includes(v);
  if(F.type==='date') return !!v&&(!f.min||v>=f.min)&&(!f.max||v<=f.max);
  if(typeof v!=='number') return false;
  return (f.min===''||f.min==null||v>=+f.min)&&(f.max===''||f.max==null||v<=+f.max);
}
function acFilterLabel(f){
  const F=AC_FIELDS[f.field];
  if(F.type==='cat') return `<b>${F.label}</b>: ${esc(f.values.length>2?f.values.slice(0,2).join(', ')+' +'+(f.values.length-2):f.values.join(', '))}`;
  const fm=v=>F.type==='date'?campDate(v):v, a=f.min!==''&&f.min!=null, b=f.max!==''&&f.max!=null;
  return `<b>${F.label}</b> ${a&&b?fm(f.min)+' – '+fm(f.max):a?'≥ '+fm(f.min):'≤ '+fm(f.max)}`;
}
function acViewOK(a,v){
  if(v==='Live') return a.c.status==='Active';
  if(v==='Completed') return a.c.status!=='Active';
  if(v==='Boosted') return !!a.p&&a.p.paid>0;
  if(v==='Review') return !!a.p&&(!a.p.views||!a.p.url);
  return true;
}
function acSearchOK(a,q){
  if(!q) return true;
  const cr=crOf(a.cid)||{};
  return a.c.name.toLowerCase().includes(q)||a.c.product.toLowerCase().includes(q)||String(cr.name||'').toLowerCase().includes(q)||String(cr.handle||'').toLowerCase().includes(q)
    ||!!(a.p&&((a.p.url||'').toLowerCase().includes(q)||adIdOf(a.p).includes(q)));
}
function acFiltered(){
  const q=(S.acQ||'').trim().toLowerCase(), v=S.acView||'All', fs=S.acFilters||[];
  return acAtomsAll().filter(a=>acViewOK(a,v)&&acSearchOK(a,q)&&fs.every(f=>acTest(f,a)));
}
/* selections at levels to the left restrict this level */
function acRestrict(atoms,k){
  const dims=acDims();
  for(let j=0;j<k;j++){ const s=new Set(acSel(j)); if(!s.size) continue; atoms=atoms.filter(a=>acKeys(dims[j],a).some(x=>s.has(x))); }
  return atoms;
}
function acRowsFor(atoms,dim,depth,pp,slot){
  const map=new Map();
  for(const a of atoms) for(const k of acKeys(dim,a)){ let g=map.get(k); if(!g){g=[];map.set(k,g)} g.push(a); }
  return [...map].map(([k,as])=>({dim,key:k,atoms:as,depth,slot,kind:AC_DIM[dim].ent?dim:'group',path:pp+'/'+dim+':'+k}));
}
function acCtxOf(kind,key,atoms,depth){
  const ps=atoms.filter(a=>a.p).map(a=>a.p);
  const crs=new Set(atoms.map(a=>a.cid)), camps=new Map(), pairs=new Set();
  let planned=0;
  atoms.forEach(a=>{ if(!camps.has(a.c.id)) camps.set(a.c.id,a.c); const k=a.c.id+':'+a.cid; if(!pairs.has(k)){ pairs.add(k); planned+=(a.c.budget||0)/Math.max(1,(a.c.creatorIds||[]).length); } });
  let followers=0; crs.forEach(id=>{followers+=(crOf(id)||{}).followers||0});
  const boosted=ps.filter(p=>p.paid>0), one=atoms[0]||null, ent=kind==='campaign'||kind==='creator'||kind==='post'||kind==='ad';
  const plannedPosts=kind==='campaign'&&one?one.c.plannedVideos||0:null;
  return {kind,key,depth,atoms,c:(kind==='group'||kind==='total')?null:one.c,
    cid:ent&&kind!=='campaign'?one.cid:null, cr:ent&&kind!=='campaign'?crOf(one.cid):null, p:(kind==='post'||kind==='ad')?one.p:null,
    ps,boosted,nCr:crs.size,nCamp:camps.size,planned,plannedPosts,followers,cnt:ps.length,
    organic:sumOf(ps,'organic'),views:sumOf(ps,'views'),paid:sumOf(ps,'paid'),cost:sumOf(ps,'cost'),
    first:ps.map(p=>p.date).sort()[0]||null, firstBoost:boosted.map(p=>p.date).sort()[0]||null, sim:acSimSums(ps)};
}
function acCtxR(r){ return r._x||(r._x=acCtxOf(r.kind,r.key,r.atoms,r.depth)); }
/* tree on, active level > 0: ancestors of the active level stay open unless the person collapsed them */
function acTreeOn(){ return S.acTree!==false&&(S.acActive||0)>0; }
function acIsOpen(r){ const e=(S.acExp||{})[r.path]; if(e!==undefined) return e; return acTreeOn()&&r.slot<(S.acActive||0); }
/* first column names the rows it lists: the active level, or the chain down to it in tree view */
function acFirstLbl(){ const a=S.acActive||0, D=acDims(); if(!acTreeOn()) return AC_DIM[D[a]].one||AC_DIM[D[a]].label; return D.slice(0,a+1).map(d=>AC_DIM[d].one||AC_DIM[d].label).join(' › '); }
function acFlatten(rows,out,pre,anc){
  const dims=acDims(); pre=pre||''; anc=anc||[];
  rows.forEach((r,i)=>{
    r.code=pre?pre+'.'+(i+1):String(i+1);   /* tree code: 1, 1.2, 1.2.3 */
    r.last=i===rows.length-1;                /* last sibling? */
    r.anc=anc;                               /* per ancestor depth: does it have siblings below? */
    out.push(r);
    if(!acIsOpen(r)||r.slot>=acDims().length-1) return;
    acFlatten(acSortRows(acRowsFor(r.atoms,dims[r.slot+1],r.depth+1,r.path,r.slot+1),dims[r.slot+1]),out,r.code,anc.concat([!r.last]));
  });
  return out;
}
function acSortRows(rows,dim){
  const s=S.acSort;
  if(s){ const col=acAllColsFlat().find(c=>c.k===s.k);
    if(col&&col.val) return rows.sort((a,b)=>{const x=col.val(acCtxR(a)),y=col.val(acCtxR(b));if(x==null&&y==null)return 0;if(x==null)return 1;if(y==null)return -1;return (x-y)*s.dir}); }
  if(dim==='campaign') return rows.sort((a,b)=>(acCtxR(a).c.status==='Active'?0:1)-(acCtxR(b).c.status==='Active'?0:1)||b.atoms[0].c.created.localeCompare(a.atoms[0].c.created));
  if(dim==='creator') return rows.sort((a,b)=>String((crOf(a.atoms[0].cid)||{}).name).localeCompare(String((crOf(b.atoms[0].cid)||{}).name)));
  if(dim==='post') return rows.sort((a,b)=>String(b.atoms[0].p.date).localeCompare(String(a.atoms[0].p.date)));
  if(dim==='ad') return rows.sort((a,b)=>acCtxR(b).cost-acCtxR(a).cost);
  return rows.sort((a,b)=>acCtxR(b).nCr-acCtxR(a).nCr);
}

/* ── simulated metrics: seeded mock values standing in for connected insights; always shown with a "Simulated" mark ── */
const acSim=h=>`<span class="ac-sim">${h}</span>`;
const AC_SIM_CACHE={};
function acHash(s){ let h=2166136261; for(const ch of String(s)){ h^=ch.charCodeAt(0); h=Math.imul(h,16777619); } return (h>>>0)/4294967296; }
function acSimP(p){
  if(!p) return null;
  if(AC_SIM_CACHE[p.id]) return AC_SIM_CACHE[p.id];
  const r=k=>acHash(p.id+':'+k), v=p.views||0, org=p.organic||0, bv=p.paid||0, spend=p.cost||0, boosted=bv>0;
  const reach=Math.round(org*(0.72+0.12*r('reach')));
  const impr=Math.round(reach*(1.18+0.4*r('impr')));
  const likes=Math.round(v*(0.035+0.035*r('likes')));
  const comments=Math.round(likes*(0.04+0.03*r('com')));
  const shares=Math.round(likes*(0.02+0.03*r('sh')));
  const saves=Math.round(likes*(0.05+0.05*r('sv')));
  const eng=likes+comments+shares+saves;
  const pImpr=boosted?Math.round(bv*(1.25+0.2*r('pi'))):0;
  const pReach=boosted?Math.round(pImpr/(1.3+0.5*r('pr'))):0;
  const vv=boosted?Math.round(bv*(0.82+0.12*r('vv'))):0;
  const clicks=boosted?Math.round(pImpr*(0.008+0.02*r('ck'))):0;
  const pEng=boosted?Math.round(bv*(0.04+0.03*r('pe'))):0;
  const conv=boosted?Math.round(clicks*(0.05+0.08*r('cv'))):0;
  const rev=conv*(600+800*r('aov'));
  return AC_SIM_CACHE[p.id]={reach,impr,likes,comments,shares,saves,eng,pImpr,pReach,vv,clicks,pEng,conv,rev,spend,boosted};
}
function acSimSums(ps){
  const keys=['reach','impr','likes','comments','shares','saves','eng','pImpr','pReach','vv','clicks','pEng','conv','rev','spend'];
  const o={nb:0}; keys.forEach(k=>o[k]=0);
  for(const p of ps){ const s=acSimP(p); if(!s) continue; keys.forEach(k=>o[k]+=s[k]); if(s.boosted) o.nb++; }
  return o;
}
function acPlanCpv(x){ return x.c&&x.planned?1.2+1.0*acHash(x.c.id):null; }
function acExpV(x){ const c=acPlanCpv(x); if(c==null) return null; if(x.cnt&&x.organic) return Math.round(x.organic*(0.8+0.4*acHash(x.c.id+':'+x.key))); return Math.round(x.planned/c); }
function acPlanCpvV(x){ const e=acExpV(x); return e?x.planned/e:null; }
function acExpR(x){ const e=acExpV(x); return e==null?null:Math.round(e*0.74); }
function acEngRate(x){ return x.cnt&&x.sim.reach?x.sim.eng/x.sim.reach*100:null; }
function acVs(x,k){
  if(!x.cnt) return null;
  const exp=acExpV(x); if(exp==null) return null;
  if(k==='v') return x.organic?(x.organic/exp)*100-100:null;
  if(k==='r') return x.sim.reach?(x.sim.reach/(exp*0.74))*100-100:null;
  const pc=acPlanCpvV(x); return x.organic&&pc?((x.planned/x.organic)/pc)*100-100:null;
}
function acVsCell(x,k){
  const v=acVs(x,k); if(v==null) return AC_DASH;
  return acSim(`<span class="${v>=0?'ac-up':'ac-down'}">${v>=0?'+':''}${v.toFixed(0)}%</span>`);
}
/* ── column registry: C(key,label,on,num,val,cell); val(x) gives a number for sort/formulas, cell(x) gives HTML ── */
const acC=(k,l,on,num,val,cell)=>({k,l,on,num,val,cell});
const acMuted=t=>`<span class="ac-muted">${t}</span>`;
function acFmt(f,v){ if(f==='m') return rupees(v); if(f==='p') return v.toFixed(2)+'%'; if(f==='cpv') return '₹'+v.toFixed(2); if(f==='c') return fmt(v); return exactN(v); }
function acGroupsDef(){
  const per=x=>x.kind==='post'||x.kind==='ad';
  const camp=x=>x.kind==='campaign';
  const groups=[
   {k:'identity',t:'Identity',always:true,defOn:true,cols:[
     acC('objective','Objective',true,false,null,x=>camp(x)?dsBadge(dashObjOf(x.c)):AC_DASH),
     acC('creators','Creators',true,true,x=>per(x)?null:x.nCr,x=>per(x)?AC_DASH:x.nCr),
     acC('campStatus','Campaign Status',true,false,null,x=>x.c?dsBadge(x.c.status==='Active'?'Live':'Completed'):AC_DASH),
     acC('followers','Followers',true,true,x=>x.followers||null,x=>x.followers?exactN(x.followers):AC_DASH),
     acC('creatorType','Creator Type',true,false,null,x=>x.cid&&crAttr(x.cid,'tier')?dsBadge(crAttr(x.cid,'tier')):AC_DASH),
     acC('category','Category',true,false,null,x=>x.kind==='creator'&&x.cr&&x.cr.tags&&x.cr.tags[0]?esc(x.cr.tags[0]):x.c?esc(x.c.category):AC_DASH),
     acC('geography','Geography',true,false,null,x=>x.cid&&crAttr(x.cid,'state')?esc(crAttr(x.cid,'state')):AC_DASH),
     acC('niche','Niche',false,false,null,x=>camp(x)?esc(x.c.product):x.cr&&x.cr.tags?esc(x.cr.tags.join(', ')):AC_DASH)
   ]},
   {k:'planned',t:'Planned',defOn:true,cols:[
     acC('plannedCost','Planned Cost',true,true,x=>x.planned||null,x=>x.planned?rupees(x.planned):AC_DASH),
     acC('expectedViews','Expected Views',true,true,x=>acExpV(x),x=>acExpV(x)==null?AC_DASH:acSim(exactN(acExpV(x)))),
     acC('expectedReach','Expected Reach',true,true,x=>acExpR(x),x=>acExpR(x)==null?AC_DASH:acSim(exactN(acExpR(x)))),
     acC('plannedCpv','Planned CPV',true,true,x=>acPlanCpvV(x),x=>acPlanCpvV(x)==null?AC_DASH:acSim('₹'+acPlanCpvV(x).toFixed(2))),
     acC('plannedPosts','Planned Posts',true,true,x=>x.plannedPosts,x=>acEd(x,'plannedPosts',x.plannedPosts==null?AC_DASH:x.plannedPosts)),
     acC('plannedDate','Planned Date',true,false,null,x=>acEd(x,'plannedDate',camp(x)?campDate(x.c.plannedDate||x.c.created):AC_DASH))
   ]},
   {k:'publishing',t:'Publishing',defOn:true,cols:[
     acC('publishingStatus','Publishing Status',true,false,null,x=>{
       if(per(x)) return dsBadge('Published');
       if(camp(x)) return dsBadge(x.cnt>=(x.c.plannedVideos||0)&&x.cnt?'Complete':x.cnt?'In progress':'Awaiting content');
       return dsBadge(x.cnt?'Published':'Awaiting content'); }),
     acC('mappingStatus','Mapping Status',true,false,null,x=>per(x)?acEd(x,'mappingStatus',x.p.url?dsBadge('Mapped'):dsBadge('Missing URL')):AC_DASH),
     acC('actualLiveDate','Actual Live Date',true,false,null,x=>per(x)?acEd(x,'actualLiveDate',campDate(x.p.date)):x.first?campDate(x.first):AC_DASH),
     acC('contentCount','Content Count',true,true,x=>x.cnt,x=>camp(x)?`${x.cnt}${acMuted(' / '+(x.c.plannedVideos||0))}`:x.cnt),
     acC('discoverySource','Discovery Source',false,false,null,x=>x.kind==='creator'&&x.cr&&x.cr.source?esc(x.cr.source):AC_DASH)
   ]},
   {k:'organic',t:'Organic Performance',defOn:true,cols:[
     acC('views','Views',true,true,x=>x.cnt?x.organic:null,x=>x.cnt?exactN(x.organic):AC_DASH),
     acC('reach','Reach',true,true,x=>x.cnt?x.sim.reach:null,x=>x.cnt?acSim(exactN(x.sim.reach)):AC_DASH),
     acC('impressions','Impressions',true,true,x=>x.cnt?x.sim.impr:null,x=>x.cnt?acSim(exactN(x.sim.impr)):AC_DASH),
     acC('likes','Likes',true,true,x=>x.cnt?x.sim.likes:null,x=>x.cnt?acSim(exactN(x.sim.likes)):AC_DASH),
     acC('comments','Comments',true,true,x=>x.cnt?x.sim.comments:null,x=>x.cnt?acSim(exactN(x.sim.comments)):AC_DASH),
     acC('shares','Shares',true,true,x=>x.cnt?x.sim.shares:null,x=>x.cnt?acSim(exactN(x.sim.shares)):AC_DASH),
     acC('saves','Saves',true,true,x=>x.cnt?x.sim.saves:null,x=>x.cnt?acSim(exactN(x.sim.saves)):AC_DASH),
     acC('engagements','Engagements',true,true,x=>x.cnt?x.sim.eng:null,x=>x.cnt?acSim(exactN(x.sim.eng)):AC_DASH),
     acC('engRate','Eng. Rate',true,true,x=>acEngRate(x),x=>acEngRate(x)==null?AC_DASH:acSim(acEngRate(x).toFixed(1)+'%')),
     acC('organicCpv','Organic CPV',true,true,x=>x.cnt&&x.planned&&x.organic?x.planned/x.organic:null,x=>x.cnt&&x.planned&&x.organic?acSim(cpvOf(x.planned,x.organic)):AC_DASH),
     acC('insightsAccess','Insights Access',false,false,null,()=>AC_NA)
   ]},
   {k:'vsPlan',t:'Plan vs Actual',defOn:true,cols:[
     acC('viewsVsPlan','Views vs Plan',true,true,x=>acVs(x,'v'),x=>acVsCell(x,'v')),
     acC('reachVsPlan','Reach vs Plan',true,true,x=>acVs(x,'r'),x=>acVsCell(x,'r')),
     acC('cpvVsPlan','CPV vs Plan',true,true,x=>acVs(x,'c'),x=>acVsCell(x,'c')),
     acC('postsPublished','Posts Published',true,true,x=>x.cnt,x=>x.cnt)
   ]},
   {k:'paid',t:'Paid Amplification',defOn:true,cols:[
     acC('paidStatus','Paid Status',true,false,null,x=>{
       if(per(x)) return (S.acPlans||{})[x.p.id]?dsBadge('Planned'):dsBadge(x.p.paid>0?'Boosted':'Organic');
       if(!x.cnt) return AC_DASH; return x.boosted.length?dsBadge(x.boosted.length+' boosted'):dsBadge('Organic'); }),
     acC('adMapping','Ad Mapping',true,false,null,x=>per(x)?(x.p.paid>0?`<span class="ac-id">${adIdOf(x.p)}</span>`:AC_DASH):x.boosted.length?`${x.boosted.length} ad${x.boosted.length>1?'s':''}`:AC_DASH),
     acC('paidStart','Paid Start',true,false,null,x=>per(x)&&x.p.paid>0?campDate(x.p.date):x.firstBoost?campDate(x.firstBoost):AC_DASH),
     acC('plannedBudget','Planned Budget',true,true,x=>camp(x)?x.c.budget:null,x=>acEd(x,'plannedBudget',camp(x)?rupees(x.c.budget):AC_DASH)),
     acC('paidSpend','Paid Spend',true,true,x=>x.cost,x=>x.cnt?rupees(x.cost):AC_DASH),
     acC('paidImpressions','Impressions',true,true,x=>x.sim.nb?x.sim.pImpr:null,x=>x.sim.nb?acSim(exactN(x.sim.pImpr)):AC_DASH),
     acC('paidReach','Reach',true,true,x=>x.sim.nb?x.sim.pReach:null,x=>x.sim.nb?acSim(exactN(x.sim.pReach)):AC_DASH),
     acC('frequency','Frequency',true,true,x=>x.sim.nb&&x.sim.pReach?x.sim.pImpr/x.sim.pReach:null,x=>x.sim.nb&&x.sim.pReach?acSim((x.sim.pImpr/x.sim.pReach).toFixed(2)+'x'):AC_DASH),
     acC('videoViews','Video Views',true,true,x=>x.sim.nb?x.sim.vv:null,x=>x.sim.nb?acSim(exactN(x.sim.vv)):AC_DASH),
     acC('clicks','Clicks',true,true,x=>x.sim.nb?x.sim.clicks:null,x=>x.sim.nb?acSim(exactN(x.sim.clicks)):AC_DASH),
     acC('ctr','CTR',true,true,x=>x.sim.nb&&x.sim.pImpr?x.sim.clicks/x.sim.pImpr*100:null,x=>x.sim.nb&&x.sim.pImpr?acSim((x.sim.clicks/x.sim.pImpr*100).toFixed(2)+'%'):AC_DASH),
     acC('cpc','CPC',true,true,x=>x.sim.nb&&x.sim.clicks?x.sim.spend/x.sim.clicks:null,x=>x.sim.nb&&x.sim.clicks?acSim('₹'+(x.sim.spend/x.sim.clicks).toFixed(2)):AC_DASH),
     acC('cpm','CPM',true,true,x=>x.sim.nb&&x.sim.pImpr?x.sim.spend/x.sim.pImpr*1000:null,x=>x.sim.nb&&x.sim.pImpr?acSim('₹'+(x.sim.spend/x.sim.pImpr*1000).toFixed(0)):AC_DASH),
     acC('paidEng','Paid Engagements',true,true,x=>x.sim.nb?x.sim.pEng:null,x=>x.sim.nb?acSim(exactN(x.sim.pEng)):AC_DASH),
     acC('conversions','Conversions',true,true,x=>x.sim.nb?x.sim.conv:null,x=>x.sim.nb?acSim(exactN(x.sim.conv)):AC_DASH),
     acC('roas','ROAS',true,true,x=>x.sim.nb&&x.sim.spend?x.sim.rev/x.sim.spend:null,x=>x.sim.nb&&x.sim.spend?acSim((x.sim.rev/x.sim.spend).toFixed(2)+'x'):AC_DASH),
     acC('paidCpv','Paid CPV',true,true,x=>x.paid?x.cost/x.paid:null,x=>x.paid?cpvOf(x.cost,x.paid):AC_DASH)
   ]},
   {k:'combined',t:'Combined Performance',defOn:false,cols:[
     acC('totalViews','Total Views',true,true,x=>x.cnt?x.views:null,x=>x.cnt?exactN(x.views):AC_DASH),
     acC('combinedEng','Combined Eng.',true,true,x=>x.cnt?x.sim.eng+x.sim.pEng:null,x=>x.cnt?acSim(exactN(x.sim.eng+x.sim.pEng)):AC_DASH),
     acC('totalInvestment','Total Investment',true,true,x=>(x.planned+x.cost)||null,x=>(x.planned+x.cost)?rupees(x.planned+x.cost):AC_DASH),
     acC('combinedCpv','Combined CPV',true,true,x=>x.views?(x.planned+x.cost)/x.views:null,x=>x.views?cpvOf(x.planned+x.cost,x.views):AC_DASH)
   ]}
  ];
  if((S.acCustom||[]).length) groups.push({k:'custom',t:'Custom',defOn:true,cols:S.acCustom.map(acCustomCol)});
  return groups;
}
function acCustVal(id,x){ return ((S.acCustVals||{})[id]||{})[x.kind+':'+x.key]||''; }
function acCustomCol(d){
  const k='cu_'+d.id;
  if(d.type==='formula'){
    const val=x=>{const a=acColVal(d.a,x), b=d.bType==='num'?+d.b:acColVal(d.b,x);
      if(a==null||b==null||isNaN(a)||isNaN(b)) return null;
      switch(d.op){case '+':return a+b;case '-':return a-b;case '*':return a*b;case '/':return b?a/b:null;case '%':return b?a/b*100:null}return null};
    return acC(k,d.label,true,true,val,x=>{const v=val(x);return v==null?AC_DASH:acFmt(d.fmt,v)});
  }
  const editable=x=>['campaign','creator','post'].includes(x.kind);
  if(d.type==='list') return acC(k,d.label,true,false,null,x=>{
    if(!editable(x)) return AC_DASH; const cur=acCustVal(d.id,x);
    return `<select class="ac-cin" aria-label="${esc(d.label)}" data-cv="${esc(d.id)}" data-rk="${esc(x.kind+':'+x.key)}" onchange="acSetCust(this)"><option value="">—</option>${(d.options||[]).map(o=>`<option ${o===cur?'selected':''}>${esc(o)}</option>`).join('')}</select>`; });
  return acC(k,d.label,true,false,null,x=>{
    if(!editable(x)) return AC_DASH;
    return `<input class="ac-cin" aria-label="${esc(d.label)}" value="${esc(acCustVal(d.id,x))}" placeholder="Add text…" data-cv="${esc(d.id)}" data-rk="${esc(x.kind+':'+x.key)}" onchange="acSetCust(this)">`; });
}
function acSetCust(el){
  const id=el.dataset.cv, rk=el.dataset.rk, vals={...(S.acCustVals||{})};
  vals[id]={...(vals[id]||{}),[rk]:el.value}; S.acCustVals=vals; acPersist(); toast('Saved');
}
function acAllColsFlat(){ return acGroupsDef().flatMap(g=>g.cols); }
function acColVal(k,x){ const c=acAllColsFlat().find(c=>c.k===k); return c&&c.val?c.val(x):null; }
const acGroupOn=g=>g.always||((S.acGroups||{})[g.k]??g.defOn);
const acColOn=(k,def)=>((S.acCols||{})[k]??def);
function acOrderOf(g){ const base=g.cols.map(c=>c.k), cur=(S.acOrder||{})[g.k]||[]; return [...cur.filter(k=>base.includes(k)),...base.filter(k=>!cur.includes(k))]; }
/* model: one entry per visible column, or one hatched stub per collapsed group */
function acModel(){
  const out=[], coll=S.acCollapsed||{};
  acGroupsDef().forEach(g=>{
    if(!acGroupOn(g)) return;
    const vis=acOrderOf(g).map(k=>g.cols.find(c=>c.k===k)).filter(c=>c&&acColOn(c.k,c.on));
    if(!vis.length) return;
    if(coll[g.k]&&!g.always){ out.push({stub:true,g:g.k,t:g.t}); return; }
    vis.forEach(c=>out.push({col:c,g:g.k}));
  });
  return out;
}
function acCellsHTML(model,x){ return model.map(m=>m.stub?`<td class="ac-hatch ac-g-${m.g}"></td>`:`<td class="${m.col.num?'ds-num':''} ac-g-${m.g}">${m.col.cell(x)}</td>`).join(''); }
/* ── level tabs: each level shows a chosen dimension; selections cascade to the right ── */
function acTabsHTML(dims,act){
  return `<div class="ac-levels" role="tablist" aria-label="Levels">`+dims.map((d,i)=>{
    const D=AC_DIM[d], n=acSel(i).length;
    const prev=dims.slice(0,i).map((dd,j)=>acSel(j).length?`${acSel(j).length} ${acSel(j).length>1?AC_DIM[dd].label.toLowerCase():(AC_DIM[dd].one||AC_DIM[dd].label).toLowerCase()}`:'').filter(Boolean);
    return `${i?'<span class="ac-arr" aria-hidden="true">›</span>':''}<div class="ac-tab${act===i?' on':''}" role="tab" tabindex="0" aria-selected="${act===i}" onclick="acGoLevel(${i})" onkeydown="if(event.key==='Enter')acGoLevel(${i})">
      <span class="ac-tab-ic">${acIc(D.icon)}</span>
      <span class="ac-tab-tx"><small>Level ${i+1}${D.ent?'':' · breakdown'}</small><b>${D.label}</b><span>${esc(prev.length?'for '+prev.join(', '):'All')}</span></span>
      ${n?`<span class="ac-tab-chip" title="${n} selected">${n}<button type="button" aria-label="Clear selection" onclick="event.stopPropagation();acClearLevel(${i})">${acIc('x')}</button></span>`:''}
      <button type="button" class="ac-tab-caret" aria-label="Change what level ${i+1} shows" onclick="event.stopPropagation();acPopToggle('lvl${i}')">${acIc('chevD')}</button>
      ${dims.length>1?`<button type="button" class="ac-tab-x" aria-label="Remove level ${i+1}" title="Remove level" onclick="event.stopPropagation();acRemoveLevel(${i})">${acIc('x')}</button>`:''}
    </div>`;}).join('')+(dims.length<4?`<button type="button" class="ac-tab-add" aria-label="Add level" title="Add level" onclick="acPopToggle('add')">${acIc('plus')}</button>`:'')+`</div>`;
}
/* levels: remove one (the ones above it keep their selections), or add one at the bottom (max four) */
function acRemoveLevel(i){
  const dims=[...acDims()]; if(dims.length<=1||i<0||i>=dims.length) return;
  dims.splice(i,1);
  Object.assign(S,{acSlots:dims,acSelS:[0,1,2,3].map(j=>j<i?acSel(j):[]),acActive:Math.min(S.acActive||0,dims.length-1),acExp:{},acPop:null,acViewName:'Custom'});
  paintBody();
}
function acAddLevel(k){
  const dims=[...acDims()]; if(dims.length>=4||dims.includes(k)||!AC_DIM[k]) return;
  dims.push(k);
  Object.assign(S,{acSlots:dims,acActive:dims.length-1,acExp:{},acPop:null,acViewName:'Custom'});
  paintBody();
}
function acFreeDims(){ const dims=acDims(); return Object.keys(AC_DIM).filter(k=>!dims.includes(k)); }
function acAddPopHTML(){
  const free=acFreeDims(), opt=k=>`<button type="button" class="ac-pop-opt" onclick="acAddLevel('${k}')">${acIc(AC_DIM[k].icon)} ${AC_DIM[k].label}</button>`;
  return `<div class="ac-pop ac-pop--lvl"><div class="ac-pop-h">Add level ${acDims().length+1}</div>${free.filter(k=>AC_DIM[k].ent).map(opt).join('')}<div class="ac-pop-h">Breakdowns</div>${free.filter(k=>!AC_DIM[k].ent).map(opt).join('')}</div>`;
}
function acGoLevel(i){ S.acActive=i; S.acExp={}; S.acPop=null; paintBody(); }
function acClearLevel(i){ for(let j=i;j<4;j++) acSetSel(j,[]); S.acExp={}; paintBody(); }
function acPopToggle(k){ S.acPop=(k==null||S.acPop===k)?null:k; paintBody(); }
function acSetSlot(i,k){
  const dims=[...acDims()], j=dims.indexOf(k);
  if(j>=0&&j!==i) dims[j]=dims[i];
  dims[i]=k;
  const from=j>=0?Math.min(i,j):i;
  S.acSelS=[0,1,2,3].map(x=>x>=from?[]:acSel(x));
  Object.assign(S,{acSlots:dims,acExp:{},acViewName:'Custom'});
  paintBody();
}
function acUseStack(k){ Object.assign(S,{acSlots:k.split(','),acSelS:[[],[],[],[]],acActive:0,acExp:{},acPop:null,acViewName:'Custom'}); paintBody(); }
function acLevelPopHTML(i){
  const dims=acDims(), cur=dims[i];
  const opt=k=>`<button type="button" class="ac-pop-opt${k===cur?' on':''}" onclick="acSetSlot(${i},'${k}');acPopToggle(null)">${acIc(AC_DIM[k].icon)} ${AC_DIM[k].label}${dims.includes(k)&&k!==cur?` <span class="ac-muted">(Level ${dims.indexOf(k)+1} · swaps)</span>`:''}</button>`;
  return `<div class="ac-pop ac-pop--lvl"><div class="ac-pop-h">Level ${i+1} shows…</div>${Object.keys(AC_DIM).filter(k=>AC_DIM[k].ent).map(opt).join('')}<div class="ac-pop-h">Breakdowns</div>${Object.keys(AC_DIM).filter(k=>!AC_DIM[k].ent).map(opt).join('')}</div>`;
}
function acStackPopHTML(){
  const dims=acDims();
  const free=acFreeDims();
  return `<div class="ac-pop ac-pop--stack"><div class="ac-pop-h">Stack · up to four levels</div><div class="ac-stackcfg">${dims.map((d,i)=>`<div class="ac-fld-cell"><label class="ac-fld"><small>Level ${i+1}</small><select class="ac-input" onchange="acSetSlot(${i},this.value)">${Object.keys(AC_DIM).map(k=>`<option value="${k}" ${k===d?'selected':''}>${AC_DIM[k].label}</option>`).join('')}</select></label>${dims.length>1?`<button type="button" class="ac-x ac-fld-x" aria-label="Remove level ${i+1}" title="Remove level" onclick="acRemoveLevel(${i})">${acIc('x')}</button>`:''}</div>`).join('')}${dims.length<4&&free.length?`<div class="ac-fld-cell"><button type="button" class="ac-add-cell" aria-label="Add level" onclick="acAddLevel('${free[0]}')">${acIc('plus')} Add level</button></div>`:''}</div>
    <div class="ac-pop-h">Quick stacks</div>${AC_STACKS.map(([k,l])=>`<button type="button" class="ac-pop-opt${dims.join()===k?' on':''}" onclick="acUseStack('${k}')">${esc(l)}</button>`).join('')}</div>`;
}
function acViewsPopHTML(){
  const cur=S.acViewName||'All campaigns', saved=S.acSaved||[];
  return `<div class="ac-pop ac-pop--views">
    <div class="ac-pop-h">Views</div>
    ${AC_PRESETS.map((p,i)=>`<button type="button" class="ac-pop-opt${cur===p.name?' on':''}" onclick="acUsePreset(${i})">${esc(p.name)}</button>`).join('')}
    ${saved.length?`<div class="ac-pop-h">Saved views</div>${saved.map((v,i)=>`<div class="ac-pop-row"><button type="button" class="ac-pop-opt${cur===v.name?' on':''}" onclick="acUseSaved(${i})">${esc(v.name)}</button><button type="button" class="ac-x" aria-label="Delete view" onclick="acDelSaved(${i})">${acIc('x')}</button></div>`).join('')}`:''}
</div>`;
}
function acApply(st,name){ Object.assign(S,{acQ:'',acSelS:[[],[],[],[]],acExp:{},acPop:null,acViewName:name||'Custom'},JSON.parse(JSON.stringify(st))); paintBody(); }
function acUsePreset(i){ const p=AC_PRESETS[i]; acApply(p.st,p.name); }
function acUseSaved(i){ const v=(S.acSaved||[])[i]; if(v) acApply(v.st,v.name); }
function acDelSaved(i){ S.acSaved=(S.acSaved||[]).filter((_,j)=>j!==i); acPersist(); paintBody(); }
function acSaveDialog(){ S.acSaveOpen=true; S.acPop=null; paintBody(); }
function acSaveViewGo(){
  const n=((document.getElementById('acVName')||{}).value||'').trim();
  if(!n){ toast('Name the view'); return; }
  const st={acView:S.acView||'All',acFilters:JSON.parse(JSON.stringify(S.acFilters||[])),acSlots:[...acDims()],acActive:S.acActive||0,acSort:S.acSort?{...S.acSort}:null,
    acCols:{...(S.acCols||{})},acGroups:{...(S.acGroups||{})},acOrder:JSON.parse(JSON.stringify(S.acOrder||{})),acCollapsed:{...(S.acCollapsed||{})},acPeriod:S.acPeriod||'all'};
  S.acSaved=[...(S.acSaved||[]).filter(v=>v.name!==n),{name:n,st}];
  S.acViewName=n; S.acSaveOpen=false; acPersist(); paintBody(); toast('View “'+n+'” saved');
}
function acSaveHTML(){
  const cur=S.acViewName&&!AC_PRESETS.some(p=>p.name===S.acViewName)&&S.acViewName!=='Custom'?S.acViewName:'';
  return acModalHTML('Save view',`<label class="ac-fld">View name<input id="acVName" class="ac-input" value="${esc(cur)}" placeholder="e.g. North India Micro creators"></label>
    <p class="ac-hint">Saves the four levels, active level, filters, period, sort, visible columns and their order, and collapsed groups.</p>`,
    `<button type="button" class="ac-btn" onclick="S.acSaveOpen=false;paintBody()">Cancel</button><button type="button" class="ac-btn ac-btn--primary" onclick="acSaveViewGo()">Save view</button>`,'acSaveOpen');
}
function acModalHTML(title,body,foot,closeKey){
  return `<div class="ac-modal-back" onclick="if(event.target===this){S.${closeKey}=false;paintBody()}"><div class="ac-modal" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="ac-modal-h"><h2>${title}</h2><button type="button" class="ac-x" aria-label="Close" onclick="S.${closeKey}=false;paintBody()">${acIc('x')}</button></div>
    <div class="ac-modal-body">${body}</div><div class="ac-modal-f">${foot}</div></div></div>`;
}
/* ── filters panel ── */
function acFilterPanelHTML(){
  const fs=S.acFilters||[], nf=S.acNewF||'';
  const chips=fs.map((f,i)=>`<span class="ac-chip">${acFilterLabel(f)}<button type="button" aria-label="Remove filter" onclick="acRmFilter(${i})">${acIc('x')}</button></span>`).join('');
  let editor='';
  if(nf&&AC_FIELDS[nf]){ const F=AC_FIELDS[nf];
    editor=F.type==='cat'
      ?`<div class="ac-fvals">${F.opts().map(o=>`<label class="ac-fopt"><input type="checkbox" class="ac-fv" value="${esc(o)}"> ${esc(o)}</label>`).join('')}</div>`
      :`<div class="ac-frow"><input id="acFmin" class="ac-input" type="${F.type==='date'?'date':'number'}" placeholder="Min"><span class="ac-muted">to</span><input id="acFmax" class="ac-input" type="${F.type==='date'?'date':'number'}" placeholder="Max"></div>`;
    editor+=`<div><button type="button" class="ac-btn ac-btn--primary" onclick="acApplyFilter()">Apply</button></div>`; }
  return `<div class="ac-panel"><div class="ac-frow"><span class="ac-panel-h">Filters</span>${chips||'<span class="ac-muted">No filters applied</span>'}</div>
    <div class="ac-frow"><select class="ac-input" aria-label="Add filter" onchange="acPickField(this.value)"><option value="">Add a filter…</option>${Object.keys(AC_FIELDS).map(k=>`<option value="${k}" ${k===nf?'selected':''}>${AC_FIELDS[k].label}</option>`).join('')}</select></div>${editor}</div>`;
}
function acPickField(v){ S.acNewF=v; paintBody(); }
function acApplyFilter(){
  const k=S.acNewF, F=AC_FIELDS[k]; if(!F){ toast('Pick a field first'); return; }
  const f={field:k};
  if(F.type==='cat'){ f.values=[...document.querySelectorAll('.ac-fv:checked')].map(x=>x.value); if(!f.values.length){ toast('Pick at least one value'); return; } }
  else { f.min=(document.getElementById('acFmin')||{}).value||''; f.max=(document.getElementById('acFmax')||{}).value||''; if(f.min===''&&f.max===''){ toast('Enter a min or max'); return; } }
  S.acFilters=[...(S.acFilters||[]).filter(x=>x.field!==k),f]; S.acNewF=''; S.acViewName='Custom'; paintBody();
}
function acRmFilter(i){ S.acFilters=(S.acFilters||[]).filter((_,j)=>j!==i); S.acViewName='Custom'; paintBody(); }
function acClearFilters(){ S.acFilters=[]; S.acViewName='Custom'; paintBody(); }
/* ── inline edit in the analytics table: campaign planned fields and post dates/URLs save to the same records ── */
const AC_EDIT={plannedPosts:['campaign','number'],plannedBudget:['campaign','number'],plannedDate:['campaign','date'],actualLiveDate:['post','date'],mappingStatus:['post','text']};
function acEdFind(kind,id){ if(kind==='campaign') return CAMP_LIST.find(c=>c.id===id)||null; for(const c of CAMP_LIST){ const p=(c.posts||[]).find(q=>q.id===id); if(p) return p; } return null; }
function acEdRaw(field,o){
  if(field==='plannedPosts') return o.plannedVideos??'';
  if(field==='plannedBudget') return o.budget??'';
  if(field==='plannedDate') return o.plannedDate||o.created||'';
  if(field==='actualLiveDate') return o.date||'';
  if(field==='mappingStatus') return o.url||'';
  return '';
}
function acEd(x,field,display){
  const cfg=AC_EDIT[field]; if(!cfg) return display;
  const kind=(x.kind==='ad')?'post':x.kind, id=kind==='campaign'?(x.c&&x.c.id):(kind==='post'?(x.p&&x.p.id):null);
  if(!id||kind!==cfg[0]) return display;
  const key=kind+'|'+id+'|'+field, type=cfg[1];
  if(S.acEdit===key){
    const o=acEdFind(kind,id)||{};
    return `<input class="ac-edit-in${type==='number'?' is-num':''}" type="${type}" ${type==='number'?'min="0" step="500" inputmode="numeric"':''} ${field==='mappingStatus'?'placeholder="Paste post URL"':''} value="${esc(String(acEdRaw(field,o)))}" aria-label="${esc(field)}" onblur="acEdSave('${key}',this.value)" onkeydown="acEdKey(event,this)">`;
  }
  return `<span class="ac-edit" role="button" tabindex="0" title="Click to edit" onclick="acEdStart('${key}')" onkeydown="if(event.key==='Enter'){acEdStart('${key}')}">${display}</span>`;
}
function acEdStart(key){ S.acEdit=key; paintBody(); setTimeout(()=>{ const el=document.querySelector('.ac-edit-in'); if(el){ el.focus(); if(el.select) el.select(); } },0); }
function acEdKey(e,el){ if(e.key==='Enter'){ e.preventDefault(); el.blur(); } else if(e.key==='Escape'){ S.acEdit=null; paintBody(); } }
function acEdSave(key,v){
  if(S.acEdit!==key) return;
  const [kind,id,field]=key.split('|'), o=acEdFind(kind,id);
  if(o){
    const num=()=>{ const n=Math.round(Number(String(v||'').replace(/[^\d.]/g,''))); return isFinite(n)&&n>=0?n:null; };
    if(field==='plannedPosts'){ const n=num(); if(n!=null) o.plannedVideos=n; }
    else if(field==='plannedBudget'){ const n=num(); if(n!=null) o.budget=n; }
    else if(field==='plannedDate'){ if(v) o.plannedDate=v; }
    else if(field==='actualLiveDate'){ if(v) o.date=v; }
    else if(field==='mappingStatus'){ o.url=String(v||'').trim(); }
    toast('Saved');
  }
  S.acEdit=null; paintBody();
}
function acCollapseAll(){ S.acExp={}; paintBody(); }
/* level tag: names what this row is, so the first column reads the same at every level */
function acLvlTag(r){ if(!r.depth) return ''; const L={creator:'Creator',post:'Post',ad:'Ad'}[r.kind]||''; return L?`<span class="ac-lvl">${L}</span>`:''; }
function acNameHTML(r,x){
  const dat=`data-slot="${r.slot}" data-key="${esc(r.key)}"`;
  if(r.kind==='creator'){ const cr=x.cr||{name:x.cid,handle:''};
    return `<span class="ac-av">${esc(String(cr.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase())}</span><div class="ac-tx">${acLvlTag(r)}<button type="button" class="ds-namebtn ds-strong" ${dat} onclick="acDrill(this)">${esc(cr.name)}</button><span class="ds-table-meta">@${esc(String(cr.handle||'').replace(/^@/,''))} · ${x.nCr||1} creator${(x.nCr||1)===1?'':'s'}</span></div>`; }
  if(r.kind==='post'){ const p=x.p, cr=crOf(p.creator)||{name:p.creator};
    return `<span class="ac-thumb">${esc(String(p.format||'').slice(0,3).toUpperCase())}</span><div class="ac-tx">${acLvlTag(r)}<button type="button" class="ds-namebtn ds-strong" onclick="openCampaignPost('${p.id}')">${esc(p.concept||'Post')} · ${esc(p.format)}</button><span class="ds-table-meta">${esc(cr.name)} · ${campDate(p.date)}${p.url?` · <a href="${esc(p.url)}" target="_blank" rel="noopener">link</a>`:''}</span></div>`; }
  if(r.kind==='ad'){ const p=x.p, cr=crOf(p.creator)||{handle:''};
    return `<span class="ac-thumb ac-thumb--ad">${acIc('inf')}</span><div class="ac-tx">${acLvlTag(r)}<span class="ds-strong">${esc(adNameOf(p,cr))}</span><span class="ds-table-meta">ID ${adIdOf(p)}</span></div>`; }
  if(r.kind==='campaign'){ const c=x.c;
    return `<span class="ac-dot${c.status==='Active'?' live':''}"></span><div class="ac-tx"><button type="button" class="ds-namebtn" onclick="openCampaign('${c.id}')">${esc(c.name)}</button><span class="ds-table-meta">${esc(dashObjOf(c))} · ${campDate(c.created)} · ${x.nCr} creator${x.nCr===1?'':'s'}</span></div>`; }
  const lbl=r.kind==='total'?'Totals':String(r.key);
  return `<div class="ac-tx"><button type="button" class="ds-namebtn" ${dat} onclick="acDrill(this)">${esc(lbl)}</button><span class="ds-table-meta">${esc(AC_DIM[r.dim].label)} · ${x.nCr} creator${x.nCr===1?'':'s'}</span></div>`;
}
/* click a name: select that row at its level and open the next level for it */
function acDrill(el){
  const slot=+el.dataset.slot, key=el.dataset.key;
  S.acSelS=[0,1,2,3].map(j=>j===slot?[key]:j<slot?acSel(j):[]);
  S.acActive=Math.min(3,slot+1); S.acExp={}; paintBody();
}
function acSelKey(el){ const i=S.acActive||0, cur=new Set(acSel(i)); el.checked?cur.add(el.dataset.key):cur.delete(el.dataset.key); acSetSel(i,[...cur]); for(let j=i+1;j<4;j++) acSetSel(j,[]); paintBody(); }
function acSelAll(){ const i=S.acActive||0, keys=lastTops.map(r=>r.key), cur=acSel(i); const all=keys.length&&keys.every(k=>cur.includes(k)); acSetSel(i,all?[]:keys); for(let j=i+1;j<4;j++) acSetSel(j,[]); paintBody(); }
function acSetTree(v){ S.acTree=!!v; paintBody(); }
function acToggleRow(el){ const p=el.dataset.path, open=el.getAttribute('aria-expanded')==='true'; S.acExp={...(S.acExp||{}),[p]:!open}; paintBody(); }
function acSortCol(k){ const s=S.acSort; S.acSort=s&&s.k===k?{k,dir:-s.dir}:{k,dir:-1}; paintBody(); }
function acRowHTML(r,dims,model,sel){
  const x=acCtxR(r), kids=r.slot<dims.length-1&&acRowsFor(r.atoms,dims[r.slot+1],r.depth+1,r.path,r.slot+1).length>0;
  const open=acIsOpen(r), top=acTreeOn()?r.slot===(S.acActive||0):r.depth===0, isSel=top&&sel.includes(r.key);
  const tree=S.acTree!==false;
  const cb=top?`<input type="checkbox" class="ac-cb" aria-label="Select ${esc(r.key)}" data-key="${esc(r.key)}" ${isSel?'checked':''} onchange="acSelKey(this)">`:(tree?'':'<span class="ac-cbsp"></span>');
  const tog=kids?`<button type="button" class="ac-tog${open?' open':''}" aria-expanded="${open}" aria-label="${open?'Collapse':'Expand'} row" data-path="${esc(r.path)}" onclick="acToggleRow(this)">${acIc('chevR')}</button>`:'<span class="ac-tog-sp"></span>';
  let lead='';
  if(tree&&r.depth){
    lead=`<span class="ac-treepad">${r.anc.map(on=>`<span class="ac-gd${on?' on':''}"></span>`).join('')}<span class="ac-gd el${kids?'':' leaf'}${r.last?'':' more'}"></span></span>`;
  } else if(r.depth){
    lead=`<span class="ac-indent" style="width:${r.depth*22}px"></span>`;
  }
  const code=tree?`<span class="ac-code" title="Row ${esc(r.code)}">${esc(r.code)}</span>`:'';
  const star=top&&CAMP_LIST.some(c=>c.id===r.key)?starBtn(r.key):'';
  return `<tr class="ac-r ac-r-${r.kind}${isSel?' ac-sel':''}${r.depth?' ac-child':''}"><td class="ac-first"><div class="ac-name">${lead}${cb}${star}${tog}${code}${acNameHTML(r,x)}</div></td>${acCellsHTML(model,x)}</tr>`;
}
/* ── selection actions ── */
function acEligibleIds(){
  const act=S.acActive||0, dim=acDims()[act], sel=new Set(acSel(act));
  if(!sel.size) return {posts:[],elig:[],views:0,selAtoms:[]};
  const selAtoms=acRestrict(acFiltered(),act).filter(a=>acKeys(dim,a).some(k=>sel.has(k)));
  const posts=selAtoms.filter(a=>a.p).map(a=>a.p);
  const elig=posts.filter(p=>!(p.paid>0)&&!(S.acPlans||{})[p.id]);
  return {posts,elig,views:sumOf(posts,'organic'),selAtoms};
}
function acBulkHTML(dims,act,dim){
  const s=acSel(act); if(!s.length) return '';
  const D=AC_DIM[dim], e=acEligibleIds(), next=act<dims.length-1?AC_DIM[dims[act+1]]:null;
  const word=s.length>1?D.label.toLowerCase():(D.one||D.label).toLowerCase();
  const stat=`${e.posts.length} published post${e.posts.length===1?'':'s'}${e.posts.length-e.elig.length?` · ${e.posts.length-e.elig.length} already in paid`:''}`;
  return `<div class="ac-bulk" role="region" aria-label="Selection actions">
    <span class="ac-bulk-n">${s.length}</span>
    <span class="ac-bulk-t"><b>${word[0].toUpperCase()+word.slice(1)} selected</b><span class="ac-bulk-m">${stat}</span></span>
    <button type="button" class="ac-bulk-x" aria-label="Clear selection" title="Clear selection" onclick="acClearLevel(${act})">×</button>
    <span class="ac-spacer"></span>
    ${next?`<button type="button" class="ac-link" onclick="acGoLevel(${act+1})">View ${next.label} →</button>`:''}
    ${dim==='campaign'?`<button type="button" class="ac-link" onclick="acBulkStatus('Active')">Activate</button><button type="button" class="ac-link" onclick="acBulkStatus('Completed')">Complete</button>`:''}
    ${e.elig.length?`<button type="button" class="ac-btn ac-btn--primary ac-btn--sm" onclick="acPaidDialog()">${acIc('bolt')} Add to paid amplification</button>`:'<span class="ac-bulk-m">Already in paid</span>'}
  </div>`;
}
function acBulkStatus(st){
  const act=S.acActive||0, ids=new Set(acSel(act));
  CAMP_LIST.forEach(c=>{ if(ids.has(c.id)) c.status=st; });
  S.acExp={}; toast(`${ids.size} campaign${ids.size===1?'':'s'} set to ${st}`); paintBody();
}
/* ── page ── */
function acHeadHTML(){
  return `    <div class="ds-head ac-head"><div><h1 class="ds-page-title">All campaigns</h1><p class="ds-page-desc">Stack four levels, select rows to filter the levels to their right, and expand any row to see what sits beneath it.</p></div>
      <div class="ac-head-r">${periodCtrlHTML({value:S.acPeriod||'all',cust:S.acCust||{},opts:PERIOD_OPTS,set:"setPageState('acPeriod',",setCust:'acSetCust'})}<button type="button" class="ac-btn ac-btn--primary" onclick="openCampaignForm('new')">${acIc('plus')} Create</button></div></div>`;
}
function nCampsOf(atoms){ return new Set(atoms.map(a=>a.c&&a.c.id)).size; }
function allCampaignsHTML(embedded){
  const dims=acDims(), act=S.acActive||0, dim=dims[act], D=AC_DIM[dim];
  const sel=acSel(act), scoped=acRestrict(acFiltered(),act);
  const treeAct=acTreeOn(), rootDim=treeAct?dims[0]:dim;
  const tops=acSortRows(acRowsFor(scoped,rootDim,0,'',treeAct?0:act),rootDim);
  const flat=acFlatten(tops,[]); lastFlat=flat;
  lastTops=treeAct?[...new Map(flat.filter(r=>r.slot===act).map(r=>[r.key,r])).values()]:tops;
  const model=acModel(), coll=S.acCollapsed||{};
  const uniqA=[...new Set(tops.flatMap(r=>r.atoms))];
  const totX=acCtxOf('total','total',uniqA,0);
  const allSel=lastTops.length&&lastTops.every(r=>sel.includes(r.key));
  const groupHead=acGroupsDef().filter(g=>acGroupOn(g)).map(g=>{
    const n=model.filter(m=>m.g===g.k).length; if(!n) return '';
    if(coll[g.k]) return `<th rowspan="2" class="ac-grp ac-stubh ac-g-${g.k}"><button type="button" class="ac-vert" aria-expanded="false" title="Expand ${esc(g.t)}" onclick="acToggleCollapse('${g.k}')"><span>${esc(g.t)}</span></button></th>`;
    if(g.always) return `<th class="ac-grp ac-g-${g.k}" colspan="${n}">${esc(g.t)}</th>`;
    return `<th class="ac-grp ac-g-${g.k}" colspan="${n}"><button type="button" class="ac-gbtn" aria-expanded="${!coll[g.k]}" onclick="acToggleCollapse('${g.k}')">${acIc(coll[g.k]?'chevR':'chevD')} ${esc(g.t)}</button></th>`;
  }).join('');
  const colHead=model.map(m=>{
    if(m.stub) return '';
    const c=m.col, arrow=S.acSort&&S.acSort.k===c.k?(S.acSort.dir<0?' ↓':' ↑'):'';
    return `<th class="${c.num?'ds-num':''} ac-g-${m.g}">${c.val?`<button type="button" class="ac-sort${arrow?' on':''}" onclick="acSortCol('${c.k}')">${esc(c.l)}${arrow}</button>`:esc(c.l)}</th>`;
  }).join('');
  const body=flat.length?flat.map(r=>acRowHTML(r,dims,model,sel)).join(''):`<tr><td colspan="${model.length+1}" class="ds-empty">No rows match these filters.</td></tr>`;
  const totals=`<tr class="ac-totals"><td class="ac-first"><div class="ac-name">Totals · ${nCampsOf(scoped)} campaign${nCampsOf(scoped)===1?'':'s'}</div></td>${acCellsHTML(model,totX)}</tr>`;
  const reviewN=CAMP_LIST.reduce((n,c)=>n+c.posts.filter(p=>!p.views||!p.url).length,0);
  const nf=(S.acFilters||[]).length, nExp=Object.values(S.acExp||{}).some(Boolean);
  const chips=(nf||nExp)?`<div class="ac-chips">${(S.acFilters||[]).map((f,i)=>`<span class="ac-chip">${acFilterLabel(f)}<button type="button" aria-label="Remove filter" onclick="acRmFilter(${i})">${acIc('x')}</button></span>`).join('')}${nf?`<button type="button" class="ac-clear" onclick="acClearFilters()">Clear filters</button>`:''}${nExp?`<button type="button" class="ac-clear" onclick="acCollapseAll()">Collapse all rows</button>`:''}</div>`:'';
  const pop=S.acPop&&S.acPop.indexOf('lvl')===0?acLevelPopHTML(+S.acPop.slice(3)):(S.acPop==='add'&&dims.length<4?acAddPopHTML():'');
  const pop2=S.acPop==='stack'?acStackPopHTML():'';
  const modals=(S.acSettingsOpen?acSettingsHTML():'')+(S.acReviewOpen?acReviewHTML():'')+(S.acPaidOpen?acPaidHTML():'')+(S.acSaveOpen?acSaveHTML():'');
  const shown=flat.filter(r=>r.kind==='post'||r.kind==='ad').length;
  return `<div class="ds-page ac-page">
    ${embedded?'':acHeadHTML()}
    <div class="ac-card">
    <div class="ac-cardrow"><div class="ac-main">
    <div class="ac-tblpanel">
      <div class="ac-bar ac-bar--top">
        <span class="ac-vwrap"><button type="button" class="ac-btn ac-btn--view${S.acPop==='views'?' on':''}" aria-expanded="${S.acPop==='views'}" onclick="acPopToggle('views')">${esc(S.acViewName||'All campaigns')} ${acIc('chevD')}</button>${S.acPop==='views'?acViewsPopHTML():''}</span>
        <span class="ac-spacer"></span>
        <button type="button" class="ac-btn ac-btn--stack" onclick="acPopToggle('stack')">${acIc('list')} <span class="ac-btn-tx">Stack: ${dims.map(d=>AC_DIM[d].one||AC_DIM[d].label).join(' › ')}</span> ${acIc('chevD')}</button>
        <button type="button" class="ac-btn ac-btn--icon" title="Export CSV" aria-label="Export CSV" onclick="acExportCSV()">${acIc('down')}</button>
        <button type="button" class="ac-btn ac-btn--outline" onclick="acSaveDialog()">${acIc('save')} Save view</button>
      </div>
      <div class="ac-zwrap ac-zwrap--bar">${pop2}</div>
      <div class="ac-bar ac-bar--sub">
        ${dsSearch('acQ','Search campaigns, creators, @handles, post URLs or ad IDs',S.acQ||'')}
        <span class="ac-spacer"></span>
        <button type="button" class="ac-btn${S.acPanel||nf?' on':''}" aria-expanded="${!!S.acPanel}" onclick="setPageState('acPanel',${!S.acPanel})">${acIc('filter')} Filters${nf?` <span class="ac-count">${nf}</span>`:''}</button>
        <span class="disc-cols-wrap"><button type="button" class="ac-btn ac-btn--cols${S.acColsOpen?' on':''}" aria-expanded="${!!S.acColsOpen}" onclick="acColsToggle()">${acIc('cols')} Columns</button>${S.acColsOpen?acColsPanel():''}</span>
        <label class="ac-check"><input type="checkbox" ${S.acTree!==false?'checked':''} onchange="acSetTree(this.checked)"><span>Tree view</span></label>
      </div>
      ${S.acPanel?acFilterPanelHTML():''}
      ${chips}
      ${acBulkHTML(dims,act,dim)}
    </div>
    ${acTabsHTML(dims,act)}
    <div class="ac-zwrap ac-zwrap--lvl">${pop}</div>
    <div class="ds-table-wrap ac-scroll"><table class="ds-table ac-table">
      <thead><tr><th class="ac-first ac-grp-first">${acFirstLbl()}</th>${groupHead}</tr>
      <tr><th class="ac-first"><span class="ac-head-cb"><input type="checkbox" aria-label="Select all" ${allSel?'checked':''} onchange="acSelAll()"></span><span>${acFirstLbl()}</span></th>${colHead}</tr></thead>
      <tbody>${body}</tbody>
      <tfoot>${totals}</tfoot>
    </table></div>
    <div class="ac-foot"><span class="ac-legend"><span class="ac-sim">Simulated</span> mock data standing in for connected sources</span><span class="ac-legend">${AC_NA} not connected to a data source</span><span>Selecting rows in a level filters every level to its right.</span><span class="ac-spacer"></span><span class="ds-table-meta">${flat.length} row${flat.length===1?'':'s'} · ${shown} post${shown===1?'':'s'} shown</span></div>
    </div></div>
    </div>
    ${modals}
  </div>`;
}
/* ── table settings ── */
function acSettings(open){ S.acSettingsOpen=!!open; S.acColsOpen=false; if(open&&!S.acTab) S.acTab='cols'; paintBody(); }
function acColsToggle(){ S.acColsOpen=!S.acColsOpen; paintBody(); }
function acColsPanel(){
  const all=acAllColsFlat(), shown=all.filter(c=>acColOn(c.k,c.on)).length;
  const sliders=discSvg('<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',14);
  const grp=g=>{ const on=acGroupOn(g), n=g.cols.filter(c=>acColOn(c.k,c.on)).length;
    const sw=g.always?'':`<label class="ac-sw" title="Show or hide this section"><input type="checkbox" ${on?'checked':''} aria-label="Show ${esc(g.t)}" onchange="acToggleGroup('${g.k}')"><span></span></label>`;
    const items=g.cols.map(c=>`<li class="disc-col-row" data-name="${esc(c.l.toLowerCase())}"><input type="checkbox" ${acColOn(c.k,c.on)?'checked':''} onchange="acToggleCol('${c.k}')" aria-label="Show ${esc(c.l)}"><span class="disc-col-name">${esc(c.l)}</span></li>`).join('');
    return `<li class="ac-cols-grp ac-g-${g.k}"><div class="ac-cols-grph"><span class="ac-set-dot" style="background:var(--g)"></span><b>${esc(g.t)}</b><small>${g.always?'Always visible':`${n} of ${g.cols.length} shown`}</small>${sw}</div><ul class="disc-cols-list">${items}</ul></li>`; };
  const rows=acGroupsDef().map(grp).join('');
  return `<div class="disc-cols-pop ac-cols-pop" role="dialog" aria-label="Columns">
    <div class="disc-cols-head"><div><strong>Columns</strong><span>${shown} of ${all.length} shown · applied as you go</span></div></div>
    <div class="disc-cols-search"><input type="search" placeholder="Find a column" aria-label="Find a column" oninput="discColSearch(this.value)"></div>
    <ul class="ac-cols-groups">${rows}</ul>
    <div class="disc-cols-foot"><button type="button" class="ds-btn ds-btn--ghost ds-btn--sm" onclick="acSettings(true)">${sliders}Configure columns</button></div>
  </div>`;
}
function acTab(t){ S.acTab=t; paintBody(); }
function acToggleGroup(gk){ const g=acGroupsDef().find(x=>x.k===gk); if(!g||g.always) return; S.acGroups={...(S.acGroups||{}),[gk]:!acGroupOn(g)}; paintBody(); }
function acToggleCol(k){ const c=acAllColsFlat().find(x=>x.k===k); S.acCols={...(S.acCols||{}),[k]:!acColOn(k,c?c.on:true)}; paintBody(); }
function acToggleCollapse(gk){ S.acCollapsed={...(S.acCollapsed||{}),[gk]:!(S.acCollapsed||{})[gk]}; paintBody(); }
function acReset(){ S.acCols={}; S.acGroups={}; S.acOrder={}; S.acCollapsed={}; paintBody(); }
function acDragStart(e,key){ e.dataTransfer.setData('text/plain',key); e.dataTransfer.effectAllowed='move'; }
function acDrop(e,gk,target){
  e.preventDefault();
  const from=e.dataTransfer.getData('text/plain'), g=acGroupsDef().find(x=>x.k===gk);
  if(!g||!from||from===target) return;
  const ord=acOrderOf(g); if(!ord.includes(from)) return;
  ord.splice(ord.indexOf(from),1); ord.splice(ord.indexOf(target),0,from);
  S.acOrder={...(S.acOrder||{}),[gk]:ord}; paintBody();
}
function acReadBuild(){
  const B={...(S.acBuild||{type:'text',label:'',options:'',a:'views',op:'/',bType:'col',b:'paidSpend',bNum:'1',fmt:'cpv'})};
  const map={acBLabel:'label',acBOpts:'options',acBA:'a',acBOp:'op',acBBType:'bType',acBB:'b',acBBNum:'bNum',acBFmt:'fmt'};
  Object.keys(map).forEach(id=>{ const el=document.getElementById(id); if(el) B[map[id]]=el.value; });
  S.acBuild=B; return B;
}
function acBuildType(t){ acReadBuild(); S.acBuild={...S.acBuild,type:t}; paintBody(); }
function acAddCustom(){
  const B=acReadBuild(), label=(B.label||'').trim();
  if(!label){ toast('Give the column a name'); return; }
  const def={id:Date.now().toString(36),label,type:B.type};
  if(B.type==='list'){ def.options=(B.options||'').split(',').map(s=>s.trim()).filter(Boolean); if(!def.options.length){ toast('Add at least one option'); return; } }
  if(B.type==='formula') Object.assign(def,{a:B.a,op:B.op,bType:B.bType,b:B.bType==='num'?B.bNum:B.b,fmt:B.fmt});
  S.acCustom=[...(S.acCustom||[]),def]; S.acBuild={...B,label:''}; acPersist(); paintBody(); toast('Column “'+label+'” added');
}
function acRmCustom(id){
  S.acCustom=(S.acCustom||[]).filter(c=>c.id!==id); const v={...(S.acCustVals||{})}; delete v[id]; S.acCustVals=v;
  acPersist(); paintBody();
}
const ACM_DOTS=()=>discSvg('<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',14);
function acColQ(v){ S.acColQ=v; const q=(v||'').trim().toLowerCase(); document.querySelectorAll('.acm-row').forEach(r=>{ r.style.display=r.dataset.name.includes(q)?'':'none'; }); }
function acSettingsHTML(){
  const tab=S.acTab||'cols', groups=acGroupsDef();
  const all=acAllColsFlat(), shown=all.filter(c=>acColOn(c.k,c.on)).length;
  const plus=discSvg('<path d="M12 5v14M5 12h14"/>',14);
  const dots=ACM_DOTS();
  const sw=(g,on)=>`<label class="ac-sw" title="Show or hide this section"><input type="checkbox" ${on?'checked':''} aria-label="Show ${esc(g.t)}" onchange="acToggleGroup('${g.k}')"><span></span></label>`;
  const grpHTML=g=>{ const on=acGroupOn(g), n=g.cols.filter(c=>acColOn(c.k,c.on)).length;
    const rows=acOrderOf(g).map(k=>{ const c=g.cols.find(x=>x.k===k), v=acColOn(c.k,c.on);
      return `<li class="disc-cfg-row acm-row" data-name="${esc(c.l.toLowerCase())}" draggable="true" ondragstart="acDragStart(event,'${c.k}')" ondragover="event.preventDefault()" ondrop="event.preventDefault();acDrop(event,'${g.k}','${c.k}')"><span class="disc-cfg-grip" aria-hidden="true">${dots}</span><input type="checkbox" ${v?'checked':''} onchange="acToggleCol('${c.k}')" aria-label="Show ${esc(c.l)}"><span class="disc-cfg-name">${esc(c.l)}</span></li>`; }).join('');
    return `<section class="ac-cfg-grp ac-g-${g.k}"><header class="ac-cfg-grph"><span class="ac-set-dot" style="background:var(--g)"></span><b>${esc(g.t)}</b><small>${g.always?'Always visible':`${n} of ${g.cols.length} shown`}</small>${g.always?'':sw(g,on)}</header><ul>${rows}</ul></section>`; };
  let body, edit;
  if(tab==='cols'){
    body=`<div class="disc-cfg-list">
        <div class="disc-cfg-listhead"><div><strong>Columns</strong><span>${shown} of ${all.length} shown · applied as you go</span></div><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="acTab('custom')">${plus}Add custom</button></div>
        <div class="disc-cols-search acm-search"><input type="search" placeholder="Find a column" aria-label="Find a column" value="${esc(S.acColQ||'')}" oninput="acColQ(this.value)"></div>
        <div class="acm-list">${groups.map(grpHTML).join('')}</div>
      </div>`;
    edit=`<div class="disc-cfg-edit"><div class="disc-cfg-empty">
        <span class="disc-cfg-empty-ico">${discSvg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>',22)}</span>
        <strong>Sections and columns</strong>
        <p>Use a section’s switch to show or hide all of it. Drag rows to reorder within a section.</p>
        <button type="button" class="ds-btn ds-btn--outline" onclick="acTab('custom')">${plus}Add custom</button>
      </div></div>`;
  } else {
    body=`<div class="disc-cfg-list"><div class="disc-cfg-listhead"><div><strong>Custom column</strong><span>Text, dropdown or formula</span></div><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="acTab('cols')">Back to columns</button></div></div>`;
    edit=`<div class="disc-cfg-edit">${acCustomTabHTML()}</div>`;
  }
  return `<div class="disc-cfg-scrim" onclick="if(event.target===this){S.acSettingsOpen=false;paintBody()}">
    <div class="disc-cfg ac-cfg-analytics" role="dialog" aria-modal="true" aria-label="Column settings">
      <div class="disc-cfg-head"><div><h3>Column settings</h3><p>Show or hide sections and columns, reorder them, and add your own.</p></div><button type="button" class="ds-iconbtn" aria-label="Close" onclick="S.acSettingsOpen=false;paintBody()">&times;</button></div>
      <div class="disc-cfg-split">${body}${edit}</div>
      <div class="disc-cfg-foot"><button type="button" class="ds-btn ds-btn--ghost" onclick="acReset()">Reset columns</button><button type="button" class="ds-btn ds-btn--primary" onclick="S.acSettingsOpen=false;paintBody()">Done</button></div>
    </div></div>`;
}
function acCustomTabHTML(){
  const B=S.acBuild||{type:'text',label:'',options:'',a:'views',op:'/',bType:'col',b:'paidSpend',bNum:'1',fmt:'cpv'};
  const nums=acAllColsFlat().filter(c=>c.num&&c.val);
  const colSel=(id,cur)=>`<select id="${id}" class="ac-input" aria-label="Metric">${nums.map(c=>`<option value="${c.k}" ${c.k===cur?'selected':''}>${esc(c.l)}</option>`).join('')}</select>`;
  const types=[['text','Text field'],['list','Dropdown'],['formula','Formula']];
  return `<div class="ac-builder"><div class="ac-seg">${types.map(([k,l])=>`<button type="button" class="${B.type===k?'on':''}" onclick="acBuildType('${k}')">${l}</button>`).join('')}</div>
    <label class="ac-fld">Column name<input id="acBLabel" class="ac-input" value="${esc(B.label)}" placeholder="e.g. Brief status"></label>
    ${B.type==='list'?`<label class="ac-fld">Options (comma separated)<input id="acBOpts" class="ac-input" value="${esc(B.options)}" placeholder="e.g. Approved, Pending"></label>`:''}
    ${B.type==='formula'?`<div class="ac-frow">${colSel('acBA',B.a)}<select id="acBOp" class="ac-input">${[['+','+'],['-','−'],['*','×'],['/','÷'],['%','% of']].map(([k,l])=>`<option value="${k}" ${B.op===k?'selected':''}>${l}</option>`).join('')}</select>
      <select id="acBBType" class="ac-input" onchange="acBuildType('${B.type}')"><option value="col" ${B.bType==='col'?'selected':''}>a metric</option><option value="num" ${B.bType==='num'?'selected':''}>a number</option></select>
      ${B.bType==='col'?colSel('acBB',B.b):`<input id="acBBNum" class="ac-input" type="number" step="any" value="${esc(B.bNum)}">`}
      <select id="acBFmt" class="ac-input">${[['n','Number'],['m','Currency (₹)'],['cpv','Currency, 2 dp'],['p','Percent'],['c','Compact (K/M)']].map(([k,l])=>`<option value="${k}" ${B.fmt===k?'selected':''}>${l}</option>`).join('')}</select></div>`:''}
    <div class="ac-builder-f"><button type="button" class="ac-btn ac-btn--primary" onclick="acAddCustom()">${acIc('plus')} Add column</button></div></div>
    <h4 class="ac-sub">Your custom columns</h4>${(S.acCustom||[]).length?(S.acCustom||[]).map(c=>`<div class="ac-custom-row"><span class="ac-pill">${c.type==='formula'?'Formula':c.type==='list'?'Dropdown':'Text'}</span><b>${esc(c.label)}</b><span class="ac-muted">${c.type==='list'?esc((c.options||[]).join(' · ')):c.type==='formula'?esc(`${(acAllColsFlat().find(x=>x.k===c.a)||{}).l||c.a} ${c.op} ${c.bType==='num'?c.b:((acAllColsFlat().find(x=>x.k===c.b)||{}).l||c.b)}`):'free text per row'}</span><span class="ac-spacer"></span><button type="button" class="ac-btn ac-btn--ghost" onclick="acRmCustom('${c.id}')">Remove</button></div>`).join(''):'<p class="ac-muted">None yet.</p>'}`;
}
/* ── content review: posts missing metrics or URLs, and manual additions ── */
function acReview(tab){ S.acReviewOpen=true; S.acReviewTab=tab; S.acPop=null; paintBody(); }
function acAllPosts(){ return CAMP_LIST.flatMap(c=>c.posts.map(p=>({c,p}))); }
function acReviewHTML(){
  const tab=S.acReviewTab||'confirm', all=acAllPosts();
  const awaiting=all.filter(x=>!x.p.views), noUrl=all.filter(x=>!x.p.url);
  const tabs=[['confirm','Awaiting metrics',awaiting.length],['unmapped','Unmapped mentions',0],['unavail','Missing URL',noUrl.length],['add','Add content URL','']];
  let body='';
  const empty=t=>`<div class="ac-empty">${t}</div>`;
  if(tab==='confirm') body=awaiting.length?`<p class="ac-hint">Enter views for posts whose metrics have not been fetched. Showing ${Math.min(80,awaiting.length)} of ${awaiting.length}.</p>`+awaiting.slice(0,80).map(({c,p})=>`<div class="ac-rv-row"><div><b>${esc(cNameOf(p.creator))}</b> <span class="ds-table-meta">${esc(c.name)} · ${esc(p.format)} · ${campDate(p.date)}</span></div><span class="ac-spacer"></span><label class="ac-inline">Views <input class="ac-input ac-numin" type="number" min="0" data-pid="${esc(p.id)}" onchange="acSetViews(this)"></label></div>`).join(''):empty('Every post has metrics.');
  if(tab==='unmapped') body=empty('No unmapped mentions. Brand mentions and tags appear here once an Instagram source is connected. Nothing is auto-assigned.');
  if(tab==='unavail') body=noUrl.length?noUrl.map(({c,p})=>`<div class="ac-rv-row"><div><b>${esc(cNameOf(p.creator))}</b> <span class="ds-table-meta">${esc(c.name)} · ${esc(p.format)} · ${campDate(p.date)}</span></div><span class="ac-spacer"></span><input class="ac-input" data-pid="${esc(p.id)}" placeholder="instagram.com/reel/…" style="width:200px"><button type="button" class="ac-btn ac-btn--primary" onclick="acSetUrl(this)">Repair</button></div>`).join(''):empty('No posts are missing a URL.');
  if(tab==='add'){ const cid=S.acRvCamp&&CAMP_LIST.some(c=>c.id===S.acRvCamp)?S.acRvCamp:CAMP_LIST[0].id, camp=CAMP_LIST.find(c=>c.id===cid);
    body=`<div class="ac-form"><label class="ac-fld">Campaign<select id="acRvCamp" class="ac-input" onchange="acRvPick(this.value)">${CAMP_LIST.map(c=>`<option value="${c.id}" ${c.id===cid?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label>
      <label class="ac-fld">Creator<select id="acRvCr" class="ac-input">${(camp.creatorIds||[]).map(id=>`<option value="${id}">${esc(cNameOf(id))}</option>`).join('')}</select></label>
      <label class="ac-fld">Format<select id="acRvFmt" class="ac-input">${['Reel','Post','Carousel'].map(f=>`<option>${f}</option>`).join('')}</select></label>
      <label class="ac-fld">Publish date<input id="acRvDate" class="ac-input" type="date" value="${TODAY}"></label>
      <label class="ac-fld ac-full">Post URL<input id="acRvUrl" class="ac-input" placeholder="instagram.com/reel/…"></label></div>
      <div class="ac-builder-f"><button type="button" class="ac-btn ac-btn--primary" onclick="acAddUrl()">Add content</button></div>`; }
  const tabHTML=tabs.map(([k,l,n])=>`<button type="button" class="${tab===k?'on':''}" onclick="acReview('${k}')">${l}${n!==''?` (${n})`:''}</button>`).join('');
  return `<div class="ac-drawer-back" onclick="if(event.target===this){S.acReviewOpen=false;paintBody()}"><aside class="ac-drawer" role="dialog" aria-label="Content review">
    <div class="ac-modal-h"><h2>Content review</h2><span class="ac-spacer"></span><button type="button" class="ac-x" aria-label="Close" onclick="S.acReviewOpen=false;paintBody()">${acIc('x')}</button></div>
    <div class="ac-tabs ac-tabs--pad">${tabHTML}</div><div class="ac-modal-body">${body}</div></aside></div>`;
}
function acRvPick(id){ S.acRvCamp=id; paintBody(); }
function acSetViews(el){
  const pid=el.dataset.pid; const p=acAllPosts().find(x=>x.p.id===pid); if(!p) return;
  const v=Math.max(0,+el.value||0); p.p.views=v; p.p.organic=Math.max(0,v-(p.p.paid||0));
  toast('Views saved'); paintBody();
}
function acSetUrl(btn){
  const el=btn.parentElement.querySelector('input'); const v=(el.value||'').trim();
  if(!/instagram\.com\//.test(v)){ toast('Enter an instagram.com URL'); return; }
  const p=acAllPosts().find(x=>x.p.id===el.dataset.pid); if(p) p.p.url=v.replace(/^https?:\/\//,'');
  toast('Post URL repaired'); paintBody();
}
function acAddUrl(){
  const url=((document.getElementById('acRvUrl')||{}).value||'').trim().replace(/^https?:\/\//,'');
  if(!/instagram\.com\//.test(url)){ toast('Enter an instagram.com URL'); return; }
  const c=CAMP_LIST.find(x=>x.id===document.getElementById('acRvCamp').value), cid=document.getElementById('acRvCr').value;
  if(!c||!cid){ toast('Choose a campaign and creator'); return; }
  const fmt=document.getElementById('acRvFmt').value, date=document.getElementById('acRvDate').value||TODAY;
  c.posts.push({id:'u'+Date.now().toString(36),creator:cid,product:c.product,date,views:0,organic:0,paid:0,cost:0,concept:'Manual',format:fmt,url});
  S.acReviewTab='confirm'; toast('Content added · awaiting metrics'); paintBody();
}
/* ── paid amplification plan (creates a plan record only; no ads are launched) ── */
function acPaidDialog(){ if(!acEligibleIds().elig.length){ toast('Those posts are already in paid'); return; } S.acPaidOpen=true; paintBody(); }
function acPaidHTML(){
  const e=acEligibleIds(), n=e.elig.length;
  return acModalHTML('Add to paid amplification',`<p class="ac-hint"><b>${n} post${n===1?'':'s'}</b> · ${fmt(sumOf(e.elig,'organic'))} organic views combined. This creates a plan only. No ads are launched.</p>
    <div class="ac-form">
      <label class="ac-fld">Budget per post (₹)<input id="acPBud" class="ac-input" type="number" value="25000" min="1000" step="1000"></label>
      <label class="ac-fld">Objective<select id="acPObj" class="ac-input">${['Video views','Reach','Engagement','Traffic','Sales'].map(o=>`<option>${o}</option>`).join('')}</select></label>
      <label class="ac-fld">Planned start<input id="acPStart" class="ac-input" type="date" value="${dateInDays(2)}"></label>
      <label class="ac-fld">Planned end<input id="acPEnd" class="ac-input" type="date" value="${dateInDays(16)}"></label></div>`,
    `<button type="button" class="ac-btn" onclick="S.acPaidOpen=false;paintBody()">Cancel</button><button type="button" class="ac-btn ac-btn--primary" ${n?'':'disabled'} onclick="acCreatePlans()">Create paid plan</button>`,'acPaidOpen');
}
function acCreatePlans(){
  const budget=+document.getElementById('acPBud').value||0, objective=document.getElementById('acPObj').value;
  const start=document.getElementById('acPStart').value, end=document.getElementById('acPEnd').value;
  if(!start||!end||end<start){ toast('End date is before start date'); return; }
  const e=acEligibleIds(); S.acPlans={...(S.acPlans||{})};
  e.elig.forEach(p=>{ S.acPlans[p.id]={budget,objective,start,end,status:'Planned',createdAt:TODAY}; });
  acPersist(); S.acPaidOpen=false; S.acSelS=[0,1,2,3].map(()=>[]);
  toast(`${e.elig.length} post${e.elig.length===1?'':'s'} planned for paid amplification`); paintBody();
}
/* ── CSV export of visible rows ── */
function acExportCSV(){
  const model=acModel(), cols=model.filter(m=>!m.stub).map(m=>m.col);
  const txt=h=>{const d=document.createElement('div');d.innerHTML=h;return d.textContent.trim()};
  const rows=lastFlat.map(r=>{const x=acCtxR(r);return [r.kind,String(r.key),...cols.map(c=>txt(c.cell(x)))]});
  const head=['Level','Name',...cols.map(c=>c.l)];
  const csv=[head,...rows].map(a=>a.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'})), a=document.createElement('a');
  a.href=url; a.download='all-campaigns.csv'; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000); toast('CSV exported');
}

const CAMP_COLS=[['product','Product','',0],['manager','Campaign manager','',0],['creators','Creators','',0],['progress','Progress','',0],['views','Total views','',1],['spend','Spend vs budget','',0],['cpv','Avg CPV','',1],['health','Health','',0],['start','Start date','',0],['end','End date','',0]];
const campColOn=k=>(S.campCols||{})[k]!==false;
const CAMP_COL_PATHS={
  product:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  manager:'<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',
  creators:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  progress:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  views:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  spend:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  cpv:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  health:'<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  start:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  end:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/>'
};
function campColsBtn(){ return `<button type="button" class="campl-colbtn${S.campColsOpen?' is-on':''}" aria-expanded="${!!S.campColsOpen}" onclick="campColsToggle()">${discSvg(COLS_SVG,14)}Columns</button>`; }
function campColsHTML(){ return `<span class="disc-cols-wrap">${campColsBtn()}${S.campColsOpen?campColsPanel():''}${S.campCfgOpen?campCfgHTML():''}</span>`; }
function campColsToggle(){ S.campColsOpen=!S.campColsOpen; paintBody(); }
function campColsPanel(){
  const shown=campColsOrdered().filter(x=>campColOn(x[0])).length+1, total=CAMP_COLS.length+1;
  const pin=discSvg('<path d="M12 17v5M9 3h6l-1 6 3 3H7l3-3-1-6z"/>',14);
  return `<div class="disc-cols-pop" role="dialog" aria-label="Columns">
    <div class="disc-cols-head"><div><strong>Columns</strong><span>${shown} of ${total} shown · applied as you go</span></div></div>
    <div class="disc-cols-search"><input type="search" placeholder="Find a column" aria-label="Find a column" oninput="discColSearch(this.value)"></div>
    <ul class="disc-cols-list">
      <li class="disc-col-row is-locked" data-name="campaign"><input type="checkbox" checked disabled aria-label="Campaign"><span class="disc-col-ico" aria-hidden="true">${discSvg('<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>')}</span><span class="disc-col-name">Campaign</span><span class="disc-col-lock" aria-label="Pinned">${pin}</span></li>
      ${campColsOrdered().map(x=>`<li class="disc-col-row" data-name="${esc(x[1].toLowerCase())}" draggable="true" ondragstart="campDrag(event,'${x[0]}')" ondragover="event.preventDefault()" ondrop="campDrop(event,'${x[0]}')"><span class="disc-col-drag" aria-hidden="true">${ACM_DOTS()}</span><input type="checkbox" ${campColOn(x[0])?'checked':''} onchange="campColToggle('${x[0]}')" aria-label="Show ${esc(x[1])}"><span class="disc-col-ico" aria-hidden="true">${discSvg(CAMP_COL_PATHS[x[0]])}</span><span class="disc-col-name">${esc(x[1])}</span></li>`).join('')}
    </ul>
    <div class="disc-cols-foot"><button type="button" class="ds-btn ds-btn--ghost ds-btn--sm" onclick="campCfgOpen()">${discSvg('<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',14)}Configure columns</button></div>
  </div>`;
}
function campColToggle(k){ S.campCols={...(S.campCols||{}),[k]:!campColOn(k)}; if(!S.campCfgOpen) S.campColsOpen=true; paintBody(); }
function campColsOrdered(){ const o=S.campOrder||[]; return [...CAMP_COLS].sort((a,b)=>((o.indexOf(a[0])+1)||99)-((o.indexOf(b[0])+1)||99)); }
function campDrag(e,k){ e.dataTransfer.setData('text/plain',k); e.dataTransfer.effectAllowed='move'; }
function campDrop(e,target){ e.preventDefault(); const from=e.dataTransfer.getData('text/plain'); if(!from||from===target) return; const ord=campColsOrdered().map(x=>x[0]); ord.splice(ord.indexOf(from),1); ord.splice(ord.indexOf(target),0,from); S.campOrder=ord; paintBody(); }
function campCfgOpen(){ S.campCfgOpen=true; S.campColsOpen=false; paintBody(); }
function campCfgClose(){ S.campCfgOpen=false; paintBody(); }
function campColsReset(){ S.campCols={}; S.campOrder=null; paintBody(); }
function campCfgRows(){
  const dots=discSvg('<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',14);
  return campColsOrdered().map(x=>`<li class="disc-cfg-row" draggable="true" data-id="${x[0]}" ondragstart="campDrag(event,'${x[0]}')" ondragover="event.preventDefault()" ondrop="event.preventDefault();campDrop(event,'${x[0]}')"><span class="disc-cfg-grip" aria-hidden="true">${dots}</span><input type="checkbox" ${campColOn(x[0])?'checked':''} onchange="campColToggle('${x[0]}')" aria-label="Show ${esc(x[1])}"><span class="disc-cfg-ico" aria-hidden="true">${discSvg(CAMP_COL_PATHS[x[0]])}</span><span class="disc-cfg-name">${esc(x[1])}</span></li>`).join('');
}
function campCfgHTML(){
  const shown=CAMP_COLS.filter(x=>campColOn(x[0])).length+1, total=CAMP_COLS.length+1;
  const pin=discSvg('<path d="M12 17v5M9 3h6l-1 6 3 3H7l3-3-1-6z"/>',14);
  const lockedRow=`<li class="disc-cfg-row is-locked"><span class="disc-cfg-grip" aria-hidden="true"></span><input type="checkbox" checked disabled aria-label="Campaign"><span class="disc-cfg-ico" aria-hidden="true">${discSvg('<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>')}</span><span class="disc-cfg-name">Campaign</span><span class="disc-cfg-pin">${pin}</span></li><li class="disc-cfg-sep" aria-hidden="true"></li>`;
  return `<div class="disc-cfg-scrim" onclick="if(event.target===this)campCfgClose()">
    <div class="disc-cfg" role="dialog" aria-modal="true" aria-label="Configure columns">
      <div class="disc-cfg-head"><div><h3>Configure columns</h3><p>Drag rows to reorder, and tick the columns you want to see.</p></div><button type="button" class="ds-iconbtn" aria-label="Close" onclick="campCfgClose()">&times;</button></div>
      <div class="disc-cfg-split">
        <div class="disc-cfg-list">
          <div class="disc-cfg-listhead"><div><strong>Columns</strong><span>${shown} of ${total} shown</span></div></div>
          <ul>${lockedRow}${campCfgRows()}</ul>
        </div>
        <div class="disc-cfg-edit"><div class="disc-cfg-empty">
          <span class="disc-cfg-empty-ico">${discSvg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>',22)}</span>
          <strong>Campaign columns are fixed</strong>
          <p>Campaign stays pinned first. Changes apply as you go.</p>
        </div></div>
      </div>
      <div class="disc-cfg-foot"><button type="button" class="ds-btn ds-btn--ghost" onclick="campColsReset()">Reset columns</button><button type="button" class="ds-btn ds-btn--primary" onclick="campCfgClose()">Done</button></div>
    </div></div>`;
}

function campTabsHTML(tab){
 return dsTabsFor('campTab',[['draft',`Draft (${CAMP_PLANS.filter(p=>planStageOf(p)!=='Active').length})`],['active',`Active (${CAMP_LIST.filter(c=>c.status==='Active').length})`],['completed','Completed']],tab);
}
function draftPlansHTML(){
 const plans=CAMP_PLANS.filter(p=>planStageOf(p)!=='Active');
 const compareIds=(S.planCompareIds||[]).filter(id=>CAMP_PLANS.some(p=>p.id===id)).slice(0,2);
 if(!plans.length)return '<div class="ds-empty">No draft campaign plans. Plans appear here until a campaign is created from them.</div>';
 const rows=plans.map(p=>`<tr><td class="ds-cb"><input type="checkbox" aria-label="Select ${esc(p.name)} for plan comparison" ${compareIds.includes(p.id)?'checked':''} onchange="planCompareToggle('${p.id}',this.checked)"></td><td><button class="ds-namebtn" onclick="openPlan('${p.id}')">${esc(p.name)}</button><div class="ds-table-meta">${esc(p.brief||'')}</div></td><td>${esc(p.product||'—')}</td><td>${ctTag(p.objective)}</td><td class="ds-num">${p.creators.length}</td><td class="ds-num">${p.shortlisted.length}</td><td class="ds-num">${rupees(p.budget||0)}</td><td><span class="ds-table-meta">${esc(planStageOf(p))}</span></td><td><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openFromPlan('${p.id}')">Create campaign</button></td></tr>`).join('');
 return `<div class="ds-card" style="padding:0"><div class="ds-table-wrap"><table class="ds-table ds-table--wide"><thead><tr><th class="ds-cb" aria-label="Compare plans"></th><th>Campaign plan</th><th>Product</th><th>Objective</th><th class="ds-num">Creators</th><th class="ds-num">Shortlisted</th><th class="ds-num">Budget</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function planHeadActs(){
  const ids=(S.planCompareIds||[]).filter(id=>CAMP_PLANS.some(p=>p.id===id)).slice(0,2);
  return `<button class="ds-btn ds-btn--outline" ${ids.length!==2?'disabled':''} onclick="openPlanCompare()">Compare plans</button>`;
}
function campaignsHTML(){
  const q=(S.campQ||'').toLowerCase().trim();
  const tab=S.campTab||'active', isDraft=tab==='draft';
  const stF=(tab==='completed'?'Completed':'Active'), trF=S.campTracking||'All', orF=S.campOrigin||'All', view=S.campView||'table';
  const live=c=>c.status==='Active';
  const cnt={all:CAMP_LIST.length,live:CAMP_LIST.filter(live).length,completed:CAMP_LIST.filter(c=>!live(c)).length};
  const pass=()=>true;
  const list=CAMP_LIST.filter(c=>pass(c)&&(stF==='All'||(stF==='Active'?live(c):!live(c)))&&(trF==='All'||(trF==='On'?c.tracking:!c.tracking))&&(orF==='All'||(orF==='Legacy'?c.legacy:!c.legacy))&&[c.name,c.product,c.category,c.manager].join(' ').toLowerCase().includes(q))
    .sort((a,b)=>CAMP_SORT==='oldest'?a.created.localeCompare(b.created):b.created.localeCompare(a.created));
  const PER=10, pages=Math.max(1,Math.ceil(list.length/PER)), pg=Math.min(Math.max(1,Number(S.campPage)||1),pages);
  const shown=list.slice((pg-1)*PER,pg*PER);
  const dateLabel=d=>d?new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'—';
  const stBadge=c=>`<span class="life ${live(c)?'life--live':'life--done'}"><i></i>${live(c)?'Live':'Completed'}</span>`;
  /* progress: published vs lined up against the plan. Dummy lined-up and plan values vary per campaign so the bars differ. */
  const progSeed=c=>[...String(c.id)].reduce((a,ch)=>a+ch.charCodeAt(0),0);
  const prog=c=>{ const seed=progSeed(c), k=seed%6, pub=c.posts.length;
    const total=Math.max(Number(c.plannedVideos||0),pub+[0,4,9,14,22,31][k]);
    const lined=Math.min(linedOf(c).length||[0,3,6,2,8,5][k],total-pub); return {pub,lined,total}; };
  const progCell=c=>{ const {pub,lined,total}=prog(c); const pw=pub/Math.max(1,total)*100, lw=lined/Math.max(1,total)*100, v=-1;
    const txt=`<div class="cp-prog-txt"><b>${pub}</b> published · <b>${lined}</b> lined up <span class="ds-table-meta">of ${total}</span></div>`;
    if(v===1){ const n=Math.min(12,Math.max(1,total)), seg=Array.from({length:n},(_,i)=>{ const cap=i/n*total; return `<i class="${cap<pub?'is-pub':cap<pub+lined?'is-line':''}"></i>`; }).join('');
      return `<div class="cp-prog cp-prog--seg">${txt}<div class="cp-segs">${seg}</div></div>`; }
    if(v===2){ return `<div class="cp-prog cp-prog--thick">${txt}<div class="cp-bar-row"><div class="cp-bar"><i class="is-pub" style="width:${pw}%"></i><i class="is-line" style="width:${lw}%"></i></div><span class="cp-pct">${Math.round(pw)}%</span></div></div>`; }
    return `<div class="cp-prog">${txt}<div class="cp-bar"><i class="is-pub" style="width:${pw}%"></i><i class="is-line" style="width:${lw}%"></i></div></div>`; };
  const spendCell=c=>{ const sp=campSpend(c), bd=Number(c.budget||0), pct=bd?sp/bd*100:0;
    const cls=pct>100?'is-over':pct>=90?'is-risk':pct>=75?'is-warn':'is-ok';
    return `<div class="cp-spend ${cls}"><div class="cp-prog-txt"><b>${rupees(sp)}</b> <span class="ds-table-meta">of ${rupees(bd)}</span></div><div class="cp-bar-row"><div class="cp-bar"><i style="width:${Math.min(100,pct)}%"></i></div><span class="cp-pct">${Math.round(pct)}%</span></div></div>`; };
  const healthOf=c=>{ const {pub,total}=prog(c); if(!live(c)) return ['Closed','done']; if(campSpend(c)>Number(c.budget||0)) return ['Over budget','over']; if(pub<total*0.5) return ['Behind plan','behind']; if(pub<total) return ['Needs attention','warn']; return ['On track','ok']; };
  const healthCell=c=>{ const h=healthOf(c); return h?`<span class="health is-${h[1]}">${h[0]}</span>`:'<span class="ds-table-meta">—</span>'; };
  const mgr=c=>`<div class="ds-who">${dsAv(c.manager||'',c.manager||'Unassigned')}<span>${esc(c.manager||'Unassigned')}</span></div>`;
  const creatorsCell=c=>`<div class="cp-creators">${dsStack(c.creatorIds)}<span class="ds-table-meta">${c.creatorIds.length} creator${c.creatorIds.length===1?'':'s'}</span></div>`;
  const toolbar=`<div class="ds-toolbar ds-toolbar--wrap campl-tools">${dsSearch('campQ','Search campaigns',S.campQ||'')}${dsFilter('campOrigin','Origin',[['All','All origins'],['Created','Created here'],['Legacy','Legacy / imported']],orF)}<span class="ds-spacer"></span>${campColsHTML()}${dsViewSeg('campView',[['table','Table'],['cards','Cards']],view)}<button class="ds-btn ds-btn--outline ds-btn--sm" onclick="CAMP_SORT=CAMP_SORT==='latest'?'oldest':'latest';paintBody()"><span>Sort: ${CAMP_SORT==='oldest'?'Oldest':'Last updated'}</span></button></div>`;
  const CAMP_CELL={
    product:c=>`<td class="cp-product">${esc(c.product)}</td>`,
    manager:c=>`<td>${mgr(c)}</td>`,
    creators:c=>`<td>${creatorsCell(c)}</td>`,
    progress:c=>`<td>${progCell(c)}</td>`,
    views:c=>`<td class="ds-num">${fmt(campViews(c))}</td>`,
    spend:c=>`<td>${spendCell(c)}</td>`,
    cpv:c=>`<td class="ds-num">${cpvOf(campSpend(c),campViews(c))}</td>`,
    health:c=>`<td>${healthCell(c)}</td>`,
    start:c=>`<td class="dk-nw">${dateLabel(c.created)}</td>`,
    end:c=>`<td class="dk-nw">${live(c)?'—':dateLabel(c.posts.map(p=>p.date).sort().pop()||c.created)}</td>`
  };
  let body;
  if(view==='cards'){
    body=`<div class="campl-cards">${shown.map(c=>`<article class="ds-card campl-card${c.status!=='Active'?' is-done':''}" role="button" tabindex="0" onclick="openCampaign('${c.id}')"><div class="campl-card-top">${dsMedia(c.id)}<div class="campl-card-id"><span class="ds-table-title">${esc(c.name)}</span><span class="ds-table-meta">${esc(c.product)}</span></div>${stBadge(c)}<div class="campl-card-menu" onclick="event.stopPropagation()"><details class="ds-more"><summary class="ds-btn ds-btn--outline ds-btn--sm" aria-label="More options for ${esc(c.name)}" title="More options">⋯</summary><div class="ds-more-menu"><button onclick="openCampaign('${c.id}')">View campaign</button><button onclick="exportCampaign('${c.id}')">Export campaign data</button><button onclick="openCampaignForm('edit','${c.id}')">Edit campaign</button><button class="is-danger" onclick="openDeleteCampaign('${c.id}')">Delete campaign</button></div></details></div></div>
        <div class="campl-card-row"><span>Creators</span>${creatorsCell(c)}</div>
        <div class="campl-card-row"><span>Manager</span>${mgr(c)}</div>
        ${progCell(c)}
        ${spendCell(c)}
        <div class="campl-card-foot"><span class="dk-nw">Started ${dateLabel(c.created)}</span>${healthCell(c)}</div></article>`).join('')||'<div class="ds-empty">No campaigns match this view.</div>'}</div>`;
  } else {
    body=`<div class="ds-table-wrap"><table class="ds-table ds-table--wide ds-table--scroll cp-table"><thead><tr><th class="cp-sel-th"><span class="sr-only">Select</span></th><th class="cp-star-th"><span class="sr-only">Pin</span></th><th class="ds-sticky-l2">Campaign</th><th>Lifecycle</th>${campColsOrdered().filter(x=>campColOn(x[0])).map(x=>`<th${x[3]?' class="ds-num"':''}>${x[1]}</th>`).join('')}<th class="ds-sticky-r"></th></tr></thead>
      <tbody>${shown.map(c=>`<tr class="${[live(c)?'':'is-done',campSelOn(c.id)?'is-sel':''].filter(Boolean).join(' ')}">
        <td class="cp-sel-td"><input type="checkbox" aria-label="Select ${esc(c.name)}" ${campSelOn(c.id)?'checked':''} onchange="campSelToggle('${c.id}',this.checked)"></td>
        <td class="cp-star-td">${starBtn(c.id)}</td><td class="ds-sticky-l2"><div class="ds-person"><div class="ds-person-text"><span class="ds-table-title"><button class="ds-namebtn" onclick="openCampaign('${c.id}')">${esc(c.name)}</button></span><span class="ds-table-meta">${esc(c.category||'Creator campaign')}</span></div></div></td>
        <td>${stBadge(c)}</td>${campColsOrdered().filter(x=>campColOn(x[0])).map(x=>CAMP_CELL[x[0]](c)).join('')}
        <td class="ds-sticky-r"><details class="ds-more"><summary class="ds-btn ds-btn--outline ds-btn--sm" aria-label="More options for ${esc(c.name)}" title="More options">⋯</summary><div class="ds-more-menu"><button onclick="openCampaign('${c.id}')">View campaign</button><button onclick="exportCampaign('${c.id}')">Export campaign data</button><button onclick="openCampaignForm('edit','${c.id}')">Edit campaign</button><button class="is-danger" onclick="openDeleteCampaign('${c.id}')">Delete campaign</button></div></details></td></tr>`).join('')||`<tr><td colspan="${campColsOrdered().filter(x=>campColOn(x[0])).length+3}" class="ds-empty">No campaigns match this view.</td></tr>`}</tbody></table></div>`;
  }
  return `<div class="ds-page campl">
    <div class="ds-head"><div><h1 class="ds-page-title">Campaigns</h1><p class="ds-page-desc">View campaign status, creators, delivery and progress.</p></div>
      <div class="ds-actions"><button class="ds-btn ds-btn--outline" onclick="openImport('legacy','')">${icon('upload','ico-sm')}Import legacy campaign</button>${isDraft?planHeadActs():''}<button class="ds-btn ds-btn--primary" onclick="openCampaignForm('new')">${icon('plus','ico-sm')}New campaign</button></div></div>
    ${campTabsHTML(tab)}
    ${isDraft?draftPlansHTML():`${toolbar}${campSelBarHTML()}${body}${campPager(list.length,pg,pages,PER)}`}
  </div>`;
}
/* ── campaign selection (My campaign table) and its export bar ── */
const campSelOn=id=>(S.campSel||[]).includes(id);
function campSelToggle(id,on){ const cur=new Set(S.campSel||[]); on?cur.add(id):cur.delete(id); S.campSel=[...cur]; paintBody(); }
function campSelClear(){ S.campSel=[]; paintBody(); }
function campSelBarHTML(){
  const sel=(S.campSel||[]).map(id=>campOf(id)).filter(Boolean), n=sel.length;
  if(!n) return '';
  const posts=sel.reduce((a,c)=>a+c.posts.length,0);
  return `<div class="bulk-bar" role="region" aria-label="Selection actions"><div class="bb-l"><b>${n} campaign${n===1?'':'s'} selected</b><span>${posts} post${posts===1?'':'s'}</span></div><div class="bb-r"><button type="button" class="bb-btn" onclick="campExport()">${discSvg(AP_DL,15)}Export</button><span class="bb-sep"></span><button type="button" class="bb-clear" onclick="campSelClear()">Clear</button></div></div>`;
}
function campExport(){
  const sel=(S.campSel||[]).map(id=>campOf(id)).filter(Boolean);
  if(!sel.length) return toast('Select at least one campaign');
  const rows=sel.flatMap(c=>c.posts.map(p=>({p,c})));
  const q=v=>`"${String(v??'').replace(/"/g,'""')}"`;
  const head=['Link','Campaign','Creator','Product','Format','Type','Concept','Live date','Organic views','Paid views','Views','Cost'];
  const lines=[head.map(q).join(','),...rows.map(({p,c})=>[p.url||'',c.name,cNameOf(p.creator),p.product||c.product,p.format||'',p.paid>0?'Boosted':'Organic',p.concept||'',p.date||'',p.organic||0,p.paid||0,p.views||0,p.cost||0].map(q).join(','))];
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/csv'})); a.download=`campaign-export-${TODAY}.csv`; a.click(); URL.revokeObjectURL(a.href);
  toast(`Exported ${sel.length} campaign${sel.length===1?'':'s'} and ${rows.length} post${rows.length===1?'':'s'}`);
}

/* ════════ PLAN DETAIL · CAMPAIGN DETAIL · SETTINGS · DIALOGS (ported from uploaded prototype) ════════ */
const TODAY='2026-10-29';
const planOf=id=>CAMP_PLANS.find(p=>p.id===id);
const campOf=id=>CAMP_LIST.find(c=>c.id===id);
const crOf=id=>DISC.find(c=>c.id===id);
const mxOf=id=>{const c=crOf(id);return c?mx(c):{owner:'Unassigned',cost:0,status:'Considering'};};
/* Sample data: keep each sample plan's budget above its shortlisted cost, so the approval check can pass */
CAMP_PLANS.forEach(p=>{ const est=(p.shortlisted||[]).reduce((t,cid)=>t+plCost(p,cid),0); if(p.budget>0&&est>p.budget) p.budget=Math.ceil(est*1.15/1000)*1000; });
/* Sample data for the Content filters: some links point to YouTube and TikTok, some posts are Stories or Videos */
CAMP_LIST.forEach(c=>c.posts.forEach((p,i)=>{ if(p.url&&i%5===1) p.url='https://youtube.com/shorts/sample-'+p.id; else if(p.url&&i%5===3) p.url='https://tiktok.com/@sample/video/'+p.id; if(i%6===4) p.format='Story'; else if(i%7===5) p.format='Video'; }));
const fitOf=i=>[67,33,82,70][i%4];
const contentFitOf=i=>[50,38,87][i%3];
const CONCEPTS=['How-to','Before/After','Review','Gifting','Unboxing','Routine'];
const dsPerson=(c,fn)=>{ if(!c) return '—'; const nb=fn?`<button class="ds-namebtn" onclick="${fn}('${c.id}')">${esc(c.name)}</button>`:`<span class="ds-table-title">${esc(c.name)}</span>`; return `<div class="ds-person">${dsAv(c.id,c.name)}<div class="ds-person-text"><span class="ds-table-title">${nb}</span><span class="ds-table-meta">${esc(c.handle)}</span></div></div>`; };
function openPlan(id){ S.planId=id; S.plSel=[]; S.plCmpOnly=null; S.plNoteEdit=null; S.pTab='overview'; S.plStatus='All'; S.page='plan'; S.discCreator=null; S.myCreator=null; paintHeader(); paintBody(true); window.scrollTo(0,0); }
function openCampaign(id){ if(S.page!=='campaign')S.campReturn={page:S.page,myCreator:S.myCreator||null,discCreator:S.discCreator||null}; S.campId=id; S.cTab='performance'; S.page='campaign'; S.discCreator=null; S.myCreator=null; paintHeader(); paintBody(true); window.scrollTo(0,0); }
function notFoundDS(){ return `<div class="ds-page"><div class="ds-card ds-pad"><span class="ds-section-title">Not found</span><p class="ds-caption">The record is unavailable.</p></div></div>`; }
function bars(items){ const mx=Math.max(1,...items.map(i=>i.value)); return `<div class="ds-bars">${items.map(i=>`<div class="ds-bar-col" title="${esc(i.label)}: ${exactN(i.value)}"><div class="ds-bar-fill" style="height:${Math.max(2,i.value/mx*100)}%"></div><span>${esc(i.label)}</span></div>`).join('')}</div>`; }
const boostBadge=p=>p.paid>0?dsBadge('Boosted','outline'):dsBadge('Organic','success');

/* ---------- Plan detail ---------- */
const planProds=p=>p.products&&p.products.length?p.products:(p.product?[p.product]:[]);
const planAges=p=>(p.audience&&p.audience.ages)||[];
const planGoalW=k=>{const g=PL_GOALS.find(x=>x.k===k);return g?`${g.w} / ${100-g.w}`:'';};
const planRv=(l,v)=>`<div class="pl-rv"><dt>${l}</dt><dd>${v}</dd></div>`;
const planChips=arr=>arr&&arr.length?arr.map(x=>`<span class="pl-rv-chip">${esc(x)}</span>`).join(''):'<span class="pl-rv-none">Not set</span>';
const planTxt=v=>(v===undefined||v===null||String(v).trim()==='')?'<span class="pl-rv-none">Not set</span>':esc(String(v));
function planReportHTML(p){
  const a=p.audience||{}, c=p.content||{}, cm=p.compare||{};
  const prods=planProds(p), ages=planAges(p), n=p.creators.length;
  const hero=`<div class="pl-hero">
    <div class="pl-hero-i"><span>Creators</span><b>${n}</b><small>${p.shortlisted.length} shortlisted</small></div>
    <div class="pl-hero-i"><span>Age ranges</span><b>${ages.join(', ')||'Any'}</b><small>${esc(a.gender||'All')} audience</small></div>
    <div class="pl-hero-i"><span>Planned budget</span><b>${rupees(p.budget)}</b><small>${n?rupees(Math.round(p.budget/n))+' per creator':'No creators yet'}</small></div>
    <div class="pl-hero-i"><span>Target views</span><b>${p.targetViews?exactN(p.targetViews):'Not set'}</b><small>Across all posts</small></div>
    <div class="pl-hero-i"><span>Product</span><b>${esc(prods[0]||'Not set')}</b><small>${prods.length>1?'+'+(prods.length-1)+' more':esc(p.format||'')}</small></div></div>`;
  const bench=(cm.benchmarks||[]).map(id=>`<span class="pl-rv-chip">${esc(cNameOf(id))}</span>`).join('')||'<span class="pl-rv-none">None</span>';
  const goal=p.objective?`${esc(p.objective)}${planGoalW(p.objective)?` <small class="pl-rv-none">weights ${planGoalW(p.objective)}</small>`:''}`:'<span class="pl-rv-none">Not set</span>';
  const sec=(t,rows)=>`<section class="pl-rep-sec"><h4>${t}</h4><dl class="pl-rv-grid">${rows}</dl></section>`;
  const grid=[
    sec('Product and goal',planRv('Products',planChips(prods))+planRv('Product notes',planTxt(p.productNotes))+planRv('Goal',goal)+planRv('Formats',planChips(c.formats||[p.format]))),
    sec('Audience',planRv('Age ranges',planChips(ages))+planRv('Gender',planTxt(a.gender))+planRv('Locations',planChips(a.locations))+planRv('In your words',planTxt(a.words))),
    sec('Content',planRv('Must cover',planChips(c.mustCover))+planRv('Must avoid',planChips(c.mustAvoid))+planRv('Tone',planTxt(c.tone))+planRv('Key messages',planChips(c.keyMessages))),
    sec('Benchmarks and exclusivity',planRv('Benchmark creators',bench)+planRv('Competitor exclusivity',cm.competitorExclusive?'<span class="pl-rv-chip">Flag competitor posts</span>':'<span class="pl-rv-none">Off</span>')+planRv('Notes',planTxt(cm.notes))),
    sec('Plan',planRv('Created',planTxt(p.created))+planRv('Status',planTxt(planStageOf(p)))+planRv('Comments',planTxt(p.comments)))
  ].join('');
  return `<div class="pl-rep-head"><div><h3>Brief report</h3><p class="ds-caption">Read-only summary of the brief. Edit it to change any value.</p></div><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openPlanForm('edit','${p.id}')">Edit brief</button></div>${hero}<div class="pl-rep-grid">${grid}</div>`;
}
function plCost(p,id){ if(p&&p.costs&&p.costs[id]!=null) return p.costs[id]; const a=mxOf(id).cost||0; if(a>0) return a; const e=ccsEstFor(p,id); return e&&e.rec!=null?e.rec:0; }
function plCostEdit(id){
  S.plCostEdit=id; S.plCostConfirm=null; S.plCostDraft=null; S.plRowMenu=null; paintBody();
  setTimeout(()=>{ const el=document.getElementById('plCostIn'); if(el){ el.focus(); el.select(); } },0);
}
function plCostCancel(){ S.plCostEdit=null; S.plCostConfirm=null; S.plCostDraft=null; paintBody(); }
/* Save writes the campaign-specific cost. Replacing an agreed rate needs a second, explicit confirm. */
function plCostSave(pid,cid){
  if(S.plCostEdit!==cid) return;
  const p=planOf(pid); if(!p) return;
  const raw=(document.getElementById('plCostIn')||{}).value;
  if(String(raw==null?'':raw).trim()===''){ toast('Enter an amount, or press Cancel'); return; }
  const n=Math.round(Number(raw));
  if(!isFinite(n)||n<0){ toast('Enter an amount of 0 or more'); return; }
  const st=ccsStateOf(p,cid);
  if(st.state==='agreed'&&S.plCostConfirm!==cid){ S.plCostConfirm=cid; S.plCostDraft=String(n); paintBody(); setTimeout(()=>{ const el=document.getElementById('plCostIn'); if(el) el.focus(); },0); return; }
  p.costs=p.costs||{}; p.costs[cid]=n; if(p.costSrc) delete p.costSrc[cid];
  S.plCostEdit=null; S.plCostConfirm=null; S.plCostDraft=null;
  paintBody(); toast(`Campaign cost set to ${rupees(n)}`);
}
function plRowToggle(cid){ S.plRowMenu=S.plRowMenu===cid?null:cid; paintBody(); }
function plRowAct(kind,pid,cid){ S.plRowMenu=null; ccsOpen('plan',cid,pid,kind==='compare'?'compare':null); }
/* Row overflow menu: Estimate rate when there is no cost, Compare rate otherwise. Quick view stays outside. */
function plRowMenu(p,c){
  const st=ccsStateOf(p,c.id), open=S.plRowMenu===c.id;
  const item=st.state==='none'
    ?`<button type="button" role="menuitem" onclick="plRowAct('estimate','${p.id}','${c.id}')">${icon('calc','ico-sm')}Estimate rate</button>`
    :`<button type="button" role="menuitem" onclick="plRowAct('compare','${p.id}','${c.id}')">${icon('compare','ico-sm')}Compare rate</button>`;
  return `<div class="dd" data-rowmenu><button type="button" class="ds-dh-icon" aria-label="More actions for ${esc(c.name)}" aria-expanded="${open}" onclick="event.stopPropagation();plRowToggle('${c.id}')">${icon('more','ico-sm')}</button>${open?`<div class="menu" role="menu">${item}</div>`:''}</div>`;
}
function plCostCell(p,c){
  const st=ccsStateOf(p,c.id), v=plCost(p,c.id);
  const style=`<style>.ccs-cell{display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:4px;min-height:52px}.ccs-amt{font:inherit;font-size:14px;color:#0f172a;font-variant-numeric:tabular-nums;background:none;border:0;padding:2px 6px;margin-right:-6px;border-radius:6px;cursor:text}.ccs-amt:hover{background:#f1f5f9}.ccs-amt:focus-visible{outline:2px solid #1d4ed8;outline-offset:1px}.ccs-edit{display:flex;gap:6px;align-items:center;justify-content:flex-end;flex-wrap:nowrap}.ccs-edit-in{font:inherit;font-size:13px;width:120px;text-align:right;border:1px solid #1d4ed8;border-radius:8px;padding:5px 8px;font-variant-numeric:tabular-nums;color:#0f172a}.ccs-edit-note{font-size:12px;color:#9a3412;max-width:300px;text-align:right}</style>`;
  if(S.plCostEdit===c.id){
    const confirming=st.state==='agreed'&&S.plCostConfirm===c.id;
    const draft=S.plCostDraft!=null?S.plCostDraft:v;
    const note=st.state==='agreed'
      ?(confirming?`Confirm to replace the agreed rate of ${rupees(st.amount)} in this campaign. The creator record is not changed.`:`Agreed rate ${rupees(st.amount)}. Saving replaces it for this campaign only.`)
      :'';
    return `${style}<div class="ccs-cell"><div class="ccs-edit"><input id="plCostIn" class="ccs-edit-in" type="number" min="0" step="500" inputmode="numeric" aria-label="Campaign cost for ${esc(c.name)}" value="${esc(draft)}" onkeydown="if(event.key==='Enter'){event.preventDefault();plCostSave('${p.id}','${c.id}')}else if(event.key==='Escape'){plCostCancel()}"><button type="button" class="ds-btn ds-btn--primary ds-btn--sm" onclick="event.stopPropagation();plCostSave('${p.id}','${c.id}')">${confirming?'Confirm replace':'Save'}</button><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="event.stopPropagation();plCostCancel()">Cancel</button></div>${note?`<div class="ccs-edit-note">${esc(note)}</div>`:''}</div>`;
  }
  return `${style}<div class="ccs-cell"><button type="button" class="ccs-amt" aria-label="Edit cost for ${esc(c.name)}" title="Click to edit the campaign cost" onclick="event.stopPropagation();plCostEdit('${c.id}')">${st.state==='none'?'—':rupees(v)}</button>${dsBadge(CCS_STATE_LBL[st.state],CCS_STATE_KIND[st.state])}</div>`;
}
if(!window.__plRowMenuBound){
  window.__plRowMenuBound=true;
  document.addEventListener('click',e=>{ if(S.plRowMenu&&!e.target.closest('[data-rowmenu]')){ S.plRowMenu=null; paintBody(); } });
}
function planDetailHTML(){
  const p=planOf(S.planId); if(!p) return notFoundDS();
  const tab=S.pTab||'overview', q=(S.pQ||'').toLowerCase().trim();
  const creators=p.creators.map(crOf).filter(Boolean);
  const isShort=id=>p.shortlisted.includes(id);
  const sel=(S.plSel||[]).filter(id=>p.creators.includes(id));
  const st=planStageOf(p), prods=planProds(p);
  let body='';
  if(tab==='brief'){
    body=planReportHTML(p);
  } else if(tab==='outcome'){
    body=planOutcomeHTML(p);
  } else {
    const pst=S.plStatus||'All';
    const rows=creators.filter(c=>pst==='All'||(pst==='Shortlisted')===isShort(c.id)).filter(c=>c.name.toLowerCase().includes(q)).filter(c=>tagFilterOK('plan',c.id));
    const ids=rows.map(c=>c.id), allOn=ids.length>0&&ids.every(id=>sel.includes(id));
    const bar=sel.length?`<div class="pl-bulk" role="region" aria-label="Selection actions"><strong>${sel.length} creator${sel.length===1?'':'s'} selected</strong><span class="pl-bulk-sp"></span><button type="button" class="pl-bulk-btn" onclick="plBulkScore()">${icon('sparkle','ico-sm')}Score creators</button><button type="button" class="pl-bulk-btn" onclick="plBulkStatus()">${icon('check','ico-sm')}Change status</button><button type="button" class="pl-bulk-btn" onclick="plBulkCompare()">${icon('compare','ico-sm')}Compare</button><button type="button" class="pl-bulk-btn is-danger" onclick="plBulkRemove()">${icon('x','ico-sm')}Remove creators</button><button type="button" class="pl-bulk-btn pl-bulk-clear" onclick="plSelClear()">Clear</button></div>`:'';
    body=`<div class="ds-toolbar">${dsSearch('pQ','Search by handle or name',S.pQ||'')}${tagFilterHTML('plan')}<label class="ds-filter${pst!=='All'?' is-active':''}"><span>${pst==='All'?'Status':esc(pst)}</span><select aria-label="Status" onchange="setPlStatus(this.value)">${['All','Shortlisted','Considering'].map(o=>`<option value="${o}" ${pst===o?'selected':''}>${o==='All'?'All statuses':o}</option>`).join('')}</select></label><span class="ds-spacer"></span><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="toast('Scoring requested for all creators · demo')">${icon('sparkle','ico-sm')}Score all creators</button></div>${bar}
    <div class="ds-table-wrap"><table class="ds-table ds-table--fit"><thead><tr><th class="ds-cb"><input type="checkbox" aria-label="Select all creators" ${allOn?'checked':''} onchange="plSelAll(this.checked,'${ids.join(',')}')"></th><th>Creator</th><th class="ds-num">Followers</th><th>Tier</th><th>Stage</th><th class="pl-fit-th">Fit for campaign</th><th>Content fit</th><th class="ds-num">Creator cost</th><th>Tags</th><th>Actions</th></tr></thead>
    <tbody>${rows.map((c,i)=>{ const on=sel.includes(c.id); return `<tr class="${on?'is-selected':''}"><td class="ds-cb"><input type="checkbox" aria-label="Select ${esc(c.name)}" ${on?'checked':''} onchange="plSelToggle('${c.id}',this.checked)"></td><td>${dsPerson(c,'openMyQuick')}</td><td class="ds-num">${fmt(c.followers)}</td><td>${tierTag(c.tier)}</td>
      <td><select class="ds-select" aria-label="Stage for ${esc(c.name)}" onchange="setShortlist('${p.id}','${c.id}',this.value)"><option ${isShort(c.id)?'':'selected'}>Considering</option><option ${isShort(c.id)?'selected':''}>Shortlisted</option></select></td>
      <td>${fitOf(i)}/100 ${i%2?dsBadge('Weak fit','warn'):dsBadge('Good fit','success')}</td><td>${contentFitOf(i)}/100</td><td class="ds-num">${plCostCell(p,c)}</td><td>${tagCellHTML(c.id)}</td>
      <td><div class="crm-row-acts" style="display:flex;gap:6px;align-items:center;justify-content:flex-end;flex-wrap:nowrap;white-space:nowrap"><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openMyQuick('${c.id}')">Quick view</button>${plRowMenu(p,c)}</div></td></tr>`; }).join('')||'<tr><td colspan="9" class="ds-empty">No creators match this view.</td></tr>'}</tbody></table></div>`;
  }
  return `<div class="ds-page">
    <div class="crumb"><button class="link" onclick="setPage('shortlist')">Campaign plan</button> / ${esc(p.name)}</div>
    <header class="cdh">
      <div class="cdh-top">
        <button class="ds-dh-back" aria-label="Back to Campaign plan" onclick="setPage('shortlist')">${dsBackSvg}</button>
        ${dsMedia(p.id)}
        <div class="cdh-main">
          <div class="cdh-title"><h1>${esc(p.name)}</h1><span class="pl-stage-pill pl-stage--${stageSlug(st)}">${esc(st)}</span>${p.objective?`<span class="cdh-chip">${esc(p.objective)}</span>`:''}</div>
          <div class="cdh-meta">${esc(prods[0]||'No product set')} · Created ${esc(p.created)} · ${p.creators.length} creator${p.creators.length===1?'':'s'}</div>
        </div>
        <div class="cdh-actions"><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openAttachTo('plan','${p.id}')">${icon('plus','ico-sm')}Add creators</button><button class="ds-btn ds-btn--primary ds-btn--sm" onclick="openFromPlan('${p.id}')">Launch campaign</button><details class="ds-more"><summary class="ds-btn ds-btn--outline ds-btn--sm" aria-label="More list actions" title="More actions">⋯</summary><div class="ds-more-menu"><button onclick="openImport('plan','${p.id}')">Import CSV</button><button onclick="openPlanForm('edit','${p.id}')">Edit brief</button><button class="is-danger" onclick="openDeletePlan('${p.id}')">Delete list</button></div></details></div>
      </div>
      <div class="cdh-tabs">${dsTabsFor('pTab',[['overview',`All creators (${p.creators.length})`],['brief','Brief'],['outcome','Expected outcome']],tab)}</div>
    </header>
    ${body}
  </div>${S.addOpen&&S.addPlan?addCreatorsHTML():''}`;
}
function plSelToggle(id,on){ const s=new Set(S.plSel||[]); if(on) s.add(id); else s.delete(id); S.plSel=[...s]; paintBody(); }
function plSelAll(on,csv){ const s=new Set(S.plSel||[]); csv.split(',').filter(Boolean).forEach(id=>{ if(on) s.add(id); else s.delete(id); }); S.plSel=[...s]; paintBody(); }
function plSelClear(){ S.plSel=[]; paintBody(); }
function setPlStatus(v){ S.plStatus=v; paintBody(); }
function plBulkScore(){ const n=(S.plSel||[]).length; toast(`Scoring ${n} creator${n===1?'':'s'} against the brief · demo`); }
/* Shared metric table: used by the compare modal */
function planCmpTableHTML(p,list){
  const isShort=id=>(p.shortlisted||[]).includes(id);
  const mt=(label,fn,num)=>`<tr><th scope="row" class="pl-cmp-k">${label}</th>${list.map((c,i)=>`<td class="${num?'ds-num':''}">${fn(c,i)}</td>`).join('')}</tr>`;
  return `<div class="ds-table-wrap pl-cmp-wrap"><table class="ds-table pl-cmp"><thead><tr><th class="pl-cmp-k">Metric</th>${list.map(c=>`<th class="pl-cmp-col"><div class="pl-cmp-h">${dsAv(c.id,c.name)}<span><b>${esc(c.name)}</b><small>${esc(c.handle)}</small></span></div></th>`).join('')}</tr></thead>
  <tbody>
    ${mt('Stage',c=>isShort(c.id)?'<span class="pl-cmp-tag is-short">Shortlisted</span>':'<span class="pl-cmp-tag">Considering</span>')}
    ${mt('Followers',c=>fmt(c.followers),true)}
    ${mt('Avg views',c=>exactN(c.views),true)}
    ${mt('Engagement',c=>(mxOf(c.id).engagement)+'%',true)}
    ${mt('Fit for campaign',c=>`${oeFit(p,c.id)}/100`,true)}
    ${mt('Content fit',(c,i)=>`${contentFitOf(i)}/100`,true)}
    ${mt('Creator cost',c=>rupees(plCost(p,c.id)),true)}
    ${mt('CPV',c=>c.views>0&&plCost(p,c.id)?'₹'+(plCost(p,c.id)/c.views).toFixed(2):'—',true)}
  </tbody></table></div>`;
}
/* Compare modal: opened from the selection bar when two or more creators are ticked */
function plBulkCompare(){
  const ids=[...(S.plSel||[])];
  if(ids.length<2) return toast('Select at least two creators to compare');
  const p=planOf(S.planId); if(!p) return;
  const list=ids.map(crOf).filter(Boolean);
  dlg(`Compare ${list.length} creators`,`From ${esc(p.name)}. Figures are simulated from each creator's profile.`,planCmpTableHTML(p,list),'<button class="ds-btn ds-btn--primary" onclick="closeLayer()">Close</button>');
}
/* Expected outcome tab: simulated results for the draft plan */
/* Expected outcome: aggregation rules
   - creators are de-duplicated before anything is counted
   - fit uses each creator's position in the plan, so it does not change with the list being summarised
   - ER is weighted by expected views; CPV is total cost / total expected views
   - cost is either a manual planned cost or the creator's historical rate; the two are counted separately */
function oePostsPer(p){ return Math.max(1,Math.min(20,Math.round(Number(p.postsPer)||1))); }
function oeSetField(pid,k,v){
  const p=planOf(pid); if(!p) return;
  if(k==='end'&&p.start&&v&&v<p.start) return toast('End date must be on or after the start date');
  if(k==='postsPer') v=Math.max(1,Math.min(20,Math.round(Number(v)||1)));
  p[k]=v||undefined; paintBody(); }
function oeFit(p,id){ const i=(p.creators||[]).indexOf(id); return fitOf(i<0?0:i); }
function oeAgg(p,list){
  const ppc=oePostsPer(p), n=list.length, cost=list.reduce((s,c)=>s+plCost(p,c.id),0), views=list.reduce((s,c)=>s+(c.views||0),0)*ppc;
  const er=views?list.reduce((s,c)=>s+(mxOf(c.id).engagement||0)*(c.views||0),0)/views:0;
  const fit=n?Math.round(list.reduce((s,c)=>s+oeFit(p,c.id),0)/n):0;
  const auths=list.map(c=>mx(c).auth).filter(v=>v!=null);
  const auth=auths.length?Math.round(auths.reduce((s,v)=>s+v,0)/auths.length):null;
  const manual=list.filter(c=>ccsStateOf(p,c.id).state!=='none').length;
  const noHist=list.filter(c=>!(c.views>0)).length;
  const tiers=['Nano','Micro','Macro','Mega'].map(t=>[t,list.filter(c=>c.tier===t).length]).filter(x=>x[1]>0).map(x=>x[0]+' '+x[1]).join(' · ')||'—';
  return {n,cost,views,cpv:views?cost/views:0,er,fit,auth,manual,hist:n-manual,noHist,tiers};
}
/* ===== Creator Costing: one shared side sheet =====
 * Entry points: Creator Profile → Creator actions → Estimate creator rate   ccsOpen('profile', cid)
 *               Draft campaign → All creators → cost cell actions           ccsOpen('plan', cid, pid)
 * Cost states (per creator, per campaign):
 *   Agreed        – a cost on the creator record backed by a past collaboration. Never overwritten by an estimate.
 *   Entered       – a planned cost typed in this campaign, or a record cost with no past collaboration.
 *   Estimated     – a saved estimate, with no entered or agreed cost.
 *   Not estimated – no cost and no estimate.
 * Model (SAMPLE DATA; every multiplier and weight is configurable under Methodology):
 *   Historical agreed rate – rate on record, treated as one reel.                 weight 0.4
 *   Lookalike median rate  – median agreed rate of selected comparables, one reel. weight 0.3
 *   CPV benchmark          – CPV × expected views (entered CPV, else lookalike median CPV). weight 0.2
 *   CPC benchmark          – CPC × expected clicks. Used only when clicks are entered.   weight 0.1
 *   Deliverable multiplier – reel 1.0 (×1.2 over 30s); story 0.5 per frame; ad 1.6, +15% per usage month
 *                            after the first, ×1.25 with paid amplification. Production % is added on top.
 * Methods with no data drop out and the weights are renormalised. Low and High are the lowest and highest
 * method values (rounded to ₹100). Suggested is the weighted average, kept inside that range. */
const CCS_DELIV={reel:{l:'Reel',unit:'reel',icon:'play',help:'Short-form video'},story:{l:'Story',unit:'frame',icon:'layers',help:'Frame sequence'},ad:{l:'Ad',unit:'ad',icon:'target',help:'Paid usage'}};
const CCS_NUM=['units','prod','months','histManual','cpv','views','cpc','clicks'];
const CCS_CFG_DEF=()=>({reel:1,story:0.5,ad:1.6,long:1.2,amp:1.25,usage:0.15,formats:{'Single image':1,'Video':1,'Carousel':1,'Story ad':1},w:{hist:0.4,look:0.3,cpv:0.2,cpc:0.1}});
function ccsCfg(){ const d=CCS_CFG_DEF(), c=S.ccsCfg||{}; return {...d,...c,w:{...d.w,...(c.w||{})},formats:{...d.formats,...(c.formats||{})}}; }
function ccsCfgSet(path,v){
  const cfg=ccsCfg(), n=Math.max(0,Number(v)||0), i=path.indexOf('.'), a=i<0?path:path.slice(0,i), b=i<0?null:path.slice(i+1);
  if(b!==null) cfg[a]={...cfg[a],[b]:n}; else cfg[a]=n;
  S.ccsCfg=cfg; ccsPaint();
}
const ccsN=v=>{const n=Number(String(v==null?'':v).replace(/,/g,'')); return isFinite(n)&&n>0?n:0;};
const ccsRd=v=>Math.round(v/100)*100;
const ccsMed=a=>{ if(!a.length) return null; const x=[...a].sort((p,q)=>p-q), m=x.length>>1; return x.length%2?x[m]:(x[m-1]+x[m])/2; };
const ccsDef=()=>({deliv:'reel',units:1,long:false,prod:0,months:1,amp:false,format:'Single image',seq:'',useHist:true,histManual:'',looks:null,cpv:'',views:'',cpc:'',clicks:''});
const ccsEng=c=>{const m=mxOf(c.id); return m.engagement>0?m.engagement:(c.views?c.likes/c.views*100:0);};

function ccsLooks(c){
  return DISC.filter(x=>x.id!==c.id).map(x=>{
    const tier=x.tier===c.tier, cat=((x.tags||[])[0]||'')===((c.tags||[])[0]||''), fol=x.followers>=c.followers*0.5&&x.followers<=c.followers*1.5;
    return {c:x,m:mxOf(x.id),tier,cat,fol,sc:(tier?1:0)+(cat?1:0)+(fol?1:0)};
  }).filter(l=>l.sc>=1).sort((a,b)=>b.sc-a.sc||Math.abs(a.c.followers-c.followers)-Math.abs(b.c.followers-c.followers)).slice(0,8);
}

function ccsCalc(cid,f){
  const c=crOf(cid); if(!c) return null;
  const cfg=ccsCfg(), m=mxOf(cid);
  const base=f.deliv==='story'?cfg.story:f.deliv==='ad'?cfg.ad:cfg.reel;
  const units=Math.max(1,Math.round(ccsN(f.units))||1);
  const usage=Math.max(1,Math.round(ccsN(f.months))||1);
  const mult=base*(f.deliv==='reel'&&f.long?cfg.long:1)*(1+ccsN(f.prod)/100)*(f.deliv==='ad'?(cfg.formats[f.format]??1)*(1+cfg.usage*(usage-1))*(f.amp?cfg.amp:1):1);
  const looks=ccsLooks(c);
  const selIds=f.looks==null?looks.filter(l=>l.m.cost>0).slice(0,3).map(l=>l.c.id):f.looks;
  const sel=looks.filter(l=>selIds.includes(l.c.id));
  const selRates=sel.filter(l=>l.m.cost>0).map(l=>l.m.cost);
  const selCpv=sel.filter(l=>l.m.cost>0&&l.c.views>0).map(l=>l.m.cost/l.c.views);
  const histRec=m.hist>0&&m.cost>0?m.cost:0;
  const histUsed=f.useHist?(ccsN(f.histManual)||histRec):0;
  const lookCpv=ccsMed(selCpv);
  const cpv=ccsN(f.cpv)||lookCpv;
  const views=ccsN(f.views)||c.views;
  const clicks=ccsN(f.clicks), cpc=ccsN(f.cpc);
  const meth=[];
  if(histUsed) meth.push({k:'hist',l:'Historical agreed rate',v:histUsed*mult*units,w:cfg.w.hist,src:ccsN(f.histManual)&&!histRec?'Manual assumption':ccsN(f.histManual)?'Manual assumption (overrides record)':'Creator record · sample data'});
  if(selRates.length) meth.push({k:'look',l:'Lookalike median rate',v:ccsMed(selRates)*mult*units,w:cfg.w.look,src:`${selRates.length} comparable${selRates.length>1?'s':''} · sample data`});
  if(cpv&&views) meth.push({k:'cpv',l:'CPV benchmark',v:cpv*views*mult*units,w:cfg.w.cpv,src:`₹${cpv.toFixed(2)} per view × ${fmt(views)} views · ${ccsN(f.cpv)?'manual assumption':'lookalike median'}`});
  if(cpc&&clicks) meth.push({k:'cpc',l:'CPC benchmark',v:cpc*clicks*mult*units,w:cfg.w.cpc,src:`₹${cpc.toFixed(2)} per click × ${fmt(clicks)} clicks · manual assumption`});
  const W=meth.reduce((s,x)=>s+x.w,0);
  const vals=meth.map(x=>x.v);
  const low=vals.length?Math.floor(Math.min(...vals)/100)*100:null;
  const high=vals.length?Math.ceil(Math.max(...vals)/100)*100:null;
  const avg=vals.length&&W>0?meth.reduce((s,x)=>s+x.v*x.w,0)/W:null;
  const rec=avg==null?null:Math.min(high,Math.max(low,ccsRd(avg)));
  const missing=[];
  if(!histUsed) missing.push('historical agreed rate');
  if(!selRates.length) missing.push('lookalikes with agreed rates');
  if(!cpv) missing.push('CPV benchmark');
  const n=meth.length;
  const conf=n>=3&&histUsed&&selRates.length>=2?'High':n>=2?'Medium':n===1?'Low':'Insufficient';
  return {c,m,cfg,base,mult,units,usage,meth:meth.map(x=>({...x,share:W>0?x.w/W:0})),missing,low,rec,high,conf,looks,selIds,selRates,lookCpv,cpv,views,clicks,cpc,cpcOk:!!(cpc&&clicks),histRec,histUsed,n,recCpv:histRec&&c.views?histRec/c.views:null};
}

/* Cost state per creator and campaign. Agreed always wins over an estimate. */
function ccsEstFor(p,cid){ return (p&&p.estimates&&p.estimates[cid])||(S.ccSaved&&S.ccSaved[cid])||null; }
function ccsStateOf(p,cid){
  const m=mxOf(cid), agreedRef=m.hist>0&&m.cost>0?m.cost:null;
  const est=ccsEstFor(p,cid), estSrc=(p&&p.estimates&&p.estimates[cid])?'campaign':'profile';
  if(p&&p.costs&&p.costs[cid]!=null) return {state:(p.costSrc&&p.costSrc[cid]==='estimated')?'estimated':'entered',amount:p.costs[cid],agreedRef,est,estSrc};
  if(agreedRef) return {state:'agreed',amount:agreedRef,agreedRef,est,estSrc};
  if(m.cost>0) return {state:'entered',amount:m.cost,agreedRef:null,est,estSrc,record:true};
  if(est) return {state:'estimated',amount:est.rec,agreedRef:null,est,estSrc};
  return {state:'none',amount:0,agreedRef:null,est:null,estSrc};
}
const CCS_STATE_LBL={none:'Not estimated',estimated:'Estimated',entered:'Entered',agreed:'Agreed'};
const CCS_STATE_KIND={none:'warn',estimated:'info',entered:'outline',agreed:'success'};

function ccsLoadFor(type,cid,pid){
  const p=pid?planOf(pid):null;
  const saved=(p&&p.estimates&&p.estimates[cid])||(S.ccSaved&&S.ccSaved[cid]);
  const base=saved?{...ccsDef(),...saved.inputs}:ccsDef();
  const d=S.ccDrafts&&S.ccDrafts[type+':'+cid+':'+(pid||'')];
  return {base:JSON.stringify(base), f:d?{...d}:{...base}};
}
function ccsKey(ctx){ return ctx.type+':'+ctx.cid+':'+(ctx.pid||''); }
function ccsDirty(){ return !!S.ccs && JSON.stringify(S.ccs.f)!==S.ccs.base; }

function ccsOpen(type,cid,pid,focus){
  if(!crOf(cid)) return toast('Creator not found');
  const L=ccsLoadFor(type,cid,pid||null);
  S.ccs={ctx:{type,cid,pid:pid||null},f:L.f,base:L.base,confirm:false,replaceAsk:false,focus:focus||null,step:focus==='compare'?3:1,maxStep:(focus==='compare'||(S.ccSaved&&S.ccSaved[cid]))||(pid&&planOf(pid)&&planOf(pid).estimates&&planOf(pid).estimates[cid])?3:1,err:null,resetAsk:false};
  ccsPaint();
}
function ccsSet(k,v){ if(!S.ccs) return; S.ccs.f[k]=v; S.ccs.confirm=false; S.ccs.replaceAsk=false; S.ccs.enteredAsk=false; ccsPaint(); }
function ccsLook(id,on){
  if(!S.ccs) return;
  const R=ccsCalc(S.ccs.ctx.cid,S.ccs.f); const cur=S.ccs.f.looks==null?R.selIds:S.ccs.f.looks;
  S.ccs.f.looks=on?[...new Set([...cur,id])]:cur.filter(x=>x!==id);
  ccsPaint();
}
function ccsReset(){ if(!S.ccs) return; S.ccs.f={...ccsDef(),looks:null}; S.ccs.confirm=false; S.ccs.replaceAsk=false; S.ccs.resetAsk=false; S.ccs.err=null; ccsPaint(); }
function ccsClose(){
  if(!S.ccs) return;
  if(ccsDirty()&&!S.ccs.confirm){ S.ccs.confirm=true; ccsPaint(); return; }
  S.ccs=null; closeLayer();
}
function ccsKeep(){ if(S.ccs){ S.ccs.confirm=false; ccsPaint(); } }
function ccsDiscard(){
  if(!S.ccs) return;
  if(S.ccDrafts) delete S.ccDrafts[ccsKey(S.ccs.ctx)];
  S.ccs=null; closeLayer();
}
function ccsEstObj(R,f){ return {rec:R.rec,low:R.low,high:R.high,conf:R.conf,n:R.n,inputs:{...f},savedAt:new Date().toISOString()}; }
/* Save estimate. Profile: reusable estimate. Campaign: estimate for this creator in this campaign, and the planned cost becomes Estimated.
   An agreed rate is never overwritten without confirmation: mode 'keep' saves the estimate for comparison only, 'replace' sets the cost. */
function ccsSave(mode){
  const s=S.ccs; if(!s) return;
  const R=ccsCalc(s.ctx.cid,s.f); if(R.rec==null) return;
  const est=ccsEstObj(R,s.f); let msg;
  if(s.ctx.type==='plan'){
    const p=planOf(s.ctx.pid); if(!p) return;
    const st=ccsStateOf(p,s.ctx.cid);
    if(st.state==='agreed'&&!mode){ s.replaceAsk=true; ccsPaint(); return; }
    if(st.state==='entered'&&!mode){ s.enteredAsk=true; ccsPaint(); return; }
    p.estimates=p.estimates||{}; p.estimates[s.ctx.cid]=est;
    if((st.state==='agreed'||st.state==='entered')&&mode==='keep'){
      msg=st.state==='agreed'?'Estimate saved for comparison. The agreed rate stays as the creator cost.':'Estimate saved for comparison. The entered cost stays as the creator cost.';
    } else {
      p.costs=p.costs||{}; p.costs[s.ctx.cid]=R.rec;
      p.costSrc=p.costSrc||{}; p.costSrc[s.ctx.cid]='estimated';
      msg=`${cNameOf(s.ctx.cid)} is estimated at ${rupees(R.rec)} in this campaign`;
    }
  } else {
    S.ccSaved=S.ccSaved||{}; S.ccSaved[s.ctx.cid]=est;
    msg='Estimate saved to the creator profile';
  }
  if(S.ccDrafts) delete S.ccDrafts[ccsKey(s.ctx)];
  S.ccs=null; closeLayer(); paintBody(); toast(msg);
}

function ccsPaint(){
  if(!S.ccs) return;
  const cur=document.getElementById('ccsBack');
  const top=cur?((cur.querySelector('.ds-drawer-body')||{}).scrollTop||0):0;
  const html=`<div class="ds-drawer-back ccs-back" id="ccsBack" onclick="if(event.target===this)ccsClose()"><aside class="ds-page ds-drawer ds-drawer--side ccs-sheet" role="dialog" aria-modal="true" aria-labelledby="ccsTitle">${ccsSheetHTML()}</aside></div>`;
  if(cur) cur.outerHTML=html;
  else { closeLayer(); document.getElementById('layer').insertAdjacentHTML('beforeend',html); }
  const nb=document.querySelector('#ccsBack .ds-drawer-body');
  if(nb){ nb.scrollTop=top; if(S.ccs&&S.ccs.focus){ const el=document.getElementById('ccsCmp'); if(el) el.scrollIntoView({block:'start'}); S.ccs.focus=null; } }
}

const CCS_CSS=`<style>
.ccs-sheet{width:min(760px,100vw)!important;max-width:100vw}
.ccs-head{flex:none;padding:16px 24px 0;background:#ffffff;border-bottom:1px solid #dbeafe}
.ccs-head-row{display:flex;justify-content:space-between;align-items:center;gap:12px}
.ccs-head h2{margin:0;font-size:16px;font-weight:600;color:#0f172a;line-height:1.3}
.ccs-x{width:30px;height:30px;border:0;background:transparent;border-radius:8px;display:grid;place-items:center;cursor:pointer;color:#1e40af}
.ccs-x:hover{background:#f1f5f9}
.ccs-creator{display:flex;align-items:center;gap:10px;margin:8px 0 0;min-width:0}
.ccs-creator .ds-avatar{width:26px;height:26px;font-size:12px;flex:none}
.ccs-creator-txt{display:flex;align-items:baseline;gap:8px;min-width:0;flex-wrap:wrap}
.ccs-creator-txt b{font-size:13px;color:#0f172a;font-weight:600}
.ccs-creator-txt small{font-size:12px;color:#64748b;white-space:nowrap}
.ccs-stepper{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:16px 0 0;padding-bottom:14px}
.ccs-stepper-line{position:absolute;top:12px;left:16.666%;right:16.666%;height:2px;background:#dbeafe;border-radius:4px;overflow:hidden}
.ccs-stepper-line i{display:block;height:100%;background:#1d4ed8;border-radius:4px;transition:width .2s ease}
.ccs-st{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:0;padding:0;font:inherit;cursor:pointer;color:#64748b;min-width:0}
.ccs-st:disabled{cursor:default}
.ccs-st:focus-visible{outline:2px solid #1d4ed8;outline-offset:4px;border-radius:6px}
.ccs-st-c{width:26px;height:26px;border-radius:16px;display:grid;place-items:center;font-size:12px;font-weight:600;background:#ffffff;border:1.5px solid #bfdbfe;color:#64748b;box-sizing:border-box}
.ccs-st-l{font-size:13px;font-weight:500;white-space:nowrap}
.ccs-st:hover:not(:disabled) .ccs-st-c{border-color:#94a3b8}
.ccs-st.is-done .ccs-st-c{background:#eff6ff;border-color:#1d4ed8;color:#1d4ed8}
.ccs-st.is-done .ccs-st-l{color:#1e40af}
.ccs-st.is-active .ccs-st-c{background:#1d4ed8;border-color:#1d4ed8;color:#ffffff}
.ccs-st.is-active .ccs-st-l{color:#0f172a;font-weight:600}
.ccs-body{padding:16px 24px 20px!important}
.ccs-wrap{max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
.ccs-panel{border:1px solid #dbeafe;border-radius:8px;padding:14px 16px;background:#ffffff}
.ccs-sec-h{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;flex-wrap:wrap}
.ccs-sec-h h3{margin:0;font-size:14px;font-weight:600;color:#0f172a}
.ccs-count{font-size:12px;color:#64748b}
.ccs-tag{font-size:12px;font-weight:600;border-radius:16px;padding:2px 7px;background:#fef3c7;color:#9a3412;white-space:nowrap}
.ccs-hint{margin:6px 0 0;font-size:12px;color:#64748b}
.ccs-empty{padding:10px 12px;border:1px dashed #bfdbfe;border-radius:8px;font-size:13px;color:#1e40af;background:#f8fafc}
.ccs-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.ccs-card{display:flex;align-items:center;gap:10px;text-align:left;font:inherit;border:1px solid #bfdbfe;border-radius:8px;padding:10px 12px;background:#ffffff;cursor:pointer;color:#1e40af;min-width:0}
.ccs-card:hover{border-color:#94a3b8}
.ccs-card-ico{width:28px;height:28px;border-radius:8px;background:#f1f5f9;display:grid;place-items:center;color:#1e40af;flex:none}
.ccs-card-t{display:flex;flex-direction:column;min-width:0}
.ccs-card b{font-size:13px;color:#0f172a;font-weight:600}
.ccs-card small{font-size:12px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ccs-card.is-on{border-color:#1d4ed8;background:#eff6ff}
.ccs-card.is-on .ccs-card-ico{background:#dbeafe;color:#1d4ed8}
.ccs-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 16px;margin-top:14px}
.ccs-grid .ccs-span{grid-column:1/-1}
.ccs-f{display:block;font-size:12px;font-weight:500;color:#1e40af;min-width:0;line-height:1.3}
.ccs-f em{font-style:normal;font-weight:400;color:#94a3b8;margin-left:4px}
.ccs-f input,.ccs-f select{display:block;width:100%;height:36px;box-sizing:border-box;margin-top:6px;padding:0 10px;font:inherit;font-size:13px;color:#0f172a;background:#ffffff;border:1px solid #bfdbfe;border-radius:8px;min-width:0}
.ccs-f input::placeholder{color:#94a3b8}
.ccs-f input:focus,.ccs-f select:focus{outline:none;border-color:#1d4ed8;box-shadow:0 0 0 3px #eff6ff}
.ccs-in{position:relative;display:block}
.ccs-in input{padding-right:28px}
.ccs-in i{position:absolute;right:10px;top:calc(50% + 3px);transform:translateY(-50%);font-style:normal;font-size:12px;color:#64748b}
.ccs-toggle{display:inline-flex;height:36px;box-sizing:border-box;margin-top:6px;padding:3px;background:#f1f5f9;border-radius:8px;gap:2px;width:100%}
.ccs-toggle button{flex:1;font:inherit;font-size:13px;border:0;background:transparent;padding:0 10px;border-radius:6px;color:#1e40af;cursor:pointer;white-space:nowrap}
.ccs-toggle button[aria-pressed="true"]{background:#ffffff;color:#0f172a;font-weight:600;box-shadow:0 1px 2px #0f172a14}
.ccs-chk{display:flex;align-items:center;gap:8px;height:36px;font-size:13px;color:#1e40af;cursor:pointer}
.ccs-chk input{width:16px;height:16px;margin:0}
.ccs-chk em{font-style:normal;font-size:12px;color:#94a3b8}
.ccs-hist{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:8px}
.ccs-hist>div{border:1px solid #dbeafe;border-radius:8px;padding:9px 12px;display:flex;flex-direction:column;gap:2px}
.ccs-hist span{font-size:12px;color:#64748b}
.ccs-hist b{font-size:14px;color:#0f172a;font-variant-numeric:tabular-nums}
.ccs-row2{display:grid;grid-template-columns:1fr 1fr;gap:14px 16px;margin-top:12px;align-items:end}
.ccs-row4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:12px}
.ccs-lk-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.ccs-lk{display:flex;flex-direction:column;gap:8px;text-align:left;font:inherit;border:1px solid #dbeafe;border-radius:8px;padding:10px 12px;background:#ffffff;cursor:pointer;color:#1e40af;min-width:0}
.ccs-lk:hover{border-color:#93c5fd}
.ccs-lk.is-on{border-color:#1d4ed8;background:#eff6ff}
.ccs-lk-top{display:flex;align-items:center;gap:10px;min-width:0}
.ccs-lk-top .ds-avatar{width:28px;height:28px;font-size:12px;flex:none}
.ccs-lk-id{display:flex;flex-direction:column;min-width:0;flex:1}
.ccs-lk-id b{font-size:13px;color:#0f172a;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ccs-lk-id small{font-size:12px;color:#64748b}
.ccs-check{width:16px;height:16px;border-radius:6px;border:1.5px solid #bfdbfe;display:grid;place-items:center;font-size:12px;color:#ffffff;flex:none;background:#ffffff}
.ccs-lk.is-on .ccs-check{background:#1d4ed8;border-color:#1d4ed8}
.ccs-lk-meta{display:flex;gap:6px;flex-wrap:wrap;font-size:12px;color:#1e40af}
.ccs-lk-meta>span:first-child{background:#f1f5f9;border-radius:16px;padding:1px 7px}
.ccs-lk-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ccs-lk-stats span{display:flex;flex-direction:column}
.ccs-lk-stats b{font-size:13px;color:#0f172a;font-variant-numeric:tabular-nums}
.ccs-lk-stats small{font-size:12px;color:#64748b}
.ccs-lk-rate{font-size:12px;color:#64748b;border-top:1px solid #f1f5f9;padding-top:7px}
.ccs-lk-rate.has{color:#166534;font-weight:600}
.ccs-lk-rate small{font-weight:400;color:#64748b}
.ccs-link{margin-top:8px;font:inherit;font-size:13px;color:#1d4ed8;background:none;border:0;padding:0;cursor:pointer}
.ccs-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.ccs-m{border:1px solid #dbeafe;border-radius:8px;padding:9px 12px;display:flex;flex-direction:column;gap:2px}
.ccs-m span{font-size:12px;color:#64748b}
.ccs-m b{font-size:14px;color:#0f172a;font-variant-numeric:tabular-nums}
.ccs-m small{font-size:12px;color:#94a3b8}
.ccs-price{display:flex;flex-direction:column;gap:6px}
.ccs-price-top{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
.ccs-price-lbl{font-size:13px;color:#1e40af}
.ccs-price-tags{display:flex;gap:6px;align-items:center}
.ccs-price-main{font-size:30px;line-height:1.1;font-weight:700;color:#0f172a;font-variant-numeric:tabular-nums;letter-spacing:-.02em;margin:2px 0 4px}
.ccs-range-bar{position:relative;height:6px;border-radius:16px;background:#dbeafe;margin-top:4px}
.ccs-range-bar i{position:absolute;top:50%;width:14px;height:14px;border-radius:16px;background:#1d4ed8;border:2px solid #ffffff;box-shadow:0 0 0 1px #1d4ed8;transform:translate(-50%,-50%)}
.ccs-range-lbl{display:flex;justify-content:space-between;font-size:12px;color:#64748b;margin-top:8px}
.ccs-range-lbl b{color:#0f172a;font-weight:600;font-variant-numeric:tabular-nums}
.ccs-why{margin-top:10px;display:flex;flex-direction:column;gap:8px}
.ccs-why-t{font-size:13px;color:#1e40af}
.ccs-factors{display:flex;flex-wrap:wrap;gap:6px}
.ccs-factor{display:inline-flex;align-items:center;gap:6px;border:1px solid #dbeafe;border-radius:16px;padding:3px 10px;font-size:12px;color:#1e40af}
.ccs-factor b{color:#0f172a;font-weight:600;font-variant-numeric:tabular-nums}
.ccs-factor small{color:#64748b}
.ccs-warnbox{display:grid;gap:4px;border-color:#fde68a;background:#fffbeb;color:#9a3412}
.ccs-warnbox b{color:#9a3412}
.ccs-cmp{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px 16px}
.ccs-cmp span{display:block;font-size:12px;color:#64748b}
.ccs-cmp b{font-size:14px;font-weight:600;color:#0f172a;font-variant-numeric:tabular-nums}
.ccs-cmp .is-up b{color:#c2410c}
.ccs-cmp .is-down b{color:#166534}
.ccs-how summary{cursor:pointer;font-size:13px;font-weight:600;color:#0f172a;display:flex;gap:8px;align-items:center;list-style:none}
.ccs-how summary::-webkit-details-marker{display:none}
.ccs-how summary::before{content:'›';font-size:16px;line-height:1;display:inline-block;color:#64748b;transition:transform .15s}
.ccs-how[open] summary::before{transform:rotate(90deg)}
.ccs-how-b{margin-top:10px}
.ccs-cfg-h{margin-top:12px;font-size:12px;font-weight:600;color:#1e40af}
.ccs-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px 14px;margin-top:8px}
.ccs-tw{overflow-x:auto}
.ccs-tbl{width:100%;border-collapse:collapse;font-size:13px;margin-top:6px}
.ccs-tbl th{font-size:12px;color:#64748b;font-weight:500;text-align:left;padding:6px 8px;border-bottom:1px solid #dbeafe}
.ccs-tbl td{padding:7px 8px;border-bottom:1px solid #f1f5f9;color:#0f172a}
.ccs-tbl td small{display:block;font-size:12px;color:#64748b}
.ccs-tbl .r{text-align:right;font-variant-numeric:tabular-nums}
.ccs-foot{flex:none;display:flex;gap:8px;align-items:center;justify-content:flex-end;flex-wrap:wrap;padding:12px 24px;border-top:1px solid #dbeafe;background:#ffffff}
.ccs-foot .ccs-grow{margin-right:auto}
.ccs-foot .ds-btn{min-width:84px;justify-content:center}
.ccs-warn{flex-basis:100%;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:9px 12px;border-radius:8px;background:#fffbeb;border:1px solid #fde68a;color:#9a3412;font-size:13px}
.ccs-msg{flex-basis:100%;font-size:12px;color:#b91c1c}
@media (max-width:700px){.ccs-cards,.ccs-grid,.ccs-row2,.ccs-row4,.ccs-grid3,.ccs-lk-grid,.ccs-metrics,.ccs-cmp,.ccs-hist{grid-template-columns:1fr!important}.ccs-head,.ccs-body{padding-left:16px!important;padding-right:16px!important}.ccs-foot{padding:12px 16px}.ccs-st-l{font-size:12px}.ccs-price-main{font-size:30px}}
</style>`;
function ccsSheetHTML(){
  const s=S.ccs, f=s.f, ctx=s.ctx;
  const R=ccsCalc(ctx.cid,f), c=R.c, cfg=R.cfg;
  const p=ctx.pid?planOf(ctx.pid):null;
  const st=ccsStateOf(p,ctx.cid);
  const isPlan=ctx.type==='plan';
  const step=s.step||1, maxStep=Math.max(s.maxStep||1,step);
  const bad=CCS_NUM.some(k=>String(f[k]??'').trim()!==''&&Number(f[k])<0);
  const can=R.rec!=null&&!bad;
  const D=CCS_DELIV[f.deliv]||CCS_DELIV.reel;
  const eng=ccsEng(c);
  const SAMPLE='<span class="ccs-tag">Sample data</span>';
  const STEPS=[[1,'Deliverable'],[2,'Benchmarks'],[3,'Recommended price']];
  const unit=`${D.unit}${R.units>1?'s':''}`;
  const pct=((step-1)/2)*100;

  /* fixed header: title, creator row, stepper */
  const stepper=`<nav class="ccs-stepper" aria-label="Costing steps"><span class="ccs-stepper-line" aria-hidden="true"><i style="width:${pct}%"></i></span>${STEPS.map(([n,l])=>{const k=n<step?'done':n===step?'active':'todo';return `<button type="button" class="ccs-st is-${k}" ${n>maxStep?'disabled':''} aria-current="${n===step?'step':'false'}" aria-label="Step ${n}: ${l}${k==='done'?' (completed)':''}" onclick="ccsStep(${n})"><span class="ccs-st-c">${k==='done'?'✓':n}</span><span class="ccs-st-l">${l}</span></button>`;}).join('')}</nav>`;
  const head=`<header class="ccs-head">
    <div class="ccs-head-row"><h2 id="ccsTitle">Creator Costing</h2><button type="button" class="ccs-x" aria-label="Close" title="Close" onclick="ccsClose()">${icon('x','ico-sm')}</button></div>
    <div class="ccs-creator">${dsAv(c.id,c.name)}<div class="ccs-creator-txt"><b>${esc(c.name)}</b><small>${esc(c.handle)} · ${esc(c.tier)}${isPlan?` · ${esc(p.name)}`:''}</small></div></div>
    ${stepper}
  </header>`;

  /* step 1: deliverable */
  const cards=Object.entries(CCS_DELIV).map(([k,d])=>`<button type="button" class="ccs-card${f.deliv===k?' is-on':''}" aria-pressed="${f.deliv===k}" onclick="ccsSet('deliv','${k}')"><span class="ccs-card-ico">${icon(d.icon,'ico-sm')}</span><span class="ccs-card-t"><b>${d.l}</b><small>${d.help}</small></span></button>`).join('');
  const numF=(lbl,key,min)=>`<label class="ccs-f">${lbl}<input type="number" min="${min}" step="1" value="${esc(f[key])}" onchange="ccsSet('${key}',this.value)"></label>`;
  const prodF=`<label class="ccs-f">Production uplift <em>optional</em><span class="ccs-in"><input type="number" min="0" step="5" value="${esc(f.prod)}" onchange="ccsSet('prod',this.value)"><i>%</i></span></label>`;
  let inputs='';
  if(f.deliv==='reel') inputs=`${numF('Number of reels','units',1)}
    <div class="ccs-f">Duration<div class="ccs-toggle" role="group" aria-label="Duration"><button type="button" aria-pressed="${!f.long}" onclick="ccsSet('long',false)">Up to 30s</button><button type="button" aria-pressed="${!!f.long}" onclick="ccsSet('long',true)">Over 30s · ×${cfg.long}</button></div></div>
    <div class="ccs-span">${prodF}</div>`;
  else if(f.deliv==='story') inputs=`${numF('Number of frames','units',1)}
    <label class="ccs-f">Sequence <em>optional</em><input type="text" value="${esc(f.seq)}" placeholder="e.g. 3-frame link sequence" onchange="ccsSet('seq',this.value)"></label>
    <div class="ccs-span">${prodF}</div>`;
  else inputs=`${numF('Number of ads','units',1)}
    <label class="ccs-f">Ad format<select onchange="ccsSet('format',this.value)">${['Single image','Video','Carousel','Story ad'].map(o=>`<option ${f.format===o?'selected':''}>${o}</option>`).join('')}</select></label>
    ${numF('Usage duration (months)','months',1)}
    <label class="ccs-chk"><input type="checkbox" ${f.amp?'checked':''} onchange="ccsSet('amp',this.checked)"> Paid amplification <em>×${cfg.amp}</em></label>
    <div class="ccs-span">${prodF}</div>`;
  const stepDeliv=`<section class="ccs-panel"><div class="ccs-sec-h"><h3>Deliverable</h3></div><div class="ccs-cards" role="group" aria-label="Deliverable type">${cards}</div><div class="ccs-grid">${inputs}</div></section>`;

  /* step 2: benchmarks */
  const hist=R.histRec
    ?`<div class="ccs-hist"><div><span>Agreed rate</span><b>${rupees(R.histRec)}</b></div><div><span>Deliverable</span><b>Reel</b></div><div><span>Collaborations</span><b>${c.collabs??0}</b></div></div>`
    :`<div class="ccs-empty">No agreed rate on record for this creator.</div>`;
  const histManual=`<div class="ccs-row2"><label class="ccs-f">Manual rate (₹) <em>assumption</em><input type="number" min="0" step="100" value="${esc(f.histManual)}" placeholder="${R.histRec?rupees(R.histRec):'Enter rate'}" onchange="ccsSet('histManual',this.value)"></label><label class="ccs-chk"><input type="checkbox" ${f.useHist?'checked':''} onchange="ccsSet('useHist',this.checked)"> Use historical rate</label></div>`;
  const LK_SHOW=4, allLk=!!S.ccsAllLooks;
  const lkList=allLk?R.looks:R.looks.slice(0,LK_SHOW);
  const lkCards=lkList.map(l=>{const on=R.selIds.includes(l.c.id), has=l.m.cost>0;
    return `<button type="button" role="checkbox" aria-checked="${on}" class="ccs-lk${on?' is-on':''}" onclick="ccsLook('${l.c.id}',${!on})">
      <span class="ccs-lk-top">${dsAv(l.c.id,l.c.name)}<span class="ccs-lk-id"><b>${esc(l.c.name)}</b><small>${esc(l.c.handle)}</small></span><span class="ccs-check" aria-hidden="true">${on?'✓':''}</span></span>
      <span class="ccs-lk-meta"><span>${esc(l.c.tier)}</span><span>${fmt(l.c.followers)} followers</span></span>
      <span class="ccs-lk-stats"><span><b>${fmt(l.c.views)}</b><small>Avg views</small></span><span><b>${ccsEng(l.c).toFixed(1)}%</b><small>Engagement</small></span></span>
      <span class="ccs-lk-rate${has?' has':''}">${has?`${rupees(l.m.cost)} <small>agreed rate</small>`:'No agreed rate'}</span></button>`;}).join('');
  const lkSel=R.selIds.filter(id=>R.looks.some(l=>l.c.id===id)).length;
  const lkBlock=R.looks.length
    ?`<div class="ccs-sec-h"><h3>Lookalike creators</h3><span class="ccs-count">${lkSel} of ${R.looks.length} selected</span></div>
      <div class="ccs-lk-grid">${lkCards}</div>
      ${R.looks.length>LK_SHOW?`<button type="button" class="ccs-link" onclick="S.ccsAllLooks=!S.ccsAllLooks;ccsPaint()">${allLk?'Show fewer':`View all ${R.looks.length} recommendations`}</button>`:''}`
    :`<div class="ccs-sec-h"><h3>Lookalike creators</h3></div><div class="ccs-empty">No lookalikes match this tier, category or follower range.</div>`;
  const tile=(l,v,n)=>`<div class="ccs-m"><span>${l}</span><b>${v}</b><small>${n}</small></div>`;
  const metrics=`<div class="ccs-metrics">${tile('Avg views',fmt(c.views),'Creator record')}${tile('Engagement',eng.toFixed(1)+'%','Creator record')}${tile('CPV',R.cpv?'₹'+R.cpv.toFixed(2):'—',ccsN(f.cpv)?'Manual':R.lookCpv?'Lookalike median':'Not available')}${tile('CPC',ccsN(f.cpc)?'₹'+ccsN(f.cpc).toFixed(2):'—',ccsN(f.cpc)?'Manual':'Not available')}</div>`;
  const benchManual=`<div class="ccs-row4"><label class="ccs-f">Expected views<input type="number" min="0" step="100" value="${esc(f.views)}" placeholder="${fmt(c.views)}" onchange="ccsSet('views',this.value)"></label><label class="ccs-f">CPV (₹)<input type="number" min="0" step="0.01" value="${esc(f.cpv)}" placeholder="${R.lookCpv?R.lookCpv.toFixed(2):'—'}" onchange="ccsSet('cpv',this.value)"></label><label class="ccs-f">CPC (₹)<input type="number" min="0" step="0.01" value="${esc(f.cpc)}" placeholder="—" onchange="ccsSet('cpc',this.value)"></label><label class="ccs-f">Expected clicks<input type="number" min="0" step="100" value="${esc(f.clicks)}" placeholder="—" onchange="ccsSet('clicks',this.value)"></label></div>`;
  const stepBench=`<section class="ccs-panel"><div class="ccs-sec-h"><h3>Historical agreed rate</h3>${SAMPLE}</div>${hist}${histManual}</section>
    <section class="ccs-panel">${lkBlock}</section>
    <section class="ccs-panel"><div class="ccs-sec-h"><h3>Performance benchmarks</h3></div>${metrics}<p class="ccs-hint">Blank fields use the creator's averages. Manual values are assumptions.</p>${benchManual}</section>`;

  /* step 3: recommended price */
  const confKind=R.conf==='High'?'success':R.conf==='Medium'?'info':'warn';
  let rec;
  if(R.rec!=null){
    const span=Math.max(1,R.high-R.low), pos=Math.min(100,Math.max(0,(R.rec-R.low)/span*100));
    const factors=R.meth.map(x=>`<span class="ccs-factor"><b>${rupees(x.v)}</b>${esc(x.l)}<small>${Math.round(x.share*100)}%</small></span>`).join('');
    rec=`<div class="ccs-price">
      <div class="ccs-price-top"><span class="ccs-price-lbl">Suggested price · ${R.units} ${unit}</span><span class="ccs-price-tags">${SAMPLE}${dsBadge(R.conf+' confidence',confKind)}</span></div>
      <div class="ccs-price-main">${rupees(R.rec)}</div>
      <div class="ccs-range" aria-label="Recommended range ${rupees(R.low)} to ${rupees(R.high)}"><div class="ccs-range-bar"><i style="left:${pos}%"></i></div><div class="ccs-range-lbl"><span>Low <b>${rupees(R.low)}</b></span><span>High <b>${rupees(R.high)}</b></span></div></div>
      <div class="ccs-why"><span class="ccs-why-t">Based on ${R.histUsed?'1 agreed rate':'no agreed rate'}, ${R.selRates.length} comparable${R.selRates.length===1?'':'s'} and ${R.cpv?'a CPV benchmark':'no CPV benchmark'}.</span>${factors?`<div class="ccs-factors">${factors}</div>`:''}</div>
    </div>`;
  } else {
    rec=`<div class="ccs-empty ccs-warnbox"><b>Not enough data for a reliable price.</b><span>Missing: ${esc(R.missing.join(', '))}. Go back and add a manual rate or select lookalikes with agreed rates.</span></div>`;
  }
  let cmp='';
  const refAmt=st.agreedRef??((st.state==='entered'||st.state==='agreed')?st.amount:null);
  if(R.rec!=null&&refAmt){
    const diff=R.rec-refAmt, pctD=refAmt?Math.round(diff/refAmt*100):0;
    const refLbl=st.agreedRef!=null?'Agreed rate':'Entered cost';
    cmp=`<section class="ccs-panel"><div class="ccs-cmp" id="ccsCmp"><div><span>${refLbl}</span><b>${rupees(refAmt)}</b></div><div><span>Suggested</span><b>${rupees(R.rec)}</b></div><div class="${diff>0?'is-up':diff<0?'is-down':''}"><span>Difference</span><b>${diff===0?'Same':(diff>0?'▲ ':'▼ ')+rupees(Math.abs(diff))+' ('+(pctD>0?'+':'')+pctD+'%)'}</b></div></div>
      <p class="ccs-hint">${st.agreedRef!=null?'The agreed rate stays unless you confirm a replacement for this campaign.':'Compared with the cost already entered for this campaign.'}</p></section>`;
  } else if(isPlan&&step===3) cmp=`<div id="ccsCmp"></div>`;
  const cfgIn=(lbl,path,v,stp)=>`<label class="ccs-f">${lbl}<input type="number" min="0" step="${stp}" value="${v}" onchange="ccsCfgSet('${path}',this.value)"></label>`;
  const breakdown=R.meth.length?`<div class="ccs-tw"><table class="ccs-tbl"><thead><tr><th>Method</th><th class="r">Value</th><th class="r">Weight</th></tr></thead><tbody>${R.meth.map(x=>`<tr><td>${esc(x.l)}<small>${esc(x.src)}</small></td><td class="r">${rupees(x.v)}</td><td class="r">${Math.round(x.share*100)}%</td></tr>`).join('')}</tbody></table></div>`:'';
  const how=`<section class="ccs-panel"><details class="ccs-how" ${S.ccsMeth?'open':''} ontoggle="S.ccsMeth=this.open"><summary>How was this calculated? ${SAMPLE}</summary>
    <div class="ccs-how-b">
      <p class="ccs-hint">The suggested price is the weighted average of the methods below, kept inside the low–high range. Weights are rescaled when a method has no data.</p>
      ${breakdown}
      <p class="ccs-hint">Multiplier ${R.mult.toFixed(2)}× for ${R.units} ${unit}${f.deliv==='ad'?` · ${esc(f.format)} ×${cfg.formats[f.format]??1} · ${R.usage} month${R.usage>1?'s':''}${f.amp?' · paid amplification':''}`:''}${R.missing.length?` · Not used: ${esc(R.missing.join(', '))}`:''}.</p>
      <div class="ccs-cfg-h">Configurable assumptions</div>
      <div class="ccs-grid3">
        ${cfgIn('Reel multiplier','reel',cfg.reel,0.05)}${cfgIn('Story multiplier (per frame)','story',cfg.story,0.05)}${cfgIn('Ad multiplier (base)','ad',cfg.ad,0.05)}
        ${cfgIn('Reel over 30s','long',cfg.long,0.05)}${cfgIn('Paid amplification','amp',cfg.amp,0.05)}${cfgIn('Per extra usage month','usage',cfg.usage,0.01)}
        ${['Single image','Video','Carousel','Story ad'].map(o=>cfgIn('Format: '+o,'formats.'+o,cfg.formats[o],0.05)).join('')}
        ${cfgIn('Weight, historical','w.hist',cfg.w.hist,0.05)}${cfgIn('Weight, lookalikes','w.look',cfg.w.look,0.05)}${cfgIn('Weight, CPV','w.cpv',cfg.w.cpv,0.05)}${cfgIn('Weight, CPC','w.cpc',cfg.w.cpc,0.05)}
      </div>
    </div></details></section>`;
  const stepPrice=`<section class="ccs-panel">${rec}</section>${cmp}${how}`;

  /* strips above the footer */
  const replaceStrip=s.replaceAsk&&isPlan&&R.rec!=null&&st.agreedRef!=null
    ?`<div class="ccs-warn" role="alert"><span>Replace the agreed rate of <b>${rupees(st.agreedRef)}</b> in this campaign with <b>${rupees(R.rec)}</b>? The creator record keeps the agreed rate.</span><span><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="ccsSave('keep')">Keep agreed rate</button> <button type="button" class="ds-btn ds-btn--primary ds-btn--sm" onclick="ccsSave('replace')">Replace for this campaign</button></span></div>`:'';
  const enteredAmt=isPlan?(((planOf(s.ctx.pid)||{}).costs)||{})[s.ctx.cid]:null;
  const enteredStrip=s.enteredAsk&&isPlan&&st.state==='entered'&&R.rec!=null&&enteredAmt!=null
    ?`<div class="ccs-warn" role="alert"><span>Replace the entered cost of <b>${rupees(enteredAmt)}</b> in this campaign with the estimate of <b>${rupees(R.rec)}</b>?</span><span><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="ccsSave('keep')">Keep entered cost</button> <button type="button" class="ds-btn ds-btn--primary ds-btn--sm" onclick="ccsSave('replace')">Replace with estimate</button></span></div>`:'';
  const confirm=s.confirm?`<div class="ccs-warn" role="alert"><span>You have unsaved changes.</span><span><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="ccsKeep()">Keep editing</button> <button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="ccsDiscard()">Discard changes</button></span></div>`:'';
  const resetStrip=s.resetAsk?`<div class="ccs-warn" role="alert"><span>Reset all inputs on this step? Entered values will be cleared.</span><span><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="ccsResetCancel()">Keep values</button> <button type="button" class="ds-btn ds-btn--primary ds-btn--sm" onclick="ccsReset()">Reset</button></span></div>`:'';
  const msg=s.err?`<div class="ccs-msg" role="alert">${esc(s.err)}</div>`:'';

  /* footer: contextual per step, fixed */
  const back=step>1?`<button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="ccsBack()">Back</button>`:'';
  const cancel=`<button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="ccsClose()">Cancel</button>`;
  let actions;
  if(step===1) actions=`<button type="button" class="ds-btn ds-btn--outline ds-btn--sm ccs-grow" onclick="ccsResetAsk()">Reset</button>${cancel}<button type="button" class="ds-btn ds-btn--primary ds-btn--sm" onclick="ccsNext()">Next</button>`;
  else if(step===2) actions=`${back}<span class="ccs-grow"></span>${cancel}<button type="button" class="ds-btn ds-btn--primary ds-btn--sm" onclick="ccsNext()">Next</button>`;
  else actions=`${back}<span class="ccs-grow"></span>${cancel}<button type="button" class="ds-btn ds-btn--primary ds-btn--sm" ${can?'':'disabled'} onclick="ccsSave()">Save estimate</button>`;
  const foot=`<footer class="ccs-foot">${confirm}${resetStrip}${replaceStrip}${enteredStrip}${msg}${actions}</footer>`;

  return `${CCS_CSS}${head}
<div class="ds-drawer-body ccs-body"><div class="ccs-wrap">${step===1?stepDeliv:step===2?stepBench:stepPrice}</div></div>
${foot}`;
}
/* Stepper: any completed or current step is reachable; later steps stay disabled until reached through Next */
function ccsStep(n){
  if(!S.ccs) return;
  const maxStep=Math.max(S.ccs.maxStep||1,S.ccs.step||1);
  if(n<1||n>maxStep) return;
  const b=document.querySelector('#ccsBack .ds-drawer-body'); if(b) b.scrollTop=0;
  S.ccs.step=n; S.ccs.confirm=false; S.ccs.resetAsk=false; S.ccs.err=null; ccsPaint();
}
/* Next validates the current step before moving on */
function ccsNext(){
  const s=S.ccs; if(!s) return;
  const f=s.f, step=s.step||1;
  if(step===1){
    if(!(ccsN(f.units)>=1)) { s.err='Enter at least 1 '+(CCS_DELIV[f.deliv]||CCS_DELIV.reel).unit+' to continue.'; ccsPaint(); return; }
    if(f.deliv==='ad'&&!(ccsN(f.months)>=1)) { s.err='Usage duration needs at least 1 month.'; ccsPaint(); return; }
  }
  if(CCS_NUM.some(k=>String(f[k]??'').trim()!==''&&Number(f[k])<0)){ s.err='Values cannot be negative.'; ccsPaint(); return; }
  s.maxStep=Math.max(s.maxStep||1,step+1);
  ccsStep(step+1);
}
function ccsBack(){ if(!S.ccs) return; ccsStep((S.ccs.step||1)-1); }
/* Reset asks first when the step holds entered values */
function ccsResetAsk(){
  const s=S.ccs; if(!s) return;
  const touched=JSON.stringify(s.f)!==JSON.stringify({...ccsDef(),looks:null});
  if(touched){ s.resetAsk=true; ccsPaint(); } else ccsReset();
}
function ccsResetCancel(){ if(S.ccs){ S.ccs.resetAsk=false; ccsPaint(); } }
function planOutcomeHTML(p){
  const ids=[...new Set(p.creators||[])];
  const cs=ids.map(crOf).filter(Boolean);
  const shIds=new Set((p.shortlisted||[]).filter(id=>ids.includes(id)));
  const sh=oeAgg(p,cs.filter(c=>shIds.has(c.id))), co=oeAgg(p,cs.filter(c=>!shIds.has(c.id))), all=oeAgg(p,cs);
  const budget=p.budget||0, over=budget>0&&all.cost>budget, gap=all.cost-budget;
  const pct=budget?Math.round(all.cost/budget*100):0;
  const dur=(p.start&&p.end)?Math.max(1,Math.round((new Date(p.end)-new Date(p.start))/86400000)):null;
  const pctShare=v=>all.views?(v/all.views*100):0;
  const cityMap={};
  cs.forEach(c=>{ const k=mx(c).state||'Location not set'; cityMap[k]=cityMap[k]||{views:0,n:0}; cityMap[k].views+=c.views||0; cityMap[k].n++; });
  const cityRows=Object.entries(cityMap).sort((a,b)=>b[1].views-a[1].views);
  const cityMax=Math.max(1,...cityRows.map(x=>x[1].views));
  const insights=[];
  if(sh.n&&co.n){
    if(co.views>sh.views) insights.push(`Considering creators add more expected views (${fmt(co.views)} vs ${fmt(sh.views)} for shortlisted).`);
    if(co.er&&sh.er&&Math.abs(co.er-sh.er)>=0.1) insights.push(`Considering creators have ${co.er<sh.er?'lower':'higher'} average engagement (${co.er.toFixed(1)}% vs ${sh.er.toFixed(1)}%).`);
    if(sh.auth!=null&&co.auth!=null&&sh.auth!==co.auth) insights.push(`${sh.auth>co.auth?'Shortlisted':'Considering'} creators have higher average authenticity (${Math.max(sh.auth,co.auth)} vs ${Math.min(sh.auth,co.auth)}).`);
  }
  if(all.hist>0&&all.n) insights.push(`${all.hist} of ${all.n} creator${all.n===1?'':'s'} ${all.hist===1?'is':'are'} costed at historical rate. Planned costs are not set for ${all.hist===1?'this creator':'these creators'}.`);
  if(all.noHist>0) insights.push(`${all.noHist} creator${all.noHist===1?' has':'s have'} no view history, so expected views may be incomplete.`);
  const cmp=(key,better)=>{ const a=sh[key], b=co[key]; if(a==null||b==null||a===0&&b===0||a===b||!sh.n||!co.n) return ['',''];
    const aBetter=better==='high'?a>b:a<b; return aBetter?[' is-better',''] :['',' is-better']; };
  const cmpVal=(fmtFn,key,better)=>{ const [a,b]=cmp(key,better); return {s:`<span class="oe-cmpv${a}">${fmtFn(sh)}</span>`,c:`<span class="oe-cmpv${b}">${fmtFn(co)}</span>`}; };
  const cells=(label,tip,fmtFn,key,better)=>{ const v=cmpVal(fmtFn,key,better); return `<tr><th scope="row" class="oe-mk"><span title="${esc(tip)}">${label}</span></th><td class="ds-num">${v.s}</td><td class="ds-num">${v.c}</td><td class="ds-num">${fmtFn(all)}</td></tr>`; };
  const plain=(label,tip,fmtFn)=>`<tr><th scope="row" class="oe-mk"><span title="${esc(tip)}">${label}</span></th><td class="ds-num">${fmtFn(sh)}</td><td class="ds-num">${fmtFn(co)}</td><td class="ds-num">${fmtFn(all)}</td></tr>`;
  const cpvF=a=>a.views?'₹'+a.cpv.toFixed(2):'—', erF=a=>a.er?a.er.toFixed(1)+'%':'—', viewsF=a=>fmt(a.views), fitF=a=>a.n?a.fit+'/100':'—', authF=a=>a.auth==null?'—':a.auth+'/100', costF=a=>rupees(a.cost);
  const ratio=budget?Math.min(pct,100):0;
  return `<style>
.oe{display:flex;flex-direction:column;gap:20px}
.oe-banner{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:baseline;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;background:#eff6ff;font-size:13px;color:#1e40af}
.oe-banner b{color:#0f172a;font-weight:600}
.oe-sec-h{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:12px}
.oe-sec-h h3{margin:0;font-size:14px;font-weight:600;color:#0f172a}
.oe-sec-h span{font-size:12px;color:#1e40af}
.oe-sum{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:16px}
.oe-box{border:1px solid #e2e8f0;border-radius:12px;background:#ffffff;padding:16px}
.oe-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.oe-m{display:flex;flex-direction:column;gap:2px;min-width:0}
.oe-m small{font-size:12px;color:#1e40af}
.oe-m b{font-size:20px;font-weight:600;color:#0f172a;font-variant-numeric:tabular-nums}
.oe-m span{font-size:12px;color:#1e40af}
.oe-m b.is-pos{color:#15803d}
.oe-dates{display:flex;gap:6px;flex-wrap:wrap}
.oe-m input{font:inherit;font-size:13px;border:1px solid #cbd5e1;border-radius:8px;padding:4px 6px;color:#0f172a;background:#ffffff;max-width:100%}
.oe-ppc{display:flex;flex-direction:column;gap:4px;font-size:12px;color:#1e40af}
.oe-ppc input{width:72px}
.oe-budget{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}
.oe-row{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid #f1f5f9;font-size:13px}
.oe-row:last-child{border-bottom:0}
.oe-row span{color:#1e40af}
.oe-row b{font-weight:600;color:#0f172a;font-variant-numeric:tabular-nums;text-align:right}
.oe-row b.is-over{color:#b91c1c}
.oe-row b.is-ok{color:#15803d}
.oe-track{position:relative;height:10px;border-radius:16px;background:#f1f5f9;overflow:hidden;margin:6px 0 4px}
.oe-fill{height:100%;border-radius:16px;background:#1d4ed8}
.oe-fill.is-over{background:#b91c1c}
.oe-util{display:flex;justify-content:space-between;font-size:12px;color:#1e40af}
.oe-util b{font-variant-numeric:tabular-nums;color:#0f172a}
.oe-basis{display:flex;flex-direction:column;gap:6px;margin-top:12px;font-size:12px;color:#1e40af}
.oe-basis div{display:flex;justify-content:space-between;gap:8px}
.oe-warn{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:space-between;border:1px solid #fca5a5;background:#fef2f2;border-radius:8px;padding:12px 14px;font-size:13px;color:#7f1d1d}
.oe-warn b{font-weight:600}
.oe-warn .oe-acts{display:flex;flex-wrap:wrap;gap:8px}
.oe-city{display:grid;grid-template-columns:minmax(90px,140px) minmax(0,1fr) 120px;gap:12px;align-items:center;padding:7px 0;font-size:13px;border-bottom:1px solid #f1f5f9}
.oe-city:last-child{border-bottom:0}
.oe-city .oe-t{height:8px;border-radius:16px;background:#f1f5f9;overflow:hidden}
.oe-city .oe-t i{display:block;height:100%;background:#1d4ed8;border-radius:16px;min-width:6px}
.oe-city .oe-n{text-align:right;font-variant-numeric:tabular-nums;color:#0f172a;white-space:nowrap}
.oe-city .oe-n small{display:block;color:#1e40af;font-size:12px}
.oe-ins{margin:0;padding:0 0 0 18px;display:flex;flex-direction:column;gap:6px;font-size:13px;color:#0f172a}
.oe-cmp-wrap{overflow:auto;border:1px solid #e2e8f0;border-radius:12px}
.oe-cmp{width:100%;border-collapse:collapse;font-size:13px}
.oe-cmp th,.oe-cmp td{padding:11px 14px;border-bottom:1px solid #f1f5f9;text-align:left}
.oe-cmp thead th{background:#eff6ff;font-weight:500;color:#0f172a;white-space:nowrap}
.oe-cmp td.ds-num,.oe-cmp thead th.ds-num{text-align:right;font-variant-numeric:tabular-nums}
.oe-cmp .oe-mk{position:sticky;left:0;background:#ffffff;z-index:1;font-weight:500;color:#0f172a;min-width:180px}
.oe-cmp thead .oe-mk{background:#eff6ff;z-index:2}
.oe-cmp tbody tr:last-child th,.oe-cmp tbody tr:last-child td{border-bottom:0}
.oe-cmpv.is-better{color:#15803d;font-weight:600}
.oe-cmpv.is-better::after{content:' ▲';font-size:12px}
.oe-legend{font-size:12px;color:#1e40af;margin-top:8px}
@media (max-width:1100px){.oe-sum,.oe-budget{grid-template-columns:1fr}}
</style>
<div class="oe">
  <div class="oe-banner"><b>Expected · Draft plan</b><span>Simulated from the creators in this plan. Projections, not actual results.</span></div>
  <div class="oe-sum">
    <section class="oe-box"><div class="oe-sec-h"><h3>Plan overview</h3></div>
      <div class="oe-metrics">
        <div class="oe-m"><small>Creators</small><b>${all.n}</b><span>${sh.n} shortlisted · ${co.n} considering</span></div>
        <div class="oe-m"><small>Campaign dates</small><div class="oe-dates"><input type="date" aria-label="Start date" value="${esc(p.start||'')}" onchange="oeSetField('${p.id}','start',this.value)"><input type="date" aria-label="End date" value="${esc(p.end||'')}" onchange="oeSetField('${p.id}','end',this.value)"></div><span>${dur?`${dur} days`:'Set both dates to get the duration'}</span></div>
        <div class="oe-m"><small>Planned posts</small><b>${all.n*oePostsPer(p)}</b><label class="oe-ppc"><span>Posts per creator</span><input type="number" min="1" max="20" aria-label="Posts per creator" value="${oePostsPer(p)}" onchange="oeSetField('${p.id}','postsPer',this.value)"></label></div>
      </div></section>
    <section class="oe-box"><div class="oe-sec-h"><h3>Expected performance</h3><span>Projected, not actual</span></div>
      <div class="oe-metrics">
        <div class="oe-m"><small title="Sum of each creator's average views per post, times posts per creator">Expected views</small><b>${fmt(all.views)}</b><span>${oePostsPer(p)>1?`Sum of creator averages × ${oePostsPer(p)} posts`:'Sum of creator averages'}</span></div>
        <div class="oe-m"><small title="Total planned cost ÷ expected views">Expected CPV</small><b>${all.views?'₹'+all.cpv.toFixed(2):'—'}</b><span>Cost ÷ expected views</span></div>
        <div class="oe-m"><small title="Engagement rate weighted by each creator's expected views">Expected ER</small><b>${all.er?all.er.toFixed(1)+'%':'—'}</b><span>Weighted by views</span></div>
      </div></section>
  </div>
  <section class="oe-box">
    <div class="oe-sec-h"><h3>Budget</h3><span>Planned cost against the campaign budget</span></div>
    ${over?`<div class="oe-warn" role="alert"><span>Your planned campaign cost exceeds the available budget by <b>${rupees(gap)}</b>.</span><div class="oe-acts"><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="setPageState('pTab','overview')">Review creator costs</button><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="setPageState('pTab','brief')">Review planned deliverables</button></div></div><div style="height:14px"></div>`:''}
    <div class="oe-budget">
      <div>
        <div class="oe-row"><span>Budget</span><b>${rupees(budget)}</b></div>
        <div class="oe-row"><span>Planned cost</span><b>${rupees(all.cost)}</b></div>
        ${over?`<div class="oe-row"><span>Over budget</span><b class="is-over">${rupees(gap)}</b></div>`:`<div class="oe-row"><span>Headroom</span><b class="${budget?'is-ok':''}">${rupees(budget-all.cost)}</b></div>`}
        <div class="oe-row"><span>Creators with a cost</span><b>${all.manual} of ${all.n}</b></div>
      </div>
      <div>
        <div class="oe-util"><span>Budget utilization</span><b>${budget?pct+'%':'—'}</b></div>
        <div class="oe-track" aria-label="Budget utilization ${pct}%"><div class="oe-fill${over?' is-over':''}" style="width:${ratio}%"></div></div>
        <div class="oe-util"><span>0%</span><span>${over?'Over budget':'Within budget'}</span></div>
        <div class="oe-basis">
          <div><span>Planned cost (entered)</span><b>${all.manual} creator${all.manual===1?'':'s'}</b></div>
          <div><span>Historical rate (fallback)</span><b>${all.hist} creator${all.hist===1?'':'s'}</b></div>
          <div><span>Confirmed agreements</span><b>Not recorded yet</b></div>
        </div>
      </div>
    </div>
  </section>
  <div class="oe-budget">
    <section class="oe-box"><div class="oe-sec-h"><h3>By city</h3><span>Creator location distribution</span></div>
      ${cityRows.length?cityRows.map(([k,v])=>`<div class="oe-city" title="${esc(k)}: ${fmt(v.views)} expected views from ${v.n} creator${v.n===1?'':'s'} (${pctShare(v.views).toFixed(1)}%)"><span>${esc(k)}</span><div class="oe-t"><i style="width:${Math.max(2,v.views/cityMax*100).toFixed(1)}%"></i></div><div class="oe-n">${fmt(v.views)} · ${pctShare(v.views).toFixed(0)}%<small>${v.n} creator${v.n===1?'':'s'}</small></div></div>`).join(''):'<p class="ds-note">No creators in this plan yet.</p>'}
    </section>
    <section class="oe-box"><div class="oe-sec-h"><h3>Insights</h3><span>From this plan's data</span></div>
      ${insights.length?`<ul class="oe-ins">${insights.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:'<p class="ds-note">No notable differences in this plan yet.</p>'}
    </section>
  </div>
  <section class="oe-box">
    <div class="oe-sec-h"><h3>Compare lists</h3><span>Creators in both lists are counted once in Combined</span></div>
    <div class="oe-cmp-wrap"><table class="oe-cmp"><thead><tr><th class="oe-mk">Metric</th><th class="ds-num">Shortlisted</th><th class="ds-num">Considering</th><th class="ds-num">Combined</th></tr></thead><tbody>
      ${plain('Creators','Unique creators in the plan',a=>a.n)}
      ${plain('Planned cost','Sum of each creator’s planned or historical cost',costF)}
      ${cells('Expected views','Sum of creator average views',viewsF,'views','high')}
      ${cells('Expected CPV','Total cost ÷ expected views',cpvF,'cpv','low')}
      ${cells('Expected ER','Engagement weighted by expected views',erF,'er','high')}
      ${cells('Avg campaign fit','Average fit score of creators in the list',fitF,'fit','high')}
      ${cells('Avg authenticity','Average authenticity score of creators with data',authF,'auth','high')}
      ${plain('Costed by planned cost','Creators with a manually entered cost',a=>a.n?`${a.manual} of ${a.n}`:'—')}
      ${plain('Tier mix','Unique creators by tier',a=>a.tiers)}
    </tbody></table></div>
    <p class="oe-legend">▲ marks the stronger list where a higher or lower value is better. Cost and creator count are not ranked.</p>
  </section>
</div>`;
}
function plBulkRemove(){
  const n=(S.plSel||[]).length;
  dlg(`Remove ${n} creator${n===1?'':'s'}`,'They leave this list. They stay in My creators and in Discover.','',
    `<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--danger" onclick="plBulkRemoveDo()">Remove</button>`);
}
function plBulkRemoveDo(){
  const p=planOf(S.planId), ids=S.plSel||[];
  if(p){ p.creators=p.creators.filter(x=>!ids.includes(x)); p.shortlisted=p.shortlisted.filter(x=>!ids.includes(x)); }
  S.plSel=[]; closeLayer(); paintBody(); toast('Creators removed from the list · demo');
}
function plBulkStatus(){
  const n=(S.plSel||[]).length;
  dlg(`Change status for ${n} creator${n===1?'':'s'}`,'Shortlisted creators move on to a campaign. Considering keeps them under review.',
    `<label class="ds-field"><span>Set status to</span><select id="plBulkSt"><option>Considering</option><option>Shortlisted</option></select></label>`,
    `<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="plBulkStatusDo()">Apply</button>`);
}
function plBulkStatusDo(){
  const v=dlgVal('plBulkSt'), p=planOf(S.planId), ids=S.plSel||[];
  if(p){ p.shortlisted=p.shortlisted.filter(x=>!ids.includes(x)); if(v==='Shortlisted') ids.forEach(x=>{ if(!p.shortlisted.includes(x)) p.shortlisted.push(x); }); }
  closeLayer(); paintBody(); toast(`${ids.length} creator${ids.length===1?'':'s'} set to ${v} · demo`);
}

function dsTabsFor(k,opts,val,right=''){ return `<div class="ds-tabrow"><div class="ds-tabs" role="tablist">${opts.map(([v,l])=>`<button type="button" role="tab" aria-selected="${val===v}" class="${val===v?'on':''}" onclick="setPageState('${k}','${v}')">${l}</button>`).join('')}</div>${right}</div>`; }
const dsBackSvg='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';

function setShortlist(pid,cid,v){ const p=planOf(pid); if(!p)return; if(v==='Shortlisted'&&!String(p.brief||'').trim()&&!String(p.objective||'').trim()) return toast('Add the campaign brief before shortlisting creators'); p.shortlisted=p.shortlisted.filter(x=>x!==cid); if(v==='Shortlisted') p.shortlisted.push(cid); paintBody(); toast('Campaign plan updated'); }

function postsForPeriod(c){ const r=rangeOf(S.cPeriod||'thisMonth',S.cCust); return r?c.posts.filter(p=>!p.date||(p.date>=r.from&&p.date<=r.to)):c.posts; }

const TRACK_ROWS=[['comments','Track comments','Classify post comments and sentiment.'],['engagement','Track engagement','Refresh likes, views and comments.'],['authenticity','Track authenticity','Review possible manipulation of post engagement patterns.'],['ads','Track ads','Associate boosted promotion with published creator content.']];
function trackPrefs(id){ const d={comments:true,engagement:true,authenticity:false,ads:false}; try{return Object.assign(d,JSON.parse(localStorage.getItem('creator_tracking_config_'+id))||{})}catch(e){return d} }
function openTrackingConfig(id){
  const c=CAMP_LIST.find(x=>x.id===id); if(!c) return;
  const prefs=trackPrefs(id);
  const body=`<p class="ds-caption">${esc(c.name)}</p><div class="ds-stack-list">${TRACK_ROWS.map(([k,t,d])=>`<label class="ds-row-line ds-track-row"><span><b>${t}</b><small class="ds-caption" style="display:block">${d}</small></span><input type="checkbox" data-tracking="${k}" ${prefs[k]?'checked':''}></label>`).join('')}</div>`;
  showModal('Campaign tracking configuration',body,'');
  document.querySelector('#layer .modal-foot').innerHTML=`<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="saveTrackingConfig('${id}')">Save settings</button>`;
}
function saveTrackingConfig(id){
  const prefs={}; document.querySelectorAll('#layer [data-tracking]').forEach(i=>prefs[i.dataset.tracking]=i.checked);
  try{ localStorage.setItem('creator_tracking_config_'+id,JSON.stringify(prefs)) }catch(e){}
  closeLayer(); toast('Tracking configuration saved');
}
const PL_COL={Post:'#be185d',Reel:'#1e40af',Carousel:'#c2410c',Static:'#16a34a',Video:'#6d28d9',Short:'#6d28d9'};
const PL_ARROW='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
/* ── Post details sheet: opened from the icon under each content name. Engagement, comment and audience figures are simulated, seeded per post. ── */
const PS_ICON='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8.5 14.5l3.5-3.5 3.5 3.5"/></svg>';
const PS_TABS=[['overview','Overview'],['engagement','Engagement'],['comments','Comments'],['audience','Audience']];
const PS_NOTES=['Love this shade, where did you get it?','Quick question, is this suitable for oily skin?','Link please','Looks so good on you','Does it layer well with vitamin C?','Need this in a bigger size','Honest review please'];
const PS_HANDLES=['@aurvi.k','@riya_styles','@neelu.daily','@cosmo.bee','@kiran.glow','@fitgirl_09','@soya.being','@devika.s'];
function psSim(p){
  const r=discRng(discSeedRepo('ps'+p.id)), v=Math.max(1,p.views||1);
  const likes=Math.round(v*(0.025+r()*0.02)), comments=Math.round(v*(0.001+r()*0.002));
  const pos=Math.round(40+r()*30), neg=Math.round(4+r()*8), neu=100-pos-neg;
  const ppl=PS_HANDLES.map((h,i)=>({h,n:Math.max(1,Math.round(comments*(0.18-i*0.018)/Math.max(1,PS_HANDLES.length/4)))+1}));
  const notes=PS_NOTES.map((t,i)=>({t,who:PS_HANDLES[(i+Math.floor(r()*3))%PS_HANDLES.length],tone:i%3===0?'Product inquiry':i%3===1?'Price inquiry':'Positive'}));
  return {likes,comments,pos,neu,neg,er:(likes+comments)/v*100,commentRate:comments/v*100,quality:Math.round(78+r()*22),ppl,notes};
}
function psFind(pid){
  for(const c of CAMP_LIST){ const p=c.posts.find(x=>x.id===pid)||linedOf(c).find(x=>x.id===pid); if(p) return {c,p}; }
  return null;
}
function psOpen(pid){
  const f=psFind(pid); if(!f) return toast('No details for this post yet');
  const {c,p}=f, cr=crOf(p.creator)||{name:p.creator,handle:''};
  S.psTab='overview'; S.psCmtF='All'; S.psCmtPg=1;
  openDrawer('Post details',`${esc(cr.name)} · ${esc(c.name)} · ${campDate(p.date)}`,
    `<div class="ps" data-pid="${esc(p.id)}"><aside class="ps-side">
       <div class="ps-media">${dsMediaVideo(p.id)}<span class="ps-fmt">${esc(p.format)}</span></div>
       <div class="ps-who">${dsPerson(cr)}</div>
       <p class="ps-cap">${esc(p.concept&&p.concept!=='Post'?p.concept:'Post')} · ${esc(p.product)}</p>
       <dl class="ps-list"><div><dt>Views</dt><dd>${exactN(p.views)}</dd></div><div><dt>Cost</dt><dd>${rupees(p.cost||0)}</dd></div><div><dt>CPV</dt><dd id="sheetCPV">${p.views?cpvOf(p.cost||0,p.views):'—'}</dd></div></dl>
       <label class="ps-costf"><span>Edit post cost (₹)</span><input id="sheetCost" type="number" min="0" step="100" value="${p.cost||0}" oninput="updateSheetCPV('${esc(p.id)}')"></label>
       <span class="ps-formula" id="sheetFormula">${rupees(p.cost||0)} ÷ ${exactN(p.views)} views</span>
       <button type="button" class="ds-btn ds-btn--outline ds-btn--sm ps-savecost" onclick="saveSheetCost('${esc(p.id)}')">Save cost</button>
     </aside>
     <section class="ps-main">
       <div class="ps-tabs" role="tablist">${PS_TABS.map(([k,l])=>`<button type="button" role="tab" class="ps-tab${k==='overview'?' on':''}" aria-selected="${k==='overview'}" onclick="psTab('${esc(p.id)}','${k}')">${l}</button>`).join('')}</div>
       <div class="ps-panel" id="psPanel">${psPanelHTML(p,'overview')}</div>
     </section></div>`,
    `<button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="openExternal('${esc(p.url||'https://instagram.com/')}')">${icon('external','ico-sm')}View post</button><button type="button" class="ds-btn ds-btn--outline ds-btn--sm ps-remove" onclick="openRemovePost('${esc(c.id)}','${esc(p.id)}')">Remove</button>`,'ps-drawer');
}
function psTab(pid,tab){
  const f=psFind(pid); if(!f) return;
  const p=f.p;
  const label=PS_TABS.find(t=>t[0]===tab)[1];
  document.querySelectorAll('.ps-tab').forEach(b=>{ const on=b.textContent.trim()===label; b.classList.toggle('on',on); b.setAttribute('aria-selected',on); });
  document.getElementById('psPanel').innerHTML=psPanelHTML(p,tab);
}
const PS_TOPICS=['Outfit Inspiration','Skincare Routine','Product Review','Tutorial','Haul','Day in the life'];
const PS_LANGS=['English','Hindi','Tamil','Bengali'];
const PS_TRIG=['Social Currency','Social Proof','Scarcity','Authority','Curiosity','Relatability'];
const PS_STYLE=['Other','Tutorial','Review','Storytelling','Testimonial','Unboxing'];
const PS_ARCH=['Direct Cta','Storytelling','Problem-Solution','Testimonial','Demonstration'];
const PS_GENDER=['Female','Male','Mixed'];
const PS_AGES=[['18-24','25-34'],['25-34','35-44'],['18-24'],['35-44','45-54']];
const PS_LINES=['Come on, come on, let\'s break down, get down, get to it.','Honestly, this is the one I reach for every single morning.','Use two drops, press gently, and you will see the glow in a week.','Link is in my bio, grab it before the sale ends.'];
function psStats(items){ return `<div class="ps-stats">${items.map(([l,v,n])=>`<div class="ps-stat"><span>${l}</span><b>${v}</b>${n?`<small>${n}</small>`:''}</div>`).join('')}</div>`; }
const psBanner=(tone,title,sub)=>sub?`<div class="ps-banner ps-banner--${tone}"><b>${title}</b><span>${sub}</span></div>`:`<div class="ps-banner ps-banner--${tone} ps-banner--line"><span>${title}</span></div>`;
function psEngagementHTML(p,cr,sm){
  const r=discRng(discSeedRepo('eng'+p.id)), pick=a=>a[Math.floor(r()*a.length)];
  const m=campPostMetrics(p);
  const views=p.views||0, fol=cr.followers||0, isVideo=/reel|video/i.test(p.format||'');
  const likeRate=views?m.likes/views*100:0, commentRate=views?m.comments/views*100:0;
  const reach=isVideo&&fol&&views?(views/fol*100).toFixed(1)+'%':'—';
  const burst=pick(['No','No','Yes']), rapid=pick(['0 acct','1 acct','2 accts']), replyPct=(r()*1.2).toFixed(1)+'%', emoji=(r()*2).toFixed(1)+'%', branded=pick(['No','No','Yes']), hidden=pick(['No','No','Yes']);
  const simT=simTag();
  const healthy=sm.er>=3;
  const reading=psSec('Reading','pulse','neutral',
    psBanner(healthy?'ok':'warn',healthy?'This post reads healthy':'This post reads average',`${sm.quality}/100 comment quality · ${sm.commentRate.toFixed(2)}% comment rate`)+
    psStats([['Views',exactN(views),'Reported by Instagram'],['Likes',exactN(m.likes),''],['Comments',exactN(m.comments),''],['Engagement rate',m.er.toFixed(1)+'%','Likes and comments over views'],['Comment quality',String(sm.quality),'0–100, higher is better']]),simT);
  const engagement=psSec('Engagement','zap','neutral',
    psStats([['Like rate',likeRate.toFixed(2)+'%','Likes over views. Caution under 1%, reject under 0.5%'],['Reach rate',reach,'Views over followers, video posts only'],['Comment rate',commentRate.toFixed(2)+'%','Comments over views'],['Save rate','—','Saves not reported'],['Share rate','—','Shares not reported'],['Branded',branded,''],['Likes hidden',hidden,'']]));
  const anomaly=burst==='Yes'
    ?psSec('Anomaly check','shield','neutral',psBanner('warn','Anomaly flagged','A burst of comments arrived in one hour. Review the comments tab before relying on this post.'))
    :psSec('Anomaly check','shield','neutral',psBanner('ok','No anomalies detected','Views against engagement, likes against comments and saves, and a zero-engagement check all passed.'));
  const forensics=psSec('Comment forensics','chat','neutral',
    psStats([['Quality',sm.quality+'/100',''],['Burst',burst,''],['Rapid fire',rapid,''],['Creator reply',replyPct,''],['Emoji-only',emoji,''],['Analysed',exactN(sm.comments),'']])+
    `<div class="ps-cta"><span>Read from <b>${exactN(sm.comments)}</b> comments. See them, with each commenter's profile.</span><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="psTab('${esc(p.id)}','comments')">View comments</button></div>`);
  const audience=psSec('Audience','people','neutral',
    `<p class="ps-desc"><em>Not enriched: ${sm.ppl.length} commenters shown, 0 with a profile.</em></p><p class="ps-desc mute">Audience data will be available once commenter profiles are fetched. The Comments tab shows the same gap per row.</p>`);
  return [reading,engagement,anomaly,forensics,audience].join('');
}
const PS_CMT_TXT=['Kurti','Kurti','Link please','Where is this from?','Love this look','What is the price?','Size available?','Need this in blue','Honest review please','So pretty!','Is it washable?','Lovely colours'];
function psCommentsData(p,n){
  const r=discRng(discSeedRepo('cmt'+p.id)), pick=a=>a[Math.floor(r()*a.length)];
  const out=[];
  for(let i=0;i<n;i++){
    const t=pick(PS_CMT_TXT);
    const sent=/price|link|size|where|available/i.test(t)?(/price/i.test(t)?'Price Inquiry':'Product Inquiry'):/love|pretty|lovely/i.test(t)?'Positive':(r()<0.7?'Product Inquiry':'Neutral');
    const h=pick(PS_HANDLES).replace(/^@/,'')+(r()<0.4?String(Math.floor(r()*999)):'');
    out.push({h:'@'+h,t,sent,d:new Date(new Date(p.date).getTime()-Math.floor(r()*20)*864e5-Math.floor(r()*86400)*1e3*60)});
  }
  return out;
}
function psCommentsHTML(p,cr,sm,f,pg){
  const all=psCommentsData(p,sm.comments);
  const cnt=k=>all.filter(x=>x.sent===k).length;
  const total=all.length, pos=cnt('Positive'), neu=cnt('Neutral'), pInq=cnt('Product Inquiry'), prInq=cnt('Price Inquiry');
  const inq=pInq+prInq;
  const pct=x=>total?Math.round(x/total*100):0;
  const r=discRng(discSeedRepo('cmtx'+p.id)), pick=a=>a[Math.floor(r()*a.length)];
  const auth=85+Math.floor(r()*14), intent=Math.min(99,Math.round(pct(inq)*0.85));
  const rapid=pick(['0 accounts','1 account','2 accounts']), creatorRep=(r()*1.2).toFixed(1)+'%', emoji=(0.5+r()*2.5).toFixed(1)+'%';
  const filt=f==='All'?all:all.filter(x=>x.sent===f);
  const PER=50, pages=Math.max(1,Math.ceil(filt.length/PER)), cur=Math.min(pg,pages);
  const rows=filt.slice((cur-1)*PER,cur*PER);
  const tagCls=k=>k==='Positive'?'pos':k==='Price Inquiry'?'price':k==='Product Inquiry'?'inq':'neu';
  const pidA=esc(p.id);
  const fBtn=(k,label,n)=>`<button type="button" class="ps-fbtn${f===k?' on':''}" onclick="psCmt('${pidA}','${k}',1)">${label} <span>${n}</span></button>`;
  const donut=`<div class="ps-donut" style="background:conic-gradient(#3b82f6 0 ${pct(inq)}%,#94a3b8 ${pct(inq)}% ${pct(inq)+pct(neu)}%,#22c55e ${pct(inq)+pct(neu)}% 100%)"><div class="ps-donut-c"><b>${pct(inq)}%</b><span>inquiry</span></div></div>`;
  const legend=(c,l,v)=>`<div class="ps-leg"><i style="background:${c}"></i><span>${l}</span><b>${v}%</b></div>`;
  const pager=`<div class="ps-pager"><span>Showing ${total?(cur-1)*PER+1:0}-${Math.min(cur*PER,filt.length)} of ${filt.length}</span><div>${Array.from({length:Math.min(pages,5)},(_,i)=>i+1).map(n=>`<button type="button" class="ps-pg${n===cur?' on':''}" onclick="psCmt('${pidA}','${f}',${n})">${n}</button>`).join('')}</div></div>`;
  const table=`<div class="ps-cmt-wrap"><table class="ps-cmt"><thead><tr><th>Commenter</th><th>Comment</th><th>Sentiment</th><th>When</th></tr></thead><tbody>${rows.map(x=>`<tr><td><div class="ps-cmt-who"><i>${esc(x.h.slice(1,3).toUpperCase())}</i><span>${esc(x.h)}<small class="ps-unav">Profile unavailable</small></span></div></td><td>${esc(x.t)}</td><td><span class="sent-na-inline" title="${SENT_NA_TIP}">Not yet available</span></td><td class="mute">${campDate(x.d.toISOString().slice(0,10))}</td></tr>`).join('')}</tbody></table></div>${pager}`;
  return [
    psSec('Comment analysis','chat','neutral',`<div class="ps-qrow"><div><span>Comment quality score</span><b>${sm.quality}<small>/100</small></b></div><span class="ps-tag ps-tag--pos">Authentic</span></div><div class="ps-bar"><i style="width:${sm.quality}%"></i></div>${psStats([['Comment authenticity',auth+'/100','are the commenters real'],['Buying intent',intent+'/100','purchase interest']])}`,`<span class="ps-sim">${exactN(total)} comments analysed</span>`),
    psSec("What's in the comments",'zap','neutral',psStats([['Rapid-fire',rapid,''],['Creator replies',creatorRep,''],['Emoji-only',emoji,'shallow, not bad']])),
    psSec('Sentiment distribution','split','neutral',`${sentNAHTML(' sent-na--wide')}`),
    psSec('How they were posted','shield','neutral',psBanner('warn',`${rapid.replace('s','')} commented repeatedly in quick succession`,'')),
    psSec('The comments themselves','chat','neutral',`<p class="ps-desc mute">Analysed newest first. Sentiment is the backend's classification, marked unknown where it did not classify.</p><div class="ps-fbar">${fBtn('All','All',total)}<button type="button" class="ps-fbtn" disabled title="${SENT_NA_TIP}">Positive <span>—</span></button><button type="button" class="ps-fbtn" disabled title="${SENT_NA_TIP}">Neutral <span>—</span></button>${fBtn('Product Inquiry','Product Inquiry',pInq)}${fBtn('Price Inquiry','Price Inquiry',prInq)}</div>${table}`)
  ].join('');
}
function psAudienceHTML(p,cr,sm){
  const all=psCommentsData(p,sm.comments);
  const byH={}; all.forEach(x=>{ byH[x.h]=(byH[x.h]||0)+1; });
  const accts=Object.entries(byH).sort((x,y)=>y[1]-x[1]||x[0].localeCompare(y[0]));
  const shown=accts.slice(0,50);
  const nd='<span class="ps-nr">Not returned yet</span>';
  const rows=shown.map(([h,n])=>`<tr><td><div class="ps-cmt-who"><i>${esc(h.slice(1,3).toUpperCase())}</i><span>${esc(h)}</span></div></td><td>${nd}</td><td class="mute">Not enriched</td><td class="mute">—</td><td>${nd}</td><td class="num">${n}</td><td><span class="ps-tag ps-tag--neu">Not checked</span></td></tr>`).join('');
  const table=`<div class="ps-cmt-wrap"><table class="ps-cmt ps-cmt--wide"><thead><tr><th>Account</th><th>Bio</th><th>Followers</th><th>Following</th><th>Posts</th><th class="num">Comments</th><th>Assessment</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  return psSec('Every account that commented','people','neutral',
    `<p class="ps-desc mute">Ordered by how many comments they left here. Names and follower counts come from audience enrichment, which runs per scoring job. Anyone not yet looked up shows as unenriched rather than as having no followers.</p>${table}<div class="ps-pager"><span>Showing ${shown.length} of ${accts.length} accounts</span></div>`,
    `<span class="ps-sim">${exactN(accts.length)} accounts</span>`);
}
function psCmt(pid,f,pg){ S.psCmtF=f; S.psCmtPg=pg; psTab(pid,'comments'); }
const simTag=()=>'<span class="ps-sim">Simulated</span>';
const PS_IC={user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',video:'<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/>',phone:'<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M11 18h2"/>',tag:'<path d="M20 12 12 20l-8-8V4h8z"/><circle cx="8" cy="8" r="1.5"/>',box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/>',zap:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',people:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-4-6.3"/>',text:'<path d="M4 6h16M4 12h10M4 18h7"/>',doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',coin:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5a2.5 2.5 0 0 1 2.5-1.5h.5a2 2 0 0 1 0 4h-1a2 2 0 0 0 0 4h.5a2.5 2.5 0 0 0 2.5-1.5"/>',split:'<path d="M4 20V10M10 20V4M16 20v-6M22 20H2"/>',mega:'<path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a4 4 0 0 1 0 6"/>'};
const psIco=(k)=>`<i class="ps-ico"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PS_IC[k]||PS_IC.doc}</svg></i>`;
const psKv=(ico,tint,l,v)=>`<div class="ps-kv"><div><span>${l}</span><b>${v}</b></div></div>`;
const psSec=(title,ico,tint,body,tag)=>`<section class="ps-sec"><header class="ps-sec-h">${psIco(ico)}<b>${title}</b>${tag||''}</header>${body}</section>`;
function psOverviewHTML(p,cr){
  const r=discRng(discSeedRepo('ovw'+p.id)), pick=a=>a[Math.floor(r()*a.length)];
  const topic=pick(PS_TOPICS), lang=pick(PS_LANGS), trig=pick(PS_TRIG), style=pick(PS_STYLE), arch=pick(PS_ARCH), gender=pick(PS_GENDER), ages=pick(PS_AGES);
  const isVideo=/reel|video/i.test(p.format||''), cat=p.category||'Beauty';
  const title=p.title||`${p.concept&&p.concept!=='Post'?p.concept:'Post'} · ${p.product||''}`;
  const desc=`${cr.name} features ${p.product||'the product'} in a ${String(p.concept||'post').toLowerCase()} format, covering how it fits into everyday routines.`;
  const simT=simTag();
  const chip=(x)=>`<span class="ps-chip">${esc(x)}</span>`;
  return [
    psSec('Content details','user','indigo',`<div class="ps-kvs">${psKv('user','indigo','Creator',`${esc(cr.name)}<small>${esc(cr.handle||'')}</small>`)}${psKv('phone','violet','Platform','Instagram')}${psKv('video','teal','Format',esc(p.format||'Post'))}${psKv('cal','amber','Published',campDate(p.date))}${campPostMetrics(p).viral?psKv('zap','rose','Performance','Viral'):''}</div>`),
    psSec(esc(title),'doc','violet',`<p class="ps-desc">${esc(desc)}</p>`,simT),
    psSec('Audience persona','people','teal',`<p class="ps-desc">Young ${gender==='Female'?'women':gender==='Male'?'men':'adults'} interested in ${esc(cat.toLowerCase())}.</p><div class="ps-chips">${chip(gender)}${ages.map(a=>chip(a)).join('')}</div>`,simT),
    psSec('Messaging','chat','amber',`<div class="ps-kvs">${psKv('text','amber','Topic',esc(topic))}${psKv('box','amber','Product &amp; category',`${esc(p.product||'—')}<small>${esc(cat)}</small>`)}${psKv('globe','amber','Language',esc(lang))}</div>`,simT),
    psSec('Creative angle','zap','rose',`<div class="ps-kvs">${psKv('zap','rose','Psychological trigger',esc(trig))}${psKv('pen','rose','Content style',esc(style))}${psKv('target','rose','Messaging archetype',esc(arch))}</div>`,simT),
    psSec('Video transcription','text','slate',isVideo?`<blockquote class="ps-quote">${esc(pick(PS_LINES))}</blockquote>`:'<p class="ps-desc mute">No spoken audio in this format.</p>',simT)
  ].join('');
}
function psPanelHTML(p,tab){
  const cr=crOf(p.creator)||{name:p.creator}, sm=psSim(p);
  const tile=(l,v,sub)=>`<div class="ps-tile"><span>${l}</span><b>${v}</b>${sub?`<small>${sub}</small>`:''}</div>`;
  const simTag='<span class="ps-sim">Simulated</span>';
  if(tab==='engagement') return psEngagementHTML(p,cr,sm);
  if(tab==='comments') return psCommentsHTML(p,cr,sm,S.psCmtF||'All',S.psCmtPg||1);
  if(tab==='audience') return psAudienceHTML(p,cr,sm);
  return `${psOverviewHTML(p,cr)}
    ${psSec('Views split','split','green',`<div class="ps-kvs">${psKv('eye','green','Organic',exactN(p.organic))}${psKv('mega','green','Boosted',exactN(p.paid))}</div><div class="ps-stack ps-stack--lg"><i class="org" style="width:${p.views?Math.round(p.organic/p.views*100):0}%"></i><i class="paid" style="width:${p.views?Math.round(p.paid/p.views*100):0}%"></i></div>`)}
    ${psSec('Campaign','coin','indigo',`<div class="ps-kvs">${psKv('box','indigo','Product',esc(p.product))}${psKv('tag','indigo','Concept',esc(p.concept||'—'))}${psKv('coin','indigo','Cost',rupees(p.cost||0))}${psKv('split','indigo','CPV',p.views?cpvOf(p.cost||0,p.views):'—')}</div>`)}`;
}
function postLinkCell(p,title){
  const fmt=p.format||'Post', col=PL_COL[fmt]||'#475569', url=p.url||'', short=url.replace(/^https?:\/\//,'').replace(/^www\./,'')||'No link';
  return `<div class="pl-cell"><span class="pl-thumb" style="background:${col}"><b>${esc(fmt)}</b></span><span class="pl-txt"><span class="pl-title-row"><strong>${p.open?`<a class="pl-tlink" href="#" onclick="event.preventDefault();${p.open}">${esc(title||fmt)}</a>`:esc(title||fmt)}</strong><button type="button" class="pl-detail" aria-label="Open post details" title="Post details" onclick="event.stopPropagation();psOpen('${esc(String(p.id))}')">${PS_ICON}</button></span><a href="${esc(url)}" target="_blank" rel="noopener" title="${esc(url)}">${esc(short)}</a></span>${url?`<a class="pl-go" href="${esc(url)}" target="_blank" rel="noopener" aria-label="Open post" title="Open post">${PL_ARROW}</a>`:''}</div>`;
}
function postTableHTML(posts,showCampaign){
  const cols=showCampaign?10:9;
  const mini=cr=>cr?`<div class="ds-who"><span class="ds-avatar ds-avatar--sm" style="background:${AV_PAL[avHash(cr.id)%AV_PAL.length]}">${esc(initialsOf(cr.name))}</span><span class="ds-who-text"><b>${esc(cr.name)}</b><small>${esc(cr.handle)}</small></span></div>`:'—';
  return `<div class="ds-table-wrap ds-table-wrap--posts"><table class="ds-table ds-table--fit ds-table--dense"><thead><tr><th>Post / live date</th>${showCampaign?'<th>Campaign</th>':''}<th>Creator</th><th>Product</th><th>Concept</th><th>Organic / paid</th><th class="ds-num">Views</th><th class="ds-num">Spend</th><th class="ds-num">CPV</th><th>Action</th></tr></thead>
  <tbody>${posts.map(p=>`<tr><td>${postLinkCell(p)}${isViral(p)?'<span class="dk-viral">🔥 viral</span>':''}</td>${showCampaign?`<td><button class="ds-namebtn" onclick="openCampaign('${p.campaignId}')">${esc(p.campaignName)}</button></td>`:''}<td>${mini(crOf(p.creator))}</td><td class="dk-nw">${esc(p.product)}</td><td>${ctTag(p.concept)}</td><td class="dk-nw"><span class="dk-split-row"><span>${exactN(p.organic)} / ${exactN(p.paid)}</span>${boostBadge(p)}</span></td><td class="ds-num">${exactN(p.views)}</td><td class="ds-num">${rupees(p.cost)}</td><td class="ds-num">${cpvOf(p.cost,p.views)}</td><td><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openPost('${p.id}')">View post</button></td></tr>`).join('')||`<tr><td colspan="${cols}" class="ds-empty">No posts recorded in this view.</td></tr>`}</tbody></table></div>`;
}
const VIEW_ICO={table:'table',cards:'grid',tabs:'list',report:'doc'};
const dsViewSeg=(k,opts,val)=>`<div class="ds-seg ds-viewseg" role="tablist" aria-label="View">${opts.map(([v,l])=>{const ik=VIEW_ICO[v]; return `<button type="button" role="tab" aria-selected="${val===v}" aria-label="${l}" title="${l}" class="${val===v?'on':''}${ik?' ds-view-ico':''}" onclick="setPageState('${k}','${v}')">${ik?icon(ik,'ico-sm'):l}</button>`}).join('')}</div>`;
const TV_ICO={cal:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',chk:'<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',wallet:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M16 12h2"/>'};
const campDate=d=>new Date(d+'T00:00:00Z').toLocaleDateString('en-IN',{month:'short',day:'numeric',timeZone:'UTC'});
/* 10a/10b: a post is viral when it reaches at least 5× its creator's average views on their other posts */
function creatorAvgViews(crId,exceptId){ const ps=CAMP_LIST.flatMap(c=>c.posts).filter(p=>p.creator===crId&&p.id!==exceptId); return ps.length?sumOf(ps,'views')/ps.length:0; }
function viralRatio(p){ const a=creatorAvgViews(p.creator,p.id); return a&&p.views?p.views/a:0; }
function isViral(p){ return viralRatio(p)>=5; }
function campPostMetrics(p){
  const h=avHash(p.id);
  const likes=Math.round(p.views*(0.045+(h%30)/1000));
  const comments=Math.round(likes*(0.04+((h>>3)%10)/200));
  return {likes,comments,er:(likes+comments)/Math.max(1,p.views)*100,viral:isViral(p),kind:ctKind(p)==='reel'?'video':ctKind(p)==='carousel'?'carousel':'image'};
}
const campWho=cr=>cr?`<div class="ds-who">${dsAv(cr.id,cr.name)}<span class="ds-who-text"><b>${esc(cr.name)}</b><small>${esc(cr.handle)}</small></span></div>`:'—';
function campSearchBox(key,ph){ return `<label class="dk-search"><input data-cs="${key}" type="search" placeholder="${esc(ph)}" value="${esc(S[key]||'')}" oninput="setPageState('${key}',this.value,'[data-cs=${key}]')" aria-label="${esc(ph)}"></label>`; }
/* shared table tools: column visibility per table (hidden indexes stored in S.tbHide) */
const TB_DEF={content:[2,12,13,14,15,16]};
function tbHidden(k){ const v=(S.tbHide||{})[k]; return v!==undefined?v:(TB_DEF[k]||[]); }
function tbWrap(k,html){ const h=tbHidden(k); const css=h.length?`<style>${h.map(i=>`[data-tb="${k}"] table tr>*:nth-child(${i+1}){display:none}`).join('')}<\/style>`:''; return `<div class="tb-wrap" data-tb="${k}">${css}${html}</div>`; }
function tbColsBtn(k){ return `<button type="button" class="ds-btn ds-btn--outline ds-btn--sm tb-cols" onclick="tbColsOpen('${k}')">${discSvg(COLS_SVG,14)}Columns</button>`; }
function tbColsOpen(k){
  const names=[...document.querySelectorAll(`[data-tb="${k}"] table thead tr:last-child th`)].map(t=>t.textContent.trim());
  const h=tbHidden(k);
  const rows=names.map((n,i)=>i===0||!n?'':`<label class="tb-col-row"><input type="checkbox" ${h.includes(i)?'':'checked'} onchange="tbColToggle('${k}',${i})"><span>${esc(n)}</span></label>`).join('');
  showModal('Columns',`<div class="tb-cols-list">${rows}</div>`,'<button class="ds-btn ds-btn--primary" onclick="closeLayer()">Done</button>');
}
function tbColToggle(k,i){ const h=tbHidden(k); S.tbHide={...(S.tbHide||{}),[k]:h.includes(i)?h.filter(x=>x!==i):[...h,i]}; paintBody(true); }
const CAMP_OWNERS=['Karan','Ankit','Unassigned'];
const campOwnerOf=(c,crId)=>(c.owners||{})[crId]||c.manager||'Unassigned';
function performanceControlsHTML(){
 const scope=S.campPerfScope||'combined',metrics=S.campPerfMetrics||['views','organic','paid','spend','cpv'];
 const defs=[['views','Views'],['organic','Organic views'],['paid','Paid views'],['spend','Recorded creator cost'],['cpv','CPV']];
 const seg=[['organic','Organic'],['paid','Paid'],['combined','Combined']].map(([v,l])=>`<button type="button" class="${scope===v?'on':''}" aria-pressed="${scope===v}" onclick="perfScopeSet('${v}')">${l}</button>`).join('');
 return `<section class="ds-card" style="padding:12px 14px;margin-bottom:12px;display:flex;flex-direction:column;gap:10px"><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><b style="min-width:140px">Performance view</b><div class="ds-seg">${seg}</div></div><div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap"><b style="min-width:140px">Metrics shown</b><div style="display:flex;gap:14px;flex-wrap:wrap">${defs.map(([v,l])=>`<label style="display:flex;gap:6px;align-items:center"><input type="checkbox" ${metrics.includes(v)?'checked':''} onchange="perfMetricToggle('${v}',this.checked)"><span>${l}</span></label>`).join('')}</div></div></section>`;
}
function performanceMetricCards(posts,scope){
 const m=S.campPerfMetrics||['views','organic','paid','spend','cpv'],views=sumOf(posts,'views'),cost=sumOf(posts,'cost');
 const vals={views:exactN(views),organic:exactN(sumOf(posts,'organic')),paid:exactN(sumOf(posts,'paid')),spend:rupees(cost),cpv:cpvOf(cost,views)};
 const labels={views:'Views',organic:'Organic views',paid:'Paid views',spend:'Recorded creator cost',cpv:'CPV',posts:'Posts'};
 return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;margin-bottom:12px">${m.map(k=>`<div class="ds-card" style="padding:12px 14px"><span class="ds-caption">${labels[k]||k}</span><b class="ds-num" style="display:block;font-size:18px;margin-top:4px">${vals[k]??'—'}</b><small class="ds-caption">${scope==='combined'?'Organic + paid':scope==='organic'?'Organic only':'Paid only'}</small></div>`).join('')}</div>`;
}
function perfMetricToggle(key,on){
 const a=new Set(S.campPerfMetrics||['views','organic','paid','spend','cpv']);
 on?a.add(key):a.delete(key);if(!a.size)a.add('views');S.campPerfMetrics=[...a];paintBody();
}
function perfScopeSet(scope){S.campPerfScope=scope;paintBody();}
function perfScopedPosts(posts,scope){
 return posts.filter(p=>scope==='organic'?(Number(p.organic)||0)>0:scope==='paid'?(Number(p.paid)||0)>0:true).map(p=>{
  const org=Number(p.organic)||0,paid=Number(p.paid)||0;
  return {...p,views:scope==='organic'?org:scope==='paid'?paid:(Number(p.views)||org+paid),
   organic:scope==='paid'?0:org,paid:scope==='organic'?0:paid};
 });
}
function campPerformanceHTML(c,posts0){
  const scope=S.campPerfScope||'combined';
  const posts=perfScopedPosts(ovFilterPosts(posts0),scope);
  const curP=S.cPeriod||'thisMonth';
  const orgPs=posts.filter(p=>p.paid===0), boostPs=posts.filter(p=>p.paid>0);
  const rowsSplit=[{name:'Organic',posts:orgPs,views:sumOf(posts,'organic'),spend:sumOf(orgPs,'cost')},{name:'Boosted',posts:boostPs,views:sumOf(posts,'paid'),spend:sumOf(boostPs,'cost')}];
  const views=sumOf(posts,'views'), spend=sumOf(posts,'cost'), paid=sumOf(posts,'paid');
  const nBoost=boostPs.length, nOrg=orgPs.length;
  const ovItem=(ico,l,v,def)=>`<div class="dk-ov-item dk-ov-static" title="${esc(def)}"><span class="dk-ov-l">${DK_SVG(DK_ICO[ico])}${l}</span><b>${v}</b></div>`;
  const stats=`<details class="dk-ov dk-acc cp-ov" ${S.cpOvOpen===false?'':'open'} ontoggle="S.cpOvOpen=this.open"><summary class="dk-p2-head dk-acc-h"><span class="dk-acc-chev">${DK_SVG('<path d="M6 9l6 6 6-6"/>')}</span><span class="dk-acc-t">Overview</span>${dkMiniHTML([['total',c.creatorIds.length],['live',posts.length,`/ ${c.plannedVideos}`],['views',exactN(views)],['spend',rupees(spend)]])}</summary>
    <div class="dk-ov-row">${ovItem('total','Creators',c.creatorIds.length,'Creators taking part in this campaign')}${ovItem('posts','Published posts',posts.length,`Planned: ${c.plannedVideos}`)}${ovItem('views','Total views',exactN(views),'Lifetime views on this campaign’s posts in the selected period')}${ovItem('spend','Total spent',rupees(spend),`Budget ${rupees(c.budget)}`)}${ovItem('blended','Avg CPV',cpvOf(spend,views),'Total spend ÷ total views')}${ovItem('blended','Recorded cost / paid views',cpvOf(sumOf(boostPs,'cost'),paid),'Recorded creator cost for boosted posts ÷ paid views')}${ovItem('live','Boosted vs organic',`${nBoost} / ${nOrg}`,`${exactN(paid)} paid views`)}</div>
  </details>`;
  const periodSet="setPageState('cPeriod',";
  const cust=S.cCust||{}, ovF={...dashState(),period:curP,from:cust.from,to:cust.to};
  const unk=k=>posts.length?Math.round(posts.filter(p=>!crAttr(p.creator,k)).length/posts.length*100):0;
  const topc=dashTopCreatorsHTML(posts.map(p=>({...p,campaignName:c.name})),{hideCampaign:true});
  return `${campHdrBarHTML(c,curP,periodSet)}${performanceControlsHTML()}${performanceMetricCards(posts,scope)}<div class="dk-shell"><div class="dk-main">${stats}<div class="cp-grid dk-main dw-grid">${CW('cp_timeline',timelineHTML({camps:[c],value:curP,cust:S.cCust,scope:'this campaign only',title:'Posts timeline',split:true,dwKey:'cp_timeline'}))}${CW('cp_trend',dashTrendHTML(posts,ovF,'cp_trend'))}${CW('cp_sent',campSentimentHTML(posts))}${CW('cp_creators',dashCreatorWidgetHTML(posts,unk('gender'),unk('state'),'cp_creators'))}</div>
</div><aside class="dk-widgets">${campPipeHTML(c)}${topc}</aside></div>`;
}

/* Sentiment card for the campaign dashboard (same donut as the overall dashboard) */
function campSentimentHTML(posts){ return `<div class="ds-card dk-w">${dkHead('sentiment','Sentiment','Tone of comments · not yet available')}${sentNAHTML()}</div>`; }
/* Overview filters: creator, platform (from the post link), post type, organic / boosted */
const campPlatform=p=>/tiktok/i.test(p.url||'')?'TikTok':'Instagram';
function ovFilterPosts(posts){
  const cr=S.ovCreator||'All', pl=S.ovPlatform||'All', ty=S.ovType||'All', bo=S.ovBoost||'All';
  return posts.filter(p=>(cr==='All'||p.creator===cr)&&(pl==='All'||campPlatform(p)===pl)&&(ty==='All'||ctKind(p)===ty)&&(bo==='All'||(bo==='boosted'?p.paid>0:p.paid===0)));
}
/* One header row: data note, date range, refresh, then the overview filters */
function campHdrBarHTML(c,curP,periodSet){
  const creators=c.creatorIds.map(crOf).filter(Boolean);
  return `<div class="cp-hdrbar"><div class="cp-hdr-l">${dsFilter('ovCreator','Creator',[['All','All creators'],...creators.map(x=>[x.id,x.name])],S.ovCreator||'All')}${dsFilter('ovPlatform','Platform',[['All','All platforms'],['Instagram','Instagram'],['TikTok','TikTok']],S.ovPlatform||'All')}${dsFilter('ovType','Post type',[['All','All types'],['reel','Reel'],['post','Post'],['carousel','Carousel']],S.ovType||'All')}${dsFilter('ovBoost','Organic / boosted',[['All','All posts'],['organic','Organic'],['boosted','Boosted']],S.ovBoost||'All')}</div><div class="cp-hdr-r">${periodCtrlHTML({value:curP,cust:S.cCust,opts:PERIOD_OPTS,set:periodSet,setCust:'setCampCust'})}</div></div>`;
}
/* Post thumbnail in its real shape: reel 9:16, post 1:1, carousel 4:5 with stacked slides */
function ctKind(p){ return p.format==='Carousel'?'carousel':p.format==='Post'?'post':p.format==='Story'?'story':p.format==='Video'?'video':'reel'; }
const CT_LABEL={reel:'Reel',post:'Post',carousel:'Carousel',story:'Story',video:'Video'};
const CT_SHORT={reel:'Reel',post:'Post',carousel:'Car.',story:'Story',video:'Video'};
const ctTag=t=>`<span class="ct-tag">${esc(t||'—')}</span>`;
const PC_ICON={Instagram:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/></svg>`,Meta:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12c0-2.6 1.2-4.6 3.1-4.6 1.9 0 3.2 2.1 4.4 4.6 1.2 2.5 2.5 4.6 4.4 4.6 1.9 0 3.1-2 3.1-4.6s-1.2-4.6-3.1-4.6c-1.9 0-3.2 2.1-4.4 4.6"/></svg>`,TikTok:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.2a3.3 3.3 0 1 1-3.3-3.3"/><path d="M14 3c.4 2.6 2.1 4.3 5 4.6"/></svg>`};
const SLUG_OF={Instagram:'ig',Meta:'meta',TikTok:'tt'};
const FMT_TONE={Reel:['#6d28d9','#ede9fe','#ddd6fe'],Carousel:['#075985','#e0f2fe','#7dd3fc'],Static:['#92400e','#fffbeb','#fde68a'],Story:['#be185d','#fdf2f8','#f9a8d4'],Video:['#166534','#dcfce7','#86efac']};
const fmtTag=f=>{const t=FMT_TONE[f]; return t?`<span class="ct-tag fmt-tag" style="color:${t[0]};background:${t[1]};border-color:${t[2]}">${esc(f)}</span>`:ctTag(f);};

const CT_ARROW='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
function ctThumb(p){
  const k=ctKind(p), bg=AV_PAL[avHash(p.id)%AV_PAL.length];
  return `<span class="ct-thumb ct-${k}" style="background:${bg}" aria-hidden="true">${CT_SHORT[k]}</span>`;
}
const parseAmt=v=>Math.max(0,Math.round(Number(String(v).replace(/[^0-9.]/g,''))||0));
function setPostCost(cid,pid,val){ const p=campOf(cid).posts.find(x=>x.id===pid); if(!p) return; p.cost=parseAmt(val); paintBody(); toast('Cost updated'); }
function campLiveTableHTML(c,withCamp,lead=''){
  const view=S.cView||'table';
  const q=(S.cQ||'').toLowerCase().trim(), ftr=S.cTrk||'All', fp=S.cPlat||'All', fkind=S.cKind||'All', fc=S.cConcept||'All', fr=S.cCreator||'All', fk=S.cType||'All', fm=S.cMonth||'All';
  const rows=withCamp.filter(p=>{
    const cr=crOf(p.creator)||{};
    const hay=`${p.name||''} ${CT_LABEL[ctKind(p)]} ${cNameOf(p.creator)} ${cr.handle||''} ${p.product} ${p.concept} ${p.url||''}`.toLowerCase();
    return (!q||hay.includes(q))&&(fm==='All'||p.date.slice(0,7)===fm)&&(ftr==='All'||trkOf(p)===ftr)&&(fp==='All'||ctPlat(p)===fp)&&(fkind==='All'||ctKind(p)===fkind)&&(fc==='All'||p.concept===fc)&&(fr==='All'||p.creator===fr)&&(fk==='All'||(fk==='boosted'?p.paid>0:p.paid===0));
  }).sort((a,b)=>b.date.localeCompare(a.date));
  const concepts=uniq(withCamp.map(p=>p.concept));
  const creators=c.creatorIds.map(crOf).filter(Boolean);
  const anyOn=['cQ','cPlat','cCreator','cKind','cTrk','cConcept','cMonth','cType'].some(k=>S[k]&&S[k]!=='All');
  const selIds=S.ctSel||[], allOn=rows.length>0&&rows.every(p=>selIds.includes(p.id)), selN=selIds.filter(id=>rows.some(p=>p.id===id)).length;
  const extraN=(fc!=='All'?1:0)+(fk!=='All'?1:0)+(fm!=='All'?1:0);
  const FUNNEL='<path d="M3 4h18l-7 8.5V19l-4 2v-8.5z"/>';
  const advBtn=`<button type="button" class="ds-btn ds-btn--outline ds-btn--sm${S.cAdvOpen||extraN?' is-on':''}" style="width:36px;height:36px;padding:0;justify-content:center;${S.cAdvOpen||extraN?'border-color:#1d4ed8;color:#1d4ed8':''}" onclick="campAdvToggle()" aria-label="More filters" title="More filters">${discSvg(FUNNEL,16)}${extraN?`<span class="ct-adv-n">${extraN}</span>`:''}</button>`;
  const advPanel=S.cAdvOpen?`<aside class="ct-adv" aria-label="More filters"><div class="ct-adv-h"><strong>More filters</strong><button type="button" class="ds-iconbtn" aria-label="Close filters" onclick="campAdvToggle()">&times;</button></div><div class="ct-adv-g">${dsFilter('cConcept','Concept',[['All','All concepts'],...concepts.map(x=>[x,x])],fc)}${dsFilter('cType','Boost',[['All','All types'],['boosted','Boosted'],['organic','Organic']],fk)}${dsFilter('cMonth','Live month',[['All','All months'],...uniq(withCamp.map(p=>p.date.slice(0,7))).map(m=>[m,tlMonLabel(m)])],fm)}</div></aside>`:'';
  const toolbar=`<div class="ds-toolbar ds-toolbar--wrap dk-ctools">${advBtn}${campSearchBox('cQ','Search posts, creators, URLs...')}${lead}${dsFilter('cPlat','Platform',[['All','All platforms'],['Instagram','Instagram'],['YouTube','YouTube'],['TikTok','TikTok'],['Other','Other']],fp)}${dsFilter('cCreator','Creator',[['All','All creators'],...creators.map(x=>[x.id,x.name])],fr)}${dsFilter('cKind','Content type',[['All','All types'],['reel','Reel'],['post','Post'],['carousel','Carousel'],['story','Story'],['video','Video']],fkind)}${dsFilter('cTrk','Tracking status',[['All','All statuses'],['tracked','Tracked'],['awaiting','Awaiting URL'],['syncing','Syncing'],['failed','Failed']],ftr)}${anyOn?'<button type="button" class="ds-btn ds-btn--ghost ds-btn--sm" onclick="clearCampFilters()">Clear all</button>':''}${selN?`<span class="ct-selcount">${selN} selected</span><button type="button" class="ds-btn ds-btn--ghost ds-btn--sm" onclick="ctSelAll(false,null)">Clear selection</button>`:''}<span class="ds-spacer"></span>${dsViewSeg('cView',[['table','Table'],['cards','Cards']],view)}${view==='cards'?'':tbColsBtn('content')}<button class="ds-btn ds-btn--primary ds-btn--sm" onclick="openAddPost('${c.id}')">${icon('plus','ico-sm')}Add post</button></div>${advPanel}`;
  if(view==='cards'){
    const ci=d=>`<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
    const I_EYE='<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', I_HEART='<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>', I_COM='<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>';
    const cards=rows.map(p=>{const m=campPostMetrics(p), cr=crOf(p.creator), boosted=isBoost(p), k=ctKind(p);
      return `<article class="ds-card ct-card" role="button" tabindex="0" onclick="openContentSide('${p.id}')" onkeydown="if(event.key==='Enter')openContentSide('${p.id}')">
        <div class="ct-media" style="${pastelStyle(p.id)}">
          <span class="ct-type ${boosted?'is-boost':'is-org'} ct-media-tl">${boosted?'Boosted':'Organic'}</span>
          <span class="ct-kind-chip ct-media-tr">${CT_LABEL[k]}</span>
          ${k==='reel'?`<span class="ct-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg></span>`:''}
        </div>
        <div class="ct-card-body">
          <div class="ct-card-title">${esc(p.product)}</div>
          <div class="ct-card-row"><span>${campWho(cr)}</span><span class="dk-nw">${campDate(p.date)}</span></div>
          <div class="ct-card-metrics">
            <div title="Views">${ci(I_EYE)}<b>${exactN(p.views)}</b></div>
            <div title="Likes">${ci(I_HEART)}<b>${exactN(m.likes)}</b></div>
            <div title="Comments">${ci(I_COM)}<b>${exactN(m.comments)}</b></div>
          </div>
          <div class="ct-card-stats"><div><small>Paid views</small><b>${p.paid?exactN(p.paid):'—'}</b></div><div><small>ER%</small><b>${m.er.toFixed(1)}%</b></div><div><small>Cost</small><b>${(p.cost||0)>0?rupees(p.cost):'—'}</b></div><div><small>CPV</small><b>${(p.cost||0)>0?cpvOf(p.cost,p.views):'—'}</b></div></div>
          <div class="ct-card-foot">${dsBadge(p.concept)}${m.viral?'<span class="dk-viral">🔥 viral</span>':''}</div>
        </div></article>`;}).join('')||'<div class="ds-empty">No content matches these filters.</div>';
    return `${toolbar}<div class="ct-cards">${cards}</div>`;
  }
  const body=rows.map(p=>{
    const m=campPostMetrics(p), cr=crOf(p.creator), boosted=isBoost(p), url=p.url||'', x=commentMix(p), aw=trkOf(p)==='awaiting';
    const pc=n=>x.total?Math.round(n/x.total*100):0;
    return `<tr class="is-clickable${selIds.includes(p.id)?' is-selected':''}" tabindex="0" onclick="openContentSide('${p.id}')">
      <td class="ct-postcol cs-first"><div class="ct-post-cell"><input type="checkbox" class="ct-sel" aria-label="Select this post" ${selIds.includes(p.id)?'checked':''} onclick="event.stopPropagation()" onchange="ctSelToggle('${p.id}')">${ctThumb(p)}<div class="ct-post-meta"><span class="ct-kind">${CT_LABEL[ctKind(p)]}</span><span class="ct-plat-ic" title="${ctPlat(p)}">${PLAT_ICON_SVG(ctPlat(p))}</span>${url?`<span class="ct-link" title="${esc(url)}">${esc(url.replace(/^https?:\/\//,''))}</span>`:'<span class="ct-link">No link added</span>'}</div>${p.id?`<button type="button" class="pl-detail ct-detail" aria-label="Open post details" title="Post details" onclick="event.stopPropagation();psOpen('${esc(String(p.id))}')">${PS_ICON}</button>`:''}${url?`<a class="ct-open" href="${esc(url)}" target="_blank" rel="noopener" aria-label="Open post link" title="Open post" onclick="event.stopPropagation()">${CT_ARROW}</a>`:''}</div></td>
      <td>${campWho(cr)}</td>
      <td class="ct-product">${esc(p.product)}</td>
      <td class="dk-nw">${campDate(p.date)}</td>
      <td>${ctPlatBadge(p)}</td>
      <td>${trkBadge(p)}</td>
      <td class="ds-num"><span class="dk-viewcell">${m.viral&&!aw?'<span class="dk-viral">🔥 viral</span>':''}${aw?'—':exactN(p.views)}</span></td>
      <td class="ds-num">${!aw&&p.paid?exactN(p.paid):'—'}</td>
      <td class="ds-num">${aw?'—':exactN(m.comments)}</td>
      <td class="ds-num">${aw?'—':exactN(m.likes)}</td>
      <td class="ds-num">${aw?'—':m.er.toFixed(1)+'%'}</td>
      <td onclick="event.stopPropagation()">${aw?'—':sentimentCellHTML(x)}</td>
      <td class="ds-num">${!aw&&x.pos?exactN(x.pos):'—'}</td>
      <td class="ds-num">${!aw&&x.neu?exactN(x.neu):'—'}</td>
      <td class="ds-num">${!aw&&x.neg?exactN(x.neg):'—'}</td>
      <td class="ds-num">${!aw&&x.inq?exactN(x.inq):'—'}</td>
      <td onclick="event.stopPropagation()">${ctEditCell(c.id,p,'name',p.name||'',p.name?esc(p.name):'<span class="ct-muted">Add name</span>')}</td>
      <td class="ds-num" onclick="event.stopPropagation()">${aw?'—':ctEditCell(c.id,p,'cost',String(Math.round(p.cost||0)),rupees(p.cost||0),'num')}</td>
      <td class="ds-num">${aw?'—':(p.cost||0)>0?cpvOf(p.cost,p.views):'<span class="ct-nocost">Not set</span>'}</td>
      <td>${ctTag(p.concept)}</td>
      <td><span class="ct-type ${boosted?'is-boost':'is-org'}">${boosted?'Boosted':'Organic'}</span></td>
      <td class="ds-sticky-r" onclick="event.stopPropagation()"><details class="ds-more"><summary class="ds-btn ds-btn--outline ds-btn--sm" aria-label="More options for this post">⋯</summary><div class="ds-more-menu">${trkOf(p)==='failed'?`<button onclick="event.stopPropagation();ctRetry('${p.id}')">Retry sync</button>`:''}<button onclick="event.stopPropagation();psOpen('${esc(String(p.id))}')">Inspect post</button>${url?`<a href="${esc(url)}" target="_blank" rel="noopener">Open original post</a>`:''}<button onclick="event.stopPropagation();ctUrlDlg('${c.id}','${p.id}')">${url?'Update URL':'Add URL'}</button><button class="is-danger" onclick="openRemovePost('${c.id}','${p.id}')">Remove post</button></div></details></td></tr>`;
  }).join('')||'<tr><td colspan="22" class="ds-empty">No content matches these filters.</td></tr>';
  return `${toolbar}<div class="ds-table-wrap ct-wrap"><table class="ds-table ct-table"><thead><tr><th class="cs-first"><span class="ct-hd"><input type="checkbox" class="ct-sel" aria-label="Select all posts" data-ids="${rows.map(p=>p.id).join(',')}" onchange="ctSelAll(this.checked,this)" ${allOn?'checked':''}>${hdIc('Post')}Post</span></th><th><span class="ct-hd">Creator</span></th><th><span class="ct-hd">Product</span></th><th><span class="ct-hd">Live date</span></th><th><span class="ct-hd">Platform</span></th><th><span class="ct-hd">Tracking status</span></th><th class="ds-num"><span class="ct-hd">Views</span></th><th class="ds-num"><span class="ct-hd">Paid views</span></th><th class="ds-num"><span class="ct-hd">Comments</span></th><th class="ds-num"><span class="ct-hd">Likes</span></th><th class="ds-num"><span class="ct-hd">ER%</span></th><th><span class="ct-hd">Sentiment</span></th><th class="ds-num"><span class="ct-hd">Positive</span></th><th class="ds-num"><span class="ct-hd">Neutral</span></th><th class="ds-num"><span class="ct-hd">Negative</span></th><th class="ds-num"><span class="ct-hd">Inquiry</span></th><th><span class="ct-hd">Name</span></th><th class="ds-num"><span class="ct-hd">Cost</span></th><th class="ds-num"><span class="ct-hd">CPV</span></th><th><span class="ct-hd">Concept</span></th><th><span class="ct-hd">Type</span></th><th class="ds-sticky-r"></th></tr></thead><tbody>${body}</tbody></table></div>`;
}
/* Comment sentiment split per post (sample data, sums to the post's comments) */
function commentMix(p){
  const m=campPostMetrics(p), h=avHash(p.id+'s');
  const w=[30+h%40,25+((h>>>4)%35),4+((h>>>8)%12),8+((h>>>12)%30)], t=w.reduce((a,b)=>a+b,0);
  const pos=Math.floor(m.comments*w[0]/t), neu=Math.floor(m.comments*w[1]/t), neg=Math.floor(m.comments*w[2]/t);
  return {total:m.comments,pos,neu,neg,inq:m.comments-pos-neu-neg};
}
/* Read-only sentiment bar; hover (or focus) shows the breakdown */
function sentimentCellHTML(x){
  return `<span class="sent-na-inline" title="${SENT_NA_TIP}">Not yet available</span>`;
}
const CT_PENCIL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
/* Read-only value; hover reveals the edit mark, click switches to an input */
function ctEditCell(cid,p,f,val,display,kind){
  const on=S.ctEdit&&S.ctEdit.pid===p.id&&S.ctEdit.f===f;
  if(on) return `<input class="ct-in${kind==='num'?' is-num':''}" aria-label="${f} for this post" value="${esc(val)}" onkeydown="ctEditKey(event,'${cid}','${p.id}','${f}')" onblur="ctEditSave('${cid}','${p.id}','${f}',this.value)">`;
  return `<button type="button" class="ct-edit${kind==='num'?' is-num':''}" onclick="event.stopPropagation();ctEditStart('${p.id}','${f}')" aria-label="Edit ${f} for this post" title="Click to edit">${display}<span class="ct-pen">${CT_PENCIL}</span></button>`;
}
function ctEditStart(pid,f){ S.ctEdit={pid,f}; paintBody(); setTimeout(()=>{ const i=document.querySelector('.ct-in'); if(i){ i.focus(); i.select(); } },0); }
function ctEditKey(e,cid,pid,f){ if(e.key==='Enter'){ e.preventDefault(); e.target.blur(); } else if(e.key==='Escape'){ S.ctEdit=null; paintBody(); } }
function ctEditSave(cid,pid,f,v){
  if(!S.ctEdit) return; S.ctEdit=null;
  if(f==='cost') return setPostCost(cid,pid,v);
  const p=campOf(cid).posts.find(x=>x.id===pid); if(p) p.name=String(v||'').trim();
  paintBody();
}

function openContentSide(pid){ psOpen(pid); }
function setCampOwner(cid,crId,v){ const c=campOf(cid); c.owners=c.owners||{}; c.owners[crId]=v; paintBody(); toast(`SPOC set to ${v}`); }
function setCreatorCost(cid,crId,val){
  const c=campOf(cid), v=parseAmt(val);
  const xp=c.posts.filter(p=>p.creator===crId), old=sumOf(xp,'cost');
  if(!xp.length){ c.fees=c.fees||{}; c.fees[crId]=v; }
  else if(old>0){ const f=v/old; let acc=0; xp.forEach((p,i)=>{ p.cost=i===xp.length-1?v-acc:Math.round((p.cost||0)*f); acc+=p.cost; }); }
  else xp.forEach((p,i)=>{p.cost=i===0?v:0;});
  paintBody(); toast('Cost updated');
}
function removeCreatorFromCamp(cid,crId){
  const c=campOf(cid), n=c.posts.filter(p=>p.creator===crId).length;
  if(n) return toast(`Remove its ${n} post${n===1?'':'s'} first`);
  c.creatorIds=c.creatorIds.filter(x=>x!==crId); paintBody(); toast('Creator removed from campaign');
}
function crToggle(id){ const cur=S.crOpen&&S.crOpen[id]!==undefined?!!S.crOpen[id]:!!S.crAll; S.crOpen={...(S.crOpen||{}),[id]:!cur}; paintBody(); }
function crExpandAll(on){ S.crAll=on; S.crOpen={}; paintBody(); }
function campCreatorsHTML(c,posts){
  const q=(S.crQ||'').toLowerCase().trim(), ft=S.crTier||'All', fs=S.crStatus||'All', fo=S.crOwner||'All', fmo=S.crMonth||'All';
  const all=c.creatorIds.map(crOf).filter(Boolean);
  const rows=all.map(x=>{
    const xp=posts.filter(p=>p.creator===x.id), views=sumOf(xp,'views'), eng=xp.reduce((a,p)=>{const m=campPostMetrics(p);return a+m.likes+m.comments;},0);
    return {x,xp,views,org:sumOf(xp,'organic'),paid:sumOf(xp,'paid'),cost:xp.length?sumOf(xp,'cost'):((c.fees||{})[x.id]||0),er:views?eng/views*100:0,last:xp.map(p=>p.date).sort().pop()||'',owner:campOwnerOf(c,x.id),status:xp.length?'Delivered':'Pending'};
  }).filter(r=>(!q||`${r.x.name} ${r.x.handle}`.toLowerCase().includes(q))&&(ft==='All'||r.x.tier===ft)&&(fs==='All'||r.status===fs)&&(fo==='All'||r.owner===fo)&&(fmo==='All'||r.xp.some(p=>p.date.slice(0,7)===fmo))&&tagFilterOK('camp',r.x.id));
  const tiers=uniq(all.map(x=>x.tier));
  const months=uniq(c.posts.map(p=>p.date.slice(0,7)));
  const toolbar=`<div class="ds-toolbar ds-toolbar--wrap dk-ctools">${campSearchBox('crQ','Search creator or handle')}${tagFilterHTML('camp')}${dsFilter('crTier','Tier',[['All','All tiers'],...tiers.map(t=>[t,t])],ft)}${dsFilter('crOwner','SPOC',[['All','All owners'],...CAMP_OWNERS.map(o=>[o,o])],fo)}${dsFilter('crStatus','Status',[['All','All statuses'],['Delivered','Delivered'],['Pending','Pending']],fs)}${dsFilter('crMonth','Live month',[['All','All months'],...months.map(m=>[m,tlMonLabel(m)])],fmo)}<span class="ds-spacer"></span><label class="cr-tree"><input type="checkbox" ${S.crAll?'checked':''} onchange="crExpandAll(this.checked)"><span>Tree view</span></label>${tbColsBtn('creators')}<button class="ds-btn ds-btn--primary ds-btn--sm" onclick="openAttachTo('campaign','${c.id}')">${icon('plus','ico-sm')}Add creators</button></div>`;
  const dash=(has,v)=>has?v:'—';
  const isOpen=id=>S.crOpen&&S.crOpen[id]!==undefined?!!S.crOpen[id]:!!S.crAll;
  const mixCells=xp=>{
    if(!xp.length) return {prod:'—',con:'—',type:'—'};
    const prods=uniq(xp.map(p=>p.product).filter(Boolean)), cons=uniq(xp.map(p=>p.concept).filter(Boolean));
    const more=a=>a.length>1?` <span class="ct-more">+${a.length-1}</span>`:'';
    const b=xp.filter(isBoost).length;
    const type=b===0?'<span class="ct-type is-org">Organic</span>':b===xp.length?'<span class="ct-type is-boost">Boosted</span>':'<span class="ct-type is-mix">Mixed</span>';
    return {prod:prods.length?`<span class="ct-mix">${esc(prods[0])}${more(prods)}</span>`:'—', con:cons.length?`<span class="ct-mix">${ctTag(cons[0])}${more(cons)}</span>`:'—', type};
  };
  const body=rows.map(r=>{ const has=r.xp.length>0, open=has&&isOpen(r.x.id);
    const parent=`<tr class="cr-parent${open?' is-open':''}"><td class="cs-first"><div class="ds-who">${has?`<button type="button" class="cr-tog${open?' open':''}" aria-expanded="${open}" aria-label="${open?'Collapse':'Expand'} ${esc(r.x.name)}" onclick="crToggle('${r.x.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>`:'<span class="cr-tog-gap"></span>'}${dsAv(r.x.id,r.x.name)}<span class="ds-who-text"><button class="ds-namebtn" onclick="openCreatorSide('${r.x.id}')">${esc(r.x.name)}</button><small>${esc(r.x.handle)}</small></span></div></td>
      <td>${tierTag(r.x.tier)}</td>
      <td><select class="ds-select cr-owner tb-tagsel" aria-label="SPOC for ${esc(r.x.name)}" onchange="setCampOwner('${c.id}','${r.x.id}',this.value)">${CAMP_OWNERS.map(o=>`<option ${o===r.owner?'selected':''}>${o}</option>`).join('')}</select></td>
      <td class="ds-num">${r.xp.length}</td><td class="dk-nw">${has?campDate(r.last):'—'}</td><td class="ct-product">${mixCells(r.xp).prod}</td><td>${mixCells(r.xp).con}</td><td>${mixCells(r.xp).type}</td>
      <td class="ds-num">${dash(has,exactN(r.views))}</td><td class="ds-num">${dash(has,exactN(r.org))}</td><td class="ds-num">${dash(has,exactN(r.paid))}</td><td class="ds-num">${dash(has,r.er.toFixed(1)+'%')}</td>
      <td class="ds-num">${has?`<span class="cr-cost-sum" title="Sum of this creator's post costs">${rupees(r.cost)}</span>`:`<label class="cr-cost"><span class="cr-rupee" aria-hidden="true">₹</span><input type="text" inputmode="numeric" autocomplete="off" value="${Math.round(r.cost)}" aria-label="Fee for ${esc(r.x.name)}" onchange="setCreatorCost('${c.id}','${r.x.id}',this.value)"></label>`}</td>
      <td class="ds-num">${dash(has,cpvOf(r.cost,r.views))}</td><td>${tagCellHTML(r.x.id)}</td><td>${dsBadge(r.status,has?'success':'warn')}</td>
      <td class="cs-last"><details class="ds-more"><summary class="ds-btn ds-btn--outline ds-btn--sm" aria-label="More options for ${esc(r.x.name)}">⋯</summary><div class="ds-more-menu"><button class="is-danger" onclick="removeCreatorFromCamp('${c.id}','${r.x.id}')">Remove creator</button></div></details></td></tr>`;
    if(!open) return parent;
    const kids=[...r.xp].sort((x,y)=>String(y.date).localeCompare(String(x.date))).slice(0,3);
    const kidRows=kids.map((p,ki)=>{ const m=campPostMetrics(p);
      return `<tr class="cr-child${ki===kids.length-1?' cr-last':''}" data-parent="${r.x.id}"><td class="cs-first"><div class="ct-post-cell">${ctThumb(p)}<div class="ct-post-meta"><span class="ct-kind">${CT_LABEL[ctKind(p)]}</span>${p.url?`<span class="ct-link" title="${esc(p.url)}">${esc(p.url.replace(/^https?:\/\//,''))}</span>`:'<span class="ct-link">No link added</span>'}</div>${p.id?`<button type="button" class="pl-detail ct-detail" aria-label="Open post details" title="Post details" onclick="event.stopPropagation();psOpen('${esc(String(p.id))}')">${PS_ICON}</button>`:''}${p.url?`<a class="ct-open" href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="Open post link" title="Open post" onclick="event.stopPropagation()">${CT_ARROW}</a>`:''}</div></td>
        <td></td><td></td><td class="ds-num">1</td><td class="dk-nw">${campDate(p.date)}</td><td class="ct-product">${esc(p.product)}</td><td>${ctTag(p.concept)}</td><td><span class="ct-type ${isBoost(p)?'is-boost':'is-org'}">${isBoost(p)?'Boosted':'Organic'}</span></td>
        <td class="ds-num">${exactN(p.views)}</td><td class="ds-num">${exactN(p.organic)}</td><td class="ds-num">${exactN(p.paid)}</td><td class="ds-num">${m.er.toFixed(1)}%</td>
        <td class="ds-num" onclick="event.stopPropagation()"><label class="cr-cost"><span class="cr-rupee" aria-hidden="true">₹</span><input type="text" inputmode="numeric" autocomplete="off" value="${Math.round(p.cost||0)}" aria-label="Cost for this post" onchange="setPostCost('${c.id}','${p.id}',this.value)"></label></td><td class="ds-num">${cpvOf(p.cost||0,p.views)}</td><td></td><td></td><td class="cs-last" onclick="event.stopPropagation()"><details class="ds-more"><summary class="ds-btn ds-btn--outline ds-btn--sm" aria-label="More options for this post">⋯</summary><div class="ds-more-menu"><button class="is-danger" onclick="openRemovePost('${c.id}','${p.id}')">Remove post</button></div></details></td></tr>`; }).join('');
    return parent+kidRows;
  }).join('')||'<tr><td colspan="16" class="ds-empty">No creators match these filters.</td></tr>';
  return `${toolbar}<div class="ds-table-wrap cr-wrap"><table class="ds-table cr-table"><thead><tr><th class="cs-first">Creator</th><th>Tier</th><th>SPOC</th><th class="ds-num">Reels</th><th>Last live</th><th>Product</th><th>Concept</th><th>Type</th><th class="ds-num">Views</th><th class="ds-num">Organic</th><th class="ds-num">Paid</th><th class="ds-num">ER%</th><th class="ds-num">Cost</th><th class="ds-num">CPV</th><th>Tags</th><th>Status</th><th class="cs-last"></th></tr></thead><tbody>${body}</tbody></table></div>`;
}

function campPlanEmbedHTML(c){
  if(S.plCampId!==c.id||!S.plDraft){ S.plDraft=plDraftFrom(c.plan||null); S.plCampId=c.id; }
  S.plDraft.open={s3:true,s4:true,s5:true};
  setTimeout(()=>{ if(document.getElementById('plLeft')) plPaint(); },0);
  return `<div class="cb-plan"><div class="pl-embed"><div class="pl-left" id="plLeft"></div><aside class="pl-right" id="plSide"></aside></div>
    <div class="ds-actions"><button class="ds-btn ds-btn--primary" onclick="saveCampPlan('${c.id}')">Save brief</button></div></div>`;
}
function saveCampPlan(id){
  const c=campOf(id), d=S.plDraft; if(!d.name.trim()) return toast('Enter a plan name');
  c.plan=plFields(d); toast('Brief saved'); openCampBrief(id);
}
/* Brief: read-only view in the drawer, with Edit switching to the plan editor */
function openCampBrief(id,edit){
  const c=campOf(id); if(!c) return;
  const body=edit?campPlanEmbedHTML(c):campBriefReadHTML(c);
  const head=edit?'':`<button class="ds-btn ds-btn--primary ds-btn--sm" onclick="openCampBrief('${c.id}',true)">Edit</button>`;
  openDrawer(esc(c.name),edit?'Brief':campBriefMetaHTML(c),body,head,'cbs-drawer');
}
function campBriefMetaHTML(c){
  const d=plDraftFrom(c.plan||null);
  const prods=d.products&&d.products.length?d.products:[c.product||'Plix Vitamin C Glow Serum 30 ml'];
  return `<span class="cbs-meta">${esc(prods.join(' · '))} · Manager ${esc(c.manager||'Ankit')} · Starts ${campDate(c.created||TODAY)} · <span class="cbs-state">${c.status==='Completed'?'Completed':'Live'}</span></span>`;
}
function campBriefReadHTML(c){
  const d=plDraftFrom(c.plan||null);
  const L=(a,fb)=>a&&a.length?a.map(x=>esc(String(x))).join(', '):fb;
  const T=(v,fb)=>v?esc(v):fb;
  const money=v=>v?rupees(v):rupees(c.budget||180000);
  const stat=(l,v,s)=>`<div class="cbs-stat"><span>${l}</span><b>${v}</b>${s?`<small>${s}</small>`:''}</div>`;
  const fact=(l,v)=>`<div class="cbs-fact"><dt>${l}</dt><dd>${v}</dd></div>`;
  const sec=(t,rows)=>`<section class="cbs-sec"><h3>${t}</h3><dl class="cbs-facts">${rows}</dl></section>`;
  const tags=(a,fb)=>a&&a.length?`<div class="cbs-tags">${a.map(x=>`<span>${esc(String(x))}</span>`).join('')}</div>`:`<div class="cbs-tags">${fb.map(x=>`<span>${x}</span>`).join('')}</div>`;
  const prods=d.products&&d.products.length?d.products:[c.product||'Plix Vitamin C Glow Serum 30 ml'];
  const views=d.targetViews||35000000;
  const posts=c.plannedVideos||40;
  const stats=`<div class="cbs-stats">${stat('Budget',money(d.budget),'Planned')}${stat('Target views',exactN(views),'All posts')}${stat('Planned posts',posts,'Reels and posts')}</div>`;
  const obj=sec('Objective and audience',
    fact('Objective',T(d.goal,'Conversion'))+
    fact('Audience ages',L(d.ages,'18–24, 25–34'))+
    fact('Gender',T(d.gender,'All'))+
    fact('Locations',L(d.locations,'India · Maharashtra · Karnataka'))+
    fact('Audience notes',T(d.words,'Skincare-curious, urban, 18–34')));
  const creative=sec('Creative',
    fact('Formats',L(d.formats,'Reel'))+
    fact('Tone',T(d.tone,'Warm, practical, no hard sell'))+
    fact('Key messages',L(d.keyMessages,'Visible glow in 7 days · Vitamin C, non-sticky · Gift-ready packaging'))+
    fact('Must cover',L(d.mustCover,'Application on camera · Before / after'))+
    fact('Must avoid',L(d.mustAvoid,'Medical claims · Competitor names')));
  const bench=sec('Benchmarks and notes',
    fact('Benchmarks',L(d.benchmarks,'5% engagement · ₹0.15 cost per view'))+
    fact('Notes',T(d.notes||d.productNotes,'Share usage clip within 48 hours of posting.')));
  const activity=`<section class="cbs-sec"><h3>Recent changes</h3><ul class="cbs-log"><li><span>Brief updated</span><small>Today, 11:20 · Ankit</small></li><li><span>Key messages edited</span><small>2 Nov · Priya</small></li><li><span>Budget raised to ${money(d.budget)}</span><small>28 Oct · Rahul</small></li></ul></section>`;
  return `<div class="cbs">${stats}${obj}${creative}${bench}${activity}</div>`;
}
const campCreators = [
  { name:'Pavan K Sirisin', handle:'@pavansirisin', tier:'Macro', reels:2, views:'480K', org:'320K', paid:'160K', er:'5.0%', cost:'₹45K', cpv:'₹0.09', status:'delivered', viral:false },
  { name:'Gaurav Sunil', handle:'@gaurav_kaizoku', tier:'Mega', reels:1, views:'420K', org:'380K', paid:'40K', er:'7.4%', cost:'₹80K', cpv:'₹0.19', status:'delivered', viral:true },
  { name:'Ananya Beauty', handle:'@ananyabeauty', tier:'Mega', reels:1, views:'310K', org:'180K', paid:'130K', er:'5.8%', cost:'₹60K', cpv:'₹0.19', status:'delivered' },
  { name:'Kylie', handle:'@kyliejenner', tier:'Micro', reels:2, views:'260K', org:'190K', paid:'70K', er:'4.6%', cost:'₹30K', cpv:'₹0.12', status:'delivered' },
  { name:'Vedictoons', handle:'@vedictoons', tier:'Macro', reels:1, views:'180K', org:'140K', paid:'40K', er:'5.0%', cost:'₹35K', cpv:'₹0.19', status:'delivered' },
  { name:'Marques', handle:'@marquesbrownlee', tier:'Micro', reels:0, views:'—', org:'—', paid:'—', er:'—', cost:'₹20K', cpv:'—', status:'pending' },
  { name:'Priyanka', handle:'@priyankachopra', tier:'Micro', reels:0, views:'—', org:'—', paid:'—', er:'—', cost:'₹25K', cpv:'—', status:'pending' },
];

const campReels = [
  { creator:'Pavan K Sirisin', handle:'@pavansirisin', concept:['Routine','Before/After'], date:'Oct 8', views:'290K', likes:'15K', comments:'892', er:'5.5%', type:'boosted', cost:'₹25K', cpv:'₹0.09' },
  { creator:'Pavan K Sirisin', handle:'@pavansirisin', concept:['Unboxing'], date:'Oct 18', views:'190K', likes:'9K', comments:'534', er:'5.0%', type:'organic', cost:'₹20K', cpv:'₹0.11' },
  { creator:'Gaurav Sunil', handle:'@gaurav_kaizoku', concept:['Review','Before/After'], date:'Oct 12', views:'420K', likes:'31K', comments:'2.1K', er:'7.4%', type:'organic', cost:'₹80K', cpv:'₹0.19', viral:true },
  { creator:'Ananya Beauty', handle:'@ananyabeauty', concept:['Routine'], date:'Oct 10', views:'310K', likes:'18K', comments:'1.2K', er:'5.8%', type:'boosted', cost:'₹60K', cpv:'₹0.19' },
  { creator:'Kylie', handle:'@kyliejenner', concept:['Before/After'], date:'Oct 6', views:'150K', likes:'7K', comments:'420', er:'4.9%', type:'boosted', cost:'₹15K', cpv:'₹0.10' },
  { creator:'Kylie', handle:'@kyliejenner', concept:['Unboxing'], date:'Oct 20', views:'110K', likes:'5K', comments:'312', er:'4.8%', type:'organic', cost:'₹15K', cpv:'₹0.14' },
  { creator:'Vedictoons', handle:'@vedictoons', concept:['Routine'], date:'Oct 15', views:'180K', likes:'9K', comments:'678', er:'5.4%', type:'organic', cost:'₹35K', cpv:'₹0.19' },
];

const ini=n=>n.split(' ').map(w=>w[0]).join('');
const ANA_AV=['#7c3aed','#9d174d','#1d4ed8','#c2410c','#075985','#15803d','#1e40af','#c2410c','#be185d','#1e40af'];
const ANA_TIER={Mega:['#dbeafe','#1e40af'],Macro:['#dbeafe','#1d4ed8'],Micro:['#f1f5f9','#1e40af']};
const anaCreatorRows=()=>campCreators.filter(c=>c.status==='delivered');
const anaReelRow=(r,pid)=>{ const key='k'+Object.keys(ANA_KIDS).length; ANA_KIDS[key]=r; return `<tr class="ana-child" data-p="${pid}">
  <td>${postLinkCell({format:'Reel',open:`openAnaReel('${key}')`,url:`https://www.instagram.com/reel/${(r.handle||'').replace('@','')}_${(r.date||'').replace(/\s/g,'')}`},r.creator)}</td>
  <td></td><td>${r.views}</td><td class="ana-mute">${r.type==='organic'?r.views:'—'}</td><td class="ana-mute">${r.type==='boosted'?r.views:'—'}</td><td>${r.er}</td><td>${r.cost}</td><td>${r.cpv}</td></tr>`; };
function openAnaReel(key){
  const r=ANA_KIDS[key]; if(!r) return;
  const url=`https://www.instagram.com/reel/${(r.handle||'').replace('@','')}_${(r.date||'').replace(/\s/g,'')}`;
  const concepts=(r.concept||[]).map(c=>dsBadge(c)).join('');
  openDrawer(esc(r.creator),`${esc(r.handle||'')} · Reel posted ${esc(r.date||'')}`,`<div class="ds-grid2 ds-drawer-grid">
    <div class="ds-card ds-pad"><div class="pl-thumb pl-thumb--lg" style="background:${PL_COL.Reel||'#1e40af'}"><b>Reel</b></div><strong>${esc(r.creator)}</strong><span class="ds-caption">${esc(url.replace(/^https?:\/\//,''))}</span><a class="ds-btn ds-btn--outline ds-btn--sm" href="${esc(url)}" target="_blank" rel="noopener">Open original ↗</a></div>
    <div><div class="ds-stats ds-stats--2"><div class="ds-card"><span class="ds-label">Views</span><span class="ds-value">${esc(r.views)}</span></div><div class="ds-card"><span class="ds-label">Engagement rate</span><span class="ds-value">${esc(r.er)}</span></div></div>
    <div class="ds-stats ds-stats--2"><div class="ds-card"><span class="ds-label">Likes</span><span class="ds-value">${esc(r.likes||'—')}</span></div><div class="ds-card"><span class="ds-label">Comments</span><span class="ds-value">${esc(r.comments||'—')}</span></div></div>
    <div class="ds-stats ds-stats--2"><div class="ds-card"><span class="ds-label">Spend</span><span class="ds-value">${esc(r.cost)}</span></div><div class="ds-card"><span class="ds-label">Cost per view</span><span class="ds-value">${esc(r.cpv)}</span></div></div>
    <div class="ds-plan-tags">${r.type==='boosted'?dsBadge('Boosted'):dsBadge('Organic')}${concepts}</div></div></div>
    <div class="ds-drawer-foot"><span class="ds-spacer"></span><button class="ds-btn ds-btn--outline" onclick="closeLayer()">Close</button></div>`);
}
function anaDims(){
  const reels=campReels;
  const byCreator=n=>reels.filter(r=>r.creator===n);
  const byConcept=n=>reels.filter(r=>r.concept.includes(n));
  const byTier=t=>{const names=campCreators.filter(c=>c.tier===t).map(c=>c.name);return reels.filter(r=>names.includes(r.creator));};
  const row=(id,label,o,kids)=>({id,label,reels:o.reels,views:o.views,org:o.org,paid:o.paid,er:o.er,spend:o.spend,cpv:o.cpv,kids});
  const tier=t=>row('t'+t,`<span class="ana-tag" style="background:${ANA_TIER[t][0]};color:${ANA_TIER[t][1]}">${t}</span>`,T[t],byTier(t));
  const T={Mega:{reels:2,views:'730K',org:'560K',paid:'170K',er:'6.6%',spend:'₹1.4L',cpv:'₹0.19'},Macro:{reels:4,views:'850K',org:'600K',paid:'250K',er:'5.1%',spend:'₹1.6L',cpv:'₹0.19'},Micro:{reels:3,views:'220K',org:'162K',paid:'58K',er:'4.5%',spend:'₹60K',cpv:'₹0.14'}};
  return {
    Creator: anaCreatorRows().map((c,i)=>row('c'+i,`<div class="ana-cell"><span class="ana-av" style="background:${ANA_AV[i%ANA_AV.length]}">${ini(c.name)}</span><div class="ana-min"><div class="ana-name">${esc(c.name)}</div><div class="ana-sub">${esc(c.handle)}</div></div></div>`,{reels:c.reels,views:c.views,org:c.org,paid:c.paid,er:c.er,spend:c.cost,cpv:c.cpv},byCreator(c.name))),
    Product: [row('p0','<div class="ana-name">Plix Glow Serum</div>',{reels:9,views:'1.8M',org:'1.2M',paid:'600K',er:'5.4%',spend:'₹4.2L',cpv:'₹0.23'},reels)],
    Concept: [
      row('cn0','<span class="ana-tag">Routine</span>',{reels:4,views:'960K',org:'640K',paid:'320K',er:'5.3%',spend:'₹1.6L',cpv:'₹0.17'},byConcept('Routine')),
      row('cn1','<span class="ana-tag">Before/After</span>',{reels:4,views:'860K',org:'580K',paid:'280K',er:'5.1%',spend:'₹1.2L',cpv:'₹0.14'},byConcept('Before/After')),
      row('cn2','<span class="ana-tag">Unboxing</span>',{reels:3,views:'462K',org:'352K',paid:'110K',er:'4.7%',spend:'₹1.1L',cpv:'₹0.24'},byConcept('Unboxing')),
      row('cn3','<span class="ana-tag">Review</span>',{reels:1,views:'420K',org:'380K',paid:'40K',er:'7.4%',spend:'₹80K',cpv:'₹0.19'},byConcept('Review'))],
    Tier: ['Mega','Macro','Micro'].map(tier),
    Gender: [row('g0','<div class="ana-name">Female</div>',{reels:9,views:'1.8M',org:'1.2M',paid:'600K',er:'5.4%',spend:'₹4.2L',cpv:'₹0.23'},reels)],
    State: [
      row('s0','<div class="ana-name">Maharashtra</div>',{reels:4,views:'790K',org:'500K',paid:'290K',er:'5.2%',spend:'₹1.7L',cpv:'₹0.22'},reels.slice(0,4)),
      row('s1','<div class="ana-name">New York</div>',{reels:3,views:'710K',org:'520K',paid:'190K',er:'5.8%',spend:'₹1.6L',cpv:'₹0.23'},reels.slice(2,5)),
      row('s2','<div class="ana-name">Karnataka</div>',{reels:2,views:'300K',org:'180K',paid:'120K',er:'4.8%',spend:'₹90K',cpv:'₹0.30'},reels.slice(5,7))],
  };
}
/* "Boosted only": keep each row's boosted reels and recompute its totals from them */
const anaN=v=>{ if(typeof v==='number') return v; const m=String(v||'').replace(/[₹,]/g,'').match(/^([\d.]+)\s*([KkMLl]?)/); if(!m) return 0; const mul={K:1e3,k:1e3,M:1e6,L:1e5,l:1e5}; return parseFloat(m[1])*(mul[m[2]]||1); };
const anaFmt=n=>n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?Math.round(n/1e3)+'K':String(Math.round(n));
function anaBoostRow(r){
  const kids=r.kids.filter(k=>k.type==='boosted'); if(!kids.length) return null;
  const v=kids.reduce((a,k)=>a+anaN(k.views),0), sp=kids.reduce((a,k)=>a+anaN(k.cost),0);
  const er=kids.reduce((a,k)=>a+parseFloat(k.er)*anaN(k.views),0)/(v||1);
  return {...r,kids,reels:kids.length,views:anaFmt(v),org:'—',paid:anaFmt(v),er:er.toFixed(1)+'%',spend:'₹'+anaFmt(sp),cpv:v?'₹'+(sp/v).toFixed(2):'—',_v:v,_s:sp,_n:kids.length};
}
let ANA_KIDS={};
function campAnalyticsHTML(dim){
  ANA_KIDS={};
  const on=!!S.anaBoost;
  let rows=anaDims()[dim]||[];
  if(on) rows=rows.map(anaBoostRow).filter(Boolean);
  const aq=(S.anaQ||'').toLowerCase().trim(); if(aq) rows=rows.filter(r=>String(r.label||'').toLowerCase().includes(aq));
  const tot=on?(()=>{const v=rows.reduce((a,r)=>a+r._v,0), sp=rows.reduce((a,r)=>a+r._s,0), n=rows.reduce((a,r)=>a+r._n,0);
    return `<tr class="ana-total"><td>Total</td><td>${n}</td><td>${anaFmt(v)}</td><td>—</td><td>${anaFmt(v)}</td><td>—</td><td>₹${anaFmt(sp)}</td><td>${v?'₹'+(sp/v).toFixed(2):'—'}</td></tr>`;})()
    :`<tr class="ana-total"><td>Total</td><td>9</td><td>1.8M</td><td>1.2M</td><td>600K</td><td>5.4%</td><td>₹4.2L</td><td>₹0.23</td></tr>`;
  const head=[`<th class="ana-l">${esc(dim)}</th>`,'<th>Reels</th>','<th>Views</th>','<th>Organic</th>','<th>Paid</th>','<th>ER%</th>','<th>Spend</th>','<th>CPV</th>'].join('');
  const body=rows.map(r=>`<tr class="ana-row" onclick="anaToggle('${r.id}',this)">
    <td><div class="ana-cell"><span class="ana-chev">${icon('chevRight','ico-sm')}</span>${r.label}</div></td>
    <td>${r.reels}</td><td class="ana-strong">${r.views}</td><td class="ana-mute">${r.org}</td><td class="ana-mute">${r.paid}</td><td>${r.er}</td><td>${r.spend}</td><td class="ana-strong">${r.cpv}</td></tr>`
    +(on?r.kids.filter(k=>k.type==='boosted'):r.kids).map(k=>anaReelRow(k,r.id)).join('')).join('');
  return `<div class="ana-card"><div class="ana-scroll"><table class="ana-table">
    <colgroup><col><col class="ana-c1"><col class="ana-c2"><col class="ana-c3"><col class="ana-c3"><col class="ana-c4"><col class="ana-c2"><col class="ana-c4"></colgroup>
    <thead><tr>${head}</tr></thead><tbody>${body}
    ${tot}
    </tbody></table></div></div>`;
}
function anaDonut(rows){
  const d=[...rows].sort((x,y)=>y.views-x.views), tot=d.reduce((s,r)=>s+r.views,0)||1, RING=2*Math.PI*46;
  let off=0;
  const arcs=d.map((r,i)=>{const len=r.views/tot*RING; const el=`<circle cx="60" cy="60" r="46" fill="none" stroke="${dkCol(i)}" stroke-width="16" stroke-dasharray="${len.toFixed(2)} ${RING.toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 60 60)"/>`; off+=len; return el;}).join('');
  const legend=d.map((r,i)=>`<div><span><i class="dk-sw" style="background:${dkCol(i)}"></i>${esc(r.name)}</span><b>${Math.round(r.views/tot*100)}%</b></div>`).join('');
  return `<div class="ana-donut"><svg viewBox="0 0 120 120" class="dk-donut" role="img" aria-label="Share">${arcs||'<circle cx="60" cy="60" r="46" fill="none" stroke="#f1f5f9" stroke-width="16"/>'}</svg></div><div class="dk-list ana-legend">${legend}</div>`;
}
function anaChartHTML(dim,posts){
  const key={Product:p=>p.product,Concept:p=>p.concept,Tier:p=>crAttr(p.creator,'tier'),Gender:p=>crAttr(p.creator,'gender'),State:p=>crAttr(p.creator,'state')}[dim]||(p=>p.concept);
  const titles={Product:'Share by product',Concept:'Share by concept',Tier:'Share by tier',Gender:'Share by gender',State:'Share by state'};
  const body=posts.length?anaDonut(segRows(posts,key)):dkEmpty();
  return `<div class="ds-card dk-w dk-anachart"><div class="dk-wh"><div class="dk-wt"><span class="ds-section-title">${titles[dim]||dim}</span></div></div><div class="dk-cwidget-body">${body}</div></div>`;
}
function anaBarHTML(){
  return `<div class="ana-bar">${campSearchBox('anaQ','Search creator, product, concept or tier')}${tbColsBtn('analytics')}<label class="ana-chk"><input type="checkbox" ${S.anaBoost?'checked':''} onchange="setPageState('anaBoost',this.checked)"><span>Boosted only</span></label><span class="ana-date">${esc(periodShort(S.cPeriod||'thisMonth',S.cCust))}</span></div>`;
}
function anaSegHTML(dim){
  const dims=anaDims();
  return `<div class="ds-seg ana-seg" role="tablist" aria-label="Group by">${ANA_DIMS.map(d=>`<button type="button" role="tab" aria-selected="${dim===d}" class="${dim===d?'on':''}" onclick="setPageState('cDim','${d}')">${d}<span>${(dims[d]||[]).length}</span></button>`).join('')}</div>`;
}
function anaToggle(id,tr){
  const open=tr.classList.toggle('is-open');
  document.querySelectorAll(`.ana-child[data-p="${id}"]`).forEach(r=>r.classList.toggle('is-open',open));
}
const ANA_DIMS=['Creator','Product','Concept','Tier','Gender','State'];
function campaignTrackingHTML(c,posts){
 const views=sumOf(posts,'views'),spend=sumOf(posts,'cost'),missing=posts.filter(p=>!p.url);
 const rows=posts.slice(0,8).map(p=>{const cr=crOf(p.creator);return `<tr><td><button class="ds-namebtn" onclick="openCampaignPost('${p.id}')">${esc(p.format||'Post')} · ${esc(p.product||'Content')}</button></td><td>${cr?`<button class="ds-namebtn" onclick="openCreatorSide('${cr.id}')">${esc(cr.name)}</button>`:'—'}</td><td><span class="trk-st ${p.url?'ok':'wait'}">${p.url?'Tracked':'Awaiting URL'}</span></td><td class="ds-num">${p.views?exactN(p.views):'—'}</td><td><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openCampaignPost('${p.id}')">Inspect</button></td></tr>`}).join('');
 const card=(label,value,sub,btn)=>`<section class="ds-card" style="padding:14px 16px;display:flex;flex-direction:column;gap:6px"><span class="ds-caption">${label}</span><b style="font-size:18px">${value}</b><p class="ds-caption" style="margin:0">${sub}</p><div>${btn}</div></section>`;
 return `<div class="ds-page"><div class="ds-head"><div><h2 class="ds-section-title" style="margin:0">Tracking · ${esc(c.name)}</h2><p class="ds-page-desc">Tracking setup, post collection and missing-content follow-up for this campaign.</p></div><div class="ds-actions"><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openTrackingConfig('${c.id}')">Manage tracking setup</button><button class="ds-btn ds-btn--primary ds-btn--sm" onclick="S.trackerCampaign='${c.id}';setPage('content-tracker')">View all campaign content →</button></div></div>
 <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px">${card('Tracking setup',c.tracking?'Enabled':'Not enabled','Social handles · Post URL import · Metric refresh · Missing-content checks.',`<button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openTrackingConfig('${c.id}')">Configure tracking</button>`)}${card('Tracked content',`${posts.length-missing.length} <small class="ds-caption">of ${posts.length}</small>`,`${missing.length} awaiting URL · ${exactN(views)} views.`,`<button class="ds-btn ds-btn--outline ds-btn--sm" onclick="S.trackerCampaign='${c.id}';setPage('content-tracker')">Open in Content tracker</button>`)}${card('Performance snapshot',`${exactN(views)} views`,`Spend ${rupees(spend)} · CPV ${spend?cpvOf(spend,views):'—'}.`,`<button class="ds-btn ds-btn--outline ds-btn--sm" onclick="setPageState('cTab','analytics')">View campaign analytics</button>`)}</div>
 <section class="ds-card" style="padding:0;margin-top:12px"><div class="ds-section-head" style="padding:12px 14px"><h3 style="margin:0;font-size:14px">Recent campaign content</h3><button class="ds-btn ds-btn--ghost ds-btn--sm" onclick="S.trackerCampaign='${c.id}';setPage('content-tracker')">See all ${posts.length} posts →</button></div><div class="ds-table-wrap"><table class="ds-table"><thead><tr><th>Post</th><th>Creator</th><th>Status</th><th class="ds-num">Views</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="5" class="ds-caption">No posts yet.</td></tr>'}</tbody></table></div></section>
 <p class="ds-caption" style="margin-top:12px">Campaign tracking is scoped to this campaign. The content tracker is the cross-campaign queue. Both use the same post records.</p></div>`;
}
function returnFromCampaign(){const r=S.campReturn;if(!r){setPage('campaigns');return;}S.page=r.page||'campaigns';S.myCreator=r.myCreator||null;S.discCreator=r.discCreator||null;paintHeader();paintBody(true);window.scrollTo(0,0);}
function campaignGroupOf(c){return (c&&String(c.groupName||'').trim())||((c&&c.product)||'Ungrouped initiative');}
function openCampaignQuick(id){
 const c=campOf(id);if(!c)return;
 const posts=postsForPeriod(c),views=sumOf(posts,'views'),spend=sumOf(posts,'cost');
 const sec=(title,inner,extra='')=>`<section class="ds-card" style="padding:14px 16px;margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b>${title}</b>${extra}</div>${inner}</section>`;
 const people=(c.creatorIds||[]).slice(0,5).map(cid=>{const x=crOf(cid);return x?`<button class="ds-namebtn" style="display:flex;gap:8px;align-items:center;padding:6px 0" onclick="openCreatorSide('${cid}')">${dsAv(cid,x.name)}<span>${esc(x.name)}</span><span class="ds-caption">${(c.posts||[]).filter(p=>p.creator===cid).length} posts</span></button>`:'';}).join('');
 const fact=(k,v)=>`<div><span class="ds-caption">${k}</span><div>${v}</div></div>`;
 const others=CAMP_LIST.filter(x=>x.id!==c.id&&campaignGroupOf(x)===campaignGroupOf(c)).map(x=>`<button class="ds-namebtn" style="display:block;padding:4px 0" onclick="openCampaignQuick('${x.id}')">${esc(x.name)} <span class="ds-caption">${esc(x.status||'')}</span></button>`).join('');
 const body=`<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:12px"><div><span class="ds-caption">Creators</span><b style="display:block">${c.creatorIds.length}</b></div><div><span class="ds-caption">Posts</span><b style="display:block">${posts.length}</b></div><div><span class="ds-caption">Views</span><b style="display:block">${exactN(views)}</b></div><div><span class="ds-caption">Spend</span><b style="display:block">${rupees(spend)}</b></div></div>`
 +sec('Campaign snapshot',`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${fact('Initiative',esc(campaignGroupOf(c)))}${fact('Product',esc(c.product||'—'))}${fact('Category',esc(c.category||'—'))}${fact('Objective',esc(c.objective||'—'))}${fact('Owner',esc(c.manager||'Unassigned'))}${fact('Budget',rupees(c.budget||0))}${fact('Tracking',c.tracking?'Enabled':'Not enabled')}</div>`)
 +sec('Creator participation',people||'<p class="ds-caption">No creators added.</p>',`<span class="ds-caption">${c.creatorIds.length} creators</span>`)
 +sec('Delivery and performance',`<p style="margin:0">${posts.length} posts · ${exactN(views)} views · ${spend?cpvOf(spend,views):'—'} CPV</p><p class="ds-caption" style="margin:4px 0 0">Campaign-level results. Creator lifetime performance remains on each creator profile.</p>`)
 +sec('Other campaigns in this initiative',others||'<p class="ds-caption">This initiative currently has one campaign.</p>')
 +`<div class="ds-actions"><button class="ds-btn ds-btn--primary" onclick="closeLayer();openCampaign('${id}')">Open campaign in detail →</button><button class="ds-btn ds-btn--outline" onclick="closeLayer();S.trackerCampaign='${id}';setPage('content-tracker')">View campaign content</button></div>`;
 openDrawer(`${dsMedia(c.id)}<span>${esc(c.name)}</span>`,`${esc(c.product||'')} · ${esc(c.category||'')}`,body);
 const d=document.querySelector('#layer .ds-drawer');if(d)d.classList.add('ds-drawer--side');
}
function campaignDetailHTML(){
  const c=campOf(S.campId); if(!c) return notFoundDS();
  let tab=S.cTab==='brief'?'performance':(S.cTab||'performance');
  if(tab==='posts') tab='content';
  if(tab==='overview') tab='performance';
  if(tab==='tracking') tab='content';
  if(['breakdown','summary','products','settings'].includes(tab)){ S.cSub=tab; tab='analytics'; }
  const posts=postsForPeriod(c);
  const views=sumOf(posts,'views'), spend=sumOf(posts,'cost'), org=sumOf(posts,'organic'), paid=sumOf(posts,'paid');
  const productsOf=[...new Set(posts.map(p=>p.product))].map(n=>({n,ps:posts.filter(p=>p.product===n)}));
  const withCamp=posts.map(p=>({...p,campaignId:c.id,campaignName:c.name}));
  let body='';
  if(tab==='performance') body=campPerformanceHTML(c,posts);
  else if(tab==='content') body=tbWrap('content',campContentHTML(c,withCamp));
  else if(tab==='tracking') body=campaignTrackingHTML(c,posts);
  else if(tab==='creators') body=tbWrap('creators',campCreatorsHTML(c,c.posts));
  else if(tab==='analytics'){
    const dim=S.cDim||'Creator';
    const aPosts=S.anaBoost?posts.filter(p=>p.paid>0):posts;
    body=dim==='Creator'
      ?`<div class="ana-top">${anaSegHTML(dim)}${anaBarHTML()}</div>${campAnalyticsHTML(dim)}`
      :`<div class="ana-top">${anaSegHTML(dim)}${anaBarHTML()}</div><div class="dk-shell dk-ana"><div class="dk-main">${campAnalyticsHTML(dim)}</div><aside class="dk-widgets">${anaChartHTML(dim,aPosts)}</aside></div>`;
    body=tbWrap('analytics',body);
  }
  const tabsOpts=[['performance','Overview'],['creators',`Creators (${c.creatorIds.length})`],['content',`Content (${posts.length})`],['analytics','Analytics']];
  return `<div class="ds-page">
    <div class="crumb"><button class="link" onclick="setPage('campaigns')">Campaigns</button> / ${esc(c.name)}</div>
    <header class="cdh">
      <div class="cdh-top">
        <button class="ds-dh-back" aria-label="Back to previous page" onclick="returnFromCampaign()">${dsBackSvg}</button>
        ${dsMedia(c.id)}
        <div class="cdh-main">
          <div class="cdh-title"><h1>${esc(c.name)}</h1><span class="life ${c.status==='Active'?'life--live':'life--done'}"><i></i>${c.status==='Active'?'Live':'Completed'}</span>${c.legacy?'<span class="cdh-chip">Legacy</span>':''}<span class="cdh-chip ${c.tracking?'is-ok':''}">${c.tracking?'Tracking on':'Tracking stopped'}</span><span class="cdh-chip">${esc(c.category||'')}</span></div>
          <div class="cdh-meta">${esc(c.product)} · Start ${campDate(c.created)} · Manager ${esc(c.manager||'Unassigned')}</div>
        </div>
        <div class="cdh-actions"><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openCampBrief('${c.id}')">Brief</button><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openTrackingConfig('${c.id}')">${icon('gear','ico-sm')}Tracking configuration</button><details class="ds-more"><summary class="ds-btn ds-btn--outline ds-btn--sm" aria-label="More campaign actions" title="More actions">⋯</summary><div class="ds-more-menu"><button onclick="exportCampaign('${c.id}')">Export campaign data</button>${c.status!=='Completed'?`<button onclick="markCampaignEnded('${c.id}')">Mark as campaign ended</button>`:''}<button class="is-danger" onclick="openDeleteCampaign('${c.id}')">Delete campaign</button></div></details></div>
      </div>
      <div class="cdh-tabs">${dsTabsFor('cTab',tabsOpts,tab)}</div>
    </header>
    ${body}
  </div>`;
}
/* ---------- Dialogs ---------- */
const dlgFld=(label,id,val,type='text')=>`<label class="ds-field"><span>${label}</span><input id="${id}" type="${type}" value="${esc(val)}"></label>`;
const dlgSel=(label,id,opts,val)=>`<label class="ds-field"><span>${label}</span><select id="${id}">${opts.map(o=>`<option ${o===val?'selected':''}>${esc(o)}</option>`).join('')}</select></label>`;
/* Creator picker for campaigns: a table of the shortlist with all columns, one checkbox per row */
const dlgCreatorTable=(ids,pool)=>{
  const rows=pool.map(c=>`<tr data-q="${esc(`${c.name} ${c.handle}`.toLowerCase())}" class="${ids.includes(c.id)?'is-sel':''}"><td class="ds-cb"><input type="checkbox" class="cr-choice" value="${c.id}" aria-label="Select ${esc(c.name)}" ${ids.includes(c.id)?'checked':''}></td><td class="cs-first"><div class="ds-who">${dsAv(c.id,c.name)}<span class="ds-who-text"><b>${esc(c.name)}</b><small>${esc(c.handle)}</small></span></div></td><td>${esc(c.tier||'—')}</td><td class="ds-num">${c.followers?fmt(c.followers):'—'}</td><td class="ds-num">${c.views?fmt(c.views):'—'}</td><td class="ds-num">${c.engagement?c.engagement+'%':'—'}</td><td>${esc(c.country||'—')}</td><td>${esc((c.platforms||[]).join(', ')||'—')}</td><td>${esc(c.source||'—')}</td></tr>`).join('');
  return `<div class="dlg-ct"><div class="ds-table-wrap dk-scroll dlg-ct-scroll"><table class="ds-table ds-table--wide"><thead><tr><th class="ds-cb"></th><th class="cs-first">Creator</th><th>Tier</th><th class="ds-num">Followers</th><th class="ds-num">Avg views</th><th class="ds-num">Engagement</th><th>Country</th><th>Platforms</th><th>Source</th></tr></thead><tbody>${rows||'<tr><td colspan="9" class="ds-table-meta">No shortlisted creators yet. Shortlist creators in a campaign plan first.</td></tr>'}</tbody></table></div></div>`;
};
const dlgShortlistPool=(extra=[])=>{ const ids=new Set([...CAMP_PLANS.flatMap(p=>p.shortlisted||[]),...extra]); return DISC.filter(c=>ids.has(c.id)); };
const dlgVal=id=>(document.getElementById(id)?.value||'').trim();
const dlgChecked=()=>[...document.querySelectorAll('.cr-choice:checked')].map(x=>x.value);
function dlg(title,desc,body,footer){ showModal(title,`<div class="ds-page ds-dlg"><p class="ds-caption">${desc}</p><div class="ds-form">${body}</div></div>`,footer); }
const dlgFoot=(save,label='Save')=>`<button class="ds-btn ds-btn--primary" onclick="${save}">${label}</button>`;

const PL_GOALS=[{k:'Awareness',d:'Reach new people',w:55},{k:'Engagement',d:'Start conversations',w:50},{k:'Conversion',d:'Drive purchases',w:40},{k:'UGC',d:'Source content to reuse',w:65}];
const PL_AGES=['13–17','18–24','25–34','35–44','45+'];
const PL_FORMATS=['Reel','Carousel','Static','Story'];
function plDraftFrom(p){
  const q=p||{};
  return {name:q.name||'',products:q.products||(q.product?[q.product]:[]),productNotes:q.productNotes||'',budget:q.budget||0,targetViews:q.targetViews||0,
    goal:q.objective&&PL_GOALS.some(g=>g.k===q.objective)?q.objective:'',
    ages:(q.audience&&q.audience.ages)||[],gender:(q.audience&&q.audience.gender)||'All',locations:(q.audience&&q.audience.locations)||[],words:(q.audience&&q.audience.words)||'',
    mustCover:(q.content&&q.content.mustCover)||[],mustAvoid:(q.content&&q.content.mustAvoid)||[],formats:(q.content&&q.content.formats)||[q.format||'Reel'],tone:(q.content&&q.content.tone)||'',keyMessages:(q.content&&q.content.keyMessages)||[],
    benchmarks:(q.compare&&q.compare.benchmarks)||[],competitorExclusive:!!(q.compare&&q.compare.competitorExclusive),notes:(q.compare&&q.compare.notes)||'',
    open:{s3:false,s4:false,s5:false}};
}
function openPlanForm(mode,id){
  S.plMode=mode; S.plId=id; S.plDraft=plDraftFrom(mode==='edit'?planOf(id):null);
  closeLayer();
  const title=mode==='edit'?'Edit campaign plan':'New campaign plan';
  document.getElementById('layer').insertAdjacentHTML('beforeend',`<div class="pl-back" onclick="if(event.target===this)closeLayer()"><div class="pl-modal" role="dialog" aria-modal="true" aria-label="${title}">
    <header class="pl-head"><div><h2>${title}</h2><p>Say what you're promoting and the goal. The rest sharpens the score.</p></div><button class="ds-iconbtn" aria-label="Close" onclick="closeLayer()">×</button></header>
    <div class="pl-body"><div class="pl-left" id="plLeft"></div><aside class="pl-right" id="plSide"></aside></div>
    <footer class="pl-foot"><button class="ds-btn ds-btn--primary" id="plSave" onclick="savePlanDraft()">${mode==='edit'?'Save plan':'Create campaign plan'}</button></footer></div></div>`);
  plPaint();
}
function plLeftHTML(d){
  const tag=(t,c='')=>`<em class="pl-tag ${c}">${t}</em>`;
  const chips=(k,arr,max)=>arr.map((v,i)=>`<span class="pl-chip is-on">${esc(v)}<button type="button" aria-label="Remove ${esc(v)}" onclick="plRemIn('${k}',${i})">×</button></span>`).join('');
  const tagInput=(k,id,ph,max)=>`<span class="pl-chips">${chips(k,d[k])}<input id="${id}" class="pl-inline" placeholder="${ph}" onkeydown="plKey(event,'${k}','${id}',${max})" onblur="plCommit('${k}','${id}',${max})"></span>`;
  const sec=(n,title,opt,badge,body,key)=>{const open=!opt||d.open[key]; return `<section class="pl-sec">
      <button type="button" class="pl-sh" ${opt?`onclick="plOpen('${key}')"`:'tabindex="-1"'}><span class="pl-num">${n}</span><b>${title}</b>${opt?'<span class="ds-caption">Optional</span>':''}${badge}<span class="pl-spacer"></span>${opt?`<span class="pl-chev">${open?'⌃':'⌄'}</span>`:''}</button>
      ${open?body:''}</section>`;};
  const goal=PL_GOALS.find(g=>g.k===d.goal);
  const s1=`<div class="pl-f"><span>Name ${tag('Required','pl-tag--req')} ${tag('Not scored')}</span><input value="${esc(d.name)}" placeholder="e.g. Diwali gifting 2026" oninput="plSetV('name',this.value)"></div>
    <div class="pl-f"><span>Products <small>up to 5</small> ${tag('Not scored')}</span>${tagInput('products','plProd','Add product',5)}</div>
    <div class="pl-f"><span>Product notes ${tag('Context')}</span><input value="${esc(d.productNotes)}" placeholder="A launch, an offer, a price point" oninput="plSetV('productNotes',this.value)"></div>
    <div class="pl-f"><span>Planned budget (₹) ${tag('Not scored')}</span><input type="number" min="0" value="${d.budget}" oninput="plSetV('budget',Number(this.value)||0)"></div>
    <div class="pl-f"><span>Target views ${tag('Not scored')}</span><input type="number" min="0" value="${d.targetViews||0}" oninput="plSetV('targetViews',Number(this.value)||0)"></div>`;
  const s2=`<div class="pl-goals">${PL_GOALS.map(g=>`<button type="button" class="pl-goal${d.goal===g.k?' is-on':''}" onclick="plGoal('${g.k}')"><b>${g.k}</b><small>${g.d}</small><span class="pl-wbar"><i style="width:${g.w}%"></i><i style="width:${100-g.w}%"></i></span><em>${g.w} · ${100-g.w}</em></button>`).join('')}</div>
    <p class="ds-caption">${goal?'Fit and performance weights follow this goal.':'No goal picked: a balanced split is used.'}</p>`;
  const s3=`<div class="pl-f"><span>Age ranges ${tag('Scored','pl-tag--score')}</span><span class="pl-chips">${PL_AGES.map(a=>`<button type="button" class="pl-chip${d.ages.includes(a)?' is-on':''}" onclick="plToggleIn('ages','${a}')">${a}</button>`).join('')}</span></div>
    <div class="pl-f"><span>Gender ${tag('Scored','pl-tag--score')}</span><span class="ds-seg">${['All','Women','Men'].map(g=>`<button type="button" class="${d.gender===g?'on':''}" onclick="plSetV('gender','${g}');plPaint()">${g}</button>`).join('')}</span></div>
    <div class="pl-f"><span>Locations <small>up to 10</small> ${tag('Scored','pl-tag--score')}</span>${tagInput('locations','plLoc','Add a country or city',10)}</div>
    <div class="pl-f"><span>In your words ${tag('Context')}</span><input value="${esc(d.words)}" placeholder="e.g. Festive gifters buying for family" oninput="plSetV('words',this.value)"></div>`;
  const s4=`<div class="pl-f"><span>Must cover ${tag('Scored','pl-tag--score')}</span>${tagInput('mustCover','plCov','Add a topic',20)}</div>
    <div class="pl-f"><span>Must avoid ${tag('Flagged','pl-tag--flag')}</span>${tagInput('mustAvoid','plAvo','Add a topic',20)}</div>
    <div class="pl-f"><span>Formats ${tag('Context')}</span><span class="pl-chips">${PL_FORMATS.map(f=>`<button type="button" class="pl-chip${d.formats.includes(f)?' is-on':''}" onclick="plToggleIn('formats','${f}')">${f}</button>`).join('')}</span></div>
    <div class="pl-f"><span>Tone ${tag('Context')}</span><input value="${esc(d.tone)}" placeholder="e.g. casual" oninput="plSetV('tone',this.value)"></div>
    <div class="pl-f"><span>Key messages ${tag('Context')}</span>${tagInput('keyMessages','plMsg','Add a message',20)}</div>`;
  const benchOpts=DISC.filter(c=>!d.benchmarks.includes(c.id)).map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
  const s5=`<div class="pl-f"><span>Benchmark creators <small>up to 5</small> ${tag('Adds a part','pl-tag--score')}</span><span class="pl-chips">${d.benchmarks.map((id,i)=>`<span class="pl-chip is-on">${esc(cNameOf(id))}<button type="button" aria-label="Remove" onclick="plRemIn('benchmarks',${i})">×</button></span>`).join('')}<select class="pl-inline" onchange="plBench(this.value)"><option value="">+ Add creator</option>${benchOpts}</select></span></div>
    <label class="pl-f pl-toggle"><span>Competitor exclusivity ${tag('Flagged','pl-tag--flag')}</span><span class="pl-chips"><input type="checkbox" ${d.competitorExclusive?'checked':''} onchange="plSetV('competitorExclusive',this.checked);plPaint()"> Flag creators who posted for a competitor</span></label>
    <div class="pl-f"><span>Notes ${tag('Context')}</span><textarea rows="2" placeholder="A season, a market, a tone" oninput="plSetV('notes',this.value)">${esc(d.notes)}</textarea></div>`;
  return sec(1,'What are we promoting',false,'',s1,'s1')+
         sec(2,'What is the goal',false,'<em class="pl-tag pl-tag--score">Sets the weights</em>',s2,'s2')+
         sec(3,'Who is it for',true,'',s3,'s3')+
         sec(4,'What should the content be',true,'',s4,'s4')+
         sec(5,'Compare and guard',true,'',s5,'s5');
}
function planSideHTML(d){
  const goal=PL_GOALS.find(g=>g.k===d.goal), w=goal?goal.w:55;
  const audience=[d.ages.length?d.ages.join(', '):'',d.gender!=='All'?d.gender:'',d.locations.length?d.locations.join(', '):''].filter(Boolean).join(' · ')||"Your brand profile's ideal customer";
  const tips=[];
  if(!goal) tips.push('Pick a goal so the weights match the brief.');
  if(!d.products.length) tips.push('Add a product so fit is judged on the product.');
  if(!d.mustCover.length) tips.push('Add must-cover topics so content can be checked.');
  if(!d.benchmarks.length) tips.push('Add benchmark creators to score resemblance.');
  const ready=[];
  if(!d.name.trim()) ready.push('<em class="pl-tag pl-tag--flag">Needs a name</em>');
  if(!goal) ready.push('<em class="pl-tag pl-tag--flag">No goal</em>');
  return `<div><div class="pl-side-h">How creators will be scored</div><p class="ds-caption">${goal?goal.k+' goal':'Balanced weights, no goal picked'}</p>
    <div class="pl-wbar pl-wbar--lg"><i style="width:${w}%"></i><i style="width:${100-w}%"></i></div>
    <div class="pl-list" style="margin-top:8px"><div class="pl-kv"><b>Content and audience fit</b><span>${w}%</span></div><div class="pl-kv"><b>Branded performance</b><span>${100-w}%</span></div></div></div>
    <div><div class="pl-side-h">Scored</div><div class="pl-list">
      <div class="pl-kv"><span>Audience</span><b>${esc(audience)}</b></div>
      <div class="pl-kv"><span>Content</span><b>${d.mustCover.length?esc(d.mustCover.join(', ')):'Judged against the brand profile'}</b></div>
      <div class="pl-kv"><span>Performance</span><b>Engagement against their own posts</b></div></div></div>
    <div><div class="pl-side-h">Always checked</div><p class="ds-caption">Authenticity and the drop on branded posts${d.competitorExclusive?' · competitor collaborations':''}.</p></div>
    ${tips.length?`<div><div class="pl-side-h">Could be sharper</div><ul class="pl-tips">${tips.slice(0,3).map(t=>`<li>${t}</li>`).join('')}</ul></div>`:''}
    <div><div class="pl-side-h">Ready to score</div><div class="pl-ready">${ready.join('')||'<em class="pl-tag pl-ok">Ready</em>'}</div></div>`;
}
function plPaint(){ const l=document.getElementById('plLeft'); if(l) l.innerHTML=plLeftHTML(S.plDraft); plSide(); if(typeof nlSyncShort==='function') nlSyncShort(); }
function plSide(){ const el=document.getElementById('plSide'); if(el) el.innerHTML=planSideHTML(S.plDraft); }
function plSetV(k,v){ S.plDraft[k]=v; plSide(); if(typeof nlSyncShort==='function') nlSyncShort(); }
function plOpen(s){ S.plDraft.open[s]=!S.plDraft.open[s]; plPaint(); }
function plGoal(g){ S.plDraft.goal=S.plDraft.goal===g?'':g; plPaint(); }
function plToggleIn(k,v){ const a=S.plDraft[k]; S.plDraft[k]=a.includes(v)?a.filter(x=>x!==v):[...a,v]; plPaint(); }
function plRemIn(k,i){ S.plDraft[k]=S.plDraft[k].filter((_,j)=>j!==i); plPaint(); }
function plBench(id){ if(!id) return; const a=S.plDraft.benchmarks; if(a.length>=5) return toast('Up to 5 benchmark creators'); if(!a.includes(id)) S.plDraft.benchmarks=[...a,id]; plPaint(); }
function plCommit(k,inputId,max){
  const el=document.getElementById(inputId); const v=((el&&el.value)||'').trim(); if(!v) return;
  const a=S.plDraft[k]; if(a.length>=max){ toast(`Up to ${max}`); return; }
  if(!a.includes(v)){ S.plDraft[k]=[...a,v]; plPaint(); }
}
function plKey(e,k,inputId,max){ if(e.key==='Enter'){ e.preventDefault(); plCommit(k,inputId,max); const el=document.getElementById(inputId); if(el) el.focus(); } }
function plFields(d){
  return {name:d.name.trim(),products:d.products,product:d.products[0]||'',productNotes:d.productNotes,objective:d.goal||'Balanced',budget:Number(d.budget)||0,targetViews:Number(d.targetViews)||0,format:d.formats[0]||'Reel',brief:d.productNotes||'',
    audience:{ages:d.ages,gender:d.gender,locations:d.locations,words:d.words},
    content:{mustCover:d.mustCover,mustAvoid:d.mustAvoid,formats:d.formats,tone:d.tone,keyMessages:d.keyMessages},
    compare:{benchmarks:d.benchmarks,competitorExclusive:d.competitorExclusive,notes:d.notes}};
}
function savePlanDraft(){
  const d=S.plDraft; if(!d.name.trim()) return toast('Enter a plan name');
  const f=plFields(d);
  if(S.plMode==='new'){ const nid='pl'+Date.now(); CAMP_PLANS.unshift({id:nid,creators:[],shortlisted:[],created:TODAY,...f}); closeLayer(); openPlan(nid); toast('Campaign plan created'); return; }
  Object.assign(planOf(S.plId),f); closeLayer(); paintBody(); toast('Plan saved');
}
function openAttachTo(kind,id){
  if(kind==='plan'){ openAddToPlan(id); return; }
  S.linkCamp=id; S.linkMode='mine'; S.linkSel=[...campOf(id).creatorIds]; S.linkQ=''; S.linkText=''; S.linkFile=null;
  linkPaint();
}
const linkPool=()=>DISC.filter(c=>!c.repo);
function linkHandles(){
  return (S.linkText||'').split(/[\s,]+/).map(x=>x.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i,'').replace(/[\/?#].*$/,'').replace(/^@/,'').toLowerCase()).filter(Boolean);
}
function linkResolved(){
  if(S.linkMode==='mine') return [...S.linkSel];
  const hs=linkHandles();
  return linkPool().filter(c=>hs.includes(c.handle.replace(/^@/,'').toLowerCase())).map(c=>c.id);
}
function linkClose(){ closeLayer(); }
function linkMode(m){ S.linkMode=m; linkPaint(); }
function linkPaint(){
  closeLayer();
  document.getElementById('layer').insertAdjacentHTML('beforeend',linkDlgHTML());
  linkSync();
}
function linkSync(){
  const n=linkResolved().length, sum=document.getElementById('link-sum'), btn=document.getElementById('link-submit');
  if(sum) sum.textContent=n;
  const lab=document.getElementById('link-sum-lab'); if(lab) lab.textContent=n===1?'creator':'creators';
  if(btn) btn.disabled=!n;
}
function linkChipsHTML(){ const ids=linkResolved(); return ids.length?ids.map(id=>{const c=DISC.find(x=>x.id===id);return `<span class="addn-chip">@${esc(c.handle.replace(/^@/,''))}</span>`;}).join(''):'<span class="addn-empty">Creators you paste will appear here</span>'; }
function linkSetText(v){ S.linkText=v; const hs=linkHandles(), pool=linkPool(); const matched=new Set(linkResolved()); const miss=hs.filter(h=>!pool.some(c=>c.handle.replace(/^@/,'').toLowerCase()===h));
  const note=document.getElementById('link-miss'); if(note) note.textContent=miss.length?`${miss.length} handle${miss.length===1?'':'s'} not in My creators: ${miss.slice(0,4).join(', ')}${miss.length>4?'…':''}`:'';
  const chips=document.getElementById('link-chips'); if(chips) chips.innerHTML=linkChipsHTML();
  linkSync(); }
function linkFile(input){
  const f=input.files&&input.files[0]; if(!f) return;
  const r=new FileReader(); r.onload=()=>{ S.linkFile={name:f.name}; S.linkText=String(r.result||''); linkPaint(); }; r.readAsText(f);
}
function linkToggle(id,on){ S.linkSel=on?[...new Set([...S.linkSel,id])]:S.linkSel.filter(x=>x!==id); const tr=document.querySelector(`#linkTbl tr[data-id="${id}"]`); if(tr) tr.classList.toggle('is-selected',on); linkSync(); }
function linkAll(on){ const ids=linkPool().filter(c=>!S.linkQ||(c.name+' '+c.handle).toLowerCase().includes(S.linkQ)).map(c=>c.id); S.linkSel=on?[...new Set([...S.linkSel,...ids])]:S.linkSel.filter(x=>!ids.includes(x)); linkPaint(); }
function linkFilter(v){ S.linkQ=(v||'').toLowerCase().trim(); document.querySelectorAll('#linkTbl tbody tr').forEach(r=>{r.style.display=r.dataset.q.includes(S.linkQ)?'':'none';}); }
function linkDlgHTML(){
  const m=S.linkMode||'mine', n=linkResolved().length;
  const kb=discSvg('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/>',18), fi=discSvg('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',18), ppl=discSvg('<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.5 3.5 0 0 1 0 7M21 20c0-2.6-1.6-4.8-4-5.6"/>',18);
  const opt=(k,ic,t,d)=>`<button type="button" role="tab" aria-selected="${m===k}" class="addn-opt ${m===k?'on':''}" onclick="linkMode('${k}')"><span class="addn-opt-ico">${ic}</span><span class="addn-opt-txt"><b>${t}</b><small>${d}</small></span></button>`;
  const pool=linkPool(), q=S.linkQ||'';
  const rows=pool.map(c=>{const sel=S.linkSel.includes(c.id);return `<tr data-id="${c.id}" data-q="${esc((c.name+' '+c.handle).toLowerCase())}" class="${sel?'is-selected':''}" style="${q&&!(c.name+' '+c.handle).toLowerCase().includes(q)?'display:none':''}"><td class="ds-cb"><input type="checkbox" aria-label="Select ${esc(c.name)}" ${sel?'checked':''} onchange="linkToggle('${c.id}',this.checked)"></td><td><div class="ds-person">${dsAv(c.id,c.name)}<div class="ds-person-text"><span class="ds-table-title">${esc(c.name)}</span><span class="ds-table-meta">${esc(c.handle)}</span></div></div></td><td>${tierTag(c.tier)}</td><td>${dsBadge(mx(c).status)}</td></tr>`;}).join('');
  const right = m==='mine'
    ? `<div class="addn-pane"><div class="addn-row"><span class="addn-label">Creators you added</span><span class="addn-count"><button type="button" class="ds-btn ds-btn--ghost ds-btn--sm" onclick="linkAll(${S.linkSel.length<pool.length})">${S.linkSel.length<pool.length?'Select all':'Clear all'}</button></span></div>
        <div class="ds-input link-search"><span class="ds-input-icon">${icon('search','ico-sm')}</span><input aria-label="Search creators" placeholder="Search by name or handle" value="${esc(q)}" oninput="linkFilter(this.value)"></div>
        <div class="ds-table-wrap my-wrap link-wrap"><table class="ds-table ds-table--dense my-table" id="linkTbl"><thead><tr><th class="ds-cb"></th><th>Creator</th><th>Tier</th><th>Status</th></tr></thead><tbody>${rows||'<tr><td colspan="4" class="ds-empty">No creators in My creators yet.</td></tr>'}</tbody></table></div></div>`
    : m==='paste'
    ? `<div class="addn-pane"><div class="addn-row"><label class="addn-label" for="link-input">Instagram handles</label></div>
        <textarea id="link-input" class="addn-area" rows="4" placeholder="e.g. @pavansirisin, kyliejenner or https://instagram.com/vedictoons" oninput="linkSetText(this.value)" autocomplete="off">${esc(S.linkText||'')}</textarea>
        <p class="addn-note">Only creators already in My creators can be linked. Separate with commas, spaces or new lines.</p><p class="addn-note addn-warn" id="link-miss"></p>
        <div class="addn-chips" id="link-chips">${linkChipsHTML()}</div></div>`
    : `<div class="addn-pane"><div class="addn-row"><span class="addn-label">CSV file</span></div>
        <label class="addn-drop"><input type="file" accept=".csv,text/csv" hidden onchange="linkFile(this)"><span class="addn-drop-ico">${discSvg('<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',20)}</span>
          ${S.linkFile?`<span class="addn-drop-title">${esc(S.linkFile.name)}</span><span class="addn-drop-sub">Handles read from the file</span>`:`<span class="addn-drop-title"><a>Choose a CSV</a> or drop it here</span><span class="addn-drop-sub">One Instagram handle per row</span>`}</label>
        <p class="addn-note">Only creators already in My creators can be linked.</p><p class="addn-note addn-warn" id="link-miss"></p></div>`;
  return `<div class="disc-cfg-scrim" onclick="if(event.target===this)linkClose()">
    <div class="addn link-addn" role="dialog" aria-modal="true" aria-label="Link creators to campaign">
      <div class="addn-head"><div><h3>Link creators</h3><p>Add creators from My creators to this campaign.</p></div><button type="button" class="ds-iconbtn" aria-label="Close" onclick="linkClose()">${X_SVG}</button></div>
      <div class="addn-body">
        <div class="addn-side" role="tablist" aria-label="Link method">${opt('mine',ppl,'From my creators','Pick from creators you added')}${opt('paste',kb,'Paste handles','Type or paste a list')}${opt('csv',fi,'Import CSV','Upload a spreadsheet export')}</div>
        ${right}
      </div>
      <div class="addn-foot"><span class="addn-sum"><b id="link-sum">${n}</b> <span id="link-sum-lab">${n===1?'creator':'creators'}</span> selected</span><div class="addn-actions"><button type="button" class="ds-btn ds-btn--ghost" onclick="linkClose()">Cancel</button><button type="button" id="link-submit" class="ds-btn ds-btn--primary" ${n?'':'disabled'} onclick="linkSave('${S.linkCamp}')">Link creators</button></div></div>
    </div></div>`;
}
function linkSave(id){
  const c=campOf(id); c.creatorIds=[...new Set(linkResolved())];
  closeLayer(); paintBody(); toast('Creators updated');
}
function lnchInit(p){
  const pr=(p.products&&p.products.length)?p.products:(p.product?[p.product]:[]), a=p.audience||{}, c=p.content||{};
  S.lnch={pid:p.id,brief:{product:pr[0]||'',products:pr,productNotes:p.productNotes||'',budget:p.budget||0,targetViews:p.targetViews||0,goal:p.objective&&PL_GOALS.some(g=>g.k===p.objective)?p.objective:'',
    ages:[...(a.ages||[])],gender:a.gender||'All',locations:[...(a.locations||[])],words:a.words||'',mustCover:[...(c.mustCover||[])],mustAvoid:[...(c.mustAvoid||[])],formats:[...(c.formats||[])],tone:c.tone||'',keyMessages:[...(c.keyMessages||[])]}};
}
function lnchPaint(){ const el=document.getElementById('lnchBrief'); if(el) el.innerHTML=lnchBriefHTML(); }
function lnchSet(k,v){ S.lnch.brief[k]=v; }
function lnchNum(k,v){ S.lnch.brief[k]=Number(v)||0; }
function lnchProduct(v){ S.lnch.brief.product=v; S.lnch.brief.products=v.trim()?[v.trim()]:[]; }
function lnchList(k,v){ S.lnch.brief[k]=String(v).split(',').map(s=>s.trim()).filter(Boolean); }
function lnchTog(k,v){ const a=S.lnch.brief[k]||[]; S.lnch.brief[k]=a.includes(v)?a.filter(x=>x!==v):[...a,v]; lnchPaint(); }
function lnchGoal(k){ S.lnch.brief.goal=S.lnch.brief.goal===k?'':k; lnchPaint(); }
function lnchGender(g){ S.lnch.brief.gender=g; lnchPaint(); }
function lnchBriefHTML(){
  const b=S.lnch.brief, f=(l,inner,wide)=>`<label class="lnch-f${wide?' lnch-wide':''}"><span>${l}</span>${inner}</label>`;
  const chips=(k,arr)=>arr.map(v=>`<button type="button" class="lnch-chip${(b[k]||[]).includes(v)?' is-on':''}" onclick="lnchTog('${k}','${esc(v)}')">${esc(v)}</button>`).join('');
  const goals=PL_GOALS.map(g=>`<button type="button" class="lnch-goal${b.goal===g.k?' is-on':''}" onclick="lnchGoal('${g.k}')"><b>${g.k}</b><small>${g.d}</small><span class="pl-wbar"><i style="width:${g.w}%"></i><i style="width:${100-g.w}%"></i></span></button>`).join('');
  return `<div class="lnch-grp"><div class="lnch-grid">
      ${f('Product',`<input value="${esc(b.product||'')}" oninput="lnchProduct(this.value)">`)}
      ${f('Product notes',`<input value="${esc(b.productNotes||'')}" oninput="lnchSet('productNotes',this.value)">`)}
      ${f('Budget (₹)',`<input type="number" min="0" value="${b.budget||0}" oninput="lnchNum('budget',this.value)">`)}
      ${f('Target views',`<input type="number" min="0" value="${b.targetViews||0}" oninput="lnchNum('targetViews',this.value)">`)}
    </div></div>
    <div class="lnch-grp"><h5>Goal <small>sets the scoring weights</small></h5><div class="lnch-goals">${goals}</div></div>
    <div class="lnch-grp"><h5>Audience</h5><div class="lnch-grid">
      <div class="lnch-f"><span>Age ranges</span><span class="lnch-chips">${chips('ages',PL_AGES)}</span></div>
      <div class="lnch-f"><span>Gender</span><span class="ds-seg">${['All','Women','Men'].map(g=>`<button type="button" class="${b.gender===g?'on':''}" onclick="lnchGender('${g}')">${g}</button>`).join('')}</span></div>
      ${f('Locations <small>comma separated</small>',`<input value="${esc((b.locations||[]).join(', '))}" oninput="lnchList('locations',this.value)">`)}
      ${f('In your words',`<input value="${esc(b.words||'')}" oninput="lnchSet('words',this.value)">`)}
    </div></div>
    <div class="lnch-grp"><h5>Content</h5><div class="lnch-grid">
      ${f('Must cover <small>comma separated</small>',`<input value="${esc((b.mustCover||[]).join(', '))}" oninput="lnchList('mustCover',this.value)">`)}
      ${f('Must avoid <small>comma separated</small>',`<input value="${esc((b.mustAvoid||[]).join(', '))}" oninput="lnchList('mustAvoid',this.value)">`)}
      <div class="lnch-f"><span>Formats</span><span class="lnch-chips">${chips('formats',PL_FORMATS)}</span></div>
      ${f('Tone',`<input value="${esc(b.tone||'')}" oninput="lnchSet('tone',this.value)">`)}
      ${f('Key messages <small>comma separated</small>',`<input value="${esc((b.keyMessages||[]).join(', '))}" oninput="lnchList('keyMessages',this.value)">`,true)}
    </div></div>`;
}
function lnchStep(n){
  const p1=document.getElementById('lnchP1'), p2=document.getElementById('lnchP2'); if(!p1||!p2) return;
  p1.hidden=n!==1; p2.hidden=n!==2;
  document.querySelectorAll('.lnch-step').forEach((b,i)=>{ b.classList.toggle('is-on',i+1===n); b.classList.toggle('is-done',i+1<n); b.setAttribute('aria-current',i+1===n?'step':'false'); const num=b.querySelector('.lnch-num'); if(num) num.textContent=i+1<n?'\u2713':String(i+1); });
  document.querySelectorAll('.lnch-conn').forEach(c=>c.classList.toggle('is-done',n>1));
  const q=id=>document.getElementById(id); if(q('lnchBack')) q('lnchBack').hidden=n===1; if(q('lnchNext')) q('lnchNext').hidden=n===2; if(q('lnchGo')) q('lnchGo').hidden=n!==2;
}
function openFromPlan(pid){
  const p=planOf(pid); if(!p) return;
  const st=planStageOf(p); if(st!=='Approved'&&st!=='Active'){ toast('Approve this campaign plan before launching the campaign'); openPlanApproval(pid); return; }
  lnchInit(p);
  dlg('Launch campaign from shortlisted creators','Step 1 sets the brief. Step 2 confirms who participates. Shortlisted creators are preselected.',
    `<div class="lnch">
      <nav class="lnch-stepper" aria-label="Launch steps"><button type="button" class="lnch-step is-on" aria-current="step" onclick="lnchStep(1)"><span class="lnch-num">1</span><span class="lnch-st"><b>Brief</b><small>Campaign details and brief</small></span></button><span class="lnch-conn" aria-hidden="true"></span><button type="button" class="lnch-step" aria-current="false" onclick="lnchStep(2)"><span class="lnch-num">2</span><span class="lnch-st"><b>Creators</b><small>${p.shortlisted.length} shortlisted</small></span></button></nav>
      <div id="lnchP1" class="lnch-pane">
        <section class="lnch-sec"><h4>Campaign details</h4><div class="cc-grid">${dlgFld('Campaign name','fname',p.name.replace(/plan/i,'campaign'))}${dlgSel('Category','fcategory',['Beauty','Wellness','Lifestyle','Fashion','Tech','Skincare'],'Beauty')}${dlgFld('Planned posts','fposts',p.shortlisted.length,'number')}${dlgSel('Status','fstatus',['Active','Completed','Draft'],'Active')}${dlgSel('Tracking','ftracking',['On','Stopped'],'On')}</div></section>
        <section class="lnch-sec"><h4>Brief</h4><div id="lnchBrief">${lnchBriefHTML()}</div></section>
      </div>
      <div id="lnchP2" class="lnch-pane" hidden>
        <section class="lnch-sec"><h4>Participating creators <span class="cc-count">Shortlisted</span></h4>${dlgCreatorTable(p.shortlisted,DISC.filter(c=>p.shortlisted.includes(c.id)))}</section>
        ${p.shortlisted.length?'':'<div class="ds-note ds-note--warn">No creators are shortlisted. Select participants manually or return to the plan.</div>'}
      </div>
    </div>`,
    `<span class="lnch-foot"><button type="button" class="ds-btn ds-btn--outline" id="lnchBack" onclick="lnchStep(1)" hidden>Back</button><button type="button" class="ds-btn ds-btn--primary" id="lnchNext" onclick="lnchStep(2)">Next: creators</button><button type="button" class="ds-btn ds-btn--primary" id="lnchGo" onclick="saveCampaignForm('new','','${pid}')" hidden>Launch campaign</button></span>`);
}
function openCampaignForm(mode,id){
  if(mode!=='new'){
    const c=campOf(id);
    dlg('Manage campaign','Campaigns track actual creator collaborations, posts and outcomes.',
      dlgFld('Campaign name','fname',c.name||'')+dlgFld('Product','fproduct',c.product||'')+dlgSel('Category','fcategory',['Beauty','Wellness','Lifestyle','Fashion','Tech','Skincare'],c.category||'Beauty')+dlgFld('Budget (₹)','fbudget',c.budget||0,'number')+dlgFld('Planned posts','fposts',c.plannedVideos||0,'number')+dlgSel('Status','fstatus',['Active','Completed','Draft'],c.status||'Active')+dlgSel('Tracking','ftracking',['On','Stopped'],c.tracking===false?'Stopped':'On')+
      `<div class="ds-form-wide"><span class="ds-label">Participating creators</span>${dlgCreatorTable(c.creatorIds||[],dlgShortlistPool(c.creatorIds||[]))}</div>`,
      dlgFoot(`saveCampaignForm('${mode}','${id||''}','')`));
    return;
  }
  S.ccSource='scratch'; S.ccPlan=null; S.ccText=''; S.ccCsv=null;
  S.ccPreset=S.ccPresetPending||null; S.ccPresetPending=null;
  S.ccStart=S.ccPreset&&S.ccPreset.length?'preset':'after';
  S.ccColl=(CREATOR_COLLECTIONS[0]&&CREATOR_COLLECTIONS[0].id)||null;
  lnchInit({id:null,name:'',budget:0});
  dlg('Create campaign','Step 1 sets the campaign and brief. Step 2 chooses when to add creators. Creators are optional.',
    `<style>.modal:has(.cc-create){width:min(980px,calc(100vw - 32px))!important;max-width:none!important}</style><div class="lnch cc-form cc-create">
      <nav class="lnch-stepper" aria-label="Campaign steps"><button type="button" class="lnch-step is-on" aria-current="step" onclick="lnchStep(1)"><span class="lnch-num">1</span><span class="lnch-st"><b>Details</b><small>Campaign and brief</small></span></button><span class="lnch-conn" aria-hidden="true"></span><button type="button" class="lnch-step" aria-current="false" onclick="lnchStep(2)"><span class="lnch-num">2</span><span class="lnch-st"><b>Creators</b><small>Optional</small></span></button></nav>
      <div id="lnchP1" class="lnch-pane">
        <section class="lnch-sec"><h4>Campaign details</h4><div class="cc-grid">${dlgFld('Campaign name','fname','')}${dlgSel('Category','fcategory',['Beauty','Wellness','Lifestyle','Fashion','Tech','Skincare'],'Beauty')}${dlgFld('Planned posts','fposts',0,'number')}${dlgSel('Status','fstatus',['Active','Completed','Draft'],'Active')}${dlgSel('Tracking','ftracking',['On','Stopped'],'On')}</div></section>
        <section class="lnch-sec"><h4>Brief</h4><div id="lnchBrief">${lnchBriefHTML()}</div></section>
      </div>
      <div id="lnchP2" class="lnch-pane" hidden>
        <section class="lnch-sec"><h4>Starting creators</h4><div id="ccStartPane"></div></section>
      </div>
    </div>`,
    `<span class="lnch-foot"><button type="button" class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button type="button" class="ds-btn ds-btn--outline" id="lnchBack" onclick="lnchStep(1)" hidden>Back</button><button type="button" class="ds-btn ds-btn--primary" id="lnchNext" onclick="lnchStep(2)">Next: creators</button><button type="button" class="ds-btn ds-btn--primary" id="lnchGo" onclick="saveCampaignForm('new','','')" hidden>Create campaign</button></span>`);
  ccStartRender();
}
/* Starting creators: asked once, after the details. Choosing "after creating" needs no creators now. */
const CS_CSS=`<style>
.cs-list{display:flex;flex-direction:column;border:1px solid #dbeafe;border-radius:8px;overflow:hidden}
.cs-opt{display:flex;align-items:center;gap:12px;padding:12px 14px;cursor:pointer;border-bottom:1px solid #f1f5f9;background:#ffffff;margin:0}
.cs-opt:last-child{border-bottom:0}
.cs-opt:hover{background:#f8fafc}
.cs-opt.is-on{background:#eff6ff}
.cs-opt input{margin:0;width:16px;height:16px;accent-color:#1d4ed8;flex:none}
.cs-opt-t{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}
.cs-opt-t b{font-size:14px;font-weight:500;color:#0f172a}
.cs-opt.is-on .cs-opt-t b{font-weight:600}
.cs-opt-t small{font-size:12px;color:#64748b}
.cs-sub{margin-top:12px}
.cs-note{font-size:12px;color:#64748b;margin:10px 0 0}
</style>`;
function ccStartRender(){
  const el=document.getElementById('ccStartPane'); if(!el) return;
  const pre=S.ccPreset&&S.ccPreset.length?S.ccPreset:null;
  const m=S.ccStart||(pre?'preset':'after');
  if(m==='paste'||m==='csv') S.ccSource=m; else if(S.ccSource==='paste'||S.ccSource==='csv') S.ccSource='scratch';
  const mineN=(S.mySel||[]).length, colls=CREATOR_COLLECTIONS;
  const plans=CAMP_PLANS.filter(p=>(p.shortlisted||[]).length);
  const pid=S.ccPlan&&plans.some(p=>p.id===S.ccPlan)?S.ccPlan:(plans[0]?plans[0].id:null);
  S.ccPlan=pid;
  const cur=colls.some(c=>c.id===S.ccColl)?S.ccColl:(colls[0]?colls[0].id:null);
  const opts=[
    ...(pre?[['preset',`Use the ${pre.length} creator${pre.length===1?'':'s'} you picked`,'From the campaign picker']]:[]),
    ['after','Add creators after creating','Start with an empty roster'],
    ['mine','Use my selection in My Creators',`${mineN} selected right now`],
    ['shortlist','Use a campaign plan shortlist',plans.length?`${plans.length} plan${plans.length===1?'':'s'} with a shortlist`:'No shortlists yet'],
    ['collection','Start from a collection',colls.length?'Pick a saved collection':'No collections yet'],
    ['paste','Paste creator links','Instagram handles or profile links'],
    ['csv','Import a CSV','One Instagram handle per row'],
    ['ai','Let AI suggest from My Creators','Top 30 by campaign fit, after reading the brief']
  ];
  const rows=opts.map(([k,t,d])=>`<label class="cs-opt${m===k?' is-on':''}"><input type="radio" name="ccStart" value="${k}" ${m===k?'checked':''} onchange="ccStartSet('${k}')"><span class="cs-opt-t"><b>${t}</b><small>${d}</small></span></label>`).join('');
  let extra='';
  if(m==='shortlist'&&plans.length) extra=`<div class="cs-sub"><label class="ds-field"><span>Campaign plan</span><select onchange="ccPlanPick(this.value)">${plans.map(p=>`<option value="${p.id}" ${p.id===pid?'selected':''}>${esc(p.name)} · ${p.shortlisted.length} creators</option>`).join('')}</select></label></div>`;
  if(m==='shortlist'&&!plans.length) extra=`<p class="cs-note">Create a shortlist in a campaign plan first. Until then, the campaign starts empty.</p>`;
  if(m==='paste') extra=`<div class="cs-sub">${ccPasteHTML()}</div>`;
  if(m==='csv') extra=`<div class="cs-sub">${ccCsvHTML()}</div>`;
  if(m==='collection'&&colls.length) extra=`<div class="cs-sub"><label class="ds-field"><span>Collection</span><select onchange="ccCollPick(this.value)">${colls.map(c=>`<option value="${esc(c.id)}" ${c.id===cur?'selected':''}>${esc(c.name)} · ${(c.creatorIds||[]).length} creators</option>`).join('')}</select></label></div>`;
  if(m==='mine'&&!mineN) extra=`<p class="cs-note">Select creators in My Creators first. Until then, the campaign starts empty.</p>`;
  if(m==='ai') extra=`<p class="cs-note">${ccAiPick().length} creators suggested from My Creators. Sample suggestion.</p>`;
  el.innerHTML=`${CS_CSS}<div class="cs-list" role="radiogroup" aria-label="Starting creators">${rows}</div>${extra}`;
}
function ccStartSet(k){ S.ccStart=k; ccStartRender(); }
function ccCollPick(v){ S.ccColl=v; ccStartRender(); }
function ccStartIds(){
  const m=S.ccStart||(S.ccPreset&&S.ccPreset.length?'preset':'after');
  if(m==='preset') return [...(S.ccPreset||[])];
  if(m==='paste'||m==='csv'){ S.ccSource=m; return ccIds(true); }
  if(m==='shortlist'){ const p=planOf(S.ccPlan)||CAMP_PLANS.find(x=>(x.shortlisted||[]).length); return p?[...(p.shortlisted||[])]:[]; }
  if(m==='mine') return [...(S.mySel||[])];
  if(m==='collection'){ const c=colOf(S.ccColl); return c?[...(c.creatorIds||[])]:[]; }
  if(m==='ai') return ccAiPick();
  return [];
}
/* AI suggestion (sample): top 30 of My Creators, matching the campaign category first, then reach */
function ccAiPick(){
  const cat=dlgVal('fcategory')||'';
  return DISC.filter(c=>isInMy(c.id)).map(c=>({c,s:((c.tags||[]).includes(cat)?2:0)+Math.min(1,(c.views||0)/1e6)}))
    .sort((a,b)=>b.s-a.s||(b.c.views||0)-(a.c.views||0)).slice(0,30).map(x=>x.c.id);
}
/* Creator picker for a new campaign: from scratch (all creators) or from an existing shortlist */
function ccSource(src){ S.ccSource=src; ccRender(src==='scratch'); }
function ccPlanPick(pid){ S.ccPlan=pid; ccStartRender(); }
/* Handles from pasted text or an imported CSV; null when the source is a table */
function ccHandles(){
  if(S.ccSource==='csv') return [...new Set(((S.ccCsv&&S.ccCsv.items)||[]).filter(x=>!x.err).map(x=>x.h))];
  if(S.ccSource==='paste') return [...new Set(String(S.ccText||'').split(/[\s,]+/).map(addcNorm).filter(h=>/^[a-z0-9._]{1,30}$/.test(h)))];
  return null;
}
/* Creator ids for the campaign; with create=true, handles not yet in My creators are added first */
function ccIds(create){
  const hs=ccHandles(); if(!hs) return dlgChecked();
  const rows=S.ccSource==='csv'?(S.ccCsv?S.ccCsv.items:[]):[];
  const out=[];
  hs.forEach((h,i)=>{
    const ex=DISC.find(c=>c.handle==='@'+h);
    if(ex){ out.push(ex.id); return; }
    if(!create) return;
    const row=rows.find(x=>x.h===h), data=(row&&row.row)||{};
    const id='my'+Date.now()+i;
    const name=(data.Name||'').trim()||h.split(/[._]+/).filter(Boolean).map(w=>w[0].toUpperCase()+w.slice(1)).join(' ')||h;
    DISC.unshift({id,name,handle:'@'+h,followers:Number(String(data.Followers||'').replace(/,/g,''))||0,views:Number(String(data['Avg views']||'').replace(/,/g,''))||0,tier:'Nano',tags:[],source:'Inspiration',collabs:0,likes:0,last:'Just now',country:'—',engagement:0,platforms:['Instagram']});
    if(row){ const ov={...((S.myCF||{})[id]||{})}; if(data.Cost) ov.cost=Number(String(data.Cost).replace(/[^0-9.]/g,''))||0; Object.entries(data).forEach(([k,v])=>{ if(ADDC_CUSTOM_HEAD(k)&&v!=='') ov[k]=v; }); S.myCF={...(S.myCF||{}),[id]:ov}; }
    out.push(id);
  });
  return out;
}
function ccText(v){ S.ccText=v; ccCount(); const b=document.getElementById('ccPasteN'); if(b) b.textContent=ccHandles().length; }
function ccFile(input){
  const f=input.files&&input.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{ const {cols,rows}=addcParse(String(r.result)); S.ccCsv={name:f.name,items:addcItems(cols,rows).slice(0,500)}; ccStartRender(); };
  r.readAsText(f);
}
function ccPasteHTML(){
  const n=ccHandles().length;
  return `<div class="cc-pane"><label class="cc-label" for="ccPaste">Instagram handles or profile links</label><textarea id="ccPaste" class="cc-area" rows="4" placeholder="e.g. @pavansirisin, kyliejenner or https://instagram.com/vedictoons" oninput="ccText(this.value)">${esc(S.ccText||'')}</textarea><p class="cc-note"><b id="ccPasteN">${n}</b> creator${n===1?'':'s'} ready. Separate with commas, spaces or new lines.</p></div>`;
}
function ccCsvHTML(){
  const c=S.ccCsv, n=ccHandles().length, upl=discSvg('<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',20);
  return `<div class="cc-pane"><label class="cc-drop"><input type="file" accept=".csv,text/csv" hidden onchange="ccFile(this)"><span class="cc-drop-ico">${upl}</span>${c?`<span class="cc-drop-t">${esc(c.name)}</span><span class="cc-drop-s">${c.items.length} row${c.items.length===1?'':'s'} read · ${n} ready</span>`:`<span class="cc-drop-t"><a>Choose a CSV</a> or drop it here</span><span class="cc-drop-s">One Instagram handle per row · max. 500</span>`}</label><p class="cc-note">Need a starting file? <button type="button" class="addn-link" onclick="downloadTemplate('creators')">Download template</button></p></div>`;
}
function ccFilter(q){ q=(q||'').toLowerCase().trim(); document.querySelectorAll('#ccPick tbody tr[data-q]').forEach(tr=>{ tr.style.display=!q||tr.dataset.q.includes(q)?'':'none'; }); }
function ccCount(){ const el=document.getElementById('ccCount'); const hs=ccHandles(); if(el) el.textContent=`${hs?hs.length:dlgChecked().length} selected`; }
function ccRender(keep){
  const el=document.getElementById('ccPick'); if(!el) return;
  const src=S.ccSource||'scratch';
  const plans=CAMP_PLANS.filter(p=>(p.shortlisted||[]).length);
  let pid=S.ccPlan&&plans.some(p=>p.id===S.ccPlan)?S.ccPlan:(plans[0]?plans[0].id:null);
  const plan=plans.find(p=>p.id===pid);
  const prev=keep?dlgChecked():[];
  let pool,checked;
  if(src==='shortlist'){ pool=plan?DISC.filter(c=>plan.shortlisted.includes(c.id)):[]; checked=keep?prev.filter(x=>pool.some(c=>c.id===x)):(plan?plan.shortlisted:[]); }
  else { pool=DISC; checked=keep?prev:(S.ccPreset||[]); }
  S.ccPlan=pid;
  const tab=(k,l)=>`<button type="button" class="${src===k?'on':''}" aria-pressed="${src===k}" onclick="ccSource('${k}')">${l}</button>`;
  const planSel=src==='shortlist'?(plans.length?`<select class="cc-plan" aria-label="Campaign plan" onchange="ccPlanPick(this.value)">${plans.map(p=>`<option value="${p.id}" ${p.id===pid?'selected':''}>${esc(p.name)} · ${p.shortlisted.length} creators</option>`).join('')}</select>`:'<span class="cc-note">No shortlists yet. Create one in Shortlist first.</span>'):'';
  const body=src==='paste'?ccPasteHTML():src==='csv'?ccCsvHTML():`<input class="cc-search" type="search" placeholder="Search creators" aria-label="Search creators" oninput="ccFilter(this.value)">${dlgCreatorTable(checked,pool)}`;
  el.innerHTML=`<div class="cc-head"><div class="cc-toggle" role="group" aria-label="Creator source">${tab('scratch','My creators')}${tab('shortlist','Campaign plan')}${tab('paste','Paste links')}${tab('csv','Import CSV')}</div>${planSel}</div>${body}`;
  el.querySelectorAll('.cr-choice').forEach(x=>x.addEventListener('change',ccCount));
  ccCount();
}
function saveCampaignForm(mode,id,fromPlan){
  const name=dlgVal('fname'); if(!name) return toast('Enter a campaign name');
  const f={name,product:dlgVal('fproduct'),category:dlgVal('fcategory'),budget:Number(dlgVal('fbudget'))||0,plannedVideos:Number(dlgVal('fposts'))||0,status:dlgVal('fstatus'),tracking:dlgVal('ftracking')!=='Stopped',creatorIds:mode==='new'?(fromPlan?ccIds(true):ccStartIds()):dlgChecked()};
  if(mode==='new'&&!fromPlan&&S.lnch&&S.lnch.pid===null){ const b=S.lnch.brief; Object.assign(f,{product:b.product||'',products:b.products||[],budget:Number(b.budget)||0,targetViews:Number(b.targetViews)||0,brief:{...b}}); }
  if(fromPlan&&S.lnch&&S.lnch.pid===fromPlan){ const b=S.lnch.brief; Object.assign(f,{product:b.product||'',products:b.products||[],budget:Number(b.budget)||0,targetViews:Number(b.targetViews)||0,brief:{...b}}); }
  if(mode==='new'){ const nid='ca'+Date.now(); CAMP_LIST.unshift({id:nid,legacy:false,created:TODAY,posts:fromPlan?planPostsFor(f.creatorIds,f.product):[],...f}); closeLayer(); openCampaign(nid);
    if(fromPlan) addToast('Successfully launched','Campaign has been successfully launched:',name,()=>openCampaign(nid)); else toast('Campaign created'); return; }
  Object.assign(campOf(id),f); closeLayer(); paintBody(); toast('Campaign saved');
}
/* ── Add posts: paste links or upload CSV, review each row (creator, format, type, status), then add ── */
let ADD_MODE='links';
const ADD_TEMPLATE_HEAD=['Link','Creator','Format','Type','Status','Live date','Cost','Concept'];
const isBoost=p=>p.paid>0||!!p.boost;
const linedOf=c=>c.lined||[];
function guessFormat(url){ return /\/reel\//i.test(url)?'Reel':/\/p\//i.test(url)?'Post':'Reel'; }
let ADD_FILE='';
const AP_LINK='<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>';
const AP_FILE='<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>';
const AP_UP='<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>', AP_DL='<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>';
function openAddPost(cid){
  ADD_LIST=[]; ADD_VIEW='fix'; ADD_MODE='links'; ADD_FILE='';
  closeLayer();
  document.getElementById('layer').insertAdjacentHTML('beforeend',addPostDlgHTML(cid));
  paintAddInput(cid); paintAddRows(cid);
}
function addPostDlgHTML(cid){
  const opt=(k,ic,t,d)=>`<button type="button" role="tab" data-m="${k}" aria-selected="${ADD_MODE===k}" class="addn-opt ${ADD_MODE===k?'on':''}" onclick="setAddMode('${k}','${cid}')"><span class="addn-opt-ico">${ic}</span><span class="addn-opt-txt"><b>${t}</b><small>${d}</small></span></button>`;
  return `<div class="disc-cfg-scrim" onclick="if(event.target===this)closeLayer()">
    <div class="addn ap-dlg" role="dialog" aria-modal="true" aria-label="Add posts">
      <div class="addn-head"><div><h3>Add posts</h3><p>Add posts to this campaign by link or from a CSV export.</p></div><button type="button" class="ds-iconbtn" aria-label="Close" onclick="closeLayer()">${X_SVG}</button></div>
      <div class="addn-body">
        <div class="addn-side" role="tablist" aria-label="Add method">${opt('links',discSvg(AP_LINK,18),'Paste links','Type or paste post links')}${opt('csv',discSvg(AP_FILE,18),'Upload CSV','Upload a spreadsheet export')}
          <div class="addn-tpl"><span>Need a starting file?</span><button type="button" class="addn-link" onclick="downloadAddTemplate()">${discSvg(AP_DL,16)}Download template</button></div></div>
        <div class="addn-pane ap-pane"><div id="apInput"></div><div id="apRows"></div></div>
      </div>
      <div class="addn-foot"><span class="addn-sum"><b id="ap-sum">0</b> posts ready<span class="ap-badnote" id="ap-badnote"></span></span><div class="addn-actions"><button type="button" class="ds-btn ds-btn--ghost" onclick="closeLayer()">Cancel</button><button type="button" id="apSave" class="ds-btn ds-btn--primary" disabled onclick="saveAddRows('${cid}')">Add posts</button></div></div>
    </div></div>`;
}
function setAddMode(m,cid){
  ADD_MODE=m;
  document.querySelectorAll('.ap-dlg .addn-opt').forEach(b=>{const on=b.dataset.m===m; b.classList.toggle('on',on); b.setAttribute('aria-selected',on);});
  paintAddInput(cid);
}
function paintAddInput(cid){
  const el=document.getElementById('apInput'); if(!el) return;
  if(ADD_MODE==='links'){
    el.innerHTML=`<div class="addn-row"><label class="addn-label" for="apLinks">Post links</label></div>
      <textarea id="apLinks" class="addn-area" rows="3" placeholder="https://www.instagram.com/reel/…" autocomplete="off"></textarea>
      <div class="ap-actions"><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="readLinks('${cid}')">Add to list</button></div>
      <p class="addn-note">One link per line. Each link is checked, and any problem is shown below to fix.</p>`;
  } else {
    /* one CSV at a time: once loaded, show its name with delete instead of the drop zone */
    el.innerHTML=`<div class="addn-row"><span class="addn-label">CSV file</span></div>
      ${ADD_FILE?`<div class="ap-file"><span class="ap-file-ico">${discSvg(AP_FILE,18)}</span><span class="ap-file-name">${esc(ADD_FILE)}</span><span class="ds-table-meta">${ADD_LIST.length} row${ADD_LIST.length===1?'':'s'}</span><button type="button" class="ap-x" aria-label="Delete ${esc(ADD_FILE)}" title="Delete CSV" onclick="apDelFile('${cid}')">×</button></div>`
        :`<button type="button" class="addn-drop" onclick="apLoadDummy('${cid}')"><span class="addn-drop-ico">${discSvg(AP_UP,20)}</span><span class="addn-drop-title"><a>Choose a CSV</a> or drop it here</span><span class="addn-drop-sub">Up to 500 rows</span></button>`}
      <p class="addn-note">One post per row. Live posts need a live date as YYYY-MM-DD. Format is Reel, Post or Carousel, type is Organic or Boosted, and status is Live or Lined up.</p>`;
  }
}
/* Every incoming row is checked. Passing rows go to Accepted; the rest go to Needs fixing with reasons. */
const AP_FORMATS=['Reel','Post','Carousel'], AP_TYPES=['Organic','Boosted'], AP_STATUS=['Live','Lined up'];
/* One list holds every row. A row is accepted when it has no problems, otherwise it needs fixing. */
let ADD_LIST=[], ADD_SEQ=0, ADD_VIEW='fix';
const IG_POST=/^(?:https?:\/\/)?(?:www\.|m\.)?instagram\.com\/(?:[^\/?#\s]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i;
function igParse(link){
  const s=String(link||'').trim();
  if(!s) return {err:'Link is missing'};
  const m=s.match(IG_POST);
  if(m) return {kind:m[1].toLowerCase()==='reels'?'reel':m[1].toLowerCase(),code:m[2]};
  return {err:/instagram\.com/i.test(s)?'Instagram link, but not a post, reel or IG TV URL':'Not an Instagram link'};
}
const igCodeOf=url=>{ const m=String(url||'').match(/\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i); return m?m[1]:''; };
const apOK=x=>!x.errs.length;
const apExisting=cid=>new Set([...campOf(cid).posts,...linedOf(campOf(cid))].map(p=>igCodeOf(p.url)).filter(Boolean));
function apCheck(raw,cid){
  const c=campOf(cid), e=[];
  const ig=igParse(raw.link); let canon='';
  if(ig.err) e.push(ig.err);
  else {
    canon=`https://www.instagram.com/${ig.kind}/${ig.code}/`;
    if(apExisting(cid).has(ig.code)||ADD_LIST.some(x=>x.id!==raw.id&&apOK(x)&&igCodeOf(x.raw.link)===ig.code)) e.push('Already in this campaign or the list');
  }
  const want=String(raw.creator||'').trim().replace(/^@/,'').toLowerCase();
  const cr=c.creatorIds.find(id=>{const d=DISC.find(x=>x.id===id)||{}; return cNameOf(id).toLowerCase()===want||String(d.handle||'').replace(/^@/,'').toLowerCase()===want;});
  if(!cr) e.push('Creator is not in this campaign');
  if(!AP_FORMATS.includes(raw.format)) e.push('Format must be Reel, Post or Carousel');
  if(!AP_TYPES.includes(raw.type)) e.push('Type must be Organic or Boosted');
  if(!AP_STATUS.includes(raw.status)) e.push('Status must be Live or Lined up');
  const live=raw.status==='Live';
  if(live&&!/^\d{4}-\d{2}-\d{2}$/.test(String(raw.date||''))) e.push('Live date is missing or invalid');
  const cost=Number(String(raw.cost??'').trim());
  if(String(raw.cost??'').trim()===''||!isFinite(cost)||cost<0) e.push('Cost must be a number');
  return {errs:e,row:e.length?null:{id:raw.id,url:canon,creator:cr,format:raw.format,type:raw.type,status:raw.status,date:live?raw.date:TODAY,cost:Math.round(cost),concept:raw.concept||CONCEPTS[0]}};
}
function apValidate(entry,cid){ const res=apCheck(entry.raw,cid); entry.errs=res.errs; entry.row=res.row; return entry; }
function apIngest(raws,cid){
  raws.forEach(raw=>{ raw.id='r'+(++ADD_SEQ); ADD_LIST.push(apValidate({id:raw.id,line:raw.line||null,raw,errs:[],row:null},cid)); });
}
function apParseCsv(text){
  const lines=String(text).split(/\r?\n/).filter(l=>l.trim());
  const head=(lines.shift()||'').split(',').map(x=>x.trim().toLowerCase());
  const norm=(v,list)=>list.find(x=>x.toLowerCase()===String(v||'').trim().toLowerCase())||String(v||'').trim();
  return lines.map((l,i)=>{ const v=l.split(',').map(x=>x.trim()); const r=Object.fromEntries(head.map((h,j)=>[h,v[j]??'']));
    return {line:i+2,link:r['link'],creator:r['creator'],format:norm(r['format'],AP_FORMATS),type:norm(r['type'],AP_TYPES),status:norm(r['status'],AP_STATUS),date:r['live date'],cost:r['cost'],concept:r['concept']}; });
}
/* Dummy file for the prototype: 71 rows, 65 accepted and 6 rejected for real reasons. Valid links appear in several forms. */
function apLoadDummy(cid){
  const c=campOf(cid), n=c.creatorIds.length||1, nm=i=>c.creatorIds[i%n]?cNameOf(c.creatorIds[i%n]):'Unknown creator';
  const forms=[
    i=>`https://www.instagram.com/reel/gca13_${200+i}/`,
    i=>`instagram.com/p/gca13_${200+i}`,
    i=>`https://m.instagram.com/reel/gca13_${200+i}/?igsh=ZmFrZQ==`,
    i=>`https://www.instagram.com/${nm(i).toLowerCase().replace(/\s+/g,'')}/reel/gca13_${200+i}/`,
  ];
  const broken={5:'https://www.tiktok.com/@plix/video/991',20:'https://www.instagram.com/kyliejenner',33:'',47:'https://youtube.com/shorts/abc123',58:'https://www.instagram.com/reel/gca13_200/?utm_source=ig',66:'https://www.instagram.com/reel/'};
  const fmt=['Reel','Post','Reel','Carousel'], typ=['Organic','Boosted','Organic','Organic'];
  const rows=Array.from({length:71},(_,i)=>{
    const link=i in broken?broken[i]:forms[i%4](i);
    const lined=i%9===8;
    return [link,nm(i),fmt[i%4],typ[i%4],lined?'Lined up':'Live',lined?'':`2026-10-${String(20+(i%10)).padStart(2,'0')}`,typ[i%4]==='Boosted'?String(3000+i*100):'0',CONCEPTS[i%CONCEPTS.length]];
  }).map(r=>r.join(','));
  const text=[ADD_TEMPLATE_HEAD.join(','),...rows].join('\n');
  ADD_LIST=[]; ADD_VIEW='fix'; ADD_FILE='campaign-posts-november.csv';
  apIngest(apParseCsv(text),cid);
  paintAddInput(cid); paintAddRows(cid);
  toast(`71 rows read from ${ADD_FILE}`);
}
function readLinks(cid){
  const c=campOf(cid), ta=document.getElementById('apLinks');
  const urls=(ta?ta.value:'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  if(!urls.length) return toast('Paste at least one link');
  const first=c.creatorIds[0]?cNameOf(c.creatorIds[0]):'';
  const byHandle=url=>{ const low=url.toLowerCase(); const hit=c.creatorIds.find(id=>{const cr=crOf(id); return cr&&cr.handle&&low.includes('/'+cr.handle.replace(/^@/,'').toLowerCase()+'/');}); return hit?cNameOf(hit):first; };
  apIngest(urls.map(url=>({link:url,creator:byHandle(url),format:guessFormat(url),type:'Organic',status:'Live',date:TODAY,cost:'0',concept:CONCEPTS[0]})),cid);
  if(ta) ta.value='';
  paintAddRows(cid); toast(`${urls.length} link${urls.length===1?'':'s'} checked`);
}
function downloadAddTemplate(){
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([tplHead('addposts').join(',')+'\n'],{type:'text/csv'})); a.download='campaign-posts-template.csv'; a.click(); URL.revokeObjectURL(a.href);
}
function apFix(cid,id,key,val){
  const e=ADD_LIST.find(x=>x.id===id); if(!e) return;
  const was=apOK(e);
  e.raw[key]=val;
  apValidate(e,cid);
  if(was!==apOK(e)) toast(apOK(e)?'Row fixed and moved to Accepted':'Row moved to Needs fixing');
  paintAddRows(cid);
}
function apDelFile(cid){ ADD_FILE=''; ADD_LIST=[]; ADD_VIEW='fix'; paintAddInput(cid); paintAddRows(cid); toast('CSV removed'); }
function apDrop(cid,id){ ADD_LIST=ADD_LIST.filter(x=>x.id!==id); paintAddRows(cid); }
function apView(cid,v){ ADD_VIEW=v; paintAddRows(cid); }
function paintAddRows(cid){
  const el=document.getElementById('apRows'); if(!el) return;
  const c=campOf(cid), sb=document.getElementById('apSave'), sum=document.getElementById('ap-sum'), bn=document.getElementById('ap-badnote');
  const ok=ADD_LIST.filter(apOK), bad=ADD_LIST.filter(x=>!apOK(x)), n=ok.length, nb=bad.length;
  if(!nb&&n&&ADD_VIEW==='fix') ADD_VIEW='ok';
  if(!n&&nb&&ADD_VIEW==='ok') ADD_VIEW='fix';
  if(sb){ sb.textContent=n?`Add ${n} post${n===1?'':'s'}`:'Add posts'; sb.disabled=!n; }
  if(sum) sum.textContent=n;
  if(bn) bn.textContent=nb?` · ${nb} need${nb===1?'s':''} fixing`:'';
  if(!ADD_LIST.length){ el.innerHTML=''; return; }
  const names=c.creatorIds.map(id=>cNameOf(id));
  const pill=(v,label,count,cls)=>`<button type="button" class="ap-fpill ${cls}${ADD_VIEW===v?' on':''}" aria-pressed="${ADD_VIEW===v}" onclick="apView('${cid}','${v}')"><i></i>${label}<b>${count}</b></button>`;
  const rowHTML=x=>{
    const r=x.raw, id=x.id, cr=names.includes(r.creator)?names:[...names,r.creator];
    const o=(arr,v,k)=>`<select class="ap-sel" aria-label="${k}" onchange="apFix('${cid}','${id}','${k}',this.value)">${(arr.includes(v)?arr:[...arr,v]).map(x2=>`<option value="${esc(x2)}" ${x2===v?'selected':''}>${esc(x2)}</option>`).join('')}</select>`;
    const check=apOK(x)?`<span class="ap-ready">Ready</span>`:`<span class="ap-prob">${x.errs.map(e=>`<span>${esc(e)}</span>`).join('')}</span>`;
    return `<tr class="${apOK(x)?'':'is-bad'}">
      <td class="ap-line">${x.line?'Row '+x.line:'Link'}</td>
      <td>${check}</td>
      <td><input class="ap-in ap-link" aria-label="Link" value="${esc(r.link||'')}" onchange="apFix('${cid}','${id}','link',this.value)"></td>
      <td>${o(cr,r.creator,'creator')}</td>
      <td>${o(AP_FORMATS,r.format,'format')}</td>
      <td>${o(AP_TYPES,r.type,'type')}</td>
      <td>${o(AP_STATUS,r.status,'status')}</td>
      <td>${r.status==='Live'?`<input class="ap-in" type="date" aria-label="Live date" value="${esc(r.date||'')}" onchange="apFix('${cid}','${id}','date',this.value)">`:'<span class="ds-table-meta">—</span>'}</td>
      <td><input class="ap-in ap-num" type="text" aria-label="Cost" value="${esc(String(r.cost??''))}" onchange="apFix('${cid}','${id}','cost',this.value)"></td>
      <td>${o(CONCEPTS,r.concept,'concept')}</td>
      <td><button type="button" class="ap-x" aria-label="Remove row" onclick="apDrop('${cid}','${id}')">×</button></td></tr>`;
  };
  const view=ADD_VIEW==='fix'?bad:ok;
  const table=view.length
    ?`<div class="ds-table-wrap ap-wrap"><table class="ds-table ap-table ap-table--one"><thead><tr><th>Row</th><th>${ADD_VIEW==='fix'?'Problem':'Check'}</th><th>Link</th><th>Creator</th><th>Format</th><th>Type</th><th>Status</th><th>Live date</th><th>Cost</th><th>Concept</th><th></th></tr></thead><tbody>${view.map(rowHTML).join('')}</tbody></table></div>`
    :`<p class="ap-empty">${ADD_VIEW==='fix'?'Nothing needs fixing.':'No accepted posts yet.'}</p>`;
  el.innerHTML=`<div class="ap-filter" role="tablist">${pill('fix','Needs fixing',nb,'bad')}${pill('ok','Accepted',n,'ok')}</div>${table}`;
}
/* Sample performance for a newly added live link (designer sample data, not tracked). */
function samplePostViews(seed,boosted){
  const h=[...String(seed)].reduce((a,ch)=>(a*31+ch.charCodeAt(0))>>>0,7);
  const views=4000+(h%36000), paid=boosted?Math.round(views*0.3):0;
  return {views,organic:views-paid,paid};
}
function saveAddRows(cid){
  const c=campOf(cid), rows=ADD_LIST.filter(apOK).map(x=>x.row); if(!rows.length) return toast('Add at least one post');
  const base=Date.now(); let live=0, lined=0;
  rows.forEach((r,i)=>{
    const rec={id:'po'+base+i,creator:r.creator,product:c.product,format:r.format,url:r.url,concept:r.concept||'',cost:r.cost||0,boost:r.type==='Boosted'};
    if(r.status==='Lined up'){ c.lined=[...linedOf(c),{...rec,status:'Lined up'}]; lined++; }
    else {
      const slot=c.posts.find(p=>!p.url&&p.creator===r.creator);
      const sv=samplePostViews(rec.id,rec.boost);
      if(slot){ Object.assign(slot,{...rec,id:slot.id,date:r.date||TODAY,views:slot.views||sv.views,organic:slot.organic||sv.organic,paid:slot.paid||sv.paid}); }
      else c.posts.push({...rec,date:r.date||TODAY,...sv});
      live++;
    }
  });
  ADD_LIST=[]; S.cSeg=live?'live':'lined';
  closeLayer(); paintBody(); toast(`${live} live, ${lined} lined up`);
}
function markLive(cid,pid){
  const c=campOf(cid), r=linedOf(c).find(x=>x.id===pid); if(!r) return;
  c.lined=linedOf(c).filter(x=>x.id!==pid);
  const {status,...rest}=r; c.posts.push({...rest,date:TODAY,views:0,organic:0,paid:0});
  paintBody(); toast('Moved to live');
}
function removeLined(cid,pid){ const c=campOf(cid); c.lined=linedOf(c).filter(x=>x.id!==pid); paintBody(); toast('Removed from lined up'); }
function setLinedCost(cid,pid,val){ const r=linedOf(campOf(cid)).find(x=>x.id===pid); if(!r) return; r.cost=Math.max(0,Math.round(Number(val)||0)); paintBody(); toast('Cost updated'); }
function linedTableHTML(c){
  const rows=linedOf(c);
  const body=rows.map(r=>{ const url=r.url||'';
    return `<tr>
      <td class="ct-postcol cs-first"><div class="ct-post-cell">${ctThumb(r)}<div class="ct-post-meta"><span class="ct-kind">${CT_LABEL[ctKind(r)]}</span>${url?`<span class="ct-link" title="${esc(url)}">${esc(url.replace(/^https?:\/\//,''))}</span>`:'<span class="ct-link">No link yet</span>'}</div>${r.id?`<button type="button" class="pl-detail ct-detail" aria-label="Open post details" title="Post details" onclick="event.stopPropagation();psOpen('${esc(String(r.id))}')">${PS_ICON}</button>`:''}${url?`<a class="ct-open" href="${esc(url)}" target="_blank" rel="noopener" aria-label="Open post link" title="Open post" onclick="event.stopPropagation()">${CT_ARROW}</a>`:''}</div></td>
      <td>${campWho(crOf(r.creator))}</td>
      <td class="ct-product">${esc(r.product)}</td>
      <td><span class="ct-type ${r.boost?'is-boost':'is-org'}">${r.boost?'Boosted':'Organic'}</span></td>
      <td>${dsBadge(r.concept)}</td>
      <td class="ds-num"><label class="cr-cost"><span class="cr-rupee" aria-hidden="true">₹</span><input type="text" inputmode="numeric" autocomplete="off" value="${Math.round(r.cost||0)}" aria-label="Planned cost" onchange="setLinedCost('${c.id}','${r.id}',this.value)"></label></td>
      <td class="ds-sticky-r"><details class="ds-more"><summary class="ds-btn ds-btn--outline ds-btn--sm" aria-label="More options for this post">⋯</summary><div class="ds-more-menu"><button onclick="markLive('${c.id}','${r.id}')">Mark as live</button><button class="is-danger" onclick="removeLined('${c.id}','${r.id}')">Remove</button></div></details></td></tr>`;
  }).join('')||'<tr><td colspan="7" class="ds-empty">Nothing lined up. Add posts with status “Lined up”.</td></tr>';
  return `<div class="ds-table-wrap ct-wrap"><table class="ds-table ct-table"><thead><tr><th class="cs-first">Post</th><th>Creator</th><th>Product</th><th>Type</th><th>Concept</th><th class="ds-num">Planned cost</th><th class="ds-sticky-r"></th></tr></thead><tbody>${body}</tbody></table></div>`;
}
function campAdvToggle(){ S.cAdvOpen=!S.cAdvOpen; paintBody(); }
function clearCampFilters(){ ['cQ','cPlat','cCreator','cKind','cTrk','cConcept','cMonth','cType'].forEach(k=>S[k]='All'); S.cQ=''; paintBody(); }
function ctSelToggle(pid){ const a=S.ctSel||[]; S.ctSel=a.includes(pid)?a.filter(x=>x!==pid):[...a,pid]; paintBody(); }
function ctSelAll(on,el){ const ids=el&&el.dataset&&el.dataset.ids?el.dataset.ids.split(',').filter(Boolean):[]; const cur=S.ctSel||[]; S.ctSel=on?[...new Set([...cur,...ids])]:(el?cur.filter(x=>!ids.includes(x)):[]); paintBody(); }
const HD_ICON={
  Post:'<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  Creator:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  Product:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  'Live date':'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  Platform:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  'Tracking status':'<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  Views:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  'Paid views':'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  Comments:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  Likes:'<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',
  'ER%':'<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  Sentiment:'<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  Positive:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  Neutral:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  Negative:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  Inquiry:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  Name:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  Cost:'<rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20M16 13h2"/>',
  CPV:'<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  Concept:'<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z"/>',
  Type:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>'};
function hdIc(l){ return HD_ICON[l]?`<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${HD_ICON[l]}</svg>`:''; }
function trkOf(p){ return p.url?'tracked':'awaiting'; }
const TRK_LBL={tracked:'Tracked',awaiting:'Awaiting URL',syncing:'Syncing',failed:'Sync failed'};
function trkBadge(p){
  const st=trkOf(p), ic={tracked:'<path d="M20 6L9 17l-5-5"/>',awaiting:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',syncing:'<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>',failed:'<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>'}[st];
  return `<span class="trk-b trk-b--${st==='tracked'?'ok':st==='awaiting'?'wait':st==='syncing'?'sync':'fail'}"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic}</svg>${TRK_LBL[st]}</span>`;
}
const PLAT_ICON={
  Instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
  YouTube:'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/>',
  TikTok:'<path d="M9 3v12.5a3 3 0 1 1-3-3"/><path d="M9 3c.5 3 2.5 5 6 5"/>',
  Other:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'};
function ctPlat(p){ const u=(p.url||'').toLowerCase(); if(u.includes('instagram')) return 'Instagram'; if(u.includes('youtube')||u.includes('youtu.be')) return 'YouTube'; if(u.includes('tiktok')) return 'TikTok'; return p.url?'Other':'Instagram'; }
function ctPlatBadge(p){ const n=ctPlat(p); return `<span class="ct-plat" title="${n}"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PLAT_ICON[n]}</svg>${n}</span>`; }
function ctUrlDlg(cid,pid){
  const c=campOf(cid), p=c&&c.posts.find(x=>x.id===pid); if(!p) return;
  dlg(p.url?'Update post URL':'Add post URL',`${esc(p.concept||'Post')} · ${esc(p.format)} · ${esc(c.name)}`,
    `<label class="ds-field"><span>Post URL</span><input id="ctUrlIn" type="url" value="${esc(p.url||'')}" placeholder="https://"></label>`,
    `<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="ctUrlSave('${cid}','${pid}')">Save URL</button>`);
}
function ctRetry(pid){ const p=CAMP_LIST.flatMap(c=>c.posts).find(x=>x.id===pid); if(p) p.sync='syncing'; paintBody(); toast('Retrying sync'); }
function PLAT_ICON_SVG(n){ return `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PLAT_ICON[n]||PLAT_ICON.Other}</svg>`; }
function ctUrlSave(cid,pid){
  const v=(document.getElementById('ctUrlIn').value||'').trim();
  if(v && !/^https?:\/\//i.test(v)) return toast('Enter a full link starting with https://');
  const p=campOf(cid).posts.find(x=>x.id===pid); if(p) p.url=v;
  closeLayer(); paintBody(); toast(v?'Post link saved':'Post link removed');
}
function trkSummaryHTML(c,withCamp){
  const n=withCamp.length, tr=withCamp.filter(p=>trkOf(p)==='tracked').length, aw=n-tr, fl=0, cur=S.cTrk||'All';
  const ok=aw===0&&fl===0;
  const btn=(k,val,label,val2,ic)=>`<button type="button" class="trk-sum-i${cur===val?' on':''}" aria-pressed="${cur===val}" onclick="setPageState('cTrk','${val}')"><small>${ic?ic:''}${label}</small><b>${val2}</b></button>`;
  const I=d=>`<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  return `<style>
.trk-sum{display:flex;flex-wrap:wrap;border:1px solid #e2e8f0;border-radius:12px;background:#ffffff;margin:12px 0;overflow:hidden}
.trk-sum-i{all:unset;box-sizing:border-box;cursor:pointer;flex:1 1 120px;padding:12px 16px;border-left:1px solid #e2e8f0;display:flex;flex-direction:column;gap:4px;min-height:64px}
.trk-sum-i:first-child{border-left:0}
.trk-sum-i:hover{background:#eff6ff}
.trk-sum-i.on{box-shadow:inset 0 -2px 0 #1d4ed8}
.trk-sum-i:focus-visible{outline:2px solid #1d4ed8;outline-offset:-2px}
.trk-sum-i small{display:flex;align-items:center;gap:6px;font-size:12px;color:#1e40af}
.trk-sum-i b{font-size:18px;font-weight:600;color:#0f172a;font-variant-numeric:tabular-nums}
.trk-sum-h{flex:1.8 1 260px;padding:12px 16px;display:flex;align-items:center;gap:10px}
.trk-sum-h b{display:block;font-size:14px;font-weight:600;color:#0f172a}
.trk-sum-h span{display:block;font-size:12px;color:#1e40af}
.trk-sum-last{flex:1.2 1 180px;padding:12px 16px;border-left:1px solid #e2e8f0;display:flex;align-items:center;gap:8px;font-size:12px;color:#1e40af}
.trk-sum-last b{color:#0f172a;font-weight:600}
.trk-b{display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:16px;font-size:12px;font-weight:500;white-space:nowrap}
.trk-b--ok{background:#dcfce7;color:#166534}
.trk-b--wait{background:#fef3c7;color:#9a3412}
.trk-b--sync{background:#dbeafe;color:#1e40af}
.trk-b--fail{background:#fee2e2;color:#991b1b}
.ct-wrap{overflow-x:auto;border:1px solid #e2e8f0;border-radius:12px}
.ct-table{border-collapse:collapse}
.ct-table th,.ct-table td{border-left:0!important;border-right:0!important}
.ct-table thead th{height:46px;padding:0 12px;background:#eff6ff;font-weight:500;color:#0f172a;border-bottom:1px solid #e2e8f0!important;white-space:nowrap}
.ct-table tbody td{height:72px;padding:12px 12px;vertical-align:middle;border-bottom:1px solid #f1f5f9!important}
.ct-table tbody tr:hover td{background:#eff6ff}
.ct-table tbody tr:last-child td{border-bottom:0!important}
.ct-table .ds-num{font-variant-numeric:tabular-nums}
.ct-table .ds-sticky-r{background:#ffffff}
.ct-plat{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#0f172a;white-space:nowrap}
.ct-plat svg{color:#1e40af;flex:none}
.ct-adv{margin:0 0 12px;border:1px solid #e2e8f0;border-radius:12px;background:#ffffff;padding:12px 16px}
.ct-adv-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.ct-adv-g{display:flex;flex-wrap:wrap;gap:8px}
.ct-adv-n{font-size:12px;font-weight:600;margin-left:2px}
.ct-plat-ic{display:inline-flex;color:#1e40af;margin-left:6px;vertical-align:middle}
.ct-wrap{max-height:70vh;overflow:auto}
.ct-table thead th{position:sticky;top:0;z-index:3;background:#eff6ff}
.ct-table thead th.cs-first,.ct-table thead th.ds-sticky-r{z-index:4}
.ct-hd{display:inline-flex;align-items:center;gap:6px}
.ct-hd svg{color:#1e40af;flex:none}
.ct-sel{width:16px;height:16px;margin:0 8px 0 0;vertical-align:middle;accent-color:#1d4ed8;cursor:pointer}
.ct-table tbody tr.is-selected td{background:#eff6ff!important}
.ct-selcount{font-size:13px;color:#1e40af;align-self:center}

</style>
<div class="trk-sum" role="group" aria-label="Tracking overview">
  <div class="trk-sum-h"><span style="color:${ok?'#15803d':'#c2410c'}">${ok?I('<path d="M20 6L9 17l-5-5"/>'):I('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>')}</span><div><b>${ok?'Tracking healthy':'Attention required'}</b><span>${ok?'All published content is being tracked':`${aw} awaiting URL${fl?` · ${fl} sync failures`:''}`}</span></div></div>
  ${btn('cTrk','All','Published posts',n,'')}
  ${btn('cTrk','tracked','Tracked',tr,`<span style="color:#15803d">${I('<path d="M20 6L9 17l-5-5"/>')}</span>`)}
  ${btn('cTrk','awaiting','Awaiting URL',aw,`<span style="color:#c2410c">${I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')}</span>`)}
  ${btn('cTrk','failed','Sync failures',fl,`<span style="color:#b91c1c">${I('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>')}</span>`)}
  <div class="trk-sum-last"><span>${I('<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>')}</span><span>Last successful sync<br><b>Today, 10:42 AM</b></span></div>
</div>`;
}
function campContentHTML(c,withCamp){
  const seg=S.cSeg||'live', liveN=withCamp.length, linedN=linedOf(c).length;
  const segChip=dsFilter('cSeg','Status',[['live',`Live (${liveN})`],['lined',`Lined up (${linedN})`]],seg);
  if(seg==='lined'){
    return `<div class="ds-toolbar ds-toolbar--wrap dk-ctools">${segChip}<span class="ds-spacer"></span><button class="ds-btn ds-btn--primary ds-btn--sm" onclick="openAddPost('${c.id}')">${icon('plus','ico-sm')}Add posts</button></div>${linedTableHTML(c)}`;
  }
  return trkSummaryHTML(c,withCamp)+campLiveTableHTML(c,withCamp,segChip);
}
function openCampaignPost(pid){
  const c=CAMP_LIST.find(c=>c.posts.some(p=>p.id===pid)), p=c.posts.find(x=>x.id===pid), cr1=crOf(p.creator);
  openDrawer('Post details',`${esc(c.name)} · Published ${esc(p.date)}`,`<div class="ds-grid2 ds-drawer-grid">
    <div class="ds-card ds-pad"><div class="ds-tile-hero">${dsMediaVideo(p.id)}</div><strong>${esc(p.format)} · ${esc(p.product)}</strong><span class="ds-caption">Illustrative creative</span><div class="ds-person">${dsPerson(cr1)}</div><a class="ds-btn ds-btn--outline ds-btn--sm" href="${esc(p.url)}" target="_blank" rel="noreferrer">Open original ↗</a></div>
    <div><div class="ds-stats ds-stats--2"><div class="ds-card"><span class="ds-label">Total views</span><span class="ds-value">${exactN(p.views)}</span></div><div class="ds-card"><span class="ds-label">Cost per view</span><span class="ds-value" id="sheetCPV">${cpvOf(p.cost,p.views)}</span></div></div>
    <div class="ds-form"><label class="ds-field"><span>Post cost (₹)</span><input id="sheetCost" type="number" min="0" step="100" value="${p.cost}" oninput="updateSheetCPV('${p.id}')"></label><span class="ds-caption" id="sheetFormula">${rupees(p.cost)} ÷ ${exactN(p.views)} views</span>
      <label class="ds-field"><span>Concept</span><input id="sheetConcept" type="text" list="conceptOpts" maxlength="40" value="${esc(p.concept&&p.concept!=='Post'?p.concept:'')}" placeholder="Add or pick a concept"><datalist id="conceptOpts">${CONCEPTS.map(x=>`<option value="${esc(x)}"></option>`).join('')}</datalist></label></div>
    <div class="ds-plan-tags">${dsBadge(p.product)}${boostBadge(p)}</div>
    <div class="ds-stats ds-stats--2"><div class="ds-card"><span class="ds-label">Organic views</span><span class="ds-value">${exactN(p.organic)}</span></div><div class="ds-card"><span class="ds-label">Paid views</span><span class="ds-value">${exactN(p.paid)}</span></div></div></div></div>
    <div class="ds-drawer-foot"><button class="ds-btn ds-btn--danger" onclick="openRemovePost('${c.id}','${p.id}')">Remove from campaign</button><span class="ds-spacer"></span><button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="saveSheetCost('${p.id}')">Save post</button></div>`);
}
function updateSheetCPV(pid){ const p=CAMP_LIST.flatMap(c=>c.posts).find(x=>x.id===pid), cost=Number(document.getElementById('sheetCost').value); const ok=Number.isFinite(cost)&&cost>=0; document.getElementById('sheetCPV').textContent=ok?cpvOf(cost,p.views):'—'; document.getElementById('sheetFormula').textContent=ok?rupees(cost)+' ÷ '+exactN(p.views)+' views':'Cost must be zero or greater'; }
function saveSheetCost(pid){ const v=document.getElementById('sheetCost').value, cost=Number(v); if(!v.trim()||!Number.isFinite(cost)||cost<0) return toast('Enter a valid cost of zero or greater'); const p=CAMP_LIST.flatMap(c=>c.posts).find(x=>x.id===pid); const cf=document.getElementById('sheetConcept'); p.cost=cost; if(cf) p.concept=cf.value.trim()||'Post'; closeLayer(); paintBody(); toast('Post saved; campaign CPV and concept updated'); }
function openRemovePost(cid,pid){
  const c=campOf(cid), p=c&&c.posts.find(x=>x.id===pid); if(!p) return;
  const cr=crOf(p.creator)||{name:p.creator};
  dlg('Remove post from campaign?',`${esc(p.concept||'Post')} · ${esc(p.format)} by ${esc(cr.name)} will be removed from ${esc(c.name)}.`,
    '',
    `<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--danger" onclick="removePost('${cid}','${pid}')">Remove post</button>`);
}
function removePost(cid,pid){ const c=campOf(cid); c.posts=c.posts.filter(p=>p.id!==pid); closeLayer(); paintBody(); toast('Post removed from campaign'); }
function markCampaignEnded(cid){ const c=CAMP_LIST.find(x=>x.id===cid); if(!c) return; c.status='Completed'; paintHeader(); paintBody(true); toast('Campaign marked as ended'); }
function openDeleteCampaign(cid){
  const c=campOf(cid); if(!c) return;
  const nP=c.posts.length, nC=(c.creatorIds||[]).length, pl=(n,w)=>`${n} ${w}${n===1?'':'s'}`;
  dlg('Delete campaign?',`This permanently deletes <b>${esc(c.name)}</b>.`,
    `<div class="dl-stack"><div class="ds-note ds-note--warn">It removes ${pl(nP,'post')} and ${pl(nC,'creator link')} from this campaign's reporting. Creator profiles stay in My creators. For historical reporting, consider stopping tracking instead.</div>
    <label class="ds-field"><span>Type <b>${esc(c.name)}</b> to confirm</span><input id="delCampName" autocomplete="off" oninput="delCampSync('${cid}')"></label></div>`,
    `<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--danger" id="delCampGo" disabled onclick="deleteCampaign('${cid}')">Delete campaign</button>`);
}
function delCampSync(cid){ const c=campOf(cid), i=document.getElementById('delCampName'), b=document.getElementById('delCampGo'); if(!c||!i||!b) return; b.disabled=i.value.trim()!==c.name.trim(); }
function deleteCampaign(cid){ CAMP_LIST.splice(CAMP_LIST.findIndex(c=>c.id===cid),1); closeLayer(); setPage('campaigns'); toast('Campaign deleted'); }

/* ---------- CSV import (plan creators, legacy and post bulk upload) ---------- */
function downloadTemplate(kind){
 const t=tplOf(kind);if(!t)return;
 const cols=tplHead(kind);
 const custom=(CUSTOM_COLS[kind]||[]);
 dlg(`Download ${t.title}`,`Review the columns before downloading. Customize the template here without leaving the import workflow.`,
  `<div class="tpl-download-modal">
    <div class="tpl-download-summary"><b>${esc(t.title)}</b><span>${esc(t.desc)}</span></div>
    <div class="tpl-download-cols"><span class="tpl-lbl">Included columns</span><div class="tpl-cols">${cols.map(c=>`<span class="tpl-chip ${custom.includes(c)?'is-custom':''}">${esc(c)}</span>`).join('')}</div></div>
    <div class="tpl-customize-row"><span>Need additional fields?</span><button type="button" class="addn-link" onclick="toggleTemplateCustomize('${kind}')">Customize</button></div>
    <div id="tplCustomizePane" hidden>
      <label class="ds-field"><span>Add a column</span><div class="tpl-add-row"><input id="tplNewCol" placeholder="e.g. Campaign objective"><button type="button" class="ds-btn ds-btn--outline ds-btn--sm" onclick="addTemplateColumn('${kind}')">Add</button></div></label>
      <div class="tpl-custom-list">${custom.map((c,i)=>`<span class="tpl-custom-item">${esc(c)}<button type="button" aria-label="Remove ${esc(c)}" onclick="removeTemplateColumn('${kind}',${i})">×</button></span>`).join('')||'<span class="ds-caption">No custom columns yet.</span>'}</div>
    </div>
  </div>`,
  `<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="downloadTemplateFile('${kind}')">${icon('download','ico-sm')}Download CSV</button>`);
}

function openImport(kind,id){
  const label={posts:'Import campaign posts',legacy:'Import legacy campaign',plan:'Import creators into plan',creators:'Import creators via CSV'}[kind];
  const cols=tplHead(kind);
  const upl=discSvg('<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',20);
  showModal(label,`<div class="imp">
    <p class="imp-intro">Upload a CSV file. Accepted and rejected records are shown before anything is imported.</p>
    <div class="imp-sec"><span class="imp-h">Columns</span><div class="imp-cols">${cols.map(c=>`<span class="ct-tag">${esc(c)}</span>`).join('')}</div></div>
    <div class="imp-sec"><span class="imp-h">File</span>
      <label class="cc-drop imp-drop"><input type="file" id="csvfile" accept=".csv,text/csv" hidden onchange="previewCSV(this,'${kind}')"><span class="cc-drop-ico">${upl}</span><span class="cc-drop-t"><a>Choose a CSV</a> or drop it here</span><span class="cc-drop-s">Max. 5 MB · one record per row</span></label>
    </div>
    <div id="csvpreview" class="imp-preview">Select a CSV file to see the preview and validation results.</div>
    <div class="imp-tpl"><span>Need a starting file?</span><button type="button" class="addn-link" onclick="downloadTemplate('${kind}')">Download template</button></div>
  </div>`,
    `<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="importCSV('${kind}','${id||''}')">Import valid rows</button>`);
}
let CSV_ROWS=[];
function previewCSV(input,kind){
  const f=input.files[0]; if(!f) return;
  const reader=new FileReader();
  reader.onload=()=>{
    const lines=String(reader.result).split(/\r?\n/).filter(l=>l.trim());
    const head=lines.shift()?.split(',').map(s=>s.trim().toLowerCase())||[];
    CSV_ROWS=lines.map(l=>{const v=l.split(',').map(s=>s.trim());return Object.fromEntries(head.map((h,i)=>[h,v[i]||'']));});
    const ok=CSV_ROWS.filter(r=>rowValid(kind,r)).length;
    document.getElementById('csvpreview').innerHTML=`<b>${CSV_ROWS.length}</b> rows read · <b>${ok}</b> valid · <b>${CSV_ROWS.length-ok}</b> rejected`;
  };
  reader.readAsText(f);
}
function rowValid(kind,r){
  if(kind==='posts'||kind==='legacy') return !!(r['live date']||r['date'])&&!isNaN(Number(r['organic views']||r['views']||0));
  return !!(r['handle']||r['name']);
}
function importCSV(kind,id){
  const ok=CSV_ROWS.filter(r=>rowValid(kind,r));
  if(!ok.length) return toast('No valid rows to import');
  if(kind==='posts'){ const c=campOf(id); ok.forEach((r,i)=>c.posts.push({id:'po'+Date.now()+i,creator:c.creatorIds[0],product:r['product']||c.product,date:r['live date']||r['date'],organic:Number(r['organic views'])||0,paid:Number(r['paid views'])||0,views:(Number(r['organic views'])||0)+(Number(r['paid views'])||0),cost:Number(r['cost'])||0,concept:r['concept']||'',format:'Reel',url:r['post url']||''})); }
  else if(kind==='plan'){ const p=planOf(id); ok.forEach(r=>{ let c=DISC.find(x=>x.handle.toLowerCase()===('@'+(r['handle']||'').replace(/^@/,'')).toLowerCase()); if(!c){ c={id:'cn'+Date.now()+Math.random().toString(36).slice(2,5),name:r['name']||r['handle'],handle:'@'+(r['handle']||'').replace(/^@/,''),followers:Number(r['followers'])||0,views:Number(r['avg views'])||0,tier:'Micro',tags:[],source:'Inspiration',collabs:0,likes:0,last:'Just now'}; DISC.unshift(c); } if(!p.creators.includes(c.id)) p.creators.push(c.id); }); }
  else if(kind==='legacy'){ const name=(ok[0]['campaign']||'Imported campaign'); CAMP_LIST.unshift({id:'ca'+Date.now(),name,product:ok[0]['product']||'',category:'Beauty',status:'Completed',legacy:true,tracking:false,created:ok[0]['live date']||TODAY,budget:0,plannedVideos:ok.length,creatorIds:[],posts:ok.map((r,i)=>({id:'pi'+Date.now()+i,creator:'',product:r['product']||'',date:r['live date']||'',views:Number(r['views'])||0,organic:Number(r['views'])||0,paid:0,cost:Number(r['cost'])||0,concept:'',format:'Reel',url:''}))}); }
  CSV_ROWS=[];
  closeLayer(); paintBody(); toast(`${ok.length} rows imported`);
}

/* ---------- Settings ---------- */
/* CSV templates: each has base columns plus its own custom columns, added from Settings */
const CSV_TEMPLATES=[
  {k:'creators',title:'Creator CSV',desc:'Creator lists uploaded for shortlisting',base:['Name','Handle','Cost','Owner','Followers','Avg views']},
  {k:'plan',title:'Campaign plan CSV',desc:'Creators imported into a shortlist group',base:['Name','Handle','Cost','Owner','Followers','Avg views']},
  {k:'posts',title:'Campaign posts CSV',desc:'Posts imported into a campaign',base:['Post URL','Creator','Product','Live date','Organic views','Paid views','Cost','Concept']},
  {k:'addposts',title:'Add posts CSV',desc:'Posts added from the campaign Add posts dialog',base:ADD_TEMPLATE_HEAD},
  {k:'legacy',title:'Legacy campaign CSV',desc:'Historical campaign records',base:['Campaign','Creator','Product','Live date','Views','Cost']},
];
let CUSTOM_COLS={creators:['View plan','Boosting plan','Collaboration type'],plan:[],posts:[],addposts:[],legacy:[]};
const tplOf=k=>CSV_TEMPLATES.find(x=>x.k===k);
const tplHead=k=>{ const t=tplOf(k); return t?[...t.base,...(CUSTOM_COLS[k]||[])]:['Name']; };
const TPL_CUSTOM_KEY='creator_studio_template_custom_v1';
function tplCustomBoot(){try{const saved=JSON.parse(localStorage.getItem(TPL_CUSTOM_KEY)||'null');if(saved&&typeof saved==='object')Object.keys(CUSTOM_COLS).forEach(k=>{if(Array.isArray(saved[k]))CUSTOM_COLS[k]=saved[k].filter(x=>typeof x==='string');});}catch(e){}}
function tplCustomSave(){try{localStorage.setItem(TPL_CUSTOM_KEY,JSON.stringify(CUSTOM_COLS));}catch(e){}}
tplCustomBoot();
function toggleTemplateCustomize(kind){const pane=document.getElementById('tplCustomizePane');if(!pane)return;pane.hidden=!pane.hidden;}
function addTemplateColumn(kind){
 const input=document.getElementById('tplNewCol'),name=(input?.value||'').trim();
 if(!name)return toast('Enter a column name');
 if(tplHead(kind).some(x=>x.toLowerCase()===name.toLowerCase()))return toast('This column already exists');
 CUSTOM_COLS[kind]=[...(CUSTOM_COLS[kind]||[]),name];tplCustomSave();
 downloadTemplate(kind);
 const pane=document.getElementById('tplCustomizePane');if(pane)pane.hidden=false;
}
function removeTemplateColumn(kind,index){
 CUSTOM_COLS[kind]=(CUSTOM_COLS[kind]||[]).filter((_,i)=>i!==index);tplCustomSave();
 downloadTemplate(kind);
 const pane=document.getElementById('tplCustomizePane');if(pane)pane.hidden=false;
}
function downloadTemplateFile(kind){
 const head=tplHead(kind);
 const csv=head.map(x=>`"${String(x).replace(/"/g,'""')}"`).join(',')+'\n';
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=kind+'-template.csv';a.click();URL.revokeObjectURL(a.href);
 closeLayer();toast(`${tplOf(kind).title} downloaded`);
}
function csvTemplatesHTML(){
  return `<div class="tpl-section"><div class="ds-section-title">CSV templates</div><p class="ds-caption">Each template has base columns. Custom columns are added to one template at a time and appear in its download.</p>
    <div class="ds-grid2">${CSV_TEMPLATES.map(t=>`<div class="ds-card ds-pad tpl-card" data-tpl="${t.k}">
      <div class="tpl-head"><div><strong class="tpl-title">${esc(t.title)}</strong><span class="ds-caption">${esc(t.desc)}</span></div><button class="ds-btn ds-btn--outline ds-btn--sm" onclick="openCustomField('${t.k}')">${icon('plus','ico-sm')}Add custom column</button></div>
      <div class="tpl-cols"><span class="tpl-lbl">Base</span>${t.base.map(c=>`<span class="tpl-chip">${esc(c)}</span>`).join('')}</div>
      <div class="tpl-cols"><span class="tpl-lbl">Custom</span>${(CUSTOM_COLS[t.k]||[]).length?CUSTOM_COLS[t.k].map(c=>`<span class="tpl-chip is-custom">${esc(c)}</span>`).join(''):'<span class="ds-caption">None yet</span>'}</div>
      <div class="ds-actions"><button class="ds-btn ds-btn--ghost ds-btn--sm" onclick="downloadTemplate('${t.k}')">${icon('download','ico-sm')}Download template</button></div></div>`).join('')}</div></div>`;
}
function settingsHTML(){
  return `<div class="ds-page">
    <div class="ds-head"><div><h1 class="ds-page-title">Workspace settings</h1><p class="ds-page-desc">Manage creator custom fields, roles and imports.</p></div>
    </div>
    ${csvTemplatesHTML()}
    <div class="ds-grid2">
      <div class="ds-card ds-pad"><span class="ds-section-title">Team access</span><p class="ds-caption">Owner assignments and permission controls should respect company roles.</p>
        <div class="ds-row-line"><span>Karan</span>${dsBadge('Admin','success')}</div><div class="ds-row-line"><span>Ankit</span>${dsBadge('Member')}</div>
        <div class="ds-actions"><button class="ds-btn ds-btn--outline" onclick="toast('Admin invitations are a proposed integration; no email is sent in the prototype')">${icon('plus','ico-sm')}Invite member</button></div></div>
    </div>
    <div class="ds-section-title">Import and change history</div>
    <div class="ds-card ds-pad">${AUDIT_LOG.slice(0,15).map(a=>`<div class="ds-row-line"><span>${esc(a.what)}</span><span class="ds-table-meta">${esc(a.time)}</span></div>`).join('')}</div>
    <div class="ds-actions"><button class="ds-btn ds-btn--danger" onclick="confirmReset()">Reset demo data</button></div>
  </div>`;
}
let AUDIT_LOG=[{what:'Demo records loaded',time:'Sample dataset'}];
function openCustomField(k){ const t=tplOf(k)||CSV_TEMPLATES[0]; dlg(`Add custom column to ${esc(t.title)}`,`This column is appended to the ${esc(t.title)} and appears in its download.`,dlgFld('Column name','fname',''),`<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--primary" onclick="addCustomField('${t.k}')">Add column</button>`); }
function addCustomField(k){ const n=dlgVal('fname'); if(!n) return toast('Enter a column name'); if(tplHead(k).some(x=>x.toLowerCase()===n.toLowerCase())) return toast('This template already has that column'); CUSTOM_COLS[k]=[...(CUSTOM_COLS[k]||[]),n]; closeLayer(); paintBody(); toast(`Column added to ${tplOf(k).title}`); }
function confirmReset(){ dlg('Reset demo data?','This restores the sample dataset for this prototype.','',`<button class="ds-btn ds-btn--outline" onclick="closeLayer()">Cancel</button><button class="ds-btn ds-btn--danger" onclick="closeLayer();toast('Demo reset · prototype only')">Reset</button>`); }

/* ── Deeplinks: #/<page>[/<id>][?tab=<n|key>&post=<id>] ── */
const ROUTE_PAGES=['discover','creators','shortlist','dashboard','campaigns','campaign','plan','settings'];
function syncHash(){
  if(typeof S==='undefined') return;
  const p=S.page; let id='';
  if(p==='discover'||p==='creators') id=detailId()||'';
  if(p==='plan') id=S.planId||'';
  if(p==='campaign') id=S.campId||'';
  const q=new URLSearchParams();
  if(detailId()&&S.tab) q.set('tab',S.tab);
  if(p==='plan'&&S.pTab&&S.pTab!=='overview') q.set('tab',S.pTab);
  if(p==='campaign'&&S.cTab&&S.cTab!=='performance') q.set('tab',S.cTab);
  if(S.post!=null&&document.querySelector('#layer [aria-label="Post details"]')) q.set('post',S.post);
  const h='#/'+p+(id?'/'+encodeURIComponent(id):'')+(q.toString()?'?'+q.toString():'');
  if(location.hash!==h){ try{ history.replaceState(null,'',h); }catch(e){} }
}
function applyHash(){
  /* clear any open drawer/modal without rewriting the URL we are reading */
  document.querySelectorAll('#layer > *').forEach(n=>n.remove());
  const raw=decodeURIComponent((location.hash||'').replace(/^#\/?/,''));
  const [path='',qs=''] =raw.split('?');
  const [pg='',...rest]=path.split('/'); const id=rest.join('/');
  const q=new URLSearchParams(qs);
  if(pg&&ROUTE_PAGES.includes(pg)){
    S.discCreator=null; S.myCreator=null; S.page=pg;
    const known=DISC.some(c=>c.id===id);
    if(pg==='discover'&&known) S.discCreator=id;
    if(pg==='creators'&&known) S.myCreator=id;
    if(pg==='plan'&&CAMP_PLANS.some(x=>x.id===id)){ S.planId=id; S.pTab=q.get('tab')||'overview'; }
    if(pg==='campaign'&&CAMP_LIST.some(x=>x.id===id)){ S.campId=id; S.cTab=q.get('tab')||'performance'; }
    if(detailId()){ const t=parseInt(q.get('tab'),10); if(!isNaN(t)&&t>=0&&t<TABS.length) S.tab=t; }
  }
  paintHeader(); paintBody(true);
  const pv=q.get('post');
  if(pv){ const num=Number(pv); if(POSTS.some(x=>x.id===num)) openPost(num); else if(CAMP_LIST.some(c=>c.posts.some(x=>x.id===pv))) openPost(pv); }
  window.scrollTo(0,0);
}

/* Initial paint (after all data consts are initialised), then follow the URL */
applyHash();
window.addEventListener('hashchange',applyHash);

/* ── Filter dropdowns: white menu of our own (the native <select> popup can't be styled) ── */
function dsEnhanceFilters(root){
  (root||document).querySelectorAll('.ds-filter:not(.is-enh)').forEach(lab=>{
    const sel=lab.querySelector('select'); if(!sel) return;
    lab.classList.add('is-enh');
    const menu=document.createElement('div'); menu.className='ds-menu'; menu.setAttribute('role','listbox');
    menu.innerHTML=[...sel.options].map(o=>`<button type="button" class="ds-menu-item${o.selected?' is-on':''}" role="option" aria-selected="${o.selected}" data-v="${esc(o.value)}"><span class="ds-menu-ck">${o.selected?'✓':''}</span><span>${esc(o.text)}</span></button>`).join('');
    lab.appendChild(menu);
  });
}
function dsCloseMenus(){ document.querySelectorAll('.ds-menu.open').forEach(m=>m.classList.remove('open')); }
document.addEventListener('click',e=>{
  const item=e.target.closest('.ds-menu-item');
  if(item){
    e.preventDefault(); e.stopPropagation();
    const lab=item.closest('.ds-filter'), sel=lab&&lab.querySelector('select');
    dsCloseMenus();
    if(sel){ sel.value=item.dataset.v; sel.dispatchEvent(new Event('change',{bubbles:true})); }
    return;
  }
  const lab=e.target.closest('.ds-filter');
  if(lab && !e.target.closest('.ds-filter-x')){
    e.preventDefault();
    const m=lab.querySelector('.ds-menu'), was=m&&m.classList.contains('open');
    dsCloseMenus();
    if(m&&!was) m.classList.add('open');
    return;
  }
  dsCloseMenus();
},true);
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ dsCloseMenus(); if(S.nlOpen){ S.nlOpen=false; paintBody(); } if(S.bulkOpen){ if(S.bulkStep){ S.bulkStep=null; } else { S.bulkOpen=false; } paintBody(); return; } if(S.myRowMenu){ S.myRowMenu=null; paintBody(); return; } if(S.myCfgOpen){ myCfgClose(); return; } if(S.addOpen){ addcClose(); return; } if(S.discCfgOpen){ discCfgClose(); return; } if(S.discColsOpen){ S.discColsOpen=false; paintBody(); } } });
document.addEventListener('click',e=>{ if((S.discColsOpen||S.myColsOpen||S.campColsOpen||S.dwOpen) && !e.target.closest('.disc-cols-wrap')){ S.discColsOpen=false; S.myColsOpen=false; S.campColsOpen=false; S.dwOpen=false; paintBody(); } if(S.myRowMenu && !e.target.closest('.my-menu') && !e.target.closest('.my-more')){ S.myRowMenu=null; paintBody(); } });
const dsFilterObserver=new MutationObserver(()=>dsEnhanceFilters(document.getElementById('main')));
dsFilterObserver.observe(document.getElementById('main'),{childList:true,subtree:true});
dsEnhanceFilters();
document.addEventListener('click',e=>{ if(S.acPop && !e.target.closest('.ac-bar--top,.ac-zwrap,.ac-vwrap,.ac-tab-add')){ S.acPop=null; paintBody(); } });

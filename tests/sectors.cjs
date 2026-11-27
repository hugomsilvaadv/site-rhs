// Content contract of the lower page: the real back-office, in a fixed order, with nothing invented.
const assert=require('node:assert/strict');const {chromium}=require('playwright');
const forbidden=/fingerprint|huella digital|device intelligence|multi-?account|multicuenta|cuentas vinculadas|linked accounts|account links|shared device|dispositivo compartido|crypto|cripto|artificial intelligence|inteligencia artificial|machine learning|certified|certificad|homologat|guaranteed|garantizad|\bPGS\b|\bPix\b|\bCPF\b|LGPD|Brazil|Brasil|real[- ]time|tiempo real/i;
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{
for(const lang of ['en','es']){
const p=await b.newPage({viewport:{width:1440,height:1100}});await p.goto('http://127.0.0.1:8000/'+(lang==='es'?'es/':''),{waitUntil:'networkidle'});
const where=`(${lang})`;
assert.deepEqual(await p.locator('[data-sector]').evaluateAll(els=>els.map(e=>e.dataset.sector)),['2','3','4','5','6','7','8','9','10','11'],'ten ordered lower sectors '+where);
assert.deepEqual(await p.locator('.rhs-content > section').evaluateAll(els=>els.map(e=>e.id)),['platform','modules','player-360','payments','compliance','intelligence','security','pilot','company','contact'],'section ids '+where);
// Tour: seven areas, each with its commercial module and three or four bullets; one panel shown at a time.
const tabs=p.locator('#platform [role="tab"]');assert.equal(await tabs.count(),7,'seven tour areas '+where);
const panels=await p.locator('#platform [role="tabpanel"]').evaluateAll(els=>els.map(e=>({id:e.id,hidden:e.hidden,module:e.querySelector('.rhs-module')?.textContent.trim(),bullets:e.querySelectorAll('.rhs-ticks li').length,screens:e.querySelectorAll('.rhs-screens li, .rhs-screen-chips li').length})));
assert.deepEqual(panels.map(x=>x.id),['tour-players','tour-payments','tour-risk','tour-engagement','tour-compliance','tour-reports','tour-admin']);
assert.deepEqual(panels.map(x=>x.hidden),[false,true,true,true,true,true,true],'only the first area visible at load '+where);
for(const x of panels){assert.match(x.module,/(Module|Módulo) (Core|Payments|Intelligence|Fraud)$/,x.id);assert.ok(x.bullets>=3&&x.bullets<=4,x.id+' bullets');assert.ok(x.screens>=1,x.id+' screens');}
assert.deepEqual(panels.map(x=>x.module.split(' ').pop()),['Core','Payments','Fraud','Core','Core','Intelligence','Core'],'module of each area '+where);
// Modules: four cards, each opening its tour area or section; Complete.
assert.deepEqual(await p.locator('#modules .rhs-product .rhs-card-link').evaluateAll(els=>els.map(e=>e.getAttribute('href'))),['#tour-players','#payments','#tour-reports','#tour-risk']);
for(const text of await p.locator('#modules .rhs-product p').allTextContents())assert.ok(text.length<190,'module copy stays concise');
assert.ok(await p.locator('#modules .rhs-complete').count());
// Player 360, payments, compliance, security, pilot.
assert.equal(await p.locator('#player-360 .rhs-anatomy li').count(),5,'five Player 360 parts '+where);
assert.equal(await p.locator('#payments .rhs-flow-step').count(),7,'withdrawal states '+where);assert.equal(await p.locator('#payments .rhs-flow-side li').count(),4);
assert.equal(await p.locator('#payments .rhs-capabilities li').count(),6,'six payment capabilities '+where);
assert.equal(await p.locator('#compliance .rhs-control-grid li').count(),7,'seven compliance controls '+where);
assert.equal(await p.locator('#security .rhs-security-list li').count(),5,'five security points '+where);assert.equal(await p.locator('#security .rhs-arch li').count(),3);
assert.equal(await p.locator('#pilot .rhs-step').count(),4,'four pilot steps '+where);
// Connected intelligence stays a concept diagram around one account: no other accounts, no product image.
assert.equal(await p.locator('#intelligence img, #intelligence .rhs-frame, #intelligence .rhs-graph-account').count(),0);
assert.equal(await p.locator('#intelligence .rhs-signal').count(),6);assert.match(await p.locator('#intelligence figcaption').innerText(),/Concept|conceptual/i);
// Nothing invented or out of scope in the lower page, the hero copy or the metadata.
const text=await p.evaluate(()=>document.querySelector('.rhs-content').innerText+' '+document.querySelector('#home').innerText+' '+document.title+' '+document.querySelector('meta[name="description"]').content);
assert.doesNotMatch(text,forbidden,'no invented or out-of-scope claims '+where);
// Product images: assets/product/<screen>.webp of the capture plan, shown only once the file is a real capture
// (never the registered "Screenshot pending" placeholder): framed, described, 3200x2000, at most one per tour
// area plus the Player 360 and payments. An area without its capture still lists its screens.
const fs=require('node:fs'),crypto=require('node:crypto');
const registry=JSON.parse(fs.readFileSync(__dirname+'/../tools/capture/placeholders.json','utf8')).files;
const plan=Object.keys(registry).map(f=>'/'+f);
const isCapture=src=>{const file=__dirname+'/..'+src;return fs.existsSync(file)&&crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==registry[src.slice(1)];};
const slots=[['tour-players','player-360-payments'],['tour-payments','withdrawals-queue'],['tour-risk','alerts'],['tour-engagement','segments'],['tour-compliance','audit'],['tour-reports','reports'],['tour-admin','approval-limits'],['player-360','player-360-summary'],['payments','withdrawal-detail']].map(([area,name])=>[area,'/assets/product/'+name+'.webp']);
const imgs=await p.locator('.rhs-content img').evaluateAll(els=>els.map(e=>({src:e.getAttribute('src'),frame:!!e.closest('.rhs-frame'),alt:e.getAttribute('alt'),size:[e.getAttribute('width'),e.getAttribute('height')],area:e.closest('[role="tabpanel"],section')?.id})));
assert.deepEqual(imgs.map(i=>[i.area,i.src]),slots.filter(([,src])=>isCapture(src)),'a product image exactly where its capture exists '+where);
for(const img of imgs){assert.ok(plan.includes(img.src),'screen of the capture plan: '+img.src);assert.ok(isCapture(img.src),'never a placeholder: '+img.src);assert.ok(img.frame,'framed '+img.src);assert.ok(img.alt.length>20,'described '+img.src);assert.deepEqual(img.size,['3200','2000']);}
for(const src of await p.locator('.rhs-content picture source').evaluateAll(els=>els.map(e=>e.getAttribute('srcset'))))assert.ok(plan.includes(src)&&src.endsWith('-mobile.webp')&&isCapture(src),'phone capture of the plan: '+src);
assert.equal(await p.locator('.rhs-content .rhs-frame:not(:has(img)), .rhs-content .rhs-wide-shot:not(:has(img))').count(),0,'no empty frame where a capture is missing '+where);
assert.equal(await p.locator('.rhs-content .rhs-frame-phone:not(:has(source)), .rhs-content .rhs-frame:has(source):not(.rhs-frame-phone)').count(),0,'phone frame exactly where a phone capture is shown '+where);
assert.equal(await p.locator('#platform .rhs-tour-visual > .rhs-screens').count(),7,'every tour area keeps its list of screens '+where);
const hero=await p.locator('[data-hero-images]').getAttribute('data-hero-images');
assert.equal((await p.locator('.rhs-footer [data-notice]').getAttribute('data-notice')).split(' ').includes('product'),imgs.length>0||hero==='product','the footer speaks of product screens only when the page shows one '+where);
assert.equal(await p.locator('.rhs-footer [data-notice]').count(),1,'one footer notice');
// Conversion: "Request a demo" first (header, hero, contact), "Discuss a pilot" second (hero → #pilot, pilot, contact);
// every CTA is a pre-filled e-mail with a subject and the template fields, never a form.
const ctas=await p.locator('a[data-cta]').evaluateAll(els=>els.map(a=>({kind:a.dataset.cta,href:a.getAttribute('href'),where:a.closest('header')?'header':a.closest('#home')?'hero':a.closest('section')?.id})));
assert.deepEqual(ctas.map(c=>c.where+':'+c.kind),['header:demo','hero:demo','pilot:pilot','contact:demo','contact:pilot'],'CTA placement '+where);
assert.equal(await p.locator('#home .hero-buttons a.alt').getAttribute('href'),'#pilot','secondary hero CTA explains the pilot');
const fields=lang==='es'?['Empresa:','Jurisdicción(es):','Volumen aproximado','Módulos de interés']:['Company:','Jurisdiction(s):','Approximate volume','Modules of interest'];
for(const c of ctas){const url=new URL(c.href);assert.equal(url.protocol+url.pathname,'mailto:sales@rhs-labs.com');
 const subject=url.searchParams.get('subject'),body=url.searchParams.get('body');assert.ok(subject&&subject.length>8,'subject '+c.kind);
 for(const f of fields)assert.ok(body.includes(f),c.kind+' template has '+f);assert.ok(body.includes('\r\n'),'CRLF line breaks');}
assert.notEqual(new URL(ctas[0].href).searchParams.get('subject'),new URL(ctas[2].href).searchParams.get('subject'),'demo and pilot e-mails differ');
assert.ok(await p.locator('a[href^="mailto:sales@rhs-labs.com"]').count());
assert.equal(await p.locator('link[rel="canonical"]').getAttribute('href'),'https://rhs-labs.com/'+(lang==='es'?'es/':''));
assert.equal(await p.locator('a[href*="resources"],form,input').count(),0,'no form or lead collection');
await p.close();}
console.log('PASS: ten sectors EN/ES, tour areas with modules, Player 360, payments states, controls, security, pilot, concept-only intelligence, no invented claims, canonical');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});

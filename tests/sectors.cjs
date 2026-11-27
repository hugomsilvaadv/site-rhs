// Content contract of the lower page: Sentinel, available now, and the PAM back-office, in development, in a
// fixed order, with nothing invented or out of scope.
const assert=require('node:assert/strict');const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const forbidden=/fingerprint|huella digital|device intelligence|multi-?account|multicuenta|cuentas vinculadas|linked accounts|account links|shared device|dispositivo compartido|\bdevices?\b|dispositivos?\b|\bIP address|direcci[oó]n IP|\bVPN\b|crypto|cripto|artificial intelligence|inteligencia artificial|machine learning|aprendizaje autom|\bAI\b|\bIA\b|certified|certificad|homologat|guaranteed|garantizad|\bPGS\b|\bPix\b|\bCPF\b|LGPD|Brazil|Brasil|real[- ]time|tiempo real/i;
// The screens the page may show: the Sentinel import list (tools/capture/sentinel.config.mjs) and the registered
// back-office placeholders, which are never shown.
const root=path.join(__dirname,'..');
const registry=JSON.parse(fs.readFileSync(path.join(root,'tools/capture/placeholders.json'),'utf8')).files;
const sentinel=[...fs.readFileSync(path.join(root,'tools/capture/sentinel.config.mjs'),'utf8').matchAll(/name: '([a-z0-9-]+)'/g)].map(m=>'/assets/product/'+m[1]+'.webp');
const isCapture=src=>{const file=path.join(root,src);return fs.existsSync(file)&&crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==registry[src.slice(1)];};
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{
for(const lang of ['en','es']){
const p=await b.newPage({viewport:{width:1440,height:1100}});await p.goto('http://127.0.0.1:8000/'+(lang==='es'?'es/':''),{waitUntil:'networkidle'});
const where=`(${lang})`;
assert.deepEqual(await p.locator('[data-sector]').evaluateAll(els=>els.map(e=>e.dataset.sector)),['2','3','4','5','6','7','8','9'],'eight ordered lower sectors '+where);
assert.deepEqual(await p.locator('.rhs-content > section').evaluateAll(els=>els.map(e=>e.id)),['platform','how','security','modules','back-office','pilot','company','contact'],'section ids '+where);
// Availability: the Sentinel sections say available now; the back-office section says in development, once.
assert.deepEqual(await p.locator('.rhs-content > section[data-status]').evaluateAll(els=>els.map(e=>e.id+':'+e.dataset.status)),['platform:available','how:available','security:available','back-office:development'],'availability of each section '+where);
assert.equal(await p.locator('#platform .rhs-section-heading .rhs-status-available').count(),1,'Sentinel marked available now '+where);
assert.equal(await p.locator('#back-office .rhs-status-development').count(),1,'back-office marked in development '+where);
assert.match(await p.locator('#back-office .rhs-sector-copy').innerText(),lang==='es'?/en desarrollo y todavía no están disponibles/:/in development and not yet available/,'the back-office says it is not yet available '+where);
assert.equal(await p.locator('#back-office img, #back-office .rhs-frame, #back-office picture').count(),0,'no product image for the back-office in development '+where);
assert.equal(await p.locator('#back-office .rhs-control-grid li').count(),6,'six back-office areas '+where);
// Tour: four Sentinel areas, three bullets each; one panel shown at a time.
const tabs=p.locator('#platform [role="tab"]');assert.equal(await tabs.count(),4,'four Sentinel areas '+where);
const panels=await p.locator('#platform [role="tabpanel"]').evaluateAll(els=>els.map(e=>({id:e.id,hidden:e.hidden,bullets:e.querySelectorAll('.rhs-ticks li').length,screens:e.querySelectorAll('.rhs-screens li').length})));
assert.deepEqual(panels.map(x=>x.id),['tour-transactions','tour-alerts','tour-rules','tour-customers']);
assert.deepEqual(panels.map(x=>x.hidden),[false,true,true,true],'only the first area visible at load '+where);
for(const x of panels){assert.equal(x.bullets,3,x.id+' bullets');assert.ok(x.screens>=3,x.id+' screens');}
// How it works, access and integration, modules, getting started.
assert.equal(await p.locator('#how .rhs-flow-step').count(),6,'six steps of a risky withdrawal '+where);
assert.equal(await p.locator('#how .rhs-flow-optional').count(),2,'two steps depend on the settings '+where);
assert.equal(await p.locator('#how .rhs-capabilities li').count(),6,'six review capabilities '+where);
assert.equal(await p.locator('#security .rhs-security-list li').count(),6,'six access and integration points '+where);assert.equal(await p.locator('#security .rhs-arch li').count(),3);
assert.deepEqual(await p.locator('#modules .rhs-product').evaluateAll(els=>els.map(e=>e.dataset.status)),['available','development','development','development'],'Fraud available, the other modules in development '+where);
assert.deepEqual(await p.locator('#modules .rhs-product .rhs-card-link').evaluateAll(els=>els.map(e=>e.getAttribute('href'))),['#platform','#back-office','#back-office','#back-office']);
for(const text of await p.locator('#modules .rhs-product p').allTextContents())assert.ok(text.length<190,'module copy stays concise');
assert.equal(await p.locator('#pilot .rhs-step').count(),4,'four steps to get started '+where);
// The anchors of the published site keep a target.
for(const id of ['home','platform','modules','intelligence','payments','security','company','contact','how','use-cases','privacy'])assert.equal(await p.locator('#'+id).count(),1,'anchor #'+id+' '+where);
// Nothing invented or out of scope in the lower page, the hero copy or the metadata.
const text=await p.evaluate(()=>document.querySelector('.rhs-content').innerText+' '+document.querySelector('#home').innerText+' '+document.title+' '+document.querySelector('meta[name="description"]').content);
assert.doesNotMatch(text,forbidden,'no invented or out-of-scope claims '+where);
// Product images: assets/product/<screen>.webp of the Sentinel import list, shown only once the file is a real
// capture (never a registered placeholder): framed, described, 3200x2000, at most one per tour area plus the
// how-it-works and access sections. An area without its capture still lists its screens.
const slots=[['tour-transactions','sentinel-transactions'],['tour-alerts','sentinel-alerts'],['tour-rules','sentinel-rules'],['tour-customers','sentinel-customer'],['how','sentinel-transaction-detail'],['security','sentinel-roles']].map(([area,name])=>[area,'/assets/product/'+name+'.webp']);
const imgs=await p.locator('.rhs-content img').evaluateAll(els=>els.map(e=>({src:e.getAttribute('src'),frame:!!e.closest('.rhs-frame'),alt:e.getAttribute('alt'),size:[e.getAttribute('width'),e.getAttribute('height')],area:e.closest('[role="tabpanel"],section')?.id})));
assert.deepEqual(imgs.map(i=>[i.area,i.src]),slots.filter(([,src])=>isCapture(src)),'a product image exactly where its capture exists '+where);
for(const img of imgs){assert.ok(sentinel.includes(img.src),'screen of the Sentinel import list: '+img.src);assert.ok(isCapture(img.src),'never a placeholder: '+img.src);assert.ok(img.frame,'framed '+img.src);assert.ok(img.alt.length>20,'described '+img.src);assert.deepEqual(img.size,['3200','2000']);}
for(const src of await p.locator('.rhs-content picture source').evaluateAll(els=>els.map(e=>e.getAttribute('srcset'))))assert.ok(sentinel.includes(src)&&src.endsWith('-mobile.webp')&&isCapture(src),'phone capture of the import list: '+src);
assert.equal(await p.locator('.rhs-content .rhs-frame:not(:has(img)), .rhs-content .rhs-wide-shot:not(:has(img))').count(),0,'no empty frame where a capture is missing '+where);
assert.equal(await p.locator('.rhs-content .rhs-frame-phone:not(:has(source)), .rhs-content .rhs-frame:has(source):not(.rhs-frame-phone)').count(),0,'phone frame exactly where a phone capture is shown '+where);
assert.equal(await p.locator('#platform .rhs-tour-visual > .rhs-screens').count(),4,'every tour area keeps its list of screens '+where);
const hero=await p.locator('[data-hero-images]').getAttribute('data-hero-images');
const notice=(await p.locator('.rhs-footer [data-notice]').getAttribute('data-notice')).split(' ');
assert.equal(notice.includes('product'),imgs.length>0||hero==='product','the footer speaks of product screens only when the page shows one '+where);
assert.equal(notice.includes('concept'),hero==='concept','the footer speaks of concept art only while the hero shows it '+where);
assert.equal(await p.locator('.rhs-footer [data-notice]').count(),1,'one footer notice');
// Conversion: "Request a demo" first (header, hero, contact), "Discuss a pilot" second (hero → #pilot, pilot, contact);
// every CTA is a pre-filled e-mail with a subject and the template fields, never a form.
const ctas=await p.locator('a[data-cta]').evaluateAll(els=>els.map(a=>({kind:a.dataset.cta,href:a.getAttribute('href'),where:a.closest('header')?'header':a.closest('#home')?'hero':a.closest('section')?.id})));
assert.deepEqual(ctas.map(c=>c.where+':'+c.kind),['header:demo','hero:demo','pilot:pilot','contact:demo','contact:pilot'],'CTA placement '+where);
assert.equal(await p.locator('#home .hero-buttons a.alt').getAttribute('href'),'#pilot','secondary hero CTA explains how to start');
const fields=lang==='es'?['Empresa:','Jurisdicción(es):','Volumen aproximado','Módulos de interés']:['Company:','Jurisdiction(s):','Approximate volume','Modules of interest'];
for(const c of ctas){const url=new URL(c.href);assert.equal(url.protocol+url.pathname,'mailto:sales@rhs-labs.com');
 const subject=url.searchParams.get('subject'),body=url.searchParams.get('body');assert.ok(subject&&subject.length>8,'subject '+c.kind);
 for(const f of fields)assert.ok(body.includes(f),c.kind+' template has '+f);assert.ok(body.includes('\r\n'),'CRLF line breaks');}
assert.notEqual(new URL(ctas[0].href).searchParams.get('subject'),new URL(ctas[2].href).searchParams.get('subject'),'demo and pilot e-mails differ');
assert.ok(await p.locator('a[href^="mailto:sales@rhs-labs.com"]').count());
assert.equal(await p.locator('link[rel="canonical"]').getAttribute('href'),'https://rhs-labs.com/'+(lang==='es'?'es/':''));
assert.equal(await p.locator('a[href*="resources"],form,input').count(),0,'no form or lead collection');
await p.close();}
console.log('PASS: eight sectors EN/ES, Sentinel available (four tour areas, how it works, access and integration), modules by availability, PAM back-office in development without images, getting started, no invented or out-of-scope claims, canonical');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});

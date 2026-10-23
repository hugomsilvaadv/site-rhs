const {chromium}=require('playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
const path=require('node:path');const root=path.join(__dirname,'..');const out=root+'/docs/web-studio/evidence/';
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const results=[];
 try{
 for(const width of [320,390,768,1024,1280,1440,1920]){
  const p=await b.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  const errors=[],failed=[];p.on('pageerror',e=>errors.push(e.message));p.on('requestfailed',r=>failed.push(r.url()));
  await p.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);
  const state=await p.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>!document.getElementById(h.slice(1)))}));
  assert.equal(state.scroll,state.viewport,`EN overflow ${width}`);assert.ok(state.images);assert.deepEqual(state.links,[]);assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  if([390,1440].includes(width)){
   await p.locator('#home').screenshot({path:out+`hero-integrated-${width}.png`});
   const ref=await b.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
   await ref.route('https://fonts.googleapis.com/**',route=>route.fulfill({contentType:'text/css',body:fs.readFileSync(root+'/assets/fonts.css','utf8').replaceAll("url('/assets/","url('http://127.0.0.1:8001/assets/")}));
   await ref.route('http://127.0.0.1:8001/assets/fonts/**',route=>route.fulfill({contentType:'font/woff2',body:fs.readFileSync(root+'/assets/fonts/'+path.basename(route.request().url()))}));
   await ref.goto('http://127.0.0.1:8001/RHS_Labs_V6_HERO_APROVADO.html',{waitUntil:'networkidle'});await ref.evaluate(()=>document.fonts.ready);
   await ref.locator('#home').screenshot({path:out+`hero-reference-${width}.png`});
   await ref.close();
  }
  await p.goto('http://127.0.0.1:8000/es/',{waitUntil:'networkidle'});
  const es=await p.evaluate(()=>({lang:document.documentElement.lang,viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.equal(es.lang,'es');assert.equal(es.scroll,es.viewport,`ES overflow ${width}`);
  if([390,1440].includes(width))await p.screenshot({path:out+`spanish-${width}.png`,fullPage:true});
  results.push({width,...state,es,errors,failed});await p.close();
 }
 fs.writeFileSync(out+'responsive.json',JSON.stringify(results,null,2));console.log('PASS: responsive EN/ES, assets, anchors, console, network at 320/390/768/1024/1280/1440/1920');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

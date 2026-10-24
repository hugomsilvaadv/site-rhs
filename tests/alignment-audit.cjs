const{chromium}=require('playwright');const fs=require('node:fs');const assert=require('node:assert/strict');
const out=__dirname+'/../docs/web-studio/alignment-evidence/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const results=[];
try{for(const width of [320,375,390,430,768,1024,1280,1440,1920])for(const lang of ['en','es']){
 const p=await b.newPage({viewport:{width,height:1100},reducedMotion:'reduce'});const errors=[],failed=[],http=[];p.on('pageerror',e=>errors.push(e.message));p.on('requestfailed',r=>failed.push(r.url()));p.on('response',r=>{if(r.status()>=400)http.push({url:r.url(),status:r.status()})});
 await p.goto('http://127.0.0.1:8000/'+(lang==='es'?'es/':''),{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const info=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,lang:document.documentElement.lang,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),anchors:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.hash).filter(h=>!document.getElementById(h.slice(1))),canonical:document.querySelector('link[rel="canonical"]').href,excluded:/Brasil|Brazil|LGPD|SOC.?2|ISO.?27001|guaranteed/i.test(document.querySelector('.rhs-content').innerText),outside:[...document.querySelectorAll('.rhs-content h2,.rhs-content p,.rhs-content .btn,.rhs-content article,.rhs-content svg')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.left<-.5||r.right>innerWidth+.5)}).map(el=>el.className.baseVal||el.className)}));
 assert.equal(info.scroll,info.width,`overflow ${width}/${lang}`);assert.equal(info.lang,lang);assert.ok(info.images);assert.deepEqual(info.anchors,[]);assert.deepEqual(info.outside,[]);assert.equal(info.excluded,false);assert.equal(info.canonical,'https://rhs-labs.com/'+(lang==='es'?'es/':''));assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(http,[]);
 if([390,1440].includes(width)){
  await p.screenshot({path:out+`${lang}-full-${width}.png`,fullPage:true});
  for(const id of ['platform','modules','intelligence','payments','how','security','company','contact'])await p.locator('#'+id).screenshot({path:out+`${lang}-${id}-${width}.png`});
 }
 results.push({...info,errors,failed,http});await p.close();
}fs.writeFileSync(out+'responsive.json',JSON.stringify(results,null,2));console.log('PASS: 18 EN/ES × width combinations, resources, console, anchors, graph/chart bounds, content and canonical');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});

// Deterministic default-motion geometry comparison at sampled phases of two laps.
// This supplements the real-time two-lap observation; it does not replace it.
const{chromium}=require('playwright');const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const reports=[];
try{for(const width of [768,1024,1280,1440,1920]){
 const pages=[];
 for(const original of [true,false]){
  const p=await b.newPage({viewport:{width,height:1200}});
  await p.addInitScript(()=>{let next=0;const queue=new Map();window.requestAnimationFrame=callback=>{queue.set(++next,callback);return next};window.cancelAnimationFrame=id=>queue.delete(id);window.qaStep=time=>{const callbacks=[...queue.values()];queue.clear();callbacks.forEach(cb=>cb(time));};});
  if(original){
   await p.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:fs.readFileSync(__dirname+'/../assets/fonts.css','utf8').replaceAll("url('/assets/","url('http://127.0.0.1:8000/assets/")}));
   await p.route('http://127.0.0.1:8000/assets/fonts/**',r=>r.fulfill({contentType:'font/woff2',headers:{'access-control-allow-origin':'*'},body:fs.readFileSync(__dirname+'/../assets/fonts/'+r.request().url().split('/').at(-1))}));
  }
  await p.goto(original?'http://127.0.0.1:8001/RHS_Labs_V6_HERO_APROVADO.html':'http://127.0.0.1:8000/',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
  const samples=await p.evaluate(()=>{
   const result=[];let now=0;const track=document.querySelector('#carousel-track');
   for(let tick=0;tick<=800;tick++){
    window.qaStep(now);now+=60;
    if(tick%5!==0)continue;
    const s=track.getBoundingClientRect();
    result.push([...document.querySelectorAll('.product-screen')].map(el=>{const r=el.getBoundingClientRect();return{style:el.getAttribute('style'),left:r.left-s.left,right:s.right-r.right,top:r.top-s.top,bottom:s.bottom-r.bottom};}));
   }return result;
  });pages.push(samples);await p.close();
 }
 assert.equal(pages[0].length,pages[1].length);
 for(let i=0;i<pages[0].length;i++)for(let n=0;n<3;n++){
  assert.deepEqual(pages[1][i][n],pages[0][i][n],`V6 geometry mismatch width=${width} sample=${i} panel=${n}`);
  for(const side of ['left','right','top','bottom'])assert.ok(pages[1][i][n][side]>=-1,`clipping width=${width} ${side}`);
 }
 const summary={width,samples:pages[0].length,simulatedSeconds:48,allThreePanelStylesAndBoundsMatchV6:true,noClipping:true};reports.push(summary);console.log(JSON.stringify(summary));
}fs.writeFileSync(__dirname+'/../docs/web-studio/evidence/geometry-comparison.json',JSON.stringify(reports,null,2));}
finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});

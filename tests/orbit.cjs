const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const out=__dirname+'/../docs/web-studio/evidence/';
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const contexts=await Promise.all([1440].map(async width=>{
  const p=await b.newPage({viewport:{width,height:1000}});
  await p.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
  await p.evaluate(()=>{
   const stage=document.querySelector('#carousel-track');
   const panels=[...document.querySelectorAll('.product-screen')];
   window.orbitQA={samples:[],start:performance.now(),travel:0,last:null,fronts:[]};
   window.qaTimer=setInterval(()=>{
    const qa=window.orbitQA, a=Number(panels[0].dataset.angle);
    if(qa.last!==null){let d=a-qa.last;if(d < -Math.PI)d+=Math.PI*2;qa.travel+=Math.max(0,d);}
    qa.last=a;
    const s=stage.getBoundingClientRect();
    qa.samples.push({at:performance.now()-qa.start,angle:a,panels:panels.map(p=>{
     const r=p.getBoundingClientRect();
     return {left:r.left-s.left,right:s.right-r.right,top:r.top-s.top,bottom:s.bottom-r.bottom,opacity:+getComputedStyle(p).opacity,depth:+p.dataset.depth};
    })});
    const front=panels.findIndex(p=>p.dataset.inFront==='true');
    if(qa.fronts.at(-1)!==front)qa.fronts.push(front);
    if(qa.travel>=4*Math.PI+.04){clearInterval(window.qaTimer);qa.done=true;}
   },100);
  });
  return {width,p};
 }));
 console.log('Observing two real continuous laps on desktop...');
 for(const {width,p} of contexts){
  await p.waitForFunction(()=>window.orbitQA.done,{},{timeout:85000});
  const data=await p.evaluate(()=>window.orbitQA);
  fs.writeFileSync(out+`orbit-${width}.json`,JSON.stringify(data));
  const vals=data.samples.flatMap(s=>s.panels);
  const summary={width,seconds:(data.samples.at(-1).at/1000).toFixed(2),cycles:data.travel/(2*Math.PI),samples:data.samples.length,fronts:data.fronts,minimum:Object.fromEntries(['left','right','top','bottom','opacity'].map(k=>[k,Math.min(...vals.map(x=>x[k]))]))};
  fs.writeFileSync(out+`orbit-${width}-summary.json`,JSON.stringify(summary,null,2));
  console.log(JSON.stringify(summary));
  assert.ok(summary.cycles>=2);
  for(const k of ['left','right','top','bottom'])assert.ok(summary.minimum[k]>=-1,`Clipping at ${width}: ${k}=${summary.minimum[k]}`);
  assert.ok(summary.minimum.opacity>=.75);
 }
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

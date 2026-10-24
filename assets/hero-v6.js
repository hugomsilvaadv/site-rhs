
/* Continuous true 3D orbit: no fades between fixed slides, no step-based switching. */
(function(){
  const area=document.getElementById('hero-carousel');
  const stage=document.getElementById('carousel-track');
  if(!area || !stage) return;
  const panels=Array.from(stage.querySelectorAll('.product-screen'));
  const dots=Array.from(area.querySelectorAll('.carousel-dot'));
  const title=document.getElementById('showcase-title');
  if(panels.length!==3) return;

  const namesEN=['Operations Control Center','Multi-account Investigation','Payments and Risk Overview'];
  const namesES=['Centro de control operativo','Investigación de cuentas vinculadas','Vista de pagos y riesgo'];
  let names=document.documentElement.lang==='es'?namesES:namesEN;
  let paused=false;
  const TAU=Math.PI*2;
  const angularSpeed=TAU/23500; // one continuous 360° lap every 23.5 seconds
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let phase=0, lastFrame=null, requestId=0, activeIndex=-1, bias=0, manual=null;
  let touchX=0;

  let dimensionsCache=null;
  function dimensions(){
    if(dimensionsCache) return dimensionsCache;
    const width=stage.clientWidth;
    return dimensionsCache={
      width,
      // Responsive orbital radius keeps all three entire dashboards within
      // the available viewport, even at the widest point of their orbit.
      radiusX:Math.max(16,Math.min(width*.29,
        width/2-Math.max(18,width*.035)-panels[0].offsetWidth*(width<560?.49:width<=900?.55:.50))),
      radiusZ:width<560?105:width<840?155:245,
      radiusY:Math.min(29,width*.036),
      perspective:width<560?950:width<840?1200:1550
    };
  }

  function render(){
    const {radiusX,radiusZ,radiusY,width}=dimensions();
    let foremost=0;
    let foremostDepth=-Infinity;
    const framePhase=phase+bias;
    panels.forEach((panel,index)=>{
      const angle=framePhase-index*TAU/panels.length;
      const sin=Math.sin(angle), cos=Math.cos(angle);
      const x=radiusX*sin;
      const z=radiusZ*cos;
      const y=18-radiusY*.43*cos+radiusY*.12*Math.sin(angle*2);
      const tilt=-sin*(width<560?21:34);
      const size=.87+.10*cos;
      // Physical x, y and depth positions. Screens never reset their positions.
      panel.style.transform=`translate(-50%,-50%) translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z.toFixed(2)}px) rotateY(${tilt.toFixed(2)}deg) scale(${size.toFixed(3)})`;
      panel.style.opacity=(.75+.25*(cos+1)/2).toFixed(3);
      panel.style.filter=`brightness(${(.75+.27*(cos+1)/2).toFixed(3)}) saturate(${(.9+.12*(cos+1)/2).toFixed(3)})`;
      panel.style.zIndex=String(1000+Math.round(z));
      panel.setAttribute('aria-hidden',z>0?'false':'true');
      if(z>foremostDepth){foremostDepth=z;foremost=index;}
      panel.dataset.angle=angle.toFixed(4);
      panel.dataset.depth=z.toFixed(1);
    });
    if(foremost!==activeIndex){
      activeIndex=foremost;
      panels.forEach((p,i)=>p.dataset.inFront=String(i===activeIndex));
      dots.forEach((d,i)=>{
        d.classList.toggle('is-current',i===activeIndex);
        if(i===activeIndex)d.setAttribute('aria-current','true');
        else d.removeAttribute('aria-current');
      });
      if(title)title.textContent=String(activeIndex+1).padStart(2,'0')+'  /  '+names[activeIndex]+(document.documentElement.lang==='es'?'  ·  ÓRBITA 3D CONTINUA':'  ·  CONTINUOUS 3D ORBIT');
    }
  }

  function animate(time){
    if(lastFrame===null)lastFrame=time;
    // Avoid a large position jump when the tab was hidden or the browser suspended.
    const delta=Math.min(60,Math.max(0,time-lastFrame));
    lastFrame=time;
    if(!reducedMotion.matches && !paused){
      phase=(phase+delta*angularSpeed)%TAU;
      if(manual){
        const progress=Math.min(1,(time-manual.start)/manual.duration);
        const eased=progress<.5?4*progress*progress*progress:1-Math.pow(-2*progress+2,3)/2;
        bias=manual.from+manual.delta*eased;
        if(progress===1){manual=null;bias%=TAU;}
      }
    }
    render();
    requestId=requestAnimationFrame(animate);
  }

  function bringToFront(index){
    if(reducedMotion.matches){phase=index*TAU/panels.length;bias=0;render();return;}
    // Optionally accelerate smoothly to the chosen panel without teleporting it.
    const actual=(phase+bias)%TAU;
    const target=(index*TAU/panels.length)%TAU;
    const delta=(target-actual+TAU)%TAU;
    manual={from:bias,delta:delta<.02?0:delta,start:performance.now(),duration:1100};
  }
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>bringToFront(i)));
  area.addEventListener('touchstart',event=>{touchX=event.changedTouches[0].clientX;},{passive:true});
  area.addEventListener('touchend',event=>{
    const dx=event.changedTouches[0].clientX-touchX;
    if(Math.abs(dx)>45)bringToFront((activeIndex+(dx<0?1:2))%panels.length);
  },{passive:true});
  reducedMotion.addEventListener?.('change',()=>{if(reducedMotion.matches){manual=null;}});
  document.addEventListener('visibilitychange',()=>{lastFrame=null;if(document.hidden){cancelAnimationFrame(requestId);}else{requestId=requestAnimationFrame(animate);}});
  document.addEventListener('rhs:motion',e=>{paused=e.detail;});
  document.addEventListener('rhs:language',()=>{names=document.documentElement.lang==='es'?namesES:namesEN;activeIndex=-1;render();});

  // Geometry depends on viewport/panel dimensions, not on orbital phase.
  // Cache layout reads until resize; keep the approved transform math intact.
  window.addEventListener('resize',()=>{dimensionsCache=null;},{passive:true});
  if('ResizeObserver' in window){const observer=new ResizeObserver(()=>{dimensionsCache=null;});observer.observe(stage);observer.observe(panels[0]);}
  stage.classList.add('orbit-active');
  stage.classList.add('is-ready');
  render();
  requestId=requestAnimationFrame(animate);
})();

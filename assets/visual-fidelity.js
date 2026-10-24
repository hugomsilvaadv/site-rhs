/* Visual fidelity for approved lower-page reference.
 * Graphics are illustrative; data and account relationships remain simulated.
 * No external libraries, requests or inferred fraud decisions. */
(() => {
  'use strict';
  const ns='http://www.w3.org/2000/svg';
  const make=(tag,attrs={})=>{const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,String(v)));return e;};
  const graph=document.querySelector('.rhs-content .rhs-graph');
  if(graph && !graph.dataset.fidelity){
    graph.dataset.fidelity='v2';
    const defs=make('defs');
    const radial=(id,c1,c2)=>{
      const g=make('radialGradient',{id,cx:'35%',cy:'28%',r:'78%'});
      g.append(make('stop',{offset:'0%', 'stop-color':c1}),make('stop',{offset:'100%', 'stop-color':c2}));
      defs.append(g);
    };
    radial('rhs-node-blue','#153d59','#061929');
    radial('rhs-node-red','#512a3a','#180d21');
    radial('rhs-selected-fill','#6b3048','#190e25');
    const halo=make('filter',{id:'rhs-link-halo',x:'-100%',y:'-100%',width:'300%',height:'300%'});
    halo.append(make('feGaussianBlur',{stdDeviation:4}));
    defs.append(halo);
    graph.insertBefore(defs,graph.firstElementChild);
    const decor=make('g',{'class':'rhs-network-decor','aria-hidden':'true'});
    const positions=[[42,84],[93,135],[169,90],[198,30],[260,51],[300,94],[363,33],[478,112],[525,35],[585,82],[555,152],[503,226],[554,281],[461,270],[327,290],[275,260],[213,288],[177,234],[112,260],[89,312],[355,124],[381,228],[236,102],[600,207]];
    const links=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,8],[8,9],[9,10],[10,11],[11,12],[11,13],[13,14],[14,15],[15,16],[16,17],[17,18],[18,19],[20,21],[21,13],[2,22],[22,5],[5,20],[20,7],[7,10],[18,17],[22,16]];
    links.forEach(([a,b])=>decor.append(make('line',{x1:positions[a][0],y1:positions[a][1],x2:positions[b][0],y2:positions[b][1]})));
    positions.forEach(([x,y],i)=>{if(i%5===0)decor.append(make('circle',{cx:x,cy:y,r:9,fill:'#0de9de',opacity:'.055'}));decor.append(make('circle',{cx:x,cy:y,r:i%4===0?3.4:1.75,'class':'rhs-network-dot'}));});
    graph.insertBefore(decor,graph.querySelector('.rhs-network-edges'));
    graph.querySelectorAll('.rhs-network-edges g').forEach((group,i)=>{
      const path=group.querySelector('path');
      if(path){const glow=path.cloneNode(true);glow.setAttribute('class','rhs-evidence-halo');group.insertBefore(glow,path);}
      const dot=group.querySelector('circle');
      if(dot)dot.setAttribute('r',i===2?'4':'3.3');
    });
    const colors=['#39c6f5','#edc971','#ea8097','#45a9f1','#7cb3ff'];
    const icons=[
      '<rect x="5" y="4" width="14" height="15" rx="2"/><path d="M9 22h6M8 16h8"/>',
      '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 14h5"/>',
      '<circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
      '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 13c3-4 5 4 8 0"/>',
      '<circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>'
    ];
    graph.querySelectorAll('.rhs-graph-account').forEach((node,i)=>{
      const cir=node.querySelector(':scope > circle');
      const icon=node.querySelector('svg');
      if(cir){cir.setAttribute('fill','url(#rhs-node-blue)');cir.setAttribute('stroke',colors[i]);cir.setAttribute('stroke-width','1.7');const ring=make('circle',{cx:cir.getAttribute('cx'),cy:cir.getAttribute('cy'),r:'29',fill:'none',stroke:colors[i],opacity:'.12','stroke-width':'1.2'});node.insertBefore(ring,cir);}
      if(icon){icon.innerHTML=icons[i];icon.setAttribute('stroke',colors[i]);icon.setAttribute('stroke-width','1.8');}
    });
    const selected=graph.querySelector('circle[cx="256"][cy="170"][r="40"]');
    if(selected){const aura=make('circle',{cx:256,cy:170,r:51,fill:'none',stroke:'#e97892','stroke-width':'1.3',opacity:'.25'});selected.parentNode.insertBefore(aura,selected);selected.setAttribute('fill','url(#rhs-selected-fill)');selected.setAttribute('stroke','#fb839b');selected.setAttribute('stroke-width','2');}
    const note=document.querySelector('.rhs-network-visual .rhs-visual-note');
    if(note)note.dataset.illustrative='true';
  }
  const chart=document.querySelector('.rhs-content .rhs-chart-panel');
  if(chart && !chart.dataset.fidelity){
    chart.dataset.fidelity='v2';
    const svg=chart.querySelector('svg.rhs-bars');
    const dep=svg&&svg.querySelector('[data-series="deposits"]');
    const wdr=svg&&svg.querySelector('[data-series="withdrawals"]');
    if(dep&&wdr){
      const isEs=document.documentElement.lang==='es';
      const legend=chart.querySelector('.rhs-chart-legend');
      const unit=chart.querySelector('.rhs-chart-unit');
      const toolbar=document.createElement('div');toolbar.className='rhs-chart-toolbar';
      const tabs=document.createElement('div');tabs.className='rhs-chart-filters';tabs.setAttribute('role','group');tabs.setAttribute('aria-label',isEs?'Filtrar series':'Filter series');
      const groups={deposits:dep,withdrawals:wdr};
      const bars={deposits:[...dep.querySelectorAll('rect')],withdrawals:[...wdr.querySelectorAll('rect')]};
      const formats={deposits:isEs?'Depósitos':'Deposits',withdrawals:isEs?'Retiros':'Withdrawals',all:isEs?'Ambos':'Both'};
      const setMode=(mode)=>{
        [dep,wdr].forEach(g=>{g.style.display=(mode==='all'||g.dataset.series===mode)?'':'none';});
        for(const [key,rs] of Object.entries(bars)){
          rs.forEach((rect,i)=>{
            const width=mode==='all'?5.1:9.5;
            const x=mode==='all'?(key==='deposits'?33:222)+7.55*i:36+14.2*i;
            rect.setAttribute('x',x.toFixed(2));rect.setAttribute('width',width);
          });
        }
        tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
      };
      ['deposits','withdrawals','all'].forEach(mode=>{
        const b=document.createElement('button');b.type='button';b.className='rhs-chart-filter';b.dataset.mode=mode;b.textContent=formats[mode];
        b.setAttribute('aria-pressed',String(mode==='all'));b.addEventListener('click',()=>setMode(mode));tabs.append(b);
      });
      const period=document.createElement('span');period.className='rhs-chart-period';period.textContent=isEs?'24 días · ilustrativo':'24 days · illustrative';
      toolbar.append(tabs,period);
      chart.insertBefore(toolbar,legend);
      if(unit)chart.insertBefore(legend,unit);
      svg.querySelectorAll('.rhs-chart-dates text').forEach((e,i)=>{
        const pos=[36,112,200,289,391], labels=isEs?['Día 1','Día 6','Día 12','Día 18','Día 24']:['Day 1','Day 6','Day 12','Day 18','Day 24'];
        e.setAttribute('x',pos[i]);e.textContent=labels[i];
      });
      Object.entries(bars).forEach(([key,rs])=>rs.forEach((r,i)=>{
        const v=Math.round(parseFloat(r.getAttribute('height'))/1.2);
        const t=make('title');t.textContent=(isEs?'Día ':'Day ')+(i+1)+' · '+formats[key]+': '+v+' '+(isEs?'unidades simuladas':'simulated units');r.append(t);
      }));
      setMode('all');
    }
  }
})();
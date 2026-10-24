/* Progressive enhancement for two complete, crawlable static language routes. */
(() => {
 'use strict';
 const lang = document.documentElement.lang === 'es' ? 'es' : 'en';
 const qs = new URLSearchParams(location.search);
 const requested = qs.get('lang');
 let preferred;
 try { preferred = localStorage.getItem('rhs-language'); } catch {}
 if ((requested === 'en' || requested === 'es') && requested !== lang) {
  try { localStorage.setItem('rhs-language', requested); } catch {}
  location.replace(requested === 'es' ? '/es/' + location.hash : '/' + location.hash); return;
 }
 // Explicit /es/ navigation wins over a stored preference. Root may restore Spanish.
 if (lang === 'en' && preferred === 'es' && requested !== 'en') {
  location.replace('/es/' + location.hash); return;
 }
 document.querySelectorAll('[data-language]').forEach(link => link.addEventListener('click', () => {
  try { localStorage.setItem('rhs-language', link.dataset.language); } catch {}
 }));
 try { localStorage.setItem('rhs-language', lang); } catch {}
 const menu = document.getElementById('main-nav');
 const toggle = document.getElementById('menu-toggle');
 function closeMenu(returnFocus = false) {
  menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', lang === 'es' ? 'Abrir navegación' : 'Open navigation');
  if (returnFocus) toggle.focus();
 }
 toggle.addEventListener('click', () => {
  const on = !menu.classList.contains('open'); menu.classList.toggle('open', on);
  toggle.setAttribute('aria-expanded', String(on));
  toggle.setAttribute('aria-label', lang === 'es' ? (on ? 'Cerrar navegación' : 'Abrir navegación') : (on ? 'Close navigation' : 'Open navigation'));
 });
 menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
 document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu(true); });
 document.addEventListener('click', e => { if (!e.target.closest('header')) closeMenu(); });
 const content = {
 en: {
 overview: ['Operations overview', [['OPEN CASES','18'],['ALERTS','6'],['REVIEWS','4']], 'WORKFLOW CONTEXT', [['Payment exceptions','REVIEW QUEUE'],['Linked-account cases','OPEN'],['Policy exceptions','HUMAN REVIEW']]],
 withdrawal: ['Withdrawal queue', [['CASE','WD-48213'],['AMOUNT','1,250.00'],['POLICY','REVIEW']], 'SUPPORTING EVIDENCE', [['Account identity mismatch','REQUIRES REVIEW'],['Device linked to three accounts','CONTEXT'],['Payment-source record','PENDING CHECK']]],
 player: ['Player 360', [['PLAYER','P-48213'],['KYC','REVIEW'],['TAGS','2']], 'ACCOUNT & ACTIVITY HISTORY', [['Identity and KYC history','SIMULATED RECORD'],['Deposits, withdrawals and balance','LINKED EVENTS'],['Bets, casino activity and bonuses','HISTORY'],['Permissions, tags and case timeline','TRACEABLE']]],
 alerts: ['Risk alerts', [['QUEUE','6'],['POLICY','V14'],['OWNER','REVIEWER']], 'CONTEXTUAL ALERTS', [['Unusual withdrawal pattern','REVIEW'],['Bonus and rollover conditions','INVESTIGATE'],['Automated-behavior signal','CONTEXT REQUIRED']]],
 links: ['Account links', [['ACCOUNTS','3'],['SIGNALS','MIXED'],['CASE','OPEN']], 'CONNECTIONS ARE NOT VERDICTS', [['Shared device signal','REQUIRES REVIEW'],['Related payment instrument','COMPARE RECORDS'],['Shared IP address alone','WEAK CONTEXT']]],
 policies: ['Policies & permissions', [['RULE','V14'],['LIMIT','DEFINED'],['REVIEW','HUMAN']], 'SUPERVISED WORKFLOW', [['Approval roles and limits','POLICY-LED'],['Reconciliation and balance exceptions','REVIEW'],['Automated decision write-back','NOT ENABLED']]],
 audit: ['Audit log', [['ACTOR','REVIEWER'],['POLICY','V14'],['CASE','OPEN']], 'ILLUSTRATIVE EVENT HISTORY', [['Review opened · 09:41','RECORDED'],['Evidence attached · 09:43','TRACEABLE'],['Rationale and next step','PENDING REVIEW']]]
 },
 es: {
 overview: ['Resumen operativo', [['CASOS ABIERTOS','18'],['ALERTAS','6'],['REVISIONES','4']], 'CONTEXTO OPERATIVO', [['Excepciones de pago','COLA DE REVISIÓN'],['Casos de cuentas vinculadas','ABIERTOS'],['Excepciones de políticas','REVISIÓN HUMANA']]],
 withdrawal: ['Cola de retiros', [['CASO','WD-48213'],['IMPORTE','1.250,00'],['POLÍTICA','REVISIÓN']], 'EVIDENCIAS DE APOYO', [['Discrepancia de identidad','REQUIERE REVISIÓN'],['Dispositivo vinculado a tres cuentas','CONTEXTO'],['Registro del origen del pago','PENDIENTE']]],
 player: ['Player 360', [['JUGADOR','P-48213'],['KYC','REVISIÓN'],['ETIQUETAS','2']], 'HISTORIAL DE CUENTA Y ACTIVIDAD', [['Historial de identidad y KYC','REGISTRO SIMULADO'],['Depósitos, retiros y saldo','EVENTOS VINCULADOS'],['Apuestas, casino y bonos','HISTORIAL'],['Permisos, etiquetas e historial de casos','TRAZABLE']]],
 alerts: ['Alertas de riesgo', [['COLA','6'],['POLÍTICA','V14'],['RESPONSABLE','REVISOR']], 'ALERTAS CONTEXTUALES', [['Patrón inusual de retiros','REVISIÓN'],['Condiciones de bonos y rollover','INVESTIGAR'],['Señal de comportamiento automatizado','REQUIERE CONTEXTO']]],
 links: ['Cuentas vinculadas', [['CUENTAS','3'],['SEÑALES','MIXTAS'],['CASO','ABIERTO']], 'LOS VÍNCULOS NO SON VEREDICTOS', [['Señal de dispositivo compartido','REQUIERE REVISIÓN'],['Instrumento de pago relacionado','COMPARAR REGISTROS'],['Dirección IP compartida por sí sola','CONTEXTO DÉBIL']]],
 policies: ['Políticas y permisos', [['REGLA','V14'],['LÍMITE','DEFINIDO'],['REVISIÓN','HUMANA']], 'FLUJO SUPERVISADO', [['Roles y límites de aprobación','SEGÚN POLÍTICA'],['Excepciones de conciliación y saldo','REVISIÓN'],['Ejecución de decisiones automáticas','NO HABILITADA']]],
 audit: ['Registro de auditoría', [['PERSONA','REVISOR'],['POLÍTICA','V14'],['CASO','ABIERTO']], 'HISTORIAL ILUSTRATIVO DE EVENTOS', [['Revisión abierta · 09:41','REGISTRADO'],['Evidencias adjuntas · 09:43','TRAZABLE'],['Fundamento y siguiente paso','PENDIENTE']]]
 }
 };
 const tabs = [...document.querySelectorAll('[data-view]')];
 const panel = document.getElementById('mock-panel');
 const app = document.querySelector('.rhs-app');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const motion = document.getElementById('motion-toggle');
 let index = 2, timer = null, paused = false, hovered = false;
 function render(i) {
  if (!reduced.matches) panel.animate([{opacity:.65,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'ease-out'});
  index = i;
  const key = tabs[i].dataset.view;
  const [heading, metrics, subhead, rows] = content[lang][key];
  tabs.forEach((tab, n) => {
   tab.classList.toggle('on', i === n); tab.setAttribute('aria-selected', String(i === n)); tab.tabIndex = i === n ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', tabs[i].id);
  document.getElementById('mock-heading').textContent = heading;
  document.getElementById('mock-status').textContent = lang === 'es' ? 'VISTA ILUSTRATIVA · DATOS SIMULADOS' : 'ILLUSTRATIVE VIEW · SIMULATED DATA';
  document.getElementById('mock-subhead').textContent = subhead;
  // All strings below are fixed, first-party content. No network or user input is inserted.
  document.getElementById('mock-metrics').replaceChildren(...metrics.map(([label, value]) => {
   const div = document.createElement('div'), small = document.createElement('small'), b = document.createElement('b');
   small.textContent = label; b.textContent = value; div.append(small,b); return div;
  }));
  document.getElementById('mock-rows').replaceChildren(...rows.map(([label, value]) => {
   const div = document.createElement('div'); div.className = 'rhs-evidence';
   [label,value].forEach(v => { const span = document.createElement('span'); span.textContent = v; div.append(span); }); return div;
  }));
 }
 // The approved visual uses a stable Player 360 preview; tabs still work manually.
 const autoplayWorkspace = false;
 function schedule() {
  clearTimeout(timer);
  if (!autoplayWorkspace) return;
  if (paused || hovered || document.hidden || reduced.matches || app.contains(document.activeElement)) return;
  timer = setTimeout(() => { render((index + 1) % tabs.length); schedule(); }, 6500);
 }
 tabs.forEach((tab,i) => {
  tab.addEventListener('click', () => { render(i); schedule(); });
  tab.addEventListener('keydown', e => {
   let next;
   if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
   if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
   if (e.key === 'Home') next = 0;
   if (e.key === 'End') next = tabs.length - 1;
   if (next !== undefined) { e.preventDefault(); render(next); tabs[next].focus(); schedule(); }
  });
 });
 app.addEventListener('mouseenter', () => { hovered = true; schedule(); });
 app.addEventListener('mouseleave', () => { hovered = false; schedule(); });
 app.addEventListener('focusin', schedule);
 app.addEventListener('focusout', () => setTimeout(schedule, 0));
 document.addEventListener('visibilitychange', schedule);
 reduced.addEventListener('change', schedule);
 motion.addEventListener('click', () => {
  paused = !paused; document.documentElement.dataset.motion = paused ? 'paused' : 'running'; motion.setAttribute('aria-pressed', String(paused));
  motion.textContent = lang === 'es' ? (paused ? 'Reanudar movimiento' : 'Pausar movimiento') : (paused ? 'Resume motion' : 'Pause motion');
  document.dispatchEvent(new CustomEvent('rhs:motion', {detail:paused})); schedule();
 });
 render(index); schedule();
 // Privacy information is a real disclosure, not a fabricated legal document.
 document.querySelectorAll('a[href="#privacy"]').forEach(a => a.addEventListener('click', () => {document.getElementById('privacy').open = true;}));
 if (location.hash === '#privacy') document.getElementById('privacy').open = true;
})();

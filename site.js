/* Progressive enhancement for the static language routes. Every visible string comes from the page. */
(() => {
 'use strict';
 document.documentElement.classList.add('rhs-js');
 // Published languages and their routes come from the page's hreflang links (any number of them).
 const routes = new Map([...document.querySelectorAll('link[rel="alternate"][hreflang]')]
  .filter(link => link.hreflang !== 'x-default').map(link => [link.hreflang, new URL(link.href, location.href).pathname]));
 const lang = document.documentElement.lang;
 const qs = new URLSearchParams(location.search);
 const requested = qs.get('lang');
 let preferred;
 try { preferred = localStorage.getItem('rhs-language'); } catch {}
 if (routes.has(requested) && requested !== lang) {
  try { localStorage.setItem('rhs-language', requested); } catch {}
  location.replace(routes.get(requested) + location.hash); return;
 }
 // An explicit language route wins over a stored preference; only the root may restore another language.
 if (routes.get(lang) === '/' && routes.has(preferred) && preferred !== lang && requested !== lang) {
  location.replace(routes.get(preferred) + location.hash); return;
 }
 document.querySelectorAll('[data-language]').forEach(link => link.addEventListener('click', () => {
  try { localStorage.setItem('rhs-language', link.dataset.language); } catch {}
 }));
 try { localStorage.setItem('rhs-language', lang); } catch {}
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');

 const menu = document.getElementById('main-nav');
 const toggle = document.getElementById('menu-toggle');
 function closeMenu(returnFocus = false) {
  menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', toggle.dataset.labelOpen);
  if (returnFocus) toggle.focus();
 }
 toggle.addEventListener('click', () => {
  const on = !menu.classList.contains('open'); menu.classList.toggle('open', on);
  toggle.setAttribute('aria-expanded', String(on));
  toggle.setAttribute('aria-label', on ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
 });
 menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
 document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu(true); });
 document.addEventListener('click', e => { if (!e.target.closest('header')) closeMenu(); });

 // WCAG 2.2.2: one control pauses the continuous orbit and its backlight.
 const motion = document.getElementById('motion-toggle');
 if (motion) motion.addEventListener('click', () => {
  const paused = motion.getAttribute('aria-pressed') !== 'true';
  document.documentElement.dataset.motion = paused ? 'paused' : 'running';
  motion.setAttribute('aria-pressed', String(paused));
  motion.textContent = paused ? motion.dataset.labelResume : motion.dataset.labelPause;
  document.dispatchEvent(new CustomEvent('rhs:motion', { detail: paused }));
 });

 // Product tour: ARIA tabs with automatic activation; #tour-<area> links open that area.
 const tour = document.querySelector('[data-tour]');
 if (tour) {
  const tabs = [...tour.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const select = (index, focus) => {
   tabs.forEach((tab, i) => {
    const on = i === index;
    tab.setAttribute('aria-selected', String(on)); tab.tabIndex = on ? 0 : -1; panels[i].hidden = !on;
   });
   if (focus) tabs[index].focus();
  };
  tabs.forEach((tab, i) => {
   tab.addEventListener('click', () => { select(i); history.replaceState(null, '', '#' + panels[i].id); });
   tab.addEventListener('keydown', e => {
    let next;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i + tabs.length - 1) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { e.preventDefault(); select(next, true); }
   });
  });
  const fromHash = () => {
   const index = panels.findIndex(panel => '#' + panel.id === location.hash);
   if (index < 0) return;
   select(index);
   tour.scrollIntoView({ block: 'start', behavior: reduced.matches ? 'auto' : 'smooth' });
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
 }

 // Privacy information is a real disclosure, not a fabricated legal document.
 document.querySelectorAll('a[href="#privacy"]').forEach(a => a.addEventListener('click', () => { document.getElementById('privacy').open = true; }));
 if (location.hash === '#privacy') document.getElementById('privacy').open = true;
})();

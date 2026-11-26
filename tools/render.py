"""Render the static language routes from one content source. No third-party build dependencies.

Languages are registered in LANGUAGES. Only the `published` ones are written and linked (hreflang,
language switchers, sitemap): a new language becomes a page by adding its copy here and in
sections.COPY, then publishing it. The approved hero and header fragments are the base; every
replacement must match exactly once, so a changed fragment fails loudly instead of silently.
"""
import json
from html import escape as esc
from pathlib import Path
from sections import COPY, cta_link, lower_page, mailto

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / 'tools/capture/manifest.json'

LANGUAGES = {
 'en': {'path': '/', 'og_locale': 'en_US', 'label': 'EN', 'name': 'English', 'published': True},
 'es': {'path': '/es/', 'og_locale': 'es_ES', 'label': 'ES', 'name': 'Español', 'published': True},
}

PAGE = {
 'en': {'title': 'RHS Labs Sentinel — PAM and back-office for regulated betting operators',
        'description': 'Player account management and back-office for regulated betting operators: Player 360, '
                       'withdrawals with approval tiers, risk, fraud and compliance. Available for pilot programs.',
        'og_alt': 'RHS Labs Sentinel: player account management for regulated operators.',
        'nav': [['Platform', '#platform'], ['Modules', '#modules'], ['Payments', '#payments'], ['Compliance', '#compliance'], ['Security', '#security'], ['Pilot', '#pilot']],
        'skip': 'Skip to content', 'back_to_top': 'RHS Labs / Sentinel — Back to top', 'main_menu': 'Main menu',
        'open_navigation': 'Open navigation', 'close_navigation': 'Close navigation'},
 'es': {'title': 'RHS Labs Sentinel — PAM y back-office para operadores de apuestas regulados',
        'description': 'Gestión de cuentas de jugadores y back-office para operadores de apuestas regulados: Player 360, '
                       'retiros con niveles de aprobación, riesgo, fraude y cumplimiento. Disponible para programas piloto.',
        'og_alt': 'RHS Labs Sentinel: gestión de cuentas de jugadores para operadores regulados.',
        'nav': [['Plataforma', '#platform'], ['Módulos', '#modules'], ['Pagos', '#payments'], ['Cumplimiento', '#compliance'], ['Seguridad', '#security'], ['Piloto', '#pilot']],
        'skip': 'Saltar al contenido', 'back_to_top': 'RHS Labs / Sentinel — Volver al inicio', 'main_menu': 'Menú principal',
        'open_navigation': 'Abrir navegación', 'close_navigation': 'Cerrar navegación'},
}

# Hero copy. The three images stay the approved concept art until product captures are approved
# and swapped in on purpose (tools/capture/hero-swap.mjs); the badge under the orbit says which.
HERO = {
 'en': {'section': 'Sentinel platform showcase',
        'h1': 'Player account management<br> <span>for regulated operators.</span>',
        'subtitle': 'RHS Labs Sentinel is the PAM and back-office for regulated betting operators: '
                    'Player 360, payments with approval tiers, and risk and compliance in one place.',
        'carousel': {'concept': 'Three concept illustrations of Sentinel', 'product': 'Three Sentinel back-office screens'},
        'choose': 'Choose showcase screen', 'show': 'Show {name}', 'suffix': 'CONTINUOUS 3D ORBIT', 'roledescription': 'carousel',
        'pause': 'Pause motion', 'resume': 'Resume motion',
        'badge': {'concept': ['AVAILABLE FOR PILOT PROGRAMS', 'ILLUSTRATIVE CONCEPT', 'SIMULATED DATA'],
                  'product': ['AVAILABLE FOR PILOT PROGRAMS', 'PRODUCT UI', 'SYNTHETIC DATA']},
        'values': [['Player 360', 'Account, wallet and history in one profile'],
                   ['Payments with approval tiers', 'Four-eyes control on withdrawals'],
                   ['Risk and fraud', 'Rules, alerts and cases'],
                   ['Audit trail', 'Who did what, and when']]},
 'es': {'section': 'Presentación de la plataforma Sentinel',
        'h1': 'Gestión de cuentas de jugadores<br> <span>para operadores regulados.</span>',
        'subtitle': 'RHS Labs Sentinel es el PAM y back-office para operadores de apuestas regulados: '
                    'Player 360, pagos con niveles de aprobación, y riesgo y cumplimiento en un solo lugar.',
        'carousel': {'concept': 'Tres ilustraciones conceptuales de Sentinel', 'product': 'Tres pantallas del back-office Sentinel'},
        'choose': 'Elegir una pantalla', 'show': 'Mostrar {name}', 'suffix': 'ÓRBITA 3D CONTINUA', 'roledescription': 'carrusel',
        'pause': 'Pausar movimiento', 'resume': 'Reanudar movimiento',
        'badge': {'concept': ['DISPONIBLE PARA PROGRAMAS PILOTO', 'CONCEPTO ILUSTRATIVO', 'DATOS SIMULADOS'],
                  'product': ['DISPONIBLE PARA PROGRAMAS PILOTO', 'INTERFAZ DEL PRODUCTO', 'DATOS SINTÉTICOS']},
        'values': [['Player 360', 'Cuenta, billetera e historial en un perfil'],
                   ['Pagos con niveles de aprobación', 'Control de cuatro ojos en retiros'],
                   ['Riesgo y fraude', 'Reglas, alertas y casos'],
                   ['Registro de auditoría', 'Quién hizo qué y cuándo']]},
}

# The approved V6 concept images: kept byte for byte (integrity manifest) until the swap.
HERO_CONCEPT = [
 {'src': '/assets/dashboard-1.webp',
  'name': {'en': 'Operations overview (concept)', 'es': 'Vista de operaciones (concepto)'},
  'alt': {'en': 'Concept illustration, not the current product: an operations dashboard with simulated data.',
          'es': 'Ilustración conceptual, no el producto actual: un panel de operaciones con datos simulados.'}},
 {'src': '/assets/dashboard-2.webp',
  'name': {'en': 'Investigation workspace (concept)', 'es': 'Espacio de investigación (concepto)'},
  'alt': {'en': 'Concept illustration, not the current product: an investigation dashboard with simulated data.',
          'es': 'Ilustración conceptual, no el producto actual: un panel de investigación con datos simulados.'}},
 {'src': '/assets/dashboard-3.webp',
  'name': {'en': 'Payments overview (concept)', 'es': 'Vista de pagos (concepto)'},
  'alt': {'en': 'Concept illustration, not the current product: a payments dashboard with simulated data.',
          'es': 'Ilustración conceptual, no el producto actual: un panel de pagos con datos simulados.'}},
]
# Product captures for the swap, front panel first (see tools/capture/hero-swap.mjs).
HERO_PRODUCT = [
 {'screen': 'player-360-summary',
  'name': {'en': 'Player 360 · Summary', 'es': 'Player 360 · Resumen'},
  'alt': {'en': 'Sentinel back-office: Player 360 summary of a synthetic player, with the identity strip, money cards and summary panels.',
          'es': 'Back-office Sentinel: resumen del Player 360 de un jugador sintético, con la franja de identidad, las tarjetas de dinero y los paneles del resumen.'}},
 {'screen': 'withdrawals-queue',
  'name': {'en': 'Withdrawals queue', 'es': 'Cola de retiros'},
  'alt': {'en': 'Sentinel back-office: withdrawals queue with synthetic requests, their state and waiting time.',
          'es': 'Back-office Sentinel: cola de retiros con solicitudes sintéticas, su estado y tiempo de espera.'}},
 {'screen': 'reports',
  'name': {'en': 'Reports', 'es': 'Informes'},
  'alt': {'en': 'Sentinel back-office: reports page with synthetic operator totals.',
          'es': 'Back-office Sentinel: página de informes con totales sintéticos del operador.'}},
]

VALUE_ICONS = ['<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/>',
               '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
               '<path d="M12 22s9-4 9-11V5l-9-3-9 3v6c0 7 9 11 9 11z"/><path d="m9 12 2 2 4-4"/>',
               '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4M10 12h6M10 16h6"/>']

V6_HERO = {  # strings of the approved fragment that the copy replaces (each must occur exactly once)
 'h1': '<h1>See risk. Stop fraud. <span>Stay ahead.</span></h1>',
 'subtitle': '<p class="hero-subtitle">Connected intelligence across payments, identities, devices and accounts — designed for confident operational decisions.</p>',
 'section': 'aria-label="Sentinel platform showcase"',
 'cta_primary': '<a class="btn" href="#contact">Discuss a pilot <span aria-hidden="true">↗</span></a>',
 'cta_secondary': '<a class="btn alt" href="#platform">Explore the platform</a>',
 'carousel': 'aria-label="Three illustrative Sentinel interfaces"',
 'roledescription': 'aria-roledescription="carousel"',
 'choose': 'aria-label="Choose showcase screen"',
 'dots_close': '</div>\n    </div>\n    <p class="screen-name"',
 'title': '<p class="screen-name" id="showcase-title">01 &nbsp; / &nbsp; Operations Control Center</p>',
 'badge': '<div class="carousel-disclosure">PLATFORM IN DEVELOPMENT &nbsp;·&nbsp; ILLUSTRATIVE INTERFACES &nbsp;·&nbsp; SIMULATED DATA</div>',
 'panels': [
  ('<figure class="product-screen" data-index="0" aria-label="Operations Control Center"><div class="screen-art"><img src="/assets/dashboard-1.webp" width="1586" height="992" alt="Illustrative Sentinel Operations Control Center dashboard with inbound and outbound transactions, risk alerts, approvals and account clusters" fetchpriority="high"></div></figure>',
   '<button class="carousel-dot is-current" data-showcase="0" type="button" aria-label="Show Operations Control Center" aria-current="true"></button>'),
  ('<figure class="product-screen" data-index="1" aria-label="Multi-account Investigation"><div class="screen-art"><img src="/assets/dashboard-2.webp" width="1586" height="992" alt="Illustrative investigation dashboard showing linked accounts, shared devices, account statuses and risk alerts" decoding="async"></div></figure>',
   '<button class="carousel-dot" data-showcase="1" type="button" aria-label="Show Multi-account Investigation"></button>'),
  ('<figure class="product-screen" data-index="2" aria-label="Payments and Risk Overview"><div class="screen-art"><img src="/assets/dashboard-3.webp" width="1586" height="992" alt="Illustrative financial operations dashboard showing deposits, withdrawals, transaction review queues and compliance flags" decoding="async"></div></figure>',
   '<button class="carousel-dot" data-showcase="2" type="button" aria-label="Show Payments and Risk Overview"></button>'),
 ],
 'values': ['<svg viewBox="0 0 24 24"><path d="m14 2-9 12h7l-2 8 9-12h-7z"/></svg></span><span><b>Connected intelligence</b><small>Signals across operations</small>',
            '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="6" rx="2"/><rect x="3" y="13" width="18" height="8" rx="2"/><path d="M7 6h3M7 17h3"/></svg></span><span><b>Unified visibility</b><small>Accounts, devices and payments</small>',
            '<svg viewBox="0 0 24 24"><path d="M12 22s9-4 9-11V5l-9-3-9 3v6c0 7 9 11 9 11z"/><path d="m9 12 2 2 4-4"/></svg></span><span><b>Traceable investigations</b><small>Context with each decision</small>',
            '<svg viewBox="0 0 24 24"><path d="M3 20h18M6 16V9m6 7V4m6 12v-5"/></svg></span><span><b>Built for control</b><small>Modular, policy-led workflows</small>'],
}
V6_HEADER = {
 'back_to_top': 'aria-label="RHS Labs — Back to top"',
 'main_menu': 'aria-label="Main menu"',
 'open_navigation': 'aria-label="Open navigation"',
 'languages': '<span class="lang"><a href="/" data-language="en" lang="en" aria-label="English">EN</a> · <a href="/es/" data-language="es" lang="es" aria-label="Español">ES</a></span>',
 'nav_close': '</nav>',
 'cta': '<a class="btn sm" href="#contact">Discuss a pilot ↗</a>',
 'links': '<a href="#platform">Platform</a><a href="#modules">Solutions</a><a href="#use-cases">Use Cases</a><a href="#security">Security</a><a href="#company">Company</a>',
}


def shape(value):
 """Structure of a copy value (keys, list lengths, nesting) without the words, to compare languages."""
 if isinstance(value, dict):
  return {key: shape(item) for key, item in value.items()}
 if isinstance(value, (list, tuple)):
  return [shape(item) for item in value]
 return 'text'


def check_parity(codes=None):
 """Every published language must carry the same copy structure as English (EN/ES parity)."""
 for code in codes or published():
  for name, table in (('PAGE', PAGE), ('HERO', HERO)):
   if code not in table or shape(table[code]) != shape(table['en']):
    raise ValueError(f'{name} copy for {code!r} does not match the English structure')
  for item in HERO_CONCEPT + HERO_PRODUCT:
   if code not in item['name'] or code not in item['alt']:
    raise ValueError(f'hero image text missing for {code!r}')


def published():
 return [code for code, language in LANGUAGES.items() if language['published']]


def replace_once(text, old, new):
 count = text.count(old)
 if count != 1:
  raise ValueError(f'expected exactly one occurrence, found {count}: {old[:70]}')
 return text.replace(old, new)


def capture_manifest():
 return json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {'screens': {}}


def hero_panels(manifest):
 """The three orbit images: approved product captures after the swap, the concept art before it."""
 hero = manifest.get('hero') or {}
 if not hero.get('active'):
  return 'concept', [dict(item, src=item['src'], width=1586, height=992) for item in HERO_CONCEPT]
 panels = []
 for item in HERO_PRODUCT:
  screen = manifest['screens'].get(item['screen']) or {}
  if not screen.get('approved') or not screen.get('hero'):
   raise ValueError('hero swap is active but this capture is not approved: ' + item['screen'])
  panels.append(dict(item, src='/' + screen['hero']['path'], width=screen['hero']['width'], height=screen['hero']['height']))
 return 'product', panels


def language_links(code, cls=None):
 links = [f'<a href="{LANGUAGES[c]["path"]}" data-language="{c}" lang="{c}" aria-label="{LANGUAGES[c]["name"]}"'
          + (' aria-current="page"' if c == code and cls else '') + f'>{LANGUAGES[c]["label"]}</a>' for c in published()]
 return links


def render_hero(code, manifest):
 h, v = HERO[code], V6_HERO
 kind, panels = hero_panels(manifest)
 html = (ROOT / 'assets/hero-v6-fragment.html').read_text()
 html = replace_once(html, v['h1'], f'<h1>{h["h1"]}</h1>')
 html = replace_once(html, v['subtitle'], f'<p class="hero-subtitle">{h["subtitle"]}</p>')
 html = replace_once(html, v['section'], f'aria-label="{esc(h["section"])}"')
 # Primary CTA: a pre-filled demo e-mail; secondary: how a pilot works (its own e-mail is there).
 cta = COPY[code]['cta']
 html = replace_once(html, v['cta_primary'], f'<a class="btn" href="{esc(mailto(code, "demo"))}" data-cta="demo">{cta["demo"]}<span class="rhs-sr"> {cta["opens"]}</span> <span aria-hidden="true">↗</span></a>')
 html = replace_once(html, v['cta_secondary'], f'<a class="btn alt" href="#pilot">{cta["pilot"]}</a>')
 html = replace_once(html, v['carousel'], f'aria-label="{esc(h["carousel"][kind])}"')
 html = replace_once(html, v['roledescription'], f'aria-roledescription="{h["roledescription"]}"')
 html = replace_once(html, v['choose'], f'aria-label="{esc(h["choose"])}"')
 # WCAG 2.2.2: the continuous orbit gets a pause control beside the dots (it also pauses the backlight).
 html = replace_once(html, v['dots_close'], f'</div>\n      <button class="carousel-pause" id="motion-toggle" type="button" aria-pressed="false" data-label-pause="{esc(h["pause"])}" data-label-resume="{esc(h["resume"])}">{h["pause"]}</button>\n    </div>\n    <p class="screen-name"')
 names = [panel['name'][code] for panel in panels]
 html = replace_once(html, v['title'], f'<p class="screen-name" id="showcase-title" data-suffix="{esc(h["suffix"])}">01 &nbsp; / &nbsp; {esc(names[0])}</p>')
 html = replace_once(html, v['badge'], '<div class="carousel-disclosure" data-hero-images="' + kind + '">' + ' &nbsp;·&nbsp; '.join(h['badge'][kind]) + '</div>')
 for index, ((figure, dot), panel) in enumerate(zip(v['panels'], panels)):
  loading = 'fetchpriority="high"' if index == 0 else 'decoding="async"'
  html = replace_once(html, figure, f'<figure class="product-screen" data-index="{index}" aria-label="{esc(panel["name"][code])}"><div class="screen-art"><img src="{panel["src"]}" width="{panel["width"]}" height="{panel["height"]}" alt="{esc(panel["alt"][code])}" {loading}></div></figure>')
  current = ' is-current' if index == 0 else ''
  aria_current = ' aria-current="true"' if index == 0 else ''
  html = replace_once(html, dot, f'<button class="carousel-dot{current}" data-showcase="{index}" type="button" aria-label="{esc(h["show"].format(name=panel["name"][code]))}"{aria_current}></button>')
 for old, icon, (title, text) in zip(v['values'], VALUE_ICONS, h['values']):
  html = replace_once(html, old, f'<svg viewBox="0 0 24 24">{icon}</svg></span><span><b>{title}</b><small>{text}</small>')
 return html, panels


def render_header(code):
 p, v = PAGE[code], V6_HEADER
 html = (ROOT / 'assets/header-fragment.html').read_text()
 html = replace_once(html, v['back_to_top'], f'aria-label="{esc(p["back_to_top"])}"')
 html = replace_once(html, v['main_menu'], f'aria-label="{esc(p["main_menu"])}"')
 html = replace_once(html, v['open_navigation'], f'aria-label="{esc(p["open_navigation"])}" data-label-open="{esc(p["open_navigation"])}" data-label-close="{esc(p["close_navigation"])}"')
 html = replace_once(html, v['languages'], '<span class="lang">' + ' · '.join(language_links(code)) + '</span>')
 html = replace_once(html, v['nav_close'], '<span class="rhs-mobile-language">' + ' · '.join(language_links(code)) + '</span></nav>')
 cta = COPY[code]['cta']
 html = replace_once(html, v['cta'], f'<a class="btn sm" href="{esc(mailto(code, "demo"))}" data-cta="demo">{cta["demo_short"]}<span class="rhs-sr"> {cta["opens"]}</span> ↗</a>')
 html = replace_once(html, v['links'], ''.join(f'<a href="{href}">{label}</a>' for label, href in p['nav']))
 return html


def render(code, manifest=None):
 manifest = capture_manifest() if manifest is None else manifest
 language, p = LANGUAGES[code], PAGE[code]
 hero, panels = render_hero(code, manifest)
 header = render_header(code)
 hero_kind = 'product' if (manifest.get('hero') or {}).get('active') else 'concept'
 languages = ''.join(f'<a href="{LANGUAGES[c]["path"]}" data-language="{c}" lang="{c}"' + (' aria-current="page"' if c == code else '') + f'>{LANGUAGES[c]["label"]}</a>' for c in published())
 og_image = f'/assets/og-image-{code}.jpg' if (ROOT / f'assets/og-image-{code}.jpg').exists() else '/assets/og-image-en.jpg'
 locale_alternates = ''.join(f'<meta property="og:locale:alternate" content="{LANGUAGES[c]["og_locale"]}">' for c in published() if c != code)
 alternates = ''.join(f'<link rel="alternate" hreflang="{c}" href="{LANGUAGES[c]["path"]}">' for c in published())
 return f'''<!DOCTYPE html>
<html lang="{code}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#0A1426">
<title>{p['title']}</title><meta name="description" content="{p['description']}">
<link rel="canonical" href="{language['path']}">{alternates}<link rel="alternate" hreflang="x-default" href="/">
<meta property="og:type" content="website"><meta property="og:site_name" content="RHS Labs"><meta property="og:title" content="{p['title']}"><meta property="og:description" content="{p['description']}"><meta property="og:locale" content="{language['og_locale']}">{locale_alternates}<meta property="og:image" content="{og_image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="{esc(p['og_alt'])}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="{og_image}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="{panels[0]['src']}" as="image" fetchpriority="high">
<link rel="preload" href="/assets/fonts/sora-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/dm-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/assets/hero-v6.css"><link rel="stylesheet" href="/site.css">
<script src="/site.js" defer></script><script src="/assets/hero-v6.js" defer></script>
</head><body><a class="rhs-skip" href="#platform">{p['skip']}</a>
{header}<main>{hero}
{lower_page(code, manifest, languages, hero_kind)}</main></body></html>'''


def route_file(code):
 path = LANGUAGES[code]['path'].strip('/')
 return ROOT / (path + '/index.html' if path else 'index.html')


if __name__ == '__main__':
 check_parity()
 manifest = capture_manifest()
 for code in published():
  out = route_file(code); out.parent.mkdir(exist_ok=True, parents=True); out.write_text(render(code, manifest))
 print('Rendered ' + ', '.join(LANGUAGES[c]['path'] for c in published()) + ' from shared content source.')

"""Render both static language routes. No third-party build dependencies."""
from pathlib import Path
from sections import lower_page
ROOT = Path(__file__).resolve().parent.parent
EN = {'lang': 'en',
 'title': 'RHS Labs — Sentinel | Operational clarity. Connected risk intelligence.',
 'description': 'Explore Sentinel, the B2B platform in development for operational backoffice, '
                'payment workflows, risk intelligence and fraud investigations.',
 'nav': ['Platform', 'Solutions', 'Use Cases', 'Security', 'Company'],
 'views': ['Overview',
           'Withdrawal queue',
           'Player 360',
           'Risk alerts',
           'Account links',
           'Policies',
           'Audit log'],
 'skip': 'Skip to content'}
ES = {'lang': 'es',
 'title': 'RHS Labs — Sentinel | Claridad operativa e inteligencia de riesgo.',
 'description': 'Conozca Sentinel, la plataforma B2B en desarrollo para backoffice operativo, '
                'flujos de pagos, inteligencia de riesgo e investigaciones de fraude.',
 'nav': ['Plataforma', 'Soluciones', 'Casos de uso', 'Seguridad', 'Empresa'],
 'views': ['Resumen',
           'Cola de retiros',
           'Player 360',
           'Alertas de riesgo',
           'Cuentas vinculadas',
           'Políticas',
           'Auditoría'],
 'skip': 'Saltar al contenido'}

def render(t):
 lang=t['lang']; es=lang=='es'; path='/es/' if es else '/'
 hero=(ROOT/'assets/hero-v6-fragment.html').read_text()
 header=(ROOT/'assets/header-fragment.html').read_text().replace('RHS Labs — Back to top','RHS Labs / Sentinel — Back to top')
 header=header.replace('</nav>', '<span class="rhs-mobile-language"><a href="/" data-language="en" lang="en">EN</a> · <a href="/es/" data-language="es" lang="es">ES</a></span></nav>',1)
 for en,local in zip(EN['nav'],t['nav']): header=header.replace('>'+en+'</a>','>'+local+'</a>')
 if es:
  replacements={
   'See risk. Stop fraud. <span>Stay ahead.</span>':'Vea el riesgo. Frene el fraude. <span>Anticípese.</span>',
   'Connected intelligence across payments, identities, devices and accounts — designed for confident operational decisions.':'Inteligencia conectada entre pagos, identidades, dispositivos y cuentas, diseñada para decisiones operativas fundamentadas.',
   'Discuss a pilot':'Conversar sobre un piloto','Explore the platform':'Explorar la plataforma',
   'PLATFORM IN DEVELOPMENT':'PLATAFORMA EN DESARROLLO','ILLUSTRATIVE INTERFACES':'INTERFACES ILUSTRATIVAS','SIMULATED DATA':'DATOS SIMULADOS',
   'Connected intelligence':'Inteligencia conectada','Signals across operations':'Señales entre operaciones','Unified visibility':'Visibilidad unificada','Accounts, devices and payments':'Cuentas, dispositivos y pagos','Traceable investigations':'Investigaciones trazables','Context with each decision':'Contexto en cada decisión','Built for control':'Diseñada para el control','Modular, policy-led workflows':'Flujos modulares guiados por políticas',
   'Sentinel platform showcase':'Presentación de la plataforma Sentinel','Three illustrative Sentinel interfaces':'Tres interfaces ilustrativas de Sentinel','Choose showcase screen':'Elegir una interfaz ilustrativa',
   'Illustrative Sentinel Operations Control Center dashboard with inbound and outbound transactions, risk alerts, approvals and account clusters':'Panel ilustrativo del centro de control Sentinel con transacciones, alertas de riesgo, revisiones y grupos de cuentas',
   'Illustrative investigation dashboard showing linked accounts, shared devices, account statuses and risk alerts':'Panel de investigación ilustrativo con cuentas vinculadas, dispositivos compartidos, estados y alertas de riesgo',
   'Illustrative financial operations dashboard showing deposits, withdrawals, transaction review queues and compliance flags':'Panel financiero ilustrativo con depósitos, retiros, colas de revisión y señales de cumplimiento',
   'Operations Control Center':'Centro de control operativo','Multi-account Investigation':'Investigación de cuentas vinculadas','Payments and Risk Overview':'Vista de pagos y riesgo',
   'Show Operations Control Center':'Mostrar el centro de control operativo','Show Multi-account Investigation':'Mostrar investigación de cuentas vinculadas','Show Payments and Risk Overview':'Mostrar vista de pagos y riesgo'}
  for a,b in sorted(replacements.items(), key=lambda pair:len(pair[0]), reverse=True): hero=hero.replace(a,b); header=header.replace(a,b)
  hero=hero.replace('aria-roledescription="carousel"','aria-roledescription="carrusel"')
  header=header.replace('RHS Labs / Sentinel — Back to top','RHS Labs / Sentinel — Volver al inicio').replace('Main menu','Menú principal').replace('Open navigation','Abrir navegación')
 keys=['overview','withdrawal','player','alerts','links','policies','audit']
 views=''.join(f'<button class="menu-btn{" on" if i==2 else ""}" role="tab" id="tab-{k}" aria-controls="mock-panel" aria-selected="{str(i==2).lower()}" tabindex="{0 if i==2 else -1}" data-view="{k}">{name}</button>' for i,(k,name) in enumerate(zip(keys,t['views'])))
 return f'''<!DOCTYPE html>
<html lang="{lang}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#0A1426">
<title>{t['title']}</title><meta name="description" content="{t['description']}">
<link rel="canonical" href="{path}"><link rel="alternate" hreflang="en" href="/"><link rel="alternate" hreflang="es" href="/es/"><link rel="alternate" hreflang="x-default" href="/">
<meta property="og:type" content="website"><meta property="og:title" content="{t['title']}"><meta property="og:description" content="{t['description']}"><meta property="og:locale" content="{'es_ES' if es else 'en_US'}"><meta property="og:image" content="/assets/dashboard-1.webp"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="/assets/dashboard-1.webp" as="image" fetchpriority="high">
<link rel="preload" href="/assets/fonts/sora-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/dm-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/assets/hero-v6.css"><link rel="stylesheet" href="/site.css">
<script src="/site.js" defer></script><script src="/assets/hero-v6.js" defer></script>
</head><body><a class="rhs-skip" href="#platform">{t['skip']}</a>
{header}<main>{hero}
{lower_page(lang,views)}</main></body></html>'''
for t,rel in [(EN,'index.html'),(ES,'es/index.html')]:
 out=ROOT/rel; out.parent.mkdir(exist_ok=True,parents=True); out.write_text(render(t))
print('Rendered / and /es/ from shared content source.')

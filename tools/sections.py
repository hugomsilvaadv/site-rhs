"""Approved reference composition for sectors 02–09; static, translated, no backend."""
from html import escape as esc

COPY = {
'en': {
 'overview':['PLATFORM OVERVIEW','A complete picture.<br><em>Not another tab.</em>','Bring payments, identity, device and activity context into one workspace. Review signals with a clearer operational picture.','Explore the platform'],
 'products':['OUR PRODUCTS','A modular platform<br>for real-world risk.','Four connected products, from operational backoffice to risk investigation. Choose the scope that fits your operation.'],
 'cards':['Operational backoffice and player context for organized, accountable workflows.','Deposits, withdrawals and exception reviews in one operational picture.','Account, device and payment links that add context to investigations.','Rules, alerts and case context to investigate suspicious patterns.'],
 'complete':'Complete brings the four products together.',
 'network':['CONNECTED INTELLIGENCE','Uncover what’s<br><em>connected.</em>','Explore relationships between accounts, devices and payment methods. Connections support investigation; your team and policies guide the decision.','Explore connections'],
 'relations':['Shared device','Shared payment method','Related identity signal','Shared network context','Similar activity'],
 'graphnote':'Illustrative links. A connection alone does not establish fraud.',
 'legend':['Selected account','Related account','Connection under review'],
 'selected':'Selected account','related':'Related account',
 'payments':['PAYMENTS & RISK','Monitor the flow.<br><em>Spot the signals.</em>','Review deposits, withdrawals and payment exceptions with account context and configured policies.','Explore payments'],
 'flow':'Transaction flow','deposit':'Deposits','withdraw':'Withdrawals','unit':'Amount · simulated units','day':'Day','queue':'Review queue','amount':'Amount',
 'queue_context':['Identity mismatch','Related account','Policy threshold','Evidence attached'],
 'queue_status':['Review required','Evidence pending','Review required','Review recorded'],
 'how':['FROM DATA TO DECISIONS','A clear path<br><em>to action.</em>','Turn signals into context, review and a recorded operational decision.'],
 'steps':[['Observe','Bring account, payment and activity signals into view.'],['Connect','Understand relationships and relevant context.'],['Review','Evaluate evidence under your policies.'],['Record','Keep the decision, rationale and audit trail.']],
 'control':['BUILT FOR CONTROL','More visibility.<br><em>Greater confidence.</em>','A shared operational picture, focused reviews and traceable decisions.'],
 'pillars':[['Unified visibility','Relevant context in one place, for a clearer view of risk.'],['Focused investigations','Follow the signals that need a closer review.'],['Traceable operations','Keep a clear record of decisions and their rationale.']],
 'about':['ABOUT RHS LABS','Technology for<br>clearer operations.','RHS Labs develops B2B software for operational workflows and risk intelligence. Sentinel brings that product vision together.','Our approach'],
 'principles':[['Focused on operational context','Connect information around real review workflows.'],['Modular product vision','Define the scope around your operation.'],['Designed for accountable review','Keep human responsibility and evidence in view.']],
 'brandline':'Software for<br>clearer operations.',
 'contact':['GET IN TOUCH','Let’s discuss<br>your operation.','Explore Sentinel’s product vision and discuss the needs of a potential pilot.'],
 'sales':'Talk to sales','salessub':'Start a conversation about your operation.','salescta':'Contact sales','emailnote':'Opens your email application. This website does not send messages.',
 'risk':'Risk summary','high':'Review','riskitems':['Multiple accounts','Shared device','Payment context','Policy checks'],
 'profile':'Unified account context across identity, payments and activity.','sim':'Illustrative UI','pausedemo':'Pause motion','demoresume':'Resume motion','view':'Workspace views',
 'privacy':'Privacy & enquiries','privacynote':'This static website has no enquiry form or analytics tracker. Only your language preference is stored in this browser. Email opens your own service; avoid sharing sensitive player data. Organizational and data-handling details must be confirmed before any pilot.',
 'footer':'B2B technology for clearer operations.','disclosure':'Platform in development. Illustrative interfaces use simulated data. Scope and availability are confirmed during commercial discussions.',
 'subject':'Sentinel — commercial enquiry','nav':['Platform','Solutions','Connections','Company'],
},
'es': {
 'overview':['VISIÓN DE LA PLATAFORMA','La visión completa.<br><em>Sin otra pestaña.</em>','Reúna pagos, identidad, dispositivos y actividad en un solo espacio. Revise señales con un contexto operativo más claro.','Explorar la plataforma'],
 'products':['NUESTROS PRODUCTOS','Una plataforma modular<br>para riesgos reales.','Cuatro productos conectados, desde el backoffice operativo hasta la investigación de riesgos. Elija el alcance adecuado para su operación.'],
 'cards':['Backoffice operativo y contexto del jugador para flujos organizados y trazables.','Depósitos, retiros y revisión de excepciones en una misma visión operativa.','Vínculos entre cuentas, dispositivos y pagos que aportan contexto a la investigación.','Reglas, alertas y contexto de casos para investigar patrones sospechosos.'],
 'complete':'Complete reúne los cuatro productos.',
 'network':['INTELIGENCIA CONECTADA','Descubra qué está<br><em>conectado.</em>','Explore relaciones entre cuentas, dispositivos y medios de pago. Los vínculos apoyan la investigación; su equipo y sus políticas guían la decisión.','Explorar vínculos'],
 'relations':['Dispositivo compartido','Medio de pago compartido','Señal de identidad relacionada','Contexto de red compartido','Actividad similar'],
 'graphnote':'Vínculos ilustrativos. Una conexión por sí sola no demuestra fraude.',
 'legend':['Cuenta seleccionada','Cuenta relacionada','Vínculo en revisión'],
 'selected':'Cuenta seleccionada','related':'Cuenta relacionada',
 'payments':['PAGOS Y RIESGO','Observe el flujo.<br><em>Reconozca las señales.</em>','Revise depósitos, retiros y excepciones de pago con contexto de la cuenta y políticas configuradas.','Explorar pagos'],
 'flow':'Flujo de transacciones','deposit':'Depósitos','withdraw':'Retiros','unit':'Importe · unidades simuladas','day':'Día','queue':'Cola de revisión','amount':'Importe',
 'queue_context':['Discrepancia de identidad','Cuenta vinculada','Umbral de política','Evidencias adjuntas'],
 'queue_status':['Requiere revisión','Evidencias pendientes','Requiere revisión','Revisión registrada'],
 'how':['DE LOS DATOS A LAS DECISIONES','Un camino claro<br><em>hacia la acción.</em>','Transforme señales en contexto, revisión y una decisión operativa registrada.'],
 'steps':[['Observar','Reunir señales de cuentas, pagos y actividad.'],['Conectar','Comprender relaciones y contexto relevante.'],['Revisar','Evaluar evidencias según sus políticas.'],['Registrar','Conservar la decisión, el fundamento y la trazabilidad.']],
 'control':['DISEÑADA PARA EL CONTROL','Más visibilidad.<br><em>Mayor confianza.</em>','Una visión operativa compartida, revisiones enfocadas y decisiones trazables.'],
 'pillars':[['Visibilidad unificada','Contexto relevante en un solo lugar para una visión más clara del riesgo.'],['Investigaciones enfocadas','Siga las señales que requieren una revisión más detallada.'],['Operaciones trazables','Conserve un registro claro de las decisiones y su fundamento.']],
 'about':['ACERCA DE RHS LABS','Tecnología para<br>operaciones más claras.','RHS Labs desarrolla software B2B para flujos operativos e inteligencia de riesgo. Sentinel reúne esa visión de producto.','Nuestro enfoque'],
 'principles':[['Enfoque en el contexto operativo','Conectar información en torno a los flujos de revisión.'],['Visión de producto modular','Definir el alcance según su operación.'],['Diseñada para revisiones responsables','Mantener a la vista la responsabilidad humana y las evidencias.']],
 'brandline':'Software para<br>operaciones más claras.',
 'contact':['CONTACTO','Conversemos sobre<br>su operación.','Conozca la visión de Sentinel y conversemos sobre las necesidades de un posible piloto.'],
 'sales':'Hable con ventas','salessub':'Inicie una conversación sobre su operación.','salescta':'Contactar ventas','emailnote':'Abre su aplicación de correo. Este sitio no envía mensajes.',
 'risk':'Resumen de riesgo','high':'Revisar','riskitems':['Cuentas relacionadas','Dispositivo compartido','Contexto de pago','Políticas'],
 'profile':'Contexto unificado de la cuenta: identidad, pagos y actividad.','sim':'Interfaz ilustrativa','pausedemo':'Pausar movimiento','demoresume':'Reanudar movimiento','view':'Vistas del espacio de trabajo',
 'privacy':'Privacidad y consultas','privacynote':'Este sitio estático no tiene formularios ni seguimiento analítico. Solo guarda su preferencia de idioma en este navegador. El correo abre su propio servicio; evite compartir datos sensibles de jugadores. Los datos organizativos y el tratamiento de datos deben confirmarse antes de un piloto.',
 'footer':'Tecnología B2B para operaciones más claras.','disclosure':'Plataforma en desarrollo. Las interfaces ilustrativas utilizan datos simulados. El alcance y la disponibilidad se confirman durante las conversaciones comerciales.',
 'subject':'Sentinel — consulta comercial','nav':['Plataforma','Soluciones','Vínculos','Empresa'],
}}

SHAPES={
 'brand':'<path d="m12 3-9 17h18Z"/><circle cx="12" cy="3" r="2"/><circle cx="3" cy="20" r="2"/><circle cx="21" cy="20" r="2"/>',
 'core':'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
 'payments':'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 15h5"/>',
 'network':'<path d="m12 4-8 15h16ZM12 4v11M4 19l8-4 8 4"/><circle cx="12" cy="4" r="2"/><circle cx="4" cy="19" r="2"/><circle cx="20" cy="19" r="2"/><circle cx="12" cy="15" r="2"/>',
 'fraud':'<path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6Z"/><path d="m9 12 2 2 4-4"/>',
 'search':'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
 'record':'<path d="M6 3h9l4 4v14H6ZM14 3v5h5M9 12h7M9 16h7"/>',
 'check':'<path d="m5 12 5 5L20 6"/>',
 'eye':'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 'bolt':'<path d="m13 2-8 12h7l-1 8 8-13h-7Z"/>',
 'person':'<circle cx="12" cy="7" r="4"/><path d="M5 21v-3a7 7 0 0 1 14 0v3Z"/>',
 'device':'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7 8h7"/>',
 'layers':'<path d="m2 7 10-5 10 5-10 5ZM3 12l9 5 9-5M3 17l9 5 9-5"/>',
 'settings':'<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/>',
 'arrow':'<path d="M5 19 19 5M5 5h14v14"/>',
}
def icon(name, cls=''):
 return f'<svg class="rhs-icon {cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">{SHAPES[name]}</svg>'
def kicker(n, text): return f'<span class="rhs-kicker"><b>{n:02d}</b> {text}</span>'
def intro(n, data, cta=None):
 return f'<div class="rhs-sector-copy">{kicker(n,data[0])}<h2>{data[1]}</h2><p>{data[2]}</p>'+ (f'<a class="btn rhs-cta" href="{cta}">{data[3]} {icon("arrow")}</a>' if cta and len(data)>3 else '')+'</div>'

def graph(t):
 # Every peripheral P-ID is an account; the label states the evidence relationship.
 nodes=[('P-77104',130,49,'device','#44c7f0'),('P-66290',423,174,'payments','#e5c16e'),('P-90311',420,49,'person','#da7889'),('P-22018',65,182,'device','#5ca8eb'),('P-33862',397,296,'person','#67afed')]
 lines=[]; points=[]
 for i,((ident,x,y,symbol,color),label) in enumerate(zip(nodes,t['relations'])):
  lines.append(f'<g data-edge="{i}"><path d="M256 170L{x} {y}" stroke="#42aeb9"/><circle cx="{(256+x)/2}" cy="{(170+y)/2}" r="3" fill="#40c8bb"/></g>')
  tx=x+29;ty=y-3
  if i==3:tx=x-42;ty=y+47
  points.append(f'<g class="rhs-graph-account"><circle cx="{x}" cy="{y}" r="22" fill="#0a2333" stroke="#58bfe6"/><svg x="{x-10}" y="{y-10}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#58bfe6" stroke-width="1.5">{SHAPES["person"]}</svg><text x="{tx}" y="{ty}" class="rhs-graph-id">{ident}</text><text x="{tx}" y="{ty+16}" class="rhs-graph-label">{esc(label)}</text></g>')
 mobile=''.join(f'<li><b>{ident}</b><span>{label}</span></li>' for (ident,*_),label in zip(nodes,t['relations']))
 return f'''<div class="rhs-network-visual" id="connection-context" tabindex="-1"><span class="rhs-illustrative">{t['sim']}</span><svg class="rhs-graph" viewBox="0 0 650 344" role="img" aria-labelledby="network-title network-desc"><title id="network-title">{t['network'][0]}</title><desc id="network-desc">P-48213: {'; '.join(ident+' — '+label for (ident,*_),label in zip(nodes,t['relations']))}. {t['graphnote']}</desc><g class="rhs-network-edges">{''.join(lines)}</g>{''.join(points)}<circle cx="256" cy="170" r="40" fill="#122330" stroke="#dc7486" stroke-width="1.5"/><svg x="245" y="144" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef8497" stroke-width="1.6">{SHAPES['person']}</svg><text x="256" y="183" text-anchor="middle" class="rhs-graph-id">P-48213</text><text x="256" y="198" text-anchor="middle" class="rhs-graph-label rhs-selected-label">{t['selected']}</text></svg><div class="rhs-graph-legend"><span><i class="selected"></i>{t['legend'][0]}</span><span><i class="related"></i>{t['legend'][1]}</span><span><i class="connection"></i>{t['legend'][2]}</span></div><ul class="rhs-graph-mobile">{mobile}</ul><p class="rhs-visual-note">{t['graphnote']}</p></div>'''

def payments(t):
 deposits=[25,42,36,53,44,70,37,55,67,48,77,61,39,83,56,72,48,68,43,60,78,52,66,41]
 withdrawals=[18,28,22,39,30,45,25,29,42,38,60,44,70,91,62,79,52,72,45,81,55,68,49,62]
 bars=[]
 for series,values,color,offset in [('deposits',deposits,'#21c7e8',0),('withdrawals',withdrawals,'#ec728b',5)]:
  rects=''.join(f'<rect x="{34+i*14+offset}" y="{156-v*1.2}" width="4" height="{v*1.2}" rx="1"/>' for i,v in enumerate(values))
  bars.append(f'<g data-series="{series}" fill="{color}">{rects}</g>')
 axis=''.join(f'<g><line x1="30" x2="378" y1="{156-v*1.2}" y2="{156-v*1.2}"/><text x="21" y="{160-v*1.2}" text-anchor="end">{v}</text></g>' for v in [0,25,50,75,100])
 dates=''.join(f'<text x="{34+i*14}" y="178" text-anchor="middle">{t["day"]} {i+1}</text>' for i in [0,6,12,18,23])
 queue=''.join(f'<div class="rhs-queue-item"><span class="rhs-queue-avatar">{icon("person")}</span><div><b>{ident}</b><small>{t["queue_context"][i]}</small></div><div class="rhs-queue-value"><b>{amount}</b><span>{t["queue_status"][i]}</span></div></div>' for i,(ident,amount) in enumerate(zip(['P-48213','P-77104','P-90311','P-66290'],['2,450','1,200','3,800','950'])))
 return f'''<div class="rhs-payments-visual"><div class="rhs-chart-panel"><div class="rhs-panel-heading"><h3>{t['flow']}</h3><span class="rhs-illustrative">{t['sim']}</span></div><div class="rhs-chart-legend"><span class="deposits">{t['deposit']}</span><span class="withdrawals">{t['withdraw']}</span></div><svg viewBox="0 0 406 192" class="rhs-bars" role="img" aria-labelledby="payments-title payments-desc"><title id="payments-title">{t['flow']}</title><desc id="payments-desc">{t['unit']}. {t['deposit']}: {', '.join(map(str,deposits))}. {t['withdraw']}: {', '.join(map(str,withdrawals))}.</desc><g class="rhs-chart-grid">{axis}</g>{''.join(bars)}<g class="rhs-chart-dates">{dates}</g></svg><p class="rhs-chart-unit">{t['unit']}</p></div><div class="rhs-queue"><div class="rhs-panel-heading"><h3>{t['queue']}</h3>{icon('record')}</div>{queue}<p class="rhs-chart-unit">{t['amount']} · {'unidades simuladas' if t is COPY['es'] else 'simulated units'}</p></div></div>'''

def lower_page(lang, views):
 t=COPY[lang];from urllib.parse import quote
 products=['Core','Payments','Intelligence','Fraud'];icons=['core','payments','network','fraud'];destinations=['#platform','#payments','#intelligence','#intelligence']
 cards=''.join(f'<article class="rhs-product"><span class="rhs-icon-box">{icon(i)}</span><h3>{name}</h3><p>{text}</p><a class="rhs-card-link" href="{dest}" aria-label="{esc(t["overview"][3]+": "+name)}">{icon("arrow")}</a></article>' for name,i,text,dest in zip(products,icons,t['cards'],destinations))
 steps=''.join(f'<li class="rhs-step"><span class="rhs-round-icon">{icon(i)}</span><b class="rhs-step-number">0{n+1}</b><h3>{s[0]}</h3><p>{s[1]}</p></li>' for n,(s,i) in enumerate(zip(t['steps'],['search','network','record','check'])))
 pillars=''.join(f'<article class="rhs-pillar"><span class="rhs-round-icon">{icon(i)}</span><h3>{s[0]}</h3><p>{s[1]}</p></article>' for s,i in zip(t['pillars'],['eye','bolt','fraud']))
 principles=''.join(f'<div class="rhs-principle"><span>{icon(i)}</span><div><h3>{s[0]}</h3><p>{s[1]}</p></div></div>' for s,i in zip(t['principles'],['settings','layers','fraud']))
 riskitems=''.join(f'<li>{label}</li>' for label in t['riskitems'])
 links=''.join(f'<a href="{href}">{label}</a>' for href,label in zip(['#platform','#modules','#intelligence','#company'],t['nav']))
 simulated='DATOS SIMULADOS' if lang=='es' else 'SIMULATED DATA'
 return f'''<div class="rhs-content">
<section id="platform" class="rhs-sector rhs-overview" data-sector="2"><div class="wrap rhs-overview-grid">
{intro(2,t['overview'],'#workspace')}
<div class="rhs-mobile-laptop" aria-label="{'Vista ilustrativa del portátil' if lang=='es' else 'Illustrative laptop preview'}"><div class="rhs-laptop-display"><div class="rhs-laptop-browser"><span>RHS Labs <em>/ Sentinel</em></span><span>{t['sim']}</span></div><img src="/assets/dashboard-2.webp" width="1586" height="992" loading="lazy" decoding="async" alt="{'Pantalla ilustrativa de investigación Sentinel dentro de un portátil' if lang=='es' else 'Illustrative Sentinel investigation interface shown inside a laptop'}"></div><div class="rhs-laptop-base" aria-hidden="true"></div><button type="button" class="rhs-demo-toggle" aria-expanded="false" aria-controls="workspace">{'Abrir demonstração interativa do Player 360' if lang=='es' else 'Open interactive Player 360'} ↗</button></div><div class="rhs-notebook" id="workspace"><div class="rhs-notebook-screen"><div class="rhs-app"><div class="rhs-app-top"><a href="#home" aria-label="RHS Labs / Sentinel">{icon('brand')}<b>RHS Labs <em>/ Sentinel</em></b></a><span class="rhs-search" aria-hidden="true">{icon('search')} {'Buscar cuentas y eventos…' if lang=='es' else 'Search accounts and events…'}</span><span class="rhs-illustrative">{t['sim']}</span></div><div class="rhs-app-body"><div class="rhs-tabs"><div role="tablist" aria-orientation="vertical" aria-label="{t['view']}">{views}</div></div><div class="rhs-app-content" id="mock-panel" role="tabpanel" aria-labelledby="tab-player" tabindex="0"><div class="rhs-app-heading"><h3 id="mock-heading">Player 360</h3><small id="mock-status">{simulated}</small></div><p class="rhs-profile-description">{t['profile']}</p><div class="rhs-account-summary"><span class="rhs-player-avatar">{icon('person')}</span><div id="mock-metrics" class="rhs-metrics"></div></div><div class="rhs-app-subnav" aria-label="{'Secciones ilustrativas del expediente' if lang=='es' else 'Illustrative account sections'}"><span class="selected">{'Resumen' if lang=='es' else 'Overview'}</span><span>{'Cuentas' if lang=='es' else 'Accounts'}</span><span>{'Pagos' if lang=='es' else 'Payments'}</span><span>{'Dispositivos' if lang=='es' else 'Devices'}</span><span>{'Actividad' if lang=='es' else 'Activity'}</span><span>{'Red' if lang=='es' else 'Network'}</span></div><div class="rhs-app-panels"><div class="rhs-risk"><h4>{t['risk']}</h4><div class="rhs-risk-body"><div class="rhs-risk-ring"><b>{t['high']}</b></div><ul>{riskitems}</ul></div></div><div class="rhs-activity"><h4 id="mock-subhead"></h4><div id="mock-rows"></div></div></div></div></div></div></div><div class="rhs-notebook-base" aria-hidden="true"></div><div class="rhs-workspace-foot"><small>{t['sim']} · {simulated}</small><button id="motion-toggle" type="button" aria-pressed="false">{t['pausedemo']}</button></div></div></div></section>
<section id="modules" class="rhs-sector rhs-products" data-sector="3"><div class="wrap"><div class="rhs-products-heading">{intro(3,t['products'])}</div><div class="rhs-product-grid">{cards}</div><p class="rhs-complete"><b>Complete</b> / {t['complete']}</p></div></section>
<section id="intelligence" class="rhs-sector rhs-intelligence" data-sector="4"><span id="use-cases" class="rhs-anchor"></span><div class="wrap rhs-split">{intro(4,t['network'],'#connection-context')}{graph(t)}</div></section>
<section id="payments" class="rhs-sector rhs-payments" data-sector="5"><div class="wrap rhs-split">{intro(5,t['payments'],'#workspace')}{payments(t)}</div></section>
<section id="how" class="rhs-sector rhs-process" data-sector="6"><div class="wrap rhs-split">{intro(6,t['how'])}<ol class="rhs-steps">{steps}</ol></div></section>
<section id="security" class="rhs-sector rhs-control" data-sector="7"><div class="wrap rhs-split">{intro(7,t['control'])}<div class="rhs-pillars">{pillars}</div></div></section>
<section id="company" class="rhs-sector rhs-about" data-sector="8"><div class="wrap rhs-about-grid">{intro(8,t['about'],'#security')}<div class="rhs-principles">{principles}</div><div class="rhs-flat-brand">{icon('brand')}<b>RHS Labs</b><p>{t['brandline']}</p></div></div></section>
<section id="contact" class="rhs-sector rhs-contact" data-sector="9"><div class="wrap rhs-split">{intro(9,t['contact'])}<div class="rhs-sales-panel"><span class="rhs-icon-box">{icon('layers')}</span><div><h3>{t['sales']}</h3><p>{t['salessub']}</p><a class="rhs-sales-email" href="mailto:sales@rhs-labs.com">sales@rhs-labs.com</a></div><a class="btn rhs-cta" href="mailto:sales@rhs-labs.com?subject={quote(t['subject'])}">{t['salescta']} {icon('arrow')}</a><small>{t['emailnote']}</small></div></div></section>
<footer class="rhs-footer"><div class="wrap"><div class="rhs-footer-top"><a href="#home" class="rhs-footer-brand">{icon('brand')}<b>RHS Labs <em>/ Sentinel</em></b></a><nav aria-label="{'Navegación de pie de página' if lang=='es' else 'Footer navigation'}">{links}</nav><div class="rhs-languages"><a href="/" data-language="en" lang="en" {'aria-current="page"' if lang=='en' else ''}>EN</a><a href="/es/" data-language="es" lang="es" {'aria-current="page"' if lang=='es' else ''}>ES</a></div></div><div class="rhs-footer-notes"><p>{t['disclosure']}</p><details id="privacy"><summary>{t['privacy']}</summary><p>{t['privacynote']}</p></details></div></div></footer>
</div>'''

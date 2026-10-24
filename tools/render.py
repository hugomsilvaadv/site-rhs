"""Render both static language routes. No third-party build dependencies."""
from pathlib import Path
from html import escape
ROOT = Path(__file__).resolve().parent.parent
EN = {
 'lang':'en','title':'RHS Labs — Sentinel | Operational clarity. Connected risk intelligence.',
 'description':'Explore Sentinel, the B2B platform in development for operational backoffice, payment workflows, risk intelligence and fraud investigations.',
 'nav':['Platform','Solutions','Use Cases','Security','Company'],
 'disclosure':'Platform in development. Illustrative interfaces use simulated data. Capabilities and availability are confirmed during commercial discussions.',
 'workspace_k':'THE SENTINEL WORKSPACE','workspace_h':'A complete picture.<br>Not another tab.',
 'workspace_p':'Sentinel is a B2B platform being developed to bring operational backoffice, payment workflows, risk intelligence and fraud investigations into one workspace.',
 'workspace_note':'One player, in context. Identity and KYC, bets and casino activity, bonuses, deposits, withdrawals and events — with tags, permissions and a traceable case history.',
 'sim':'ILLUSTRATIVE UI · SIMULATED DATA','operations':'OPERATIONS','pause':'Pause motion','resume':'Resume motion',
 'views':['Overview','Withdrawal queue','Player 360','Risk alerts','Account links','Policies','Audit log'],
 'demo_note':'Conceptual workflow. No real decisions, transactions or payment actions are performed.',
 'modules_k':'FOUR PILLARS. ONE CONNECTED PRODUCT VISION.','modules_h':'Context travels<br>with the decision.',
 'modules_p':'Designed for operations, payments, risk and compliance teams to work from a shared picture.',
 'modules':[
  ['Core','The operational foundation.','Bring player profiles, account and gameplay history, events, tags, segmentation and cases into context, with roles, permissions and an audit trail.','PROFILE → CONTEXT → CASE'],
  ['Payments','Review with the full picture.','Review withdrawals, follow deposits and reconcile transactions through configured rules, approval limits, balance controls and supervised exception workflows.','TRANSACTION → POLICY → REVIEW'],
  ['Intelligence','Connections worth examining.','Explore account clusters across device, IP, identity and payment signals. A shared signal adds context; it does not prove fraud. Device fingerprinting is a technical direction, not a verified proprietary capability.','SIGNALS → LINKS → CONTEXT'],
  ['Fraud','From a signal to an investigation.','Bring configurable rules, alerts and evidence together to investigate multiaccount, identity misuse, automated behavior, bonus and rollover abuse, unusual payments and betting patterns.','ALERT → EVIDENCE → INVESTIGATION']],
 'complete':'Complete combines the four pillars in one commercial package. Scope, integrations and availability are agreed during commercial discussions. Payment execution and custody are not represented as services provided by RHS Labs.',
 'cases_k':'ILLUSTRATIVE SCENARIOS','cases_h':'Signals ask questions.<br>Context guides the next step.',
 'cases_p':'Four fictional examples of a policy-led review. A signal starts an inquiry; it is never a verdict.',
 'cases':[
 ['Multi-account & linked identities','A shared device connects three illustrative accounts. Compare identity, payment and activity context before deciding whether to investigate.',['Shared device','Related activity','Policy review','Recorded decision']],
 ['Withdrawal & payment exceptions','An illustrative withdrawal has an identity mismatch. Review supporting records and approval limits before recording the next step.',['Payment exception','Account context','Authorized review','Audit trail']],
 ['Bonus & unusual betting patterns','Repeated bonus activity prompts a closer look. Compare offer conditions and account history; an unusual pattern alone does not establish abuse.',['Activity pattern','Offer conditions','Contextual review','Documented outcome']],
 ['Risk investigation & controls','An illustrative case brings alerts, evidence and the applicable policy together. An authorized reviewer records the rationale and next step.',['Alert','Evidence','Human review','Recorded rationale']]],
 'context_note':'Opposing bets, arbitrage, late betting and sports or casino patterns require context. Sports-integrity concerns and potential money-laundering indicators require appropriate data and specialist review; no universal detection or legal conclusion is implied.',
 'how_k':'HOW SENTINEL IS DESIGNED TO WORK','how_h':'A clear path.<br>An accountable outcome.',
 'steps':[['Unify context','Bring account, payment and activity records into the same view.'],['Evaluate signals','Apply configured policies and keep supporting evidence visible.'],['Investigate & review','Let authorized people review exceptions and supervised automation.'],['Record decisions','Retain the rationale, actor, policy version and event history.']],
 'company_k':'RHS LABS / THE COMPANY','company_h':'Technology for<br>responsible operations.',
 'company_p':'RHS Labs develops B2B technology for operational workflows and risk intelligence. Sentinel is its platform vision for authorized operators where their activities are permitted.',
 'controls_k':'CONTROL BY DESIGN','controls_h':'Trust begins<br>with clear boundaries.',
 'controls':[['Access with purpose','Proposed role-based permissions and approval limits keep responsibilities explicit.'],['Evidence before action','Reviewable signals, policy versions and recorded rationale support human accountability.'],['Requirements before deployment','Data handling, security controls, integrations and pilot scope must be agreed before operational use.']],
 'contact_k':'LET’S EXPLORE THE FIT','contact_h':'Your operational context.<br>Our next conversation.',
 'contact_p':'Discuss a pilot, the product vision and what a responsible implementation would require.',
 'email_cta':'Discuss a pilot ↗','email_note':'Opens your email application. This address is the contact configured in the existing site; mailbox delivery has not been independently confirmed. No message is sent by this page.',
 'privacy_title':'About privacy and enquiries','privacy':'This static page has no enquiry form, account sign-up, analytics tracker or financial actions. It stores only your language preference in this browser. Email opens your own mail service: avoid sending player records or sensitive personal data. Detailed organizational and data-handling information must be confirmed before sharing pilot data; this notice is not a complete privacy policy.',
 'footer':'B2B technology for operational clarity.','skip':'Skip to content','subject':'Sentinel — pilot discussion','language':'Language',
}
ES = {
 'lang':'es','title':'RHS Labs — Sentinel | Claridad operativa e inteligencia de riesgo.',
 'description':'Conozca Sentinel, la plataforma B2B en desarrollo para backoffice operativo, flujos de pagos, inteligencia de riesgo e investigaciones de fraude.',
 'nav':['Plataforma','Soluciones','Casos de uso','Seguridad','Empresa'],
 'disclosure':'Plataforma en desarrollo. Las interfaces ilustrativas utilizan datos simulados. Las capacidades y la disponibilidad se confirman durante las conversaciones comerciales.',
 'workspace_k':'EL ESPACIO DE TRABAJO SENTINEL','workspace_h':'La visión completa.<br>Sin otra pestaña.',
 'workspace_p':'Sentinel es una plataforma B2B en desarrollo que busca reunir el backoffice operativo, los flujos de pagos, la inteligencia de riesgo y las investigaciones de fraude en un solo espacio de trabajo.',
 'workspace_note':'Cada jugador, en contexto. Identidad y KYC, apuestas y actividad de casino, bonos, depósitos, retiros y eventos, con etiquetas, permisos e historial de casos trazable.',
 'sim':'INTERFAZ ILUSTRATIVA · DATOS SIMULADOS','operations':'OPERACIONES','pause':'Pausar movimiento','resume':'Reanudar movimiento',
 'views':['Resumen','Cola de retiros','Player 360','Alertas de riesgo','Cuentas vinculadas','Políticas','Auditoría'],
 'demo_note':'Flujo conceptual. No se ejecutan decisiones, transacciones ni acciones de pago reales.',
 'modules_k':'CUATRO PILARES. UNA VISIÓN DE PRODUCTO CONECTADA.','modules_h':'El contexto acompaña<br>cada decisión.',
 'modules_p':'Diseñada para que los equipos de operaciones, pagos, riesgo y cumplimiento compartan una misma visión.',
 'modules':[
 ['Core','La base operativa.','Reúna perfiles de jugadores, historial de cuentas y actividad de juego, eventos, etiquetas, segmentación y casos, con roles, permisos y trazabilidad.','PERFIL → CONTEXTO → CASO'],
 ['Payments','Revise con la visión completa.','Revise retiros, dé seguimiento a depósitos y concilie transacciones mediante reglas configuradas, límites de aprobación, controles de saldo y flujos supervisados para excepciones.','TRANSACCIÓN → POLÍTICA → REVISIÓN'],
 ['Intelligence','Conexiones que merecen análisis.','Explore grupos de cuentas mediante señales de dispositivo, IP, identidad y pago. Una señal compartida aporta contexto; no demuestra fraude. La huella de dispositivo es una dirección técnica, no una capacidad propietaria verificada.','SEÑALES → VÍNCULOS → CONTEXTO'],
 ['Fraud','De la señal a la investigación.','Reúna reglas configurables, alertas y evidencias para investigar multicuenta, uso indebido de identidad, comportamiento automatizado, abuso de bonos y rollover, pagos y patrones de apuestas inusuales.','ALERTA → EVIDENCIAS → INVESTIGACIÓN']],
 'complete':'Complete reúne los cuatro pilares en una propuesta comercial. El alcance, las integraciones y la disponibilidad se acuerdan durante las conversaciones comerciales. RHS Labs no se presenta como proveedor de custodia ni de ejecución directa de pagos.',
 'cases_k':'ESCENARIOS ILUSTRATIVOS','cases_h':'Las señales plantean preguntas.<br>El contexto orienta el siguiente paso.',
 'cases_p':'Cuatro ejemplos ficticios de revisión guiada por políticas. Una señal inicia una investigación; nunca es un veredicto.',
 'cases':[
 ['Multicuenta e identidades vinculadas','Un dispositivo compartido conecta tres cuentas ilustrativas. Compare identidad, pagos y actividad antes de decidir si corresponde investigar.',['Dispositivo compartido','Actividad relacionada','Revisión de política','Decisión registrada']],
 ['Retiros y excepciones de pago','Un retiro ilustrativo presenta una discrepancia de identidad. Revise los registros y los límites de aprobación antes de registrar el siguiente paso.',['Excepción de pago','Contexto de la cuenta','Revisión autorizada','Trazabilidad']],
 ['Bonos y patrones de apuestas inusuales','La actividad repetida con bonos requiere una revisión más detallada. Compare las condiciones de la oferta y el historial; un patrón inusual por sí solo no demuestra abuso.',['Patrón de actividad','Condiciones de la oferta','Revisión contextual','Resultado documentado']],
 ['Investigación de riesgo y controles','Un caso ilustrativo reúne alertas, evidencias y la política aplicable. Una persona autorizada registra el fundamento y el siguiente paso.',['Alerta','Evidencias','Revisión humana','Fundamento registrado']]],
 'context_note':'Las apuestas opuestas, el arbitraje, las apuestas tardías y los patrones deportivos o de casino requieren contexto. Las dudas sobre integridad deportiva y los posibles indicios de lavado de dinero requieren datos adecuados y revisión especializada; no se implica detección universal ni una conclusión jurídica.',
 'how_k':'CÓMO ESTÁ DISEÑADO SENTINEL','how_h':'Un camino claro.<br>Una decisión trazable.',
 'steps':[['Unificar el contexto','Reunir los registros de cuentas, pagos y actividad en una misma vista.'],['Evaluar señales','Aplicar políticas configuradas y mantener las evidencias a la vista.'],['Investigar y revisar','Permitir que personas autorizadas revisen excepciones y automatizaciones supervisadas.'],['Registrar decisiones','Conservar el fundamento, la persona responsable, la versión de la política y el historial.']],
 'company_k':'RHS LABS / LA EMPRESA','company_h':'Tecnología para<br>operaciones responsables.',
 'company_p':'RHS Labs desarrolla tecnología B2B para flujos operativos e inteligencia de riesgo. Sentinel es su visión de plataforma para operadores autorizados allí donde sus actividades estén permitidas.',
 'controls_k':'CONTROL DESDE EL DISEÑO','controls_h':'La confianza comienza<br>con límites claros.',
 'controls':[['Acceso con propósito','Los permisos por roles y límites de aprobación propuestos definen las responsabilidades.'],['Evidencias antes de actuar','Señales revisables, versiones de políticas y fundamentos registrados apoyan la responsabilidad humana.'],['Requisitos antes del despliegue','El tratamiento de datos, los controles de seguridad, las integraciones y el alcance del piloto deben acordarse antes del uso operativo.']],
 'contact_k':'EXPLOREMOS LAS NECESIDADES','contact_h':'Su contexto operativo.<br>Nuestra próxima conversación.',
 'contact_p':'Conversemos sobre un piloto, la visión del producto y lo que exigiría una implementación responsable.',
 'email_cta':'Conversar sobre un piloto ↗','email_note':'Abre su aplicación de correo. Esta es la dirección de contacto configurada en el sitio existente; la recepción no se ha confirmado de forma independiente. Esta página no envía mensajes.',
 'privacy_title':'Privacidad y consultas','privacy':'Esta página estática no tiene formularios, registro de cuentas, seguimiento analítico ni acciones financieras. Solo guarda su preferencia de idioma en este navegador. El correo abre su propio servicio: evite enviar registros de jugadores o datos personales sensibles. La información organizativa y sobre tratamiento de datos debe confirmarse antes de compartir datos de un piloto; este aviso no es una política de privacidad completa.',
 'footer':'Tecnología B2B para la claridad operativa.','skip':'Saltar al contenido','subject':'Sentinel — conversación sobre un piloto','language':'Idioma',
}

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
 views=''.join(f'<button class="menu-btn{" on" if i==0 else ""}" role="tab" id="tab-{k}" aria-controls="mock-panel" aria-selected="{str(i==0).lower()}" tabindex="{0 if i==0 else -1}" data-view="{k}">{name}</button>' for i,(k,name) in enumerate(zip(keys,t['views'])))
 mods=''.join(f'<article class="rhs-module"><div class="rhs-module-label"><span>0{i+1}</span><h3>{m[0]}</h3></div><div><h4>{m[1]}</h4><p>{m[2]}</p><div class="rhs-signal-path" aria-hidden="true">{m[3]}</div></div></article>' for i,m in enumerate(t['modules']))
 cases=''.join(f'<details class="rhs-case" {"open" if i==0 else ""}><summary><span>0{i+1}</span>{c[0]}<b aria-hidden="true">+</b></summary><div class="rhs-case-body"><p>{c[1]}</p><ol>{"".join(f"<li>{escape(x)}</li>" for x in c[2])}</ol></div></details>' for i,c in enumerate(t['cases']))
 steps=''.join(f'<li><span>0{i+1}</span><h3>{s[0]}</h3><p>{s[1]}</p></li>' for i,s in enumerate(t['steps']))
 controls=''.join(f'<li><span aria-hidden="true">↗</span><div><h3>{c[0]}</h3><p>{c[1]}</p></div></li>' for c in t['controls'])
 from urllib.parse import quote
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
<div class="rhs-content">
<section id="platform" class="rhs-section rhs-workspace"><div class="wrap">
<div class="rhs-section-head"><div><span class="rhs-kicker">{t['workspace_k']}</span><h2>{t['workspace_h']}</h2></div><p>{t['workspace_p']}</p></div>
<div class="rhs-workspace-meta"><p>{t['workspace_note']}</p><button class="rhs-motion" id="motion-toggle" type="button" aria-pressed="false">{t['pause']}</button></div>
<div class="rhs-app" aria-label="Sentinel workspace"><div class="rhs-app-top"><b>SENTINEL <span>/ WORKSPACE</span></b><small>{t['sim']}</small></div>
<div class="rhs-app-body"><div class="rhs-tabs"><span class="rhs-kicker">{t['operations']}</span><div role="tablist" aria-label="{'Vistas del espacio de trabajo' if es else 'Workspace views'}" aria-orientation="vertical">{views}</div></div>
<div class="rhs-app-content" id="mock-panel" role="tabpanel" aria-labelledby="tab-overview" tabindex="0"><div class="rhs-app-heading"><h3 id="mock-heading">{'Resumen operativo' if es else 'Operations overview'}</h3><small id="mock-status">{t['sim']}</small></div><div id="mock-metrics" class="rhs-metrics"></div><h4 id="mock-subhead"></h4><div id="mock-rows"></div><p class="rhs-demo-note">{t['demo_note']}</p></div></div></div>
</div></section>
<section id="modules" class="rhs-section rhs-modules"><div class="wrap"><div class="rhs-section-head"><div><span class="rhs-kicker">{t['modules_k']}</span><h2>{t['modules_h']}</h2></div><p>{t['modules_p']}</p></div><div class="rhs-module-grid">{mods}</div><p class="rhs-complete"><strong>Complete / </strong>{t['complete']}</p></div></section>
<section id="use-cases" class="rhs-section"><div class="wrap"><div class="rhs-section-head"><div><span class="rhs-kicker">{t['cases_k']}</span><h2>{t['cases_h']}</h2></div><p>{t['cases_p']}</p></div><div class="rhs-cases">{cases}</div><p class="rhs-fineprint">{t['context_note']}</p></div></section>
<section id="how" class="rhs-section rhs-how"><div class="wrap"><span class="rhs-kicker">{t['how_k']}</span><h2>{t['how_h']}</h2><ol class="rhs-steps">{steps}</ol></div></section>
<section id="company" class="rhs-section"><div class="wrap rhs-company"><div><span class="rhs-kicker">{t['company_k']}</span><h2>{t['company_h']}</h2></div><p>{t['company_p']}</p></div></section>
<section id="security" class="rhs-section rhs-security"><div class="wrap rhs-security-layout"><div><span class="rhs-kicker">{t['controls_k']}</span><h2>{t['controls_h']}</h2></div><ul>{controls}</ul></div></section>
<section id="contact" class="rhs-section rhs-contact"><div class="wrap"><span class="rhs-kicker">{t['contact_k']}</span><h2>{t['contact_h']}</h2><p class="rhs-contact-intro">{t['contact_p']}</p><a class="btn" href="mailto:contact@rhs-labs.com?subject={quote(t['subject'])}">{t['email_cta']}</a><a class="rhs-email" href="mailto:contact@rhs-labs.com">contact@rhs-labs.com</a><p class="rhs-fineprint">{t['email_note']}</p><details id="privacy" class="rhs-privacy"><summary>{t['privacy_title']}</summary><p>{t['privacy']}</p></details></div></section>
<footer class="rhs-footer"><div class="wrap"><div class="rhs-footer-top"><div><a class="rhs-footer-brand" href="#home">RHS Labs <span>/ Sentinel</span></a><p>{t['footer']}</p></div><nav aria-label="{'Navegación de pie de página' if es else 'Footer navigation'}"><a href="#platform">{t['nav'][0]}</a><a href="#modules">{t['nav'][1]}</a><a href="#contact">{'Contacto' if es else 'Contact'}</a><a href="#privacy">{'Privacidad' if es else 'Privacy'}</a></nav><div class="rhs-languages" aria-label="{t['language']}"><a href="/" data-language="en" lang="en" {'aria-current="page"' if not es else ''}>EN</a><span>/</span><a href="/es/" data-language="es" lang="es" {'aria-current="page"' if es else ''}>ES</a></div></div><p class="rhs-disclosure">{t['disclosure']}</p></div></footer>
</div></main></body></html>'''
for t,rel in [(EN,'index.html'),(ES,'es/index.html')]:
 out=ROOT/rel; out.parent.mkdir(exist_ok=True,parents=True); out.write_text(render(t))
print('Rendered / and /es/ from shared content source.')

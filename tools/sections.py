"""Lower page (sectors 02–09): Sentinel, available now, and the PAM back-office, in development. EN/ES from one
source; static, no backend.

Every Sentinel claim maps to a screen of the Sentinel demo (the reviewed inventory of its menu); the back-office
section only lists areas that exist in the back-office code, and says they are in development. Each product
image is assets/product/<screen>.webp, imported from the reviewed demo screenshots (tools/capture/import.mjs).
Until that file exists as a real capture (never a registered "Screenshot pending" placeholder), the page leaves
the image out and the section stands on its text and diagrams; rendering again after the import shows it.
"""
import hashlib
import json
from html import escape as esc
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
CONTACT = 'sales@rhs-labs.com'
# The registered placeholders (tools/capture/placeholders.json): a file that still matches one is never shown.
PLACEHOLDERS = json.loads((ROOT / 'tools/capture/placeholders.json').read_text(encoding='utf-8'))['files']

SHAPES = {
 'brand': '<path d="m12 3-9 17h18Z"/><circle cx="12" cy="3" r="2"/><circle cx="3" cy="20" r="2"/><circle cx="21" cy="20" r="2"/>',
 'core': '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
 'payments': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 15h5"/>',
 'network': '<path d="m12 4-8 15h16ZM12 4v11M4 19l8-4 8 4"/><circle cx="12" cy="4" r="2"/><circle cx="4" cy="19" r="2"/><circle cx="20" cy="19" r="2"/><circle cx="12" cy="15" r="2"/>',
 'fraud': '<path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6Z"/><path d="m9 12 2 2 4-4"/>',
 'search': '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
 'record': '<path d="M6 3h9l4 4v14H6ZM14 3v5h5M9 12h7M9 16h7"/>',
 'check': '<path d="m5 12 5 5L20 6"/>',
 'person': '<circle cx="12" cy="7" r="4"/><path d="M5 21v-3a7 7 0 0 1 14 0v3Z"/>',
 'users': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20v-1.5a6.5 6.5 0 0 1 13 0V20"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 13.6a6.5 6.5 0 0 1 3.5 5.9V20"/>',
 'layers': '<path d="m2 7 10-5 10 5-10 5ZM3 12l9 5 9-5M3 17l9 5 9-5"/>',
 'settings': '<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/>',
 'arrow': '<path d="M5 19 19 5M5 5h14v14"/>',
 'chart': '<path d="M3 21h18M6 17v-6m6 6V5m6 12v-8"/>',
 'gift': '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12.5h18M12 8S10.5 3.5 8 4.4 8.6 8 12 8Zm0 0s1.5-4.5 4-3.6S15.4 8 12 8Z"/>',
 'scale': '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a4 4 0 0 0 6 0Zm14 0-3 7a4 4 0 0 0 6 0Z"/>',
 'lock': '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 'key': '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3M14 9l2 2"/>',
 'api': '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>',
 'server': '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
 'id': '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M15 10h3M15 13h3"/>',
 'mask': '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7a9.7 9.7 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
 'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
 'link': '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 'upload': '<path d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
 'download': '<path d="M12 4v12M7 11l5 5 5-5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
 'gauge': '<path d="M4 18a8 8 0 1 1 16 0M12 18l4-6"/>',
 'eyes': '<path d="m3 12 4 4 7-8M10 16l1 1 10-11"/>',
 'chat': '<path d="M4 5h16v11H9l-5 4Z"/>',
 'star': '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>',
 'tag': '<path d="M3 12V4h8l10 10-8 8Z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
 'target': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 'mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
 'sliders': '<path d="M4 6h10M4 12h16M4 18h7"/><circle cx="17" cy="6" r="2"/><circle cx="14" cy="18" r="2"/>',
 'case': '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
 'bell': '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
 'calendar': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 'flag': '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
 'pulse': '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
 'list': '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
}


def icon(name, cls=''):
 return f'<svg class="rhs-icon {cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">{SHAPES[name]}</svg>'


def kicker(n, text):
 return f'<span class="rhs-kicker"><b>{n:02d}</b> {text}</span>'


def intro(n, data, cta=None, cta_text=None):
 head, title, text = data[:3]
 link = f'<a class="btn rhs-cta" href="{cta}">{cta_text or data[3]} {icon("arrow")}</a>' if cta else ''
 return f'<div class="rhs-sector-copy">{kicker(n, head)}<h2>{title}</h2><p>{text}</p>{link}</div>'

def icon(name, cls=''):
 return f'<svg class="rhs-icon {cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">{SHAPES[name]}</svg>'


def kicker(n, text):
 return f'<span class="rhs-kicker"><b>{n:02d}</b> {text}</span>'


def status(t, state):
 """Availability chip: Sentinel is available now; the PAM back-office is in development."""
 return f'<span class="rhs-status rhs-status-{state}">{t["status"][state]}</span>'


def intro(n, data, cta=None, cta_text=None, chip=''):
 head, title, text = data[:3]
 link = f'<a class="btn rhs-cta" href="{cta}">{cta_text or data[3]} {icon("arrow")}</a>' if cta else ''
 return f'<div class="rhs-sector-copy">{kicker(n, head)}{chip}<h2>{title}</h2><p>{text}</p>{link}</div>'


# Shared, language-independent structure. Text lives in COPY, aligned by position.
TOUR = [  # Sentinel areas: tab key, icon, main capture, phone capture, icons of the listed screens
 {'key': 'transactions', 'icon': 'payments', 'shot': 'sentinel-transactions', 'phone': 'sentinel-withdrawals-mobile', 'more': '#how', 'screens': ['list', 'record', 'users']},
 {'key': 'alerts', 'icon': 'bell', 'shot': 'sentinel-alerts', 'phone': 'sentinel-alerts-mobile', 'more': None, 'screens': ['bell', 'case', 'pulse', 'check', 'star']},
 {'key': 'rules', 'icon': 'sliders', 'shot': 'sentinel-rules', 'phone': None, 'more': None, 'screens': ['layers', 'settings', 'chart', 'eyes']},
 {'key': 'customers', 'icon': 'person', 'shot': 'sentinel-customer', 'phone': 'sentinel-customer-mobile', 'more': '#security', 'screens': ['users', 'person', 'search']},
]
FLOW = ['event', 'score', 'alert', 'queue', 'review', 'label']
FLOW_OPTIONAL = ['alert', 'queue']  # they depend on the operator's settings: the alert triggers and the risk limit
HOW_ICONS = ['gauge', 'bell', 'clock', 'check', 'flag', 'record']
HOW_SHOT = 'sentinel-transaction-detail'
SECURITY_ICONS = ['users', 'record', 'lock', 'key', 'link', 'sliders']
SECURITY_SHOT = 'sentinel-roles'
MODULE_CARDS = [('fraud', 'fraud', '#platform', 'available'), ('core', 'core', '#back-office', 'development'),
                ('payments', 'payments', '#back-office', 'development'), ('intelligence', 'chart', '#back-office', 'development')]
BACKOFFICE_ICONS = ['users', 'payments', 'scale', 'gift', 'chart', 'settings']
PILOT_ICONS = ['search', 'sliders', 'api', 'users']
PRINCIPLE_ICONS = ['layers', 'sliders', 'fraud']
SHOTS = [spec['shot'] for spec in TOUR] + [HOW_SHOT, SECURITY_SHOT]

COPY = {
'en': {
 'status': {'available': 'Available', 'development': 'In development'},
 'tour': {'head': ['SENTINEL', 'From each transaction<br><em>to a reviewed decision.</em>', 'Sentinel scores your transactions for risk, alerts your team to the ones that need a look and keeps each customer\'s record in one file.'],
  'tablist': 'Sentinel areas', 'screens': 'Screens in this area',
  'tabs': [
   {'label': 'Transactions', 'title': 'See the risk of each transaction.',
    'bullets': ['A risk level and score for each event, with the account, amount, lifetime value and time.',
                'Filters by event type, such as withdrawals, and a column picker for what your team needs to see.',
                'Each transaction opens with the rules that fired and whether it went to the manual queue.'],
    'screens': [['Transactions', 'Events and their risk'], ['Transaction detail', 'Rules that fired and the queue'], ['Customers', 'The account list']],
    'more': 'How a risky withdrawal is handled', 'alt': 'Sentinel: transaction list with risk levels and scores, with synthetic data.'},
   {'label': 'Alerts', 'title': 'Alerts with the steps to review them.',
    'bullets': ['An alert queue fed by the triggers you set, such as a withdrawal with a high score.',
                'Each alert opens with the event data and its review steps.',
                'Review checklists, and a watchlist for accounts your team wants to follow.'],
    'screens': [['Alerts', 'The alert queue'], ['Alert detail', 'Event data and review steps'], ['When to alert', 'Alert triggers'], ['Checklists', 'Review steps'], ['Watch', 'Accounts to follow']],
    'more': '', 'alt': 'Sentinel: alert queue with synthetic alerts.'},
   {'label': 'Rules', 'title': 'Rules your team controls.',
    'bullets': ['Start from a ready-made package, then adjust the basic rules category by category.',
                'Advanced rules for more specific conditions.',
                'A performance view for each rule, and rule changes held in Approvals with who proposed them.'],
    'screens': [['Basic rules', 'Packages and categories'], ['Advanced rules', 'Specific conditions'], ['Performance', 'How each rule performs'], ['Approvals', 'Proposed rule changes']],
    'more': '', 'alt': 'Sentinel: basic rules with ready-made packages and rule categories.'},
   {'label': 'Customers', 'title': 'One file for each customer.',
    'bullets': ['The customer record: status, KYC, key dates, balance, lifetime value and country.',
                'A timeline of deposits and withdrawals, the bets, and the history of actions on the account.',
                'Search from any screen with Ctrl+K.'],
    'screens': [['Customers', 'The account list'], ['Customer file', 'Record, timeline, bets and history'], ['Global search', 'Ctrl+K from any screen']],
    'more': 'Access and integration', 'alt': 'Sentinel: the record of a synthetic customer, with status, KYC, balance and lifetime value.'},
  ]},
 'how': {'head': ['HOW IT WORKS', 'Risky withdrawals<br><em>wait for a person.</em>', 'When a withdrawal\'s score reaches the risk limit you set, Sentinel puts it in a manual queue. Your team reviews it with the rules that fired and labels the outcome.'],
  'flow_title': 'A risky withdrawal, step by step',
  'flow': {'event': 'Withdrawal', 'score': 'Risk score', 'alert': 'Alert', 'queue': 'Manual queue', 'review': 'Review', 'label': 'Fraud or legitimate'},
  'flow_note': 'Dashed steps depend on your settings: the alert triggers and your risk limit.',
  'items': [['Risk score', 'Each event gets a risk level and score from the rules that fired.'],
            ['When to alert', 'The triggers you set decide which events raise an alert.'],
            ['Risk limit', 'A withdrawal whose score reaches your limit waits in the manual queue.'],
            ['Review steps', 'Each alert opens with the event data and the steps to review it.'],
            ['Fraud or legitimate', 'After review, your team labels the outcome.'],
            ['Activity log', 'What each teammate opened and did, and when.']],
  'alt': 'Sentinel: a synthetic withdrawal held in the manual queue, with the rules that fired.'},
 'security': {'head': ['ACCESS & INTEGRATION', 'Access by role.<br><em>Activity on record.</em>', 'Your team works through roles built from a permission matrix, and the activity log keeps what each person did. Your platform connects through API keys, webhooks and field mapping.'],
  'items': [['Roles and permissions', 'Each role is a set of permissions in a matrix; teammates get access through their role.'],
            ['Activity log', 'Sign-ins, the screens and customer files opened, and the actions taken.'],
            ['Sign-in settings', 'How your team signs in to Sentinel.'],
            ['API keys', 'Keys your platform uses to send events to Sentinel.'],
            ['Webhooks', 'Sentinel notifies your systems of results.'],
            ['Field mapping', 'Your platform\'s fields matched to Sentinel\'s.']],
  'arch': [['Your platform', 'Sends events with an API key'], ['Sentinel', 'Scores, alerts and holds'], ['Your team', 'Reviews and labels'], ['Webhooks', 'Results back to your systems']], 'arch_title': 'How an event travels',
  'alt': 'Sentinel: the permission matrix by role.'},
 'modules': {'head': ['MODULES', 'Sentinel today.<br><em>The full platform next.</em>', 'Fraud, the risk and fraud control described above, is available. Core, Payments and Intelligence make up the PAM back-office, in development.'],
  'cards': [['Fraud', 'Transaction risk, alerts, rules, manual review of withdrawals and the activity log.'],
            ['Core', 'Player search, Player 360, KYC, responsible gaming, compliance and administration.'],
            ['Payments', 'Withdrawal approvals by role and limit, cashier limits, unmatched payments, balance batches and the ledger.'],
            ['Intelligence', 'Reports and segments: the balance owed to players, margins, negative balances, blocks and job health.']],
  'link': 'See {name}'},
 'backoffice': {'head': ['THE PAM BACK-OFFICE', 'Next: player accounts,<br><em>payments and compliance.</em>', 'RHS Labs is building the player account management back-office that completes Sentinel. These areas are in development and not yet available.'],
  'items': [['Player accounts', 'Player search with combinable criteria, and Player 360: summary, KYC, payments, wallet, risk, limits, games and history.'],
            ['Payments', 'A withdrawal queue with approval limits by role and player category, cashier limits, unmatched payments and balance batches.'],
            ['Compliance', 'An audit report with an integrity check, responsible gaming, a KYC queue, data-subject requests and policy versions.'],
            ['Engagement', 'Segments, bonus campaigns, bulk actions, a VIP portfolio and service tickets.'],
            ['Reports', 'The operator\'s financial summary, margins, negative balances, active blocks, payout times and job health.'],
            ['Administration', 'Staff roles built from granular permissions, approval limits, tags and handling-time targets.']],
  'note': 'Features and timing are confirmed in commercial discussions.'},
 'pilot': {'head': ['GETTING STARTED', 'From the first call<br><em>to live review.</em>', 'We set Sentinel up with your team, starting from the risks of your operation and the transactions you want to watch.'],
  'steps': [['Discovery', 'We map your operation, the transactions to score and your team\'s roles.'],
            ['Rules and alerts', 'We pick a starting package, adjust the rules, and set when to alert and the risk limit for the manual queue.'],
            ['Connection', 'Your platform connects with API keys and field mapping; webhooks send results back.'],
            ['Supported operation', 'Your team reviews with ours alongside, with regular rule reviews.']],
  'cta': 'Discuss a pilot'},
 'about': {'head': ['ABOUT RHS LABS', 'Software for regulated<br>betting operations.', 'RHS Labs builds Sentinel, risk and fraud control for regulated betting operators, and is building its PAM back-office. Both are designed around accountable work: roles, review and a record of the team\'s actions.', 'See how to get started'],
  'principles': [['Real workflows first', 'Screens follow how risk, payments and compliance teams work.'], ['Rules you control', 'Your team decides what counts as risk and what needs a person.'], ['Accountable by default', 'Roles, rule changes with their author and an activity log, built in.']],
  'brandline': 'Risk and fraud control<br>for regulated operators.'},
 'contact': {'head': ['GET IN TOUCH', 'See Sentinel with<br>your own use cases.', 'Tell us about your operation and jurisdiction. We will walk you through Sentinel with synthetic data and discuss a pilot.'],
  'sales': 'Talk to our team', 'salessub': 'A walkthrough of Sentinel for your team, with synthetic data.',
  'emailnote': 'Each button opens your email application with a short template to complete. This website does not send messages; please do not include player personal data.'},
 'cta': {'demo': 'Request a demo', 'demo_short': 'Request a demo', 'pilot': 'Discuss a pilot', 'opens': '(opens your email application)',
  'mail': {'demo': ['Sentinel demo request', 'I would like a demo of RHS Labs Sentinel.'], 'pilot': ['Sentinel pilot program', 'We would like to discuss a Sentinel pilot.']},
  'fields': ['Company:', 'Jurisdiction(s):', 'Approximate volume (active players or monthly transactions):', 'Modules of interest (Core, Payments, Intelligence, Fraud):'],
  'greeting': 'Hello RHS Labs team,', 'privacy': 'Please do not include player personal data in this email.'},
 'footer': {'tagline': 'Risk and fraud control for regulated operators.', 'nav': ['Platform', 'How it works', 'Integration', 'Modules', 'Back-office', 'Pilot', 'Company'], 'nav_label': 'Footer',
  'notice': {'available': 'Sentinel is available; scope and terms are confirmed in commercial discussions. The PAM back-office is in development.',
             'concept': 'The dashboards at the top of the page are concept illustrations with simulated data, not the current product.',
             'product': 'Product screens show synthetic data from a demo environment.'},
  'privacy': 'Privacy & inquiries', 'privacynote': 'This static website has no inquiry form or analytics tracker. Only your language preference is stored in this browser. Email links open your own email app; please do not share player personal data. Organizational and data-handling details are confirmed before any pilot.'},
},
'es': {
 'status': {'available': 'Disponible', 'development': 'En desarrollo'},
 'tour': {'head': ['SENTINEL', 'De cada transacción<br><em>a una decisión revisada.</em>', 'Sentinel puntúa el riesgo de sus transacciones, avisa a su equipo de las que requieren atención y reúne el registro de cada cliente en una sola ficha.'],
  'tablist': 'Áreas de Sentinel', 'screens': 'Pantallas de esta área',
  'tabs': [
   {'label': 'Transacciones', 'title': 'Vea el riesgo de cada transacción.',
    'bullets': ['Un nivel y una puntuación de riesgo por evento, con la cuenta, el monto, el valor de vida del cliente y la hora.',
                'Filtros por tipo de evento, como los retiros, y un selector de columnas para mostrar lo que su equipo necesita.',
                'Cada transacción se abre con las reglas que se activaron y si pasó a la cola manual.'],
    'screens': [['Transacciones', 'Eventos y su riesgo'], ['Detalle de la transacción', 'Reglas activadas y la cola'], ['Clientes', 'La lista de cuentas']],
    'more': 'Cómo se trata un retiro de riesgo', 'alt': 'Sentinel: lista de transacciones con niveles y puntuaciones de riesgo, con datos sintéticos.'},
   {'label': 'Alertas', 'title': 'Alertas con los pasos para revisarlas.',
    'bullets': ['Una cola de alertas generada por los disparadores que usted define, como un retiro con una puntuación alta.',
                'Cada alerta se abre con los datos del evento y sus pasos de revisión.',
                'Listas de verificación para las revisiones y una lista de seguimiento para las cuentas que su equipo quiere observar.'],
    'screens': [['Alertas', 'La cola de alertas'], ['Detalle de la alerta', 'Datos del evento y pasos de revisión'], ['Cuándo alertar', 'Disparadores de alertas'], ['Listas de verificación', 'Pasos de revisión'], ['Seguimiento', 'Cuentas en observación']],
    'more': '', 'alt': 'Sentinel: cola de alertas con alertas sintéticas.'},
   {'label': 'Reglas', 'title': 'Reglas bajo el control de su equipo.',
    'bullets': ['Empiece con un paquete listo para usar y ajuste las reglas básicas categoría por categoría.',
                'Reglas avanzadas para condiciones más específicas.',
                'Una vista del desempeño de cada regla, y los cambios de reglas retenidos en Aprobaciones con quién los propuso.'],
    'screens': [['Reglas básicas', 'Paquetes y categorías'], ['Reglas avanzadas', 'Condiciones específicas'], ['Desempeño', 'Resultados de cada regla'], ['Aprobaciones', 'Cambios de reglas propuestos']],
    'more': '', 'alt': 'Sentinel: reglas básicas con paquetes listos para usar y categorías de reglas.'},
   {'label': 'Clientes', 'title': 'Una ficha para cada cliente.',
    'bullets': ['El registro del cliente: estado, KYC, fechas clave, saldo, valor de vida del cliente y país.',
                'Una línea de tiempo de depósitos y retiros, las apuestas y el historial de acciones en la cuenta.',
                'Busque desde cualquier pantalla con Ctrl+K.'],
    'screens': [['Clientes', 'La lista de cuentas'], ['Ficha del cliente', 'Registro, línea de tiempo, apuestas e historial'], ['Búsqueda global', 'Ctrl+K desde cualquier pantalla']],
    'more': 'Acceso e integración', 'alt': 'Sentinel: el registro de un cliente sintético, con estado, KYC, saldo y valor de vida del cliente.'},
  ]},
 'how': {'head': ['CÓMO FUNCIONA', 'Los retiros de riesgo<br><em>esperan a una persona.</em>', 'Cuando la puntuación de un retiro alcanza el límite de riesgo que usted define, Sentinel lo pone en una cola manual. Su equipo lo revisa con las reglas que se activaron y etiqueta el resultado.'],
  'flow_title': 'Un retiro de riesgo, paso a paso',
  'flow': {'event': 'Retiro', 'score': 'Puntuación de riesgo', 'alert': 'Alerta', 'queue': 'Cola manual', 'review': 'Revisión', 'label': 'Fraude o legítimo'},
  'flow_note': 'Los pasos con línea discontinua dependen de su configuración: los disparadores de alertas y su límite de riesgo.',
  'items': [['Puntuación de riesgo', 'Cada evento recibe un nivel y una puntuación de riesgo según las reglas que se activaron.'],
            ['Cuándo alertar', 'Los disparadores que usted define deciden qué eventos generan una alerta.'],
            ['Límite de riesgo', 'Un retiro cuya puntuación alcanza su límite espera en la cola manual.'],
            ['Pasos de revisión', 'Cada alerta se abre con los datos del evento y los pasos para revisarla.'],
            ['Fraude o legítimo', 'Tras la revisión, su equipo etiqueta el resultado.'],
            ['Registro de actividad', 'Qué abrió e hizo cada persona del equipo, y cuándo.']],
  'alt': 'Sentinel: un retiro sintético retenido en la cola manual, con las reglas que se activaron.'},
 'security': {'head': ['ACCESO E INTEGRACIÓN', 'Acceso por rol.<br><em>Actividad registrada.</em>', 'Su equipo trabaja con roles formados por una matriz de permisos, y el registro de actividad guarda lo que hizo cada persona. Su plataforma se conecta mediante claves de API, webhooks y mapeo de campos.'],
  'items': [['Roles y permisos', 'Cada rol es un conjunto de permisos en una matriz; cada persona del equipo accede según su rol.'],
            ['Registro de actividad', 'Los inicios de sesión, las pantallas y fichas de clientes abiertas, y las acciones realizadas.'],
            ['Configuración de acceso', 'Cómo inicia sesión su equipo en Sentinel.'],
            ['Claves de API', 'Las claves que su plataforma usa para enviar eventos a Sentinel.'],
            ['Webhooks', 'Sentinel notifica los resultados a sus sistemas.'],
            ['Mapeo de campos', 'Los campos de su plataforma emparejados con los de Sentinel.']],
  'arch': [['Su plataforma', 'Envía eventos con una clave de API'], ['Sentinel', 'Puntúa, alerta y retiene'], ['Su equipo', 'Revisa y etiqueta'], ['Webhooks', 'Resultados de vuelta a sus sistemas']], 'arch_title': 'El recorrido de un evento',
  'alt': 'Sentinel: la matriz de permisos por rol.'},
 'modules': {'head': ['MÓDULOS', 'Sentinel hoy.<br><em>La plataforma completa, después.</em>', 'Fraud, el control de riesgo y fraude descrito arriba, está disponible. Core, Payments e Intelligence forman el back-office PAM, en desarrollo.'],
  'cards': [['Fraud', 'Riesgo de las transacciones, alertas, reglas, revisión manual de retiros y registro de actividad.'],
            ['Core', 'Búsqueda de jugadores, Player 360, KYC, juego responsable, cumplimiento y administración.'],
            ['Payments', 'Aprobación de retiros por rol y límite, límites de caja, pagos no conciliados, ajustes en lote y libro de movimientos.'],
            ['Intelligence', 'Informes y segmentos: el saldo adeudado a los jugadores, márgenes, saldos negativos, bloqueos y estado de las tareas programadas.']],
  'link': 'Ver {name}'},
 'backoffice': {'head': ['EL BACK-OFFICE PAM', 'Lo siguiente: cuentas de jugadores,<br><em>pagos y cumplimiento.</em>', 'RHS Labs está desarrollando el back-office de gestión de cuentas de jugadores que completa Sentinel. Estas áreas están en desarrollo y todavía no están disponibles.'],
  'items': [['Cuentas de jugadores', 'Búsqueda de jugadores con criterios combinables, y Player 360: resumen, KYC, pagos, billetera, riesgo, límites, juego e historial.'],
            ['Pagos', 'Una cola de retiros con límites de aprobación por rol y categoría de jugador, límites de caja, pagos no conciliados y ajustes en lote.'],
            ['Cumplimiento', 'Un informe de auditoría con verificación de integridad, juego responsable, una cola KYC, solicitudes de titulares de datos y versiones de políticas.'],
            ['Relación con el jugador', 'Segmentos, campañas de bonos, acciones masivas, una cartera VIP y tickets de atención.'],
            ['Informes', 'El resumen financiero del operador, márgenes, saldos negativos, bloqueos activos, tiempos de pago y estado de las tareas programadas.'],
            ['Administración', 'Roles del equipo formados por permisos granulares, límites de aprobación, etiquetas y objetivos de tiempo de atención.']],
  'note': 'Las funciones y los plazos se confirman en las conversaciones comerciales.'},
 'pilot': {'head': ['CÓMO EMPEZAR', 'De la primera llamada<br><em>a la revisión en operación.</em>', 'Configuramos Sentinel con su equipo, a partir de los riesgos de su operación y de las transacciones que quiere vigilar.'],
  'steps': [['Descubrimiento', 'Mapeamos su operación, las transacciones que se van a puntuar y los roles de su equipo.'],
            ['Reglas y alertas', 'Elegimos un paquete inicial, ajustamos las reglas y definimos cuándo alertar y el límite de riesgo de la cola manual.'],
            ['Conexión', 'Su plataforma se conecta con claves de API y mapeo de campos; los webhooks devuelven los resultados.'],
            ['Operación acompañada', 'Su equipo revisa con el apoyo del nuestro, con revisiones periódicas de las reglas.']],
  'cta': 'Conversar sobre un piloto'},
 'about': {'head': ['ACERCA DE RHS LABS', 'Software para operaciones<br>de apuestas reguladas.', 'RHS Labs desarrolla Sentinel, control de riesgo y fraude para operadores de apuestas regulados, y está construyendo su back-office PAM. Ambos están diseñados en torno a un trabajo trazable: roles, revisión y un registro de las acciones del equipo.', 'Cómo empezar'],
  'principles': [['Primero, los flujos reales', 'Las pantallas siguen la forma de trabajar de los equipos de riesgo, pagos y cumplimiento.'], ['Reglas bajo su control', 'Su equipo decide qué cuenta como riesgo y qué necesita a una persona.'], ['Trazable por defecto', 'Roles, cambios de reglas con su autor y un registro de actividad integrados.']],
  'brandline': 'Control de riesgo y fraude<br>para operadores regulados.'},
 'contact': {'head': ['CONTACTO', 'Vea Sentinel con<br>sus propios casos de uso.', 'Cuéntenos sobre su operación y su jurisdicción. Le mostraremos Sentinel con datos sintéticos y conversaremos sobre un piloto.'],
  'sales': 'Hable con nuestro equipo', 'salessub': 'Un recorrido por Sentinel para su equipo, con datos sintéticos.',
  'emailnote': 'Cada botón abre su aplicación de correo con una breve plantilla para completar. Este sitio no envía mensajes; no incluya datos personales de jugadores.'},
 'cta': {'demo': 'Solicitar una demostración', 'demo_short': 'Solicitar demo', 'pilot': 'Conversar sobre un piloto', 'opens': '(abre su aplicación de correo)',
  'mail': {'demo': ['Solicitud de demostración de Sentinel', 'Me gustaría ver una demostración de RHS Labs Sentinel.'], 'pilot': ['Programa piloto de Sentinel', 'Nos gustaría conversar sobre un piloto de Sentinel.']},
  'fields': ['Empresa:', 'Jurisdicción(es):', 'Volumen aproximado (jugadores activos o transacciones mensuales):', 'Módulos de interés (Core, Payments, Intelligence, Fraud):'],
  'greeting': 'Hola, equipo de RHS Labs:', 'privacy': 'Por favor, no incluya datos personales de jugadores en este correo.'},
 'footer': {'tagline': 'Control de riesgo y fraude para operadores regulados.', 'nav': ['Plataforma', 'Cómo funciona', 'Integración', 'Módulos', 'Back-office', 'Piloto', 'Empresa'], 'nav_label': 'Pie de página',
  'notice': {'available': 'Sentinel está disponible; el alcance y las condiciones se confirman en las conversaciones comerciales. El back-office PAM está en desarrollo.',
             'concept': 'Los paneles de la parte superior son ilustraciones conceptuales con datos simulados, no el producto actual.',
             'product': 'Las pantallas del producto muestran datos sintéticos de un entorno de demostración.'},
  'privacy': 'Privacidad y consultas', 'privacynote': 'Este sitio estático no tiene formularios de consulta ni herramientas de analítica. Solo guarda su preferencia de idioma en este navegador. Los enlaces de correo abren su propia aplicación de correo; por favor, no comparta datos personales de jugadores. Los detalles organizativos y de tratamiento de datos se confirman antes de cualquier piloto.'},
},
}
FOOTER_LINKS = ['#platform', '#how', '#security', '#modules', '#back-office', '#pilot', '#company']


def check_structure():
 """The language-independent lists and every language's copy line up item by item (zip would hide a gap)."""
 pairs = lambda c: [(TOUR, c['tour']['tabs']), (HOW_ICONS, c['how']['items']), (SECURITY_ICONS, c['security']['items']),
                    (MODULE_CARDS, c['modules']['cards']), (BACKOFFICE_ICONS, c['backoffice']['items']),
                    (PILOT_ICONS, c['pilot']['steps']), (PRINCIPLE_ICONS, c['about']['principles']), (FOOTER_LINKS, c['footer']['nav'])]
 for code, c in COPY.items():
  for spec, copy in pairs(c):
   if len(spec) != len(copy):
    raise ValueError(f'{code}: {len(copy)} copy items for {len(spec)} structure items')
  for spec, tab in zip(TOUR, c['tour']['tabs']):
   if len(spec['screens']) != len(tab['screens']) or bool(spec['more']) != bool(tab['more']):
    raise ValueError(f'{code}: tour area {spec["key"]} does not match its structure')
  if sorted(c['how']['flow']) != sorted(FLOW):
   raise ValueError(f'{code}: flow steps do not match')


DESKTOP_FILE = (3200, 2000)  # 1600×1000 CSS px at 2×: placeholder and capture share it
PHONE_FILE = (780, 1688)     # 390×844 at 2×


def mailto(lang, kind):
 """Pre-filled e-mail (subject and a short template); no form, no backend. Line breaks are CRLF (RFC 6068)."""
 c = COPY[lang]['cta']
 subject, opening = c['mail'][kind]
 body = '\r\n'.join([c['greeting'], '', opening, '', *c['fields'], '', c['privacy']])
 return f'mailto:{CONTACT}?subject={quote(subject, safe="")}&body={quote(body, safe="")}'


def cta_link(lang, kind, cls='btn rhs-cta', arrow=True):
 c = COPY[lang]['cta']
 return f'<a class="{cls}" href="{esc(mailto(lang, kind))}" data-cta="{kind}">{c[kind]}<span class="rhs-sr"> {c["opens"]}</span>{" " + icon("arrow") if arrow else ""}</a>'


def product_src(name):
 return f'/assets/product/{name}.webp'


def captured(name):
 """True once assets/product/<name>.webp is a real capture, no longer the registered placeholder."""
 rel = f'assets/product/{name}.webp'
 path = ROOT / rel
 return path.exists() and hashlib.sha256(path.read_bytes()).hexdigest() != PLACEHOLDERS.get(rel)


def picture(name, alt, phone=None):
 """The screen's capture; phones get the phone capture when one is given."""
 source = f'<source media="(max-width: 560px)" srcset="{product_src(phone)}" width="{PHONE_FILE[0]}" height="{PHONE_FILE[1]}">' if phone else ''
 return f'<picture>{source}<img src="{product_src(name)}" width="{DESKTOP_FILE[0]}" height="{DESKTOP_FILE[1]}" alt="{esc(alt)}" loading="lazy" decoding="async"></picture>'


def frame(inner, cls=''):
 return f'<figure class="rhs-frame {cls}"><div class="rhs-frame-bar" aria-hidden="true"><i></i><i></i><i></i><span>RHS Labs <em>/ Sentinel</em></span></div><div class="rhs-frame-shot">{inner}</div></figure>'

def tour(t, n):
 c = t['tour']
 tabs, panels = [], []
 for i, (spec, copy) in enumerate(zip(TOUR, c['tabs'])):
  key, on = spec['key'], i == 0
  tabs.append(f'<button type="button" role="tab" class="rhs-tour-tab" id="tour-tab-{key}" aria-controls="tour-{key}" aria-selected="{str(on).lower()}" tabindex="{0 if on else -1}">{icon(spec["icon"])}<span>{copy["label"]}</span></button>')
  bullets = ''.join(f'<li>{icon("check")}<span>{b}</span></li>' for b in copy['bullets'])
  more = f'<a class="rhs-more" href="{spec["more"]}">{copy["more"]} {icon("arrow")}</a>' if spec['more'] else ''
  screens = ''.join(f'<li>{icon(ic)}<b>{name}</b><small>{desc}</small></li>' for ic, (name, desc) in zip(spec['screens'], copy['screens']))
  phone = spec['phone'] if spec['phone'] and captured(spec['phone']) else None
  shot = frame(picture(spec['shot'], copy['alt'], phone=phone), 'rhs-frame-phone' if phone else '') if captured(spec['shot']) else ''
  visual = shot + f'<div class="rhs-screens"><p class="rhs-screens-title" id="tour-screens-{key}">{c["screens"]}</p><ul aria-labelledby="tour-screens-{key}">{screens}</ul></div>'
  hidden = '' if on else ' hidden'
  panels.append(f'<div class="rhs-tour-panel" role="tabpanel" id="tour-{key}" aria-labelledby="tour-tab-{key}" tabindex="0"{hidden}><div class="rhs-tour-copy"><h3>{copy["title"]}</h3><ul class="rhs-ticks">{bullets}</ul>{more}</div><div class="rhs-tour-visual">{visual}</div></div>')
 return f'''<section id="platform" class="rhs-sector rhs-tour-sector" data-sector="{n}" data-status="available"><div class="wrap"><div class="rhs-section-heading">{intro(n, c['head'], chip=status(t, 'available'))}</div><div class="rhs-tour" data-tour><div class="rhs-tour-tabs" role="tablist" aria-label="{esc(c['tablist'])}">{''.join(tabs)}</div>{''.join(panels)}</div></div></section>'''


def how(t, n):
 c = t['how']
 steps = ''.join(f'<li class="rhs-flow-step{" rhs-flow-optional" if key in FLOW_OPTIONAL else ""}"><span>{c["flow"][key]}</span></li>' for key in FLOW)
 flow = f'<figure class="rhs-flow"><figcaption><b>{c["flow_title"]}</b></figcaption><ol class="rhs-flow-steps">{steps}</ol><p class="rhs-flow-note">{c["flow_note"]}</p></figure>'
 items = ''.join(f'<li><span class="rhs-mini-icon">{icon(ic)}</span><div><h3>{title}</h3><p>{text}</p></div></li>' for ic, (title, text) in zip(HOW_ICONS, c['items']))
 shot = f'<div class="rhs-wide-shot">{frame(picture(HOW_SHOT, c["alt"]))}</div>' if captured(HOW_SHOT) else ''
 return f'''<section id="how" class="rhs-sector rhs-payments-sector rhs-how" data-sector="{n}" data-status="available"><span id="payments" class="rhs-anchor"></span><div class="wrap"><div class="rhs-split">{intro(n, c['head'])}{flow}</div><ul class="rhs-capabilities">{items}</ul>{shot}</div></section>'''


def security(t, n):
 c = t['security']
 items = ''.join(f'<li><span class="rhs-mini-icon">{icon(ic)}</span><div><h3>{title}</h3><p>{text}</p></div></li>' for ic, (title, text) in zip(SECURITY_ICONS, c['items']))
 platform, sentinel, team, hooks = c['arch']
 arch = f'<figure class="rhs-arch"><figcaption>{c["arch_title"]}</figcaption><ol><li><b>{platform[0]}</b><small>{platform[1]}</small></li><li><b>{sentinel[0]}</b><small>{sentinel[1]}</small></li><li><b>{team[0]}</b><small>{team[1]}</small></li></ol><p class="rhs-arch-idp rhs-arch-out"><b>{hooks[0]}</b><small>{hooks[1]}</small></p></figure>'
 shot = f'<div class="rhs-wide-shot">{frame(picture(SECURITY_SHOT, c["alt"]))}</div>' if captured(SECURITY_SHOT) else ''
 return f'''<section id="security" class="rhs-sector rhs-security" data-sector="{n}" data-status="available"><div class="wrap"><div class="rhs-split">{intro(n, c['head'])}<div class="rhs-security-visual">{arch}<ul class="rhs-control-grid rhs-security-list">{items}</ul></div></div>{shot}</div></section>'''


def modules(t, n):
 c = t['modules']
 cards = ''.join(f'<article class="rhs-product" data-status="{state}"><span class="rhs-icon-box">{icon(ic)}</span>{status(t, state)}<h3>{name}</h3><p>{text}</p><a class="rhs-card-link" href="{href}" aria-label="{esc(c["link"].format(name=name))}">{icon("arrow")}</a></article>' for (key, ic, href, state), (name, text) in zip(MODULE_CARDS, c['cards']))
 return f'''<section id="modules" class="rhs-sector rhs-products" data-sector="{n}"><span id="intelligence" class="rhs-anchor"></span><div class="wrap"><div class="rhs-products-heading">{intro(n, c['head'])}</div><div class="rhs-product-grid">{cards}</div></div></section>'''


def backoffice(t, n):
 c = t['backoffice']
 items = ''.join(f'<li><span class="rhs-mini-icon">{icon(ic)}</span><div><h3>{title}</h3><p>{text}</p></div></li>' for ic, (title, text) in zip(BACKOFFICE_ICONS, c['items']))
 head, title, text = c['head']
 copy = f'<div class="rhs-sector-copy">{kicker(n, head)}{status(t, "development")}<h2>{title}</h2><p>{text}</p><p class="rhs-dev-note">{c["note"]}</p></div>'
 return f'''<section id="back-office" class="rhs-sector rhs-compliance rhs-backoffice" data-sector="{n}" data-status="development"><div class="wrap rhs-split">{copy}<ul class="rhs-control-grid">{items}</ul></div></section>'''


def pilot(t, n):
 c = t['pilot']
 steps = ''.join(f'<li class="rhs-step"><span class="rhs-round-icon">{icon(ic)}</span><b class="rhs-step-number">0{i + 1}</b><h3>{title}</h3><p>{text}</p></li>' for i, (ic, (title, text)) in enumerate(zip(PILOT_ICONS, c['steps'])))
 return f'''<section id="pilot" class="rhs-sector rhs-process" data-sector="{n}"><span id="use-cases" class="rhs-anchor"></span><div class="wrap rhs-split"><div class="rhs-sector-copy">{kicker(n, c['head'][0])}<h2>{c['head'][1]}</h2><p>{c['head'][2]}</p>{cta_link(t['lang'], 'pilot')}</div><ol class="rhs-steps">{steps}</ol></div></section>'''


def about(t, n):
 c = t['about']
 principles = ''.join(f'<div class="rhs-principle"><span>{icon(ic)}</span><div><h3>{title}</h3><p>{text}</p></div></div>' for ic, (title, text) in zip(PRINCIPLE_ICONS, c['principles']))
 return f'''<section id="company" class="rhs-sector rhs-about" data-sector="{n}"><div class="wrap rhs-about-grid">{intro(n, c['head'], '#pilot')}<div class="rhs-principles">{principles}</div><div class="rhs-flat-brand">{icon('brand')}<b>RHS Labs</b><p>{c['brandline']}</p></div></div></section>'''


def contact(t, n):
 c = t['contact']
 return f'''<section id="contact" class="rhs-sector rhs-contact" data-sector="{n}"><div class="wrap rhs-split">{intro(n, c['head'])}<div class="rhs-sales-panel"><span class="rhs-icon-box">{icon('layers')}</span><div><h3>{c['sales']}</h3><p>{c['salessub']}</p><a class="rhs-sales-email" href="mailto:{CONTACT}">{CONTACT}</a></div><div class="rhs-cta-group">{cta_link(t['lang'], 'demo')}{cta_link(t['lang'], 'pilot', 'btn rhs-cta rhs-cta-alt', arrow=False)}</div><small>{c['emailnote']}</small></div></div></section>'''


def footer(t, languages, notice):
 c = t['footer']
 links = ''.join(f'<a href="{href}">{label}</a>' for href, label in zip(FOOTER_LINKS, c['nav']))
 text = ' '.join(c['notice'][part] for part in notice)
 return f'''<footer class="rhs-footer"><div class="wrap"><div class="rhs-footer-top"><a href="#home" class="rhs-footer-brand">{icon('brand')}<b>RHS Labs <em>/ Sentinel</em></b></a><nav aria-label="{esc(c['nav_label'])}">{links}</nav><div class="rhs-languages">{languages}</div></div><div class="rhs-footer-notes"><p data-notice="{' '.join(notice)}">{text}</p><details id="privacy"><summary>{c['privacy']}</summary><p>{c['privacynote']}</p></details></div></div></footer>'''


def lower_page(lang, languages='', hero_kind='concept'):
 """Sectors 02–09 and the footer. The single footer notice says what the page's images are."""
 check_structure()
 t = dict(COPY[lang], lang=lang)
 sectors = [tour(t, 2), how(t, 3), security(t, 4), modules(t, 5), backoffice(t, 6), pilot(t, 7), about(t, 8), contact(t, 9)]
 html = '\n'.join(sectors)
 shown = any(captured(name) for name in SHOTS)
 notice = ['available'] + (['concept'] if hero_kind == 'concept' else []) + (['product'] if shown or hero_kind == 'product' else [])
 return '<div class="rhs-content">\n' + html + '\n' + footer(t, languages, notice) + '\n</div>'

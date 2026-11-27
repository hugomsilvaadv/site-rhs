"""Lower page (sectors 02–11): the real Sentinel back-office, EN/ES from one source; static, no backend.

Every claim maps to a screen of the back-office menu (its navigation config, with the flag on in the
`homologacao` profile). Each product image is assets/product/<screen>.webp of the capture plan. Until the
capture (tools/capture/screens.mjs) overwrites the registered "Screenshot pending" placeholder, the page leaves the
image out and the section stands on its text and diagrams; rendering again after a capture shows it. The capture
carries the product badge and the Player 360 markers itself.
Connected intelligence stays a concept diagram.
"""
import hashlib
import json
from html import escape as esc
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
CONTACT = 'sales@rhs-labs.com'
# The registered placeholders (tools/capture/placeholders.json): a file that still matches one is never shown.
PLACEHOLDERS = json.loads((ROOT / 'tools/capture/placeholders.json').read_text())['files']

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


# Shared, language-independent structure. Text lives in COPY, aligned by position.
MODULE_KEYS = ['core', 'payments', 'intelligence', 'fraud']
TOUR = [  # tab key, commercial module, icon, main capture, phone capture, deep link, screens (icon, capture)
 {'key': 'players', 'module': 'core', 'icon': 'users', 'shot': 'player-360-payments', 'phone': 'player-360-summary-mobile', 'more': '#player-360',
  'screens': [('search', 'global-search'), ('person', 'player-360-summary'), ('id', 'kyc'), ('clock', 'responsible-gaming'), ('lock', 'data-requests')]},
 {'key': 'payments', 'module': 'payments', 'icon': 'payments', 'shot': 'withdrawals-queue', 'phone': 'withdrawals-queue-mobile', 'more': '#payments',
  'screens': [('payments', 'withdrawals-queue'), ('list', None), ('link', 'reconciliation'), ('upload', 'adjustment-batches'), ('gauge', 'cashier-limits'), ('eyes', 'approval-limits')]},
 {'key': 'risk', 'module': 'fraud', 'icon': 'fraud', 'shot': 'alerts', 'phone': 'alerts-mobile', 'more': None,
  'screens': [('bell', 'alerts'), ('case', 'case-detail'), ('sliders', 'rules'), ('eyes', 'approvals')]},
 {'key': 'engagement', 'module': 'core', 'icon': 'gift', 'shot': 'segments', 'phone': None, 'more': None,
  'screens': [('target', 'segments'), ('gift', 'bonus'), ('layers', None), ('star', 'vip-portfolio'), ('chat', 'service-tickets'), ('mail', None)]},
 {'key': 'compliance', 'module': 'core', 'icon': 'scale', 'shot': 'audit', 'phone': None, 'more': '#compliance',
  'screens': [('record', 'audit'), ('clock', 'responsible-gaming'), ('id', 'kyc'), ('lock', 'data-requests'), ('flag', 'policies'), ('globe', 'jurisdiction')]},
 {'key': 'reports', 'module': 'intelligence', 'icon': 'chart', 'shot': 'reports', 'phone': 'reports-mobile', 'more': None,
  'screens': [('chart', 'reports')]},
 {'key': 'admin', 'module': 'core', 'icon': 'settings', 'shot': 'approval-limits', 'phone': None, 'more': '#security',
  'screens': [('users', 'users'), ('eyes', 'approval-limits'), ('tag', None), ('clock', None)]},
]
MODULE_CARDS = [('core', 'core', '#tour-players'), ('payments', 'payments', '#payments'), ('intelligence', 'chart', '#tour-reports'), ('fraud', 'fraud', '#tour-risk')]
P360_SHOT = 'player-360-summary'
P360_POINTS = ['identity', 'money', 'withdrawals', 'alerts', 'history']
PAYMENT_ICONS = ['clock', 'eyes', 'gauge', 'link', 'upload', 'download']
FLOW = ['requested', 'verifying', 'in_review', 'approved', 'second_approval', 'sent', 'confirmed']
FLOW_SIDE = ['held', 'rejected', 'failed', 'reversed']
PAYMENTS_SHOT = 'withdrawal-detail'
COMPLIANCE_ICONS = ['record', 'clock', 'id', 'lock', 'flag', 'globe', 'key']
SECURITY_ICONS = ['api', 'lock', 'person', 'layers', 'mask']
INTEL_NODES = [('payments', 120, 70), ('bell', 395, 58), ('fraud', 505, 175), ('id', 395, 292), ('clock', 120, 282), ('record', 40, 175)]
PILOT_ICONS = ['search', 'settings', 'api', 'users']
PRINCIPLE_ICONS = ['layers', 'settings', 'fraud']

COPY = {
'en': {
 'module': 'Module',
 'tour': {'head': ['THE BACK-OFFICE', 'Every operational team.<br><em>One back-office.</em>', 'Seven areas cover the daily work of a regulated operator: player accounts, payments, risk, engagement, compliance, reporting and administration.'],
  'tablist': 'Back-office areas', 'screens': 'Screens in this area',
  'tabs': [
   {'label': 'Players', 'title': 'Find any player. See the account in one place.',
    'bullets': ['Quick search and seven combinable criteria, with up to 200 results per page.', 'Player 360 in eight areas: summary, KYC, payments, wallet, risk, limits, games and history.', 'Identity and contact details masked by default; staff with permission reveal one field at a time, with a reason.', 'Notes, tags, segments and the VIP account manager on the profile.'],
    'screens': [['Search', 'Quick and advanced search'], ['Player 360', 'The account in eight areas'], ['KYC queue', 'Pending documents'], ['Responsible gaming', 'Self-exclusions, pauses and limits'], ['Data-subject requests', 'Privacy requests by deadline']],
    'more': 'Inside Player 360', 'alt': 'Sentinel back-office: the payments area of a synthetic player\'s Player 360.'},
   {'label': 'Payments', 'title': 'Withdrawals under control, from request to payout.',
    'bullets': ['A withdrawal queue that flags every request waiting past your handling-time target.', 'Approval limits by role and player category, with a second approver at or above the threshold.', 'Unmatched incoming payments linked to a player or returned to the payer, each approved by a second person.', 'Ledger search across players, with totals and CSV export.'],
    'screens': [['Withdrawals', 'Queue and decision steps'], ['Transactions', 'Ledger search and CSV'], ['Reconciliation', 'Unmatched incoming payments'], ['Balance batches', 'CSV batches with approval'], ['Cashier limits', 'Operator payment limits'], ['Approval limits', 'Who approves how much']],
    'more': 'Payments in detail', 'alt': 'Sentinel back-office: withdrawal queue with synthetic requests.'},
   {'label': 'Risk & fraud', 'title': 'From alert to closed case.',
    'bullets': ['Alert queue with filters, claim and assignment, and bulk resolution by root cause.', 'Cases with triage, reassignment, linked withdrawals and closure by root cause.', 'Rules with fire counts and false-positive rates; the editor requires a simulation before a change is proposed, and putting a blocking rule in force needs a second approver.', 'Fraud points per player, manual adjustments with a reason, and rule-exemption requests decided by a second person.'],
    'screens': [['Alerts', 'Queue, claim and resolution'], ['Cases', 'Investigation workspace'], ['Rules', 'Metrics, editor and firings'], ['Approvals', 'Four-eyes decisions']],
    'more': '', 'alt': 'Sentinel back-office: alert queue with synthetic alerts.'},
   {'label': 'Bonus & CRM', 'title': 'Bonus campaigns aimed at saved segments.',
    'bullets': ['Segments built from rules and groups, versioned, with an account count you can run before saving.', 'Bulk blocks or releases for a saved segment or a player list, previewed first; above an account threshold, a second person approves.', 'A VIP portfolio: an account manager for each VIP player, with contact restrictions.', 'Service tickets, and CRM templates approved by someone other than their author.'],
    'screens': [['Segments', 'Rules, groups and counts'], ['Bonus', 'Campaigns and audiences'], ['Bulk actions', 'Preview, then run'], ['VIP portfolio', 'Account managers'], ['Service tickets', 'Customer-service follow-up'], ['CRM templates', 'Drafts and four-eyes approval']],
    'more': '', 'alt': 'Sentinel back-office: segment list with synthetic segments.'},
   {'label': 'Compliance', 'title': 'Compliance controls, built into daily work.',
    'bullets': ['An audit report of staff actions, filterable by player, exportable to CSV, XML or Excel, with a one-click integrity check.', 'Responsible gaming: self-exclusions, pauses and limits, including requests taken by phone or chat.', 'Data-subject requests tracked against their deadlines.', 'A catalog of policy and terms versions with their effective dates, and each player\'s acceptance on record.'],
    'screens': [['Audit report', 'Who did what, and when'], ['Responsible gaming', 'Requests and exclusions'], ['KYC queue', 'Pending documents'], ['Data-subject requests', 'Privacy deadlines'], ['Policies & terms', 'Versions and effective dates'], ['Jurisdiction', 'Parameters and time zone']],
    'more': 'Compliance and control', 'alt': 'Sentinel back-office: audit report with synthetic entries.'},
   {'label': 'Reports', 'title': 'Finance, risk and operations figures on one page.',
    'bullets': ['Operator financial summary, including the balance owed to players at the previous day\'s close.', 'Casino margin by game category, negative balances by cause and age, and active blocks by origin.', 'Withdrawal payout times and the health of scheduled jobs.', 'Staff productivity, exportable as CSV.'],
    'screens': [['Reports', 'Finance, risk and operations']],
    'more': '', 'alt': 'Sentinel back-office: reports with synthetic operator totals.'},
   {'label': 'Administration', 'title': 'Access by role. Changes on record.',
    'bullets': ['Five staff roles built from granular permissions, reflected in menus and screens, and enforced by the API.', 'Approval limits by role and category, and the operator\'s cashier limits.', 'Tag catalog, handling-time targets and jurisdiction parameters.', 'Administrative changes recorded in the audit trail.'],
    'screens': [['Users & roles', 'Staff access and permissions'], ['Approval limits', 'Tiers by category'], ['Tags', 'Account tags'], ['SLA targets', 'Handling-time goals']],
    'more': 'Security and integration', 'alt': 'Sentinel back-office: approval limits by role and player category.'},
  ]},
 'modules': {'head': ['MODULES', 'Four modules.<br><em>Start with what you need.</em>', 'Core covers player accounts, compliance and administration; Payments, Intelligence and Fraud extend it. Choose the scope that fits your operation.'],
  'cards': [['Core', 'Player search, Player 360, KYC, responsible gaming, compliance and administration.'],
            ['Payments', 'Withdrawal queue and approvals, limits, unmatched incoming payments, balance batches and the ledger.'],
            ['Intelligence', 'Reports and segments: the balance owed to players, margins, negative balances, blocks and job health.'],
            ['Fraud', 'Alerts, cases, rules, fraud points and four-eyes approvals.']],
  'complete': 'All four modules: Core, Payments, Intelligence and Fraud.', 'link': 'See {name}'},
 'p360': {'head': ['PLAYER 360', 'One profile.<br><em>Decisions in context.</em>', 'Player 360 brings an account\'s identity, money, risk and history together, and lets your team handle many tasks without leaving the profile.'],
  'label': 'Parts of Player 360', 'alt': 'Sentinel back-office: Player 360 summary of a synthetic player, with numbered markers on the parts described beside it.',
  'points': [['Identity strip', 'KYC status, locks, risk tags and account age, at the top of every area.'],
             ['Money cards', 'Nine cards covering deposits, withdrawals, net deposits, bonus, revenue and balance, shown above every area.'],
             ['Pending withdrawals', 'The five oldest can be decided from the profile, with the same steps and four-eyes rules as the queue.'],
             ['Alerts', 'Open alerts in the summary, and manual alerts raised from the profile.'],
             ['History and audit', 'Changes to status, category, KYC, limits, blocks and balance adjustments, before and after, with who made them and the reason given.']]},
 'payments': {'head': ['PAYMENTS', 'Four eyes on every<br><em>withdrawal at or above your threshold.</em>', 'Withdrawals move through explicit states. Limits by role and player category decide who may approve, and a second person approves at or above the threshold.'],
  'items': [['Handling-time target', 'Each request shows how long it has waited and is flagged past your target; a report measures time to payment.'],
            ['Approval tiers', 'Each approving role has its own limit; at or above the category threshold, a different person gives the second approval.'],
            ['Cashier limits', 'Minimum and maximum amount per deposit and per withdrawal, and a maximum number of withdrawals per period, by player category.'],
            ['Unmatched payments', 'Incoming payments that match no deposit are linked to a player or returned to the payer through the payment provider\'s portal; one person requests, another approves.'],
            ['Balance batches', 'Credits and debits for up to 200 accounts from a CSV, previewed line by line and approved by another person.'],
            ['Ledger search and export', 'Search the ledger by ID or payment-provider reference and export up to 5,000 rows as CSV.']],
  'flow_title': 'Withdrawal states', 'flow_note': 'The states a withdrawal goes through in the back-office. A second approval applies at or above the category threshold.',
  'flow': {'requested': 'Requested', 'verifying': 'Verifying', 'in_review': 'In review', 'approved': 'Approved', 'second_approval': 'Second approval', 'sent': 'Sent', 'confirmed': 'Confirmed',
           'held': 'Held', 'rejected': 'Rejected', 'failed': 'Failed', 'reversed': 'Reversed'},
  'side': 'Other states', 'alt': 'Sentinel back-office: a synthetic withdrawal with its approval steps.'},
 'compliance': {'head': ['COMPLIANCE & CONTROL', 'Controls you can<br><em>trace and review.</em>', 'Responsible gaming, KYC, privacy and policy acceptance sit in the same back-office as the operation, with changes made by staff on record.'],
  'items': [['Audit trail', 'Who did what and when, before and after, with exports, a hash-chain integrity check and manually recorded incidents.'],
            ['Responsible gaming', 'Self-exclusions, pauses and limits, including requests recorded by an agent.'],
            ['KYC queue', 'Pending documents, timed against your target; each check verified or rejected with a reason.'],
            ['Data-subject requests', 'Privacy requests tracked against their deadlines.'],
            ['Policies and terms', 'A catalog of versions with their effective dates, and each player\'s acceptance on record.'],
            ['Jurisdiction parameters', 'Regulatory settings, including the operating time zone, published by authorized staff.'],
            ['Permissions by role', 'Every screen and action tied to a permission, granted through five staff roles.']]},
 'intelligence': {'head': ['CONNECTED INTELLIGENCE', 'Signals with context,<br><em>not verdicts.</em>', 'Sentinel gathers the signals around an account — payments, alerts, fraud points, KYC and responsible gaming — so your team decides in context.'],
  'center': 'Account', 'nodes': ['Payments', 'Alerts', 'Fraud points', 'KYC', 'Responsible gaming', 'Audit trail'],
  'note': 'Concept diagram. A signal alone never decides: your team and your policies do.', 'title': 'Signals around one account'},
 'security': {'head': ['SECURITY & INTEGRATION', 'Built API-first.<br><em>Secured on the server.</em>', 'Staff work in the browser; only the server can read their session and tokens, and authorization is checked on the server and in the API.'],
  'items': [['API-first', 'Every screen reads and writes through the Sentinel API.'],
            ['Sealed session cookie', 'An encrypted, HttpOnly cookie that only the back-office server can open, so access tokens are never readable in the browser.'],
            ['Sign-in through an identity provider', 'Staff sign in through OpenID Connect; the back-office never sees a password.'],
            ['Operator separation', 'The API is designed to scope each request to the signed-in staff member\'s operator and to authorize it.'],
            ['Masked identity and contact details', 'Name, email, phone, national ID, birth date, gender and address are masked by default; revealing one needs a permission and a reason, and is recorded.']],
  'arch': [['Staff browser', 'No readable tokens'], ['Back-office server', 'Sealed session, permissions'], ['Sentinel API', 'Authorization, audit'], ['Identity provider', 'Staff sign-in']], 'arch_title': 'How a request travels'},
 'pilot': {'head': ['PILOT PROGRAM', 'How a pilot works,<br><em>step by step.</em>', 'A pilot is scoped around your jurisdiction and payment flow, starting from what the product supports today, with our team working alongside yours.'],
  'steps': [['Discovery', 'We map your operation, jurisdiction, team roles and the modules in scope.'],
            ['Jurisdiction and rules', 'We set up the available parameters, approval limits, rules and policies, and agree with you on what your market needs beyond them.'],
            ['API and payments integration', 'Your platform\'s connection through the Sentinel API and the link to your payment provider are scoped and built with you.'],
            ['Supported operation', 'Your team operates with ours alongside, with agreed goals and regular reviews.']],
  'cta': 'Discuss a pilot'},
 'about': {'head': ['ABOUT RHS LABS', 'Software for regulated<br>betting operations.', 'RHS Labs builds Sentinel, the PAM and back-office for regulated operators. It is designed around accountable work: permissions, approvals and a record of each decision.', 'See how a pilot works'],
  'principles': [['Real workflows first', 'Screens follow how operations, payments and compliance teams work.'], ['Modular by design', 'Start with Core; add Payments, Intelligence or Fraud as you grow.'], ['Accountable by default', 'Permissions, four-eyes approvals and an audit trail, built in.']],
  'brandline': 'PAM and back-office<br>for regulated operators.'},
 'contact': {'head': ['GET IN TOUCH', 'See Sentinel with<br>your own use cases.', 'Tell us about your operation and jurisdiction. We will walk you through the back-office with synthetic data and discuss a pilot.'],
  'sales': 'Talk to our team', 'salessub': 'A walkthrough of the back-office for your team, with synthetic data.',
  'emailnote': 'Each button opens your email application with a short template to complete. This website does not send messages; please do not include player personal data.'},
 'cta': {'demo': 'Request a demo', 'demo_short': 'Request a demo', 'pilot': 'Discuss a pilot', 'opens': '(opens your email application)',
  'mail': {'demo': ['Sentinel demo request', 'I would like a demo of RHS Labs Sentinel.'], 'pilot': ['Sentinel pilot program', 'We would like to discuss a Sentinel pilot.']},
  'fields': ['Company:', 'Jurisdiction(s):', 'Approximate volume (active players or monthly transactions):', 'Modules of interest (Core, Payments, Intelligence, Fraud):'],
  'greeting': 'Hello RHS Labs team,', 'privacy': 'Please do not include player personal data in this email.'},
 'footer': {'tagline': 'PAM and back-office for regulated operators.', 'nav': ['Platform', 'Modules', 'Payments', 'Compliance', 'Security', 'Pilot', 'Company'], 'nav_label': 'Footer',
  'notice': {'available': 'Sentinel is available for pilot programs; scope and availability are confirmed in commercial discussions.',
             'concept': 'The dashboards at the top of the page are concept illustrations with simulated data, not the current product.',
             'product': 'Product screens show synthetic data from a test environment.'},
  'privacy': 'Privacy & inquiries', 'privacynote': 'This static website has no inquiry form or analytics tracker. Only your language preference is stored in this browser. Email links open your own email app; please do not share player personal data. Organizational and data-handling details are confirmed before any pilot.'},
},
'es': {
 'module': 'Módulo',
 'tour': {'head': ['EL BACK-OFFICE', 'Todos los equipos operativos.<br><em>Un solo back-office.</em>', 'Siete áreas cubren el trabajo diario de un operador regulado: cuentas de jugadores, pagos, riesgo, relación con el jugador, cumplimiento, informes y administración.'],
  'tablist': 'Áreas del back-office', 'screens': 'Pantallas de esta área',
  'tabs': [
   {'label': 'Jugadores', 'title': 'Encuentre a cualquier jugador. Vea la cuenta en un mismo lugar.',
    'bullets': ['Búsqueda rápida y siete criterios combinables, con hasta 200 resultados por página.', 'Player 360 en ocho áreas: resumen, KYC, pagos, billetera, riesgo, límites, juego e historial.', 'Datos de identidad y de contacto enmascarados por defecto; quien tiene permiso los revela campo por campo, indicando un motivo.', 'Notas, etiquetas, segmentos y gestor VIP en el perfil.'],
    'screens': [['Búsqueda', 'Búsqueda rápida y avanzada'], ['Player 360', 'La cuenta en ocho áreas'], ['Cola KYC', 'Documentos pendientes'], ['Juego responsable', 'Autoexclusiones, pausas y límites'], ['Solicitudes de titulares de datos', 'Solicitudes de privacidad por plazo']],
    'more': 'Dentro del Player 360', 'alt': 'Back-office Sentinel: el área de pagos del Player 360 de un jugador sintético.'},
   {'label': 'Pagos', 'title': 'Retiros bajo control, de la solicitud al pago.',
    'bullets': ['Una cola de retiros que señala cada solicitud que supera su objetivo de tiempo de atención.', 'Límites de aprobación por rol y categoría de jugador, con un segundo aprobador a partir del umbral.', 'Pagos entrantes no conciliados, vinculados a un jugador o devueltos al pagador, cada uno aprobado por una segunda persona.', 'Búsqueda en el libro de movimientos de todos los jugadores, con totales y exportación a CSV.'],
    'screens': [['Retiros', 'Cola y pasos de decisión'], ['Transacciones', 'Libro de movimientos y CSV'], ['Conciliación', 'Pagos entrantes no conciliados'], ['Ajustes en lote', 'Lotes CSV con aprobación'], ['Límites de caja', 'Límites de pago del operador'], ['Límites de aprobación', 'Quién aprueba cuánto']],
    'more': 'Pagos en detalle', 'alt': 'Back-office Sentinel: cola de retiros con solicitudes sintéticas.'},
   {'label': 'Riesgo y fraude', 'title': 'De la alerta al caso resuelto.',
    'bullets': ['Cola de alertas con filtros, asignación a uno mismo o a un colega, y cierre masivo por causa raíz.', 'Casos con triaje, reasignación, retiros vinculados y cierre por causa raíz.', 'Reglas con número de disparos y tasa de falsos positivos; el editor exige una simulación antes de proponer un cambio, y se necesita un segundo aprobador para poner en vigor una regla de bloqueo.', 'Puntos de fraude por jugador, ajustes manuales con motivo y solicitudes de exención de reglas que decide una segunda persona.'],
    'screens': [['Alertas', 'Cola, asignación y resolución'], ['Casos', 'Espacio de investigación'], ['Reglas', 'Métricas, editor y disparos'], ['Aprobaciones', 'Decisiones de cuatro ojos']],
    'more': '', 'alt': 'Back-office Sentinel: cola de alertas con alertas sintéticas.'},
   {'label': 'Bonos y CRM', 'title': 'Campañas de bonos dirigidas a segmentos guardados.',
    'bullets': ['Segmentos creados con reglas y grupos, versionados, con un recuento de cuentas que puede hacer antes de guardar.', 'Bloqueos o desbloqueos masivos para un segmento guardado o una lista de jugadores, con vista previa; por encima de un umbral de cuentas, los aprueba una segunda persona.', 'Cartera VIP: un gestor para cada jugador VIP, con restricciones de contacto.', 'Tickets de atención y plantillas de CRM aprobadas por alguien distinto de su autor.'],
    'screens': [['Segmentos', 'Reglas, grupos y conteos'], ['Bonos', 'Campañas y audiencias'], ['Acciones masivas', 'Vista previa y ejecución'], ['Cartera VIP', 'Gestores de cuenta'], ['Tickets de atención', 'Seguimiento de atención al cliente'], ['Plantillas de CRM', 'Borradores y aprobación de cuatro ojos']],
    'more': '', 'alt': 'Back-office Sentinel: lista de segmentos sintéticos.'},
   {'label': 'Cumplimiento', 'title': 'Controles de cumplimiento integrados en el trabajo diario.',
    'bullets': ['Informe de auditoría de las acciones del equipo, filtrable por jugador, exportable a CSV, XML o Excel, con verificación de integridad en un clic.', 'Juego responsable: autoexclusiones, pausas y límites, incluidas solicitudes recibidas por teléfono o chat.', 'Solicitudes de titulares de datos, con seguimiento de su plazo.', 'Catálogo de versiones de políticas y términos con su fecha de vigencia, y la aceptación de cada jugador registrada.'],
    'screens': [['Informe de auditoría', 'Quién hizo qué y cuándo'], ['Juego responsable', 'Solicitudes y exclusiones'], ['Cola KYC', 'Documentos pendientes'], ['Solicitudes de titulares de datos', 'Plazos de privacidad'], ['Políticas y términos', 'Versiones y fechas de vigencia'], ['Jurisdicción', 'Parámetros y zona horaria']],
    'more': 'Cumplimiento y control', 'alt': 'Back-office Sentinel: informe de auditoría con registros sintéticos.'},
   {'label': 'Informes', 'title': 'Cifras de finanzas, riesgo y operaciones en una sola página.',
    'bullets': ['Resumen financiero del operador, incluido el saldo adeudado a los jugadores al cierre del día anterior.', 'Margen del casino por categoría de juego, saldos negativos por causa y antigüedad, y bloqueos activos por origen.', 'Tiempos de pago de los retiros y estado de las tareas programadas.', 'Productividad del equipo, exportable en CSV.'],
    'screens': [['Informes', 'Finanzas, riesgo y operaciones']],
    'more': '', 'alt': 'Back-office Sentinel: informes con totales sintéticos del operador.'},
   {'label': 'Administración', 'title': 'Acceso por rol. Cambios registrados.',
    'bullets': ['Cinco roles del equipo formados por permisos granulares, reflejados en menús y pantallas, y aplicados por la API.', 'Límites de aprobación por rol y categoría, y límites de caja del operador.', 'Catálogo de etiquetas, objetivos de tiempo de atención y parámetros de jurisdicción.', 'Cambios administrativos registrados en la auditoría.'],
    'screens': [['Usuarios y roles', 'Acceso del equipo y permisos'], ['Límites de aprobación', 'Niveles por categoría'], ['Etiquetas', 'Etiquetas de cuenta'], ['Objetivos de SLA', 'Metas de tiempo de atención']],
    'more': 'Seguridad e integración', 'alt': 'Back-office Sentinel: límites de aprobación por rol y categoría de jugador.'},
  ]},
 'modules': {'head': ['MÓDULOS', 'Cuatro módulos.<br><em>Empiece por lo que necesita.</em>', 'Core cubre las cuentas de jugadores, el cumplimiento y la administración; Payments, Intelligence y Fraud lo amplían. Elija el alcance adecuado para su operación.'],
  'cards': [['Core', 'Búsqueda de jugadores, Player 360, KYC, juego responsable, cumplimiento y administración.'],
            ['Payments', 'Cola de retiros y aprobaciones, límites, pagos entrantes no conciliados, ajustes en lote y libro de movimientos.'],
            ['Intelligence', 'Informes y segmentos: el saldo adeudado a los jugadores, márgenes, saldos negativos, bloqueos y estado de las tareas programadas.'],
            ['Fraud', 'Alertas, casos, reglas, puntos de fraude y aprobaciones de cuatro ojos.']],
  'complete': 'Los cuatro módulos: Core, Payments, Intelligence y Fraud.', 'link': 'Ver {name}'},
 'p360': {'head': ['PLAYER 360', 'Un perfil.<br><em>Decisiones en contexto.</em>', 'El Player 360 reúne la identidad, el dinero, el riesgo y el historial de una cuenta, y permite que su equipo realice muchas acciones sin salir del perfil.'],
  'label': 'Partes del Player 360', 'alt': 'Back-office Sentinel: resumen del Player 360 de un jugador sintético, con marcadores numerados en las partes descritas al lado.',
  'points': [['Franja de identidad', 'Estado KYC, bloqueos, etiquetas de riesgo y antigüedad de la cuenta, en la parte superior de cada área.'],
             ['Indicadores financieros', 'Nueve indicadores de depósitos, retiros, depósitos netos, bonos, ingresos y saldo, encima de cada área.'],
             ['Retiros pendientes', 'Los cinco más antiguos pueden resolverse desde el perfil, con los mismos pasos y reglas de cuatro ojos que en la cola.'],
             ['Alertas', 'Alertas abiertas en el resumen y alertas manuales creadas desde el perfil.'],
             ['Historial y auditoría', 'Cambios de estado, categoría, KYC, límites, bloqueos y ajustes de saldo, antes y después, con quién los hizo y el motivo indicado.']]},
 'payments': {'head': ['PAGOS', 'Cuatro ojos en cada retiro<br><em>a partir de su umbral.</em>', 'Los retiros recorren estados explícitos. Los límites por rol y categoría de jugador definen quién puede aprobar, y una segunda persona aprueba a partir del umbral.'],
  'items': [['Objetivo de tiempo de atención', 'Cada solicitud muestra cuánto lleva esperando y se señala al superar su objetivo; un informe mide el tiempo hasta el pago.'],
            ['Niveles de aprobación', 'Cada rol que aprueba tiene su propio límite; a partir del umbral de la categoría, otra persona da la segunda aprobación.'],
            ['Límites de caja', 'Monto mínimo y máximo por depósito y por retiro, y un número máximo de retiros por período, por categoría de jugador.'],
            ['Pagos no conciliados', 'Los pagos entrantes que no coinciden con ningún depósito se vinculan a un jugador o se devuelven al pagador a través del portal del proveedor de pagos; una persona hace la solicitud y otra la aprueba.'],
            ['Ajustes en lote', 'Créditos y débitos para hasta 200 cuentas a partir de un CSV, con vista previa línea por línea y aprobación de otra persona.'],
            ['Búsqueda y exportación', 'Búsqueda en el libro de movimientos por ID o referencia del proveedor de pagos, con exportación de hasta 5000 filas a CSV.']],
  'flow_title': 'Estados de un retiro', 'flow_note': 'Los estados que recorre un retiro en el back-office. La segunda aprobación se aplica a partir del umbral de la categoría.',
  'flow': {'requested': 'Solicitado', 'verifying': 'En verificación', 'in_review': 'En revisión', 'approved': 'Aprobado', 'second_approval': 'Segunda aprobación', 'sent': 'Enviado', 'confirmed': 'Confirmado',
           'held': 'Retenido', 'rejected': 'Rechazado', 'failed': 'Fallido', 'reversed': 'Revertido'},
  'side': 'Otros estados', 'alt': 'Back-office Sentinel: un retiro sintético con sus pasos de aprobación.'},
 'compliance': {'head': ['CUMPLIMIENTO Y CONTROL', 'Controles trazables<br><em>que puede revisar.</em>', 'Juego responsable, KYC, privacidad y aceptación de políticas están en el mismo back-office que la operación, con registro de los cambios que hace el equipo.'],
  'items': [['Registro de auditoría', 'Quién hizo qué y cuándo, antes y después, con exportaciones, verificación de integridad de la cadena de hashes y registro manual de incidentes.'],
            ['Juego responsable', 'Autoexclusiones, pausas y límites, incluidas solicitudes registradas por un agente.'],
            ['Cola KYC', 'Documentos pendientes, con el tiempo de espera medido frente a su objetivo; cada verificación se aprueba o se rechaza indicando el motivo.'],
            ['Solicitudes de titulares de datos', 'Solicitudes de privacidad, con seguimiento de su plazo.'],
            ['Políticas y términos', 'Catálogo de versiones con su fecha de vigencia, y la aceptación de cada jugador registrada.'],
            ['Parámetros de jurisdicción', 'Configuración regulatoria, incluida la zona horaria de operación, publicada por personal autorizado.'],
            ['Permisos por rol', 'Cada pantalla y acción ligada a un permiso, otorgado mediante cinco roles del equipo.']]},
 'intelligence': {'head': ['INTELIGENCIA CONECTADA', 'Señales con contexto,<br><em>no veredictos.</em>', 'Sentinel reúne las señales alrededor de una cuenta —pagos, alertas, puntos de fraude, KYC y juego responsable— para que su equipo decida con contexto.'],
  'center': 'Cuenta', 'nodes': ['Pagos', 'Alertas', 'Puntos de fraude', 'KYC', 'Juego responsable', 'Auditoría'],
  'note': 'Diagrama conceptual. Una señal por sí sola nunca decide: deciden su equipo y sus políticas.', 'title': 'Señales alrededor de una cuenta'},
 'security': {'head': ['SEGURIDAD E INTEGRACIÓN', 'Diseñado API-first.<br><em>Protegido en el servidor.</em>', 'El equipo trabaja en el navegador; solo el servidor puede leer su sesión y sus tokens, y la autorización se verifica en el servidor y en la API.'],
  'items': [['API-first', 'Cada pantalla lee y escribe mediante la API de Sentinel.'],
            ['Cookie de sesión sellada', 'Una cookie cifrada y HttpOnly que solo el servidor del back-office puede abrir; los tokens de acceso nunca son legibles en el navegador.'],
            ['Acceso mediante un proveedor de identidad', 'El equipo inicia sesión mediante OpenID Connect; el back-office nunca ve una contraseña.'],
            ['Separación entre operadores', 'La API está diseñada para restringir cada solicitud al operador de quien la realiza y para autorizarla.'],
            ['Datos de identidad y de contacto enmascarados', 'Nombre, correo electrónico, teléfono, documento de identidad, fecha de nacimiento, género y dirección se enmascaran por defecto; revelar uno requiere un permiso y un motivo, y queda registrado.']],
  'arch': [['Navegador del personal', 'Sin tokens legibles'], ['Servidor del back-office', 'Sesión sellada, permisos'], ['API de Sentinel', 'Autorización, auditoría'], ['Proveedor de identidad', 'Acceso del personal']], 'arch_title': 'El recorrido de una solicitud'},
 'pilot': {'head': ['PROGRAMA PILOTO', 'Cómo funciona un piloto,<br><em>paso a paso.</em>', 'Un piloto se define en torno a su jurisdicción y su flujo de pagos, a partir de lo que el producto admite hoy, y nuestro equipo trabaja junto al suyo.'],
  'steps': [['Descubrimiento', 'Mapeamos su operación, su jurisdicción, los roles de su equipo y los módulos incluidos en el alcance.'],
            ['Jurisdicción y reglas', 'Configuramos los parámetros disponibles, los límites de aprobación, las reglas y las políticas, y acordamos con usted lo que su mercado requiera más allá de ellos.'],
            ['Integración por API y pagos', 'La conexión de su plataforma mediante la API de Sentinel y la conexión con su proveedor de pagos se definen y se construyen con usted.'],
            ['Operación acompañada', 'Su equipo opera con el apoyo del nuestro, con objetivos acordados y revisiones periódicas.']],
  'cta': 'Conversar sobre un piloto'},
 'about': {'head': ['ACERCA DE RHS LABS', 'Software para operaciones<br>de apuestas reguladas.', 'RHS Labs desarrolla Sentinel, el PAM y back-office para operadores regulados. Está diseñado en torno a un trabajo trazable: permisos, aprobaciones y un registro de cada decisión.', 'Cómo funciona un piloto'],
  'principles': [['Primero, los flujos reales', 'Las pantallas siguen la forma de trabajar de los equipos de operaciones, pagos y cumplimiento.'], ['Modular por diseño', 'Empiece con Core y sume Payments, Intelligence o Fraud a medida que crezca.'], ['Trazable por defecto', 'Permisos, aprobaciones de cuatro ojos y registro de auditoría integrados.']],
  'brandline': 'PAM y back-office<br>para operadores regulados.'},
 'contact': {'head': ['CONTACTO', 'Vea Sentinel con<br>sus propios casos de uso.', 'Cuéntenos sobre su operación y su jurisdicción. Le mostraremos el back-office con datos sintéticos y conversaremos sobre un piloto.'],
  'sales': 'Hable con nuestro equipo', 'salessub': 'Un recorrido por el back-office para su equipo, con datos sintéticos.',
  'emailnote': 'Cada botón abre su aplicación de correo con una breve plantilla para completar. Este sitio no envía mensajes; no incluya datos personales de jugadores.'},
 'cta': {'demo': 'Solicitar una demostración', 'demo_short': 'Solicitar demo', 'pilot': 'Conversar sobre un piloto', 'opens': '(abre su aplicación de correo)',
  'mail': {'demo': ['Solicitud de demostración de Sentinel', 'Me gustaría ver una demostración de RHS Labs Sentinel.'], 'pilot': ['Programa piloto de Sentinel', 'Nos gustaría conversar sobre un piloto de Sentinel.']},
  'fields': ['Empresa:', 'Jurisdicción(es):', 'Volumen aproximado (jugadores activos o transacciones mensuales):', 'Módulos de interés (Core, Payments, Intelligence, Fraud):'],
  'greeting': 'Hola, equipo de RHS Labs:', 'privacy': 'Por favor, no incluya datos personales de jugadores en este correo.'},
 'footer': {'tagline': 'PAM y back-office para operadores regulados.', 'nav': ['Plataforma', 'Módulos', 'Pagos', 'Cumplimiento', 'Seguridad', 'Piloto', 'Empresa'], 'nav_label': 'Pie de página',
  'notice': {'available': 'Sentinel está disponible para programas piloto; el alcance y la disponibilidad se confirman en las conversaciones comerciales.',
             'concept': 'Los paneles de la parte superior son ilustraciones conceptuales con datos simulados, no el producto actual.',
             'product': 'Las pantallas del producto muestran datos sintéticos de un entorno de pruebas.'},
  'privacy': 'Privacidad y consultas', 'privacynote': 'Este sitio estático no tiene formularios de consulta ni herramientas de analítica. Solo guarda su preferencia de idioma en este navegador. Los enlaces de correo abren su propia aplicación de correo; por favor, no comparta datos personales de jugadores. Los detalles organizativos y de tratamiento de datos se confirman antes de cualquier piloto.'},
},
}
FOOTER_LINKS = ['#platform', '#modules', '#payments', '#compliance', '#security', '#pilot', '#company']


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


def module_tag(t, module):
 name = {'core': 'Core', 'payments': 'Payments', 'intelligence': 'Intelligence', 'fraud': 'Fraud'}[module]
 return f'<span class="rhs-module rhs-module-{module}"><b>{t["module"]}</b> {name}</span>'


def tour(t, n):
 c = t['tour']
 tabs, panels = [], []
 for i, (spec, copy) in enumerate(zip(TOUR, c['tabs'])):
  key, on = spec['key'], i == 0
  tabs.append(f'<button type="button" role="tab" class="rhs-tour-tab" id="tour-tab-{key}" aria-controls="tour-{key}" aria-selected="{str(on).lower()}" tabindex="{0 if on else -1}">{icon(spec["icon"])}<span>{copy["label"]}</span></button>')
  bullets = ''.join(f'<li>{icon("check")}<span>{b}</span></li>' for b in copy['bullets'])
  more = f'<a class="rhs-more" href="{spec["more"]}">{copy["more"]} {icon("arrow")}</a>' if spec['more'] and copy['more'] else ''
  screens = ''.join(f'<li>{icon(ic)}<b>{name}</b><small>{desc}</small></li>' for (ic, _), (name, desc) in zip(spec['screens'], copy['screens']))
  phone = spec['phone'] if spec['phone'] and captured(spec['phone']) else None
  shot = frame(picture(spec['shot'], copy['alt'], phone=phone), 'rhs-frame-phone' if phone else '') if captured(spec['shot']) else ''
  visual = shot + f'<div class="rhs-screens"><p class="rhs-screens-title" id="tour-screens-{key}">{c["screens"]}</p><ul aria-labelledby="tour-screens-{key}">{screens}</ul></div>'
  hidden = '' if on else ' hidden'
  panels.append(f'<div class="rhs-tour-panel" role="tabpanel" id="tour-{key}" aria-labelledby="tour-tab-{key}" tabindex="0"{hidden}><div class="rhs-tour-copy">{module_tag(t, spec["module"])}<h3>{copy["title"]}</h3><ul class="rhs-ticks">{bullets}</ul>{more}</div><div class="rhs-tour-visual">{visual}</div></div>')
 return f'''<section id="platform" class="rhs-sector rhs-tour-sector" data-sector="{n}"><div class="wrap"><div class="rhs-section-heading">{intro(n, c['head'])}</div><div class="rhs-tour" data-tour><div class="rhs-tour-tabs" role="tablist" aria-label="{esc(c['tablist'])}">{''.join(tabs)}</div>{''.join(panels)}</div></div></section>'''


def modules(t, n):
 c = t['modules']
 cards = ''.join(f'<article class="rhs-product"><span class="rhs-icon-box">{icon(ic)}</span><h3>{name}</h3><p>{text}</p><a class="rhs-card-link" href="{href}" aria-label="{esc(c["link"].format(name=name))}">{icon("arrow")}</a></article>' for (key, ic, href), (name, text) in zip(MODULE_CARDS, c['cards']))
 return f'''<section id="modules" class="rhs-sector rhs-products" data-sector="{n}"><div class="wrap"><div class="rhs-products-heading">{intro(n, c['head'])}</div><div class="rhs-product-grid">{cards}</div><p class="rhs-complete"><b>Complete</b> / {c['complete']}</p></div></section>'''


def player360(t, n):
 c = t['p360']
 points = ''.join(f'<li id="p360-{key}"><b class="rhs-num" aria-hidden="true">{i + 1}</b><div><h3>{title}</h3><p>{text}</p></div></li>' for i, (key, (title, text)) in enumerate(zip(P360_POINTS, c['points'])))
 visual = frame(picture(P360_SHOT, c['alt'])) if captured(P360_SHOT) else ''
 return f'''<section id="player-360" class="rhs-sector rhs-p360" data-sector="{n}"><div class="wrap rhs-split">{intro(n, c['head'])}<div class="rhs-p360-visual">{visual}<ol class="rhs-anatomy rhs-anatomy-legend" aria-label="{esc(c['label'])}">{points}</ol></div></div></section>'''


def payments(t, n):
 c = t['payments']
 items = ''.join(f'<li><span class="rhs-mini-icon">{icon(ic)}</span><div><h3>{title}</h3><p>{text}</p></div></li>' for ic, (title, text) in zip(PAYMENT_ICONS, c['items']))
 steps = ''.join(f'<li class="rhs-flow-step{" rhs-flow-optional" if key == "second_approval" else ""}"><span>{c["flow"][key]}</span></li>' for key in FLOW)
 side = ''.join(f'<li>{c["flow"][key]}</li>' for key in FLOW_SIDE)
 flow = f'<figure class="rhs-flow"><figcaption><b>{c["flow_title"]}</b></figcaption><ol class="rhs-flow-steps">{steps}</ol><div class="rhs-flow-side"><b>{c["side"]}</b><ul>{side}</ul></div><p class="rhs-flow-note">{c["flow_note"]}</p></figure>'
 shot = f'<div class="rhs-wide-shot">{frame(picture(PAYMENTS_SHOT, c["alt"]))}</div>' if captured(PAYMENTS_SHOT) else ''
 return f'''<section id="payments" class="rhs-sector rhs-payments-sector" data-sector="{n}"><div class="wrap"><div class="rhs-split">{intro(n, c['head'])}{flow}</div><ul class="rhs-capabilities">{items}</ul>{shot}</div></section>'''


def compliance(t, n):
 c = t['compliance']
 items = ''.join(f'<li><span class="rhs-mini-icon">{icon(ic)}</span><div><h3>{title}</h3><p>{text}</p></div></li>' for ic, (title, text) in zip(COMPLIANCE_ICONS, c['items']))
 return f'''<section id="compliance" class="rhs-sector rhs-compliance" data-sector="{n}"><div class="wrap rhs-split">{intro(n, c['head'])}<ul class="rhs-control-grid">{items}</ul></div></section>'''


def intelligence(t, n):
 c = t['intelligence']
 cx, cy = 280, 175
 edges = ''.join(f'<path d="M{cx} {cy}L{x} {y}"/>' for _, x, y in INTEL_NODES)
 nodes = ''.join(f'<g class="rhs-signal"><circle cx="{x}" cy="{y}" r="27"/><svg x="{x - 11}" y="{y - 11}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">{SHAPES[ic]}</svg><text x="{x}" y="{y + 45}" text-anchor="middle">{esc(label)}</text></g>' for (ic, x, y), label in zip(INTEL_NODES, c['nodes']))
 listed = ''.join(f'<li>{icon(ic)}<span>{label}</span></li>' for (ic, _, _), label in zip(INTEL_NODES, c['nodes']))
 return f'''<section id="intelligence" class="rhs-sector rhs-intelligence" data-sector="{n}"><div class="wrap rhs-split">{intro(n, c['head'])}<figure class="rhs-signal-map"><svg class="rhs-signal-svg" viewBox="0 0 560 350" role="img" aria-labelledby="signals-title signals-desc"><title id="signals-title">{c['title']}</title><desc id="signals-desc">{c['center']}: {', '.join(c['nodes'])}. {c['note']}</desc><g class="rhs-signal-edges">{edges}</g>{nodes}<g class="rhs-signal-center"><circle cx="{cx}" cy="{cy}" r="46"/><svg x="{cx - 13}" y="{cy - 26}" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">{SHAPES['person']}</svg><text x="{cx}" y="{cy + 20}" text-anchor="middle">{esc(c['center'])}</text></g></svg><ul class="rhs-signal-list">{listed}</ul><figcaption>{c['note']}</figcaption></figure></div></section>'''


def security(t, n):
 c = t['security']
 items = ''.join(f'<li><span class="rhs-mini-icon">{icon(ic)}</span><div><h3>{title}</h3><p>{text}</p></div></li>' for ic, (title, text) in zip(SECURITY_ICONS, c['items']))
 browser, server, api, idp = c['arch']
 arch = f'<figure class="rhs-arch"><figcaption>{c["arch_title"]}</figcaption><ol><li><b>{browser[0]}</b><small>{browser[1]}</small></li><li><b>{server[0]}</b><small>{server[1]}</small></li><li><b>{api[0]}</b><small>{api[1]}</small></li></ol><p class="rhs-arch-idp"><b>{idp[0]}</b><small>{idp[1]}</small></p></figure>'
 return f'''<section id="security" class="rhs-sector rhs-security" data-sector="{n}"><div class="wrap rhs-split">{intro(n, c['head'])}<div class="rhs-security-visual">{arch}<ul class="rhs-control-grid rhs-security-list">{items}</ul></div></div></section>'''


def pilot(t, n):
 c = t['pilot']
 steps = ''.join(f'<li class="rhs-step"><span class="rhs-round-icon">{icon(ic)}</span><b class="rhs-step-number">0{i + 1}</b><h3>{title}</h3><p>{text}</p></li>' for i, (ic, (title, text)) in enumerate(zip(PILOT_ICONS, c['steps'])))
 return f'''<section id="pilot" class="rhs-sector rhs-process" data-sector="{n}"><span id="use-cases" class="rhs-anchor"></span><span id="how" class="rhs-anchor"></span><div class="wrap rhs-split"><div class="rhs-sector-copy">{kicker(n, c['head'][0])}<h2>{c['head'][1]}</h2><p>{c['head'][2]}</p>{cta_link(t['lang'], 'pilot')}</div><ol class="rhs-steps">{steps}</ol></div></section>'''


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
 """Sectors 02–11 and the footer. The single footer notice says what the page's images are."""
 t = dict(COPY[lang], lang=lang)
 sectors = [tour(t, 2), modules(t, 3), player360(t, 4), payments(t, 5), compliance(t, 6),
            intelligence(t, 7), security(t, 8), pilot(t, 9), about(t, 10), contact(t, 11)]
 html = '\n'.join(sectors)
 shown = any(captured(name) for name in [spec['shot'] for spec in TOUR] + [P360_SHOT, PAYMENTS_SHOT])
 notice = ['available'] + (['concept'] if hero_kind == 'concept' else []) + (['product'] if shown or hero_kind == 'product' else [])
 return '<div class="rhs-content">\n' + html + '\n' + footer(t, languages, notice) + '\n</div>'

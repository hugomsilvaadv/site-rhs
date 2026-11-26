// What to capture from the back-office: one entry per website image. Routes must be real menu
// screens (checked by --dry-run against src/config/navigation.ts); ids come from the mock fixtures,
// which hold synthetic data only. Desktop captures are 1600×1000 CSS px at 2×, phones 390×844 at 2×,
// and the hero copies keep the approved 1586×992 frame.
//
// Derived from the back-office source on 2026-11-26 without running it (the private design-system
// package was not installable): selectors, ids and crops must be confirmed on the first real run,
// and every image is reviewed on the contact sheet before it is committed. Nothing here edits the product:
// captures only crop or hide (never rewrite) what must not reach the website.
export const DESKTOP = { width: 1600, height: 1000 };
export const MOBILE = { width: 390, height: 844 };
export const HERO = { width: 1586, height: 992 };
// Where the website expects each image: the placeholder and the capture share the path and the proportion.
export const PRODUCT_DIR = 'assets/product';
export const HERO_DIR = 'assets/hero';
export const CONTEXT = { locale: 'en-US', timezoneId: 'America/Sao_Paulo' };

const PLAYER = '00000000-0000-4000-8000-000000000001';
const SECOND_APPROVAL = '00000000-0000-4000-8000-000000000104';
const CASE = '00000000-0000-4000-8000-000000000500';
// Multi-account, device, IP and linked-account signals are out of the website's scope: never shown.
// Matched by neutral fragments of the UI text (labels and values are hidden together).
const OUT_OF_SCOPE = ['Same document on another player', 'Several accounts on the same device', 'IP in a VPN or proxy list', 'Linked accounts with the same bonus', 'Integration not enabled', 'Multi-account signals', 'Device:', 'Links', 'Last decision', "Engine's last decision", 'tables by period'];

// Cookies are set before the first request: English UI and the design system's dark theme.
export async function prepareContext(context, base) {
  await context.addCookies([{ name: 'ginga_locale', value: 'en', url: base }, { name: 'ginga_theme', value: 'dark', url: base }]);
}

// The fake identity provider of `next dev` (AUTH_PROVIDER=fake). /auth/fake itself is never captured.
export async function signIn(page, base) {
  await page.goto(base + '/auth/login?returnTo=%2Fbackoffice', { waitUntil: 'domcontentloaded', timeout: 300000 });
  await page.locator('a[href*="code=admin&"]').click();
  await page.waitForURL(url => url.pathname.startsWith('/backoffice/'), { timeout: 300000 });
}

// Error or empty states reported on the contact sheet for review.
export const errorPhrases = async () => ['did not load', 'Something went wrong', 'Try again', 'Nothing found', 'No results'];

// Applied to every capture: the Next.js dev overlay and the header search placeholder (it names a
// national id) are hidden; the first header row (brand label, time-zone and mock badges) is cropped
// unless a screen needs it.
export const CAPTURE_CSS = 'nextjs-portal{display:none!important}input::placeholder{color:transparent!important}';

export const screens = [
  { name: 'player-360-summary', path: `/backoffice/players/${PLAYER}`, hero: true, ready: 'section[aria-labelledby="player-strip-title"]', hide: OUT_OF_SCOPE,
    // Numbered markers drawn into the capture, matching the five parts described in the Player 360 section.
    markers: { identity: 'section[aria-labelledby="player-strip-title"]', money: page => page.getByText('Net deposits').first(), withdrawals: page => page.getByRole('heading', { name: /Pending withdrawals/ }).first(), alerts: page => page.getByRole('heading', { name: /Open alerts/ }).first(), history: page => page.getByRole('heading', { name: /Latest changes/ }).first() },
    review: 'Strip, money cards and Summary; no Links row, no rule-engine score, no out-of-scope product mention; masked data only. The strip\'s document type names the local national id: hide or crop it.' },
  { name: 'player-360-summary-mobile', path: `/backoffice/players/${PLAYER}`, viewport: 'mobile', ready: 'section[aria-labelledby="player-strip-title"]', hide: OUT_OF_SCOPE, review: 'Viewport only; strip and money cards. The strip\'s document type names the local national id: hide or crop it.' },
  { name: 'player-360-payments', path: `/backoffice/players/${PLAYER}?tab=payments`, ready: 'h2, h3', hide: [...OUT_OF_SCOPE, 'Score'], review: 'Pending withdrawal card with Approve / Reject / Hold; check the payment-method column and crop the Score column.' },
  { name: 'withdrawals-queue', path: '/backoffice/withdrawals', hero: true, ready: 'table tbody tr', hide: OUT_OF_SCOPE, review: 'Queue with ages against the target and the selected row aside; the out-of-scope integration row of Player context must be hidden.' },
  { name: 'withdrawals-queue-mobile', path: '/backoffice/withdrawals', viewport: 'mobile', ready: 'h1', hide: OUT_OF_SCOPE, review: 'Viewport only.' },
  { name: 'withdrawal-detail', path: `/backoffice/withdrawals/${SECOND_APPROVAL}`, ready: 'h1', hide: OUT_OF_SCOPE, review: 'Second-approval state with the Decision panel and the four-eyes notice. Never confirm a decision.' },
  { name: 'approval-limits', path: '/backoffice/approval-limits', ready: 'table', review: 'Limits per role and second approval per category (platform defaults).' },
  { name: 'cashier-limits', path: '/backoffice/cashier-limits', ready: 'table', hide: ['CASHIER_LIMITS_ENFORCED'], review: 'Starts empty in mock; the badge names an internal variable (hidden).' },
  { name: 'reconciliation', path: '/backoffice/reconciliation?tab=pending', ready: 'h1', review: 'Names a local payment rail and its transaction ids throughout: decide crop or skip at review.' },
  { name: 'adjustment-batches', path: '/backoffice/adjustment-batches?tab=pending', ready: 'table', review: 'Pending batch with Approve / Reject; never decide.' },
  { name: 'transactions', path: '/backoffice/transactions', ready: 'table tbody tr', review: 'Totals and ledger rows; the date hint names a local time zone.' },
  { name: 'alerts', path: '/backoffice/alerts?ruleCode=payee_mismatch&selected=00000000-0000-4000-8000-000000000902', ready: 'h1', hide: OUT_OF_SCOPE, review: 'Filtered to an in-scope rule; no multi-account, device or IP rule names.' },
  { name: 'alerts-mobile', path: '/backoffice/alerts?ruleCode=payee_mismatch&selected=00000000-0000-4000-8000-000000000902', viewport: 'mobile', ready: 'h1', hide: OUT_OF_SCOPE, review: 'Viewport only.' },
  { name: 'case-detail', path: `/backoffice/cases/${CASE}`, ready: 'h1', review: 'Sparse in mock (ids, empty linked withdrawals).' },
  { name: 'rules', path: '/backoffice/rules', ready: 'table', hide: ['dup_document', 'registration_burst', 'device_multi_account', 'vpn_proxy', 'card_multi_account', 'opposite_bets', 'bonus_linked_accounts', 'linked_blocked_account', 'country_mismatch'], review: 'Out-of-scope rules hidden; consider the Edit dialog with Simulate instead.' },
  { name: 'approvals', path: '/backoffice/approvals', ready: 'h1', review: 'Four-eyes queue; check the scope footer for a national-id term; never confirm.' },
  { name: 'reports', path: '/backoffice/reports?days=7', hero: true, ready: '#operator-financial-title', hide: ['unavailable does not mean zero'], review: 'Margin, operator financial summary with liability, routine health; legal citations and time-zone mentions to check.' },
  { name: 'reports-mobile', path: '/backoffice/reports?days=7', viewport: 'mobile', ready: '#operator-financial-title', hide: ['unavailable does not mean zero'], review: 'Viewport only.' },
  { name: 'audit', path: '/backoffice/audit', ready: 'table tbody tr', review: 'Audit table; synthetic actor names; the date hint names a local time zone.' },
  { name: 'segments', path: '/backoffice/segments', ready: 'h1', review: 'Segment names are in Portuguese and name a country: decide at review.' },
  { name: 'bonus', path: '/backoffice/bonus', ready: 'table', review: 'Templates and campaigns; Portuguese names.' },
  { name: 'vip-portfolio', path: '/backoffice/vip-portfolio', ready: 'h1', review: 'Synthetic staff names.' },
  { name: 'service-tickets', path: '/backoffice/service-tickets', ready: 'h1', review: 'Complaint texts are Portuguese.' },
  { name: 'kyc', path: '/backoffice/kyc', ready: 'table', hide: ['business and legal decision'], review: 'The KYC levels card names local identity documents: decide crop at review. The queue\'s scope note (document review pending a business and legal decision) is hidden: the website describes check decisions only.' },
  { name: 'responsible-gaming', path: '/backoffice/responsible-gaming', ready: '#rg-queue-title', review: 'Overview, closures and the requests queue; never run the routine.' },
  { name: 'data-requests', path: '/backoffice/data-requests', ready: 'h1', review: 'The UI title names a local privacy law: crop the title and tab or skip.' },
  { name: 'policies', path: '/backoffice/policies', ready: 'table', hide: ['POLICY_VERSIONS', 'PLAYER_TERMS_VERSION'], review: 'Catalog of versions; internal variable badge hidden.' },
  { name: 'jurisdiction', path: '/backoffice/jurisdiction', ready: 'table', hide: ['JURISDICTION_PARAMETERS'], review: 'The mock jurisdiction names one country, its currency, its privacy law and local ordinances: likely skip.' },
  { name: 'users', path: '/backoffice/users', ready: 'h1', prepare: async page => { await page.getByRole('tab', { name: 'Roles' }).click(); }, review: 'Roles tab only. The Users tab lists realistic names: never capture it.' },
  { name: 'global-search', path: '/backoffice/withdrawals', keepHeader: true, prepare: async page => { await page.keyboard.press('Control+K'); await page.getByRole('searchbox', { name: 'Global search' }).fill('psp-sim-c1000'); await page.getByText('Enter to search').first().waitFor(); }, review: 'Header kept for the search popover; check the brand label and the time-zone badge.' },
];

// Crops the shell's first header row (brand label, search, time-zone and mock badges) and, on phones,
// the search row under it: the first full-width ancestor of each, measured on the page.
export async function headerCrop(page) {
  return page.evaluate(() => {
    const row = element => { let r = element; while (r && r.getBoundingClientRect().width < innerWidth * 0.9) r = r.parentElement; return r && r !== document.body ? r.getBoundingClientRect().bottom : 0; };
    const brand = document.querySelector('header a[aria-label$=" home"]');
    const search = document.querySelector('[role="searchbox"], input[type="search"]');
    return Math.max(brand ? row(brand) : 0, search && innerWidth < 768 ? row(search) : 0);
  });
}

// Sentinel screens for the website, taken from the RHS demo (fictitious data, confirmed by the owner on
// 2026-11-27) on the owner's computer, logged in by the owner. Personal data and the blocks the website does
// not show were hidden on the page before each screenshot; tools/capture/import.mjs never rewrites an image.
// On every screen the environment selector, the signed-in account and anyone from the team stay hidden, and so do
// country, regulator and place names. Each source PNG (as named in the capture folder) becomes
// assets/product/<name>.webp: desktop sources are 3200×2000 (1600×1000 at 2×), phone sources 780×1688 (390×844
// at 2×). `hero` marks the clean 1586×992 copy for the 3D orbit (assets/hero/<name>.webp), written before the
// badge.
export const DESKTOP = { width: 1600, height: 1000 };
export const MOBILE = { width: 390, height: 844 };
export const HERO = { width: 1586, height: 992 };

export const screens = [
  { name: 'sentinel-alerts', source: 'alerts.png', hero: true, route: 'Alerts › Alerts', review: 'Alert queue as it opens, multi-account alerts included; the Customer column (names) hidden; Portuguese alert names and the currency hidden where possible (decision t).' },
  { name: 'sentinel-alerts-mobile', source: 'alerts-mobile.png', viewport: 'mobile', route: 'Alerts › Alerts', review: 'Phone width; same hidden parts as the desktop alert queue.' },
  { name: 'sentinel-transactions', source: 'transactions.png', hero: true, route: 'Investigate › Transactions', review: 'Username column left out through the cols parameter; the Connections column shown when it fits; amounts and lifetime value visible, the currency hidden where possible (decision t).' },
  { name: 'sentinel-withdrawals', source: 'withdrawals-queue.png', route: 'Investigate › Transactions (Withdrawal filter)', review: 'Withdrawals with their risk; not an approval queue.' },
  { name: 'sentinel-withdrawals-mobile', source: 'withdrawals-queue-mobile.png', viewport: 'mobile', route: 'Investigate › Transactions (Withdrawal filter)', review: 'Phone width; Event, Risk and Amount only; the amount visible, the currency (BRL, R$) hidden where possible (decision t).' },
  { name: 'sentinel-transaction-detail', source: 'withdrawal-detail.png', route: 'Transaction detail', review: 'Withdrawal in the manual queue. The first-round file has the multi-account verdict, the IP map and the "Remote access" reason blanked; the second round (RHS-062) shows the verdict and the reason, with the map hidden. Either way: IP addresses, cookie and fingerprint values (hashes), personal data and any place name hidden.' },
  { name: 'sentinel-alert-detail', source: 'case-detail.png', route: 'Alert detail', review: 'Event data and review steps. The first-round file has the multi-account block, the fired rules, the Links tab and the name blanked; the second round (RHS-062) shows the block, the fired rules and the Links tab label. Either way: IP addresses, cookie and fingerprint values and personal data hidden.' },
  { name: 'sentinel-rules', source: 'rules.png', hero: true, route: 'Rules › Basic', review: 'Top of the basic rules: packages and categories, multi-accounting included; any category naming a country or regulator hidden.' },
  { name: 'sentinel-approvals', source: 'approvals.png', route: 'Rules › Approvals', review: 'Empty state; the internal endpoint sentence hidden.' },
  { name: 'sentinel-roles', source: 'users.png', route: 'Team & access › Roles', review: 'Permission matrix by role, never the list of people.' },
  { name: 'sentinel-search', source: 'global-search.png', route: 'Global search (Ctrl+K)', review: 'Search for a neutral English term; no customer names in the results.' },
  { name: 'sentinel-customer', source: 'player-360-summary.png', route: 'Customer file › Record', review: 'Status, KYC, balance and lifetime value visible; name, e-mail, avatar initials, IP addresses, cookie and fingerprint values and the country value hidden; no "CPF" text or "Ver CPF" button; currency hidden where possible (decision t).' },
  { name: 'sentinel-customer-mobile', source: 'player-360-summary-mobile.png', viewport: 'mobile', route: 'Customer file › Record', review: 'Phone width; same hidden parts as the desktop customer file; status, KYC, balance and lifetime value in view.' },
  // Multi-account and device detection may be shown since 2026-11-27 (RHS-062). Personal data, IP addresses and
  // cookie or fingerprint values stay hidden.
  { name: 'sentinel-radar', source: 'radar.png', hero: true, route: 'Radar', review: 'Dashboard; no IP address, cookie or fingerprint value, personal data or place name visible; maps hidden.' },
  { name: 'sentinel-connections', source: 'connections.png', route: 'Investigate › Connections', review: 'Links between accounts, still visible; names, e-mails, IP addresses, cookie and fingerprint values and any place name hidden.' },
  { name: 'sentinel-customer-overview', source: 'customer-overview.png', route: 'Customer file › Overview', review: 'Fraud signals of one customer; name, e-mail, IP addresses, cookie and fingerprint values and any place name hidden; maps hidden.' },
  { name: 'sentinel-customer-links', source: 'customer-links.png', route: 'Customer file › Links', review: 'Linked accounts of one customer, still visible; names, e-mails, IP addresses, cookie and fingerprint values and any place name hidden.' },
];

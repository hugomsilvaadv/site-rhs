// Sentinel screens for the website, taken from the RHS demo (fictitious data, confirmed by the owner on
// 2026-11-27) on the owner's computer, logged in by the owner. Personal data and the blocks the website does
// not show were hidden on the page before each screenshot; tools/capture/import.mjs never rewrites an image.
// Each source PNG (as named in the capture folder) becomes assets/product/<name>.webp: desktop sources are
// 3200×2000 (1600×1000 at 2×), phone sources 780×1688 (390×844 at 2×). `hero` marks the clean 1586×992 copy
// for the 3D orbit (assets/hero/<name>.webp), written before the badge.
export const DESKTOP = { width: 1600, height: 1000 };
export const MOBILE = { width: 390, height: 844 };
export const HERO = { width: 1586, height: 992 };

export const screens = [
  { name: 'sentinel-alerts', source: 'alerts.png', hero: true, route: 'Alerts › Alerts', review: 'Alert queue; the Customer column and the Connections menu item hidden.' },
  { name: 'sentinel-alerts-mobile', source: 'alerts-mobile.png', viewport: 'mobile', route: 'Alerts › Alerts', review: 'Phone width; same hidden parts as the desktop alert queue, including the Portuguese alert name where possible (decision t).' },
  { name: 'sentinel-transactions', source: 'transactions.png', hero: true, route: 'Investigate › Transactions', review: 'Connections and Username columns left out through the column picker.' },
  { name: 'sentinel-withdrawals', source: 'withdrawals-queue.png', route: 'Investigate › Transactions (Withdrawal filter)', review: 'Withdrawals with their risk; not an approval queue.' },
  { name: 'sentinel-withdrawals-mobile', source: 'withdrawals-queue-mobile.png', viewport: 'mobile', route: 'Investigate › Transactions (Withdrawal filter)', review: 'Phone width; Event, Risk and Amount only; the currency (BRL, R$) hidden where possible (decision t).' },
  { name: 'sentinel-transaction-detail', source: 'withdrawal-detail.png', route: 'Transaction detail', review: 'Withdrawal in the manual queue, with its multi-account verdict and IP map (RHS-062); IP addresses, hashes, personal data and any city or country name hidden.' },
  { name: 'sentinel-alert-detail', source: 'case-detail.png', route: 'Alert detail', review: 'Event data, review steps and the multi-account signals block (RHS-062); IP addresses, cookie and fingerprint values, and personal data hidden.' },
  { name: 'sentinel-rules', source: 'rules.png', hero: true, route: 'Rules › Basic', review: 'Top of the basic rules; out-of-scope categories, the multi-accounting section and the search box hidden.' },
  { name: 'sentinel-approvals', source: 'approvals.png', route: 'Rules › Approvals', review: 'Empty state; the internal endpoint sentence hidden.' },
  { name: 'sentinel-roles', source: 'users.png', route: 'Team & access › Roles', review: 'Permission matrix by role, never the list of people; one out-of-scope row hidden.' },
  { name: 'sentinel-search', source: 'global-search.png', route: 'Global search (Ctrl+K)', review: 'Search for a neutral term; the out-of-scope palette entry hidden.' },
  { name: 'sentinel-customer', source: 'player-360-summary.png', route: 'Customer file › Record', review: 'Name, e-mail, device, IP, connections, the Links tab, the right column and the country value hidden; no "CPF" text or "Ver CPF" button visible; currency hidden where possible (decision t); avatar initials remain.' },
  { name: 'sentinel-customer-mobile', source: 'player-360-summary-mobile.png', viewport: 'mobile', route: 'Customer file › Record', review: 'Phone width; same hidden parts as the desktop customer file, the country value and any "CPF" text included.' },
  // Multi-account and device detection may be shown since 2026-11-27 (RHS-062). Personal data, IP addresses and
  // cookie or fingerprint values stay hidden.
  { name: 'sentinel-radar', source: 'radar.png', hero: true, route: 'Radar', review: 'Dashboard; no IP address, personal data, city or country name visible.' },
  { name: 'sentinel-connections', source: 'connections.png', route: 'Investigate › Connections', review: 'Links between accounts; names, e-mails and IP addresses hidden.' },
  { name: 'sentinel-customer-overview', source: 'customer-overview.png', route: 'Customer file › Overview', review: 'Fraud signals of one customer; name, e-mail and IP addresses hidden.' },
  { name: 'sentinel-customer-links', source: 'customer-links.png', route: 'Customer file › Links', review: 'Linked accounts of one customer; names, e-mails and IP addresses hidden.' },
];

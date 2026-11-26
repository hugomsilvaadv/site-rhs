// What to capture from the back-office: one entry per website image. Routes must be real menu
// screens (checked by --dry-run against src/config/navigation.ts); ids come from the mock fixtures,
// which hold synthetic data only. Desktop captures are 1600×1000 CSS px at 2×, phones 390×844 at 2×,
// and the hero copies keep the approved 1586×992 frame.
export const DESKTOP = { width: 1600, height: 1000 };
export const MOBILE = { width: 390, height: 844 };
export const HERO = { width: 1586, height: 992 };

// Filled in from the capture plan (sign-in with the fake provider, mock ids, states).
export const screens = [];

# Sector-by-sector alignment — approved reference

User specification: uploaded Texto colado.txt (new mission), plus attached 667px-wide website reference. The visual direction and exceptions are approved; no new design decision required. Deliver a separate branch, audited Vercel preview and final-approval state. Do not merge or publish production in this round.

Base: requested studio branch 39ef91a, reconciled by merge with actual published main 2e4312c (PR #1 was already merged externally). Earlier blocked-release status is historical.

## Implementation
- [ ] Add failing sector contracts: eight ordered lower sectors, compact product cards, notebook, interpretable graph, paired deposit/withdrawal series and queue, four steps, three control pillars, flat company mark, sales contact and rhs-labs.com canonical.
- [ ] Preserve hero fragment, original hero CSS, images, heading and geometry. Diagnose CSS transitions vs requestAnimationFrame with computed evidence at 320/375/390/430 before any technical change.
- [ ] Replace lower sections with screenshot composition: left headline/right laptop; four product cards; left copy/right semantic network; left copy/right payments chart+queue; left copy/right four-step flow; left copy/right three pillars; left company copy/middle principles/right flat mark; left contact copy/right CTA panel. Use matching navy/teal palette, thin separators, icon badges, compact spacing; no Resources placeholder or separate Use Cases page.
- [ ] Keep EN/ES copy short and honest, global development disclosure and simulated data labels. Reuse working keyboard language/navigation/motion controls.
- [ ] Set canonical domain to the user's explicit https://rhs-labs.com, including hrefLang, OG and sitemap. Use sales@rhs-labs.com mailto with explicit email-app behavior and no simulated backend.
- [ ] Audit screenshots and DOM in 320/375/390/430/768/1024/1280/1440/1920, both languages; all graph edge relationships and queue labels meaningful; no overflow/errors/assets missing.
- [ ] Compare hero default geometry/styles against approved original, static screenshot against preserved baseline; observe mobile continuous motion and reduced-motion/manual selection.
- [ ] Independent auditor, Vercel preview/PR, public-output smoke if network permits; document real limitations and leave approval pending.

Files: tools/render.py and tools/sections.py (static EN/ES composition); site.css (lower-page scope); site.js (retained interactions); site.config.json (canonical); tests/ and docs/web-studio/alignment-evidence/. No framework change or runtime package dependencies.

## Progress
Started from clean checkout. Core branch and published main diverged because prior PR was squash-merged; integrated main into the new studio-based branch without changing main. Existing production source preserved. Original screenshot is a visual reference, not a source for unsupported sales/demo/performance claims.

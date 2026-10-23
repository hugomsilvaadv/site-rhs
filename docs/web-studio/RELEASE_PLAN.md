# RHS Sentinel website release — implementation plan

Goal: deliver the mission supplied on 2026-10-23, preserving the SHA-256 verified V6 hero and replacing the original lower-page narrative with honest EN/ES product marketing.
Architecture: static HTML, scoped lower-page CSS, small progressive-enhancement JavaScript; no framework or backend. Immutable V6 reference remains outside the checkout; extracted image bytes are verified before use.
Spec: user mission in uploaded Texto colado.txt; reference hash 43563210bff41737b38070b32c5c5931af39af2366662d43a5e369f41cd7eecd.
Base: studio/rhs-web-studio-v1 at 39ef91a739f8ac98f27a53ccf79b4aaadc484b14; production baseline e14e2c3f5befade075dfc3009ea63b6fc1ee170c.

## Constraints and decisions
- Preserve V6 hero geometry, CSS, animation math, timings, images and English copy. Translate for ES and provide accessible reduced motion without changing the default visual behavior.
- Retain original site's useful product coverage and corporate contact address, but remove draft legal placeholders and unsupported claims. Email delivery cannot be inferred from a mailto link.
- Approach A: preserve old site and append V6 (low effort, style/content conflict). B: rebuild in a framework (unnecessary dependencies). Selected by coordinator under execution mandate: C, extract V6 hero and build a scoped static narrative with the original site's product coverage.
- Four pillars plus Complete; simulated workspace; four contextual case studies; four-step accountable workflow; company/control commitments; transparent contact and privacy information.
- Public EN/ES, no geographic targeting, no fabricated results or regulatory claims. Existing V6 headline remains as expressly approved; global disclosure qualifies concept imagery.
- No production merge until all mandatory gates pass. User has expressly authorized release; no repeated approval needed.

## Review focus
- Hero clipping at orbital extremes, especially mobile; compare reference and integrated screenshots at the same animation phase.
- Language persistence with unavailable localStorage; query-string language URLs, history navigation, Spanish dynamic mock content.
- Mobile workspace legibility; no desktop-scaled text; keyboard/manual/automatic controls and reduced motion.
- Real contact capability vs. unverified delivery; no simulated send, financial action or completed legal policy.
- Network and Vercel authorization may block preview/production; never infer deployment from local success.

## Task 1 — baseline and behavior contracts
- [ ] Record section/claims/contact inventory and verify V6 image bytes.
- [ ] Add browser checks for language persistence, keyboard mobile navigation, all mock views, reduced motion, local assets and responsive overflow; run against original and record expected failure.

## Task 2 — implement static release
Files: index.html, assets/*, site.css, site.js, robots.txt; localized entry es/index.html generated from the same source; no framework.
- [ ] Extract hero, CSS dependencies and orbit script; isolate all new CSS under .rhs-content.
- [ ] Implement lower-page copy, accessible simulated workspace, scenarios, workflow, company/controls, transparent contact notice EN/ES.
- [ ] Preserve hero image bytes; local fonts if external font access cannot be restored; document visual dependency handling.
- [ ] Run browser contracts until passing and commit implementation.

## Task 3 — independent audit
Files: tests/* and docs/web-studio/evidence/*.
- [ ] Run responsive browser checks at 320/390/768/1024/1280/1440/1920.
- [ ] Observe at least two complete continuous 23.5-second hero laps on desktop/mobile; sample all panels against clipping boundaries.
- [ ] Compare V6 and integrated hero screenshots; inspect actual screenshots and image hashes.
- [ ] Audit real console/network/links, keyboard, EN/ES, reduced motion, visibility, mock rotation, claims and SEO; record unrun browsers/performance explicitly.
- [ ] Independent RHS Auditor review; fix verified release blockers, rerun affected checks.

## Task 4 — release or exact external blocker
- [ ] Inspect actual Vercel project, domains and Git integration via authorized interface before production.
- [ ] If gates pass: preview, safe merge, production deploy, official-URL smoke test, rollback record.
- [ ] Otherwise retain tested implementation branch and document concrete blockers without touching main.
- [ ] Update STATUS, DECISIONS, BACKLOG, CHECKLIST with evidence, commits and actual release status.

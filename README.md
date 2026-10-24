# RHS Labs / Sentinel website

Static EN/ES product website. Sentinel is in development; all interface data is illustrative.

## Develop

Use the existing checkout (cloud tasks are already isolated). Python 3 and Node are available; the website has no package dependencies.

```sh
python3 tools/render.py
node tools/stage.mjs
python3 -m http.server 8000 --bind 0.0.0.0 --directory public
```

`tools/render.py` maintains `/` and `/es/` from a shared content source. Keep both checked-in HTML pages synchronized with it: the visual audit workflow enforces exact generator parity. It reads the approved hero and header fragments; update content in this source, then regenerate. `site.css` scopes lower-page styles. `assets/hero-v6.css` preserves the approved CSS. Hero image bytes must remain identical to the integrity manifest.

`tools/stage.mjs` includes only public files. Never deploy the checkout root: it contains internal studio documentation. Vercel configuration selects `public/` and runs the staging script with Node; no framework or dependency installation is required.

The canonical origin is `https://rhs-labs.com`, explicitly specified by the owner for this alignment round and recorded in `site.config.json`. Canonical, hreflang, Open Graph and sitemap use this origin in the staged output; preview hosting stays on Vercel. This configuration does not change DNS or establish a production-domain deployment. `PUBLIC_SITE_ORIGIN` may override the configured origin only for a deliberately verified deployment.

The new sectors are maintained in `tools/sections.py`; `tools/render.py` preserves the approved hero/header and renders both languages. This round is preview-only, pending final approval.

## Verify

The prepared cloud environment supplies Playwright and Chromium. With the local website serving on port 8000:

```sh
node tests/sectors.cjs
node tests/alignment-audit.cjs
node tests/mobile-showcase.cjs
node tests/functional.cjs
node tests/staging.cjs
node tests/visual.cjs
node tests/orbit.cjs
node tests/geometry.cjs
```

Visual/geometry reference tests also require the SHA-verified approved reference served on port 8001. Source reference is supplied separately in the user's handoff ZIP, not a public deployment asset. In this cloud task it is in `/workspace/rhs-handoff/RHS_WEB_STUDIO_HANDOFF/reference/`.

`tests/orbit.cjs` observes the preserved two-lap continuous 3D orbit on desktop; `geometry.cjs` compares the older baseline on tablet/desktop widths only. On phones (up to 560px), the owner-approved correction displays one dashboard at a time, with swipe and dot navigation; `tests/mobile-showcase.cjs` tests this responsive behavior and the mobile laptop image and expandable interactive workspace. The simulated test is not a substitute for live observation. `tests/staging.cjs` uses example.test strictly as an isolated test fixture; rerun staging without the fixture before serving or deployment.

Evidence and actual publication status: `docs/web-studio/STATUS.md` and `docs/web-studio/evidence/`. No analytics, enquiry form or operational financial controls are included. Email delivery and production hosting must be verified separately.

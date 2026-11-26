# RHS Labs / Sentinel website

Static EN/ES website for RHS Labs Sentinel, the PAM and back-office for regulated betting operators. Every claim maps to a real back-office screen; product images come only from captures of the real back-office (mock mode, synthetic data) approved in `tools/capture/`. Until the hero swap, the three orbit images are concept illustrations and are labeled as such.

## Develop

Use the existing checkout (cloud tasks are already isolated). Python 3 and Node are available; the website has no package dependencies.

```sh
python3 tools/render.py
node tools/og/og.mjs        # Open Graph images from the rendered hero (after copy or hero changes)
node tools/stage.mjs
python3 -m http.server 8000 --bind 0.0.0.0 --directory public
```

`tools/render.py` maintains `/` and `/es/` from a shared content source. Keep both checked-in HTML pages synchronized with it: the visual audit workflow enforces exact generator parity. It reads the approved hero and header fragments; update content in this source, then regenerate. `site.css` scopes lower-page styles. `assets/hero-v6.css` preserves the approved CSS. Hero image bytes must remain identical to the integrity manifest.

Languages are registered in `tools/render.py` (`LANGUAGES`); only published ones are written and linked. Product screenshots come from the real back-office through `tools/capture/` (see its README); nothing reaches the page before it is reviewed and approved there.

`tools/stage.mjs` includes only public files. Never deploy the checkout root: it contains internal studio documentation. Vercel configuration selects `public/` and runs the staging script with Node; no framework or dependency installation is required.

The canonical origin is `https://rhs-labs.com`, explicitly specified by the owner for this alignment round and recorded in `site.config.json`. Canonical, hreflang, Open Graph and sitemap use this origin in the staged output; preview hosting stays on Vercel. This configuration does not change DNS or establish a production-domain deployment. `PUBLIC_SITE_ORIGIN` may override the configured origin only for a deliberately verified deployment.

The new sectors are maintained in `tools/sections.py`; `tools/render.py` preserves the approved hero/header and renders both languages. This round is preview-only, pending final approval.

## Verify

The prepared cloud environment supplies Playwright and Chromium. With the local website serving on port 8000:

```sh
node tests/generator.cjs
node tests/integrity.cjs
node tests/sectors.cjs
node tests/alignment-audit.cjs
node tests/mobile-showcase.cjs
node tests/functional.cjs
node tests/staging.cjs
node tests/visual.cjs
node tests/orbit.cjs
node tests/geometry.cjs
node tests/product-images.cjs
```

`tests/generator.cjs` and `tests/integrity.cjs` need no browser: the first checks that the checked-in pages equal the generator output, that EN/ES keep the same copy structure, that a registered but unpublished third language changes nothing, and that the hero only swaps to approved product captures; the second checks the orbit images against the integrity manifest and the badge under the orbit.

Visual/geometry reference tests also require the SHA-verified approved reference served on port 8001. Source reference is supplied separately in the user's handoff ZIP, not a public deployment asset. In this cloud task it is in `/workspace/rhs-handoff/RHS_WEB_STUDIO_HANDOFF/reference/`.

`tests/product-images.cjs` renders a temporary copy of the site with obviously fake fixture images and an approved capture manifest, and checks that approved captures reach the tour, the Player 360 markers, payments and the hero, and that unapproved ones never do; it writes nothing to the checkout.

`tests/orbit.cjs` observes the preserved two-lap continuous 3D orbit on desktop; `geometry.cjs` compares the older baseline on tablet/desktop widths only. On phones (up to 560px), the owner-approved correction displays one dashboard at a time, with swipe and dot navigation; `tests/mobile-showcase.cjs` tests this responsive behavior and the mobile laptop image and expandable interactive workspace. The simulated test is not a substitute for live observation. `tests/staging.cjs` uses example.test strictly as an isolated test fixture; rerun staging without the fixture before serving or deployment.

Evidence and actual publication status: `docs/web-studio/STATUS.md` and `docs/web-studio/evidence/`. No analytics, enquiry form or operational financial controls are included. Email delivery and production hosting must be verified separately.

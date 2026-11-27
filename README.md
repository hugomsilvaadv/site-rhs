# RHS Labs / Sentinel website

Static EN/ES website for RHS Labs Sentinel, risk and fraud control for regulated betting operators, available now, and for its PAM back-office, shown as in development. Every Sentinel claim maps to a screen of the Sentinel demo, as listed in the reviewed inventory of its menu; the back-office section only lists areas that exist in the back-office code (a menu route whose flag the `homologacao` profile turns on) and says they are not yet available. Each product image is a reviewed screenshot of the demo (fictitious data), imported as `assets/product/sentinel-<screen>.webp` by `tools/capture/import.mjs`. While a file is missing, the page leaves the image out and the section stands on its text and diagrams; a registered "Screenshot pending" placeholder of the back-office capture plan is never shown nor published. Until the hero swap, the three orbit images are concept illustrations and are labeled as such.

## Develop

Use the existing checkout (cloud tasks are already isolated). Python 3 and Node are available; the website has no package dependencies.

```sh
python3 tools/render.py
node tools/og/og.mjs        # Open Graph images from the rendered hero (after copy or hero changes)
node tools/stage.mjs
python3 -m http.server 8000 --bind 0.0.0.0 --directory public
```

`tools/render.py` maintains `/` and `/es/` from a shared content source. Keep both checked-in HTML pages synchronized with it: the visual audit workflow enforces exact generator parity. It reads the approved hero and header fragments; update content in this source, then regenerate. `site.css` scopes lower-page styles. `assets/hero-v6.css` preserves the approved CSS. Hero image bytes must remain identical to the integrity manifest.

Languages are registered in `tools/render.py` (`LANGUAGES`); only published ones are written and linked. Product screenshots come from the Sentinel demo through `tools/capture/import.mjs` (see `tools/capture/README.md`): it turns the reviewed PNGs into `assets/product/sentinel-*.webp` with the product badge, and the clean hero copies into `assets/hero/`. Review the files and the contact sheet, delete any image left out, and only then run `python3 tools/render.py`, which shows each capture on the page; commit the regenerated `index.html` and `es/index.html` with the images. `tests/generator.cjs` fails until the pages are rendered again. The hero changes only through `tools/capture/hero-swap.mjs`. The back-office capture (`tools/capture/screens.mjs` and its placeholders) stays for when the back-office is ready.

`tools/stage.mjs` includes only public files. Never deploy the checkout root: it contains internal studio documentation. Vercel configuration selects `public/` and runs the staging script with Node; no framework or dependency installation is required.

The canonical origin is `https://rhs-labs.com`, explicitly specified by the owner for this alignment round and recorded in `site.config.json`. Canonical, hreflang, Open Graph and sitemap use this origin in the staged output; preview hosting stays on Vercel. This configuration does not change DNS or establish a production-domain deployment. `PUBLIC_SITE_ORIGIN` may override the configured origin only for a deliberately verified deployment.

The sectors are maintained in `tools/sections.py`; `tools/render.py` preserves the approved hero/header and renders both languages, and refuses to render when the EN/ES copy or its structure drift apart. This round is preview-only, pending final approval.

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

`tests/generator.cjs` and `tests/integrity.cjs` need no browser: the first checks that the checked-in pages equal the generator output, that EN/ES keep the same copy structure, that a registered but unpublished third language changes nothing, and that the hero swap point stays off until `tools/capture/hero-swap.mjs` turns it on with the capture copies; the second checks the orbit images against the integrity manifest and the badge under the orbit.

Visual/geometry reference tests also require the SHA-verified approved reference served on port 8001. Source reference is supplied separately in the user's handoff ZIP, not a public deployment asset. In this cloud task it is in `/workspace/rhs-handoff/RHS_WEB_STUDIO_HANDOFF/reference/`.

`tests/product-images.cjs` checks that every screen of the back-office capture plan keeps its placeholder at the final path and size (`tools/capture/placeholders.json`) and that staging never publishes one; that the pages never reference a placeholder; in a temporary copy of the site, that an imported Sentinel capture appears after rendering again (desktop and phone) and adds no other product image; and that `tools/capture/hero-swap.mjs` refuses missing capture copies and, with the Sentinel copies, rewrites the integrity manifest and turns on the product badge. It writes nothing to the checkout.

`tests/orbit.cjs` observes the preserved two-lap continuous 3D orbit on desktop; `geometry.cjs` compares the older baseline on tablet/desktop widths only. On phones (up to 560px), the owner-approved correction displays one dashboard at a time, with swipe and dot navigation; `tests/mobile-showcase.cjs` tests this responsive behavior and the Sentinel tour on phones (one area at a time and at most one image: the phone-size capture when it exists, the desktop capture when only that one exists, and only the list of screens when there is no capture). The simulated test is not a substitute for live observation. `tests/staging.cjs` uses example.test strictly as an isolated test fixture; rerun staging without the fixture before serving or deployment.

Evidence and actual publication status: `docs/web-studio/STATUS.md` and `docs/web-studio/evidence/`. No analytics, inquiry form or operational financial controls are included. Email delivery and production hosting must be verified separately.

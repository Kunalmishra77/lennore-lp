# Decisions log

## 2026-09-30 — Astro 6 kept (Astro 7 exists)
Context: The latest Astro is 7.3.5. `npm audit` lists advisories for astro ≤ 7.2.7: XSS in spread attributes, view-transition directives, AVIF optimisation, base-path stripping. It also lists a Windows dev-server file-read issue in esbuild 0.27.
Options considered: (a) upgrade to Astro 7, which changes the stack and needs client approval; (b) stay on 6.4.8 and reduce the exposure.
Decision: Stay on `astro ~6.4.8` (CLAUDE.md: stack is fixed). Override `sharp` to ^0.35.5, which fixes the libvips advisories. Deduplicate Vite to 7.3.6.
Consequences: The site is static and built only from our own content and images. No SSR, no view transitions, no `base` path. The remaining advisories affect those features or the local dev server only. **Raise the Astro 7 upgrade with the client before launch.**

## 2026-09-30 — Upgrade to Astro 7 (supersedes the entry above)
Context: The client approved the upgrade so the page isn't built on a version with known advisories.
Decision: `astro ^7.3.5` (latest stable). The `sharp` and Vite overrides are removed, since Astro 7 ships sharp 0.35.5 and Vite 8. Astro 7 still supports the config keys we use: `security.csp`, `image.layout`, `markdown.syntaxHighlight`. The build passes with 0 errors and 0 warnings.
Consequences: `npm audit --omit=dev` reports 0 vulnerabilities. The remaining advisories (extract-zip, tmp, uuid) come through `@lhci/cli`, a dev/CI tool that is never deployed. The only suggested fix downgrades lhci to 0.1.0, so leave them. CLAUDE.md now says Astro 7.

## 2026-09-30 — Hero model = L9 colour-screen version
Context: The photos show two L9 front panels, colour screen and blue LCD.
Decision (client, 30 Sep): Use the colour-screen version everywhere. The final LCP composites are `HERO_desktop.jpg` and `HERO_mobile.jpg`, and the cut-outs are `CUT_front`, `CUT_side_right` and `CUT_side_left`. `CUT_L9_front_lcd.webp` is not used unless the client asks for it.

## 2026-09-30 — Fonts subset beyond Google's Latin subset
Context: The Google Latin subsets of Sora 600 and Inter variable total 61.7 KB, over the 60 KB budget for preloaded fonts.
Decision: Re-subset with fontTools to Basic Latin, Latin-1, typographic punctuation, → and ₹. The result is 11.8 KB + 34.1 KB = 45.9 KB. The Arial fallback metrics (size-adjust, ascent and descent) were computed from the font files.

## 2026-09-30 — Linting scope
Decision: ESLint covers the JS/MJS scripts and config files only. TypeScript and `.astro` files are checked by `astro check` in strict mode. Adding `typescript-eslint` or `eslint-plugin-astro` would add dependencies outside docs/03 §4, so ask the client first.

## 2026-09-30 — CSP via Astro 6 `security.csp` from day one
Decision: Enforce a meta CSP with Astro's automatic hashes. Components must not use inline `style=""` attributes, because hashed `style-src` blocks them. Use classes or scoped `<style>` blocks instead. Third-party origins get added in Phases 11 and 14.

## 2026-09-30 — Phase 6 content decisions (hide-if-missing)
- **S2 chapters follow the Plan B stills.** The chapters are front, then side, then display, instead of the "Inside / cutaway" chapter in docs/04. There is no cutaway render. The side chapter lists the labelled ports from `sidePorts`, and the display chapter lists `controls`.
- **S3:** the "Filtered first" stage is hidden until `filter.type` exists, and the diagram draws no filter box. The electrolysis stage uses the generic mechanism line (docs/11 §2, allowed) until `plates` and `plateMaterial` exist.
- **S4:** the levels, labels and pH values come from `product.json` and are shown as "pH ≈ x", with the source-water caveat in the footnote. "Best for" and "For drinking" are hidden until the manual values arrive. `reagentColor` is null, so the glass uses the provisional `color.phScale` tokens and the footnote says the colours are illustrative.
- **S5:** `features[]` is empty. The list is built only from facts that are filled in (display, controls, Auto Clean, spout, side ports). There are no hotspots until coordinates exist.
- **S6** needs at least 2 sourced tiles to show. Today only Auto Clean exists, so S6 is hidden.
- **S7:** the images follow assets/ASSETS.md (real photos preferred). Captions name the model shown ("Shown: Lennore L7+RO"), and the AI wall-mount scene is captioned "Illustrative image".
- **S9:** only company identity is shown (legal name, CIN, email, website). `LIFE_L5_model-with-glass.jpg` is not used until the model release for paid ads is confirmed.
- **Choose your model** (client, 30 Sep): the section sits before S11 and shows cards for L5, L9 and L7+RO with name and image only. L5+RO has no card image, so it is left out.
- **S13:** the "No obligation" bullet stays hidden until the client confirms it. The only contact alternative shown is email, until the phone and WhatsApp numbers exist.
- **Privacy and terms** contain only the docs/11 §6 notice and known company facts. They need legal review before launch.
- **CSS** is always inlined (about 10 KB gzip), so no stylesheet blocks the LCP.

## 2026-09-30 — Lighthouse CPU multiplier on slow local machines
Context: The dev laptop (i7-6700HQ) scores `benchmarkIndex` ≈ 370. With the 4× multiplier in lighthouserc.json (calibrated for fast desktops and CI runners), a local run emulates a phone about 4× slower than the Moto G Power target. The first run showed LCP 3.4 s and TBT 416 ms on a page with no JS.
Decision: CI keeps 4× (lighthouserc.json). Machines scoring below 800 run `npm run lhci:local` (1×), as Lighthouse's throttling guide recommends. Phase 6 result at 1× (median of 3): LCP 1.84 s, FCP 1.25 s, TBT 38 ms, CLS 0, 157 KB total transfer, score 0.99. Phase 12 confirms on WebPageTest (Moto G Power, 4G).

## 2026-10-01 — Staging deploy on Vercel (client request)
Context: The client asked for the page to go live on a new Vercel project. The docs plan Cloudflare Pages plus Pages Functions for `/api/lead` (docs/03).
Decision: Deploy the static build to Vercel project `lennore-lp` as a **staging** site. `vercel.json` mirrors the security and cache headers from `public/_headers` and adds `X-Robots-Tag: noindex, nofollow` on every path until launch.
Consequences: The lead form posts to `/api/lead`, which does not exist yet, so submissions fail until Phase 10. **Before Phase 10, decide whether hosting stays on Vercel (lead API as a Vercel Function, no Turnstile change needed) or moves to Cloudflare Pages as planned.** Remove the noindex header at launch (Phase 14).

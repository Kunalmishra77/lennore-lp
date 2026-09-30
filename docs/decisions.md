# Decisions log

## 2026-09-30 — Astro 6 kept (Astro 7 exists)
Context: The latest Astro is 7.3.5. `npm audit` lists advisories for astro ≤ 7.2.7: XSS in spread attributes, view-transition directives, AVIF optimisation, base-path stripping. It also lists a Windows dev-server file-read issue in esbuild 0.27.
Options considered: (a) upgrade to Astro 7, which changes the stack and needs client approval; (b) stay on 6.4.8 and reduce the exposure.
Decision: Stay on `astro ~6.4.8` (CLAUDE.md: stack is fixed). Override `sharp` to ^0.35.5, which fixes the libvips advisories. Deduplicate Vite to 7.3.6.
Consequences: The site is static and built only from our own content and images. No SSR, no view transitions, no `base` path. The remaining advisories affect those features or the local dev server only. **Raise the Astro 7 upgrade with the client before launch.**

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

# 03 — Technical Requirements Document (Deliverables 3, 4, 12, 13)

## 1. Technology stack (Deliverable 4)

| Layer | Choice | Reason | Rejected alternatives |
|---|---|---|---|
| Framework | **Astro 6**, `output: 'static'` | Zero JS by default, static HTML for fast LCP, build-time images, typed content, CSP API, first-class Cloudflare adapter | Next.js (React runtime + hydration unneeded), React+Vite SPA (CSR hurts LCP/SEO), plain HTML (no component/variant system) |
| Language | TypeScript (strict) | Typed content model prevents invented/missing specs slipping through | JS |
| Styling | Tailwind CSS v4 + CSS custom properties from tokens; component-scoped `<style>` for complex motion states | Fast, consistent, tokens enforce design system | CSS-in-JS (runtime cost) |
| Animation engine | **GSAP 3.13+** core + ScrollTrigger + SplitText (all free for commercial use since Apr 2025) | Industry-standard timeline + scroll control, `matchMedia` for mobile/reduced-motion split, robust pinning | Framer Motion (React-only), anime.js (no scroll system), pure CSS scroll timelines (Firefox gap, no pinning choreography) |
| Progressive CSS | `animation-timeline: view()` for simple reveals behind `@supports` | Off-main-thread where supported; GSAP fallback | — |
| Smooth scroll | Lenis (desktop, `pointer: fine` only) | Smoother sequence scrubbing on wheel/trackpad | ScrollSmoother (heavier DOM wrapping) |
| Sequences | Custom canvas 2D player (`sequence-player.ts`) | Frame-accurate, progressive loading, tiny | Video scrubbing (iOS jank), Three.js (weight) |
| Diagrams | Inline SVG + GSAP (stroke-dash, motion along path via MotionPathPlugin if needed) | Crisp, tiny, accessible text | Lottie (heavy runtime) |
| 3D (phase 2 only) | Three.js + GLB (Draco/meshopt), lazy on user action | Only for optional "Inspect in 3D" | model-viewer (acceptable alternative) |
| Hosting/CDN | **Cloudflare Pages** (India PoPs), R2 for large media | Free/low cost, edge caching, Functions in same repo | Vercel/Netlify (fine, but Functions+Turnstile+R2 bundle is simpler on CF) |
| Lead API | Cloudflare Pages Function `/api/lead` | Same repo/deploy, secrets at edge | Separate server |
| Bot protection | Cloudflare Turnstile (managed/invisible) | No CAPTCHA friction | reCAPTCHA (heavier, UX) |
| Tag management | GTM (web) + server-side events from Function for Meta CAPI / Google enhanced conversions | Marketing can iterate tags; server events for accuracy | Hard-coded pixels |
| CRM sink | Webhook to Lennore CRM (TBD) — default Google Sheet via Apps Script webhook + WhatsApp Business API alert | Works day 1; swappable | — |
| Testing | Playwright, Lighthouse CI, axe-core, Vitest (utils) | — | — |
| Monitoring | Cloudflare Web Analytics (RUM, CWV), Sentry (errors, low sample), uptime check on `/api/lead/health` | — | — |

Package versions: install latest stable at Phase 5 and commit the lockfile. Do not upgrade majors mid-project.

## 2. Framework configuration

`astro.config.mjs` essentials:
- `output: 'static'`, `site: 'https://go.lennore.in'` (or final domain)
- `build.inlineStylesheets: 'auto'` (critical CSS inline)
- `image`: sharp service; default formats `['avif','webp']`; `layout: 'constrained'`
- `security.csp` enabled (Astro 6 CSP API) — hashes for inline scripts; allowlist GTM, Google, Meta, Turnstile domains
- Integrations: `@astrojs/sitemap` (only canonical `/`), Tailwind v4 Vite plugin
- Adapter: `@astrojs/cloudflare` only if needed for Functions co-location; otherwise plain `/functions` directory for Pages Functions

## 3. Rendering strategy
- **All pages pre-rendered** at build. Variants generated from `src/content/variants/*.json` via `getStaticPaths()`.
- **No client framework.** Interactivity via small TS modules loaded with `<script>` (Astro bundles, dedupes, defers).
- **Motion modules load after LCP**: `src/lib/motion/boot.ts` is imported with `requestIdleCallback`/`load` fallback and dynamically imports each section's timeline when its section is within 1.5 viewports (`IntersectionObserver` rootMargin).
- **Hero** is pure HTML/CSS with a CSS-only entrance; GSAP takes over only for scroll-linked behaviour.
- **Progressive enhancement:** with JS disabled, every section is readable, form posts to `/api/lead` via standard `<form method="post">` (Function returns redirect to `/thank-you`).

## 4. Libraries (exact list, nothing else without approval)
`astro`, `typescript`, `tailwindcss`, `@tailwindcss/vite`, `gsap`, `lenis`, `@astrojs/sitemap`, `@astrojs/check`, `zod` (content + API validation), `libphonenumber-js` (min metadata, India only — or a 10-digit regex if bundle budget tight), dev: `@playwright/test`, `@lhci/cli`, `@axe-core/playwright`, `vitest`, `prettier`, `eslint`.

Phase 2 optional: `three`.

## 5. Component architecture (Deliverable 12)

```text
Base.astro (layout: <head>, fonts, GTM, consent, skip link, header, footer, sticky bar)
│
├── sections/
│   ├── Hero.astro                 S1  static LCP image + H1 + CTAs; ambient video swap-in
│   ├── ProductReveal.astro        S2  pinned canvas sequence + chapter overlays
│   ├── HowItWorks.astro           S3  pinned SVG diagram, 5 stages
│   ├── ChooseYourWater.astro      S4  interactive pH selector (signature)
│   ├── FeatureShowcase.astro      S5  sticky product + hotspots + list fallback
│   ├── BuiltToLast.astro          S6  materials / plates / filter / cleaning facts (spec-driven)
│   ├── FitsYourSpace.astro        S7  installation options (horizontal on desktop, swipe on mobile)
│   ├── Comparison.astro           S8  ionizer vs RO+alkaline cartridge (factual)
│   ├── ServiceTrust.astro         S9  warranty, service, company identity, certifications
│   ├── Testimonials.astro         S10 video stories + text reviews (hidden if none)
│   ├── Pricing.astro              S11 starting price / offer / EMI (variant-toggle)
│   ├── FAQ.astro                  S12 accordion
│   ├── LeadSection.astro          S13 form + WhatsApp + call, reassurance list
│   └── Footer.astro               S14 legal, disclaimer, company details
│
├── ui/
│   ├── Button.astro               variants: primary | secondary | ghost | whatsapp; size; magnetic (desktop)
│   ├── CTAGroup.astro             primary + WhatsApp (+ call) with tracking attributes
│   ├── StickyActionBar.astro      mobile bottom bar
│   ├── SiteHeader.astro           appears after hero
│   ├── Hotspot.astro              button + popover/bottom-sheet
│   ├── PHDisplay.astro            simulated machine display (level ring, value, label)
│   ├── Glass.astro                reagent glass SVG with colour state
│   ├── Accordion.astro            <details>-based, animated
│   ├── VideoPlayer.astro          lazy, poster, captions, tracking, pause-offscreen
│   ├── Picture.astro              wraps astro:assets <Picture> with art direction
│   ├── SequenceCanvas.astro       canvas + fallback <img> + data attributes (frame manifest)
│   ├── LeadForm.astro             3-field form + step 2 + states
│   ├── ChapterOverlay.astro       text block synced to sequence progress
│   ├── ScrollProgress.astro       thin progress line for pinned chapters
│   ├── Badge.astro, Icon.astro, Price.astro, Stat.astro (stat renders only with source)
│   └── DevMissing.astro           dev-only "[MISSING: key]" badge
│
├── lib/
│   ├── analytics.ts               track(event, params) → dataLayer; consent-aware
│   ├── attribution.ts             capture/persist UTM & click IDs; getAttribution()
│   ├── form.ts                    validation, step logic, submit, error/fallback
│   ├── serviceability.ts          pincode check against config
│   ├── variant.ts                 read current variant config
│   └── motion/
│       ├── boot.ts                env detection, Lenis (desktop), ScrollTrigger config, lazy section loader
│       ├── env.ts                 isTouch, isLowEnd (deviceMemory/hardwareConcurrency/saveData/effectiveType), reducedMotion
│       ├── sequence-player.ts     progressive frame loader + canvas draw + scrub binding
│       ├── split.ts               SplitText helpers w/ accessibility
│       ├── transitions.ts         dark→clear clip, colour-theme switcher
│       └── sections/
│           ├── product-reveal.ts
│           ├── how-it-works.ts
│           ├── choose-your-water.ts
│           ├── feature-showcase.ts
│           ├── fits-your-space.ts
│           └── reveals.ts         generic fade/slide/mask reveal registry (data-reveal="…")
│
└── content/ (typed via zod)
    ├── product.ts                 imports /content/product.json, validates, exports typed data
    ├── copy.en.ts / copy.hi.ts    section copy
    ├── faq.en.json / faq.hi.json
    ├── testimonials.json
    ├── service-areas.json         pincode prefixes / lists
    └── variants/*.json            campaign variants
```

**Component contract:** every section component receives `{ copy, product, variant }` props, renders semantic HTML with all text, and exposes `data-motion="<id>"` for the motion loader. No section imports GSAP directly.

## 6. Folder structure (Deliverable 13)

```text
lennore-lp/
├── CLAUDE.md
├── README.md
├── astro.config.mjs
├── package.json · tsconfig.json · .prettierrc · eslint.config.js
├── lighthouserc.json · playwright.config.ts
├── .env.example
├── docs/                         (this R&D package)
├── design/tokens.json
├── content/product.json          (client-facing source of truth; copied/validated into src/content)
├── public/
│   ├── fonts/                    sora-600.woff2, inter-var.woff2, mukta-400/600.woff2 (subset)
│   ├── icons/                    favicon.svg, apple-touch-icon.png, sprite.svg
│   ├── og/                       og-default.jpg (1200×630), og-hi.jpg
│   ├── sequences/
│   │   ├── reveal/desktop/0001.avif … 0120.avif   + manifest.json
│   │   ├── reveal/mobile/0001.avif … 0060.avif    + manifest.json
│   │   └── cutaway/{desktop,mobile}/…              (v1.5)
│   ├── videos/
│   │   ├── hero-loop-1080.mp4 · hero-loop-1080.webm · hero-loop-720.mp4 · hero-poster.avif
│   │   ├── lifestyle-loop-720.mp4 …
│   │   └── testimonials/…        (or R2 URLs)
│   ├── robots.txt
│   └── _headers                  (Cloudflare cache & security headers)
├── src/
│   ├── assets/
│   │   ├── products/             hero-front.png (transparent, 3000px), angles, closeups
│   │   ├── lifestyle/            kitchen-countertop.jpg, wall-mount.jpg, office.jpg
│   │   ├── diagrams/             (SVG sources)
│   │   └── brand/                logo.svg, logo-mono.svg
│   ├── components/{sections,ui}/
│   ├── content/                  (see §5)
│   ├── layouts/Base.astro
│   ├── lib/                      (see §5)
│   ├── pages/
│   │   ├── index.astro           default variant
│   │   ├── [variant].astro       getStaticPaths from content/variants
│   │   ├── thank-you.astro       noindex
│   │   ├── privacy.astro · terms.astro · disclaimer.astro
│   │   └── 404.astro
│   └── styles/
│       ├── global.css            @import "tailwindcss"; @theme { tokens }
│       └── motion.css            reduced-motion rules, initial states (.js-only)
├── functions/
│   └── api/
│       ├── lead.ts               POST: validate → Turnstile → CRM → alerts → CAPI/GAds → 200/303
│       └── health.ts
├── scripts/
│   ├── encode-video.sh           ffmpeg presets (docs/06)
│   ├── build-sequence.mjs        PNG renders → resized AVIF/WebP frames + manifest
│   └── check-content.mjs         fails build if required content keys missing for enabled sections
└── tests/
    ├── e2e/*.spec.ts
    └── a11y/*.spec.ts
```

## 7. Data structures

```ts
// src/content/product.ts (zod schema excerpt)
const Spec = z.object({ label: z.string(), value: z.string(), unit: z.string().optional(), source: z.string() }); // source = spec sheet ref
const PhLevel = z.object({
  id: z.string(),                 // "alk-3"
  label: z.string(),              // as on machine display
  ph: z.string(),                 // "9.5" or "≈9.5" as per manual
  stream: z.enum(['alkaline','neutral','acidic']),
  recommendedUse: z.string(),     // from manual only, e.g. "Drinking", "Cooking", "Cleaning surfaces"
  drinkable: z.boolean(),         // from manual
  reagentColor: z.string(),       // hex for animation, derived from reagent chart
});
const Feature = z.object({ id: z.string(), title: z.string(), body: z.string(), hotspot: z.object({ x: z.number(), y: z.number() }).optional(), specRef: z.string().optional() });
const Model = z.object({
  id: z.string(), name: z.string(), plates: z.number().nullable(), plateMaterial: z.string().nullable(),
  phLevels: z.array(PhLevel), filter: z.object({ type: z.string().nullable(), lifeLitres: z.number().nullable(), reportUrl: z.string().nullable() }),
  installation: z.array(z.enum(['countertop','under-counter','wall-mounted'])),
  specs: z.array(Spec), features: z.array(Feature),
  priceFrom: z.number().nullable(), warranty: z.string().nullable(),
});
```

```ts
// src/content/variants/demo.json shape
{
  "slug": "demo", "lang": "en", "index": false,
  "hero": { "eyebrow": "...", "h1": "...", "sub": "...", "image": "hero-front" },
  "cta": { "primary": "Book a Free Home Demo", "whatsappText": "Hi Lennore, I'd like a demo…" },
  "offer": { "enabled": false, "text": null, "validTill": null },
  "sections": { "pricing": true, "comparison": true, "testimonials": true },
  "tracking": { "variantId": "demo-v1" }
}
```

```ts
// Lead payload (client → /api/lead)
{ name, phone, pincode, segment?: 'home'|'office', preferredTime?, consentMarketing: boolean,
  turnstileToken, attribution: { utm_source, utm_medium, utm_campaign, utm_content, utm_term,
  gclid, gbraid, wbraid, fbclid, fbc, fbp, landing_variant, landing_url, referrer, first_seen }, eventId }
```

## 8. Animation architecture (summary; full spec docs/05)
- `boot.ts`: waits for `load` + idle → registers ScrollTrigger (+ SplitText lazily) → creates `gsap.matchMedia()` with contexts `desktop`, `mobile`, `reduced` → observes `[data-motion]` sections and dynamically imports their module.
- Each section module exports `init(ctx: MotionContext): () => void` (returns cleanup).
- `ScrollTrigger.config({ ignoreMobileResize: true })`; `normalizeScroll` **off** (native feel).
- All pinned sections use `pinSpacing: true`, `anticipatePin: 1`, and have CSS fallback heights to avoid CLS.
- Initial hidden states applied only under `.js-motion` class on `<html>` (set inline in head) so no-JS users see content.

## 9. Design system (summary; tokens in design/tokens.json)
- Themes: `ink` (dark) and `clear` (light) via `[data-theme]` on sections; `transitions.ts` interpolates body background at boundaries.
- Spacing 4-pt scale; container 1200 px (desktop) / 16 px gutters (mobile); section vertical rhythm clamp(80px, 12vw, 160px).
- Type scale fluid: display clamp(40px, 7vw, 96px); h2 clamp(30px, 4.5vw, 56px); body 16–18 px.
- Radii: 12 / 20 / 999. Shadows: minimal; glow via radial-gradient pseudo elements, not box-shadow stacks.

## 10. Asset management
- Images in `src/assets` processed by `astro:assets` (AVIF + WebP, responsive `srcset`, width/height auto → zero CLS).
- Sequences and videos in `public/` (pre-optimised by scripts) or R2 bucket `lennore-media` behind `media.lennore.in` with immutable cache.
- Every asset has a row in `docs/06` asset register (id, owner, status).

## 11. Image optimisation
- Formats: AVIF primary, WebP fallback, JPEG never needed except OG image.
- Hero: art-directed `<picture>`: mobile 900w portrait crop, desktop 2000w landscape. Target ≤ 90 KB mobile, ≤ 180 KB desktop.
- `loading="lazy"` + `decoding="async"` for everything below the fold; hero `fetchpriority="high"` + `<link rel="preload" as="image" imagesrcset>`.
- Transparent product cut-outs: AVIF with alpha (WebP alpha fallback); PNG only as master.

## 12. Video optimisation
- H.264 MP4 (baseline compatibility) + VP9/AV1 WebM where smaller; `preload="none"` except hero ambient (`metadata`), `muted playsinline loop autoplay` for ambient only after LCP.
- Pause via IntersectionObserver when < 25% visible; don't autoplay when `saveData` or `effectiveType` is 2g/3g → show poster.
- Presets in docs/06 §1.

## 13. Responsive strategy
- Breakpoints: `sm 480`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- Mobile-first CSS; **motion contexts** (not just CSS) switch at 768.
- Units: `svh` for pinned stages (avoid URL-bar jumps), `dvh` for full-screen overlays, `lvh` never.
- Art direction per breakpoint for hero, sequences (different framing, not just scale), and hotspots (different coordinates per layout).

## 14. Performance architecture
docs/07 §1. Key mechanisms: static HTML; critical CSS inline; fonts preloaded (2 files max); no JS in critical path; motion lazy per section; sequences load after LCP and only when section is within 2 viewports; GTM loaded after `load` with 1–2 s delay unless consent/interactions; third-party pixels via GTM with `defer`; Cloudflare caching `immutable` for hashed assets.

## 15. SEO architecture
docs/08 §1. Astro `<Seo>` head component fed by variant config; canonical logic; JSON-LD builders in `src/lib/schema.ts`.

## 16. Analytics implementation
docs/08 §2–3. `analytics.ts` exposes `track(name, params)`; data attributes `data-track="cta_click" data-track-location="hero"` auto-wired by delegate listener.

## 17. Deployment
- Repo: GitHub (private). Branch `main` → production; PR branches → Cloudflare preview URLs (noindex via `_headers` on preview).
- Domain: recommended **`go.lennore.in`** (CNAME to Pages) so the main site is untouched; alternatively `lennore.in/demo` via reverse proxy if main site is on Cloudflare.
- Build: `npm run build` (runs `check-content`, `astro check`, build). CI: GitHub Actions → lint, typecheck, unit, build, Playwright (preview), Lighthouse CI budgets → Pages deploy.
- `_headers`: `Cache-Control: public, max-age=31536000, immutable` for `/_astro/*`, `/sequences/*`, `/videos/*`, `/fonts/*`; HTML `max-age=0, must-revalidate`.

## 18. Environment variables

| Name | Where | Purpose |
|---|---|---|
| `PUBLIC_SITE_URL` | build | canonical base |
| `PUBLIC_GTM_ID` | build | GTM container |
| `PUBLIC_TURNSTILE_SITE_KEY` | build | form widget |
| `PUBLIC_WHATSAPP_NUMBER` | build | wa.me link (E.164 without +) |
| `PUBLIC_PHONE_NUMBER` | build | tel link |
| `PUBLIC_MEDIA_BASE` | build | R2/CDN base for sequences/videos |
| `TURNSTILE_SECRET_KEY` | Function secret | verify token |
| `CRM_WEBHOOK_URL` / `CRM_WEBHOOK_SECRET` | Function secret | lead sink |
| `WA_API_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_SALES_RECIPIENTS`, `WA_TEMPLATE_LEAD_CONFIRM` | Function secret | WhatsApp Cloud API alerts/confirmation |
| `META_PIXEL_ID`, `META_CAPI_TOKEN`, `META_TEST_EVENT_CODE` | Function secret | Conversions API |
| `GADS_CONVERSION_ID`, `GADS_LEAD_LABEL` | build (public) | gtag conversion via GTM |
| `LEAD_HASH_SALT` | Function secret | internal lead id hashing |
| `ALLOWED_ORIGINS` | Function | CORS/Origin check |

Commit `.env.example` only. Secrets via `wrangler pages secret put`.

## 19. Security considerations
- Turnstile server verification; honeypot field; min time-to-submit (≥ 3 s); rate limiting via Cloudflare WAF rule on `/api/lead`.
- Zod validation server-side; normalise phone to E.164; reject non-Indian numbers unless variant allows.
- Origin check; JSON only (+ form-encoded for no-JS path); body size limit 10 KB.
- CSP (Astro 6 API + `_headers`): `default-src 'self'`; script-src self + hashes + googletagmanager.com, google-analytics.com, googleadservices.com, connect.facebook.net, challenges.cloudflare.com; frame-src challenges.cloudflare.com, googletagmanager.com.
- HSTS, `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (no camera/mic/geolocation).
- PII: never in URLs/query strings; thank-you page reads nothing from query except opaque `ref`. Leads stored only in CRM; Function logs redact phone/name.
- DPDP: notice text versioned; consent flags stored with lead; deletion request path via email.

## 20. Browser compatibility
| Browser | Support level |
|---|---|
| Chrome/Edge (last 2), Samsung Internet (last 2) | Full |
| Safari iOS 16+ / macOS 16+ | Full (CSS scroll timelines only on 26+, GSAP fallback otherwise) |
| Firefox (last 2) | Full via GSAP (CSS scroll-driven animations not relied on) |
| iOS ≤ 15, old Android WebView | Static fallback: no pinning, images instead of sequences |
| In-app browsers (Instagram, Facebook, Google app) | **Test explicitly** — most Meta traffic lands here. No reliance on `window.open`, popups, or 3rd-party cookies. |

## 21. Accessibility (technical)
- `<main>`, `<header>`, `<footer>`, `<nav aria-label>`; sections labelled by their headings.
- SplitText: keep original text via `aria-label` on parent and `aria-hidden` on split spans.
- Canvas: `role="img"` + `aria-label` describing the sequence; adjacent HTML copy carries meaning.
- pH selector: `role="radiogroup"` with `role="radio"` items, arrow-key navigation, `aria-live="polite"` for result text.
- Hotspots: `<button aria-expanded aria-controls>`; popover `role="dialog"` (non-modal) on desktop, bottom sheet with focus management on mobile.
- Form: native inputs, `autocomplete="name|tel-national|postal-code"`, error summary.

## 22. Testing strategy
docs/09 §2. Unit (Vitest): attribution, validation, serviceability, sequence frame math. E2E (Playwright): journeys per variant, form success/failure/fallback, sticky bar behaviour, reduced motion. Visual regression: Playwright screenshots at 360/768/1440 for key states. Performance: Lighthouse CI + WebPageTest. Tracking QA: GTM preview, GA4 DebugView, Meta Test Events, Google Ads tag diagnostics.

## 23. Monitoring
- Cloudflare Web Analytics (RUM CWV by page/variant/device).
- Sentry browser SDK lazy-loaded at 10% sample, errors only (no replay — PII risk).
- Function logs → Logpush / dashboard; alert on lead API error rate > 2% or zero leads in 6 business hours during active spend.
- Weekly: CWV p75 per variant, CVR per variant, CPQL from CRM.

## 24. Future scalability
- New product/model → add to `product.json` models array; sections iterate models.
- New campaign → new JSON in `variants/`; no code.
- New language → `copy.<lang>.ts` + font subset.
- Phase 2: 3D viewer module, headless CMS (Sanity/Decap) if marketing needs self-serve edits, edge A/B split via Pages Function middleware, main-site redesign reusing tokens/components.

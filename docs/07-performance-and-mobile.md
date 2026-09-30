# 07 — Performance Strategy & Mobile Strategy (Deliverables 15, 18)

## 1. Performance strategy (Deliverable 15)

### 1.1 Why it matters here
Paid clicks are bought one at a time. Every second of load on a mid-range Android over 4G loses visitors you already paid for, and landing-page experience feeds Google Ads Quality Score (and therefore CPC). The page must *feel* cinematic after it is *already usable*.

### 1.2 Targets
| Metric | "Good" threshold (Google) | Our target (mobile p75 field) | Lab target (Moto G Power, 4G, Mumbai) |
|---|---|---|---|
| LCP | ≤ 2.5 s | ≤ 2.5 s | ≤ 2.2 s |
| INP | ≤ 200 ms | ≤ 150 ms | TBT ≤ 150 ms |
| CLS | ≤ 0.1 | ≤ 0.05 | ≤ 0.05 |
| TTFB | — | ≤ 400 ms | ≤ 300 ms |
| FCP | ≤ 1.8 s | ≤ 1.5 s | ≤ 1.3 s |

### 1.3 Budgets (enforced by Lighthouse CI `lighthouserc.json`)
| Resource | Mobile | Desktop |
|---|---|---|
| HTML (gz) | ≤ 30 KB | ≤ 30 KB |
| Critical CSS inline | ≤ 14 KB | ≤ 14 KB |
| Initial JS (gz, before interaction) | ≤ 90 KB | ≤ 110 KB |
| Fonts (preloaded) | 2 files ≤ 60 KB | 2 files ≤ 60 KB |
| Above-the-fold total | ≤ 450 KB | ≤ 700 KB |
| Full-scroll total | ≤ 4 MB | ≤ 9 MB |
| Third-party JS (GTM + GA4 + Ads + Pixel) | loaded post-`load`; ≤ 150 KB | same |

Approximate JS composition: GSAP core ~25–30 KB + ScrollTrigger ~15–20 KB + app motion/analytics/form ~20 KB → fits; SplitText, Lenis, section modules lazy.

### 1.4 Techniques
**Critical path**
- Static HTML from CDN edge (Cloudflare India PoPs); HTML `Cache-Control: max-age=0, must-revalidate` + `stale-while-revalidate`.
- LCP = hero `<img>` (AVIF), `fetchpriority="high"`, preloaded with `imagesrcset`/`imagesizes`; no lazy, no JS dependence, no CSS background-image.
- Fonts: 2 preloaded (Sora 600 subset Latin, Inter var subset); `font-display: swap`; `size-adjust`/`ascent-override` fallbacks → no layout shift. Devanagari only on `/hi`.
- Critical CSS inlined by Astro; rest in one hashed file.
- No render-blocking JS. Tiny inline head script only sets `.js-motion` and reduced-motion class.

**Deferral & splitting**
- Motion boot after `load` + `requestIdleCallback` (timeout 1500 ms).
- Section modules dynamic-imported when section within 1.5 viewports.
- SplitText, Lenis imported only on desktop context.
- GTM injected after `load` + 1.5 s *or* first interaction (scroll/tap), whichever first. Conversion tags must still fire reliably (form submit events are queued in `dataLayer`, which GTM processes on arrival) — plus server-side events as source of truth.
- Turnstile script loaded when form is within 2 viewports or on first field focus.

**Media**
- Hero video swapped in only if: not `saveData`, `effectiveType` 4g, not `lowEnd`, `prefers-reduced-motion: no-preference`.
- Sequences: progressive keyframe loading (docs/05 §3.2), only when near, AVIF.
- All below-fold images `loading="lazy" decoding="async"`, with dimensions.
- Videos `preload="none"`, poster set, paused offscreen.

**Runtime**
- Animate transform/opacity/clip-path only; `will-change` set just before and removed after pinned sections.
- Canvas DPR capped (2 desktop, 1.5 mobile).
- Passive listeners; no scroll handlers outside ScrollTrigger/Lenis RAF.
- Avoid layout thrash: read (`getBoundingClientRect`) in ScrollTrigger `refresh`, not per frame.
- `content-visibility: auto` + `contain-intrinsic-size` on S9–S12 (below-fold static sections).

**CLS guards**
- Every media element has width/height or aspect-ratio.
- Pinned sections have fixed CSS heights for JS-off state matching pin spacer size ± 0 (or `min-height` + pin inside).
- Sticky bar overlays content (fixed), never pushes it; bottom padding reserved on `<body>` for its height on mobile.
- Consent banner as fixed overlay bottom, not inserted at top.

**Caching**
- Hashed assets `immutable, max-age=31536000`; sequences/videos versioned paths (`/v2/…`).
- Cloudflare: Brotli, HTTP/3, Early Hints (103) for hero image + fonts.

### 1.5 Verification
- Lighthouse CI on every PR (mobile preset, 3 runs, median) — fails build on budget breach.
- WebPageTest weekly: Moto G Power, 4G, Mumbai, first + repeat view, filmstrip.
- RUM: Cloudflare Web Analytics CWV by variant/device; alert if p75 LCP > 2.5 s for 3 days.
- In-app browser checks (Instagram, Facebook, Google app) monthly.

---

## 2. Mobile-specific strategy (Deliverable 18)

### 2.1 Principles
1. **Thumb-first, one column, one idea per screen.**
2. **Native scroll only** — no Lenis, no `normalizeScroll`, no scroll-snap on the main document.
3. **Fewer, bigger moments:** 2 pinned chapters (reveal, how-it-works), not 3.
4. **Tap replaces hover** everywhere; nothing is hover-only.
5. **Action always reachable:** sticky bottom bar.
6. **Degrade by capability, not by viewport alone** (`lowEnd`, `saveData`, reduced motion).

### 2.2 Viewport behaviour
- Use `100svh` for pinned stages and hero (stable when URL bar collapses); `dvh` for bottom sheets.
- `ScrollTrigger.config({ ignoreMobileResize: true })` to avoid re-calculation jumps when the URL bar shows/hides.
- Respect safe areas: `padding-bottom: env(safe-area-inset-bottom)` on sticky bar.
- Test orientation change: refresh ScrollTrigger on `orientationchange` debounce 300 ms.

### 2.3 Section-by-section mobile re-composition
| Section | Desktop | Mobile |
|---|---|---|
| S1 Hero | Split layout, video | Stacked; product lower 55%; video only on capable 4G devices |
| S2 Reveal | 120 frames, 300% pin, text left | 60 frames, 220% pin, text in bottom scrim, separate mobile camera framing |
| S3 How it works | Landscape diagram, snap to stages | Portrait diagram (top→bottom flow), no snap, 200% pin |
| Transition | Circle clip from spout | Same (cheap), shorter (40vh) |
| S4 Choose | 3 columns | Display → chips row (scroll-snap) → glass → text |
| S5 Features | Sticky product left, blocks right, connectors | Sticky product top 45svh, horizontal swipe cards below; hotspot tap → card |
| S6 Built | Tiles grid + parallax | 1-column tiles, no parallax |
| S7 Fits | Pinned horizontal | Native swipe carousel (scroll-snap-x), no pin |
| S8 Compare | Table | 2 stacked cards or compact 2-col table |
| S10 Stories | Row of video cards | Swipe row of 9:16 cards (native to Reels users) |
| S13 Form | Two columns | Single column; form high on screen; reassurance below |

### 2.4 Touch interaction
- Targets ≥ 44×44 px, ≥ 8 px spacing.
- Hotspots: tap → bottom sheet (dvh-aware, swipe-down to close, focus trapped, Esc/back closes).
- pH chips: horizontal scroll-snap with visible overflow hint (partial next chip).
- Carousels: CSS scroll-snap (no JS carousel library); dots are buttons.
- No gestures that conflict with browser back-swipe (no horizontal drag near screen edges).

### 2.5 Reduced animation & low-end mode
- `prefers-reduced-motion` or `lowEnd`: sequences → 3 stills; diagrams → static final state + list; no parallax; reveals = 200 ms opacity only; pH selector instant state change.
- `saveData`: no video, no sequences (stills), reduced image widths (use smaller `srcset` candidate via `sizes` hint class).

### 2.6 Video & sequence loading on mobile
- Hero video: 720w, ≤ 0.9 MB, only on 4G/Wi-Fi capable devices, after `load`.
- Sequences: 60 frames @ 900w AVIF, ~1.5 MB total, keyframes first; start loading when S2 is within 2 viewports; if < 50% loaded when user reaches S2, scrubbing uses nearest keyframes (still smooth-feeling at 8-frame steps with 0.5 s scrub easing → use `scrub: true` on mobile plus CSS crossfade between keyframes if gap > 4).
- Customer videos: poster only until tap.

### 2.7 Sticky CTA (mobile)
- Appears when hero is 60% scrolled away; bar: `[ Book Free Demo ]  [WhatsApp]  [Call]` (primary takes ~55% width).
- Hides when: S13 form is in view; any input focused (keyboard open); bottom sheet open.
- Translucent ink with blur over pinned sequences (keeps visual premium), solid elsewhere.
- Events: `sticky_cta_click` with `button` param.

### 2.8 Mobile typography
| Style | Size / line-height | Notes |
|---|---|---|
| Display (H1) | 40–44 px / 1.05 | Sora 600, tracking −0.02em; max 3 lines |
| H2 | 30–32 px / 1.1 | |
| Chapter overlay | 22–24 px / 1.2 | ≤ 12 words |
| Body | 16–17 px / 1.55 | never below 16 px (avoids iOS zoom on inputs too) |
| Small / legal | 13 px / 1.5 | contrast ≥ 4.5:1 |
| Hindi | +2 px vs Latin equivalents, line-height +0.1 | Mukta |

### 2.9 Scroll performance & battery
- Pause all RAF-driven work offscreen (ScrollTrigger `toggleActions`, IntersectionObserver for videos/glow).
- Glow "breathing" animation disabled when `lowEnd` or battery saver likely (`saveData`).
- Canvas redraws only on frame change (not every RAF).
- No continuous particle systems; S3 particles run only while S3 is active.

### 2.10 In-app browsers (Instagram/Facebook/Google app)
- Most Meta traffic opens in the in-app browser: test WhatsApp deep links (`https://wa.me/…` works; avoid `whatsapp://`), `tel:` links, form autofill, and that `100svh` behaves.
- No reliance on third-party cookies; first-party storage for attribution.
- Keep total JS modest — in-app WebViews on low-end phones are slower than Chrome.

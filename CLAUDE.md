# CLAUDE.md — Standing instructions for building the Lennore ad landing page

You are implementing a premium, cinematic, paid-ads landing page for **Lennore** alkaline water ionizers (lennore.in, Lennore India Pvt. Ltd.). The full specification is in `/docs`. Read these before writing any code:

1. `docs/00-executive-summary.md` — decisions and constraints
2. `docs/03-trd.md` — stack, architecture, folder structure
3. `docs/04-ux-blueprint.md` — sections, order, behaviour
4. `docs/05-animation-blueprint.md` — motion system and timelines
5. `docs/10-implementation-blueprint.md` — the phase you are on

Read other docs when the current phase references them.

**Assets are final and live in `/assets` — read `assets/ASSETS.md` first.** Two deviations from docs/05–06 apply:
- **S2 Product Reveal uses Plan B:** crossfades plus scale and translate between real-photo stills (`HERO` → `KEY_side_right` → `KEY_display`). There is no rendered image sequence and no AI orbit video, because AI video garbled the product's printed text. Keep the SequencePlayer code path optional for a future 3D render.
- The hero ambient videos are already watermark-free, silent and loop-ready. You still need to re-encode them to the docs/06 size budgets.
Four models exist (L9, L5, L5+RO, L7+RO). L9 is the hero model. Other models appear only in the optional "Choose your model" section, and only with facts from product.json. Brand colours come from the logo (tokens color.brand). Copy assets into `src/assets/` (images) and `public/videos/` (videos) during Phase 5–6. Never modify the files under `assets/images/_originals/`.

---

## Non-negotiable rules

### 1. Never invent product facts
- Every spec, number, feature name, pH level, plate count, filter life, price, warranty term, certification, customer count, rating or testimonial **must come from `content/product.json`** (or `src/content/*` once migrated).
- If a value is `null` or marked `"TODO"`, render the component in a way that **hides that item** in production and shows a visible `[MISSING: key]` badge only in dev (`import.meta.env.DEV`). Never fill a gap with a plausible guess.
- Do not copy specs from competitor pages or generic ionizer knowledge.

### 2. Claims policy is law
- All user-facing copy must pass `docs/11-copy-deck-and-claims-policy.md`.
- **Never** write copy claiming alkaline/ionized water cures, treats, prevents or helps any disease or condition (diabetes, cancer, BP, kidney, acidity/digestion, immunity, detox, anti-ageing, weight loss, energy). This is both an ad-policy risk (Google/Meta disapproval) and a legal risk in India (Drugs & Magic Remedies Act, CCPA, ASCI).
- Allowed territory: how the machine works, adjustable pH levels (as per spec), filtration (only as per filter test report), taste, convenience, design, installation, service, warranty.
- Add the standard disclaimer (see docs/11 §5) to the footer.

### 3. Performance budgets are acceptance criteria, not goals
- Mobile (Moto G Power–class, 4G throttle): LCP ≤ 2.2 s, CLS ≤ 0.05, INP ≤ 150 ms, TBT ≤ 150 ms.
- Initial JS ≤ 90 KB gzip. Above-the-fold transfer ≤ 450 KB on mobile.
- The LCP element is a static hero image with `fetchpriority="high"`, never a video or canvas.
- Any change that breaks a budget must be reverted or justified in the PR notes.

### 4. Mobile is a separate design, not a squeeze
- Follow `docs/07-performance-and-mobile.md` §2. Use `gsap.matchMedia()` to register different timelines for `(max-width: 767px)`, `(min-width: 768px)`, and `(prefers-reduced-motion: reduce)`.
- No Lenis smooth scrolling on touch devices. No horizontal pinned scroll on mobile.

### 5. Motion principles
- Every animation must answer "what does this show about the product?" If it doesn't, cut it.
- Animate only `transform`, `opacity`, `clip-path`, `filter` (sparingly) — never layout properties.
- All scroll-linked motion lives in `src/lib/motion/` and is registered per section via `data-motion="<section-id>"`. Sections must render fully readable with JS disabled.
- `prefers-reduced-motion: reduce` → no scrubbing, no pinning, no parallax; simple fades ≤ 200 ms; image sequences show a single representative frame.

### 6. Tracking is part of the feature
- Every CTA, form step, WhatsApp/phone click and key interaction pushes a `dataLayer` event from the taxonomy in `docs/08-seo-analytics-ads.md` §3. Never call gtag/fbq directly from components — only through `src/lib/analytics.ts`.
- Never send PII (name, phone, email) to GA4 or in URLs. Hashed identifiers go only to Google Ads enhanced conversions and Meta CAPI, server-side.

### 7. Accessibility
- WCAG 2.2 AA. Semantic landmarks, one `<h1>`, logical heading order, visible focus, 44×44 px touch targets, captions for any video with speech, alt text from `content/`.
- Interactive visuals (hotspots, pH selector) must be keyboard-operable with ARIA states.

---

## Stack (fixed — do not swap without asking)

- **Astro 6** (static output) + **TypeScript** (strict)
- **Tailwind CSS v4** with tokens from `design/tokens.json` mapped into `@theme`
- **GSAP 3.13+** (free incl. all plugins): core, ScrollTrigger, SplitText. Use `gsap.context()` / `matchMedia()` for cleanup.
- **Lenis** — desktop pointer:fine only, synced to ScrollTrigger.
- **Canvas 2D image-sequence player** (custom, `src/lib/motion/sequence-player.ts`) — no Three.js in v1.
- **Cloudflare Pages** hosting + **Pages Functions** for `/api/lead`. **Turnstile** for bot protection.
- **Playwright** for e2e, **Lighthouse CI** for budgets.
- No React/Vue/Svelte islands unless a phase explicitly asks for one.

GSAP publishes official agent skills (`greensock/gsap-skills`: gsap-core, gsap-scrolltrigger, gsap-plugins). If available in this environment, use them.

---

## Working method

- Work one phase at a time from `docs/10-implementation-blueprint.md`. At the end of each phase, run the listed checks and summarise results before moving on.
- Ask before: adding a dependency, changing the stack, changing section order, adding any claim not in docs/11.
- Keep `content/` data-driven: sections read from typed content modules; no hard-coded copy inside components except structural labels.
- Commit at the end of each phase with a message `phase-N: <summary>`.

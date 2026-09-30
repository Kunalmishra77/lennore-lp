# 10 — Final Implementation Blueprint (Deliverable 20)

How to build this with Claude Code, phase by phase. Each phase has: **prompt to paste**, **files touched**, **key implementation notes**, **done when**.

Before Phase 5: complete Phase 3 inputs — at minimum `content/product.json` populated for S1–S4, S9, S13, and final tokens in `design/tokens.json`. Claude Code will build with placeholders if not, but will show `[MISSING]` badges in dev.

---

## Phase 5 — Project setup

**Prompt**
> Read CLAUDE.md, docs/03-trd.md §1–6 and §17–18. Scaffold the project in the repo root (keep /docs, /design, /content, /client-intake). Astro 6 static, TypeScript strict, Tailwind v4 via Vite plugin, GSAP, Lenis, zod. Map design/tokens.json into src/styles/global.css `@theme`. Self-host fonts (Sora 600, Inter variable, Mukta 400/600) with metric-adjusted fallbacks. Create Base.astro layout, .env.example, _headers, robots.txt, lighthouserc.json with budgets from docs/07 §1.3, Playwright config, scripts/check-content.mjs, GitHub Actions CI. Don't build sections yet.

**Notes**
- Inline head script: `document.documentElement.classList.add('js-motion')` unless reduced motion → add `reduced-motion`.
- `src/content/product.ts` validates `/content/product.json` with zod; export typed data + `isMissing(key)` helper.
- `DevMissing.astro` renders only in `import.meta.env.DEV`.

**Done when** build passes, preview deploy works, LHCI runs.

---

## Phase 6 — Static structure

**Prompt**
> Read docs/04-ux-blueprint.md fully and docs/11 copy deck. Build S1–S14 as static, semantic Astro components in src/components/sections using ui/ primitives listed in docs/03 §5. All content from src/content (copy.en.ts, product.ts, faq, testimonials, variants). No GSAP yet — only CSS for layout and static states. Build [variant].astro routes from variants JSON, thank-you, privacy, terms, disclaimer, 404. Sticky mobile bar and desktop header as CSS-only (show them always for now). Hide any item whose data is missing. Match designs at 360 and 1440.

**Notes**
- Hero `<Picture>` with art direction; `fetchpriority="high"`; preload link in head generated from the same image metadata.
- S2 static fallback = 3 stills with captions (this is also the reduced-motion view).
- S3 static = final-state SVG + ordered list.
- S4 must work without JS: radio inputs + CSS `:checked` to show the selected level's text & colour (JS enhances animation). This is progressive enhancement done right.
- Form: `<form method="post" action="/api/lead">` with hidden attribution fields filled by JS.

**Done when** page complete with JS disabled; axe clean; CLS ≈ 0.

---

## Phase 7 — Animation system

**Prompt**
> Read docs/05-animation-blueprint.md §1–3 and docs/07 §2.5. Implement src/lib/motion: env.ts, boot.ts (post-load idle boot, Lenis on desktop pointer:fine only synced to ScrollTrigger, gsap.matchMedia contexts desktop/mobile/reduced, lazy section loader via IntersectionObserver + dynamic import), reveals.ts registry for data-reveal / data-parallax / data-count attributes with CSS view() progressive path, transitions.ts (theme switching + circle clip), sequence-player.ts (progressive keyframe loading, canvas cover draw, DPR caps, ImageBitmap cache window, nearest-frame fallback). Add unit tests for frame math and loader order. Wire motion analytics hooks (section_view, sequence_progress).

**Key code contracts**
```ts
// motion/boot.ts
export type MotionContext = { desktop: boolean; mobile: boolean; reduced: boolean; lowEnd: boolean; lenis?: Lenis };
// each section module
export function init(el: HTMLElement, ctx: MotionContext): () => void;

// motion/sequence-player.ts
export class SequencePlayer {
  constructor(canvas: HTMLCanvasElement, manifestUrl: string, opts?: { dprCap?: number; cacheWindow?: number });
  load(): Promise<void>;          // progressive: keyframes → quarter → rest
  setProgress(p: number): void;   // 0..1, draws nearest loaded frame on next RAF
  destroy(): void;
}
```

**Done when** reveals work everywhere, reduced/lowEnd paths verified, initial JS ≤ 90 KB gz.

---

## Phase 8 — Scroll storytelling

**Prompt (run per section, in order S1, S2, S3, transition, S4, S5, S7)**
> Implement motion for <SECTION> exactly per docs/05 §4 (<SECTION> timeline) and docs/04 behaviour, with separate desktop/mobile/reduced branches inside gsap.matchMedia. Keep all copy in HTML. Add the analytics events listed in docs/08 §3 for this section. Test at 360 and 1440 and with reduced motion.

**Notes**
- S2 v1: use 3 stills in a stacked canvas-free implementation (absolute images, crossfade by progress). v1.5 swap to SequencePlayer by adding `manifest.json` — component chooses based on `product.media.revealSequence` presence.
- S3: build SVG with ids `#path-inlet`, `#filter`, `#plates g rect`, `#branch-alk`, `#branch-acid`, `#spout`; pathLength="1" on paths for easy dashoffset.
- S4: state machine `idle → autoDemo → userControlled`; `aria-live` region; reagent colours from product data.
- S5: hotspot coordinates per breakpoint in product data (`hotspot.desktop`, `hotspot.mobile` as % of image box).
- Performance check after each section (Performance panel, CPU 4× slowdown).

**Done when** timelines match; ≥ 50 fps on mid-range Android; keyboard operation works.

---

## Phase 9 — Responsive implementation

**Prompt**
> Read docs/07 §2. Audit every section at 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920 and landscape phones. Implement the mobile re-compositions in §2.3, sticky bar rules §2.7, typography §2.8, svh/dvh and safe-area handling, ScrollTrigger mobile config. Test in Instagram/Facebook in-app browsers (document results). Create Playwright visual baselines.

---

## Phase 10 — Lead-generation integration

**Prompt**
> Read docs/02 FR-10–FR-13, docs/03 §7 and §19, docs/08 §2.5. Implement lib/attribution.ts, lib/form.ts, lib/serviceability.ts, LeadForm states (incl. step 2 and WhatsApp fallback), and functions/api/lead.ts: parse JSON or form-encoded, zod validate, Turnstile verify, honeypot + min-time, normalise phone to E.164, generate lead_ref, POST to CRM_WEBHOOK_URL with HMAC signature, send WhatsApp Cloud API template to sales recipients and confirmation template to lead, send Meta CAPI Lead with event_id and hashed phone + fbc/fbp + client IP/UA, return {ok, lead_ref, serviceable}; non-JS path returns 303 to /thank-you. Redact PII in logs. Add Playwright tests with mocked Function.

**Lead function flow**
```text
POST /api/lead
 ├─ origin check → 403
 ├─ size/type check → 413/415
 ├─ zod parse → 422 {field errors}
 ├─ honeypot / min-time → 200 fake-ok (don't reveal)
 ├─ Turnstile siteverify → 403
 ├─ lead_ref = LNR-<base32(6)>
 ├─ CRM webhook (retry 2× with backoff; on failure → queue to KV `failed:<ref>` + alert)
 ├─ WhatsApp alerts (non-blocking, waitUntil)
 ├─ Meta CAPI Lead (non-blocking, waitUntil)
 └─ 200 {ok:true, lead_ref, serviceable}
```

---

## Phase 11 — Analytics

**Prompt**
> Read docs/08 §2–3. Implement lib/analytics.ts (track(), consent-aware queue, delegated data-track listeners), consent banner with Consent Mode v2 defaults, delayed GTM loader. Produce a GTM container import JSON (tags: GA4 config/events, Google Ads conversion + enhanced conversions via user-provided data from the dataLayer on success only, Conversion Linker, Meta Pixel base/Lead/Contact/ViewContent with eventID). Write docs/tracking-runbook.md covering verification steps and the weekly offline conversion import (CRM columns → Google Ads upload template and Meta offline/CAPI).

---

## Phase 12 — Performance optimisation

**Prompt**
> Run LHCI and a local WebPageTest-equivalent (Lighthouse mobile, 4× CPU, slow 4G). Fix anything outside docs/07 budgets: image weights, font subsetting, JS chunking, third-party timing, sequence frame sizes, CLS sources. Report before/after table.

---

## Phase 13 — QA

**Prompt**
> Execute docs/09 §2 checklist. Automate what's automatable (Playwright e2e, axe, visual regression, bundle secret scan). Produce qa-report.md with pass/fail per item and screenshots for manual checks.

---

## Phase 14 — Deployment

**Prompt**
> Prepare production deploy per docs/03 §17–18 and docs/09 §2.9: environment secrets list (without values), _headers final, CSP report-only first then enforce, DNS instructions for go.lennore.in, monitoring (Cloudflare Web Analytics, Sentry lazy 10%, lead API alert), rollback steps. Produce go-live-checklist.md.

---

## Phase 15 — Conversion optimisation

**Prompt (weekly)**
> Using the exported GA4 section/scroll events, CRM CPQL by variant, and RUM CWV, write a weekly CRO note: where users drop (section_view funnel), which CTAs convert, what to test next (from docs/08 §4.5 backlog). Implement approved variant changes via variants JSON only.

---

## Appendix A — Definition of Done (every phase)
1. Matches spec docs; deviations documented in `docs/decisions.md`.
2. No new facts/claims outside content & claims policy.
3. Budgets pass; no console errors; axe clean.
4. Works with reduced motion and JS disabled (degrades gracefully).
5. Events fire per taxonomy.
6. Committed as `phase-N: …`.

## Appendix B — Decisions log template (`docs/decisions.md`)
```text
## YYYY-MM-DD — <decision>
Context:
Options considered:
Decision:
Consequences:
```

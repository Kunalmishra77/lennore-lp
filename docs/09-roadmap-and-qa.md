# 09 — Development Roadmap & Testing/QA Checklist (Deliverables 14, 19)

## 1. Development roadmap (Deliverable 14)

### 1.1 Timeline overview (working weeks, assuming client inputs arrive on time)
```text
Week        1     2     3     4     5     6     7
Ph 1–2  ██ (done — this package)
Ph 3    ░███                                 Design system + hi-fi (needs C1–C12)
Ph 4    ░░████████████                       Assets: shoot wk 2; 3D wk 2–4 (v1.5)
Ph 5          ██                             Setup
Ph 6          ████                           Static structure
Ph 7              ████                       Motion system
Ph 8                ██████                   Scroll storytelling (v1 stills → v1.5 sequences wk 5)
Ph 9                  ████                   Responsive/mobile
Ph 10             ████                       Lead integration (parallel)
Ph 11                 ███                    Analytics
Ph 12                     ███                Performance
Ph 13                       ███              QA
Ph 14                         █  v1 LAUNCH (≈ end wk 4, fast lane)
Ph 8b                            ████        v1.5 cinematic sequences
Ph 15                         ████████ →     CRO (ongoing)
```
**Fast lane (v1, ~4 weeks):** photos + stills-based S2, SVG S3, full S4, all conversion sections, full tracking. **Cinematic (v1.5, +2–3 weeks):** rendered sequences, cutaway, hero ambient video. Aim v1 live by **mid-October 2026** to collect data before the Diwali peak (8 Nov 2026).

### 1.2 Phases, deliverables, acceptance

| Phase | Deliverables | Acceptance criteria |
|---|---|---|
| **1 Research** ✅ | docs/01 | Approved by stakeholder |
| **2 PRD + TRD** ✅ | docs/02, docs/03, docs/04–08 | Approved; open questions (docs/00 §5) answered |
| **3 Design system** | Manual audit of lennore.in (screenshots, colour sampling); finalised tokens.json; Figma: type scale, colour, components (buttons, chips, form, hotspot, sheet, cards); hi-fi mobile (360) + desktop (1440) for S1–S14; motion storyboard frames for S1–S4 | Client sign-off; contrast checks pass; product olive sampled from colour-checked photo; `content/product.json` fully populated for P0 sections |
| **4 Asset preparation** | Shot lists; studio + lifestyle shoots; retouch; customer story films; hero ambient; (v1.5) 3D model + renders; asset register | Each P0 asset meets docs/06 spec; consents on file; asset register 100% for v1 items |
| **5 Project setup** | Astro 6 + TS + Tailwind v4 + GSAP + Lenis; lint/format; tokens → `@theme`; fonts self-hosted; Base layout; `.env.example`; CI (lint, typecheck, build, LHCI stub); Cloudflare Pages project + preview deploys; `check-content.mjs` | `npm run build` passes; preview URL live; LHCI runs on empty shell with perf ≥ 98 |
| **6 Static structure** | All sections as semantic HTML/CSS with real (or flagged missing) content, no motion; variants routing; privacy/terms/disclaimer; thank-you; sticky bar/header (CSS only) | Page complete & readable with JS off; axe no serious issues; CLS ≈ 0; mobile & desktop match designs (static states) |
| **7 Animation system** | `motion/` boot, env, matchMedia contexts, reveal registry, transitions, sequence player (with test frames), analytics hooks for motion events | Reveals work across page; reduced-motion & lowEnd paths verified; no JS errors; initial JS ≤ 90 KB |
| **8 Scroll storytelling** | S1 entrance/scroll-out; S2 (stills v1 / sequence v1.5); S3 diagram; S3→S4 clip; S4 interaction; S5 hotspots; S7 horizontal (D) | Timelines match docs/05 within ±10%; 60 fps on desktop, ≥ 50 fps on Pixel 6a–class, no long tasks > 100 ms during scrub on Moto G Power; keyboard operation of S4/S5 |
| **9 Responsive implementation** | Mobile re-compositions (docs/07 §2.3); tablet check; in-app browser fixes; landscape handling | Visual regression baselines approved at 360/390/768/1024/1440; in-app browser test pass |
| **10 Lead integration** | LeadForm (states, step 2, serviceability), `/api/lead` Function (validation, Turnstile, CRM, WA alerts, confirmation), no-JS fallback, error fallback to WhatsApp | 20 test submissions across devices land in CRM with full attribution; alert to sales ≤ 30 s; rate limit & honeypot verified; failure path shows WhatsApp with prefilled text |
| **11 Analytics** | GTM container, GA4, Google Ads conversions + EC, Meta Pixel + CAPI dedup, consent mode, event taxonomy, UTM capture, offline conversion import procedure (CRM → Ads/Meta) | All events in taxonomy verified in GA4 DebugView; Ads tag diagnostics green; Meta Test Events shows browser+server Lead deduplicated; no PII in GA4 |
| **12 Performance optimisation** | Budget tuning, image/sequence/video re-encodes, font subsetting, third-party deferral tuning | LHCI budgets pass (3 runs); WebPageTest Moto G Power 4G LCP ≤ 2.2 s; CLS ≤ 0.05; TBT ≤ 150 ms |
| **13 QA** | Full checklist (§2); copy/claims legal review; client UAT | Zero P0/P1 bugs open; legal sign-off; client sign-off |
| **14 Deployment** | DNS (`go.lennore.in`), production env secrets, `_headers`, monitoring & alerts, go-live checklist, ad final URLs updated | Production smoke test passes; tracking live-verified with a real test lead; alerts firing to right people; rollback plan documented |
| **15 Conversion optimisation** | Weekly report (CVR, CPQL by variant/source, CWV, section drop-off); A/B tests T1–T4; heatmap-free analysis via section events; copy iterations; v1.5 cinematic release | Test results documented; each test ends with a decision; CPQL trending down |

## 2. Testing & QA checklist (Deliverable 19)

### 2.1 Content & compliance
- [ ] Every number/spec on page traced to `content/product.json` with `source` field; spot-check 100%.
- [ ] No `[MISSING:*]` in production build (CI check).
- [ ] Copy checked against claims policy (docs/11) line by line; legal sign-off recorded.
- [ ] Testimonials: consent forms on file; no health-outcome statements.
- [ ] Company legal name, address, contact correct in footer & schema.
- [ ] Offer dates/terms correct per variant; expired offers auto-hide (`validTill`).
- [ ] Privacy notice matches actual data flows (CRM, WhatsApp, Meta, Google).

### 2.2 Functional
- [ ] All CTAs route correctly (scroll-to-form focuses Name; WA opens with prefill incl. ref; tel dials).
- [ ] Form validation: name (2–60 chars), 10-digit mobile starting 6–9, 6-digit pincode; error messages; paste handling (`+91 98…` normalised).
- [ ] Serviceable vs out-of-area paths.
- [ ] Submit success → step 2 → thank-you state; double-submit prevented; back button safe.
- [ ] API failure → WhatsApp fallback shown with details prefilled; payload retried if possible.
- [ ] No-JS form post works → `/thank-you`.
- [ ] Turnstile invisible for normal users; blocks automated submits.
- [ ] Variants render correct copy/sections; expired offer hidden.
- [ ] Sticky bar show/hide rules; header appears after hero.
- [ ] FAQ accordion; hotspots; pH selector (tap, keyboard, auto-demo interruption).

### 2.3 Motion
- [ ] Each timeline matches docs/05; no overlap/jank between chapters.
- [ ] Pins release correctly; no blank gaps; resize/orientation refresh OK.
- [ ] Fast scroll / fling on mobile: no stuck states, text never left invisible.
- [ ] Reduced motion: no pin/scrub; content complete.
- [ ] lowEnd simulation (`deviceMemory` override, Save-Data): stills path.
- [ ] Sequence: frames load progressively; network throttled scrub still shows nearest frame; no memory crash on 3 GB Android after 5 full scrubs.

### 2.4 Cross-browser/device matrix
| Device | Browser(s) |
|---|---|
| iPhone 12/13 (iOS 17/18/26) | Safari, Instagram in-app, Chrome iOS |
| iPhone SE (small screen) | Safari |
| Samsung A-series (mid-range) | Chrome, Samsung Internet, Facebook in-app |
| Redmi/Realme/Moto G (low-mid) | Chrome, Instagram in-app |
| Pixel 6a/7 | Chrome |
| iPad | Safari |
| Windows laptop | Chrome, Edge, Firefox |
| MacBook | Safari, Chrome |

### 2.5 Accessibility
- [ ] axe-core: 0 serious/critical.
- [ ] Keyboard-only: reach and submit form; operate S4, S5, FAQ, carousels; visible focus.
- [ ] Screen reader (VoiceOver iOS, TalkBack): headings list sensible; pH result announced; form errors announced.
- [ ] Contrast in both themes; text over video/canvas has scrim ≥ 4.5:1.
- [ ] Zoom 200%: no loss of content; no horizontal scroll at 320 px.
- [ ] Videos with speech captioned; autoplay loops have pause (or ≤ 5 s).

### 2.6 Performance
- [ ] LHCI mobile budgets pass (3 runs).
- [ ] WebPageTest Moto G Power / 4G / Mumbai: LCP ≤ 2.2 s; filmstrip shows H1 + CTA by 2 s.
- [ ] LCP element = hero image (verify in DevTools).
- [ ] No long tasks > 200 ms after load; INP interactions (CTA, chip, accordion) < 150 ms.
- [ ] Total transfer after full scroll within budget.
- [ ] Repeat view served from cache.

### 2.7 Tracking
- [ ] GTM preview: every taxonomy event fires once with correct params.
- [ ] GA4 DebugView: `generate_lead` marked key event; custom dimensions populated; no PII.
- [ ] Google Ads: conversion recorded from test click (gclid) ; enhanced conversions status "recording".
- [ ] Meta Test Events: PageView, ViewContent, Lead (browser + server, deduplicated via event_id), Contact.
- [ ] UTMs + click IDs present in CRM lead row; WhatsApp ref code present in prefilled message.
- [ ] Consent reject path: tags respect denial; site works.
- [ ] Offline import dry-run: CRM export format accepted by Google Ads & Meta.

### 2.8 Security & privacy
- [ ] CSP has no violations in console (report-only first week).
- [ ] Rate limit triggers after 5 submits/10 min/IP.
- [ ] Secrets absent from client bundle (`grep` build output).
- [ ] Function logs redact PII.
- [ ] HTTPS/HSTS; security headers score A on securityheaders.com.

### 2.9 Go-live
- [ ] DNS + SSL on final domain; www/non-www and trailing slash redirects consistent.
- [ ] robots/sitemap correct; ad crawlers not blocked.
- [ ] Ads final URLs updated; tracking template tested with real ad preview.
- [ ] Sales team briefed: lead alert format, response SLA, CRM status updates (needed for offline conversions).
- [ ] Monitoring alerts tested (simulate API error).
- [ ] Rollback: previous deploy one-click in Cloudflare Pages.

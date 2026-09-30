# 02 — Product Requirements Document (Deliverable 2)

**Product:** Lennore Ionizer — paid-ads landing page ("LP")
**Owner:** [PM name] · **Status:** Approved for build pending client inputs · **Version:** 1.0

---

## 1. Product overview
A single, mobile-first landing page (plus config-driven campaign variants) that turns paid traffic from Google and Meta into **booked home demos** for Lennore alkaline water ionizers. It presents the machine as a premium kitchen appliance through a scroll-driven visual story, lets the visitor interact with a simulated pH control, answers objections factually, and converts via a 3-field form, WhatsApp or phone.

## 2. Business objectives
| Objective | Metric | Target (first 60 days, to be recalibrated after 2 weeks of data) |
|---|---|---|
| Generate demo leads | Form submits + WhatsApp chats started | CVR ≥ 4% (Search), ≥ 2% (Meta) of sessions |
| Lead quality | % leads reachable and in service area | ≥ 70% |
| Demo booked | Qualified leads → demo scheduled | ≥ 40% |
| Efficient spend | Cost per qualified lead (CPQL) | Baseline in week 2, −20% by week 8 |
| Brand perception | Post-demo survey "premium" score | ≥ 4/5 |
| Speed | Mobile LCP (field, p75) | ≤ 2.5 s |

## 3. Target audience
See docs/01 §3. Primary: Segment A (urban families, Delhi NCR first). Secondary: B (RO upgraders). Tertiary: C (design-led kitchens), D (small offices/clinics — separate `/office` variant).

## 4. Personas

**P1 — Neha, 38, Gurugram.** Marketing manager, two kids, renovated kitchen. Saw an Instagram Reel. On phone, 40 seconds of attention. *Wants:* something good for the family that looks good in her kitchen. *Fears:* gimmick, pushy salesman, a new brand disappearing. *Converts when:* she sees how it works in 2 seconds, sees it installed in a real kitchen, and can WhatsApp a question without a call.

**P2 — Rajesh, 52, Dwarka.** Business owner, already has RO, a friend has a Kangen. Googled "alkaline water machine price". On desktop in the evening. *Wants:* specs, price, comparison, warranty. *Fears:* overpaying. *Converts when:* he sees plates/filter/warranty facts and a "starting from" price, then books a demo to test his own water.

**P3 — Dr. Mehta's clinic admin, Noida.** Wants a water solution for the reception. *Wants:* capacity, installation, service contract. *Converts when:* sees wall-mount option and "office/clinic" demo request.

## 5. User journey
```text
Ad (Reel / Search) → LP hero (≤3 s: what it is + CTA visible)
  → Curiosity: scroll into the machine reveal
  → Understanding: how it works (filter → chamber → two streams)
  → Interaction: "Choose your water" pH selector
  → Evaluation: features, build, installation options, service & warranty, FAQ
  → Reassurance: real customers, company details
  → Action: Book Home Demo (form) | WhatsApp | Call
  → Thank-you: confirmation + WhatsApp auto-message + what happens next
  → Offline: sales call → demo → sale  (status fed back to ad platforms)
```
Escape hatches at every stage: sticky action bar (mobile), header CTA (desktop).

## 6. Conversion goals
| Priority | Action | Tracked as | Value (for bidding, placeholder) |
|---|---|---|---|
| Primary | Demo form submit | `generate_lead` / Meta `Lead` | ₹X |
| Secondary | WhatsApp click-to-chat | `whatsapp_click` / Meta `Contact` | ₹X × 0.5 |
| Secondary | Call click | `phone_click` / Meta `Contact` | ₹X × 0.5 |
| Offline | Qualified lead | offline import `qualified_lead` | ₹X × 3 |
| Offline | Sale | offline import `purchase` | order value |
| Micro | pH selector used, sequence completed, FAQ opened, video 50% | GA4 events | — |

## 7. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Hero shows product image, H1, one-line proposition, primary CTA and WhatsApp CTA within first viewport on 360×640 | P0 |
| FR-02 | Scroll-driven product reveal (image sequence) with HTML copy overlays; static fallback | P0 |
| FR-03 | "How it works" animated diagram with 4–5 stages from spec; keyboard/scroll navigable; static SVG fallback | P0 |
| FR-04 | "Choose your water" interactive pH selector showing only levels in `product.json`, with use-case text and animated reagent-colour glass | P0 |
| FR-05 | Feature showcase with hotspots on sticky product; every hotspot also available as plain list | P0 |
| FR-06 | Installation options (countertop / under-counter / wall-mounted) as supported by product data | P0 |
| FR-07 | Trust block: warranty, service coverage, installation, company identity (legal name, address), certifications only if documented | P0 |
| FR-08 | Social proof: video testimonials (consented) and/or text reviews with name, city, date; hidden entirely if none supplied | P1 |
| FR-09 | FAQ accordion (8–12 Qs) with FAQPage-compatible markup | P0 |
| FR-10 | Lead form: Name, Mobile (+91, 10 digits), Pincode; optional step 2 (Home/Office, preferred time); Turnstile; honeypot; DPDP notice | P0 |
| FR-11 | Lead submission to `/api/lead` → CRM/Sheet + sales WhatsApp alert + lead WhatsApp/SMS confirmation | P0 |
| FR-12 | Pincode serviceability check (client-side list from config); out-of-area → WhatsApp route with message | P1 |
| FR-13 | Sticky action bar on mobile (Book Demo · WhatsApp · Call) after hero leaves view; hides when form is in view or keyboard open | P0 |
| FR-14 | Desktop header with logo + "Book Demo" button appearing after hero | P0 |
| FR-15 | Capture UTM, gclid, gbraid, wbraid, fbclid, fbc, fbp, landing variant, referrer; persist 90 days first-party; attach to lead | P0 |
| FR-16 | Campaign variants from JSON: headline, subhead, offer, CTA label, hero image, section toggles, language | P0 |
| FR-17 | Hindi variant (`/hi`) with Devanagari typography | P1 |
| FR-18 | Thank-you page (`/thank-you`) with next steps, noindex, conversion firing once per lead (dedupe) | P0 |
| FR-19 | Price display module: "Starting from ₹X" / range / EMI — toggleable per variant | P1 |
| FR-20 | Comparison module "Ionizer vs RO with alkaline cartridge" — factual, no competitor names | P1 |
| FR-21 | Privacy policy, terms, disclaimer pages | P0 |
| FR-22 | Consent/cookie notice controlling marketing tags (Consent Mode v2 wiring) | P0 |
| FR-23 | Optional 360° viewer (phase 2, Three.js) behind a "Inspect in 3D" button, lazy-loaded | P2 |

## 8. Non-functional requirements
| ID | Requirement |
|---|---|
| NFR-01 Performance | See §14 — budgets are acceptance criteria |
| NFR-02 Availability | 99.9% (static on CDN); lead API fallback: if API fails, show WhatsApp prefilled link + store payload to retry |
| NFR-03 Security | Turnstile, rate limit 5 submits/IP/10 min, server validation, secrets server-only, CSP, HSTS |
| NFR-04 Privacy | DPDP-aligned notice & consent; no PII to analytics; data retention policy documented |
| NFR-05 Maintainability | All copy/specs in `src/content`; no hard-coded facts in components |
| NFR-06 Browser support | Last 2 versions Chrome, Edge, Safari (iOS 16+), Samsung Internet, Firefox; graceful degradation below |
| NFR-07 Localisation | Content model supports `en` and `hi` |

## 9. UX requirements
- The **first viewport answers "what is it + what do I do"** without scrolling.
- One idea per scroll chapter; reading line ≤ 16 words on mobile per overlay.
- A CTA is never more than one thumb-swipe away (sticky bar).
- Motion stops at decision points (price, form, FAQ).
- Every interactive element has a visible affordance ("Tap a level", "Drag", arrows) and a non-interactive equivalent.
- Scroll progress indicator (thin line) on desktop sequences so users know the chapter length.

## 10. UI requirements
- Design tokens from `design/tokens.json`. Colour story: **Ink (dark) → Clear (light) → Ink**. See docs/04.
- Typography: Display "Sora" (600/700), Body "Inter" (400/500), Devanagari "Mukta" (400/600). Self-hosted, subset, `font-display: swap`, metric-matched fallbacks to avoid CLS.
- Glass/soft UI used only for: hotspot popovers, pH display, sticky bar. Not for every card.
- Product photography always on true-to-life colour; glow effects never tint the product itself.
- Iconography: custom line icons (1.5 px stroke) in SVG sprite.

## 11. Animation requirements
Full spec in docs/05. Must-haves: hero entrance ≤ 1.2 s; one pinned sequence (product reveal), one pinned diagram (how it works), sticky hotspot showcase, dark→clear clip transition, pH selector state animation, micro-interactions on CTAs and form. Reduced-motion mode mandatory.

## 12. Accessibility
WCAG 2.2 AA: contrast ≥ 4.5:1 body / 3:1 large; focus visible; skip link; landmarks; one H1; form labels + inline errors with `aria-describedby`; `aria-live` for submit status; captions on videos with speech; pause control for any autoplay > 5 s; hotspot and pH selector keyboard operable (arrow keys, Enter/Space); no information conveyed by colour alone (pH levels have labels).

## 13. Mobile requirements
docs/07 §2. Key: 360–430 px primary design width; `svh/dvh` units; native scroll; 60-frame sequences; tap hotspots → bottom sheet; sticky action bar; form with `inputmode="numeric"` and autocomplete; no hover-dependent content.

## 14. Performance requirements
| Metric | Mobile (p75 field / lab Moto G Power 4G) | Desktop |
|---|---|---|
| LCP | ≤ 2.5 s field / ≤ 2.2 s lab | ≤ 1.5 s |
| CLS | ≤ 0.05 | ≤ 0.05 |
| INP | ≤ 150 ms | ≤ 100 ms |
| TTFB | ≤ 400 ms (CDN) | ≤ 200 ms |
| Initial JS (gz) | ≤ 90 KB | ≤ 110 KB |
| Above-fold transfer | ≤ 450 KB | ≤ 700 KB |
| Total page weight after full scroll | ≤ 4 MB | ≤ 9 MB |
| Lighthouse Performance (lab) | ≥ 90 | ≥ 95 |

## 15. SEO
docs/08 §1. Indexable canonical `/`; campaign variants `noindex, follow` with canonical to `/`. Product + Organization + FAQPage structured data (Product only with real data; no fake ratings).

## 16. Analytics
GA4 via GTM; event taxonomy in docs/08 §3; scroll depth 25/50/75/90; section views; interaction events.

## 17. Conversion tracking
Google Ads (form submit + enhanced conversions for leads; click-to-WhatsApp/call as secondary), Meta Pixel + Conversions API with `event_id` dedup, offline conversion import from CRM for qualified leads and sales.

## 18. Technical requirements
docs/03. Astro 6 static, TypeScript, Tailwind v4, GSAP (+ScrollTrigger, SplitText), Lenis (desktop), Cloudflare Pages + Functions, Turnstile, GTM.

## 19. Asset requirements
docs/06. Critical path: product photography set + 3D model/renders + one real kitchen installation shoot.

## 20. Acceptance criteria (release gate)
- [ ] All P0 functional requirements pass Playwright e2e on Chrome Android emulation, iPhone Safari (real device), desktop Chrome/Safari/Firefox.
- [ ] Performance budgets met in Lighthouse CI (mobile preset) on 3 consecutive runs and in WebPageTest (Moto G Power, 4G, Mumbai).
- [ ] No `[MISSING:*]` badges in production build; no fact on page absent from `content/`.
- [ ] Copy signed off against docs/11 by Lennore and reviewed by counsel.
- [ ] Test lead flows end-to-end: form → CRM row → sales WhatsApp alert → lead confirmation → GA4 `generate_lead` → Google Ads test conversion → Meta Test Events (browser + server, deduplicated).
- [ ] Reduced-motion mode fully usable; keyboard-only journey completes the form.
- [ ] axe-core: zero serious/critical violations.
- [ ] Variant routes render correct copy; UTMs persist into lead payload.
- [ ] Privacy policy live and linked from form notice.

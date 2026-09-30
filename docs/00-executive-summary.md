# 00 — Executive Summary

**Project:** Paid-ads landing page for Lennore alkaline water ionizers
**Client entity:** Lennore India Private Limited (incorporated 29 Mar 2024, Delhi) · lennore.in · info@lennore.in
**Date:** 29 Sep 2026 · **Version:** 1.0

---

## 1. The ten decisions that shape everything

| # | Decision | Why (short) | Detail |
|---|---|---|---|
| 1 | **Astro 6 static site + GSAP/ScrollTrigger + canvas image sequences.** No Next.js, no Three.js in v1. | Ships near-zero JS by default → fastest possible ad landing; GSAP is now free incl. all plugins; canvas sequences give "3D" feel at a fraction of WebGL cost. | docs/03 |
| 2 | **"3D offline, 2D online."** Build (or commission) a 3D model once, render it to image sequences and stills in Blender. Browser never loads a GLB in v1. | Same cinematic result, predictable performance on mid-range Android, no WebGL debugging. | docs/06 §3 |
| 3 | **Primary CTA = "Book a Free Home Demo."** Secondary = WhatsApp. Tertiary = Call. | Category price band in India is roughly ₹65k–₹1.5L+ → considered purchase, consultative sale; a live pH demo at home is the strongest proof. | docs/01 §2, docs/02 §6 |
| 4 | **Claims-safe positioning: control, taste, design, service — not disease.** | Health/disease claims = likely Google/Meta disapproval and possible breach of India's Drugs & Magic Remedies Act. | docs/11 |
| 5 | **Narrative device: "Choose your water."** The page lets the user *set* a pH level on a simulated machine display and see the water respond (reagent-drop colour change, use-case). | Demonstrates rather than describes; factual (pH is measurable); maps to the real home demo. | docs/04 §3 |
| 6 | **Dark → clear → dark colour story.** Page opens near-black (raw water, unknown), moves through the machine, and "clears" into a light section at the moment water is output, returning to dark for the conversion close. | Colour transition *is* the purification metaphor; avoids "just another dark tech site". | docs/04, design/tokens.json |
| 7 | **Separate mobile motion system**, registered with `gsap.matchMedia()`. Native scroll on touch, fewer frames, tap hotspots, sticky bottom action bar. | Most Indian Meta/Google traffic is mobile, mid-range Android. | docs/07 §2 |
| 8 | **One codebase, config-driven variants** (`/demo`, `/hi`, `/office`, offer variants) — no per-campaign forks. | Message-match per campaign without maintenance debt; enables A/B testing at the edge. | docs/08 §4 |
| 9 | **Server-side conversion tracking** (Meta CAPI + Google Ads enhanced conversions for leads + offline conversion import of qualified leads/sales). | Browser tracking alone under-reports; optimising ads on *qualified* leads matters more than raw leads for a high-ticket product. | docs/08 §2 |
| 10 | **Two-speed launch:** v1 "fast lane" (photos + motion graphics, ~3 weeks) → v1.5 "cinematic" (rendered sequences, ~+2–3 weeks). | Asset production is the critical path; Diwali (8 Nov 2026) is the key appliance-buying window. | docs/09 |

---

## 2. What we know about Lennore (from public sources)

- Lennore sells **alkaline water ionizer machines**, positioned on durability, compact design, "advanced filtration", budget-friendly pricing and trustworthy service.
- Installation: **countertop, under-the-counter (the site text reads "UTC") or wall-mounted**.
- Contact email: info@lennore.in. Social: Pinterest "lennore_offical" (sic); content theme "switch to alkaline water".
- Company: Lennore India Pvt. Ltd., Delhi, incorporated March 2024 — **a young brand**. Trust building (service, warranty, demo, real customers) must carry the weight that brand history can't yet.

## 3. What we could NOT verify (blocking inputs)

lennore.in disallows automated access, so the following were not captured and are **placeholders** in `content/product.json`:

- Model names, number of models, plate count/material, pH range, ORP, flow rate, filter type & life, power, dimensions, weight
- Prices, offers, EMI
- Product photography, current colour values, logo files, fonts
- Warranty terms, service coverage (cities), installation process
- Certifications / test reports, customer counts, reviews
- Phone / WhatsApp number, address

→ `client-intake/asset-request-checklist.md` lists everything to request.

## 4. Top risks

| Risk | Impact | Mitigation |
|---|---|---|
| Health claims on page / in creatives | Ad disapprovals, account restriction, legal exposure | Claims policy (docs/11), legal review of copy before launch |
| No high-quality product assets | Page looks generic; cinematic sections impossible | Early product shoot + 3D model (docs/06); v1 fast lane doesn't depend on renders |
| Heavy motion on low-end Android | Slow LCP, janky scroll, wasted ad spend | Budgets as acceptance criteria; mobile-specific system; LCP = static image |
| Specs unknown / unverifiable | Can't write feature or how-it-works sections accurately | Single JSON source of truth, hide-if-missing components |
| Lead quality (price shock at demo) | High CPL-to-sale ratio | "Starting from ₹X" or price-range disclosure option; qualify with pincode + home/office; feed qualified-lead signal back to ads |

## 5. Open questions for Lennore (answer before Phase 3)

1. How many models will be advertised? Photos show **L9, L5, L5+RO, L7+RO**. The default is L9 as hero, with the rest in an optional "Choose your model" section.
2. Is the business model demo-led (sales visit), direct online sale, dealer network, or mixed?
3. Service coverage: which cities/pincodes can get a home demo and installation?
4. Will price be shown on the page? (Recommended: "starting from" or range, to pre-qualify.)
5. Current offers for the Diwali window? EMI partners?
6. Is the unit manufactured in-house or sourced from an OEM (Korea/China/India)? If OEM, can the OEM supply CAD/STEP files and test reports?
7. Filter: what does it remove, and is there a lab test report (NABL-accredited lab preferred)?
8. Warranty: machine, plates, filter — terms in writing.
9. Do you have real customers willing to appear in video (with written consent)?
10. Hindi landing variant needed at launch?

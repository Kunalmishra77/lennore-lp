# 08 — SEO, Analytics, Conversion Tracking & Ad Architecture (Deliverables 16, 17)

## 1. SEO strategy (Deliverable 16)

The page's job is paid conversion; SEO work ensures (a) clean indexing of one canonical page, (b) rich previews when shared on WhatsApp/social, (c) Google Ads landing-page quality signals (relevance, transparency, speed).

### 1.1 Meta (default `/`)
| Tag | Value (draft — ≤ 60 / ≤ 155 chars) |
|---|---|
| `<title>` | Lennore Alkaline Water Ionizer — Book a Free Home Demo |
| `meta description` | Filtered, ionized water at your tap with adjustable pH levels. See Lennore work with your own tap water — book a free home demo. *(adjust to verified facts & cities)* |
| `canonical` | `https://go.lennore.in/` |
| `robots` | `index, follow` on `/`; `noindex, follow` on variants; `noindex, nofollow` on `/thank-you` |
| `theme-color` | `#07100C` |
| `lang` | `en-IN` (`hi-IN` on `/hi`) |

### 1.2 Open Graph / X
```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="Lennore">
<meta property="og:title" content="Lennore Alkaline Water Ionizer">
<meta property="og:description" content="Choose your water. Book a free home demo.">
<meta property="og:image" content="https://go.lennore.in/og/og-default.jpg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
```
WhatsApp uses OG tags — test preview by sharing the URL.

### 1.3 Structured data (JSON-LD)
- `Organization`: name "Lennore India Private Limited", url, logo, email, telephone, address, sameAs (social).
- `Product`: name, image, description, brand — **offers only if price is shown**; **no `aggregateRating` unless from verifiable first-party reviews displayed on page** (Google policy; fake/self-serving ratings risk manual action).
- `FAQPage`: from S12 (still useful for Bing/AI answers even though Google limits FAQ rich results).
- `BreadcrumbList`: not needed (single page).

### 1.4 Semantic HTML & headings
```text
h1  Water, set by you.                     (S1 — only one h1)
h2  Designed for your countertop          (S2 section title, visually may be overlay)
h2  How Lennore works                     (S3)   h3 × 5 stages
h2  Choose your water                     (S4)
h2  Features                              (S5)   h3 per feature
h2  Built to last                         (S6)
h2  Fits your space                       (S7)   h3 per installation type
h2  Ionizer vs RO with alkaline cartridge (S8)
h2  Service & warranty                    (S9)
h2  Customer stories                      (S10)
h2  Pricing                               (S11)
h2  Frequently asked questions            (S12)  h3/summary per question
h2  Book a free home demo                 (S13)
```
Pinned chapter text is real HTML (not canvas), so it's indexable.

### 1.5 Image alt text
Descriptive, factual, no keyword stuffing. e.g. "Lennore water ionizer on a kitchen countertop, touch display showing a pH level". Decorative images `alt=""`. Canvas `aria-label` summarises the sequence.

### 1.6 Sitemap & robots
- `@astrojs/sitemap` filtered to `/`, `/privacy`, `/terms`, `/disclaimer` (and `/hi` if indexable).
- `robots.txt`: `Allow: /`; `Disallow: /thank-you`, `/api/`; `Sitemap:` line. **Do not block AdsBot-Google or facebookexternalhit** — ad review crawlers must reach the page (note: lennore.in's current robots rules blocked our research tool; check they don't also block ad crawlers on the main site).
- Preview deployments: `X-Robots-Tag: noindex` via `_headers`.

### 1.7 Relationship with lennore.in
Link from main site nav ("Book a demo") to the LP; LP footer links back to lennore.in. Canonical of LP stays on LP (it's a distinct page, not duplicate).

---

## 2. Analytics & conversion tracking (Deliverable 17)

### 2.1 Architecture
```text
Browser                                   Edge (Cloudflare Pages Function /api/lead)          Platforms
───────                                   ─────────────────────────────────────────          ─────────
attribution.ts  → captures UTM/click IDs  ┐
analytics.ts    → dataLayer.push(events)  │→ GTM (web) → GA4, Google Ads tag, Meta Pixel ──→ GA4 / Google Ads / Meta
LeadForm        → POST /api/lead ─────────┘                                                   
                  (payload + attribution + event_id)
                                          → validate, Turnstile, save to CRM
                                          → Meta Conversions API: Lead (event_id = same) ────→ Meta (dedup with Pixel)
                                          → return lead_ref
thank-you / success state → dataLayer 'generate_lead' {event_id, lead_ref}
                          → Google Ads conversion w/ enhanced conversions (hashed email/phone via GTM user-provided data)
CRM (daily/real-time)                     → Offline conversion import: qualified_lead / sale by gclid/gbraid ─→ Google Ads
                                          → Meta CAPI: QualifiedLead / Purchase (with fbc/fbp, phone hash) ─→ Meta
```

### 2.2 Tools & setup
| Tool | Setup |
|---|---|
| **GTM (web)** | One container. Triggers from custom `dataLayer` events only (no fragile click-class triggers). Consent Mode v2 defaults set before GTM loads. |
| **GA4** | Config tag; custom dimensions: `landing_variant`, `section_id`, `cta_location`, `ph_level`, `interaction_type`; key events: `generate_lead`, `whatsapp_click`, `phone_click`. Enable Google Signals only if consent obtained. |
| **Google Ads** | Conversion actions: *Lead form submit* (primary, with enhanced conversions for leads), *WhatsApp click* (secondary), *Phone click* (secondary), *Qualified lead* (offline import, primary for bidding once volume ≥ 30/month), *Sale* (offline, value). Auto-tagging ON (gclid). Conversion linker tag. |
| **Meta Pixel + CAPI** | Pixel via GTM (PageView, ViewContent on S4 interaction, Lead on submit, Contact on WhatsApp/call). CAPI from Function with same `event_id` for Lead. Advanced matching: hashed phone (SHA-256, E.164 normalised) server-side only. Set up Meta **Aggregated Event Measurement** priority if required. |
| **UTMs** | Mandatory naming convention (§2.4). |
| **Cloudflare Web Analytics** | Cookieless RUM for CWV (independent of consent). |

### 2.3 Consent
- Banner (bottom, non-blocking) with Accept / Reject / Preferences. Default state: analytics & ads storage **denied** until accept (conservative under DPDP; Consent Mode v2 cookieless pings still model conversions).
- Server-side lead events (CAPI, offline imports) rely on the **lead form notice & consent** (the user submitted their number to be contacted about a demo); disclose ad-platform measurement in the privacy notice. Legal to confirm wording.

### 2.4 UTM & naming convention
```text
utm_source   = google | meta | youtube | whatsapp | email
utm_medium   = cpc | paid_social | video | organic_social
utm_campaign = lnr_{objective}_{geo}_{yyyymm}          e.g. lnr_lead_ncr_202610
utm_content  = {creative_id}_{format}                   e.g. c014_reel_ph-demo
utm_term     = {keyword} (Search, via {keyword} ValueTrack)
Meta dynamic: utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
Google: auto-tagging + tracking template {lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={_campaign}&utm_term={keyword}&utm_content={creative}&gad_cid={campaignid}
```
**Ad set and creative** reach the CRM via `utm_term` (Meta ad set name) and `utm_content` (ad name / creative id).

### 2.5 Attribution capture (`attribution.ts`)
- On first page view: read URL params `utm_*`, `gclid`, `gbraid`, `wbraid`, `fbclid`; build `fbc` = `fb.1.{timestamp}.{fbclid}` if `_fbc` cookie absent; read `_fbp`.
- Store first-touch and last-touch in first-party `localStorage` (try/catch) + cookie `lnr_attr` (90 days, `SameSite=Lax`, `Secure`) — used only for attaching to the lead, not for tracking across sites.
- Attach to every lead + WhatsApp prefilled message ref code (e.g. "Ref: LNR-8F2K") so WhatsApp leads can be attributed in CRM.

## 3. Event taxonomy

All events via `analytics.track()`. Common params: `landing_variant`, `page_location`, `device_context` (mobile/desktop/reduced).

| Event | When | Key params | GA4 | Ads | Meta |
|---|---|---|---|---|---|
| `page_view` | load | — | ✓ | — | PageView |
| `cta_click` | any Book Demo button | `cta_location` (hero/header/sticky/s3/s4/s11/s13), `cta_label` | ✓ | — | — |
| `whatsapp_click` | WA link | `cta_location` | ✓ key | secondary conv | Contact |
| `phone_click` | tel link | `cta_location` | ✓ key | secondary conv | Contact |
| `form_view` | S13 ≥ 50% visible | — | ✓ | — | — |
| `form_start` | first field focus | — | ✓ | — | — |
| `form_error` | validation/server error | `field`, `error_type` | ✓ | — | — |
| `form_submit` | submit attempt | — | ✓ | — | — |
| `generate_lead` | server 200 | `event_id`, `lead_ref`, `serviceable` | ✓ key | **primary conv** + EC | Lead (dedup w/ CAPI) |
| `form_step2_submit` | optional details | `segment`, `preferred_time` | ✓ | — | — |
| `out_of_area` | pincode not served | `pincode_prefix` (3 digits only) | ✓ | — | — |
| `section_view` | section 50% visible (once) | `section_id` | ✓ | — | — |
| `sequence_progress` | S2 25/50/75/100% | `percent` | ✓ | — | — |
| `diagram_complete` | S3 reached stage 5 | — | ✓ | — | — |
| `ph_select` | pH chip selected | `ph_level`, `method` (auto/tap/key) | ✓ | — | ViewContent (first only) |
| `hotspot_open` | feature hotspot | `feature_id` | ✓ | — | — |
| `faq_open` | question expanded | `question_id` | ✓ | — | — |
| `video_start` / `video_progress` / `video_complete` | testimonials, reagent | `video_id`, `percent` (25/50/75) | ✓ | — | — |
| `scroll_depth` | 25/50/75/90 | `percent` | ✓ | — | — |
| `sticky_cta_click` | mobile bar | `button` | ✓ | — | — |

**Never include** name/phone/pincode (full)/email in any event params.

## 4. Advertising landing-page architecture

### 4.1 Build: one page + config-driven variants
- **One codebase, one component set.** Variants are JSON files (`src/content/variants/*.json`) generating static routes. Each can override: hero copy/image, CTA label, offer block, section toggles/order (limited), language, WhatsApp prefill text.
- **Why not dynamic (client-side) content swapping by UTM?** Causes flicker/CLS, hurts LCP, and complicates ad review (reviewer may see different content). Static routes are fast and deterministic. *Exception:* minor text insertion (e.g., city name from `?city=`) allowed only server-side at the edge in phase 2.

### 4.2 Launch variants
| Route | Traffic | Message match |
|---|---|---|
| `/` or `/demo` | Google Search (generic + category terms) | "Alkaline water ionizer — book free home demo" |
| `/` (visual-first) | Meta Reels / YouTube | "Choose your water" hook; S4 moved up? — test (see §4.4) |
| `/hi` | Hindi-speaking audiences (Meta) | Hindi copy |
| `/office` | Search: "water ionizer for office/clinic" | Capacity, wall-mount, service |
| `/offer/diwali` | Seasonal (Oct–Nov 2026) | Offer banner + deadline |

### 4.3 Google Ads specifics
- Search campaigns: tight ad groups (ionizer / alkaline water machine / kangen alternative *(no competitor trademark in ad text)* / price intent). Final URL per ad group → matching variant.
- Landing-page experience: fast, relevant, transparent (company details, contact, privacy policy visible) — all built in.
- **Policy:** no health claims in ads, sitelinks, or page. Keep "Kangen" out of ad copy (trademark); can bid on it only if policy/legal allows — decide with client.
- Use lead form conversion (with enhanced conversions) as primary until offline qualified-lead volume supports switching bidding to qualified leads.

### 4.4 Meta Ads specifics
- Traffic lands mostly in the in-app browser → mobile budgets matter most.
- Optimise for `Lead` (website) with CAPI; later for QualifiedLead custom conversion.
- Consider **Click-to-WhatsApp ads** as a parallel funnel (not this page), and compare CPQL.
- Creatives from the same asset system (reagent test, pH selector screen recording, installation shots).

### 4.5 A/B testing plan
Method (v1): **ad-level split** — duplicate ads pointing to variant URLs `/?v=a` style is avoided; instead distinct routes (`/demo` vs `/demo-b`), equal budgets, same audience. Phase 2: edge split (Pages Function middleware assigns sticky cookie, serves variant HTML, logs `experiment_id`) — no client-side testing tools (flicker, weight).

| # | Hypothesis | Variant | Primary metric | Min sample |
|---|---|---|---|---|
| T1 | Showing "starting from" price raises qualified-lead rate | price visible vs hidden | CPQL | ~100 leads/arm |
| T2 | "Book a Free Home Demo" vs "Test Your Water at Home — Free" | CTA label | Lead CVR | ~100 leads/arm |
| T3 | Choose-Your-Water moved to position 2 for Meta traffic | section order | Lead CVR, S4 engagement | ~100 leads/arm |
| T4 | 1-step (3 fields) vs 1-step + WhatsApp-first CTA | form vs WA-first | Leads + WA chats combined, CPQL | — |

Decide on CPQL (from CRM), not raw CVR.

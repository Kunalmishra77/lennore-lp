# 04 — Sitemap, Wireframe & Section-by-Section UX Blueprint (Deliverables 5, 6)

## 1. Sitemap

```text
go.lennore.in/
├── /                    Default (EN) — indexable canonical
├── /demo                Search campaigns: "book demo" message match      (noindex, canonical → /)
├── /hi                  Hindi variant                                     (noindex*, canonical → / or self if SEO wanted)
├── /office              Offices / clinics / gyms                          (noindex)
├── /offer/<slug>        Seasonal offer variants (e.g. /offer/diwali)      (noindex)
├── /thank-you           Post-submit, conversion page                      (noindex, nofollow)
├── /privacy             DPDP notice & privacy policy
├── /terms
├── /disclaimer          Claims & usage disclaimer
└── /404
```
*Decide with client whether `/hi` should be indexable (self-canonical + `hreflang`).

## 2. Improved page wireframe (vs brief §28)

Changes from the brief's draft: **no loading experience** (hurts LCP and ad Quality Score); "Technology" merged into How It Works; added the signature **Choose Your Water** interaction; added **Fits Your Space** (installation — a real Lennore differentiator); added **Comparison** and **Pricing** (key for high-ticket paid traffic); Lifestyle is woven into sections rather than a standalone gallery.

```text
LANDING PAGE  (theme: INK → INK → INK → CLEAR → CLEAR → CLEAR → INK)
│
├── [Sticky] SiteHeader (desktop, appears after S1)   ·  StickyActionBar (mobile, after S1)
│
├── S1  HERO — "Water, set by you."                                   INK
│   ├── Product visual (static LCP image; ambient loop video after load)
│   ├── Eyebrow · H1 · Sub (one line)
│   ├── CTA: Book a Free Home Demo  ·  WhatsApp us
│   └── Proof chips (only verified): e.g. "Home demo in Delhi NCR" · "X-year warranty"
│
├── S2  PRODUCT REVEAL — pinned image sequence (3 chapters)           INK
│   ├── Ch1 Design       — "A countertop appliance, not a gadget."
│   ├── Ch2 Display      — "Every level on one touch display."
│   └── Ch3 Inside       — "Filter. Chamber. Two streams." (cutaway begins)
│
├── S3  HOW IT WORKS — pinned SVG flow (5 stages)                      INK→(deep green)
│   ├── 1 Tap water in
│   ├── 2 Filtration (per spec)
│   ├── 3 Electrolysis chamber (plates per spec)
│   ├── 4 Two streams: alkaline & acidic
│   └── 5 Your level, at the tap
│
├── ── CLIP TRANSITION: "the water clears" (INK → CLEAR) ──
│
├── S4  CHOOSE YOUR WATER — interactive pH selector (signature)        CLEAR
│   ├── Simulated machine display (levels from product.json)
│   ├── Reagent-drop glass changes colour
│   └── Use-case text per level (from manual)
│
├── S5  FEATURE SHOWCASE — sticky product + hotspots                   CLEAR
│   └── 4–6 features (from spec) + list fallback
│
├── S6  BUILT TO LAST — materials & maintenance facts                  CLEAR
│   └── Plates · Filter life · Auto-cleaning (if spec) · Warranty
│
├── S7  FITS YOUR SPACE — installation options                        CLEAR
│   └── Countertop · Under-counter · Wall-mounted (real kitchen photos)
│
├── S8  IONIZER vs RO + ALKALINE CARTRIDGE — factual comparison        CLEAR
│
├── ── TRANSITION: CLEAR → INK (soft gradient wipe) ──
│
├── S9  SERVICE & TRUST — who we are, warranty, service, installation  INK
├── S10 CUSTOMER STORIES — video-first testimonials (hidden if none)   INK
├── S11 PRICING / OFFER — starting price, EMI, offer (variant toggle)  INK
├── S12 FAQ                                                            INK
├── S13 BOOK YOUR DEMO — form + WhatsApp + Call                        INK (green glow)
└── S14 FOOTER — company details, legal links, disclaimer              INK
```

## 3. Section-by-section storyboard

> Copy shown is **draft**; final copy in docs/11 after spec confirmation. `{…}` = value from `product.json`.

---

### S1 — Hero · "Water, set by you."
| Field | Spec |
|---|---|
| Purpose | Instant recognition: premium ionizer for the home; get a demo. |
| User psychology | Ad click = curiosity + scepticism. In 3 s they must confirm "this is the thing from the ad" (message match) and see it's premium (visual) and low-risk (free demo). |
| Content | Eyebrow: "Lennore Alkaline Water Ionizer". H1 (≤ 6 words): "Water, set by you." Sub (≤ 18 words): "Filtered and ionized at your tap — choose the pH level for drinking, cooking and cleaning." (only if product has those levels). CTAs. 2–3 proof chips (verified only). |
| Images | Product hero, 3/4 front angle, on near-black with soft rim light; mobile portrait crop (product centred lower-third so H1 sits above). |
| Video | Ambient loop 6–8 s: slow light sweep across machine, water stream from spout catching green rim light. Swapped in after `load` on capable devices; never the LCP. |
| Animation | CSS-only entrance: H1 words rise 12 px + fade (stagger 60 ms, total ≤ 700 ms); product fades up from 0.96 scale; glow fades in. Scroll: product scales 1 → 0.85 and drifts up as S2 pins (hand-off). |
| Scroll behaviour | Not pinned. At 60% scroll-out, header/sticky bar appear. |
| CTA | Primary "Book a Free Home Demo" → scrolls to S13 (smooth, focus first field). Secondary "WhatsApp us" → wa.me with prefilled message incl. variant. |
| Mobile | 100svh. Stack: eyebrow, H1 (40–44 px), sub, CTAs full-width stacked, product image fills lower 55%. No video on `saveData`/slow connection. |
| Desktop | Split: copy left (5 cols), product right (7 cols) with glow; video fills right. Magnetic primary button (subtle, 6 px max). |
| Transition → S2 | Product image cross-dissolves into frame 1 of the reveal sequence (same framing — **render frame 1 to match hero still exactly**). |

---

### S2 — Product Reveal (pinned sequence, 3 chapters)
| Field | Spec |
|---|---|
| Purpose | Show the machine as a designed object: form, display, then inside. Replaces "product introduction" cards. |
| User psychology | Scroll = control. Letting the user "turn" the product builds perceived quality and time-on-page (a Quality Score signal). |
| Content | 3 chapter overlays, each ≤ 12 words + one supporting line. Ch1 Design: "Made for the countertop." Ch2 Display: "Every level, one touch away." (only if touch display per spec). Ch3 Inside: "Filter, chamber, two streams." |
| Images | Sequence: 120 frames desktop / 60 mobile. Camera orbits ~70° from front-3/4 to side, pushes in to display, then machine casing fades to reveal internal filter + electrolysis chamber (cutaway). Rendered from 3D model (v1.5). **v1 fast-lane fallback:** 3–4 hi-res stills with GSAP crossfades + subtle Ken Burns. |
| Video | None (sequence instead). |
| Animation | Pin 300% viewport (desktop) / 220% (mobile). Frames scrubbed (`scrub: 0.5`). Chapter text: SplitText line reveal in, fade out; progress line top. |
| Scroll behaviour | Pinned; chapters at 0–33 / 33–66 / 66–100%. |
| CTA | None inside pin (don't interrupt). Sticky bar remains. |
| Mobile | Text overlays at bottom on gradient scrim; 60 frames 900 px; pin 220% so it doesn't feel endless. Low-end/reduced motion → 3 static images stacked with captions. |
| Desktop | Text left column, canvas right 60%. Lenis smoothing. |
| Transition → S3 | Final cutaway frame's internal components are framed identically to the S3 diagram's layout → canvas fades out as SVG line-art draws over the same positions ("product → diagram"). |

---

### S3 — How It Works (pinned SVG flow)
| Field | Spec |
|---|---|
| Purpose | Make the mechanism understood in 20 s; differentiate from "alkaline cartridge" RO. |
| User psychology | Understanding reduces perceived risk and justifies price. |
| Content | 5 stages, each: number, 3–5 word title, one sentence. Stage texts must match spec: (1) Tap water enters. (2) {filter.type} removes {filter.claims — only per report}. (3) In the chamber, {plates} {plateMaterial} plates apply a low DC current (electrolysis). (4) Water separates into an alkaline stream and an acidic stream. (5) You choose the level on the display; the right stream reaches the spout. |
| Images | Inline SVG: stylised side section of the machine; water path as animated gradient stroke; plates as vertical bars; ion particles (tiny circles) drift to plates. |
| Video | Optional 10 s motion-graphics MP4 for social reuse (not on page). |
| Animation | Pin 250%. Water path `stroke-dashoffset` draws stage by stage; active stage label highlights; particles animate only in stage 3–4 (≤ 40 SVG circles, transform only). Background deepens from ink to deep green. |
| Scroll behaviour | Pinned, 5 steps with snap-to-step (`snap: 1/4`, short duration) on desktop; mobile no snap. |
| CTA | End of pin: inline text link "See it with your own tap water → Book a demo". |
| Mobile | Vertical diagram (water flows top→bottom), stage text below diagram in a single swapping block; pin 200%. Reduced motion → static diagram + numbered list. |
| Desktop | Diagram centre-left, stage list right with active indicator. |
| Transition → S4 | **Signature clip transition:** the alkaline stream exits the spout and a circular clip-path expands from the spout point, turning the page from INK to CLEAR ("the water clears"). |

---

### S4 — Choose Your Water (signature interaction)
| Field | Spec |
|---|---|
| Purpose | Let users *operate* the product. Demonstrates the core differentiator (adjustable levels) without any health claim. |
| User psychology | Interaction → ownership feeling ("IKEA effect"); memorable; mirrors the real home demo with reagent drops. |
| Content | Heading: "Choose your water." Instruction: "Tap a level." Per level (from product.json → phLevels): display label, pH value (as stated in manual), stream, recommended use (from manual), "For drinking: yes/no" (from manual). Footnote: "pH values vary with source water. Your demo tests your own tap water." |
| Images | UI: simulated circular display (SVG) modelled on the real machine display; glass of water (SVG) with reagent drop; side icons for use-case (glass, pot, spray). |
| Video | Optional: 6 s close-up of real reagent test (real footage builds trust — shot at demo). |
| Animation | On select: display ring rotates to level (spring ease 400 ms), number counts to value, reagent drop falls, colour blooms in glass (radial gradient 600 ms), use-case text crossfades. Auto-demo: on first view, cycles through 3 levels once (can be interrupted), then waits for user. |
| Scroll behaviour | Not pinned (interaction needs freedom). Section centred, min-height 100svh. |
| CTA | Below: "Test your own water at home — Book a Free Demo". |
| Mobile | Display on top, level chips as horizontal scroll-snap row (44 px targets), glass below. |
| Desktop | Display left, glass centre, use-case right. Keyboard arrows. |
| Transition → S5 | Glass slides out left as the product (clear-theme hero still) slides in from right and becomes sticky. |

---

### S5 — Feature Showcase (sticky product + hotspots)
| Field | Spec |
|---|---|
| Purpose | Surface 4–6 concrete features from spec (e.g., display, levels, filter indicator, auto-clean, spout, dimensions). |
| User psychology | Evaluators (P2) need specifics; hotspots let them self-direct. |
| Content | Each feature: title (≤ 4 words), one-line benefit ("so what"), spec value with unit. |
| Images | Clean product still on light background (front + side), close-up crops per feature (for zoom). |
| Animation | Desktop: product sticky (CSS sticky) on left; feature blocks scroll on right; as each enters, corresponding hotspot pulses, a connector line draws (SVG) from hotspot to text, and product zooms/pans slightly toward that area (transform on the image, max 1.25×). Mobile: product sticky at top 45svh; feature cards swipe horizontally under it; tapping a hotspot jumps to card. |
| CTA | After last feature: secondary "Get full specifications on WhatsApp" (sends spec PDF). |
| Mobile/Desktop | As above. Fallback list always in DOM (visually hidden when hotspots active? No — keep list as the actual content; hotspots are enhancement). |
| Transition → S6 | Product scales down and moves to a corner as a "materials" macro close-up fades in. |

---

### S6 — Built to Last
| Field | Spec |
|---|---|
| Purpose | Justify price; answer "new brand — will it last?" with materials, maintenance, warranty. |
| Content | 3–4 fact tiles *with sources*: plates ({count}, {material}), filter ({life} litres / indicator), cleaning ({auto-clean if spec}), warranty ({terms}). Lennore's "Built to last" message. |
| Images | Macro photos/renders: plates, filter cartridge, display. |
| Animation | Tiles reveal with mask (clip-path inset from bottom), numbers count-up once. Macro images subtle parallax (±20 px). |
| Mobile | 1-column tiles; images 16:10. |
| Transition → S7 | Horizontal intro line "Fits your space." slides in. |

---

### S7 — Fits Your Space (installation)
| Field | Spec |
|---|---|
| Purpose | Show it installed in real Indian kitchens/offices; handle "where will it go?" objection. |
| Content | 3 panels (only those supported): Countertop, Under-counter, Wall-mounted — each with one line on when to choose it + "Installation by Lennore technicians" (if true). |
| Images | Real installation photography in 3 settings (see docs/06). |
| Animation | Desktop: pinned horizontal scroll (3 panels, 200%). Mobile: native horizontal scroll-snap carousel with dots; no pin. |
| CTA | "Which fits your kitchen? Ask on WhatsApp" (sends photo-of-kitchen prompt). |
| Transition → S8 | Panels settle; comparison table fades up. |

---

### S8 — Ionizer vs RO with alkaline cartridge
| Field | Spec |
|---|---|
| Purpose | Address the cheapest alternative honestly. |
| Content | 5 rows, factual: How alkalinity is produced (electrolysis vs mineral cartridge); Adjustable levels (yes/number per spec vs typically fixed); Acidic water output (yes vs no); Filtration (per Lennore spec vs RO membrane — be fair: RO reduces TDS; recommend pairing guidance if Lennore offers); Typical use. No brand names. Legal review required. |
| Animation | Rows reveal sequentially; Lennore column has subtle green highlight. |
| Mobile | Two stacked cards or a 2-column compact table with sticky header. |
| Transition → S9 | Soft gradient wipe CLEAR → INK. |

---

### S9 — Service & Trust
| Field | Spec |
|---|---|
| Purpose | Overcome "young brand" risk. |
| Content | Warranty (exact terms), service coverage (cities), installation process (3 steps: demo → install → service reminders), company identity (Lennore India Pvt. Ltd., registered address, CIN optional), certifications/test reports (only if documents exist; link to PDF), support channels & hours. |
| Images | Real technician/demo photo, office/warehouse photo (real, not stock). |
| Animation | Minimal: fade/translate; a simple "service map" of NCR with dots (SVG) if coverage data exists. |
| CTA | "Talk to our team" (WhatsApp). |

---

### S10 — Customer Stories
| Field | Spec |
|---|---|
| Purpose | Social proof from real buyers. |
| Format decision | **Video-first (vertical 9:16, 20–40 s, subtitled)** — native to Reels/Shorts traffic, feels authentic. Backed by 3–6 text reviews with name, city, month, and verified-purchase note. Ratings only if from a verifiable platform (e.g., Google Business Profile) and linked. |
| Content rules | Testimonials must speak about taste, experience, service, design, ease — **not health outcomes**. Written consent on file. |
| Animation | Video cards in a horizontal row; tap to play with sound (captions default on); text reviews marquee **off** (marquees hurt readability) — use static 3-up grid. |
| Hidden if | No consented testimonials → section not rendered. |

---

### S11 — Pricing / Offer (variant-toggle)
| Field | Spec |
|---|---|
| Purpose | Pre-qualify and reduce demo no-shows due to price shock. |
| Content | "Starting from ₹{priceFrom}" + what's included (installation, filter, warranty) + EMI (if partner) + offer banner (variant) with valid-till date. |
| Animation | None beyond fade (decision point). |
| CTA | Primary Book Demo. |

---

### S12 — FAQ
8–12 questions: How is it different from RO? Does it work with borewell/high-TDS water? Which levels are for drinking? How often do I change the filter and what does it cost? What's the warranty? Who installs? Power consumption? Do I need a separate RO? How long does a demo take and is it free? Which cities? Payment/EMI? — Answers from Lennore, factual. `<details>` accordion, first one open.

---

### S13 — Book Your Demo (conversion)
| Field | Spec |
|---|---|
| Purpose | Convert. |
| Psychology | Low effort, low commitment, clear next step, reassurance. |
| Layout | Left (desktop): heading "Book a free home demo", 3 reassurance bullets ("30-min demo with your own tap water", "No obligation", "We'll WhatsApp you to confirm a time") — only if true. Right: form card. Mobile: heading, form, then reassurance. |
| Form | **Step 1:** Name · Mobile (+91 prefix fixed, `inputmode="numeric"`) · Pincode (6 digits; live serviceability hint). Button: "Book my free demo". **Step 2 (post-submit, optional):** Home/Office · Preferred time (Morning/Afternoon/Evening) · "Send me offers on WhatsApp" (unchecked). DPDP notice under button with link to /privacy. |
| Alternatives | "Prefer chatting? WhatsApp us" and "Call {phone}" (show hours). |
| States | idle → validating (inline) → submitting (button spinner, disabled) → success (tick animation, step 2) / error (message + WhatsApp fallback with prefilled details). |
| Animation | Green glow behind card breathes slowly (opacity only). Success: check-mark draw 400 ms. |
| Out of area | "We don't do home demos in {pincode} yet — WhatsApp us for a video demo." |

### S14 — Footer
Company legal name, address, email, phone, links (Privacy, Terms, Disclaimer), social links, claims disclaimer (docs/11 §5), © year.

### Global elements
- **Sticky action bar (mobile):** appears after hero; 3 buttons (Book Demo — primary, WhatsApp icon+label, Call icon); height 64 px + safe-area inset; hides when S13 in view or input focused; slides away on fast scroll-down during pinned sequences? **No** — keep visible but translucent over pinned sequences (never hide the primary path).
- **Desktop header:** logo left, "How it works · Features · Service · FAQ" anchors, "Book Demo" button; appears after hero with blur backdrop.
- **Scroll progress:** thin 2 px line under header on desktop only.

## 4. Continuity map (how it reads as one story)

| From → To | Device |
|---|---|
| Hero → Reveal | Hero still = sequence frame 1 (same camera) |
| Reveal → How it works | Cutaway frame ≈ diagram geometry; SVG draws over fading canvas |
| How it works → Choose | Alkaline stream exits spout → circular clip reveals CLEAR theme |
| Choose → Features | Glass exits, product enters and sticks |
| Features → Built to last | Zoom from product to macro of plates |
| Built → Fits your space | Horizontal line leads into horizontal panels |
| Comparison → Trust | Gradient wipe back to INK (evening, calm, human) |
| Trust → Stories → Price → FAQ → Form | Calm, static, readable; green glow intensifies toward the form |

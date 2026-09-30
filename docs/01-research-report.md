# 01 — Research Report (Deliverable 1)

## Contents
1. Existing website audit (lennore.in)
2. Product & category analysis
3. Target audience
4. Compliance landscape (ads + India law) — **critical**
5. Modern landing-page techniques: evaluation
6. Scroll-sequence implementation options compared
7. Stack options compared
8. Conclusions carried into PRD/TRD
9. Sources

---

## 1. Existing website audit — lennore.in

**Access limitation.** lennore.in's robots configuration disallows automated fetching, so this audit is based on the publicly indexed homepage content, social profiles and company records. A manual visual audit by the team (screenshots of every page, colour sampling of product photos) is **Task 3.1 in the roadmap** and must be done before the design system is locked.

### 1.1 What the homepage communicates (indexed content)

| Area | Current content (paraphrased) | Assessment for ad landing page |
|---|---|---|
| Positioning | Alkaline water ionizer machines that provide purified, safe drinking water; reliable service; durable equipment | Generic; no single sharp promise. Need one clear idea. |
| Feature blocks | "Advanced Filtration Technology" (claims removal of harmful metals/chemicals), "Built to Last" (durable, long service life), "Sleek, Space-Saving Designs" (compact, fits kitchen/office) | Good raw material. Filtration claim needs a test report behind it before we use it in ads. |
| Installation | Countertop, under-the-counter or wall-mounted | Useful, concrete, visual. Use it. |
| Testimonials | Quotes referencing improved energy and digestion, great taste, value for money | Taste/value quotes usable. **Energy/digestion quotes are health claims — do not use on the ad page.** |
| FAQ | "Is alkaline water safe for daily consumption?" answered as safe/healthy/ideal for daily use | Rephrase to a factual, non-health answer (see docs/11). |
| Price messaging | "Budget-friendly price" | Undefined. Decide whether to show price (docs/00 Q4). |
| Contact | info@lennore.in | Need phone/WhatsApp, service cities. |
| Copy quality | Several sentences read as machine-paraphrased ("combines fashion with functionality", "detectable health advancements") | Landing page needs fresh, human, confident copy. |

### 1.2 Social content signals
The Pinterest profile promotes "switch to alkaline water" with posts including alkaline vs tap water comparisons and a post asserting hard water as a major cause of diabetes. That last theme must **not** appear in ads or on this page (see §4).

### 1.3 Brand identity
- Name "Lennore" — soft, premium-sounding, not obviously "tech". Opportunity: pair a calm, refined wordmark with precise technical UI.
- Product colour: brief states the machines have **green tones** (dark/olive green). Must be sampled from real photos under neutral light — see design/tokens.json note.
- No evidence of brand guidelines. We propose a design system (docs/03 §9, design/tokens.json) that the main site can later adopt.

### 1.4 Company context
Lennore India Pvt. Ltd. was incorporated on 29 March 2024 in Delhi with two directors. As a two-year-old brand in a category crowded with established names, **trust signals are the conversion bottleneck**, not visuals alone.

---

## 2. Product & category analysis

### 2.1 How an ionizer works (neutral, factual basis for "How it works")
- Mains power is converted to DC; incoming tap water is first filtered, then passes through an electrolysis chamber. At the negative electrode (cathode) the water becomes mildly alkaline with dissolved molecular hydrogen; at the positive electrode (anode) it becomes mildly acidic. With tap water as the only ion source, alkaline output is typically ~pH 8–11 and acidic ~pH 4–6, varying by machine and source water. *(Molecular Hydrogen Institute)*
- Technically these machines are **water electrolyzers**. *(Wikipedia)*
- Plates are usually platinum-coated titanium; more plates / more surface area generally allow stable ionization at higher flow; 5 plates is entry level, 7/9/11 are higher output. *(category buying guides)*

This gives a clean, true, visual story: **Filter → Electrolysis chamber → Two streams (alkaline for drinking/cooking, acidic for cleaning/external use) → You choose the level on the display.** Exact stages, filter media and pH levels must come from Lennore's spec.

### 2.2 The science caveat we design around
Mainstream scientific sources state that drinking alkaline water does not change the body's pH because of acid-base homeostasis, and criticise marketing claims such as "micro-clustering". *(Wikipedia, McGill OSS)* Independent sources also note ionizers are not strong filters on their own compared with RO. *(RKIN)*
**Implication:** Our page must never stake its persuasion on health outcomes. It persuades on **control, taste, quality of the machine, design, convenience and service** — all of which are true and demonstrable.

### 2.3 Indian market price band
Indian B2B listings for home ionizers cluster roughly **₹65,000–₹1,60,000** (5–7 plate), with premium/commercial units higher (₹2–3L). *(IndiaMART listings)* → A considered purchase. Buyers compare, ask family, want to see it working. **Demo-led funnel confirmed.**

### 2.4 Competitive landscape (India, positioning only)
- **Enagic Kangen** (Japanese, MLM-distributed, highly visible in India) — premium-priced, heavy health messaging via distributors.
- **Imported Korean brands** via importers (e.g., Wellon distributed by various dealers) — spec-heavy listings, discount-led.
- **Indian assemblers** (Justpure, Dvine, Icpure, PNOY etc.) — IndiaMART/Justdial presence, spec-sheet selling, weak brand design.
- **Mainstream purifier brands** (Eureka Forbes, Kent, AO Smith, etc.) offer "alkaline" RO variants at much lower prices — a price anchor Lennore must address (an ionizer is a different machine: adjustable levels via electrolysis vs a mineral cartridge).

**White space:** almost nobody in this Indian category presents the product as a *premium, well-designed appliance* with a *claims-clean, confident* voice. That is Lennore's opening.

### 2.5 Buying objections to answer on the page
1. "Is this different from an RO with an alkaline cartridge?" → How it works + comparison.
2. "Is it worth the price?" → Build quality, plates, filter life, warranty, service (facts only).
3. "Will it work with my water (borewell/municipal/high TDS)?" → Pre-filter / RO pairing guidance (from Lennore), demo tests *your* water.
4. "Who installs and services it? You're a new brand." → Service promise, response times, warranty in writing, real customers.
5. "Is it safe?" → Factual answer: produces drinking water within set pH levels; follow manufacturer guidance on which levels are for drinking.

---

## 3. Target audience

| Segment | Profile | Trigger | Channel |
|---|---|---|---|
| A. Health-conscious urban families (core) | 30–55, metro/Tier-1 (Delhi NCR first), household income high, own home | Want "better water" for family; already buy premium appliances | Meta (IG Reels), Google Search (intent) |
| B. Upgraders | Already own RO; considering "alkaline"/ionizer | Heard of Kangen via network; researching | Google Search ("water ionizer price", "alkaline water machine") |
| C. Premium home/kitchen buyers | Renovating kitchen, design-led | Wants a beautiful, countertop-worthy appliance | Meta, Pinterest |
| D. Offices / clinics / gyms / cafés (B2B-lite) | Owner/admin | Staff/customer drinking water, differentiation | Google Search, LinkedIn (later) |

Detailed personas: docs/02 §4.

---

## 4. Compliance landscape — critical

### 4.1 Ad platforms
- Google Ads reviews **the landing page as part of the ad**; a compliant ad pointing to a non-compliant page is still disapproved. Unsubstantiated or misleading health claims fall under misrepresentation/unreliable-claims policy, and repeated violations can restrict accounts.
- Google also prohibits targeting/personalisation based on health conditions, and treats before/after and guaranteed-outcome claims as misleading.
- Meta has equivalent personal-health and before/after restrictions (verify current Meta Advertising Standards at build time).

### 4.2 Indian law
- **Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954** prohibits ads claiming to cure, diagnose, mitigate, treat or prevent scheduled diseases — the schedule includes **diabetes**, heart disease, kidney stones, cancer, etc. Its definition of "drug" extends to articles intended to affect bodily function. ASCI has cited this Act against diabetes-cure advertising.
- **Consumer Protection Act 2019 / CCPA guidelines on misleading advertisements** and **ASCI Code** apply to all claims, testimonials and comparisons.
- **DPDP Act 2023 + DPDP Rules 2025** (notified Nov 2025): Data Protection Board is live; consent-manager provisions from Nov 2026; full notice/consent/security obligations enforceable by **13 May 2027**. Our lead form should be DPDP-compliant from day one (clear itemised notice, purpose-limited consent, withdrawal path).

### 4.3 Resulting design rules
→ docs/11 Claims Policy. Summary: no disease/health-outcome claims, no health testimonials, no before/after body imagery, filtration claims only with a test report, specs only from the spec sheet, clear DPDP notice on the form.

---

## 5. Modern landing-page techniques — evaluation

Legend — **Use:** ✅ core · 🟡 selective · ❌ skip in v1

| Technique | What it does | Use here | Where NOT | Perf | Mobile | SEO | Complexity | Verdict |
|---|---|---|---|---|---|---|---|---|
| **GSAP core** | Timeline-based JS animation engine; precise easing & sequencing | Every choreographed moment | Trivial hovers (use CSS) | ~25–30 KB gz; very efficient if only transform/opacity | Excellent | Neutral (content in HTML) | Low–Med | ✅ |
| **GSAP ScrollTrigger** | Links animations to scroll: trigger, scrub, pin | Pinned product stories, sequence scrubbing, section transitions | Content that must be read quickly (FAQ, form) | Good; pinning adds layout cost | Pinning must be simplified on iOS | Neutral | Med | ✅ |
| **GSAP SplitText** | Splits text into lines/words/chars for reveals | 3–4 key headlines only | Body copy, long paragraphs | Small (rewritten 2025, ~50% smaller) | Fine; keep word-level not char-level | Must keep real text in DOM (it does) + `aria-label` | Low | 🟡 |
| **CSS scroll-driven animations** (`animation-timeline: scroll()/view()`) | Declarative, compositor-thread scroll animation | Simple reveals, progress bar, parallax accents | Complex pinned choreography | Best possible (off main thread) | Chrome/Edge + Safari 26; Firefox still flag/partial | Neutral | Low | 🟡 as progressive enhancement; GSAP fallback |
| **Lenis** | Smooth-scroll interpolation | Desktop only, for sequence smoothness | Touch devices (fights native momentum, battery) | ~4 KB; adds RAF loop | ❌ disable | Neutral | Low | 🟡 desktop |
| **Canvas image sequence** | Draws pre-rendered frames to `<canvas>` according to scroll | Product reveal/rotation, cutaway, water-flow | Anything needing crisp text (render text in HTML over it) | Heavy bytes; cheap CPU. Needs progressive loading | Good with reduced frame count | Neutral (canvas invisible to crawlers → keep HTML copy) | Med | ✅ core "3D" feel |
| **Scroll-scrubbed video** | Sets `video.currentTime` from scroll | Alternative to sequences | iOS Safari (seeking jank), long clips | Smaller bytes than frames, but decoding-bound | Unreliable on iOS | Neutral | Low→high debugging | ❌ for scrub; ✅ for autoplay loops |
| **Autoplay muted loop video** | Ambient motion | Hero ambience after LCP, lifestyle strip | LCP element; anything with key info | 0.8–2 MB per clip if encoded well | Good; pause off-screen | Neutral | Low | ✅ |
| **Three.js / WebGL (GLB)** | Real-time 3D in browser | Optional 360° "inspect the machine" viewer (phase 2) | Hero, primary story | 150 KB+ lib + 1–5 MB model; GPU, battery | Risky on low-end Android | Neutral | High | ❌ v1 / 🟡 v2 |
| **WebGL shaders (water/fluid)** | GPU visual effects | — | Everywhere in v1 | GPU cost, battery | Risky | Neutral | High | ❌ (CSS/SVG achieves enough) |
| **Framer Motion / Motion** | React animation lib | — | We're not using React | — | — | — | — | ❌ (not needed) |
| **Lottie** | Vector animations from After Effects (JSON) | Tiny UI loops: filter-change icon, "water drop" micro-icons | Complex scenes (large JSON, main-thread) | lottie-web ~60 KB gz — too heavy for icons | OK | Neutral | Low | ❌ → use animated SVG + CSS instead |
| **SVG + CSS/GSAP diagrams** | Vector diagrams with animated paths (stroke-dash, motion along path) | How-it-works flow, connector lines, pH scale | Photoreal visuals | Tiny | Excellent | Text in SVG is indexable if real text | Low–Med | ✅ |
| **Clip-path / mask reveals** | Wipe/iris/reveal transitions | Section transitions (dark→clear), image reveals | Overuse on every section | Compositor-friendly for `clip-path: inset/circle` | Good | Neutral | Low | ✅ selective |
| **Parallax** | Layers move at different speeds | Subtle depth in hero & lifestyle | Text blocks, forms | Fine if transform-only | Reduce amplitude | Neutral | Low | 🟡 subtle |
| **Horizontal scroll sections** | Pinned vertical scroll moves content sideways | Desktop: installation options strip | Mobile (use native swipe carousel instead) | Pin cost | ❌ on mobile | Neutral | Med | 🟡 desktop only |
| **Sticky product showcase** | Product stays pinned while text/callouts change | Feature hotspots section | Short sections | CSS `position: sticky` is cheap | Good | Neutral | Low | ✅ |
| **Interactive hotspots** | Tap/hover points on product reveal detail | Feature section | Anything critical (must also be in plain list) | Tiny | Tap targets 44px | Content duplicated in HTML list | Low | ✅ |
| **Interactive pH selector** | User selects level; UI + water colour respond | Signature "demonstrate" section | — | Tiny | Excellent | Content in HTML | Med | ✅ signature |
| **Before/after slider** | Drag to compare two states | Only for *factual* comparisons: e.g. reagent colour of tap water vs output, kitchen with/without bottles | Bodies/health ("before/after" people) | Small | Good | OK | Low | 🟡 factual only |
| **Cursor followers / magnetic buttons** | Pointer-reactive UI | Primary CTA on desktop only (subtle) | Mobile (no cursor); forms | Tiny | N/A | Neutral | Low | 🟡 minimal |
| **Micro-interactions** | Feedback on hover/press/validate | Buttons, form validation, pH dial ticks, success state | Gratuitous hover effects everywhere | Tiny | Haptic-like press states | Neutral | Low | ✅ |
| **Page loader / intro animation** | Branded loading screen | — | Paid landing pages (delays LCP, raises bounce) | Hurts LCP | Bad | Bad | Low | ❌ No preloader |
| **View Transitions API** | Animated transitions between states/pages | Form step → thank-you | — | Native | Chrome/Safari support; graceful fallback | Neutral | Low | 🟡 nice-to-have |

**How premium product sites actually use these (patterns worth borrowing):**
1. *One* pinned hero-to-product sequence per page, not five.
2. Text lives in HTML layered over canvas/video, so it stays crisp, translatable and indexable.
3. Motion reveals **structure** (how parts relate: filter → chamber → outlets), not decoration.
4. Chapters: each scroll "chapter" has one idea, one visual, one line of copy.
5. Conversion elements (price, form, FAQ) are calm and static — motion stops where decisions start.
6. Mobile versions are re-composed (vertical stacks, fewer frames, taps instead of hovers).

---

## 6. Scroll "transformation" section — implementation options compared (brief §10)

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Canvas image sequence (AVIF/WebP frames)** | Frame-accurate scrubbing; works identically on iOS/Android; any visual (photoreal render, cutaway, fluid) | Bytes (needs progressive loading); requires rendered frames | ✅ **Chosen** |
| Scroll-scrubbed `<video>` | Smaller bytes; single file | Seeking stutters (keyframe-dependent), especially iOS Safari; needs all-intra encoding which bloats file | ❌ for scrub |
| Autoplay video + scroll triggers play/pause | Simple; small | Not user-controlled; less "interactive" | ✅ for ambient clips only |
| Three.js live model | Truly interactive, free rotation | Heaviest; needs clean GLB; lighting/material work; Android GPU variance | 🟡 phase-2 optional viewer |
| CSS/SVG motion graphics | Tiny; crisp | Can't show photoreal internals | ✅ for diagrams |
| GSAP | Orchestrates all of the above | — | ✅ the conductor |

**Frame budget:** desktop 120 frames @ 1600 px wide AVIF (~35–55 KB each ≈ 5 MB, loaded progressively after LCP); mobile 60 frames @ 900 px (~20–30 KB each ≈ 1.5 MB). Load keyframes first (every 8th frame), then fill gaps; draw nearest loaded frame while scrubbing. Details: docs/05 §3.

---

## 7. Stack options compared (brief §4)

| Criterion | A. HTML/CSS/JS | B. React + Vite (SPA) | C. Next.js | **D. Astro 6** |
|---|---|---|---|---|
| Initial JS | Minimal | 45 KB+ React runtime before our code; client rendering | React runtime + hydration | **Zero by default**; only our motion modules |
| LCP on ad traffic | Excellent | Weak unless prerendered | Good with SSG, hydration still costs | **Excellent** (static HTML) |
| SEO / metadata | Manual | Weak (CSR) | Strong | **Strong** |
| Animation capability | Full (GSAP) | Full | Full | **Full** (GSAP in plain TS modules) |
| Componentisation / maintainability | Poor at scale | Good | Good | **Good** (`.astro` components, typed content) |
| Variants (campaign pages) | Copy/paste | Router | Routes | **Static routes from JSON (`getStaticPaths`)** |
| Image pipeline | Manual | Plugins | `next/image` (runtime) | **Built-in `astro:assets` → AVIF/WebP at build** |
| Hosting | Anywhere | Anywhere | Best on Vercel; server features add cost/complexity | **Anywhere static; first-class Cloudflare Pages** |
| API for lead form | Separate | Separate | Route handlers | **Cloudflare Pages Functions** (same repo) |
| Team fit / future editing | Low | Medium | Medium | **Medium–High** (content in JSON/MD; easy for Claude Code) |

**Recommendation: D — Astro 6 (static) on Cloudflare Pages.** Astro ships no JS unless asked, has a build-time image pipeline and CSP support, and after Cloudflare acquired the Astro team in Jan 2026 (MIT licence retained) the Cloudflare deployment path is first-class. Next.js would add a React runtime and hydration we don't need for a single, content-driven page.

Why not plain HTML (A)? It performs as well, but campaign variants, typed content, image optimisation and component reuse would all be hand-rolled — slower to build and riskier to maintain.

---

## 8. Conclusions carried into the PRD/TRD
1. Demo-led funnel; "Book a Free Home Demo" primary, WhatsApp secondary.
2. Claims-clean narrative: *Choose your water* → how it works → built to last → fits your kitchen → service you can reach → book demo.
3. Astro 6 + GSAP/ScrollTrigger + canvas sequences + SVG diagrams. No preloader, no Three.js in v1.
4. Mobile motion re-composed, not scaled.
5. Server-side tracking + qualified-lead feedback loop to ad platforms.
6. Everything factual flows from one JSON; missing facts are hidden, not guessed.

---

## 9. Sources
- lennore.in homepage (indexed content via search)
- Pinterest: in.pinterest.com/lennore_offical
- Company record: allindiaitr.com — Lennore India Private Limited (U46590DL2024PTC429033)
- Molecular Hydrogen Institute — Water Ionizers (Electrolyzers)
- Wikipedia — Water ionizer
- RKIN — Myths and truth about water ionizers
- IndiaMART category listings — water ionizer machines (price bands)
- sensibledigs.com — Best alkaline ionizer machines 2026 (plate guidance)
- HawkSEM, Accelerated Digital Media, CG Colors, auditsocials — Google Ads healthcare / misleading-claims policy guidance
- India Code / CDSCO summaries — Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954; Wikipedia (ASCI action on diabetes-cure ads)
- PIB (17 Nov 2025) — DPDP Rules 2025 notified; compliance timeline articles (May 2027 full enforcement)
- gsap.com — 3.13 release & pricing (GSAP 100% free incl. plugins)
- ICS Media, Chrome Developers, MDN — CSS scroll-driven animations support
- Cloudflare press release (16 Jan 2026) — Astro joins Cloudflare; Astro 6 release coverage

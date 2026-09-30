# 11 — Copy Deck & Claims Policy

> Not legal advice. Have Lennore's counsel review final copy, testimonials and the privacy notice before launch.

## 1. Why this exists
Google reviews the landing page together with the ad; unsubstantiated health claims on the page get ads disapproved even if the ad itself is clean. In India, the Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954 prohibits advertising that claims to cure, treat, mitigate or prevent scheduled conditions — which include diabetes, heart disease, kidney stones and cancer — and CCPA/ASCI rules apply to every claim and testimonial. Scientific consensus is also that drinking alkaline water does not change the body's pH. So the page persuades on **what the machine verifiably does and how it feels to own it**.

## 2. Claims policy

### ✅ Allowed (with the stated condition)
| Territory | Example phrasing | Condition |
|---|---|---|
| Mechanism | "Uses electrolysis to separate water into alkaline and acidic streams." | Always true for an electrolytic ionizer |
| Adjustable levels | "Choose from {n} levels on the touch display." | n and display from spec |
| pH values | "Alkaline levels up to around pH {x}." | From manual; add "varies with source water" |
| Filtration | "{Filter type} reduces {substances} by {x}%." | **Only with lab test report**; name substances exactly as the report |
| Taste / experience | "Many owners tell us they prefer the taste." | Only if backed by real feedback; subjective framing |
| Build | "{n} platinum-coated titanium plates." | From spec |
| Maintenance | "Filter life about {L} litres, with an on-screen indicator." | From spec |
| Design | "Compact enough for any countertop; can also be wall-mounted." | Installation types from spec |
| Service | "Free home demo in {cities}. Installation by Lennore technicians." | Must be operationally true |
| Warranty | "{x}-year warranty on {parts}." | Written terms |
| Uses | "Levels for drinking, cooking and cleaning." | Only uses stated in the manual |
| Hydrogen (H₂) | "Electrolysis produces dissolved hydrogen at the alkaline electrode." | Mechanism statement only — **no health benefit attached** |

### ❌ Not allowed (anywhere: page, ads, creatives, testimonials, FAQ, schema)
- Cure/treat/prevent/manage/help with any disease or condition: diabetes, BP, cholesterol, kidney stones, acidity/GERD, gout, arthritis, cancer, obesity, skin conditions, etc.
- "Boosts immunity", "detoxifies", "anti-ageing", "antioxidant water fights free radicals", "balances body pH", "alkalises your body", "more energy", "better digestion", "hydrates faster/better", "micro-clustered water".
- "Hard water causes diabetes" (and similar fear claims about tap water).
- "Medical-grade", "doctor recommended", "clinically proven" — unless there's a genuine, citable basis and legal approval.
- Before/after images of people or bodies.
- Unverified superlatives: "India's best/No.1/first", "most advanced".
- Customer counts, ratings, "trusted by thousands" without evidence.
- Comparative claims naming competitors.
- Fake urgency (countdown timers that reset, "only 2 left" when untrue).

### ⚠️ Rewrite of existing lennore.in statements
| Current (paraphrased) | Issue | Use instead |
|---|---|---|
| Removes dangerous metals and chemicals | Unsubstantiated without report | "{Filter} reduces {listed substances} (lab-tested)." — or omit |
| Safe, healthy, ideal for daily use | "Healthy" is a health claim | "Drinking levels are set out in the manual; our team walks you through them at the demo." |
| Customers noticed better energy and digestion | Health testimonial | Don't use. Use taste/service/design testimonials. |
| Detectable health advancements | Health claim | Remove |
| Budget-friendly price | Vague | "Starting from ₹{x}" or omit |
| Social post: hard water → diabetes | DMR Act schedule disease | Remove from ads/LP; recommend removing from social too |

## 3. Voice
Calm, precise, confident. Short sentences. Specific numbers (from spec). No exclamation marks. No emoji on page. Indian English spellings (colour, litres). Hindi variant: natural spoken Hindi, not literal translation.

## 4. Draft copy (EN) — `{}` from product.json

**S1 Hero**
- Eyebrow: Lennore Alkaline Water Ionizer
- H1: Water, set by you.
- Sub: Filtered and ionized at your tap — choose the level for drinking, cooking and cleaning.
- CTA: Book a Free Home Demo · WhatsApp us
- Chips (verified only): Free home demo in {primaryCity} · {warrantyYears}-year warranty · Installation included

Alternative H1s for testing: "Choose your water." · "Your tap. Your pH." · "The water machine your kitchen was missing."

**S2 Reveal**
- Ch1: Made for the countertop. — Clean lines, a small footprint, and nothing to refill.
- Ch2: Every level, one touch away. — {n} levels on a clear display.
- Ch3: Filter. Chamber. Two streams. — Here's what happens inside.

**S3 How it works** (title: How Lennore works)
1. Tap water in — Connects to your kitchen tap{or inlet}.
2. Filtered first — {filterType} {filterClaim if report}.
3. Ionized by electrolysis — {plates} {plateMaterial} plates pass a low current through the water.
4. Split into two — An alkaline stream and an acidic stream.
5. Your level at the spout — Pick it on the display. The right stream flows out.
- Inline CTA: See it with your own tap water → Book a demo

**S4 Choose your water**
- H2: Choose your water.
- Instruction: Tap a level.
- Per level (from manual): "{label} · pH ≈ {ph}" / "Best for: {recommendedUse}" / "For drinking: {Yes/No}"
- Footnote: pH depends on your source water. At the demo we test your own tap water with reagent drops, right in front of you.
- CTA: Test your water at home — free

**S5 Features** — per spec, format: *Title* — one-line "so what" — spec.
- e.g. "Touch display — See and change the level in one tap — {display spec}"

**S6 Built to last**
- H2: Built to last.
- Sub: The parts that matter, made to keep working.
- Tiles: {plates} plates · {filterLife} L filter life · {autoClean} · {warranty}

**S7 Fits your space**
- H2: Fits your space.
- Countertop — Sits beside your sink, connects to the tap.
- Under-counter — Only the spout shows. Clean, hidden install.
- Wall-mounted — Frees your counter entirely.
- CTA: Not sure which fits? Send us a photo of your kitchen on WhatsApp.

**S8 Comparison** (title: Ionizer or RO with an alkaline cartridge?) — factual rows per docs/04 S8; legal review.

**S9 Service & trust**
- H2: A team you can reach.
- Blocks: Warranty in writing · Installation by our technicians · Service in {cities} · Lennore India Pvt. Ltd., {address}

**S10 Stories** — H2: From homes that use it. (Hidden if none.)

**S11 Pricing** — H2: Starting from ₹{priceFrom} · Includes {inclusions} · {EMI} · {offer + valid till}

**S13 Form**
- H2: Book a free home demo.
- Bullets (only if true): About {demoMinutes} minutes, with your own tap water · No obligation to buy · We'll WhatsApp you to confirm a time
- Fields: Your name · Mobile number · Pincode
- Button: Book my free demo
- Notice: see §6
- Success: "Thank you, {firstName}. We'll WhatsApp you within {slaHours} working hours to fix a time. Your reference: {lead_ref}."
- Out of area: "We don't offer home demos in {pincode} yet. Message us on WhatsApp and we'll arrange a video demo."

## 5. Footer disclaimer (draft)
"Lennore water ionizers produce alkaline and acidic water by electrolysis. pH and output vary with source water quality, flow and settings. Lennore products are household appliances and are not intended to diagnose, treat, cure or prevent any disease. Specifications are subject to change; refer to the product manual."

## 6. Form notice (DPDP-aligned draft)
"We'll use your name, mobile number and pincode to arrange your demo and contact you about it by call and WhatsApp. See our [Privacy Notice] for how we store your data, who we share it with (including advertising partners for measuring our ads) and how to withdraw consent or request deletion."
Optional checkbox (unticked): "Send me product updates and offers on WhatsApp."

## 7. FAQ drafts (answers need Lennore facts)
1. **How is an ionizer different from an RO purifier?** An RO pushes water through a membrane to reduce dissolved solids. An ionizer filters water and then uses electrolysis to separate it into alkaline and acidic streams you can select. Some homes use both — our team will advise based on your water.
2. **Will it work with my water (borewell / high TDS)?** {Lennore guidance — e.g. pre-filter or RO pairing above {x} TDS}. We test your water at the demo.
3. **Which levels are for drinking?** {From manual}.
4. **How often do I change the filter, and what does it cost?** {life} litres or about {months} months for a typical family; replacement costs ₹{x}.
5. **What's the warranty?** {terms}.
6. **Who installs it?** {Lennore technicians}, usually within {x} days of purchase.
7. **How much electricity does it use?** {power spec}; it draws power only while dispensing {if true}.
8. **Is the demo really free?** Yes — about {x} minutes at your home, no obligation.
9. **Which cities do you cover?** {cities}. Elsewhere, we offer video demos.
10. **Can I pay in EMIs?** {EMI partners / terms}.

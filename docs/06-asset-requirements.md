# 06 — Asset Requirements (Deliverables 8, 9, 10, 11)

## 1. Video requirements (Deliverable 8)

General encoding rules: no audio track on ambient clips (strip it, saves bytes and avoids autoplay blocks); `+faststart`; constant frame rate; colour-managed Rec.709; avoid heavy grain/noise (kills compression).

| ID | Purpose / placement | Duration | Aspect & resolution (D / M) | FPS | Format & target size | Transp. | Autoplay | Muted | Loop | Scroll-controlled | Replace with sequence? |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **V01 Hero ambient** | S1 behind/around product after LCP | 6–8 s seamless | D 16:9 1920×1080 (encode 1600w) / M 4:5 1080×1350 (encode 720w) | 24 or 30 | MP4 H.264 CRF 26–28 + WebM VP9 CRF 36; D ≤ 2.0 MB, M ≤ 0.9 MB | No (shot on black) | Yes (after load, capable devices) | Yes | Yes | No | Poster still is the LCP; no |
| **V02 Product reveal** | Master for S2 sequence | 5 s @ 24 fps = 120 frames | Rendered 2400×1350 (D) and 1350×1800 (M framing) PNG | 24 | → converted to AVIF/WebP frames (docs/05 §3.2) | No | — | — | — | Yes (as sequence) | **Yes — delivered as image sequence** |
| **V03 Cutaway / water path** | S2 chapter 3 frames 81–120 (part of V02) + social cutdown | incl. above; social 10 s | Same as V02; social 1080×1920 | 24 | Frames; social MP4 | No | — | — | — | Yes | Yes |
| **V04 Reagent test (real)** | S4 optional inset + ads | 6–10 s | 1:1 1080×1080 (on page encode 720) | 30 (60 for slow-mo drop) | MP4 ≤ 0.8 MB | No | On view, once | Yes | No (replay button) | No | No |
| **V05 Lifestyle** | S7 panels (optional ambient), ads | 3 × 5–8 s | D 16:9 1600w / M 4:5 720w | 24/30 | MP4 ≤ 1.2 MB each | No | On view | Yes | Yes | No | Stills acceptable in v1 |
| **V06 Close-ups** | S5/S6 (optional), ads | 4 × 3–5 s | 1:1 1080 (encode 720) | 30 | MP4 ≤ 0.6 MB each | No | On view | Yes | Yes | No | Stills in v1 |
| **V07 Customer stories** | S10 | 20–40 s each (3–5 videos) | 9:16 1080×1920 (encode 720×1280) | 30 | MP4 H.264 CRF 24, AAC 96 kbps; ≤ 4 MB; **burned-in or VTT captions** | No | **No** (tap to play) | Starts muted with captions; unmute on tap | No | No | No |
| **V08 How-it-works motion graphic** | Social ads only (page uses live SVG) | 10–15 s | 9:16 + 1:1 | 30 | MP4 | No | — | — | — | — | Page uses SVG |

Transparency: **not needed** — all product video shot/rendered on the page's ink background colour (`#07100C`), so it composites seamlessly. (Alpha video — HEVC-alpha for Safari + VP9-alpha for Chrome — doubles the work; avoid.)

`scripts/encode-video.sh` presets:
```bash
# Mobile ambient
ffmpeg -i in.mov -an -vf "scale=720:-2:flags=lanczos,fps=24" -c:v libx264 -profile:v high -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart hero-loop-720.mp4
ffmpeg -i in.mov -an -vf "scale=720:-2,fps=24" -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 hero-loop-720.webm
# Poster
ffmpeg -ss 0 -i in.mov -frames:v 1 -vf scale=1600:-2 poster.png && avifenc -q 55 poster.png hero-poster.avif
```

`scripts/build-sequence.mjs`: takes rendered PNG folder → sharp resize (D 1600w, M 900w) → AVIF q≈50 (effort 6) + WebP q≈72 → `manifest.json`. Target avg frame size: D ≤ 45 KB, M ≤ 25 KB.

## 2. Image requirements (Deliverable 9)

| ID | Asset | Qty | Master spec | Delivered formats / sizes | Notes |
|---|---|---|---|---|---|
| I01 | **Hero product still** (3/4 front, on ink bg) | 1 (+1 mobile crop) | ≥ 4000 px long edge, 16-bit TIFF/PNG | AVIF/WebP: D 2000w (≤180 KB), 1400w; M 900w portrait (≤90 KB) | Must equal sequence frame 1 framing |
| I02 | Transparent product cut-outs | 6 angles (front, 3/4 L, 3/4 R, side, top, back/ports) | ≥ 3000 px, PNG with clean alpha (no halos) | AVIF+alpha / WebP+alpha 1200w & 800w | Light & dark bg compatible |
| I03 | Product on light background (clear theme) | 2 (front, 3/4) | ≥ 3000 px | AVIF/WebP 1600w, 900w | For S5 sticky product |
| I04 | Close-ups / macro | 6: display (lit), spout, controls, plates (if accessible), filter cartridge, ports/hoses | ≥ 3000 px | AVIF/WebP 1200w, 700w | Hotspot zoom targets |
| I05 | Installation lifestyle | 3 settings × 2 crops: countertop (modern Indian kitchen), under-counter, wall-mounted; + office/clinic 1 | ≥ 5000 px | AVIF/WebP D 1920w 16:9, M 900w 4:5 | **Real homes, real installs, Indian context** (not Western stock) |
| I06 | Human/demo moments | 3: technician demo with reagent, family filling glass, hand selecting level | ≥ 4000 px | AVIF/WebP 1600w / 900w | Model releases required |
| I07 | Water visuals | 4: stream from spout (backlit), glass with bubbles, reagent colour series (acid→alkaline) on white, drop splash macro | ≥ 4000 px | AVIF/WebP 1200w | Reagent series doubles as colour reference for S4 |
| I08 | Internal component renders | 3: filter, electrolysis chamber, plates | from 3D | AVIF/WebP 1400w | Only if 3D model exists |
| I09 | Icons | ~20 | SVG, 24 px grid, 1.5 px stroke | SVG sprite | Custom set (drop, plate, filter, spout, wall, counter, shield, wrench, clock, WhatsApp, phone, check, etc.) |
| I10 | Diagrams | 2 (how-it-works D landscape, M portrait) + pH dial | SVG (hand-built) | Inline SVG | Text as live SVG `<text>` for a11y |
| I11 | Background textures | 2: subtle noise (tileable 256 px), radial glow | PNG 8-bit / CSS | noise as tiny AVIF (≤ 8 KB) or CSS gradient only | Prefer CSS |
| I12 | Customer photos | per testimonial | ≥ 800 px square | AVIF/WebP 160 & 320 px | Written consent |
| I13 | Certification / test report marks | as documented | vector (SVG/PDF) from issuer | SVG | Only real, current certificates; link to PDF |
| I14 | Brand logo | wordmark + mark, light/dark | SVG | SVG inline | Obtain originals; don't redraw without approval |
| I15 | OG / share images | 2 (EN, HI) | 1200×630 | JPEG ≤ 200 KB | Product + headline |
| I16 | Favicons | set | SVG + 180 px PNG | — | — |

**Optimisation rules:** all raster images through `astro:assets`; explicit width/height; responsive `srcset` with 2–3 widths; `sizes` accurate; AVIF quality 45–55, WebP 70–75; no image > 200 KB except sequence totals; lazy below fold; strip EXIF/GPS.

**Colour accuracy:** photograph product with an X-Rite ColorChecker in the first frame; sample the product green from the corrected image to finalise `color.product.olive` in tokens.

## 3. Product photography / 3D requirements (Deliverable 10)

| Need | Required? | Where used | Decision |
|---|---|---|---|
| Professional product photography | **Yes (v1 critical)** | Hero, cut-outs, clear-theme product, close-ups | Studio shoot, 1 day. Dark set + light set. |
| Real installation/lifestyle photography | **Yes (v1 critical)** | S7, S9, ads | 1 day across 2–3 customer homes + 1 office. |
| Transparent renders | Yes (from photo or 3D) | S5, S6 | Photo cut-outs acceptable for v1 |
| **3D model (high-poly, accurate)** | **Strongly recommended (v1.5)** | Offline only: render S2 sequence (orbit + push-in + cutaway), component renders, ad creatives | Obtain CAD/STEP from OEM if possible; else 3D artist models from photos + measurements (5–8 working days). |
| GLB/GLTF for web | Optional (phase 2) | "Inspect in 3D" viewer (lazy, user-initiated) | Only after v1.5 data shows engagement with S2. Decimated to ≤ 60k tris, Draco/meshopt, ≤ 2.5 MB, KTX2 textures. |
| 360° product rotation | Covered by S2 sequence (70° orbit) | S2 | No separate 360 spinner (redundant). |
| Product cutaway render | Yes (v1.5) | S2 Ch3, S3 hand-off | Requires internal layout reference from OEM/manual. **Must be accurate** — no invented internals. If internals unknown, stop at display push-in and let S3 diagram (stylised, labelled as illustration) carry "inside". |
| Internal component renders | Yes if cutaway | S6 | — |
| Motion graphics | Yes | S3 diagram (SVG live), social cutdowns | Built in code for page; After Effects for ads |

**Why not Three.js on the main path:** the same camera move rendered offline looks better (path-traced lighting, reflections on glossy plastic, accurate glass/water) and costs the user a predictable ~1.5–5 MB of lazily-loaded frames, instead of a 150 KB+ runtime, a multi-MB model and GPU work on unknown Android devices.

**Render spec (for 3D artist):**
- Blender Cycles; filmic/AgX view transform; background exactly `#07100C` (ink) for dark sequences; rim light green (#7FD6A4 at low intensity) + key softbox; no depth-of-field changes across frames that would shimmer after compression.
- Camera paths: A) orbit front-3/4 (−35°) → side (+35°), slight dolly-in (frames 1–40); B) push-in to display, display emission on (41–80); C) casing opacity/boolean fade revealing filter + chamber, water path emission (81–120).
- Output: PNG 16-bit, D 2400×1350, M 1350×1800 (separate camera framing for mobile — product centred, higher in frame).
- Stills: all I01–I04 angles from same model for consistency.

## 4. Asset checklist & production plan (Deliverable 11)

### 4.1 Client (Lennore) must provide
| # | Item | Needed by | Blocks |
|---|---|---|---|
| C1 | Official spec sheet / user manual per model (PDF) | Phase 3 | S2–S8 content |
| C2 | pH level list as shown on machine + manual's recommended uses per level | Phase 3 | S4 |
| C3 | Filter spec + lab test report (what it reduces, by how much) | Phase 3 | S3, S6, S8 claims |
| C4 | Warranty terms (written), service coverage (cities/pincodes), installation process, service SLA | Phase 3 | S9, S13 serviceability |
| C5 | Price policy: starting price / range / EMI / current offers | Phase 3 | S11, variants |
| C6 | Product units for shoot (1 per model, pristine) + access to 2–3 customer installations | Phase 4 | photography |
| C7 | CAD/STEP or detailed dimensions + internal layout from OEM | Phase 4 | 3D model, cutaway |
| C8 | Existing product photos/videos (any quality — reference) | Phase 3 | art direction |
| C9 | Logo source files, any brand colours/fonts | Phase 3 | design system |
| C10 | Certificates / registrations (only genuine, current) | Phase 3 | S9 |
| C11 | Testimonials: customer list for video, written consent forms, text reviews, Google Business Profile link | Phase 4 | S10 |
| C12 | Company details: legal name, registered address, phone, WhatsApp Business number, support hours | Phase 3 | S9, S14, tracking |
| C13 | CRM details (or approval to use Google Sheet), sales team WhatsApp numbers for alerts | Phase 10 | lead flow |
| C14 | Ad accounts access: Google Ads, Meta Business Manager (Pixel, CAPI token), GA4, GTM | Phase 11 | tracking |
| C15 | Legal review of copy & privacy policy | Phase 13 | launch |

### 4.2 We create
| # | Item | Phase | Tool |
|---|---|---|---|
| W1 | Design system (tokens, type, components) | 3 | Figma → tokens.json |
| W2 | Hi-fi designs: mobile + desktop for all sections, key states | 3 | Figma |
| W3 | Art direction & shot list for photo/video | 4 | — |
| W4 | Studio product shoot (dark + light), close-ups, water visuals | 4 | Photographer |
| W5 | Lifestyle/installation shoot | 4 | Photographer |
| W6 | Customer story filming (3–5) + edits with captions | 4 | Videographer/editor |
| W7 | Hero ambient video (V01) | 4 | Video / 3D |
| W8 | 3D model + render sequences (V02/V03) + component renders | 4 (v1.5) | 3D artist |
| W9 | SVG diagrams (how it works D/M, pH dial, glass) | 7 | Code/Figma |
| W10 | Icon set | 3 | Figma → SVG sprite |
| W11 | Sequence build (frames → AVIF/WebP + manifest) | 8 | scripts |
| W12 | Video encodes (all presets) | 8 | scripts |
| W13 | OG images, favicons | 6 | Figma |
| W14 | Scroll animations & micro-interactions | 7–8 | GSAP |
| W15 | Ad creative cutdowns (optional add-on) | 15 | AE/Premiere |

### 4.3 Optional
| # | Item | Value | Note |
|---|---|---|---|
| O1 | Web 3D viewer (GLB) | Medium | Phase 2 if S2 engagement is high |
| O2 | 360° spinner | Low | Redundant with S2 |
| O3 | Extended cutaway animation (full water journey) | Medium-High for ads | Reuse 3D model |
| O4 | AI-generated supporting visuals | Low–Medium | **Only for abstract backgrounds/textures.** Never for the product, kitchens presented as real customers, or people presented as customers — misrepresentation risk under ad policies and ASCI. |

### 4.4 Asset register (to maintain during production)
Create `docs/asset-register.csv` in Phase 4 with columns: `id, description, spec, owner, source, status (todo/shot/edited/optimised/in-build), consent_ref, file_path`.

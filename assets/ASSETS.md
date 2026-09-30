# Asset Manifest — Lennore Landing Page (v2 · 30 Sep 2026)

All product images come from **real product photos**. Composites (`hero/`, `product/KEY_*`, `closeup/`, `light/`, `models/`) put the real cut-out onto the dark studio set, so every printed label and pH value is accurate. AI imagery is used only for backgrounds, water and two L9 kitchen scenes (prefixed `AI_`).

The masters are high-res. **Do not ship them raw.** Generate AVIF/WebP at the sizes in docs/06 and docs/07.

## Folder map
```
assets/
├── brand/        logo-full, logo-horizontal(+white), logo-wordmark(+white), logo-mark(+ondark), favicon-32/512, apple-touch-icon
├── videos/       VIDEO_hero_desktop, VIDEO_hero_mobile, VIDEO_drop, VIDEO_stream (+ POSTER_*.jpg)
└── images/
    ├── hero/         HERO_desktop (2560×1440), HERO_mobile (1440×2560)      — L9, dark set
    ├── product/      KEY_side_{right,left}_{desktop,mobile}.jpg             — L9 scroll frames
    │                 CUT_*.webp  transparent cut-outs: L9 (front/side_right/side_left/front_lcd), L5, L7-RO (front-right/front-left)
    ├── closeup/      KEY_display_{desktop,mobile}.jpg                       — L9 control panel close-up
    ├── light/        PRODUCT_light_{front,side_right,side_left}.jpg        — L9 on off-white (clear theme)
    ├── models/       RANGE_desktop.jpg (L5 · L9 · L7+RO lineup), CARD_{L5,L9,L7-RO}.jpg (4:5 dark cards)
    ├── photos/       L9/ L5/ L7-RO/  — clean real product photos on white (2000 px)
    ├── lifestyle/    LIFE_*  = REAL photos · AI_LIFE_* = AI scenes (L9)
    ├── water/        WATER_drop, WATER_stream, WATER_ph_colours (AI, no product)
    └── backgrounds/  BG_dark_16x9, BG_dark_9x16
```

## Where each asset goes

| Section (docs/04) | Desktop | Mobile | Notes |
|---|---|---|---|
| Header / footer | `brand/logo-horizontal-white.png` on dark, `brand/logo-horizontal.png` on light | same | Footer on the light theme may use `logo-full.png` (with tagline). Favicons are in `brand/`. |
| **S1 Hero** (LCP image) | `hero/HERO_desktop.jpg` | `hero/HERO_mobile.jpg` | The static image is the LCP element. |
| S1 ambient video | `videos/VIDEO_hero_desktop.mp4` (16 s loop) | `videos/VIDEO_hero_mobile.mp4` | Swap in after `load`. Crossfade over 400 ms. |
| **S2 Product Reveal** (Plan B stills) | `HERO_desktop` → `product/KEY_side_right_desktop` → `closeup/KEY_display_desktop` | `_mobile` versions | Crossfade with scale and translate. No image sequence. |
| **NEW · Choose your model** (insert after S3 or before S11) | `models/RANGE_desktop.jpg`, or 3 cards | `models/CARD_*.jpg` as a swipe carousel | Only if the client advertises more than one model (docs/00 Q1). Specs per card come from `product.json` models[]. |
| **S4 Choose Your Water** | `videos/VIDEO_drop.mp4` (plays once, holds on its last frame) | same | pH levels come from the L9 entry in `product.json`. |
| **S5 Features** | `light/PRODUCT_light_front.jpg` + `closeup/KEY_display_desktop.jpg` | same | |
| S6 Built to last | `light/PRODUCT_light_side_right.jpg` (ports) | same | |
| **S7 Fits your space** | Countertop: `lifestyle/LIFE_L7-RO_countertop.jpg`, `LIFE_L5-RO_countertop.jpg` · **Under-sink: `lifestyle/LIFE_RO_undersink.jpg` (REAL)** · Wall: `lifestyle/AI_LIFE_L9_wallmount.jpg` | 4:5 crops | Prefer the REAL photos. AI scenes get neutral captions only and are never called a customer's home. |
| S9 Service & trust / brand moment | `lifestyle/LIFE_L5_model-with-glass.jpg` | same | This is brand photography with a model. **Do not use it as a testimonial.** Confirm the model release with the client. |
| S3/S13 background | `videos/VIDEO_stream.mp4` (7 s loop) | same | Keep it at low opacity and pause it offscreen. |
| OG image | build from `HERO_desktop.jpg` + `brand/logo-horizontal-white.png` | | 1200×630 |

## Brand colours (sampled from the logo, in design/tokens.json → color.brand)
Teal deep `#154D4F` · Teal `#256265` · Gold `#E9B449` · Grey `#C4C7C6`

## Open questions for the client (these affect the assets)
1. **Which models go in the ads?** The photos show L9, L5, L5+RO and L7+RO. The default hero is L9.
2. **L9 has two front panels**: a colour touch screen and a blue LCD. Which one is currently sold? The hero uses the colour-screen version.
3. The under-sink photo filenames say both "L5+RO" and "L7+RO". Which model does it show?
4. Is there a model release for the woman in `LIFE_L5_model-with-glass.jpg` covering paid ads?
5. Real customer testimonials (videos or photos). The section stays hidden until these exist.

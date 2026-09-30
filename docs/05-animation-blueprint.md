# 05 — Scroll-Animation Blueprint (Deliverable 7)

## 1. Motion principles
1. **Motion explains.** Every animated element shows form, flow, structure or state. Decorative motion is limited to hero glow and form glow.
2. **One hero moment per chapter.** Never two competing animations in the same viewport.
3. **Scroll = time.** Scroll-linked (scrubbed) motion only where the user benefits from control (sequence, diagram). Elsewhere, scroll *triggers* short, time-based reveals.
4. **Stillness at decisions.** Pricing, FAQ, form: no scrubbing, no pinning.
5. **Cheap properties only:** transform, opacity, clip-path (`inset()`/`circle()`), occasional `filter: blur()` ≤ 8 px on small elements.
6. **Mobile is re-composed**, reduced motion is fully supported.

## 2. Motion tokens (also in design/tokens.json)

| Token | Value | Use |
|---|---|---|
| `dur.xs` | 150 ms | hovers, presses |
| `dur.sm` | 250 ms | UI state changes |
| `dur.md` | 450 ms | reveals |
| `dur.lg` | 700 ms | headline reveals, section intros |
| `dur.xl` | 1100 ms | hero entrance total |
| `ease.out` | `power3.out` / `cubic-bezier(.22,1,.36,1)` | reveals |
| `ease.inOut` | `power2.inOut` | pinned transitions |
| `ease.spring` | `back.out(1.4)` | pH dial, success tick |
| `stagger.words` | 0.06 s | SplitText words |
| `stagger.items` | 0.08 s | lists/tiles |
| `distance.reveal` | 24 px desktop / 16 px mobile | translateY on reveal |
| `scrub` | 0.5 (desktop), true (mobile) | sequences/diagram |

## 3. System components

### 3.1 Reveal registry (`motion/sections/reveals.ts`)
Declarative attributes; one IntersectionObserver-driven batch (`ScrollTrigger.batch`).

| Attribute | Effect | Default |
|---|---|---|
| `data-reveal="fade-up"` | opacity 0→1, y 24→0 | `dur.md` |
| `data-reveal="mask-up"` | clip-path inset(100% 0 0 0) → inset(0) | `dur.lg` |
| `data-reveal="lines"` | SplitText lines, y 100% → 0 inside overflow-hidden line wrappers | `dur.lg`, stagger 0.08 |
| `data-reveal="words"` | SplitText words fade/rise | only H1/H2 of chapters |
| `data-reveal="scale-in"` | scale 0.96→1 + fade | images |
| `data-reveal="count"` | number count-up (`data-count-to`) once | 900 ms |
| `data-parallax="-20"` | y movement ±px across viewport | desktop only |
| `data-reveal-stagger` | on parent → stagger children | 0.08 s |

Progressive CSS path: where `CSS.supports('animation-timeline: view()')`, `fade-up`/`scale-in`/`parallax` use CSS `view()` timelines and GSAP skips them.

### 3.2 Sequence player (`motion/sequence-player.ts`)
- Input: `manifest.json` `{ frameCount, width, height, path: "…/%04d.avif", fallbackFormat: "webp", keyframeStep: 8 }`.
- Format detection: AVIF → WebP.
- **Loading strategy:** start only when section within 2 viewports **and** after `load`. Priority 1: frames 1, every 8th, last. Priority 2: every 4th. Priority 3: remaining. Concurrency 6. Abort on `saveData`.
- **Drawing:** `requestAnimationFrame`; target frame = round(progress × (n−1)); if not loaded, draw nearest loaded frame. `drawImage` with cover-fit; canvas sized to CSS size × min(devicePixelRatio, 2) (1.5 on mobile).
- Decode with `img.decode()` before marking loaded; keep `ImageBitmap` cache (`createImageBitmap`) where supported; release bitmaps of far frames on low-memory devices (`deviceMemory ≤ 4` → cache window ±30 frames).
- Fallback: `<img>` of frame 1 inside `<noscript>` and shown if player fails.

### 3.3 Theme transitions (`motion/transitions.ts`)
- `[data-theme="ink|clear"]` per section. Body background colour tweened via ScrollTrigger at section boundaries (`onEnter/onLeaveBack`), 600 ms.
- Signature clip (S3→S4): absolutely positioned CLEAR overlay with `clip-path: circle(0% at X Y)` → `circle(150% at X Y)` scrubbed over 60% viewport, X/Y = spout position (read from SVG `getBoundingClientRect`).

### 3.4 Environment (`motion/env.ts`)
`isTouch = matchMedia('(pointer: coarse)')`, `reduced = matchMedia('(prefers-reduced-motion: reduce)')`, `lowEnd = navigator.deviceMemory <= 2 || hardwareConcurrency <= 4 || connection.saveData || /2g|3g/.test(effectiveType)`. `lowEnd` → treat like reduced for sequences (static images), keep simple reveals.

### 3.5 matchMedia contexts
```ts
mm.add({
  desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  mobile:  '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
}, (ctx) => { const { desktop, mobile, reduced } = ctx.conditions!; /* build per-section timelines */ });
```

## 4. Per-section timelines

Percentages = progress through that section's ScrollTrigger (pinned length stated). "D" = desktop, "M" = mobile.

### S1 Hero (not pinned; time-based entrance + scroll-out)
```text
t=0 ms      (CSS) background glow opacity 0→0.6  (1100 ms)
t=100 ms    eyebrow fade-up                        (450 ms)
t=180 ms    H1 words rise, stagger 60 ms           (≈700 ms total)
t=420 ms    sub fade-up; CTAs fade-up (stagger 80)
t=300 ms    product: opacity 0→1, scale .96→1      (900 ms, ease.out)
after load  ambient video crossfades over still (only if capable), 400 ms

Scroll-out (hero top→bottom leaves viewport):
0–60%   product scale 1→0.9, y 0→−40px; copy opacity 1→0, y 0→−30px
60%     header / sticky bar slides in (y −100%→0 / y 100%→0, 300 ms)
80–100% video paused; glow shifts toward product centre (hand-off to S2)
```

### S2 Product Reveal (pin D 300% / M 220%)
```text
0–5%     canvas fades in over hero still (frames identical) ; progress line appears (D)
0–33%    Ch1 "Design": frames 1→40 (orbit front-3/4 → side). Text lines in at 3–10%, hold, out at 28–33%
33–66%   Ch2 "Display": frames 41→80 (push-in to display, display lights up in render). Text in 36–43%, out 61–66%
66–95%   Ch3 "Inside": frames 81→120 (casing fades, filter & chamber revealed, water path glows). Text in 69–76%
95–100%  canvas opacity 1→0 while S3 SVG line-art (pre-positioned) opacity 0→1 → hand-off
M: 60 frames mapped identically (1→20, 21→40, 41→60); text sits in bottom scrim; no progress line.
Reduced / lowEnd: 3 stacked stills with captions, fade-up reveals only.
v1 fast-lane (no renders): 3 stills crossfade at 33/66%; each still slow scale 1→1.06 during its chapter.
```

### S3 How It Works (pin D 250% / M 200%)
```text
0–5%     diagram line-art fully visible (from hand-off); stage list appears
5–20%    Stage 1: inlet path draws (stroke-dashoffset); label 1 active
20–40%   Stage 2: path through filter; filter body fills with subtle texture; label 2 active
40–65%   Stage 3: chamber — plates light sequentially (stagger), 30–40 ion dots drift to plates; label 3 active
65–85%   Stage 4: path splits: alkaline branch (green→aqua gradient), acidic branch (amber); label 4
85–95%   Stage 5: spout glow; display in diagram shows level; label 5; background ink→deep green
95–100%  spout point highlights → triggers S4 clip transition start
D: snap to stage centres (snap: {snapTo: [0,.2,.4,.65,.85,1], duration: .4, ease: 'power1.inOut'})
M: vertical diagram; no snap; stage text block swaps (crossfade 250 ms)
Reduced: static final-state diagram + ordered list
```

### Transition S3→S4 "the water clears" (scrubbed, not pinned, 60vh)
```text
0%    CLEAR overlay circle(0% at spout)
0–100% circle radius → 150% ; body bg ink→clear ; text colour tokens swap at 50%
Reduced: instant theme swap with 200 ms fade
```

### S4 Choose Your Water (not pinned; interaction timeline)
```text
Enter (top at 70% vp): heading lines reveal; display ring draws (stroke) 700 ms; chips stagger in
Auto-demo (once, if not interacted within 1.2 s of full view): select level A → +2.2 s level B → +2.2 s level C → stop
On select(level):
  0 ms     chip pressed state (scale .96→1, 150 ms)
  0–400    dial pointer rotates to level angle (ease.spring); value counts to pH (400 ms)
  150–550  drop falls from top of glass (y −60→0, ease.in), splash ring scale 0→1 fade
  400–1000 glass liquid colour tween → level.reagentColor (radial bloom from drop point)
  400–650  use-case text crossfade; aria-live update
Reduced: instant colour/text change, no drop.
```

### S5 Feature Showcase (sticky, not pinned via GSAP; CSS sticky + triggers)
```text
D: product sticky (top 12vh, height 76vh). Each feature block (min-height 70vh) has trigger at 55% vp:
   onEnter: hotspot N pulse (scale 1→1.3→1, 600 ms); connector SVG path draws (400 ms);
            product image transform → translate/scale toward feature focus (700 ms, ease.inOut; max 1.25×)
   onLeave: connector retracts; product returns toward neutral if next feature far
M: product sticky top (45svh); feature cards horizontal scroll-snap; card change → hotspot highlight + small zoom (1.1×)
Reduced: static product + list; hotspots still clickable (no zoom)
```

### S6 Built to Last
```text
Tiles: mask-up reveal stagger 0.08; numbers count once; macro images parallax −20→20 px (D only)
```

### S7 Fits Your Space
```text
D: pin 200%; x: 0 → −(panelsWidth − vw); each panel's image scale 1.08→1 as it centres; caption fade
M: native scroll-snap; dots indicator; images lazy; no GSAP
```

### S8 Comparison
```text
Rows fade-up stagger 0.08; Lennore column highlight bar grows scaleY 0→1 (500 ms)
Exit: gradient wipe CLEAR→INK over 50vh (bg tween + overlay gradient translateY)
```

### S9–S12 Trust, Stories, Pricing, FAQ
```text
Simple fade-up / lines reveals only. Video cards: poster → play on tap. FAQ: height via <details> + grid-template-rows 0fr→1fr (250 ms).
```

### S13 Form
```text
Enter: heading lines; card scale .98→1 + fade (450 ms); glow opacity breathe 0.35↔0.55 (4 s yoyo, paused when offscreen)
Field focus: underline scaleX 0→1 (250 ms); valid: tiny check fade-in
Submit: button text → spinner (150 ms); success: card content crossfade, check path draw (400 ms), step-2 fields stagger in
Error: shake x ±6 px ×2 (240 ms) on button only (not reduced), message fade
```

### Global
```text
Header/sticky bar: y slide 300 ms on show/hide
CTA hover (D): background shift + arrow x 0→4 px (150 ms); magnetic ≤ 6 px on primary only
Button press (M): scale .97 (100 ms)
Scroll progress (D): scaleX from ScrollTrigger on document
```

## 5. Total pinned scroll budget
Desktop: S2 300% + S3 250% + S7 200% = 7.5 viewports of pinned scroll. Mobile: 220% + 200% = 4.2 viewports (S7 not pinned). This is the maximum; if analytics show drop-off inside S2/S3 (scroll depth + section completion events), reduce pin lengths first.

## 6. Anti-patterns (do not do)
- Preloaders / intro splash
- Scroll-jacking of the whole page, `normalizeScroll` on mobile
- Character-by-character animation of body text
- Infinite marquees of reviews/logos
- Parallax on text or form fields
- Custom cursors replacing the system cursor
- Pinning the form or FAQ
- Autoplay video with sound

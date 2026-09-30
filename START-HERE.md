# START HERE — Lennore L9 Landing Page

This folder has everything needed to build the page: docs, product data, design tokens, the logo and all final images and videos.

**Where things are:**
- Videos: `assets/videos/` (4 videos plus poster images)
- Images: `assets/images/` (hero, product, closeup, light, models, photos, lifestyle, water, backgrounds)
- Logo: `assets/brand/`
- What goes where on the page: `assets/ASSETS.md`

## 1. Open the project
1. Unzip this file. You will get the `lennore-lp` folder.
2. Open the `lennore-lp` folder in VS Code.
3. Open the terminal (Ctrl + `) and run `claude`.

## 2. First prompt (copy-paste into Claude Code)
```
Read CLAUDE.md, START-HERE.md, assets/ASSETS.md and all files in /docs.
Then start Phase 5 (project setup) from docs/10-implementation-blueprint.md.
After it builds, continue with Phase 6: build the full static page (no animation yet)
using the real assets in /assets and data from content/product.json.
Hide any section whose data is missing. Ask me before changing the stack.
When done, tell me how to run it locally.
```

## 3. Next prompts (one at a time, check the page in the browser after each)
| Step | Prompt |
|---|---|
| Assets | `Optimise all assets per docs/06 (AVIF/WebP images, re-encode videos to the size budgets, mobile 720p) and wire them in.` |
| Animation | `Start Phase 7 and 8. Motion system + scroll story. Use Plan B for S2 (stills crossfade/zoom from assets/ASSETS.md). pH selector uses the 9 levels in product.json.` |
| Mobile | `Start Phase 9 — mobile layouts, sticky bottom bar (Book Demo / WhatsApp / Call).` |
| Form | `Start Phase 10 — lead form (name, mobile, pincode) to Google Sheet webhook + WhatsApp fallback.` |
| Tracking | `Start Phase 11 — GTM, GA4, Google Ads conversion, Meta Pixel + CAPI.` |
| QA | `Run Phase 12 and 13 — performance budgets and QA checklist. Give me a report.` |
| Launch | `Phase 14 — deploy to Cloudflare Pages.` |

## 4. Still needed from you or the client
- [x] Logo (done, in `assets/brand/`)
- [ ] Which models to advertise (L9 / L5 / L5+RO / L7+RO) and which L9 screen version is current. See `assets/ASSETS.md`.
- [ ] Phone and WhatsApp number, demo cities, price or "starting from", warranty. Add them to `content/product.json`.
- [ ] Plates, filter life, which pH levels are for drinking (from the manual).
- [ ] Real customer testimonials. That section stays hidden until you have them.

## 5. Rules (already in CLAUDE.md)
- No health or disease claims anywhere (docs/11).
- No invented specs. Missing data means the item is hidden.
- The page must load fast on mobile (docs/07).

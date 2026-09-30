# Lennore Alkaline Water Ionizer — Paid-Ads Landing Page
## Build-Ready Package (v1.1 · 30 Sep 2026) — docs + final assets

This folder is the complete pre-development blueprint for a premium, cinematic, conversion-focused landing page for **Lennore** (lennore.in — Lennore India Pvt. Ltd., Delhi), built for Google Ads and Meta Ads traffic.

> Note: the original brief said "Lenovo". The brand is **Lennore**. All documents use the correct name.

---

## How to use this package

1. Extract this folder. Rename it to your project name if you like (e.g. `lennore-lp`).
2. Open it in VS Code.
3. Start Claude Code in the folder root. It will read `CLAUDE.md` automatically.
4. Tell Claude Code: **"Read CLAUDE.md, assets/ASSETS.md and docs, then start Phase 5 (Project setup)."** Research, PRD, TRD and **all visual assets are done** (`/assets`). Contact details, price and warranty still come from the client (`client-intake/`).
5. Work phase by phase using the prompts in `docs/10-implementation-blueprint.md`. Do not skip the acceptance checks at the end of each phase.

---

## Folder map

```text
lennore-lp/
├── START-HERE.md                      ← open this first (first prompt for Claude Code)
├── README.md                          ← you are here
├── CLAUDE.md                          ← standing instructions for Claude Code
├── docs/
│   ├── 00-executive-summary.md        ← decisions, risks, open questions (read first)
│   ├── 01-research-report.md          ← D1  site audit, market, techniques, compliance
│   ├── 02-prd.md                      ← D2  product requirements
│   ├── 03-trd.md                      ← D3 D4 D12 D13  tech stack, architecture, folders
│   ├── 04-ux-blueprint.md             ← D5 D6  sitemap, wireframe, section-by-section storyboard
│   ├── 05-animation-blueprint.md      ← D7  scroll system + per-section timelines
│   ├── 06-asset-requirements.md       ← D8 D9 D10 D11  video, image, 3D, asset checklist
│   ├── 07-performance-and-mobile.md   ← D15 D18
│   ├── 08-seo-analytics-ads.md        ← D16 D17  + ad-landing architecture, A/B testing
│   ├── 09-roadmap-and-qa.md           ← D14 D19
│   ├── 10-implementation-blueprint.md ← D20  phase-by-phase build prompts for Claude Code
│   └── 11-copy-deck-and-claims-policy.md ← draft copy + what we may / may not claim
├── assets/                            ← FINAL images + videos (see assets/ASSETS.md for section mapping)
│   ├── ASSETS.md
│   ├── images/ hero · product · closeup · light · backgrounds · lifestyle · water · _originals
│   ├── videos/ hero desktop+mobile loops, drop, stream + posters
│   └── brand/  (logo files still needed)
├── content/
│   └── product.json                   ← SINGLE source of truth (L9 pH levels/controls/ports filled; specs, price, contact pending)
├── design/
│   └── tokens.json                    ← proposed colour, type, spacing, motion tokens
└── client-intake/
    └── asset-request-checklist.md     ← send this to Lennore; everything we need from them
```

## Deliverable index (brief §34)

| # | Deliverable | Where |
|---|---|---|
| 1 | Research report | `docs/01` |
| 2 | PRD | `docs/02` |
| 3 | TRD | `docs/03` |
| 4 | Tech stack + reasoning | `docs/03` §1–2, `docs/01` §5 |
| 5 | Sitemap / page structure | `docs/04` §1–2 |
| 6 | Section-by-section UX/UI blueprint | `docs/04` §3 |
| 7 | Scroll-animation blueprint | `docs/05` |
| 8 | Video requirements | `docs/06` §1 |
| 9 | Image requirements | `docs/06` §2 |
| 10 | 3D / animation requirements | `docs/06` §3 |
| 11 | Asset checklist | `docs/06` §4, `client-intake/` |
| 12 | Component architecture | `docs/03` §5 |
| 13 | Folder structure | `docs/03` §6 |
| 14 | Development roadmap | `docs/09` §1 |
| 15 | Performance strategy | `docs/07` §1 |
| 16 | SEO strategy | `docs/08` §1 |
| 17 | Analytics & conversion tracking | `docs/08` §2–4 |
| 18 | Mobile strategy | `docs/07` §2 |
| 19 | Testing & QA checklist | `docs/09` §2 |
| 20 | Final implementation blueprint | `docs/10` |

## Status of inputs

| Input | Status |
|---|---|
| Existing site lennore.in | Only publicly indexed content could be reviewed (site blocks automated crawling). Specs, prices, images, colours are **not yet captured** → `content/product.json` placeholders. |
| Product photos / video | Needed from client |
| Spec sheet, filter test report, certifications, warranty terms | Needed from client |
| Testimonials (with written consent) | Needed from client |
| Brand guidelines / logo files | Needed from client |

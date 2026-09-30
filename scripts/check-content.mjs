#!/usr/bin/env node
/**
 * Pre-build content gate (docs/03 §6, CLAUDE.md rules 1–2).
 *  - FAILS on: invalid structure, missing hero data, media paths that don't exist,
 *    banned health/disease/superlative wording in page copy.
 *  - REPORTS (does not fail): facts that are missing, so their UI is hidden in production.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const errors = [];
const hidden = [];

const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const isMissing = (v) =>
  v === null ||
  v === undefined ||
  (typeof v === 'string' && (v.trim() === '' || /^todo\b/i.test(v.trim()))) ||
  (Array.isArray(v) && v.length === 0);

// ---------------------------------------------------------------- product.json
let product;
try {
  product = read('content/product.json');
} catch (e) {
  console.error(`✖ content/product.json is not valid JSON: ${e.message}`);
  process.exit(1);
}

const heroModel = (product.models ?? []).find((m) => m.isHero);
if (!heroModel) errors.push('No model has "isHero": true');
if (isMissing(product.company?.legalName)) errors.push('company.legalName is required');
if (heroModel && isMissing(heroModel.phLevels)) errors.push(`models.${heroModel.id}.phLevels is empty (S4 needs it)`);
if (heroModel && isMissing(heroModel.media?.heroStill?.desktop)) errors.push('hero model media.heroStill is required (LCP image)');

// Every media path referenced in product.json must exist on disk.
(function walk(node, path) {
  if (typeof node === 'string') {
    if (/^assets\/.+\.(jpe?g|png|webp|avif|mp4|webm)$/i.test(node) && !existsSync(join(root, node))) {
      errors.push(`${path}: file not found → ${node}`);
    }
    return;
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${Array.isArray(node) ? (v?.id ?? k) : k}` : k);
  }
})(product, '');

// Images used by the page must also be copied into src/assets (never ship /assets raw).
for (const p of [heroModel?.media?.heroStill?.desktop, heroModel?.media?.heroStill?.mobile].filter(Boolean)) {
  const copy = join(root, 'src', p);
  if (!existsSync(copy)) errors.push(`${p} has not been copied to src/${p}`);
}

// ---------------------------------------------------------------- what will be hidden
const c = product.company ?? {};
const s = product.service ?? {};
const h = heroModel ?? {};
const report = [
  ['company.phone', c.phone, 'Call buttons (hero, sticky bar, form, footer)'],
  ['company.whatsapp', c.whatsapp, 'WhatsApp buttons everywhere'],
  ['company.registeredAddress', c.registeredAddress, 'Address in S9 and footer'],
  ['company.supportHours', c.supportHours, 'Support hours'],
  ['service.demoCities', s.demoCities, 'Hero proof chip, S9 service coverage, FAQ "which cities"'],
  ['service.demoDurationMinutes', s.demoDurationMinutes, 'S13 reassurance bullet, FAQ "is the demo free"'],
  ['service.installationBy', s.installationBy, 'S7/S9 installation line, FAQ "who installs"'],
  ['service.responseSlaHours', s.responseSlaHours, 'Form success message timing'],
  [`models.${h.id}.plates / plateMaterial`, h.plates ?? h.plateMaterial, 'S3 plate count, S6 plates tile'],
  [`models.${h.id}.filter.type`, h.filter?.type, 'S3 stage 2 (filtration), S6 filter tile'],
  [`models.${h.id}.filter.lifeLitres`, h.filter?.lifeLitres, 'S6 filter-life tile, FAQ filter'],
  [`models.${h.id}.phLevels[].recommendedUse`, h.phLevels?.find((l) => l.recommendedUse)?.recommendedUse, 'S4 "Best for" line, hero use-case sub'],
  [`models.${h.id}.phLevels[].drinkable`, h.phLevels?.find((l) => l.drinkable !== null)?.drinkable, 'S4 "For drinking" line, FAQ drinking levels'],
  [`models.${h.id}.phLevels[].reagentColor`, h.phLevels?.find((l) => l.reagentColor)?.reagentColor, 'S4 uses provisional token colours'],
  [`models.${h.id}.features[]`, h.features?.find((f) => f.title)?.title, 'S5 uses facts derived from display/controls/spout/ports instead'],
  [`models.${h.id}.warranty.machine`, h.warranty?.machine, 'Hero chip, S6 warranty tile, S9 warranty, FAQ warranty'],
  [`models.${h.id}.priceFrom`, h.priceFrom, 'S11 Pricing section'],
  [`models.${h.id}.powerConsumption`, h.powerConsumption, 'FAQ electricity'],
  ['testimonials', product.testimonials, 'S10 Customer stories section'],
  ['comparison.rows (+ legalReviewed)', product.comparison?.legalReviewed ? product.comparison.rows : null, 'S8 Comparison section'],
];
for (const [key, value, effect] of report) if (isMissing(value)) hidden.push([key, effect]);

// ---------------------------------------------------------------- claims guard (docs/11 §2)
const BANNED = [
  /\bcur(e|es|ed|ing)\b/i, /\btreat(s|ed|ing|ment)?\b/i, /\bprevent(s|ed|ing|ion)?\b/i, /\bheal(s|ing)?\b/i,
  /\bdiabet/i, /\bcancer/i, /\bblood pressure\b/i, /\bcholesterol/i, /\bkidney/i, /\bgout\b/i, /\barthritis/i,
  /\bacidity\b/i, /\bdigest/i, /\bimmun/i, /\bdetox/i, /\banti-?ag(e|ing)/i, /\bweight loss\b/i, /\bantioxidant/i,
  /\bfree radicals?\b/i, /\bbody'?s? pH\b/i, /\balkali[sz]es? (your|the) body\b/i, /\bmicro-?cluster/i,
  /\bhydrates? (faster|better)\b/i, /\bmedical[- ]grade\b/i, /\bdoctor[- ]recommended\b/i, /\bclinically\b/i,
  /\bIndia'?s (best|no\.? ?1|first)\b/i, /\bmost advanced\b/i, /\bhealth(y|ier)?\b/i, /\benergy\b/i,
];
// The legally required disclaimer is the only place these words may appear.
const ALLOWED_SENTENCES = [
  'not intended to diagnose, treat, cure or prevent any disease',
];
function scan(file) {
  let text = readFileSync(file, 'utf8');
  for (const ok of ALLOWED_SENTENCES) text = text.split(ok).join('');
  text.split(/\r?\n/).forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // code comments
    for (const re of BANNED) {
      const m = line.match(re);
      if (m) errors.push(`Claims policy: "${m[0]}" in ${file.slice(root.length)}:${i + 1} (docs/11 §2)`);
    }
  });
}
function walkDir(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkDir(p);
    else if (['.ts', '.json', '.md'].includes(extname(p)) && !p.endsWith('product.ts')) scan(p);
  }
}
walkDir(join(root, 'src', 'content'));

// ---------------------------------------------------------------- output
if (hidden.length) {
  console.log(`\nℹ ${hidden.length} facts missing from content/product.json — the UI that needs them is hidden in production:`);
  for (const [k, effect] of hidden) console.log(`   · ${k.padEnd(44)} → ${effect}`);
}
if (errors.length) {
  console.error(`\n✖ Content check failed (${errors.length}):`);
  for (const e of errors) console.error(`   · ${e}`);
  process.exit(1);
}
console.log('\n✔ Content check passed\n');

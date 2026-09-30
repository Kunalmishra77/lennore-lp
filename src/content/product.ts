/**
 * Typed, validated access to /content/product.json — the single source of truth for product facts.
 * Never add facts here; add them to content/product.json with a source.
 */
import { z } from 'zod';
import raw from '../../content/product.json';

const str = z.string().min(1);
const nstr = str.nullable();
const nnum = z.number().nullable();

const PhLevel = z.object({
  id: str,
  label: str,
  ph: str,
  stream: z.enum(['alkaline', 'neutral', 'acidic']),
  recommendedUse: nstr,
  drinkable: z.boolean().nullable(),
  reagentColor: nstr,
});

const Filter = z.object({
  type: nstr,
  stages: nnum,
  lifeLitres: nnum,
  lifeMonthsTypical: nnum,
  indicator: nstr,
  replacementPrice: nnum,
  claims: z.array(str),
  testReportUrl: nstr,
});

const Warranty = z.object({
  machine: nstr,
  plates: nstr,
  filter: nstr,
  termsUrl: nstr,
});

const HotspotPoint = z.object({ x: z.number(), y: z.number() }).nullable();

const Feature = z.object({
  id: str,
  title: nstr,
  body: nstr,
  spec: nstr,
  hotspot: z.object({ desktop: HotspotPoint, mobile: HotspotPoint }).optional(),
});

const Installation = z.enum(['countertop', 'under-counter', 'wall-mounted']);

const ModelMedia = z
  .looseObject({
    card: str.optional(),
    cutout: str.optional(),
    cutouts: z.array(str).optional(),
    photos: z.array(str).optional(),
    lifestyle: z.array(str).optional(),
    heroStill: z.object({ desktop: str, mobile: str }).optional(),
    revealSequence: z.unknown().nullable().optional(),
    revealStills: z.object({ desktop: z.array(str), mobile: z.array(str) }).optional(),
    lightTheme: z.array(str).optional(),
    dropVideo: str.optional(),
    streamVideo: str.optional(),
    heroVideo: z.object({ desktop: str, mobile: str }).optional(),
  });

const Model = z.object({
  id: str,
  name: str,
  isHero: z.boolean(),
  plates: nnum,
  plateMaterial: nstr,
  electrolysisPower: nstr,
  phLevels: z.array(PhLevel),
  orpRange: nstr,
  filter: Filter,
  autoClean: z.boolean().nullable(),
  autoCleanSource: nstr.optional(),
  display: nstr,
  sidePorts: z.array(str).optional(),
  controls: z.array(str).optional(),
  spout: nstr.optional(),
  flowRateLpm: nnum,
  inletPressure: nstr,
  powerSupply: nstr,
  powerConsumption: nstr,
  dimensionsMm: nstr,
  weightKg: nnum,
  installation: z.array(Installation),
  features: z.array(Feature),
  priceFrom: nnum,
  priceInclusions: z.array(str),
  emi: nstr,
  warranty: Warranty,
  certifications: z.array(z.looseObject({ name: str, reportUrl: nstr, source: nstr })),
  countryOfOrigin: nstr,
  media: ModelMedia,
});

const Testimonial = z.object({
  id: str,
  name: str,
  city: str,
  month: str,
  quote: str,
  consentOnFile: z.literal(true),
  videoUrl: nstr.optional(),
});

const Offer = z.looseObject({ id: str, text: str, validTill: nstr });

const Product = z.object({
  company: z.object({
    legalName: str,
    brand: str,
    website: str,
    email: nstr,
    phone: nstr,
    whatsapp: nstr,
    registeredAddress: nstr,
    cin: nstr,
    supportHours: nstr,
    social: z.object({ instagram: nstr, facebook: nstr, youtube: nstr, pinterest: nstr }),
    officialTagline: nstr,
  }),
  service: z.object({
    demoCities: z.array(str),
    servicePincodePrefixes: z.array(str),
    demoDurationMinutes: nnum,
    installationBy: nstr,
    installationLeadTimeDays: nnum,
    responseSlaHours: nnum,
  }),
  models: z.array(Model).min(1),
  testimonials: z.array(Testimonial),
  offers: z.array(Offer),
  comparison: z.object({
    rows: z.array(z.looseObject({ label: str, ionizer: str, roCartridge: str })),
    source: nstr,
    legalReviewed: z.boolean(),
  }),
});

export type ProductData = z.infer<typeof Product>;
export type ModelData = z.infer<typeof Model>;
export type PhLevelData = z.infer<typeof PhLevel>;
export type InstallationType = z.infer<typeof Installation>;

const parsed = Product.safeParse(raw);
if (!parsed.success) {
  throw new Error(`content/product.json failed validation:\n${z.prettifyError(parsed.error)}`);
}

export const product: ProductData = parsed.data;
export const company = product.company;
export const service = product.service;

const heroModel = product.models.find((m) => m.isHero);
if (!heroModel) throw new Error('content/product.json: no model has "isHero": true');
export const hero: ModelData = heroModel;

/** A value counts as missing if it is null/undefined, an empty string/array, or a "TODO" marker. */
export function missing(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '' || /^todo\b/i.test(value.trim());
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** Look up a dotted path in the raw product data, e.g. "company.phone" or "models.l9.warranty.machine". */
export function get(path: string): unknown {
  let cur: unknown = product;
  for (const part of path.split('.')) {
    if (cur === null || cur === undefined) return undefined;
    if (Array.isArray(cur)) {
      cur = cur.find((x) => (x as { id?: string }).id === part) ?? cur[Number(part)];
    } else {
      cur = (cur as Record<string, unknown>)[part];
    }
  }
  return cur;
}

export function isMissing(path: string): boolean {
  return missing(get(path));
}

/** True only if every path is present. */
export function hasAll(...paths: string[]): boolean {
  return paths.every((p) => !isMissing(p));
}

/** Contact links (null when the number is not in product.json or the env). */
function digits(v: string | null | undefined): string | null {
  const d = (v ?? '').replace(/\D/g, '');
  return d.length >= 10 ? d : null;
}
const waNumber = digits(company.whatsapp) ?? digits(import.meta.env.PUBLIC_WHATSAPP_NUMBER);
const phoneNumber = digits(company.phone) ?? digits(import.meta.env.PUBLIC_PHONE_NUMBER);

export function whatsappHref(text: string): string | null {
  return waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}` : null;
}
export const phoneHref: string | null = phoneNumber ? `tel:+${phoneNumber}` : null;
export const phoneDisplay: string | null = company.phone ?? (phoneNumber ? `+${phoneNumber}` : null);

/** Hero model pH facts derived from product.json (never hard-coded). */
export const phLevels = hero.phLevels;
const phNums = phLevels.map((l) => Number.parseFloat(l.ph)).filter((n) => Number.isFinite(n));
export const phRange =
  phNums.length > 0 ? { min: Math.min(...phNums), max: Math.max(...phNums), count: phLevels.length } : null;

/** Campaign variants (docs/08 §4). One JSON per route; no per-campaign code. */
import { z } from 'zod';

const Variant = z.object({
  slug: z.string(),
  lang: z.string(),
  index: z.boolean(),
  hero: z.object({ eyebrow: z.string().nullable(), h1: z.string().nullable(), sub: z.string().nullable() }),
  cta: z.object({ primary: z.string().nullable(), whatsappText: z.string() }),
  offer: z.object({ enabled: z.boolean(), text: z.string().nullable(), validTill: z.string().nullable() }),
  sections: z.object({
    comparison: z.boolean(),
    testimonials: z.boolean(),
    models: z.boolean(),
    pricing: z.boolean(),
  }),
  models: z.array(z.string()),
  tracking: z.object({ variantId: z.string() }),
});
export type VariantData = z.infer<typeof Variant>;

const files = import.meta.glob<unknown>('./variants/*.json', { eager: true, import: 'default' });

export const variants: VariantData[] = Object.entries(files).map(([file, data]) => {
  const r = Variant.safeParse(data);
  if (!r.success) throw new Error(`${file} failed validation:\n${z.prettifyError(r.error)}`);
  return r.data;
});

const def = variants.find((v) => v.slug === '');
if (!def) throw new Error('src/content/variants/default.json (slug "") is required');
export const defaultVariant: VariantData = def;

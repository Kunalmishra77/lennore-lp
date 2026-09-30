/**
 * Builds an art-directed <picture> (different crops for mobile/desktop) with AVIF + WebP sources.
 * The same result feeds both the <picture> markup and the LCP <link rel="preload"> tags, so the
 * preloaded URL is always the one the browser picks.
 */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export const MOBILE_QUERY = '(max-width: 767px)';
export const DESKTOP_QUERY = '(min-width: 768px)';

export type SourceSet = { type: string; srcset: string; media: string; sizes: string };
export type ArtDirected = {
  sources: SourceSet[];
  fallback: { src: string; width: number; height: number };
  mobileRatio: number;
  desktopRatio: number;
};

type Opts = {
  mobile: ImageMetadata;
  desktop: ImageMetadata;
  mobileWidths?: number[];
  desktopWidths?: number[];
  mobileSizes?: string;
  desktopSizes?: string;
  quality?: number;
};

async function srcset(src: ImageMetadata, widths: number[], format: 'avif' | 'webp', quality: number) {
  const usable = widths.filter((w) => w <= src.width);
  const list = usable.length ? usable : [src.width];
  const out = await Promise.all(list.map((width) => getImage({ src, width, format, quality })));
  return out.map((r, i) => `${r.src} ${list[i]}w`).join(', ');
}

export async function artDirected({
  mobile,
  desktop,
  mobileWidths = [480, 720, 960, 1200],
  desktopWidths = [1024, 1440, 1920, 2560],
  mobileSizes = '100vw',
  desktopSizes = '100vw',
  quality = 60,
}: Opts): Promise<ArtDirected> {
  const sources: SourceSet[] = [];
  for (const format of ['avif', 'webp'] as const) {
    sources.push({
      type: `image/${format}`,
      media: MOBILE_QUERY,
      sizes: mobileSizes,
      srcset: await srcset(mobile, mobileWidths, format, format === 'avif' ? quality - 10 : quality),
    });
    sources.push({
      type: `image/${format}`,
      media: DESKTOP_QUERY,
      sizes: desktopSizes,
      srcset: await srcset(desktop, desktopWidths, format, format === 'avif' ? quality - 10 : quality),
    });
  }
  const fb = await getImage({ src: desktop, width: 1440, format: 'jpg', quality: 70 });
  return {
    sources,
    fallback: { src: fb.src, width: 1440, height: Math.round((1440 * desktop.height) / desktop.width) },
    mobileRatio: mobile.width / mobile.height,
    desktopRatio: desktop.width / desktop.height,
  };
}

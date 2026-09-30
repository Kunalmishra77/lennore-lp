/**
 * Resolves the asset paths used in content/product.json ("assets/images/…") to the optimisable copies
 * in src/assets. Throws at build time if a referenced image was not copied, so it can't silently vanish.
 */
import type { ImageMetadata } from 'astro';

const images = import.meta.glob<ImageMetadata>('/src/assets/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

export function img(path: string): ImageMetadata {
  const key = `/src/${path.replace(/^\/?(src\/)?/, '')}`;
  const found = images[key];
  if (!found) throw new Error(`Image not found in src/: ${path} (looked for ${key})`);
  return found;
}

export function maybeImg(path: string | null | undefined): ImageMetadata | null {
  return path ? img(path) : null;
}

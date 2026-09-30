// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.PUBLIC_SITE_URL || 'https://go.lennore.in';

// Pages that are indexable (docs/08 §1.6). Variants, thank-you and 404 stay out of the sitemap.
const INDEXABLE = new Set(['/', '/privacy/', '/terms/', '/disclaimer/']);

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
  // No code blocks on this site; Shiki's inline styles are incompatible with CSP.
  markdown: { syntaxHighlight: false },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  security: {
    // Astro 6 CSP API: hashes for bundled scripts/styles are added automatically.
    // Third-party origins (GTM, Google, Meta, Turnstile) are added in Phase 11/14.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "media-src 'self'",
        "connect-src 'self'",
        "base-uri 'self'",
        "form-action 'self' https://wa.me",
        "object-src 'none'",
      ],
    },
  },
  integrations: [
    sitemap({
      filter: (page) => INDEXABLE.has(new URL(page).pathname),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

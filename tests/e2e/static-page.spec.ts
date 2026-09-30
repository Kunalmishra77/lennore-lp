import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Phase 6 — static page', () => {
  test('renders all data-backed sections, one h1, no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    for (const id of ['#how', '#choose', '#features', '#service', '#models', '#faq', '#book']) {
      await expect(page.locator(id)).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });

  test('production build never shows [MISSING] badges', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-missing]')).toHaveCount(0);
    await expect(page.getByText('[MISSING', { exact: false })).toHaveCount(0);
  });

  test('hero image is the LCP candidate: eager, high priority, preloaded', async ({ page }) => {
    await page.goto('/');
    const img = page.locator('.hero__img');
    await expect(img).toHaveAttribute('fetchpriority', 'high');
    await expect(img).toHaveAttribute('loading', 'eager');
    await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(2);
  });

  test('no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBe(0);
  });

  test('axe: no WCAG 2.2 AA violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

test.describe('JS disabled', () => {
  test.use({ javaScriptEnabled: false });

  test('pH selector works with radios + CSS only', async ({ page }) => {
    await page.goto('/');
    const visibleLabel = page.locator('.cyw__result:visible .cyw__label');
    await expect(visibleLabel).toHaveText('Neutral Water');
    await page.locator('.cyw__chip', { hasText: '9.5' }).click();
    await expect(visibleLabel).toHaveText('High Alkaline');
    await page.keyboard.press('ArrowRight');
    await expect(visibleLabel).toHaveText('Ultra High Alkaline');
  });

  test('lead form posts to /api/lead without JS', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('form[data-lead-form]');
    await expect(form).toHaveAttribute('method', 'post');
    await expect(form).toHaveAttribute('action', '/api/lead');
  });
});

test('variant route is noindex with canonical to /', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/$/);
});

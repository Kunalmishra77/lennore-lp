#!/usr/bin/env node
/* global window, document, PerformanceObserver -- used inside page.evaluate(), which runs in the browser */
/**
 * Local page audit (dev tool): screenshots at 360/1440 and with JS off, console errors,
 * horizontal overflow, CLS, LCP element, axe (WCAG 2.2 AA) and the no-JS pH selector.
 * Usage: node scripts/audit-page.mjs <baseUrl> <outDir>   (run against `astro preview`)
 */
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] ?? 'http://localhost:4321';
const out = process.argv[3] ?? 'test-results/audit';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();

async function loadAllImages(page) {
  const imgs = page.locator('img');
  const n = await imgs.count();
  for (let i = 0; i < n; i++) await imgs.nth(i).scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
  await page
    .waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 30000 })
    .catch(() => console.error('  (some images still loading after 30 s)'));
  await page.evaluate(() => window.scrollTo(0, 0));
}

const runs = [
  ['m360', { width: 360, height: 780 }, true],
  ['d1440', { width: 1440, height: 900 }, true],
  ['m360-nojs', { width: 360, height: 780 }, false],
];
for (const [name, viewport, js] of runs) {
  const ctx = await browser.newContext({ viewport, javaScriptEnabled: js });
  const page = await ctx.newPage();
  page.setDefaultTimeout(30000);
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  if (js) {
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((l) => {
        const e = l.getEntries().at(-1);
        window.__lcp = { tag: e.element?.tagName, cls: e.element?.className, t: Math.round(e.startTime) };
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  }
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.screenshot({ path: `${out}/${name}-top.png` });
  const res = { name };
  if (js) res.lcp = await page.evaluate(() => window.__lcp);
  await loadAllImages(page);
  await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  res.h1 = await page.locator('h1').count();
  res.horizontalOverflowPx = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (js) {
    res.cls = await page.evaluate(() => +window.__cls.toFixed(4));
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    res.axe = axe.violations.map(
      (v) => `${v.id} (${v.impact}) ×${v.nodes.length}: ${v.nodes.slice(0, 4).map((n) => n.target.join(' ')).join(' | ')}`,
    );
  }
  // pH selector must work with and without JS (radios + CSS :has)
  await page.locator('.cyw__chip', { hasText: '9.5' }).click();
  res.phAfterClick = (await page.locator('.cyw__result:visible .cyw__label').allTextContents()).join(', ');
  await page.keyboard.press('ArrowRight');
  res.phAfterArrow = (await page.locator('.cyw__result:visible .cyw__label').allTextContents()).join(', ');
  res.errors = errors;
  console.log(JSON.stringify(res, null, 1));
  await ctx.close();
}
await browser.close();

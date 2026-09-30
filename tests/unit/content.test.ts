import { describe, expect, it } from 'vitest';
import { missing, isMissing, hero, phRange } from '../../src/content/product';

describe('missing()', () => {
  it('treats null, empty and TODO as missing', () => {
    expect(missing(null)).toBe(true);
    expect(missing(undefined)).toBe(true);
    expect(missing('')).toBe(true);
    expect(missing('  ')).toBe(true);
    expect(missing('TODO: from manual')).toBe(true);
    expect(missing([])).toBe(true);
  });
  it('keeps real values, including false and 0', () => {
    expect(missing('Delhi')).toBe(false);
    expect(missing(false)).toBe(false);
    expect(missing(0)).toBe(false);
    expect(missing(['x'])).toBe(false);
  });
});

describe('product data', () => {
  it('has a hero model with pH levels', () => {
    expect(hero.isHero).toBe(true);
    expect(hero.phLevels.length).toBeGreaterThan(0);
  });
  it('derives the pH range from the data', () => {
    const nums = hero.phLevels.map((l) => Number.parseFloat(l.ph));
    expect(phRange).toEqual({ min: Math.min(...nums), max: Math.max(...nums), count: hero.phLevels.length });
  });
  it('resolves dotted paths by model id', () => {
    expect(isMissing('company.legalName')).toBe(false);
    expect(isMissing(`models.${hero.id}.phLevels`)).toBe(false);
  });
});

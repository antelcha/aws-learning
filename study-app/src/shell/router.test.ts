import { describe, expect, it } from 'vitest';
import { href, parseHash } from './router';

describe('parseHash', () => {
  it('parses every route', () => {
    expect(parseHash('')).toEqual({ page: 'home' });
    expect(parseHash('#/')).toEqual({ page: 'home' });
    expect(parseHash(href.module('module-01'))).toEqual({ page: 'module', id: 'module-01' });
    expect(parseHash(href.lesson('m2-l5-pricing'))).toEqual({ page: 'lesson', id: 'm2-l5-pricing' });
    expect(parseHash(href.boss('module-02'))).toEqual({ page: 'boss', moduleId: 'module-02' });
    expect(parseHash('#/weak')).toEqual({ page: 'weak' });
    expect(parseHash('#/mistakes')).toEqual({ page: 'mistakes' });
    expect(parseHash('#/progress')).toEqual({ page: 'progress' });
  });
  it('returns not-found for unknown paths', () => {
    expect(parseHash('#/nope')).toEqual({ page: 'not-found' });
    expect(parseHash('#/lesson')).toEqual({ page: 'not-found' });
  });
});

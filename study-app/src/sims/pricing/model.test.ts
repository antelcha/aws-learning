import { describe, expect, it } from 'vitest';
import { HOURS_PER_YEAR, USAGE_PATTERNS, cheapestSuitable, patternById, yearlyCosts } from './model';

describe('usage patterns', () => {
  it('each profile covers exactly one year of hours', () => {
    for (const p of USAGE_PATTERNS) {
      expect(p.profile.reduce((n, s) => n + s.hours, 0)).toBe(HOURS_PER_YEAR);
    }
  });
});

describe('yearlyCosts', () => {
  it('prices a steady 24/7 pattern with a matching commitment', () => {
    const r = yearlyCosts(patternById('steady'), 2);
    expect(r['on-demand'].cost).toBe(1752);
    expect(r['savings-plans'].cost).toBe(490.56);
    expect(r.reserved.cost).toBe(438);
    expect(r.spot.cost).toBe(175.2);
    expect(r.reserved.wastedCommittedHours).toBe(0);
  });
  it('prices business hours with no commitment as On-Demand only', () => {
    const r = yearlyCosts(patternById('business-hours'), 0);
    expect(r['on-demand'].cost).toBe(520);
    expect(r['savings-plans'].cost).toBe(520);
    expect(r['savings-plans'].suitable).toBe(false);
    expect(cheapestSuitable(r)).toBe('on-demand');
  });
  it('reports wasted committed hours when the commitment exceeds usage', () => {
    const r = yearlyCosts(patternById('business-hours'), 2);
    expect(r.reserved.wastedCommittedHours).toBe(2 * (HOURS_PER_YEAR - 2600));
    expect(r.reserved.cost).toBe(438);
    expect(r.reserved.caveats.join(' ')).toMatch(/unused/i);
  });
  it('charges uncovered instance-hours at the On-Demand rate', () => {
    const r = yearlyCosts(patternById('steady'), 1);
    expect(r.reserved.cost).toBe(219 + 876);
  });
  it('marks Spot unsuitable unless the workload can be interrupted', () => {
    expect(yearlyCosts(patternById('steady'), 0).spot.suitable).toBe(false);
    expect(yearlyCosts(patternById('batch'), 0).spot.suitable).toBe(true);
  });
  it('marks commitments unsuitable when usage is unknown', () => {
    const r = yearlyCosts(patternById('unknown'), 1);
    expect(r.reserved.suitable).toBe(false);
    expect(cheapestSuitable(r)).toBe('on-demand');
  });
  it('lists Dedicated Hosts with no price', () => {
    const r = yearlyCosts(patternById('steady'), 2);
    expect(r.dedicated.cost).toBeNull();
    expect(r.dedicated.caveats.join(' ')).toMatch(/licens|compliance/i);
  });
  it('picks the cheapest suitable option', () => {
    expect(cheapestSuitable(yearlyCosts(patternById('steady'), 2))).toBe('reserved');
    expect(cheapestSuitable(yearlyCosts(patternById('batch'), 0))).toBe('spot');
  });
  it('accepts a custom hourly rate', () => {
    expect(yearlyCosts(patternById('steady'), 0, 0.2)['on-demand'].cost).toBe(3504);
  });
});

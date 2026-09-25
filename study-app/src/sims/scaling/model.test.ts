import { describe, expect, it } from 'vitest';
import { STEPS, TRAFFIC_PRESETS, instancesFor, normalizeConfig, simulate, type ScalingConfig } from './model';

const preset = (id: string) => TRAFFIC_PRESETS.find((p) => p.id === id)!.demand;
const base: ScalingConfig = { min: 2, desired: 2, max: 10, mode: 'dynamic', launchLag: 2, azCount: 2, loadBalancer: true };

describe('presets', () => {
  it('each covers one day of steps', () => {
    for (const p of TRAFFIC_PRESETS) expect(p.demand).toHaveLength(STEPS);
  });
});

describe('normalizeConfig', () => {
  it('keeps desired between min and max and the lag at least 1', () => {
    const c = normalizeConfig({ ...base, min: 3, desired: 1, max: 2, launchLag: 0 });
    expect(c).toMatchObject({ min: 3, max: 3, desired: 3, launchLag: 1 });
  });
});

describe('instancesFor', () => {
  it('rounds up to whole instances', () => {
    expect(instancesFor(0)).toBe(0);
    expect(instancesFor(250)).toBe(3);
    expect(instancesFor(1000)).toBe(10);
  });
});

describe('simulate', () => {
  it('a fixed fleet serves steady load within capacity and bills every hour', () => {
    const r = simulate(preset('steady'), { ...base, mode: 'fixed', desired: 3 });
    expect(r.totals.failed).toBe(0);
    expect(r.totals.instanceHours).toBe(3 * STEPS);
  });

  it('a fixed fleet sized for the average fails the spike; one sized for the peak pays all day', () => {
    const small = simulate(preset('spike'), { ...base, mode: 'fixed' });
    expect(small.totals.failed).toBe(3 * 800);
    expect(small.totals.instanceHours).toBe(48);
    const big = simulate(preset('spike'), { ...base, mode: 'fixed', desired: 10 });
    expect(big.totals.failed).toBe(0);
    expect(big.totals.instanceHours).toBe(240);
  });

  it('dynamic scaling reacts to the spike but fails requests during the launch lag', () => {
    const r = simulate(preset('spike'), base);
    expect(r.steps[18].failed).toBe(800);
    expect(r.steps[19].failed).toBe(800);
    expect(r.steps[20].failed).toBe(0);
    expect(r.steps[19].desired).toBe(10);
    expect(r.totals.failed).toBe(1600);
    expect(r.totals.instanceHours).toBe(72);
    // Scales back in after the spike.
    expect(r.steps[22].running).toBe(2);
  });

  it('predictive scaling has capacity ready before the spike', () => {
    const r = simulate(preset('spike'), { ...base, mode: 'predictive' });
    expect(r.totals.failed).toBe(0);
    expect(r.steps[17].running).toBe(10);
    expect(r.steps[17].serving).toBe(2);
    expect(r.totals.instanceHours).toBe(80);
  });

  it('never exceeds the maximum capacity', () => {
    const r = simulate(preset('spike'), { ...base, max: 5 });
    expect(Math.max(...r.steps.map((s) => s.running))).toBe(5);
    expect(r.totals.failed).toBe(800 + 800 + 500);
  });

  it('never goes below the minimum capacity', () => {
    const r = simulate(preset('steady'), { ...base, min: 4, desired: 4 });
    expect(r.steps.every((s) => s.running === 4)).toBe(true);
    expect(r.totals.instanceHours).toBe(96);
  });

  it('without a load balancer, new instances get no traffic from a hardcoded front end', () => {
    const r = simulate(preset('spike'), { ...base, loadBalancer: false });
    expect(r.steps[20].serving).toBe(10);
    expect(r.steps[20].served).toBe(200);
    expect(r.steps[20].instances.filter((i) => i.load > 0)).toHaveLength(2);
    expect(r.steps[20].instances.find((i) => i.hardcoded)!.load).toBe(500);
    expect(r.totals.failed).toBe(2400);
  });

  it('a load balancer spreads requests evenly across serving instances', () => {
    const r = simulate(preset('spike'), base);
    const loads = r.steps[20].instances.map((i) => i.load);
    expect(loads).toHaveLength(10);
    expect(new Set(loads)).toEqual(new Set([100]));
  });

  it('a single-AZ group is fully down during an AZ outage', () => {
    const cfg: ScalingConfig = { ...base, azCount: 1, desired: 3, azOutage: { start: 8, end: 12 } };
    const r = simulate(preset('steady'), cfg);
    expect(r.steps[8].served).toBe(0);
    expect(r.steps[11].running).toBe(0);
    expect(r.totals.failed).toBe(6 * 250);
  });

  it('a multi-AZ group keeps serving and replaces capacity in the healthy AZ', () => {
    const cfg: ScalingConfig = { ...base, desired: 3, azOutage: { start: 8, end: 12 } };
    const r = simulate(preset('steady'), cfg);
    expect(r.steps[8].served).toBe(100);
    expect(r.steps[10].serving).toBe(3);
    expect(r.steps[10].instances.every((i) => i.az === 'b')).toBe(true);
    expect(r.totals.failed).toBe(300);
  });

  it('a fixed fleet gets its instances back only when the AZ recovers', () => {
    const cfg: ScalingConfig = { ...base, mode: 'fixed', desired: 4, azOutage: { start: 8, end: 12 } };
    const r = simulate(preset('steady'), cfg);
    expect(r.steps[9].serving).toBe(2);
    expect(r.steps[12].serving).toBe(4);
  });
});

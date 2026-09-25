/**
 * Illustrative model of an Auto Scaling group behind a load balancer.
 * One step is one hour. Numbers are made up for learning; there are no prices.
 */

/** Requests one instance can serve in one step (illustrative). */
export const CAPACITY_PER_INSTANCE = 100;
export const STEPS = 24;

export type ScalingMode = 'fixed' | 'dynamic' | 'predictive';
export type Az = 'a' | 'b';

export interface ScalingConfig {
  min: number;
  desired: number;
  max: number;
  /** fixed: no Auto Scaling; dynamic: react to current demand; predictive: launch ahead of the known curve. */
  mode: ScalingMode;
  /** Steps between launching an instance and it serving traffic (at least 1). */
  launchLag: number;
  azCount: 1 | 2;
  /** false: the front end is hardcoded to the instances that existed at the start. */
  loadBalancer: boolean;
  /** Availability Zone "a" is down for steps start (inclusive) to end (exclusive). */
  azOutage?: { start: number; end: number };
  capacityPerInstance?: number;
}

export type InstanceState = 'serving' | 'starting' | 'unhealthy';

export interface InstanceView {
  id: number;
  az: Az;
  state: InstanceState;
  /** Requests offered to this instance in the step; above capacity means it is overloaded. */
  load: number;
  /** Known to the front end from the start (matters only without a load balancer). */
  hardcoded: boolean;
}

export interface StepResult {
  t: number;
  demand: number;
  /** The group's desired capacity during this step. */
  desired: number;
  /** Instances that exist and are billed this step, including starting and unhealthy ones. */
  running: number;
  /** Instances that receive traffic this step. */
  serving: number;
  served: number;
  failed: number;
  instances: InstanceView[];
}

export interface ScalingResult {
  steps: StepResult[];
  totals: { demand: number; served: number; failed: number; instanceHours: number; peakInstances: number };
}

interface Instance {
  id: number;
  az: Az;
  readyAt: number;
  hardcoded: boolean;
  alive: boolean;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function normalizeConfig(c: ScalingConfig): ScalingConfig {
  const min = Math.max(0, Math.floor(c.min));
  const max = Math.max(min, Math.floor(c.max));
  return {
    ...c,
    min,
    max,
    desired: clamp(Math.floor(c.desired), min, max),
    launchLag: Math.max(1, Math.floor(c.launchLag)),
  };
}

/** Instances needed to serve a demand. */
export function instancesFor(demand: number, capacity: number = CAPACITY_PER_INSTANCE): number {
  return Math.ceil(Math.max(0, demand) / capacity);
}

export function simulate(demand: number[], rawConfig: ScalingConfig): ScalingResult {
  const config = normalizeConfig(rawConfig);
  const cap = config.capacityPerInstance ?? CAPACITY_PER_INSTANCE;
  const azs: Az[] = config.azCount === 2 ? ['a', 'b'] : ['a'];
  const azDown = (az: Az, t: number) =>
    az === 'a' && !!config.azOutage && t >= config.azOutage.start && t < config.azOutage.end;

  let nextId = 1;
  const instances: Instance[] = [];
  for (let i = 0; i < config.desired; i++) {
    instances.push({ id: nextId++, az: azs[i % azs.length], readyAt: 0, hardcoded: true, alive: true });
  }

  let desired = config.desired;
  const steps: StepResult[] = [];

  for (let t = 0; t < demand.length; t++) {
    const d = Math.max(0, demand[t]);
    const alive = instances.filter((i) => i.alive);
    const stateOf = (i: Instance): InstanceState =>
      azDown(i.az, t) ? 'unhealthy' : i.readyAt <= t ? 'serving' : 'starting';
    const serving = alive.filter((i) => stateOf(i) === 'serving');
    const targets = config.loadBalancer ? serving : serving.filter((i) => i.hardcoded);
    const served = Math.min(d, targets.length * cap);
    const perTarget = targets.length ? d / targets.length : 0;

    steps.push({
      t,
      demand: d,
      desired,
      running: alive.length,
      serving: serving.length,
      served,
      failed: d - served,
      instances: alive.map((i) => ({
        id: i.id,
        az: i.az,
        state: stateOf(i),
        load: targets.includes(i) ? perTarget : 0,
        hardcoded: i.hardcoded,
      })),
    });

    if (config.mode === 'fixed') continue;

    // Decide the desired capacity for the coming steps.
    let target = d;
    if (config.mode === 'predictive') {
      const ahead = demand.slice(t + 1, t + 1 + config.launchLag);
      if (ahead.length) target = Math.max(...ahead);
    }
    desired = clamp(instancesFor(target, cap), config.min, config.max);

    // Health check: replace instances in a failed Availability Zone.
    for (const i of alive) if (azDown(i.az, t)) i.alive = false;
    const healthy = instances.filter((i) => i.alive);

    if (healthy.length < desired) {
      const usable = azs.filter((az) => !azDown(az, t));
      for (let n = healthy.length; n < desired && usable.length; n++) {
        const count = (az: Az) => instances.filter((i) => i.alive && i.az === az).length;
        const az = usable.reduce((best, x) => (count(x) < count(best) ? x : best));
        instances.push({ id: nextId++, az, readyAt: t + config.launchLag, hardcoded: false, alive: true });
      }
    } else if (healthy.length > desired) {
      // Scale in: terminate the newest instances first.
      const newestFirst = [...healthy].sort((x, y) => y.id - x.id);
      for (const i of newestFirst.slice(0, healthy.length - desired)) i.alive = false;
    }
  }

  const sum = (f: (s: StepResult) => number) => steps.reduce((n, s) => n + f(s), 0);
  return {
    steps,
    totals: {
      demand: sum((s) => s.demand),
      served: sum((s) => s.served),
      failed: sum((s) => s.failed),
      instanceHours: sum((s) => s.running),
      peakInstances: steps.reduce((n, s) => Math.max(n, s.running), 0),
    },
  };
}

export interface TrafficPreset {
  id: 'steady' | 'daily' | 'spike';
  label: string;
  description: string;
  demand: number[];
}

export const TRAFFIC_PRESETS: TrafficPreset[] = [
  {
    id: 'steady',
    label: 'Steady',
    description: 'The same load all day.',
    demand: Array.from({ length: STEPS }, () => 250),
  },
  {
    id: 'daily',
    label: 'Daily peak',
    description: 'Quiet at night, busy at midday.',
    demand: [80, 60, 50, 50, 60, 100, 180, 280, 380, 450, 500, 520, 540, 520, 500, 470, 430, 380, 320, 260, 200, 160, 120, 100],
  },
  {
    id: 'spike',
    label: 'Friday 10x spike',
    description: 'A ticket sale opens at 18:00 and traffic jumps tenfold for three hours.',
    demand: Array.from({ length: STEPS }, (_, t) => (t >= 18 && t <= 20 ? 1000 : 100)),
  },
];

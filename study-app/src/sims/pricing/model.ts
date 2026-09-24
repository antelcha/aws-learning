export const PRICE_LABEL =
  'Illustrative example values, not AWS quotes (course maximum discounts, 2026-09-24).';
export const HOURS_PER_YEAR = 8760;
/** Illustrative On-Demand price per instance-hour in USD. Not a real AWS price. */
export const EXAMPLE_ON_DEMAND_HOURLY = 0.1;
/** Maximum discounts off On-Demand as presented in the course. */
export const DISCOUNTS = { savingsPlans: 0.72, reserved: 0.75, spot: 0.9 } as const;

export interface UsageSegment {
  instances: number;
  hours: number;
}

export interface UsagePattern {
  id: 'steady' | 'business-hours' | 'spiky' | 'batch' | 'unknown';
  label: string;
  description: string;
  /** Segments of the year; hours sum to HOURS_PER_YEAR. */
  profile: UsageSegment[];
  /** The workload can be stopped and resumed without harm. */
  interruptible: boolean;
  /** Usage is known well enough to commit for 1 or 3 years. */
  predictable: boolean;
}

export const USAGE_PATTERNS: UsagePattern[] = [
  {
    id: 'steady',
    label: 'Steady 24/7',
    description: 'Two instances run all year, for example a production web app with stable traffic.',
    profile: [{ instances: 2, hours: HOURS_PER_YEAR }],
    interruptible: false,
    predictable: true,
  },
  {
    id: 'business-hours',
    label: 'Business hours',
    description: 'Two instances run 10 hours a day on weekdays (2,600 h) and are stopped otherwise.',
    profile: [
      { instances: 2, hours: 2600 },
      { instances: 0, hours: HOURS_PER_YEAR - 2600 },
    ],
    interruptible: false,
    predictable: true,
  },
  {
    id: 'spiky',
    label: 'Steady base with spikes',
    description: 'One instance runs all year; four run during 760 hours of peak traffic.',
    profile: [
      { instances: 1, hours: HOURS_PER_YEAR - 760 },
      { instances: 4, hours: 760 },
    ],
    interruptible: false,
    predictable: true,
  },
  {
    id: 'batch',
    label: 'Interruptible batch',
    description: 'Four instances process jobs for 2,000 hours a year; a job can stop and resume later.',
    profile: [
      { instances: 4, hours: 2000 },
      { instances: 0, hours: HOURS_PER_YEAR - 2000 },
    ],
    interruptible: true,
    predictable: false,
  },
  {
    id: 'unknown',
    label: 'New app, unknown usage',
    description: 'A new app whose traffic is not known yet; this guess shows one to three instances.',
    profile: [
      { instances: 1, hours: HOURS_PER_YEAR / 2 },
      { instances: 3, hours: HOURS_PER_YEAR / 2 },
    ],
    interruptible: false,
    predictable: false,
  },
];

export type PricingOptionId = 'on-demand' | 'savings-plans' | 'reserved' | 'spot' | 'dedicated';

export interface OptionResult {
  label: string;
  /** Yearly cost in USD, or null when no example price is captured. */
  cost: number | null;
  wastedCommittedHours: number;
  suitable: boolean;
  caveats: string[];
}

export type PricingResults = Record<PricingOptionId, OptionResult>;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function patternById(id: UsagePattern['id']): UsagePattern {
  const p = USAGE_PATTERNS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown usage pattern: ${id}`);
  return p;
}

function commitment(
  label: string,
  discount: number,
  pattern: UsagePattern,
  committed: number,
  rate: number,
  note: string,
): OptionResult {
  let uncovered = 0;
  let wasted = 0;
  for (const s of pattern.profile) {
    uncovered += Math.max(0, s.instances - committed) * s.hours;
    wasted += Math.max(0, committed - s.instances) * s.hours;
  }
  const cost = committed * HOURS_PER_YEAR * rate * (1 - discount) + uncovered * rate;
  const caveats = [note];
  if (committed === 0) caveats.push('No commitment chosen, so every hour is billed at the On-Demand rate.');
  if (!pattern.predictable) caveats.push('Usage is not predictable enough to commit for 1 or 3 years.');
  if (wasted > 0) caveats.push(`${wasted.toLocaleString('en-US')} committed instance-hours go unused but are still paid for.`);
  if (uncovered > 0 && committed > 0) {
    caveats.push(`${uncovered.toLocaleString('en-US')} instance-hours above the commitment are billed On-Demand.`);
  }
  return {
    label,
    cost: round2(cost),
    wastedCommittedHours: wasted,
    suitable: pattern.predictable && committed > 0,
    caveats,
  };
}

/**
 * Yearly cost of a usage pattern under each purchase option.
 * `committedInstances` is the number of instances covered by a 1- or 3-year commitment.
 */
export function yearlyCosts(
  pattern: UsagePattern,
  committedInstances: number,
  rate: number = EXAMPLE_ON_DEMAND_HOURLY,
): PricingResults {
  const usedHours = pattern.profile.reduce((n, s) => n + s.instances * s.hours, 0);
  return {
    'on-demand': {
      label: 'On-Demand',
      cost: round2(usedHours * rate),
      wastedCommittedHours: 0,
      suitable: true,
      caveats: ['Pay per use with no commitment; the most flexible and, for steady use, the most expensive option.'],
    },
    'savings-plans': commitment(
      'Savings Plans',
      DISCOUNTS.savingsPlans,
      pattern,
      committedInstances,
      rate,
      'Commit to a consistent amount of usage for 1 or 3 years; modeled here as instance-hours.',
    ),
    reserved: commitment(
      'Reserved Instances',
      DISCOUNTS.reserved,
      pattern,
      committedInstances,
      rate,
      'Commit to specific instance usage for 1 or 3 years.',
    ),
    spot: {
      label: 'Spot Instances',
      cost: round2(usedHours * rate * (1 - DISCOUNTS.spot)),
      wastedCommittedHours: 0,
      suitable: pattern.interruptible,
      caveats: [
        pattern.interruptible
          ? 'Uses spare AWS capacity that AWS can reclaim; this workload can resume after an interruption.'
          : 'AWS can reclaim Spot capacity, and this workload cannot tolerate interruption.',
      ],
    },
    dedicated: {
      label: 'Dedicated Hosts / Instances',
      cost: null,
      wastedCommittedHours: 0,
      suitable: false,
      caveats: [
        'No example price captured. Choose when licensing or compliance requires hardware not shared with other customers.',
      ],
    },
  };
}

export function cheapestSuitable(results: PricingResults): PricingOptionId {
  let best: PricingOptionId = 'on-demand';
  for (const [id, r] of Object.entries(results) as [PricingOptionId, OptionResult][]) {
    if (r.suitable && r.cost !== null && r.cost < (results[best].cost ?? Infinity)) best = id;
  }
  return best;
}

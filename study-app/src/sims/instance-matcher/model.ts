export type Family = 'general' | 'compute' | 'memory' | 'accelerated' | 'storage';

export const FAMILY_LABELS: Record<Family, string> = {
  general: 'General purpose',
  compute: 'Compute optimized',
  memory: 'Memory optimized',
  accelerated: 'Accelerated computing',
  storage: 'Storage optimized',
};

export interface Workload {
  id: string;
  text: string;
  family: Family;
  why: string;
}

export const WORKLOADS: Workload[] = [
  {
    id: 'new-web-app',
    text: 'A new web app whose performance needs are not known yet',
    family: 'general',
    why: 'A balance of compute, memory, and networking is a good starting point when needs are unknown.',
  },
  {
    id: 'game-server',
    text: 'A multiplayer game server with CPU near 95% and memory near 30%',
    family: 'compute',
    why: 'The bottleneck is CPU; compute optimized gives more CPU per dollar without paying for idle memory.',
  },
  {
    id: 'in-memory-analytics',
    text: 'Real-time analytics that loads a 400 GB dataset into memory',
    family: 'memory',
    why: 'Processing large datasets in memory points to memory optimized.',
  },
  {
    id: 'graphics',
    text: 'Graphics rendering with heavy floating-point calculations',
    family: 'accelerated',
    why: 'Hardware accelerators (co-processors) handle floating-point and graphics work more efficiently than CPUs.',
  },
  {
    id: 'local-history',
    text: 'Analysis of historical data stored on the instance that needs consistent, high disk throughput',
    family: 'storage',
    why: 'High-throughput access to locally stored data points to storage optimized.',
  },
  {
    id: 'scientific-model',
    text: 'Scientific modeling that is limited by processor speed',
    family: 'compute',
    why: 'Compute-intensive tasks such as scientific modeling suit compute optimized.',
  },
];

export interface MatchResult {
  id: string;
  correct: boolean;
  expected: Family;
  picked: Family | undefined;
}

export function gradeMatches(
  workloads: Workload[],
  picks: Partial<Record<string, Family>>,
): { correct: number; total: number; results: MatchResult[] } {
  const results = workloads.map((w) => ({
    id: w.id,
    correct: picks[w.id] === w.family,
    expected: w.family,
    picked: picks[w.id],
  }));
  return { correct: results.filter((r) => r.correct).length, total: workloads.length, results };
}

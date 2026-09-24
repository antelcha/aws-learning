import type { Question } from './types';

export const INTERVAL_DAYS = [1, 3, 7] as const;
const DAY_MS = 86_400_000;

export type WeakSpot = { step: 0 | 1 | 2; due: string };
/** Keyed by concept tag. */
export type WeakSpots = Record<string, WeakSpot>;

function schedule(step: 0 | 1 | 2, now: Date): WeakSpot {
  return { step, due: new Date(now.getTime() + INTERVAL_DAYS[step] * DAY_MS).toISOString() };
}

export function recordMiss(spots: WeakSpots, concepts: string[], now: Date): WeakSpots {
  const next = { ...spots };
  for (const concept of concepts) next[concept] = schedule(0, now);
  return next;
}

export function recordWeakSpotResult(spots: WeakSpots, concept: string, correct: boolean, now: Date): WeakSpots {
  const current = spots[concept];
  if (!current) return spots;
  const next = { ...spots };
  if (!correct) {
    next[concept] = schedule(0, now);
  } else if (current.step === 2) {
    delete next[concept];
  } else {
    next[concept] = schedule((current.step + 1) as 1 | 2, now);
  }
  return next;
}

export function dueConcepts(spots: WeakSpots, now: Date): string[] {
  return Object.keys(spots)
    .filter((concept) => new Date(spots[concept].due).getTime() <= now.getTime())
    .sort();
}

export function pickWeakSpotQuestions(
  spots: WeakSpots,
  questions: Question[],
  now: Date,
): { concept: string; question: Question }[] {
  const picks: { concept: string; question: Question }[] = [];
  for (const concept of dueConcepts(spots, now)) {
    const candidates = questions.filter((q) => q.concepts.includes(concept));
    if (candidates.length === 0) continue;
    picks.push({ concept, question: candidates[spots[concept].step % candidates.length] });
  }
  return picks;
}

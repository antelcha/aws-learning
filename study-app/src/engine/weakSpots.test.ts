import { describe, expect, it } from 'vitest';
import {
  dueConcepts,
  pickWeakSpotQuestions,
  recordMiss,
  recordWeakSpotResult,
  type WeakSpots,
} from './weakSpots';
import type { Question } from './types';

const DAY = 86_400_000;
const now = new Date('2026-09-24T12:00:00.000Z');
const plus = (days: number) => new Date(now.getTime() + days * DAY).toISOString();

function q(id: string, concepts: string[]): Question {
  return {
    id,
    type: 'single',
    prompt: id,
    options: [{ id: 'a', text: 'A' }],
    answer: ['a'],
    hint: 'h',
    explanation: 'e',
    concepts,
  };
}

describe('recordMiss', () => {
  it('schedules each missed concept at step 0, due in 1 day', () => {
    const spots = recordMiss({}, ['pricing', 'regions'], now);
    expect(spots).toEqual({
      pricing: { step: 0, due: plus(1) },
      regions: { step: 0, due: plus(1) },
    });
  });
  it('resets a tracked concept to step 0', () => {
    const spots: WeakSpots = { pricing: { step: 2, due: plus(7) } };
    expect(recordMiss(spots, ['pricing'], now).pricing).toEqual({ step: 0, due: plus(1) });
  });
});

describe('recordWeakSpotResult', () => {
  it('advances step 0 to step 1, due in 3 days', () => {
    const spots: WeakSpots = { pricing: { step: 0, due: now.toISOString() } };
    expect(recordWeakSpotResult(spots, 'pricing', true, now).pricing).toEqual({ step: 1, due: plus(3) });
  });
  it('advances step 1 to step 2, due in 7 days', () => {
    const spots: WeakSpots = { pricing: { step: 1, due: now.toISOString() } };
    expect(recordWeakSpotResult(spots, 'pricing', true, now).pricing).toEqual({ step: 2, due: plus(7) });
  });
  it('clears the concept after passing step 2', () => {
    const spots: WeakSpots = { pricing: { step: 2, due: now.toISOString() } };
    expect(recordWeakSpotResult(spots, 'pricing', true, now)).toEqual({});
  });
  it('restarts at step 0 on a wrong answer at any step', () => {
    for (const step of [0, 1, 2] as const) {
      const spots: WeakSpots = { pricing: { step, due: now.toISOString() } };
      expect(recordWeakSpotResult(spots, 'pricing', false, now).pricing).toEqual({ step: 0, due: plus(1) });
    }
  });
  it('ignores answers for a concept that is not due, so a retry cannot advance it again', () => {
    const spots: WeakSpots = { pricing: { step: 0, due: now.toISOString() } };
    const once = recordWeakSpotResult(spots, 'pricing', true, now);
    expect(recordWeakSpotResult(once, 'pricing', true, now)).toBe(once);
    expect(recordWeakSpotResult(once, 'pricing', false, now)).toBe(once);
  });
  it('does not mutate its input', () => {
    const spots: WeakSpots = { pricing: { step: 0, due: now.toISOString() } };
    recordWeakSpotResult(spots, 'pricing', true, now);
    expect(spots.pricing.step).toBe(0);
  });
});

describe('due concepts and question picking', () => {
  const spots: WeakSpots = {
    pricing: { step: 0, due: plus(-1) },
    regions: { step: 1, due: now.toISOString() },
    later: { step: 0, due: plus(2) },
  };
  it('excludes concepts that are not yet due', () => {
    expect(dueConcepts(spots, now)).toEqual(['pricing', 'regions']);
  });
  it('picks one question per due concept, rotating with the step', () => {
    const questions = [q('p1', ['pricing']), q('r1', ['regions']), q('r2', ['regions']), q('l1', ['later'])];
    expect(pickWeakSpotQuestions(spots, questions, now)).toEqual([
      { concept: 'pricing', question: questions[0] },
      { concept: 'regions', question: questions[2] },
    ]);
    const advanced: WeakSpots = { ...spots, regions: { step: 2, due: now.toISOString() } };
    expect(pickWeakSpotQuestions(advanced, questions, now)[1].question.id).toBe('r1');
  });
  it('skips due concepts with no questions', () => {
    expect(pickWeakSpotQuestions(spots, [q('p1', ['pricing'])], now)).toHaveLength(1);
  });
});

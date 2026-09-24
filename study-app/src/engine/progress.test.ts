import { describe, expect, it } from 'vitest';
import { earnedBadges, emptyProgress, isModuleComplete, recordChallengeResult } from './progress';
import type { Module, Question } from './types';

const now = new Date('2026-09-24T12:00:00.000Z');

function q(id: string, concepts: string[] = ['pricing']): Question {
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

function mod(locked = false): Module {
  return {
    id: 'module-x',
    number: 9,
    title: 'X',
    lessons: [
      { id: 'l1', module: 'module-x', order: 1, title: 'L1', note: 'n', keyIdea: [], questions: [q('q1'), q('q2')] },
    ],
    locked: locked ? [{ order: 2, title: 'L2', reason: 'Not watched yet' }] : [],
    boss: { id: 'boss-x', module: 'module-x', title: 'B', scenario: 's', steps: [q('b1')] },
  };
}

describe('recordChallengeResult', () => {
  it('awards XP by stage once per question', () => {
    let p = recordChallengeResult(emptyProgress(), q('q1'), 'hinted', true, now);
    expect(p.xp).toBe(5);
    expect(p.questions.q1).toEqual({ cleared: true, xp: 5, misses: 0 });
    p = recordChallengeResult(p, q('q1'), 'fresh', true, now);
    expect(p.xp).toBe(5);
  });
  it('logs a mistake and schedules weak spots on the first wrong answer', () => {
    const p = recordChallengeResult(emptyProgress(), q('q1', ['pricing', 'regions']), 'fresh', false, now);
    expect(p.mistakes).toEqual([{ questionId: 'q1', concepts: ['pricing', 'regions'], at: now.toISOString() }]);
    expect(Object.keys(p.weakSpots)).toEqual(['pricing', 'regions']);
    expect(p.questions.q1).toEqual({ cleared: false, xp: 0, misses: 1 });
  });
  it('counts later wrong answers in the same attempt without logging again', () => {
    let p = recordChallengeResult(emptyProgress(), q('q1'), 'fresh', false, now);
    p = recordChallengeResult(p, q('q1'), 'hinted', false, now);
    expect(p.mistakes).toHaveLength(1);
    expect(p.questions.q1.misses).toBe(2);
  });
  it('does not mutate the previous progress', () => {
    const before = emptyProgress();
    recordChallengeResult(before, q('q1'), 'fresh', true, now);
    expect(before).toEqual(emptyProgress());
  });
});

describe('module completion and badges', () => {
  function clearAll(p = emptyProgress()) {
    for (const id of ['q1', 'q2', 'b1']) p = recordChallengeResult(p, q(id), 'fresh', true, now);
    return p;
  }
  it('is incomplete until every lesson question and boss step is cleared', () => {
    let p = recordChallengeResult(emptyProgress(), q('q1'), 'fresh', true, now);
    p = recordChallengeResult(p, q('q2'), 'fresh', true, now);
    expect(isModuleComplete(mod(), p)).toBe(false);
    expect(isModuleComplete(mod(), clearAll())).toBe(true);
  });
  it('never completes a module that has locked lessons', () => {
    expect(isModuleComplete(mod(true), clearAll())).toBe(false);
  });
  it('earns a badge for each complete module', () => {
    expect(earnedBadges([mod(), { ...mod(true), id: 'module-y' }], clearAll())).toEqual(['module-x']);
  });
});

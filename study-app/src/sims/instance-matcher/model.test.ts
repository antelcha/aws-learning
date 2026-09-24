import { describe, expect, it } from 'vitest';
import { WORKLOADS, gradeMatches } from './model';

describe('gradeMatches', () => {
  it('grades each pick against the expected family', () => {
    const [first, second] = WORKLOADS;
    const g = gradeMatches([first, second], { [first.id]: first.family, [second.id]: 'storage' });
    expect(g.correct).toBe(second.family === 'storage' ? 2 : 1);
    expect(g.total).toBe(2);
    expect(g.results[0]).toEqual({ id: first.id, correct: true, expected: first.family, picked: first.family });
  });
  it('treats a missing pick as wrong', () => {
    const g = gradeMatches(WORKLOADS, {});
    expect(g.correct).toBe(0);
    expect(g.results.every((r) => r.picked === undefined)).toBe(true);
  });
  it('covers every instance family at least once', () => {
    expect(new Set(WORKLOADS.map((w) => w.family)).size).toBe(5);
  });
});

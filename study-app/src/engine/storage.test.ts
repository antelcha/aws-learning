import { describe, expect, it } from 'vitest';
import { emptyProgress, recordChallengeResult } from './progress';
import { PROGRESS_KEY, exportProgress, importProgress, loadProgress, saveProgress, type StorageLike } from './storage';

const now = new Date('2026-09-24T12:00:00.000Z');

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = v;
    },
  };
}

const sample = recordChallengeResult(
  emptyProgress(),
  {
    id: 'q1',
    type: 'single',
    prompt: 'p',
    options: [{ id: 'a', text: 'A' }],
    answer: ['a'],
    hint: 'h',
    explanation: 'e',
    concepts: ['pricing'],
  },
  'fresh',
  false,
  now,
);

describe('loadProgress', () => {
  it('returns empty progress when nothing is stored', () => {
    expect(loadProgress(memoryStorage(), now)).toEqual({ progress: emptyProgress() });
  });
  it('loads saved progress', () => {
    const storage = memoryStorage();
    saveProgress(storage, sample);
    expect(loadProgress(storage, now)).toEqual({ progress: sample });
  });
  it('backs up corrupted JSON, resets, and returns a notice', () => {
    const storage = memoryStorage({ [PROGRESS_KEY]: '{not json' });
    const result = loadProgress(storage, now);
    expect(result.progress).toEqual(emptyProgress());
    expect(result.notice).toMatch(/backup/i);
    const backupKeys = Object.keys(storage.data).filter((k) => k.includes('backup'));
    expect(backupKeys).toHaveLength(1);
    expect(storage.data[backupKeys[0]]).toBe('{not json');
    expect(JSON.parse(storage.data[PROGRESS_KEY])).toEqual(emptyProgress());
  });
  it('treats valid JSON with the wrong shape as corrupted', () => {
    const storage = memoryStorage({ [PROGRESS_KEY]: '{"version":2}' });
    expect(loadProgress(storage, now).notice).toBeDefined();
  });
});

describe('export and import', () => {
  it('round-trips valid progress', () => {
    expect(importProgress(exportProgress(sample))).toEqual(sample);
  });
  it('rejects invalid JSON and wrong shapes', () => {
    expect(() => importProgress('nope')).toThrow();
    expect(() => importProgress('[]')).toThrow();
    expect(() => importProgress(JSON.stringify({ ...sample, xp: '10' }))).toThrow();
    expect(() => importProgress(JSON.stringify({ ...sample, weakSpots: { pricing: { step: 5, due: 'x' } } }))).toThrow();
    expect(() => importProgress(JSON.stringify({ ...sample, mistakes: [{ questionId: 1 }] }))).toThrow();
  });
});

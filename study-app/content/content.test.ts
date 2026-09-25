import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { emptyProgress, isModuleComplete, moduleQuestions } from '../src/engine/progress';
import { validateContent } from '../src/engine/validateContent';
import { concepts } from './concepts';
import { modules } from './index';

describe('shipped content', () => {
  it('passes validation', () => {
    const appRoot = resolve(__dirname, '..');
    const errors = validateContent(modules, {
      knownConcepts: [...concepts],
      noteExists: (p) => existsSync(resolve(appRoot, p)),
    });
    expect(errors).toEqual([]);
  });

  it('lets every module with no locked lessons award its badge once all questions are cleared', () => {
    for (const m of modules.filter((x) => x.locked.length === 0)) {
      const progress = emptyProgress();
      for (const q of moduleQuestions(m)) progress.questions[q.id] = { cleared: true, xp: 10, misses: 0 };
      expect(isModuleComplete(m, progress)).toBe(true);
    }
  });

  it('has Module 2 fully unlocked', () => {
    const m2 = modules.find((m) => m.id === 'module-02')!;
    expect(m2.locked).toEqual([]);
    expect(m2.lessons.map((l) => l.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

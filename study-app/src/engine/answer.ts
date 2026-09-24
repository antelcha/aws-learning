import type { Question } from './types';

/** fresh: no wrong answer yet; hinted: hint shown; revealed: explanation shown. */
export type Stage = 'fresh' | 'hinted' | 'revealed';

export function checkAnswer(q: Question, selected: string[]): boolean {
  const picked = new Set(selected);
  if (picked.size !== q.answer.length) return false;
  return q.answer.every((id) => picked.has(id));
}

export function nextStage(stage: Stage, correct: boolean): Stage {
  if (correct) return stage;
  return stage === 'fresh' ? 'hinted' : 'revealed';
}

export function xpFor(stage: Stage): 10 | 5 | 0 {
  switch (stage) {
    case 'fresh':
      return 10;
    case 'hinted':
      return 5;
    case 'revealed':
      return 0;
  }
}

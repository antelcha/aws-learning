import { xpFor, type Stage } from './answer';
import type { Module, Question } from './types';
import { recordMiss, type WeakSpots } from './weakSpots';

export interface QuestionProgress {
  cleared: boolean;
  xp: number;
  misses: number;
}

export interface Mistake {
  questionId: string;
  concepts: string[];
  at: string;
}

export interface Progress {
  version: 1;
  xp: number;
  questions: Record<string, QuestionProgress>;
  weakSpots: WeakSpots;
  mistakes: Mistake[];
}

export function emptyProgress(): Progress {
  return { version: 1, xp: 0, questions: {}, weakSpots: {}, mistakes: [] };
}

/**
 * Records one answer to a lesson or boss question. `stage` is the stage the
 * question was in when the answer was given.
 */
export function recordChallengeResult(
  progress: Progress,
  question: Question,
  stage: Stage,
  correct: boolean,
  now: Date,
): Progress {
  const entry = progress.questions[question.id] ?? { cleared: false, xp: 0, misses: 0 };
  if (correct) {
    if (entry.cleared) return progress;
    const xp = xpFor(stage);
    return {
      ...progress,
      xp: progress.xp + xp,
      questions: { ...progress.questions, [question.id]: { ...entry, cleared: true, xp } },
    };
  }
  const next: Progress = {
    ...progress,
    questions: { ...progress.questions, [question.id]: { ...entry, misses: entry.misses + 1 } },
  };
  if (stage === 'fresh') {
    next.mistakes = [...progress.mistakes, { questionId: question.id, concepts: question.concepts, at: now.toISOString() }];
    next.weakSpots = recordMiss(progress.weakSpots, question.concepts, now);
  }
  return next;
}

export function moduleQuestions(module: Module): Question[] {
  return [...module.lessons.flatMap((l) => l.questions), ...module.boss.steps];
}

export function isModuleComplete(module: Module, progress: Progress): boolean {
  if (module.locked.length > 0) return false;
  return moduleQuestions(module).every((q) => progress.questions[q.id]?.cleared);
}

export function earnedBadges(modules: Module[], progress: Progress): string[] {
  return modules.filter((m) => isModuleComplete(m, progress)).map((m) => m.id);
}

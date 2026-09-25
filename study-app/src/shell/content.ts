import { modules } from '../../content/index';
import type { Lesson, Module, Question } from '../engine/types';

export { modules };

export const REPO_URL = 'https://github.com/antelcha/aws-learning';

export function noteUrl(lesson: Lesson): string {
  return `${REPO_URL}/blob/main/${lesson.note.replace(/^(\.\.\/)+/, '')}`;
}

export function findModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function findLesson(id: string): { module: Module; lesson: Lesson } | undefined {
  for (const module of modules) {
    const lesson = module.lessons.find((l) => l.id === id);
    if (lesson) return { module, lesson };
  }
  return undefined;
}

export const allQuestions: Question[] = modules.flatMap((m) => [
  ...m.lessons.flatMap((l) => l.questions),
  ...m.boss.steps,
]);

/** Where a question lives, for linking from the mistake log. */
export function questionHome(questionId: string): { label: string; hash: string } | undefined {
  for (const m of modules) {
    for (const l of m.lessons) {
      if (l.questions.some((q) => q.id === questionId)) return { label: l.title, hash: `#/lesson/${l.id}` };
    }
    if (m.boss.steps.some((q) => q.id === questionId)) return { label: `Boss: ${m.boss.title}`, hash: `#/boss/${m.id}` };
  }
  return undefined;
}

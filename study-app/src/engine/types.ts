export type QuestionType = 'single' | 'multi';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options: Option[];
  answer: string[];
  hint: string;
  explanation: string;
  concepts: string[];
  /** Content that goes beyond the course; labeled in the UI. */
  beyondCourse?: boolean;
}

export type SimId = 'pricing' | 'global-infra' | 'shared-responsibility' | 'instance-matcher';

export interface SimRef {
  id: SimId;
  config?: Record<string, unknown>;
}

export interface Lesson {
  id: string;
  module: string;
  order: number;
  title: string;
  /** Path relative to study-app/, e.g. ../AWS-Cloud-Practitioner/... */
  note: string;
  /** 3–5 lines of refresher text. */
  keyIdea: string[];
  sim?: SimRef;
  questions: Question[];
}

export interface LockedLesson {
  order: number;
  title: string;
  reason: string;
}

export interface BossRound {
  id: string;
  module: string;
  title: string;
  scenario: string;
  steps: Question[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  lessons: Lesson[];
  locked: LockedLesson[];
  boss: BossRound;
}

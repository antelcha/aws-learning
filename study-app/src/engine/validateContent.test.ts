import { describe, expect, it } from 'vitest';
import { validateContent } from './validateContent';
import type { Lesson, Module, Question } from './types';

function q(id: string, over: Partial<Question> = {}): Question {
  return {
    id,
    type: 'single',
    prompt: 'p',
    options: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
    ],
    answer: ['a'],
    hint: 'h',
    explanation: 'e',
    concepts: ['pricing'],
    ...over,
  };
}

function lesson(id: string, questions: Question[], over: Partial<Lesson> = {}): Lesson {
  return {
    id,
    module: 'm1',
    order: 1,
    title: id,
    note: 'note.md',
    keyIdea: ['one', 'two', 'three'],
    questions,
    ...over,
  };
}

function mod(lessons: Lesson[], bossSteps: Question[] = [q('b1')]): Module[] {
  return [{ id: 'm1', number: 1, title: 'M', lessons, locked: [], boss: { id: 'boss', module: 'm1', title: 'B', scenario: 's', steps: bossSteps } }];
}

const opts = { knownConcepts: ['pricing'], noteExists: (p: string) => p === 'note.md' };
const validate = (modules: Module[]) => validateContent(modules, opts);

describe('validateContent', () => {
  it('accepts valid content', () => {
    expect(validate(mod([lesson('l1', [q('q1'), q('q2')])]))).toEqual([]);
  });
  it('reports an empty hint', () => {
    expect(validate(mod([lesson('l1', [q('q1', { hint: ' ' }), q('q2')])]))).toEqual([expect.stringMatching(/q1.*hint/)]);
  });
  it('reports an empty explanation', () => {
    expect(validate(mod([lesson('l1', [q('q1'), q('q2', { explanation: '' })])]))).toEqual([
      expect.stringMatching(/q2.*explanation/),
    ]);
  });
  it('reports duplicate IDs across lessons, questions, and boss steps', () => {
    expect(validate(mod([lesson('l1', [q('q1'), q('q1')])]))).toEqual([expect.stringMatching(/duplicate.*q1/i)]);
    expect(validate(mod([lesson('l1', [q('q1'), q('l1')])]))).toEqual([expect.stringMatching(/duplicate.*l1/i)]);
    expect(validate(mod([lesson('l1', [q('q1'), q('q2')])], [q('q2')]))).toEqual([expect.stringMatching(/duplicate.*q2/i)]);
  });
  it('reports an unknown concept', () => {
    expect(validate(mod([lesson('l1', [q('q1', { concepts: ['nope'] }), q('q2')])]))).toEqual([
      expect.stringMatching(/unknown concept.*nope/i),
    ]);
  });
  it('reports a missing note', () => {
    expect(validate(mod([lesson('l1', [q('q1'), q('q2')], { note: 'missing.md' })]))).toEqual([
      expect.stringMatching(/note.*missing\.md/i),
    ]);
  });
  it('reports an answer that is not among the options', () => {
    expect(validate(mod([lesson('l1', [q('q1', { answer: ['z'] }), q('q2')])]))).toEqual([
      expect.stringMatching(/q1.*answer.*z/),
    ]);
  });
  it('reports a single question without exactly one answer', () => {
    expect(validate(mod([lesson('l1', [q('q1', { answer: ['a', 'b'] }), q('q2')])]))).toEqual([
      expect.stringMatching(/q1.*exactly one/),
    ]);
  });
  it('reports lessons with fewer than 2 or more than 3 questions', () => {
    expect(validate(mod([lesson('l1', [q('q1')])]))).toEqual([expect.stringMatching(/l1.*2.*3/)]);
    expect(validate(mod([lesson('l1', [q('q1'), q('q2'), q('q3'), q('q4')])]))).toEqual([
      expect.stringMatching(/l1.*2.*3/),
    ]);
  });
  it('reports a key idea outside 3–5 lines', () => {
    expect(validate(mod([lesson('l1', [q('q1'), q('q2')], { keyIdea: ['only one'] })]))).toEqual([
      expect.stringMatching(/l1.*key idea/i),
    ]);
  });
});

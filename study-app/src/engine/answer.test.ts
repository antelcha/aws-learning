import { describe, expect, it } from 'vitest';
import { checkAnswer, nextStage, xpFor } from './answer';
import type { Question } from './types';

const base: Omit<Question, 'type' | 'answer'> = {
  id: 'q',
  prompt: 'p',
  options: [
    { id: 'a', text: 'A' },
    { id: 'b', text: 'B' },
    { id: 'c', text: 'C' },
  ],
  hint: 'h',
  explanation: 'e',
  concepts: [],
};
const single: Question = { ...base, type: 'single', answer: ['b'] };
const multi: Question = { ...base, type: 'multi', answer: ['a', 'c'] };

describe('checkAnswer', () => {
  it('accepts the single correct option', () => {
    expect(checkAnswer(single, ['b'])).toBe(true);
    expect(checkAnswer(single, ['a'])).toBe(false);
  });
  it('compares multi answers as sets, ignoring order', () => {
    expect(checkAnswer(multi, ['c', 'a'])).toBe(true);
  });
  it('rejects a partial multi selection', () => {
    expect(checkAnswer(multi, ['a'])).toBe(false);
  });
  it('rejects an extra selection', () => {
    expect(checkAnswer(multi, ['a', 'b', 'c'])).toBe(false);
  });
  it('rejects an empty selection', () => {
    expect(checkAnswer(single, [])).toBe(false);
  });
});

describe('stages and XP', () => {
  it('awards 10, 5, and 0 XP by stage', () => {
    expect(xpFor('fresh')).toBe(10);
    expect(xpFor('hinted')).toBe(5);
    expect(xpFor('revealed')).toBe(0);
  });
  it('moves fresh to hinted to revealed on wrong answers', () => {
    expect(nextStage('fresh', false)).toBe('hinted');
    expect(nextStage('hinted', false)).toBe('revealed');
    expect(nextStage('revealed', false)).toBe('revealed');
  });
  it('never changes the stage on a correct answer', () => {
    expect(nextStage('fresh', true)).toBe('fresh');
    expect(nextStage('hinted', true)).toBe('hinted');
    expect(nextStage('revealed', true)).toBe('revealed');
  });
});

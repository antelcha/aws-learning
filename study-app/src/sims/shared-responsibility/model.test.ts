import { describe, expect, it } from 'vitest';
import { RESPONSIBILITY_ITEMS, scoreAssignments } from './model';

describe('scoreAssignments', () => {
  it('scores all-correct assignments', () => {
    const answers = Object.fromEntries(RESPONSIBILITY_ITEMS.map((i) => [i.id, i.owner.ec2]));
    const s = scoreAssignments(RESPONSIBILITY_ITEMS, 'ec2', answers);
    expect(s).toEqual({ correct: RESPONSIBILITY_ITEMS.length, total: RESPONSIBILITY_ITEMS.length, wrong: [], unanswered: [] });
  });
  it('guest OS patching moves from the customer on EC2 to AWS on S3', () => {
    const os = RESPONSIBILITY_ITEMS.find((i) => i.id === 'os-patching')!;
    expect(os.owner).toEqual({ ec2: 'customer', s3: 'aws' });
    expect(scoreAssignments([os], 's3', { 'os-patching': 'customer' }).wrong).toEqual(['os-patching']);
  });
  it('reports unanswered items separately', () => {
    const s = scoreAssignments(RESPONSIBILITY_ITEMS, 's3', {});
    expect(s.correct).toBe(0);
    expect(s.unanswered).toHaveLength(RESPONSIBILITY_ITEMS.length);
    expect(s.wrong).toEqual([]);
  });
  it('data and access stay with the customer on both services', () => {
    const data = RESPONSIBILITY_ITEMS.find((i) => i.id === 'data')!;
    expect(data.owner).toEqual({ ec2: 'customer', s3: 'customer' });
  });
});

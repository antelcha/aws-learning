import { describe, expect, it } from 'vitest';
import { SNS_SUBSCRIBERS, initialState, reduce, waiting, type Action, type MessagingState } from './model';

const run = (s: MessagingState, actions: Action[]) => actions.reduce(reduce, s);
const steps = (n: number): Action[] => Array.from({ length: n }, () => ({ type: 'step' }));
const conserved = (s: MessagingState) => s.sent === s.processed + s.lost + waiting(s);

describe('direct call (tightly coupled)', () => {
  it('processes everything while the consumer keeps up', () => {
    const s = run(initialState('direct'), steps(3));
    expect(s).toMatchObject({ sent: 6, accepted: 6, processed: 6, lost: 0 });
  });

  it('drops orders while the consumer is down, and they never come back', () => {
    const s = run(initialState('direct'), [...steps(1), { type: 'fail' }, ...steps(3), { type: 'recover' }, ...steps(1)]);
    expect(s.lost).toBe(6);
    expect(s.processed).toBe(4);
    expect(conserved(s)).toBe(true);
  });

  it('drops a burst beyond what the consumer can take', () => {
    const s = run(initialState('direct'), [{ type: 'send', count: 5 }]);
    expect(s.accepted).toBe(2);
    expect(s.lost).toBe(3);
    expect(s.log[0].kind).toBe('lost');
  });

  it('loses in-flight work when the consumer fails mid-task', () => {
    const s = run(initialState('direct'), [{ type: 'send', count: 2 }, { type: 'fail' }]);
    expect(s.lost).toBe(2);
    expect(s.inFlight).toHaveLength(0);
    expect(conserved(s)).toBe(true);
  });
});

describe('with an SQS queue (loosely coupled)', () => {
  it('accepts every order even while the consumer is down', () => {
    const s = run(initialState('queue'), [{ type: 'fail' }, ...steps(3)]);
    expect(s).toMatchObject({ sent: 6, accepted: 6, processed: 0, lost: 0 });
    expect(s.queue).toHaveLength(6);
  });

  it('drains the backlog after the consumer recovers, losing nothing', () => {
    const s = run(initialState('queue', { producerRate: 1 }), [
      { type: 'fail' },
      ...steps(4),
      { type: 'recover' },
      ...steps(4),
    ]);
    expect(s.lost).toBe(0);
    expect(s.processed).toBe(8);
    expect(s.queue).toHaveLength(0);
    expect(conserved(s)).toBe(true);
  });

  it('buffers a burst and processes it at the consumer rate, oldest first', () => {
    const s = run(initialState('queue', { producerRate: 0 }), [{ type: 'send', count: 5 }, ...steps(1)]);
    expect(s.processed).toBe(2);
    expect(s.queue.map((o) => o.id)).toEqual([3, 4, 5]);
  });
});

describe('payload and SNS', () => {
  it('each message carries a payload', () => {
    const s = run(initialState('queue'), [{ type: 'send', count: 1 }]);
    expect(s.lastPayload).toMatchObject({ id: 1, customer: expect.any(String), item: expect.any(String), placedAtStep: 0 });
  });

  it('fans out one notification per subscriber for each processed order', () => {
    const s = run(initialState('queue', { sns: true }), steps(2));
    expect(s.notifications).toBe(4 * SNS_SUBSCRIBERS.length);
    const off = run(initialState('queue'), steps(2));
    expect(off.notifications).toBe(0);
  });
});

describe('state changes', () => {
  it('fail and recover are idempotent', () => {
    const down = run(initialState('queue'), [{ type: 'fail' }]);
    expect(reduce(down, { type: 'fail' })).toBe(down);
    const up = initialState('queue');
    expect(reduce(up, { type: 'recover' })).toBe(up);
  });

  it('keeps only the latest log entries, newest first', () => {
    const s = run(initialState('queue'), [{ type: 'send', count: 20 }]);
    expect(s.log).toHaveLength(8);
    expect(s.log[0].text).toMatch(/^#20 /);
  });
});

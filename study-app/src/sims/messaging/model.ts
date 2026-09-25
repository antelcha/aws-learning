/**
 * Illustrative producer → consumer model, with a direct call (tightly coupled)
 * or an Amazon SQS queue in between (loosely coupled). Pure state transitions.
 */

export type Mode = 'direct' | 'queue';

/** The data a message carries: its payload. */
export interface Order {
  id: number;
  customer: string;
  item: string;
  placedAtStep: number;
}

export interface LogEntry {
  kind: 'ok' | 'queued' | 'lost' | 'info';
  text: string;
}

export interface MessagingState {
  mode: Mode;
  consumerUp: boolean;
  /** Orders the consumer can process per step. */
  consumerRate: number;
  /** Orders the producer sends per step. */
  producerRate: number;
  /** Publish an "order ready" message to an SNS topic after each processed order. */
  sns: boolean;
  step: number;
  nextId: number;
  queue: Order[];
  /** Direct mode only: orders the consumer accepted and is working on this step. */
  inFlight: Order[];
  sent: number;
  accepted: number;
  processed: number;
  lost: number;
  notifications: number;
  lastPayload?: Order;
  log: LogEntry[];
}

/** Subscribers of the SNS topic in this model. */
export const SNS_SUBSCRIBERS = ['Email', 'SMS', 'Mobile push'] as const;
const CUSTOMERS = ['Ada', 'Grace', 'Linus', 'Rudy', 'Mina', 'Omar'];
const ITEMS = ['latte', 'espresso', 'tea', 'mocha', 'cappuccino'];
const LOG_LIMIT = 8;

export type Action =
  | { type: 'send'; count: number }
  | { type: 'step' }
  | { type: 'fail' }
  | { type: 'recover' }
  | { type: 'set'; patch: Partial<Pick<MessagingState, 'consumerRate' | 'producerRate' | 'sns'>> };

export function initialState(mode: Mode, opts: Partial<Pick<MessagingState, 'consumerRate' | 'producerRate' | 'sns'>> = {}): MessagingState {
  return {
    mode,
    consumerUp: true,
    consumerRate: 2,
    producerRate: 2,
    sns: false,
    ...opts,
    step: 0,
    nextId: 1,
    queue: [],
    inFlight: [],
    sent: 0,
    accepted: 0,
    processed: 0,
    lost: 0,
    notifications: 0,
    log: [],
  };
}

const withLog = (s: MessagingState, entries: LogEntry[]): MessagingState =>
  entries.length ? { ...s, log: [...entries.reverse(), ...s.log].slice(0, LOG_LIMIT) } : s;

function makeOrder(s: MessagingState): Order {
  return {
    id: s.nextId,
    customer: CUSTOMERS[(s.nextId - 1) % CUSTOMERS.length],
    item: ITEMS[(s.nextId - 1) % ITEMS.length],
    placedAtStep: s.step,
  };
}

function send(state: MessagingState, count: number): MessagingState {
  let s = { ...state, queue: [...state.queue], inFlight: [...state.inFlight] };
  const log: LogEntry[] = [];
  for (let n = 0; n < count; n++) {
    const order = makeOrder(s);
    s = { ...s, nextId: s.nextId + 1, sent: s.sent + 1, lastPayload: order };
    const label = `#${order.id} ${order.item}`;
    if (s.mode === 'queue') {
      s.queue.push(order);
      s.accepted++;
      log.push({ kind: 'queued', text: `${label}: stored in the queue; the producer moves on.` });
    } else if (!s.consumerUp) {
      s.lost++;
      log.push({ kind: 'lost', text: `${label}: consumer is down, the call fails, and the order is dropped.` });
    } else if (s.inFlight.length >= s.consumerRate) {
      s.lost++;
      log.push({ kind: 'lost', text: `${label}: consumer is busy, the call fails, and the order is dropped.` });
    } else {
      s.inFlight.push(order);
      s.accepted++;
      log.push({ kind: 'ok', text: `${label}: handed directly to the consumer.` });
    }
  }
  return withLog(s, log);
}

function consume(state: MessagingState): MessagingState {
  if (!state.consumerUp) return state;
  const done = state.mode === 'queue' ? state.queue.slice(0, state.consumerRate) : state.inFlight;
  if (done.length === 0) return state;
  const fanOut = state.sns ? done.length * SNS_SUBSCRIBERS.length : 0;
  return withLog(
    {
      ...state,
      queue: state.mode === 'queue' ? state.queue.slice(done.length) : state.queue,
      inFlight: [],
      processed: state.processed + done.length,
      notifications: state.notifications + fanOut,
    },
    done.map((o) => ({
      kind: 'ok' as const,
      text:
        `#${o.id} ${o.item}: processed` +
        (state.mode === 'queue' ? ' and deleted from the queue' : '') +
        (state.sns ? `; "ready" published to ${SNS_SUBSCRIBERS.length} subscribers.` : '.'),
    })),
  );
}

export function reduce(state: MessagingState, action: Action): MessagingState {
  switch (action.type) {
    case 'send':
      return send(state, action.count);
    case 'step': {
      const s = consume(send(state, state.producerRate));
      return { ...s, step: s.step + 1 };
    }
    case 'fail': {
      if (!state.consumerUp) return state;
      const dropped = state.inFlight.length;
      return withLog(
        { ...state, consumerUp: false, inFlight: [], lost: state.lost + dropped },
        [
          {
            kind: dropped ? 'lost' : 'info',
            text:
              state.mode === 'queue'
                ? 'Consumer failed. Messages wait in the queue.'
                : `Consumer failed.${dropped ? ` ${dropped} order(s) it was working on are lost.` : ''}`,
          },
        ],
      );
    }
    case 'recover':
      if (state.consumerUp) return state;
      return withLog({ ...state, consumerUp: true }, [{ kind: 'info', text: 'Consumer recovered.' }]);
    case 'set':
      return { ...state, ...action.patch };
  }
}

/** Orders waiting: in the queue, or in the consumer's hands in direct mode. */
export function waiting(s: MessagingState): number {
  return s.queue.length + s.inFlight.length;
}

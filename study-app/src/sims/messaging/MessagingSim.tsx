import { useEffect, useReducer, useState } from 'react';
import { SNS_SUBSCRIBERS, initialState, reduce, type Action, type MessagingState, type Mode } from './model';

const MODES: { id: Mode; label: string; note: string }[] = [
  {
    id: 'direct',
    label: 'Direct call (tightly coupled)',
    note: 'The producer hands each order straight to the consumer. If the consumer is down or busy, the order is dropped.',
  },
  {
    id: 'queue',
    label: 'Amazon SQS queue (loosely coupled)',
    note: 'The producer writes each order to a queue and moves on. The consumer retrieves, processes, and deletes messages when it is ready.',
  },
];

type UiAction = Action | { type: 'reset'; mode: Mode };

function uiReduce(s: MessagingState, a: UiAction): MessagingState {
  if (a.type !== 'reset') return reduce(s, a);
  return initialState(a.mode, { consumerRate: s.consumerRate, producerRate: s.producerRate, sns: s.sns });
}

export function MessagingSim() {
  const [s, dispatch] = useReducer(uiReduce, initialState('direct'));
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => dispatch({ type: 'step' }), 900);
    return () => clearInterval(timer);
  }, [running]);

  const mode = MODES.find((m) => m.id === s.mode)!;
  const queued = s.queue.length;

  return (
    <div className="sim">
      <p className="muted">
        A producer (the cashier) sends orders to a consumer (the barista). Run it, make the consumer fail, and compare what
        happens with and without a queue.
      </p>
      <div className="row wrap" role="group" aria-label="Architecture">
        {MODES.map((m) => (
          <button
            key={m.id}
            className={m.id === s.mode ? 'primary' : ''}
            onClick={() => dispatch({ type: 'reset', mode: m.id })}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="small">{mode.note}</p>

      <div className="pipeline" aria-live="polite">
        <div className="node">
          <strong>Producer</strong>
          <span className="muted small">{s.producerRate} order(s) per step</span>
        </div>
        <span className="arrow" aria-hidden>
          →
        </span>
        {s.mode === 'queue' ? (
          <div className="node queue">
            <strong>SQS queue</strong>
            <span className="muted small">{queued} waiting</span>
            <div className="tickets">
              {s.queue.slice(0, 12).map((o) => (
                <span key={o.id} className="ticket">
                  #{o.id}
                </span>
              ))}
              {queued > 12 && <span className="ticket">+{queued - 12}</span>}
            </div>
          </div>
        ) : (
          <div className="node muted">
            <strong>No buffer</strong>
            <span className="small">The producer waits on the consumer.</span>
          </div>
        )}
        <span className="arrow" aria-hidden>
          →
        </span>
        <div className={`node ${s.consumerUp ? '' : 'down'}`}>
          <strong>Consumer {s.consumerUp ? '' : '(down)'}</strong>
          <span className="muted small">{s.consumerRate} order(s) per step</span>
        </div>
        {s.sns && (
          <>
            <span className="arrow" aria-hidden>
              →
            </span>
            <div className="node">
              <strong>SNS topic</strong>
              <span className="muted small">{SNS_SUBSCRIBERS.join(', ')}</span>
            </div>
          </>
        )}
      </div>

      <div className="row wrap">
        <button className="primary" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Run'}
        </button>
        <button onClick={() => dispatch({ type: 'step' })}>One step</button>
        <button onClick={() => dispatch({ type: 'send', count: 5 })}>Burst of 5 orders</button>
        {s.consumerUp ? (
          <button className="danger" onClick={() => dispatch({ type: 'fail' })}>
            Fail consumer
          </button>
        ) : (
          <button onClick={() => dispatch({ type: 'recover' })}>Recover consumer</button>
        )}
        <button onClick={() => dispatch({ type: 'reset', mode: s.mode })}>Reset</button>
      </div>
      <div className="controls">
        <label className="slider">
          Producer: <strong>{s.producerRate}</strong> per step
          <input
            type="range"
            min={0}
            max={4}
            value={s.producerRate}
            onChange={(e) => dispatch({ type: 'set', patch: { producerRate: Number(e.target.value) } })}
          />
        </label>
        <label className="slider">
          Consumer: <strong>{s.consumerRate}</strong> per step
          <input
            type="range"
            min={1}
            max={4}
            value={s.consumerRate}
            onChange={(e) => dispatch({ type: 'set', patch: { consumerRate: Number(e.target.value) } })}
          />
        </label>
      </div>
      <label>
        <input type="checkbox" checked={s.sns} onChange={(e) => dispatch({ type: 'set', patch: { sns: e.target.checked } })} />{' '}
        Publish "order ready" to an SNS topic after each order (publish-subscribe)
      </label>

      <div className="stats">
        <div className="stat">
          <span className="stat-value">{s.accepted}</span>
          <span className="stat-label">Accepted</span>
        </div>
        <div className="stat">
          <span className="stat-value">{s.processed}</span>
          <span className="stat-label">Processed</span>
        </div>
        <div className="stat">
          <span className="stat-value">{s.lost}</span>
          <span className="stat-label">Lost</span>
        </div>
        <div className="stat">
          <span className="stat-value">{queued}</span>
          <span className="stat-label">Queued</span>
        </div>
        {s.sns && (
          <div className="stat">
            <span className="stat-value">{s.notifications}</span>
            <span className="stat-label">SNS notifications (fan-out)</span>
          </div>
        )}
      </div>

      {s.lastPayload && (
        <p className="small">
          Latest message payload: <code>{JSON.stringify(s.lastPayload)}</code>
        </p>
      )}
      <ul className="plain log">
        {s.log.map((e, i) => (
          <li key={`${s.sent}-${s.processed}-${i}`} className={`small log-${e.kind}`}>
            {e.text}
          </li>
        ))}
      </ul>
      <p className="muted small">
        Illustrative model, one step at a time. In SQS, a consumer deletes a message after processing it. SNS pushes each
        message to every subscriber immediately and does not keep it for later pickup.
      </p>
    </div>
  );
}

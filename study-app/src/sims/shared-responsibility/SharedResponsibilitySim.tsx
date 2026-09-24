import { useState } from 'react';
import { RESPONSIBILITY_ITEMS, scoreAssignments, type Owner, type Score, type Service } from './model';

const SERVICE_LABEL: Record<Service, string> = { ec2: 'Amazon EC2', s3: 'Amazon S3' };

export function SharedResponsibilitySim() {
  const [service, setService] = useState<Service>('ec2');
  const [assignments, setAssignments] = useState<Record<string, Owner>>({});
  const [score, setScore] = useState<Score | null>(null);

  const switchService = (s: Service) => {
    setService(s);
    setAssignments({});
    setScore(null);
  };
  const assign = (id: string, owner: Owner) => {
    setAssignments((a) => ({ ...a, [id]: owner }));
    setScore(null);
  };

  return (
    <div className="sim">
      <p className="muted">Assign each responsibility to AWS or the customer, then switch services and compare.</p>
      <div className="row" role="group" aria-label="Service">
        {(Object.keys(SERVICE_LABEL) as Service[]).map((s) => (
          <button key={s} className={s === service ? 'primary' : ''} onClick={() => switchService(s)}>
            {SERVICE_LABEL[s]}
          </button>
        ))}
      </div>
      <ul className="plain">
        {RESPONSIBILITY_ITEMS.map((item) => {
          const picked = assignments[item.id];
          const state = score ? (score.wrong.includes(item.id) ? 'wrong' : picked ? 'right' : '') : '';
          return (
            <li key={item.id} className={`resp ${state}`}>
              <span>{item.text}</span>
              <span className="row">
                {(['aws', 'customer'] as Owner[]).map((o) => (
                  <button key={o} className={`small ${picked === o ? 'primary' : ''}`} onClick={() => assign(item.id, o)}>
                    {o === 'aws' ? 'AWS' : 'Customer'}
                  </button>
                ))}
              </span>
              {score && picked && <span className="muted small why">{item.why[service]}</span>}
            </li>
          );
        })}
      </ul>
      <button className="primary" onClick={() => setScore(scoreAssignments(RESPONSIBILITY_ITEMS, service, assignments))}>
        Check
      </button>
      {score && (
        <p className={`feedback ${score.correct === score.total ? 'right' : 'wrong'}`} role="status">
          {score.correct}/{score.total} correct for {SERVICE_LABEL[service]}
          {score.unanswered.length > 0 && ` · ${score.unanswered.length} unanswered`}.
        </p>
      )}
    </div>
  );
}

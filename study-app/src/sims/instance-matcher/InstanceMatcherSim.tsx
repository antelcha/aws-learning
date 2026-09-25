import { useState } from 'react';
import { FAMILY_LABELS, WORKLOADS, gradeMatches, type Family } from './model';

export function InstanceMatcherSim() {
  const [picks, setPicks] = useState<Record<string, Family>>({});
  const [checked, setChecked] = useState(false);
  const grade = gradeMatches(WORKLOADS, picks);

  return (
    <div className="sim">
      <p className="muted">Match each workload to the instance family that fits its bottleneck.</p>
      <ul className="plain">
        {WORKLOADS.map((w, i) => {
          const result = grade.results[i];
          return (
            <li key={w.id} className={`resp ${checked ? (result.correct ? 'right' : 'wrong') : ''}`}>
              <span>{w.text}</span>
              <select
                value={picks[w.id] ?? ''}
                onChange={(e) => {
                  setPicks((p) => ({ ...p, [w.id]: e.target.value as Family }));
                  setChecked(false);
                }}
              >
                <option value="" disabled>
                  Choose a family
                </option>
                {(Object.keys(FAMILY_LABELS) as Family[]).map((f) => (
                  <option key={f} value={f}>
                    {FAMILY_LABELS[f]}
                  </option>
                ))}
              </select>
              {checked && (
                <span className="muted small why">
                  {result.correct ? '' : `Expected: ${FAMILY_LABELS[w.family]}. `}
                  {w.why}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <button className="primary" onClick={() => setChecked(true)}>
        Check
      </button>
      {checked && (
        <p className={`feedback ${grade.correct === grade.total ? 'right' : 'wrong'}`} role="status">
          {grade.correct}/{grade.total} matched.
        </p>
      )}
    </div>
  );
}

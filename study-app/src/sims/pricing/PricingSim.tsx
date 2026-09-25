import { useState } from 'react';
import {
  EXAMPLE_ON_DEMAND_HOURLY,
  PRICE_LABEL,
  USAGE_PATTERNS,
  cheapestSuitable,
  yearlyCosts,
  type OptionResult,
  type PricingOptionId,
  type UsagePattern,
} from './model';

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export function PricingSim() {
  const [pattern, setPattern] = useState<UsagePattern>(USAGE_PATTERNS[0]);
  const [committed, setCommitted] = useState(0);
  const results = yearlyCosts(pattern, committed);
  const best = cheapestSuitable(results);
  const max = Math.max(...Object.values(results).map((r) => r.cost ?? 0));
  const peak = Math.max(...pattern.profile.map((s) => s.instances));

  return (
    <div className="sim">
      <p className="muted">Pick a usage pattern and a commitment, then compare a year of cost across purchase options.</p>
      <div className="row wrap" role="group" aria-label="Usage pattern">
        {USAGE_PATTERNS.map((p) => (
          <button key={p.id} className={p.id === pattern.id ? 'primary' : ''} onClick={() => setPattern(p)}>
            {p.label}
          </button>
        ))}
      </div>
      <p>{pattern.description}</p>
      <label className="slider">
        Committed instances (Savings Plans / Reserved Instances): <strong>{committed}</strong>
        <input type="range" min={0} max={4} value={committed} onChange={(e) => setCommitted(Number(e.target.value))} />
        <span className="muted">Peak usage: {peak} instance(s)</span>
      </label>
      <table className="pricing">
        <thead>
          <tr>
            <th>Option</th>
            <th>Yearly cost</th>
            <th className="bar-col">Relative</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {(Object.entries(results) as [PricingOptionId, OptionResult][]).map(([id, r]) => (
            <tr key={id} className={`${id === best ? 'best' : ''} ${r.suitable ? '' : 'unsuitable'}`}>
              <td>
                {r.label}
                {id === best && <span className="tag ok">Cheapest suitable</span>}
                {!r.suitable && <span className="tag">Not suitable here</span>}
              </td>
              <td>{r.cost === null ? '—' : usd(r.cost)}</td>
              <td className="bar-col">
                {r.cost !== null && (
                  <div className="bar">
                    <div style={{ width: `${max ? (r.cost / max) * 100 : 0}%` }} />
                  </div>
                )}
              </td>
              <td>
                <ul className="caveats">
                  {r.caveats.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted small">
        {PRICE_LABEL} On-Demand is set to {usd(EXAMPLE_ON_DEMAND_HOURLY)} per instance-hour; each option uses the course's
        maximum discount. Real prices depend on the Region, instance type, term, and payment option.
      </p>
    </div>
  );
}

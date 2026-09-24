import { useState } from 'react';
import { REGIONS, isAffected, survives, survivingPlacements, type Outage, type Placement } from './model';

const PRESETS: { label: string; placements: Placement[] }[] = [
  { label: 'Single AZ', placements: [{ region: 'us-east-1', az: 'us-east-1a' }] },
  {
    label: 'Multi-AZ',
    placements: [
      { region: 'us-east-1', az: 'us-east-1a' },
      { region: 'us-east-1', az: 'us-east-1b' },
    ],
  },
  {
    label: 'Multi-Region',
    placements: [
      { region: 'us-east-1', az: 'us-east-1a' },
      { region: 'us-east-1', az: 'us-east-1b' },
      { region: 'eu-west-1', az: 'eu-west-1a' },
    ],
  },
];

function describeOutage(o: Outage) {
  if (o.kind === 'az') return `Availability Zone ${o.az} is down`;
  if (o.kind === 'region') return `Region ${o.region} is down`;
  return 'No outage';
}

export function GlobalInfraSim() {
  const [placements, setPlacements] = useState<Placement[]>(PRESETS[0].placements);
  const [outage, setOutage] = useState<Outage>({ kind: 'none' });

  const has = (az: string) => placements.some((p) => p.az === az);
  const toggle = (region: string, az: string) =>
    setPlacements((ps) => (has(az) ? ps.filter((p) => p.az !== az) : [...ps, { region, az }]));

  const up = survives(placements, outage);
  const remaining = survivingPlacements(placements, outage).length;

  return (
    <div className="sim">
      <p className="muted">Place servers in Availability Zones, then trigger an outage and see what survives.</p>
      <div className="row wrap">
        {PRESETS.map((p) => (
          <button key={p.label} onClick={() => setPlacements(p.placements)}>
            {p.label}
          </button>
        ))}
        <button onClick={() => setOutage({ kind: 'none' })} disabled={outage.kind === 'none'}>
          Restore everything
        </button>
      </div>
      <div className="regions">
        {REGIONS.map((r) => {
          const regionDown = outage.kind === 'region' && outage.region === r.id;
          return (
            <div key={r.id} className={`region ${regionDown ? 'down' : ''}`}>
              <div className="row between">
                <strong>{r.name}</strong>
                <button className="small danger" onClick={() => setOutage({ kind: 'region', region: r.id })}>
                  Fail Region
                </button>
              </div>
              <div className="azs">
                {r.azs.map((az) => {
                  const down = isAffected({ region: r.id, az }, outage);
                  return (
                    <div key={az} className={`az ${down ? 'down' : ''}`}>
                      <label>
                        <input type="checkbox" checked={has(az)} onChange={() => toggle(r.id, az)} /> {az}
                      </label>
                      <span aria-hidden>{has(az) ? (down ? '💥' : '🖥️') : '·'}</span>
                      <button className="small" onClick={() => setOutage({ kind: 'az', az })}>
                        Fail AZ
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className={`feedback ${up ? 'right' : 'wrong'}`} role="status">
        {describeOutage(outage)}.{' '}
        {placements.length === 0
          ? 'No servers are placed.'
          : up
            ? `The app is still up: ${remaining} of ${placements.length} server(s) are running.`
            : 'The app is down: every server was in the failed location.'}
      </p>
    </div>
  );
}

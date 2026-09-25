import { useRef, useState, type PointerEvent } from 'react';
import {
  CAPACITY_PER_INSTANCE,
  STEPS,
  TRAFFIC_PRESETS,
  simulate,
  type Az,
  type InstanceView,
  type ScalingConfig,
  type ScalingMode,
} from './model';

const Y_MAX = 1200;
const W = 720;
const H = 230;
const PAD = { left: 44, right: 6, top: 8, bottom: 24 };
const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;
const colW = plotW / STEPS;
const y = (v: number) => PAD.top + plotH - (Math.min(v, Y_MAX) / Y_MAX) * plotH;

const MODES: { id: ScalingMode; label: string; note: string }[] = [
  { id: 'fixed', label: 'No Auto Scaling', note: 'A fixed fleet of "desired" instances; nothing is added, removed, or replaced.' },
  { id: 'dynamic', label: 'Dynamic scaling', note: 'Reacts to the current hour\'s demand; new instances serve after the launch lag.' },
  {
    id: 'predictive',
    label: 'Predictive scaling',
    note: 'Launches ahead of anticipated demand. Here the forecast is assumed to match the curve exactly.',
  },
];

const STATE_LABEL: Record<InstanceView['state'], string> = {
  serving: 'Serving',
  starting: 'Starting',
  unhealthy: 'AZ down',
};

export function ScalingSim() {
  const [demand, setDemand] = useState<number[]>(TRAFFIC_PRESETS[2].demand);
  const [config, setConfig] = useState<ScalingConfig>({
    min: 2,
    desired: 2,
    max: 10,
    mode: 'dynamic',
    launchLag: 2,
    azCount: 2,
    loadBalancer: true,
  });
  const [hour, setHour] = useState(19);
  const drawing = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const set = (patch: Partial<ScalingConfig>) =>
    setConfig((c) => {
      const next = { ...c, ...patch };
      if (patch.min !== undefined) next.max = Math.max(next.max, next.min);
      if (patch.max !== undefined) next.min = Math.min(next.min, next.max);
      next.desired = Math.min(next.max, Math.max(next.min, next.desired));
      return next;
    });

  const result = simulate(demand, config);
  const step = result.steps[hour];
  const { totals } = result;
  const failPct = totals.demand ? Math.round((totals.failed / totals.demand) * 1000) / 10 : 0;

  const drawAt = (e: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current!.getBoundingClientRect();
    const sx = ((e.clientX - box.left) / box.width) * W;
    const sy = ((e.clientY - box.top) / box.height) * H;
    const col = Math.floor((sx - PAD.left) / colW);
    if (col < 0 || col >= STEPS) return;
    const v = Math.round((((PAD.top + plotH - sy) / plotH) * Y_MAX) / 10) * 10;
    const value = Math.min(Y_MAX, Math.max(0, v));
    setDemand((d) => d.map((x, i) => (i === col ? value : x)));
    setHour(col);
  };

  const capPath = result.steps
    .map((s, i) => `${i === 0 ? 'M' : 'L'}${PAD.left + i * colW},${y(s.serving * CAPACITY_PER_INSTANCE)} h${colW}`)
    .join(' ');

  const azs: Az[] = config.azCount === 2 ? ['a', 'b'] : ['a'];
  const outageOn = !!config.azOutage;

  return (
    <div className="sim">
      <p className="muted">
        Pick or draw a day of traffic, configure the Auto Scaling group, and watch requests get served or fail. Click or
        drag on the chart to reshape an hour.
      </p>
      <div className="row wrap" role="group" aria-label="Traffic curve">
        {TRAFFIC_PRESETS.map((p) => (
          <button key={p.id} title={p.description} onClick={() => setDemand(p.demand)}>
            {p.label}
          </button>
        ))}
      </div>

      <svg
        ref={svgRef}
        className="chart"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Demand per hour: served in blue, failed in red; the green line is serving capacity"
        onPointerDown={(e) => {
          drawing.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          drawAt(e);
        }}
        onPointerMove={(e) => drawing.current && drawAt(e)}
        onPointerUp={() => (drawing.current = false)}
        onPointerCancel={() => (drawing.current = false)}
      >
        {[0, 400, 800, 1200].map((v) => (
          <g key={v}>
            <line className="grid" x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} />
            <text className="axis" x={PAD.left - 6} y={y(v) + 4} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        <rect className="selected" x={PAD.left + hour * colW} y={PAD.top} width={colW} height={plotH} />
        {result.steps.map((s, i) => (
          <g key={i}>
            <rect className="served" x={PAD.left + i * colW + 2} width={colW - 4} y={y(s.served)} height={y(0) - y(s.served)} />
            <rect
              className="failed"
              x={PAD.left + i * colW + 2}
              width={colW - 4}
              y={y(s.demand)}
              height={y(s.served) - y(s.demand)}
            />
            {i % 3 === 0 && (
              <text className="axis" x={PAD.left + i * colW + colW / 2} y={H - 6} textAnchor="middle">
                {String(i).padStart(2, '0')}
              </text>
            )}
          </g>
        ))}
        <path className="cap" d={capPath} />
      </svg>
      <p className="muted small legend">
        <span className="key served" /> served <span className="key failed" /> failed <span className="key cap" /> serving
        capacity ({CAPACITY_PER_INSTANCE} requests per instance per hour)
      </p>

      <div className="row wrap" role="group" aria-label="Scaling mode">
        {MODES.map((m) => (
          <button key={m.id} className={m.id === config.mode ? 'primary' : ''} onClick={() => set({ mode: m.id })}>
            {m.label}
          </button>
        ))}
      </div>
      <p className="small">{MODES.find((m) => m.id === config.mode)!.note}</p>

      <div className="controls">
        <label className="slider">
          Minimum: <strong>{config.min}</strong>
          <input type="range" min={0} max={12} value={config.min} onChange={(e) => set({ min: Number(e.target.value) })} />
        </label>
        <label className="slider">
          Desired (at start): <strong>{config.desired}</strong>
          <input
            type="range"
            min={0}
            max={12}
            value={config.desired}
            onChange={(e) => set({ desired: Number(e.target.value) })}
          />
        </label>
        <label className="slider">
          Maximum: <strong>{config.max}</strong>
          <input type="range" min={0} max={12} value={config.max} onChange={(e) => set({ max: Number(e.target.value) })} />
        </label>
        <label className="slider">
          Launch lag: <strong>{config.launchLag} h</strong>
          <input
            type="range"
            min={1}
            max={4}
            value={config.launchLag}
            onChange={(e) => set({ launchLag: Number(e.target.value) })}
          />
        </label>
      </div>
      <div className="row wrap">
        <label>
          <input type="checkbox" checked={config.azCount === 2} onChange={(e) => set({ azCount: e.target.checked ? 2 : 1 })} />{' '}
          Spread across two Availability Zones
        </label>
        <label>
          <input type="checkbox" checked={config.loadBalancer} onChange={(e) => set({ loadBalancer: e.target.checked })} />{' '}
          Elastic Load Balancing in front
        </label>
        <label>
          <input
            type="checkbox"
            checked={outageOn}
            onChange={(e) => set({ azOutage: e.target.checked ? { start: 8, end: 12 } : undefined })}
          />{' '}
          AZ "a" fails 08:00–12:00
        </label>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat-value">{totals.served.toLocaleString('en-US')}</span>
          <span className="stat-label">Requests served</span>
        </div>
        <div className="stat">
          <span className="stat-value">{totals.failed.toLocaleString('en-US')}</span>
          <span className="stat-label">Requests failed ({failPct}%)</span>
        </div>
        <div className="stat">
          <span className="stat-value">{totals.instanceHours}</span>
          <span className="stat-label">Instance-hours (billed)</span>
        </div>
        <div className="stat">
          <span className="stat-value">{totals.peakInstances}</span>
          <span className="stat-label">Peak instances</span>
        </div>
      </div>

      <label className="slider">
        Inspect hour: <strong>{String(hour).padStart(2, '0')}:00</strong>
        <input type="range" min={0} max={STEPS - 1} value={hour} onChange={(e) => setHour(Number(e.target.value))} />
      </label>
      <div className="lb">
        <strong>{config.loadBalancer ? 'Elastic Load Balancing' : 'Front end with hardcoded back-end addresses'}</strong>
        <span className="muted small">
          {step.demand} requests: {step.served} served, {step.failed} failed. Desired capacity {step.desired}, running{' '}
          {step.running}.
        </span>
      </div>
      <div className="regions">
        {azs.map((az) => {
          const down = !!config.azOutage && hour >= config.azOutage.start && hour < config.azOutage.end && az === 'a';
          const list = step.instances.filter((i) => i.az === az);
          return (
            <div key={az} className={`region ${down ? 'down' : ''}`}>
              <strong>Availability Zone {az}</strong>
              {list.length === 0 && <p className="muted small">No instances.</p>}
              <ul className="plain instances">
                {list.map((i) => {
                  const over = i.load > CAPACITY_PER_INSTANCE;
                  return (
                    <li key={i.id} className={`inst ${i.state} ${over ? 'over' : ''}`}>
                      <span>
                        #{i.id} {STATE_LABEL[i.state]}
                        {!config.loadBalancer && i.hardcoded && <span className="tag">hardcoded</span>}
                      </span>
                      <span className="small">
                        {i.state === 'serving' ? `${Math.round(i.load)}/${CAPACITY_PER_INSTANCE}${over ? ' overloaded' : ''}` : ''}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="muted small">
        Illustrative model, not AWS behavior in detail: one hour per step, no prices. Here an instance counts toward
        instance-hours from launch, including while it starts. Compare the instance-hours of a fixed fleet sized for the peak with Auto Scaling.
      </p>
    </div>
  );
}

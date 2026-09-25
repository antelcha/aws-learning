import { earnedBadges, moduleQuestions } from '../engine/progress';
import { dueConcepts } from '../engine/weakSpots';
import { modules } from './content';
import { href } from './router';
import type { ProgressApi } from './useProgress';

export function HomePage({ api }: { api: ProgressApi }) {
  const { progress } = api;
  const badges = earnedBadges(modules, progress);
  const due = dueConcepts(progress.weakSpots, new Date()).length;
  return (
    <section>
      <h1>AWS Cloud Practitioner study app</h1>
      <p className="muted">
        Refresh each lesson, try its simulation, then clear its scenario questions. Missed concepts come back as weak spots
        after 1, 3, and 7 days.
      </p>
      {due > 0 && (
        <a className="card callout" href={href.weak()}>
          {due} weak spot{due === 1 ? ' is' : 's are'} due. Start a weak-spots round →
        </a>
      )}
      <div className="grid">
        {modules.map((m) => {
          const qs = moduleQuestions(m);
          const done = qs.filter((q) => progress.questions[q.id]?.cleared).length;
          const pct = qs.length ? Math.round((done / qs.length) * 100) : 0;
          return (
            <a key={m.id} className="card module-card" href={href.module(m.id)}>
              <span className="muted">Module {m.number}</span>
              <h2>
                {m.title} {badges.includes(m.id) && <span title="Module badge">🏅</span>}
              </h2>
              <div className="bar" aria-label={`${pct}% cleared`}>
                <div style={{ width: `${pct}%` }} />
              </div>
              <span className="muted">
                {done}/{qs.length} questions cleared
                {m.locked.length > 0 && ` · ${m.locked.length} lessons locked`}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

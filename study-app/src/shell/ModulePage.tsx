import { isModuleComplete } from '../engine/progress';
import type { Module } from '../engine/types';
import { href } from './router';
import type { ProgressApi } from './useProgress';

export function ModulePage({ module, api }: { module: Module; api: ProgressApi }) {
  const { progress } = api;
  const cleared = (ids: string[]) => ids.filter((id) => progress.questions[id]?.cleared).length;
  const rows = [
    ...module.lessons.map((l) => ({ order: l.order, lesson: l, locked: undefined })),
    ...module.locked.map((l) => ({ order: l.order, lesson: undefined, locked: l })),
  ].sort((a, b) => a.order - b.order);
  const bossIds = module.boss.steps.map((s) => s.id);

  return (
    <section>
      <a href={href.home()} className="muted">
        ← All modules
      </a>
      <h1>
        Module {module.number}: {module.title}
      </h1>
      <p className="muted">
        {isModuleComplete(module, progress)
          ? '🏅 Badge earned: every lesson challenge and the boss round are cleared.'
          : module.locked.length > 0
            ? 'The badge unlocks after the locked lessons are added and every challenge is cleared.'
            : 'Clear every lesson challenge and the boss round to earn the badge.'}
      </p>
      <ol className="lessons">
        {rows.map(({ order, lesson, locked }) =>
          lesson ? (
            <li key={order}>
              <a className="card lesson-row" href={href.lesson(lesson.id)}>
                <span>
                  {order}. {lesson.title} {lesson.sim && <span className="tag">Simulation</span>}
                </span>
                <span className="muted">
                  {cleared(lesson.questions.map((q) => q.id))}/{lesson.questions.length}
                </span>
              </a>
            </li>
          ) : (
            <li key={order}>
              <div className="card lesson-row locked" title={locked!.reason}>
                <span>
                  {order}. {locked!.title} <span className="tag">Locked</span>
                </span>
                <span className="muted">{locked!.reason}</span>
              </div>
            </li>
          ),
        )}
      </ol>
      <a className="card boss-row" href={href.boss(module.id)}>
        <span>
          <strong>Boss round:</strong> {module.boss.title}
        </span>
        <span className="muted">
          {cleared(bossIds)}/{bossIds.length} steps
        </span>
      </a>
    </section>
  );
}

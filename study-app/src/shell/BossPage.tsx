import { useState } from 'react';
import { recordChallengeResult } from '../engine/progress';
import type { Module } from '../engine/types';
import { QuestionCard } from './QuestionCard';
import { href } from './router';
import type { ProgressApi } from './useProgress';

export function BossPage({ module, api }: { module: Module; api: ProgressApi }) {
  const { progress, update } = api;
  const { boss } = module;
  const [solvedNow, setSolvedNow] = useState<string[]>([]);
  const isDone = (id: string) => solvedNow.includes(id) || progress.questions[id]?.cleared;
  // Steps unlock in order: show every step up to and including the first unsolved one.
  const firstOpen = boss.steps.findIndex((s) => !isDone(s.id));
  const visible = firstOpen === -1 ? boss.steps : boss.steps.slice(0, firstOpen + 1);

  return (
    <section>
      <a href={href.module(module.id)} className="muted">
        ← Module {module.number}: {module.title}
      </a>
      <h1>Boss round: {boss.title}</h1>
      <div className="card scenario">
        <p>{boss.scenario}</p>
      </div>
      {visible.map((step, i) => (
        <QuestionCard
          key={step.id}
          label={`Step ${i + 1} of ${boss.steps.length}`}
          question={step}
          cleared={progress.questions[step.id]?.cleared}
          onAnswer={(correct, stage) => {
            update((p) => recordChallengeResult(p, step, stage, correct, new Date()));
            if (correct) setSolvedNow((s) => [...s, step.id]);
          }}
        />
      ))}
      {firstOpen === -1 && <p className="feedback right">Incident resolved. Every step is cleared.</p>}
    </section>
  );
}

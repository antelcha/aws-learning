import { recordChallengeResult } from '../engine/progress';
import type { Lesson, Module } from '../engine/types';
import { sims } from '../sims/registry';
import { noteUrl } from './content';
import { QuestionCard } from './QuestionCard';
import { href } from './router';
import type { ProgressApi } from './useProgress';

export function LessonPage({ module, lesson, api }: { module: Module; lesson: Lesson; api: ProgressApi }) {
  const { progress, update } = api;
  const Sim = lesson.sim ? sims[lesson.sim.id] : undefined;
  const index = module.lessons.findIndex((l) => l.id === lesson.id);
  const prev = module.lessons[index - 1];
  const next = module.lessons[index + 1];

  return (
    <section>
      <a href={href.module(module.id)} className="muted">
        ← Module {module.number}: {module.title}
      </a>
      <h1>
        {lesson.order}. {lesson.title}
      </h1>

      <div className="card">
        <h2>Key idea</h2>
        <ul>
          {lesson.keyIdea.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <a href={noteUrl(lesson)} target="_blank" rel="noreferrer">
          Open the lesson note ↗
        </a>
      </div>

      {Sim && lesson.sim && (
        <div className="card">
          <h2>Simulation</h2>
          <Sim config={lesson.sim.config} />
        </div>
      )}

      <h2>Challenge</h2>
      {lesson.questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          label={`Question ${i + 1}`}
          question={q}
          cleared={progress.questions[q.id]?.cleared}
          onAnswer={(correct, stage) => update((p) => recordChallengeResult(p, q, stage, correct, new Date()))}
        />
      ))}

      <nav className="row between">
        {prev ? <a href={href.lesson(prev.id)}>← {prev.title}</a> : <span />}
        {next ? <a href={href.lesson(next.id)}>{next.title} →</a> : <a href={href.boss(module.id)}>Boss round →</a>}
      </nav>
    </section>
  );
}

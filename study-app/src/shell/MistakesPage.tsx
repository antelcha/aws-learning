import { allQuestions, questionHome } from './content';
import type { ProgressApi } from './useProgress';

export function MistakesPage({ api }: { api: ProgressApi }) {
  const mistakes = [...api.progress.mistakes].reverse();
  return (
    <section>
      <h1>Mistake log</h1>
      <p className="muted">Every first wrong answer, newest first.</p>
      {mistakes.length === 0 && <p>No mistakes logged yet.</p>}
      <ul className="plain">
        {mistakes.map((m, i) => {
          const q = allQuestions.find((x) => x.id === m.questionId);
          const home = questionHome(m.questionId);
          return (
            <li key={`${m.questionId}-${m.at}-${i}`} className="card">
              <p>{q ? q.prompt : m.questionId}</p>
              <p className="muted">
                {new Date(m.at).toLocaleString()} · {m.concepts.map((c) => `#${c}`).join(' ')}
                {home && (
                  <>
                    {' · '}
                    <a href={home.hash}>{home.label}</a>
                  </>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

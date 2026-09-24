import { useState } from 'react';
import { pickWeakSpotQuestions, recordWeakSpotResult } from '../engine/weakSpots';
import { allQuestions } from './content';
import { QuestionCard } from './QuestionCard';
import type { ProgressApi } from './useProgress';

export function WeakSpotsPage({ api }: { api: ProgressApi }) {
  const { progress, update } = api;
  // Freeze the round when the page opens so answering does not reshuffle it.
  const [round] = useState(() => pickWeakSpotQuestions(progress.weakSpots, allQuestions, new Date()));
  const upcoming = Object.entries(progress.weakSpots).sort((a, b) => a[1].due.localeCompare(b[1].due));

  return (
    <section>
      <h1>Weak spots</h1>
      <p className="muted">
        Missed concepts return after 1, 3, and 7 days. Your first answer counts: correct moves the concept to the next
        interval, wrong restarts it at 1 day. Weak-spot rounds do not award XP.
      </p>
      {round.length === 0 ? (
        <p>Nothing is due right now.</p>
      ) : (
        round.map(({ concept, question }) => (
          <QuestionCard
            key={`${concept}:${question.id}`}
            label={`Concept: ${concept}`}
            question={question}
            onAnswer={(correct, stage) => {
              if (stage === 'fresh') update((p) => ({ ...p, weakSpots: recordWeakSpotResult(p.weakSpots, concept, correct, new Date()) }));
            }}
          />
        ))
      )}
      {upcoming.length > 0 && (
        <>
          <h2>Schedule</h2>
          <table>
            <thead>
              <tr>
                <th>Concept</th>
                <th>Interval</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map(([concept, spot]) => (
                <tr key={concept}>
                  <td>{concept}</td>
                  <td>{[1, 3, 7][spot.step]} day(s)</td>
                  <td>{new Date(spot.due).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}

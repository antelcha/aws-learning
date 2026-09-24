import { useState } from 'react';
import { checkAnswer, nextStage, xpFor, type Stage } from '../engine/answer';
import type { Question } from '../engine/types';

interface Props {
  question: Question;
  /** Already cleared in saved progress: replays award no XP. */
  cleared?: boolean;
  /** Called on every submitted answer with the stage the question was in. */
  onAnswer(correct: boolean, stage: Stage): void;
  label?: string;
}

export function QuestionCard({ question, cleared = false, onAnswer, label }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [stage, setStage] = useState<Stage>('fresh');
  const [solved, setSolved] = useState(false);
  const [lastWrong, setLastWrong] = useState(false);
  const [earned, setEarned] = useState<number | null>(null);

  const toggle = (id: string) => {
    if (solved) return;
    setLastWrong(false);
    if (question.type === 'single') setSelected([id]);
    else setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const submit = () => {
    const correct = checkAnswer(question, selected);
    onAnswer(correct, stage);
    if (correct) {
      setSolved(true);
      setEarned(cleared ? 0 : xpFor(stage));
    } else {
      setStage(nextStage(stage, false));
      setLastWrong(true);
    }
  };

  const retry = () => {
    setSelected([]);
    setStage('fresh');
    setSolved(false);
    setLastWrong(false);
    setEarned(null);
  };

  const inputType = question.type === 'single' ? 'radio' : 'checkbox';
  const showExplanation = solved || stage === 'revealed';

  return (
    <article className={`card question ${solved ? 'solved' : ''}`}>
      <header className="question-head">
        {label && <span className="tag">{label}</span>}
        {question.type === 'multi' && <span className="tag">Choose {question.answer.length}</span>}
        {question.beyondCourse && (
          <span className="tag beyond" title="Not from the course video; added as extra context.">
            Beyond course
          </span>
        )}
        {cleared && !solved && <span className="tag ok">Cleared</span>}
      </header>
      <p className="prompt">{question.prompt}</p>
      <fieldset disabled={solved}>
        <legend className="sr-only">Options</legend>
        {question.options.map((o) => {
          const isAnswer = question.answer.includes(o.id);
          const mark = showExplanation && isAnswer ? 'correct' : '';
          return (
            <label key={o.id} className={`option ${selected.includes(o.id) ? 'selected' : ''} ${mark}`}>
              <input
                type={inputType}
                name={question.id}
                checked={selected.includes(o.id)}
                onChange={() => toggle(o.id)}
              />
              <span>{o.text}</span>
            </label>
          );
        })}
      </fieldset>
      {!solved && (
        <button className="primary" onClick={submit} disabled={selected.length === 0}>
          Check answer
        </button>
      )}
      {lastWrong && !solved && (
        <p className="feedback wrong" role="status">
          Not quite. {stage === 'hinted' ? 'Here is a hint.' : 'Here is the explanation; try once more to clear it.'}
        </p>
      )}
      {stage !== 'fresh' && !solved && (
        <p className="hint">
          <strong>Hint:</strong> {question.hint}
        </p>
      )}
      {solved && (
        <p className="feedback right" role="status">
          Correct{earned ? ` — +${earned} XP` : cleared ? ' — already cleared, no new XP' : ' — cleared, 0 XP after the explanation'}.
        </p>
      )}
      {showExplanation && (
        <p className="explanation">
          <strong>Explanation:</strong> {question.explanation}
        </p>
      )}
      {solved && (
        <button className="link" onClick={retry}>
          Try again
        </button>
      )}
    </article>
  );
}

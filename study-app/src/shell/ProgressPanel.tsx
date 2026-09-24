import { useRef, useState } from 'react';
import { earnedBadges, emptyProgress, moduleQuestions } from '../engine/progress';
import { exportProgress, importProgress } from '../engine/storage';
import { dueConcepts } from '../engine/weakSpots';
import { modules } from './content';
import type { ProgressApi } from './useProgress';

export function ProgressPanel({ api }: { api: ProgressApi }) {
  const { progress, replace } = api;
  const [message, setMessage] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);
  const badges = earnedBadges(modules, progress);

  const download = () => {
    const blob = new Blob([exportProgress(progress)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aws-study-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const upload = async (file: File) => {
    try {
      replace(importProgress(await file.text()));
      setMessage('Progress imported.');
    } catch (e) {
      setMessage(`Import failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const reset = () => {
    if (window.confirm('Reset all progress? Export first if you want a copy.')) {
      replace(emptyProgress());
      setMessage('Progress reset.');
    }
  };

  return (
    <section>
      <h1>Progress</h1>
      <div className="stats">
        <div className="stat">
          <span className="stat-value">{progress.xp}</span>
          <span className="stat-label">XP</span>
        </div>
        <div className="stat">
          <span className="stat-value">{badges.length}</span>
          <span className="stat-label">Badges</span>
        </div>
        <div className="stat">
          <span className="stat-value">{Object.keys(progress.weakSpots).length}</span>
          <span className="stat-label">Weak spots tracked</span>
        </div>
        <div className="stat">
          <span className="stat-value">{dueConcepts(progress.weakSpots, new Date()).length}</span>
          <span className="stat-label">Due now</span>
        </div>
      </div>
      <h2>Modules</h2>
      <ul className="plain">
        {modules.map((m) => {
          const qs = moduleQuestions(m);
          const done = qs.filter((q) => progress.questions[q.id]?.cleared).length;
          return (
            <li key={m.id}>
              {badges.includes(m.id) ? '🏅' : '○'} Module {m.number}: {m.title} — {done}/{qs.length} cleared
              {m.locked.length > 0 && ` (${m.locked.length} lessons locked)`}
            </li>
          );
        })}
      </ul>
      <h2>Backup</h2>
      <p className="muted">Progress lives only in this browser. Export it to move it or keep a copy.</p>
      <div className="row">
        <button onClick={download}>Export JSON</button>
        <button onClick={() => fileInput.current?.click()}>Import JSON</button>
        <button className="danger" onClick={reset}>
          Reset
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.target.value = '';
          }}
        />
      </div>
      {message && <p role="status">{message}</p>}
    </section>
  );
}

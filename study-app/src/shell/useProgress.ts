import { useCallback, useEffect, useState } from 'react';
import { emptyProgress, type Progress } from '../engine/progress';
import { loadProgress, saveProgress, type StorageLike } from '../engine/storage';

function browserStorage(): StorageLike | null {
  try {
    const s = window.localStorage;
    s.getItem('aws-study-app.probe');
    return s;
  } catch {
    return null;
  }
}

export interface ProgressApi {
  progress: Progress;
  notice?: string;
  dismissNotice(): void;
  update(fn: (p: Progress) => Progress): void;
  replace(p: Progress): void;
}

export function useProgress(): ProgressApi {
  const [storage] = useState(browserStorage);
  const [initial] = useState(() =>
    storage
      ? loadProgress(storage, new Date())
      : { progress: emptyProgress(), notice: 'Browser storage is unavailable, so progress will not be saved.' },
  );
  const [progress, setProgress] = useState<Progress>(initial.progress);
  const [notice, setNotice] = useState(initial.notice);

  useEffect(() => {
    if (!storage) return;
    try {
      saveProgress(storage, progress);
    } catch {
      setNotice('Progress could not be saved to browser storage. Export it to keep a copy.');
    }
  }, [storage, progress]);

  const update = useCallback((fn: (p: Progress) => Progress) => setProgress(fn), []);
  const replace = useCallback((p: Progress) => setProgress(p), []);
  const dismissNotice = useCallback(() => setNotice(undefined), []);
  return { progress, notice, dismissNotice, update, replace };
}

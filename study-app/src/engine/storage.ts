import { emptyProgress, type Progress } from './progress';

export const PROGRESS_KEY = 'aws-study-app.progress';
export const BACKUP_PREFIX = 'aws-study-app.progress.backup.';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isDateString = (v: unknown) => typeof v === 'string' && !Number.isNaN(Date.parse(v));

export function isProgress(v: unknown): v is Progress {
  if (!isObject(v) || v.version !== 1 || !isNumber(v.xp)) return false;
  if (!isObject(v.questions) || !isObject(v.weakSpots) || !Array.isArray(v.mistakes)) return false;
  const questionsOk = Object.values(v.questions).every(
    (e) => isObject(e) && typeof e.cleared === 'boolean' && isNumber(e.xp) && isNumber(e.misses),
  );
  const spotsOk = Object.values(v.weakSpots).every(
    (s) => isObject(s) && (s.step === 0 || s.step === 1 || s.step === 2) && isDateString(s.due),
  );
  const mistakesOk = v.mistakes.every(
    (m) =>
      isObject(m) &&
      typeof m.questionId === 'string' &&
      Array.isArray(m.concepts) &&
      m.concepts.every((c) => typeof c === 'string') &&
      isDateString(m.at),
  );
  return questionsOk && spotsOk && mistakesOk;
}

export function loadProgress(storage: StorageLike, now: Date): { progress: Progress; notice?: string } {
  const raw = storage.getItem(PROGRESS_KEY);
  if (raw === null) return { progress: emptyProgress() };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isProgress(parsed)) return { progress: parsed };
  } catch {
    // Fall through to backup and reset.
  }
  const backupKey = BACKUP_PREFIX + now.toISOString();
  storage.setItem(backupKey, raw);
  const progress = emptyProgress();
  saveProgress(storage, progress);
  return {
    progress,
    notice: `Saved progress could not be read, so it was reset. The original data was kept in localStorage under the backup key "${backupKey}".`,
  };
}

export function saveProgress(storage: StorageLike, progress: Progress): void {
  storage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function exportProgress(progress: Progress): string {
  return JSON.stringify(progress, null, 2);
}

/** Parses exported progress; throws when the JSON or its shape is invalid. */
export function importProgress(json: string): Progress {
  const parsed: unknown = JSON.parse(json);
  if (!isProgress(parsed)) throw new Error('This file is not valid study app progress.');
  return parsed;
}

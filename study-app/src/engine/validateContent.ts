import type { Module, Question } from './types';

export interface ValidateOptions {
  knownConcepts: string[];
  /** Resolves a lesson's note path (relative to study-app/). */
  noteExists(path: string): boolean;
}

/** Returns human-readable errors; an empty array means the content is valid. */
export function validateContent(modules: Module[], opts: ValidateOptions): string[] {
  const errors: string[] = [];
  const known = new Set(opts.knownConcepts);
  const seen = new Set<string>();

  const claim = (id: string, where: string) => {
    if (seen.has(id)) errors.push(`${where}: duplicate ID "${id}"`);
    seen.add(id);
  };

  const checkQuestion = (q: Question, where: string) => {
    const at = `${where} question ${q.id}`;
    claim(q.id, at);
    if (!q.prompt.trim()) errors.push(`${at}: empty prompt`);
    if (!q.hint.trim()) errors.push(`${at}: empty hint`);
    if (!q.explanation.trim()) errors.push(`${at}: empty explanation`);
    if (q.concepts.length === 0) errors.push(`${at}: no concepts`);
    for (const c of q.concepts) if (!known.has(c)) errors.push(`${at}: unknown concept "${c}"`);
    const optionIds = new Set(q.options.map((o) => o.id));
    if (optionIds.size !== q.options.length) errors.push(`${at}: duplicate option IDs`);
    for (const a of q.answer) if (!optionIds.has(a)) errors.push(`${at}: answer "${a}" is not among the options`);
    if (q.type === 'single' && q.answer.length !== 1) errors.push(`${at}: single question needs exactly one answer`);
    if (q.type === 'multi' && q.answer.length < 1) errors.push(`${at}: multi question needs at least one answer`);
  };

  for (const m of modules) {
    claim(m.id, `module ${m.id}`);
    for (const l of m.lessons) {
      const where = `lesson ${l.id}`;
      claim(l.id, where);
      if (l.module !== m.id) errors.push(`${where}: module "${l.module}" does not match "${m.id}"`);
      if (!opts.noteExists(l.note)) errors.push(`${where}: note not found at "${l.note}"`);
      if (l.keyIdea.length < 3 || l.keyIdea.length > 5) errors.push(`${where}: key idea must have 3–5 lines`);
      if (l.questions.length < 2 || l.questions.length > 3) {
        errors.push(`${where}: needs 2–3 questions, has ${l.questions.length}`);
      }
      for (const q of l.questions) checkQuestion(q, where);
    }
    const where = `boss ${m.boss.id}`;
    claim(m.boss.id, where);
    if (m.boss.module !== m.id) errors.push(`${where}: module "${m.boss.module}" does not match "${m.id}"`);
    if (m.boss.steps.length === 0) errors.push(`${where}: has no steps`);
    for (const q of m.boss.steps) checkQuestion(q, where);
  }
  return errors;
}

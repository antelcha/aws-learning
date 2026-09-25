import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { concepts } from '../content/concepts';
import { modules } from '../content/index';
import { validateContent } from '../src/engine/validateContent';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const errors = validateContent(modules, {
  knownConcepts: [...concepts],
  noteExists: (path) => existsSync(resolve(appRoot, path)),
});

if (errors.length > 0) {
  console.error(`Content check failed with ${errors.length} error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const questionCount = modules.reduce(
  (n, m) => n + m.lessons.reduce((k, l) => k + l.questions.length, 0) + m.boss.steps.length,
  0,
);
console.log(`Content OK: ${modules.length} module(s), ${questionCount} question(s).`);

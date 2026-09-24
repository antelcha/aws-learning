import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateContent } from '../src/engine/validateContent';
import { concepts } from './concepts';
import { modules } from './index';

describe('shipped content', () => {
  it('passes validation', () => {
    const appRoot = resolve(__dirname, '..');
    const errors = validateContent(modules, {
      knownConcepts: [...concepts],
      noteExists: (p) => existsSync(resolve(appRoot, p)),
    });
    expect(errors).toEqual([]);
  });
});

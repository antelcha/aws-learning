export type Route =
  | { page: 'home' }
  | { page: 'module'; id: string }
  | { page: 'lesson'; id: string }
  | { page: 'boss'; moduleId: string }
  | { page: 'weak' }
  | { page: 'mistakes' }
  | { page: 'progress' }
  | { page: 'not-found' };

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const [head, arg] = parts;
  if (parts.length === 0) return { page: 'home' };
  if (parts.length === 2 && head === 'module') return { page: 'module', id: arg };
  if (parts.length === 2 && head === 'lesson') return { page: 'lesson', id: arg };
  if (parts.length === 2 && head === 'boss') return { page: 'boss', moduleId: arg };
  if (parts.length === 1 && head === 'weak') return { page: 'weak' };
  if (parts.length === 1 && head === 'mistakes') return { page: 'mistakes' };
  if (parts.length === 1 && head === 'progress') return { page: 'progress' };
  return { page: 'not-found' };
}

export const href = {
  home: () => '#/',
  module: (id: string) => `#/module/${encodeURIComponent(id)}`,
  lesson: (id: string) => `#/lesson/${encodeURIComponent(id)}`,
  boss: (moduleId: string) => `#/boss/${encodeURIComponent(moduleId)}`,
  weak: () => '#/weak',
  mistakes: () => '#/mistakes',
  progress: () => '#/progress',
};

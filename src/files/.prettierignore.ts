import type { ProjectInput } from '../types.js';

export const path = '.prettierignore';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.prettier) return;
  return 'node_modules\ndist\n.astro\n.wrangler\n';
}

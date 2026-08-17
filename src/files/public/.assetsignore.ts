import type { ProjectInput } from '../../types.js';

export const path = 'public/.assetsignore';

export function generate(input: ProjectInput): string | undefined {
  if (input.adapter !== 'cloudflare') return;
  return '_worker.js\n_routes.json\n';
}

import type { ProjectInput } from '../../../types.js';

export const path = 'public/.assetsignore';

export function generate(_input: ProjectInput): string {
  return '_worker.js\n_routes.json\n';
}

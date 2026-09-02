import type { ProjectInput } from '../../../types.js';

export const path = 'src/env.d.ts';

export function generate(_input: ProjectInput): string {
  return `type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
`;
}

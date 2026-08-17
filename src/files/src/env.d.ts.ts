import type { ProjectInput } from '../../types.js';

export const path = 'src/env.d.ts';

export function generate(input: ProjectInput): string | undefined {
  if (input.adapter !== 'cloudflare') return;
  return `type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
`;
}

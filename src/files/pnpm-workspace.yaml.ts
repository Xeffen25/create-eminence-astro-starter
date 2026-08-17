import type { ProjectInput } from '../types.js';

export const path = 'pnpm-workspace.yaml';

export function generate(input: ProjectInput): string | undefined {
  if (input.packageManager !== 'pnpm') return;
  return `ignoreScripts: true
allowBuilds:
  esbuild: true
  workerd: true
`;
}

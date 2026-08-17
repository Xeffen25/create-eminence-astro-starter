import type { PackageManager, ProjectInput } from '../../types.js';

export const path = '.husky/pre-commit';
export const mode = 0o755;

function command(manager: PackageManager, script: string) {
  return manager === 'npm' ? `npm run ${script}` : `${manager} ${script}`;
}

export function generate(input: ProjectInput): string | undefined {
  const scripts = [
    ...(input.improvements.prettier ? ['format'] : []),
    ...(input.improvements.vitest ? ['test'] : []),
  ];
  if (!input.git || !scripts.length) return;
  return `${scripts.map((script) => command(input.packageManager, script)).join('\n')}\n`;
}

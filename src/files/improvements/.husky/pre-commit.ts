import type { PackageManager, ProjectInput } from '../../../types.js';

export const path = '.husky/pre-commit';
export const mode = 0o755;

function execCommand(manager: PackageManager, binary: string) {
  if (manager === 'npm') return `npm exec ${binary}`;
  if (manager === 'bun') return `bunx ${binary}`;
  return `${manager} exec ${binary}`;
}

function testCommand(manager: PackageManager) {
  return manager === 'npm' ? 'npm test' : `${manager} test`;
}

export function generate(input: ProjectInput): string | undefined {
  if (!input.git) return;
  const lines = [
    ...(input.improvements.prettier
      ? [execCommand(input.packageManager, 'lint-staged')]
      : []),
    ...(input.improvements.vitest ? [testCommand(input.packageManager)] : []),
  ];
  if (!lines.length) return;
  return `${lines.join('\n')}\n`;
}

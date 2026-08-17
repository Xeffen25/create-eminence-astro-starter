import type { PackageManager, ProjectInput } from '../../../types.js';

export const path = '.github/workflows/ci.yml';

function installCommand(packageManager: PackageManager) {
  if (packageManager === 'npm') return 'npm ci';
  if (packageManager === 'yarn') return 'yarn install --immutable';
  if (packageManager === 'bun') return 'bun install --frozen-lockfile';
  return 'pnpm install --frozen-lockfile';
}

function runCommand(packageManager: PackageManager, script: string) {
  return packageManager === 'npm'
    ? `npm run ${script}`
    : packageManager === 'bun'
      ? `bun run ${script}`
      : `${packageManager} ${script}`;
}

export function generate(input: ProjectInput): string {
  const setup =
    input.packageManager === 'pnpm'
      ? `      - uses: pnpm/action-setup@v4
        with:
          version: 10
`
      : input.packageManager === 'bun'
        ? '      - uses: oven-sh/setup-bun@v2\n'
        : '';
  const checks = [
    ...(input.improvements.prettier ? ['format:check'] : []),
    ...(input.improvements.vitest ? ['test'] : []),
    'build',
  ]
    .map((script) => `      - run: ${runCommand(input.packageManager, script)}`)
    .join('\n');
  return `name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
${setup}      - uses: actions/setup-node@v4
        with:
          node-version: 24
          ${input.packageManager === 'pnpm' ? 'cache: pnpm' : ''}
      - run: ${installCommand(input.packageManager)}
${checks}
`;
}

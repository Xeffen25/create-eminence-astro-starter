import { join } from 'node:path';
import { writeNewFile } from '../lib/files.js';
import type { PackageManager } from '../types.js';

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

export async function addCi(
  directory: string,
  options: {
    prettier: boolean;
    vitest: boolean;
    packageManager: PackageManager;
  },
) {
  const setup =
    options.packageManager === 'pnpm'
      ? `      - uses: pnpm/action-setup@v4
        with:
          version: 10
`
      : options.packageManager === 'bun'
        ? '      - uses: oven-sh/setup-bun@v2\n'
        : '';
  const checks = [
    ...(options.prettier ? ['format:check'] : []),
    ...(options.vitest ? ['test'] : []),
    'build',
  ]
    .map(
      (script) => `      - run: ${runCommand(options.packageManager, script)}`,
    )
    .join('\n');
  await writeNewFile(
    join(directory, '.github/workflows/ci.yml'),
    `name: CI

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
          ${options.packageManager === 'pnpm' ? 'cache: pnpm' : ''}
      - run: ${installCommand(options.packageManager)}
${checks}
`,
  );
}

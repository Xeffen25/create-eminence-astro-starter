import {
  astroCommand,
  ciInstallCommand,
  runScript,
} from '../../../package-manager.js';
import type { ProjectInput } from '../../../types.js';

export const path = '.github/workflows/ci.yml';

export function generate(input: ProjectInput): string {
  const run = (script: string) => runScript(input.packageManager, script);
  const setup: string[] = [];
  if (input.packageManager === 'pnpm')
    setup.push(`      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 11`);
  else if (input.packageManager === 'bun')
    setup.push(`      - name: Setup Bun
        uses: oven-sh/setup-bun@v2`);
  const nodeCache =
    input.packageManager === 'bun'
      ? ''
      : `\n          cache: ${input.packageManager}`;
  const checks: string[] = [];
  if (input.improvements.prettier)
    checks.push(`      - name: Format check
        run: ${run('format:check')}`);
  if (input.adapter === 'cloudflare')
    checks.push(`      - name: Generate Cloudflare types
        run: ${run('generate-types')}`);
  checks.push(`      - name: Astro check
        run: ${astroCommand(input.packageManager, 'check')}`);
  if (input.improvements.vitest)
    checks.push(`      - name: Run tests
        run: ${run('test')}`);
  return `name: CI

on:
  push:
  pull_request:

permissions:
  contents: read

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

${setup.length ? `${setup.join('\n\n')}\n\n` : ''}      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 24${nodeCache}

      - name: Install dependencies
        run: ${ciInstallCommand(input.packageManager)}

${checks.join('\n\n')}
`;
}

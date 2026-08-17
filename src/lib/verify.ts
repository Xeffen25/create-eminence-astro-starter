import { execa } from 'execa';
import type { PackageManager } from '../types.js';

export async function addAstro(directory: string, manager: PackageManager) {
  const args =
    manager === 'pnpm'
      ? ['add', 'astro', '--ignore-workspace']
      : manager === 'npm'
        ? ['install', 'astro']
        : ['add', 'astro'];
  await execa(manager, args, { cwd: directory });
}

export async function installDependencies(
  directory: string,
  manager: PackageManager,
) {
  const args =
    manager === 'pnpm' ? ['install', '--ignore-workspace'] : ['install'];
  await execa(manager, args, { cwd: directory });
}

export async function verifyProject(
  directory: string,
  manager: PackageManager,
  hasPrettier: boolean,
  hasVitest: boolean,
) {
  const run = async (script: string) =>
    execa(
      manager,
      manager === 'npm'
        ? ['run', script]
        : manager === 'pnpm'
          ? ['--ignore-workspace', script]
          : [script],
      { cwd: directory },
    );
  await run('build');
  if (hasPrettier) await run('format');
  if (hasVitest) await run('test');
}

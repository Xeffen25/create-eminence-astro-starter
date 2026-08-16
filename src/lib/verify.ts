import { execa } from 'execa';
import type { PackageManager } from '../types.js';

export async function installDependencies(
  directory: string,
  manager: PackageManager,
) {
  const args = manager === 'npm' ? ['install'] : ['install'];
  await execa(manager, args, { cwd: directory, stdio: 'inherit' });
}

export async function verifyProject(
  directory: string,
  manager: PackageManager,
  hasPrettier: boolean,
) {
  const run = async (script: string) =>
    execa(manager, manager === 'npm' ? ['run', script] : [script], {
      cwd: directory,
      stdio: 'inherit',
    });
  await run('build');
  if (hasPrettier) await run('format');
}

import { execa } from 'execa';
import { packagesToAdd, usesHusky } from '../files/package.json.js';
import type { PackageManager, ProjectInput } from '../types.js';

export async function addAstro(directory: string, manager: PackageManager) {
  const args =
    manager === 'pnpm'
      ? ['add', 'astro', '--ignore-workspace']
      : manager === 'npm'
        ? ['install', 'astro']
        : ['add', 'astro'];
  await execa(manager, args, { cwd: directory });
}

export function addArgs(
  manager: PackageManager,
  packages: string[],
  development: boolean,
): string[] {
  if (manager === 'pnpm')
    return [
      'add',
      ...(development ? ['-D'] : []),
      '--ignore-workspace',
      ...packages,
    ];
  if (manager === 'npm')
    return ['install', ...(development ? ['-D'] : []), ...packages];
  return ['add', ...(development ? ['-D'] : []), ...packages];
}

export function huskyArgs(manager: PackageManager): string[] {
  if (manager === 'pnpm') return ['--ignore-workspace', 'husky'];
  if (manager === 'npm') return ['exec', 'husky'];
  if (manager === 'bun') return ['x', 'husky'];
  return ['husky'];
}

export function installCommands(
  manager: PackageManager,
  input: ProjectInput,
): string[][] {
  const { dependencies, devDependencies } = packagesToAdd(input);
  const commands: string[][] = [];
  if (dependencies.length) commands.push(addArgs(manager, dependencies, false));
  if (devDependencies.length)
    commands.push(addArgs(manager, devDependencies, true));
  if (usesHusky(input)) commands.push(huskyArgs(manager));
  return commands;
}

export async function installDependencies(
  directory: string,
  manager: PackageManager,
  input: ProjectInput,
) {
  for (const args of installCommands(manager, input))
    await execa(manager, args, { cwd: directory });
}

export function verifyScripts(
  hasPrettier: boolean,
  hasVitest: boolean,
  hasGenerateTypes: boolean,
) {
  return [
    ...(hasGenerateTypes ? ['generate-types'] : []),
    'build',
    ...(hasPrettier ? ['format'] : []),
    ...(hasVitest ? ['test'] : []),
  ];
}

export async function verifyProject(
  directory: string,
  manager: PackageManager,
  hasPrettier: boolean,
  hasVitest: boolean,
  hasGenerateTypes = false,
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
  for (const script of verifyScripts(hasPrettier, hasVitest, hasGenerateTypes))
    await run(script);
}

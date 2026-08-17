import type { PackageManager } from './types.js';

export function detectPackageManager(
  userAgent = process.env.npm_config_user_agent,
): PackageManager | undefined {
  if (!userAgent) return undefined;
  if (/\bpnpm\//.test(userAgent)) return 'pnpm';
  if (/\byarn\//.test(userAgent)) return 'yarn';
  if (/\bbun\//.test(userAgent)) return 'bun';
  if (/\bnpm\//.test(userAgent)) return 'npm';
  return undefined;
}

export function commandsFor(manager: PackageManager, projectName: string) {
  const run = (script: string) =>
    manager === 'npm' ? `npm run ${script}` : `${manager} ${script}`;
  return {
    install: manager === 'npm' ? 'npm install' : `${manager} install`,
    dev: run('dev'),
    build: run('build'),
    deploy: run('deploy'),
    cd: `cd ${projectName}`,
  };
}

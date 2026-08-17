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

export function runScript(manager: PackageManager, script: string) {
  return manager === 'npm' ? `npm run ${script}` : `${manager} ${script}`;
}

export function astroCommand(manager: PackageManager, args: string) {
  return manager === 'npm'
    ? `npm run astro -- ${args}`
    : `${manager} astro ${args}`;
}

export function ciInstallCommand(manager: PackageManager) {
  if (manager === 'npm') return 'npm ci';
  if (manager === 'yarn') return 'yarn install --immutable';
  if (manager === 'bun') return 'bun install --frozen-lockfile';
  return 'pnpm install';
}

export function commandsFor(manager: PackageManager, projectName: string) {
  return {
    install: manager === 'npm' ? 'npm install' : `${manager} install`,
    dev: runScript(manager, 'dev'),
    build: runScript(manager, 'build'),
    deploy: runScript(manager, 'deploy'),
    cd: `cd ${projectName}`,
  };
}

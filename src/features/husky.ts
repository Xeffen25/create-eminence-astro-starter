import { chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { writeNewFile } from '../lib/files.js';
import {
  addDependencies,
  addScripts,
  updatePackageJson,
} from '../lib/package-json.js';
import type { PackageManager } from '../types.js';

function command(manager: PackageManager, script: string) {
  return manager === 'npm' ? `npm run ${script}` : `${manager} ${script}`;
}

export async function addHusky(
  directory: string,
  packageManager: PackageManager,
  scripts: string[],
) {
  if (!scripts.length) return;
  await updatePackageJson(directory, (pkg) => {
    addDependencies(pkg, { husky: 'latest' });
    addScripts(pkg, { prepare: 'husky' });
  });
  const hook = join(directory, '.husky/pre-commit');
  await writeNewFile(
    hook,
    `${scripts.map((script) => command(packageManager, script)).join('\n')}\n`,
  );
  await chmod(hook, 0o755);
}

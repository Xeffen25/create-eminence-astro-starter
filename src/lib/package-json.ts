import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export type PackageJson = Record<string, unknown> & {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  'lint-staged'?: Record<string, string>;
};

export async function readPackageJson(directory: string): Promise<PackageJson> {
  return JSON.parse(
    await readFile(join(directory, 'package.json'), 'utf8'),
  ) as PackageJson;
}

export async function updatePackageJson(
  directory: string,
  update: (pkg: PackageJson) => void,
) {
  const path = join(directory, 'package.json');
  const pkg = JSON.parse(await readFile(path, 'utf8')) as PackageJson;
  update(pkg);
  await writeFile(path, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
}

export function addDependencies(
  pkg: PackageJson,
  dependencies: Record<string, string>,
  development = true,
) {
  const field = development ? 'devDependencies' : 'dependencies';
  pkg[field] = { ...pkg[field], ...dependencies };
}

export function addScripts(pkg: PackageJson, scripts: Record<string, string>) {
  pkg.scripts = { ...pkg.scripts, ...scripts };
}

export function mergePackageJson(
  existing: PackageJson,
  generated: PackageJson,
): PackageJson {
  const dependencies = {
    ...generated.dependencies,
    ...existing.dependencies,
  };
  const devDependencies = {
    ...generated.devDependencies,
    ...existing.devDependencies,
  };
  const merged: PackageJson = {
    ...generated,
    scripts: { ...existing.scripts, ...generated.scripts },
  };
  if (Object.keys(dependencies).length) merged.dependencies = dependencies;
  else delete merged.dependencies;
  if (Object.keys(devDependencies).length)
    merged.devDependencies = devDependencies;
  else delete merged.devDependencies;
  return merged;
}

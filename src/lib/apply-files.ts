import { chmod, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { FileModule, ProjectInput } from '../types.js';
import {
  mergePackageJson,
  type PackageJson,
  readPackageJson,
} from './package-json.js';

async function writeGenerated(
  directory: string,
  file: FileModule,
  contents: string,
) {
  const path = join(directory, file.path);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, contents, 'utf8');
  if (file.mode !== undefined) await chmod(path, file.mode);
}

async function writePackageJson(directory: string, contents: string) {
  let existing: PackageJson = {};
  try {
    existing = await readPackageJson(directory);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  const generated = JSON.parse(contents) as PackageJson;
  const merged = mergePackageJson(existing, generated);
  const path = join(directory, 'package.json');
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
}

export async function applyFiles(
  directory: string,
  files: FileModule[],
  input: ProjectInput,
) {
  for (const file of files) {
    const contents = file.generate(input);
    if (contents === undefined) continue;
    if (file.path === 'package.json')
      await writePackageJson(directory, contents);
    else await writeGenerated(directory, file, contents);
  }
}

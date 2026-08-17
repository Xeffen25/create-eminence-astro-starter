import {
  cp,
  lstat,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { dirname, join } from 'node:path';

export async function ensureEmptyDirectory(path: string) {
  try {
    const stat = await lstat(path);
    if (!stat.isDirectory())
      throw new Error(`Target exists and is not a directory: ${path}`);
    const entries = await readdir(path);
    if (entries.length)
      throw new Error(`Target directory is not empty: ${path}`);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw error;
  }
}

export async function isNonEmptyDirectory(path: string): Promise<boolean> {
  try {
    const stat = await lstat(path);
    if (!stat.isDirectory()) return false;
    return (await readdir(path)).length > 0;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
}

export async function emptyDirectory(path: string) {
  const stat = await lstat(path);
  if (!stat.isDirectory())
    throw new Error(`Target is not a directory: ${path}`);
  await Promise.all(
    (await readdir(path)).map((entry) =>
      rm(join(path, entry), { recursive: true, force: true }),
    ),
  );
}

export async function copyTemplate(template: string, target: string) {
  await mkdir(target, { recursive: true });
  await Promise.all(
    (await readdir(template)).map((entry) =>
      cp(join(template, entry), join(target, entry), {
        recursive: true,
        force: false,
        errorOnExist: true,
      }),
    ),
  );
}

export async function copyDirectoryContents(source: string, target: string) {
  await mkdir(target, { recursive: true });
  await Promise.all(
    (await readdir(source)).map((entry) =>
      cp(join(source, entry), join(target, entry), {
        recursive: true,
        force: true,
      }),
    ),
  );
}

export async function writeNewFile(path: string, contents: string) {
  await mkdir(dirname(path), { recursive: true });
  try {
    await lstat(path);
    throw new Error(`Refusing to overwrite existing file: ${path}`);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  await writeFile(path, contents, 'utf8');
}

export async function appendUniqueLines(path: string, lines: string[]) {
  let current = '';
  try {
    current = await readFile(path, 'utf8');
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  const existing = new Set(current.split(/\r?\n/));
  const additions = lines.filter((line) => !existing.has(line));
  if (additions.length)
    await writeFile(
      path,
      `${current.replace(/\s*$/, '')}\n${additions.join('\n')}\n`,
      'utf8',
    );
}

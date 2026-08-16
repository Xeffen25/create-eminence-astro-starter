import { cp, lstat, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export async function ensureEmptyDirectory(path: string) {
  try {
    const stat = await lstat(path);
    if (!stat.isDirectory())
      throw new Error(`Target exists and is not a directory: ${path}`);
    const entries = await import('node:fs/promises').then(({ readdir }) =>
      readdir(path),
    );
    if (entries.length)
      throw new Error(`Target directory is not empty: ${path}`);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw error;
  }
}

export async function copyTemplate(template: string, target: string) {
  await mkdir(target, { recursive: true });
  await cp(template, target, {
    recursive: true,
    force: false,
    errorOnExist: true,
  });
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

import { rm, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const filesRoot = resolve('src/files');
const keep = new Set(['cloudflare', 'improvements', 'index.ts']);

for (const name of await readdir(filesRoot)) {
  if (keep.has(name)) continue;
  await rm(join(filesRoot, name), { recursive: true, force: true });
  console.log('removed', name);
}

await rm(resolve('scripts/move-improvements.mjs'), { force: true });
await rm(resolve('scripts/delete-old-files.mjs'), { force: true });

const scripts = resolve('scripts');
const leftover = await readdir(scripts).catch(() => []);
if (leftover.length === 0) await rm(scripts, { recursive: true, force: true });

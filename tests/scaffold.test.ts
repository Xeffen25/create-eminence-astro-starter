import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ensureEmptyDirectory } from '../src/lib/files.js';
import {
  addDependencies,
  addScripts,
  type PackageJson,
} from '../src/lib/package-json.js';
import { generateProject } from '../src/scaffold.js';
import type { Answers } from '../src/types.js';

const temporary: string[] = [];
async function folder() {
  const value = await mkdtemp(join(tmpdir(), 'eminence-'));
  temporary.push(value);
  return value;
}
const base: Answers = {
  projectName: 'my-site',
  packageManager: 'pnpm',
  improvements: { tailwind: false, prettier: false, githubLabels: false },
  git: false,
  install: false,
};
afterEach(async () =>
  Promise.all(
    temporary
      .splice(0)
      .map((path) => rm(path, { recursive: true, force: true })),
  ),
);

describe('generation', () => {
  it('rejects a non-empty directory', async () => {
    const path = await folder();
    await mkdir(join(path, 'full'));
    await expect(ensureEmptyDirectory(path)).rejects.toThrow('not empty');
  });
  it('edits package JSON structurally', () => {
    const pkg: PackageJson = {};
    addDependencies(pkg, { astro: '^6' });
    addScripts(pkg, { build: 'astro build' });
    expect(pkg).toEqual({
      devDependencies: { astro: '^6' },
      scripts: { build: 'astro build' },
    });
  });
  it('generates a minimal project', async () => {
    const root = await folder();
    const target = join(root, 'my-site');
    await generateProject(target, base);
    expect(await readFile(join(target, 'wrangler.jsonc'), 'utf8')).toContain(
      '@astrojs/cloudflare/entrypoints/server',
    );
    expect(await readFile(join(target, 'package.json'), 'utf8')).toContain(
      'wrangler',
    );
  });
  it('generates every optional feature', async () => {
    const root = await folder();
    const target = join(root, 'my-site');
    await generateProject(target, {
      ...base,
      improvements: { tailwind: true, prettier: true, githubLabels: true },
    });
    expect(
      await readFile(join(target, 'src/styles/global.css'), 'utf8'),
    ).toContain('@import');
    expect(
      await readFile(join(target, 'prettier.config.mjs'), 'utf8'),
    ).toContain('singleQuote');
    expect(
      await readFile(join(target, '.github/workflows/sync-labels.yml'), 'utf8'),
    ).toContain('updateLabel');
  });
  it('does not install when installation is declined', async () => {
    const root = await folder();
    const install = vi.fn();
    await generateProject(join(root, 'my-site'), base, { install });
    expect(install).not.toHaveBeenCalled();
  });
  it('preserves files when installation fails', async () => {
    const root = await folder();
    const target = join(root, 'my-site');
    await expect(
      generateProject(
        target,
        { ...base, install: true },
        {
          install: async () => {
            throw new Error('network failed');
          },
        },
      ),
    ).rejects.toThrow('network failed');
    expect(await readFile(join(target, 'package.json'), 'utf8')).toContain(
      'my-site',
    );
  });
  it('runs install and verification only after generation', async () => {
    const root = await folder();
    const target = join(root, 'my-site');
    const verify = vi.fn();
    await generateProject(
      target,
      { ...base, install: true },
      {
        install: async (path) =>
          expect(await readFile(join(path, 'package.json'), 'utf8')).toContain(
            'astro',
          ),
        verify,
      },
    );
    expect(verify).toHaveBeenCalledOnce();
  });
});

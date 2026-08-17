import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  copyDirectoryContents,
  emptyDirectory,
  ensureEmptyDirectory,
  isNonEmptyDirectory,
} from '../src/lib/files.js';
import { generate as generatePnpmWorkspace } from '../src/files/pnpm-workspace.yaml.js';
import {
  addDependencies,
  addScripts,
  type PackageJson,
  updatePackageJson,
} from '../src/lib/package-json.js';
import { generateProject, templateDirectory } from '../src/scaffold.js';
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
  improvements: {
    tailwind: false,
    prettier: false,
    githubLabels: false,
    issueTemplates: false,
    vitest: false,
    eminenceAstroSuite: false,
    sitemap: false,
    resend: false,
  },
  adapter: 'cloudflare',
  frameworks: [],
  language: {
    paraglide: false,
    languages: ['en'],
    defaultLanguage: 'en',
  },
  git: false,
  site: 'https://example.com',
  workersDev: false,
};
async function addAstro(directory: string) {
  await updatePackageJson(directory, (pkg) => {
    addDependencies(pkg, { astro: '^7.2.2' }, false);
  });
}
const skipInstall = {
  addAstro,
  install: async () => {},
  verify: async () => {},
  compatibilityDate: '2020-01-01',
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
  it('detects and empties an existing target directory', async () => {
    const path = await folder();
    await mkdir(join(path, 'full'));
    expect(await isNonEmptyDirectory(path)).toBe(true);
    await emptyDirectory(path);
    expect(await isNonEmptyDirectory(path)).toBe(false);
  });
  it('overlays template files, adding new paths and overwriting existing ones', async () => {
    const target = await folder();
    const source = await folder();
    await mkdir(join(target, 'src/pages'), { recursive: true });
    await writeFile(join(target, 'src/pages/index.astro'), 'page');
    await writeFile(join(target, 'README.md'), 'old');
    await mkdir(join(source, 'src/lib'), { recursive: true });
    await writeFile(join(source, 'src/lib/.gitkeep'), '');
    await writeFile(join(source, 'README.md'), 'new');
    await copyDirectoryContents(source, target);
    expect(await readFile(join(target, 'README.md'), 'utf8')).toBe('new');
    expect(await readFile(join(target, 'src/lib/.gitkeep'), 'utf8')).toBe('');
    expect(await readFile(join(target, 'src/pages/index.astro'), 'utf8')).toBe(
      'page',
    );
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
  it('copies the official Astro minimal template', async () => {
    expect(
      await readFile(join(templateDirectory, 'astro.config.mjs'), 'utf8'),
    ).toContain('export default defineConfig({})');
    expect(
      await readFile(join(templateDirectory, '.gitignore'), 'utf8'),
    ).toContain('node_modules/');
    const root = await folder();
    const target = join(root, 'my-site');
    await generateProject(target, { ...base, adapter: 'none' }, skipInstall);
    expect(
      await readFile(join(target, 'public/favicon.svg'), 'utf8'),
    ).toContain('viewBox="0 0 128 128"');
    expect(await readFile(join(target, '.gitignore'), 'utf8')).toContain(
      '.idea/',
    );
    expect(await readFile(join(target, '.gitignore'), 'utf8')).toContain(
      '.wrangler/',
    );
    expect(await readFile(join(target, '.gitignore'), 'utf8')).not.toContain(
      'src/paraglide/*',
    );
    for (const path of [
      'src/assets/flags/ca.svg',
      'src/assets/flags/de.svg',
      'src/assets/flags/es.svg',
      'src/assets/flags/fr.svg',
      'src/assets/flags/gb.svg',
      'src/assets/flags/it.svg',
    ])
      expect(await readFile(join(target, path), 'utf8')).toBeTruthy();
    expect(
      await readFile(join(target, 'src/components/Fonts.astro'), 'utf8'),
    ).toContain('astro:assets');
    expect(
      await readFile(join(target, 'src/actions/index.ts'), 'utf8'),
    ).toContain('export const server');
    const pkg = JSON.parse(
      await readFile(join(target, 'package.json'), 'utf8'),
    ) as PackageJson;
    expect(pkg.name).toBe('my-site');
    expect(pkg.version).toBe('1.0.0');
    expect(pkg.dependencies?.astro).toBe('^7.2.2');
    expect(pkg.devDependencies?.astro).toBeUndefined();
    await expect(
      readFile(join(target, 'public/.assetsignore'), 'utf8'),
    ).rejects.toMatchObject({ code: 'ENOENT' });
    expect(
      await readFile(join(target, 'pnpm-workspace.yaml'), 'utf8'),
    ).toContain('allowBuilds:');
  });
  it('writes pnpm-workspace.yaml only when the package manager is pnpm', async () => {
    const root = await folder();
    const pnpm = join(root, 'pnpm-site');
    await generateProject(pnpm, base, skipInstall);
    expect(await readFile(join(pnpm, 'pnpm-workspace.yaml'), 'utf8')).toBe(
      generatePnpmWorkspace({ ...base, compatibilityDate: '2020-01-01' }),
    );
    for (const manager of ['npm', 'yarn', 'bun'] as const) {
      const target = join(root, `${manager}-site`);
      await generateProject(
        target,
        { ...base, packageManager: manager },
        skipInstall,
      );
      await expect(
        readFile(join(target, 'pnpm-workspace.yaml'), 'utf8'),
      ).rejects.toMatchObject({ code: 'ENOENT' });
    }
  });
  it('always writes the strict tsconfig with path aliases', async () => {
    const expected = {
      extends: 'astro/tsconfigs/strict',
      include: ['.astro/types.d.ts', '**/*', './worker-configuration.d.ts'],
      exclude: ['dist'],
      compilerOptions: {
        types: ['./worker-configuration.d.ts', 'node'],
        paths: {
          '@/*': ['./src/*'],
          '~/*': ['./public/*'],
        },
        verbatimModuleSyntax: true,
      },
    };
    const root = await folder();
    const cloudflare = join(root, 'cloudflare');
    const staticSite = join(root, 'static');
    await generateProject(cloudflare, base, skipInstall);
    await generateProject(
      staticSite,
      { ...base, adapter: 'none' },
      skipInstall,
    );
    expect(
      JSON.parse(await readFile(join(cloudflare, 'tsconfig.json'), 'utf8')),
    ).toEqual(expected);
    expect(
      JSON.parse(await readFile(join(staticSite, 'tsconfig.json'), 'utf8')),
    ).toEqual(expected);
  });
  it('generates a minimal project', async () => {
    const root = await folder();
    const target = join(root, 'my-site');
    await generateProject(target, base, skipInstall);
    const wrangler = await readFile(join(target, 'wrangler.jsonc'), 'utf8');
    expect(wrangler).toContain('@astrojs/cloudflare/entrypoints/server');
    expect(wrangler).toContain('"compatibility_date": "2020-01-01"');
    expect(wrangler).toContain('"workers_dev": true');
    expect(wrangler).not.toContain('"route"');
    expect(await readFile(join(target, 'package.json'), 'utf8')).toContain(
      'generate-types',
    );
    expect(await readFile(join(target, 'src/env.d.ts'), 'utf8')).toContain(
      'interface Locals',
    );
    await expect(
      readFile(join(target, 'svelte.config.js'), 'utf8'),
    ).rejects.toMatchObject({ code: 'ENOENT' });
    expect(
      await readFile(join(target, 'public/.assetsignore'), 'utf8'),
    ).toContain('_worker.js');
    expect(
      await readFile(join(target, 'src/components/Fonts.astro'), 'utf8'),
    ).toContain('astro:assets');
    expect(await readFile(join(target, 'TODO.md'), 'utf8')).toContain(
      'LICENSE.md',
    );
    expect(await readFile(join(target, 'TODO.md'), 'utf8')).toContain(
      'SECURITY.md',
    );
    expect(await readFile(join(target, 'astro.config.mjs'), 'utf8')).toContain(
      'adapter: cloudflare()',
    );
    expect(
      JSON.parse(
        await readFile(join(target, '.vscode/extensions.json'), 'utf8'),
      ),
    ).toEqual({
      recommendations: ['astro-build.astro-vscode'],
      unwantedRecommendations: [],
    });
    expect(await readFile(join(target, '.vscode/mcp.json'), 'utf8')).toContain(
      'mcp.docs.astro.build',
    );
    await expect(
      readFile(join(target, '.vscode/settings.json'), 'utf8'),
    ).rejects.toMatchObject({ code: 'ENOENT' });
  });
  it('generates a static project without a deployment adapter', async () => {
    const root = await folder();
    const target = join(root, 'my-site');
    await generateProject(target, { ...base, adapter: 'none' }, skipInstall);
    expect(await readFile(join(target, 'astro.config.mjs'), 'utf8')).toContain(
      'output: "static"',
    );
    await expect(
      readFile(join(target, 'wrangler.jsonc'), 'utf8'),
    ).rejects.toMatchObject({
      code: 'ENOENT',
    });
    await expect(
      readFile(join(target, 'src/env.d.ts'), 'utf8'),
    ).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });
  it('generates every optional feature', async () => {
    const root = await folder();
    const target = join(root, 'my-site');
    await generateProject(
      target,
      {
        ...base,
        improvements: {
          tailwind: true,
          prettier: true,
          githubLabels: true,
          issueTemplates: true,
          vitest: true,
          eminenceAstroSuite: true,
          sitemap: true,
          resend: true,
        },
        frameworks: ['svelte', 'react'],
      },
      skipInstall,
    );
    expect(
      await readFile(join(target, 'src/styles/global.css'), 'utf8'),
    ).toContain('@import "tailwindcss"');
    expect(
      await readFile(join(target, 'src/styles/global.css'), 'utf8'),
    ).not.toContain('daisyui');
    expect(
      await readFile(join(target, 'src/components/Fonts.astro'), 'utf8'),
    ).toContain('--astro-font-inter');
    expect(await readFile(join(target, '.prettierrc'), 'utf8')).toContain(
      'prettier-plugin-astro',
    );
    expect(
      await readFile(join(target, '.prettierignore'), 'utf8'),
    ).not.toContain('src/paraglide');
    expect(await readFile(join(target, '.prettierrc'), 'utf8')).toContain(
      'prettier-plugin-svelte',
    );
    await expect(
      readFile(join(target, 'prettier.config.mjs'), 'utf8'),
    ).rejects.toMatchObject({ code: 'ENOENT' });
    expect(await readFile(join(target, 'svelte.config.js'), 'utf8')).toContain(
      'vitePreprocess',
    );
    expect(await readFile(join(target, 'src/env.d.ts'), 'utf8')).toContain(
      '@astrojs/cloudflare',
    );
    expect(
      await readFile(join(target, '.github/workflows/labels-sync.yml'), 'utf8'),
    ).toContain('EndBug/label-sync');
    expect(await readFile(join(target, 'astro.config.mjs'), 'utf8')).toContain(
      'react()',
    );
    expect(await readFile(join(target, 'astro.config.mjs'), 'utf8')).toContain(
      "import eminence from 'eminence-astro-suite'",
    );
    expect(await readFile(join(target, 'astro.config.mjs'), 'utf8')).toContain(
      'eminence()',
    );
    expect(
      await readFile(join(target, 'astro.config.mjs'), 'utf8'),
    ).not.toContain('platformProxy');
    expect(await readFile(join(target, 'astro.config.mjs'), 'utf8')).toContain(
      'fontProviders',
    );
    expect(
      await readFile(join(target, 'src/layouts/BaseLayout.astro'), 'utf8'),
    ).toContain(
      'import { Head, type HeadProps } from "eminence-astro-suite/components"',
    );
    expect(
      await readFile(join(target, 'src/layouts/BaseLayout.astro'), 'utf8'),
    ).toContain('<Fonts />');
    expect(
      await readFile(join(target, 'src/layouts/DefaultLayout.astro'), 'utf8'),
    ).toContain('SkipToContent');
    expect(
      await readFile(join(target, 'src/tests/example.test.ts'), 'utf8'),
    ).toContain('Example test suite');
    expect(
      (
        JSON.parse(await readFile(join(target, 'package.json'), 'utf8')) as {
          'lint-staged'?: Record<string, string>;
          scripts?: Record<string, string>;
        }
      )['lint-staged'],
    ).toEqual({ '*': 'prettier --write' });
    expect(
      (
        JSON.parse(await readFile(join(target, 'package.json'), 'utf8')) as {
          scripts?: Record<string, string>;
        }
      ).scripts?.['github:ci'],
    ).toBe('pnpm format:check && astro check && pnpm test');
    expect(await readFile(join(target, 'TODO.md'), 'utf8')).toContain(
      'RESEND_API_KEY',
    );
    expect(await readFile(join(target, 'TODO.md'), 'utf8')).toContain(
      'LICENSE.md',
    );
    expect(await readFile(join(target, 'TODO.md'), 'utf8')).toContain(
      'SECURITY.md',
    );
    expect(await readFile(join(target, 'TODO.md'), 'utf8')).toContain(
      'CONTRIBUTING.md',
    );
    expect(
      await readFile(join(target, '.github/ISSUE_TEMPLATE/feat.md'), 'utf8'),
    ).toContain('Feature Request (feat)');
    expect(
      await readFile(join(target, '.github/PULL_REQUEST_TEMPLATE.md'), 'utf8'),
    ).toContain('Submission Checklist');
    expect(
      await readFile(join(target, '.github/SUPPORT.md'), 'utf8'),
    ).toContain('Official Technical Documentation');
    expect(
      await readFile(join(target, '.vscode/extensions.json'), 'utf8'),
    ).toContain('esbenp.prettier-vscode');
    expect(
      await readFile(join(target, '.vscode/extensions.json'), 'utf8'),
    ).toContain('vitest.explorer');
    expect(
      await readFile(join(target, '.vscode/settings.json'), 'utf8'),
    ).toContain('prettier.configPath');
  });
  it('creates a static single-language project without Paraglide', async () => {
    const root = await folder();
    const target = join(root, 'my-site');
    await generateProject(target, base, skipInstall);
    const layout = await readFile(
      join(target, 'src/layouts/BaseLayout.astro'),
      'utf8',
    );
    expect(layout).toContain('<html lang="en">');
    expect(layout).not.toContain('getLocale');
    expect(layout).toContain('absolutely every route');
    expect(layout).toMatch(/^---\n\/\/ BaseLayout/m);
    expect(layout).not.toContain('<!--');
    expect(
      await readFile(join(target, 'src/layouts/DefaultLayout.astro'), 'utf8'),
    ).toContain('most pages');
    expect(
      await readFile(join(target, 'src/layouts/DefaultLayout.astro'), 'utf8'),
    ).not.toContain('<!--');
    expect(
      await readFile(join(target, 'src/components/Header.astro'), 'utf8'),
    ).not.toContain('LanguageSwitcher');
    expect(
      await readFile(
        join(target, 'src/components/SkipToContent.astro'),
        'utf8',
      ),
    ).toContain('Skip to main content');
    await expect(
      readFile(join(target, 'src/components/LanguageSwitcher.astro'), 'utf8'),
    ).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(
      readFile(join(target, 'src/middleware.ts'), 'utf8'),
    ).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });
  it('creates messages and locale-aware layout when Paraglide is selected', async () => {
    const root = await folder();
    const target = join(root, 'my-site');
    await generateProject(
      target,
      {
        ...base,
        language: {
          paraglide: true,
          languages: ['en', 'es', 'de'],
          defaultLanguage: 'es',
        },
      },
      skipInstall,
    );
    expect(
      await readFile(join(target, 'src/layouts/BaseLayout.astro'), 'utf8'),
    ).toContain('lang={getLocale()}');
    expect(await readFile(join(target, 'messages/en.json'), 'utf8')).toContain(
      'Hello',
    );
    expect(await readFile(join(target, 'messages/es.json'), 'utf8')).toContain(
      'Hola',
    );
    expect(await readFile(join(target, 'messages/de.json'), 'utf8')).toContain(
      'Hallo',
    );
    expect(
      await readFile(join(target, 'project.inlang/settings.json'), 'utf8'),
    ).toContain('"baseLocale": "es"');
    expect(
      await readFile(join(target, 'src/pages/index.astro'), 'utf8'),
    ).toContain('m.index_h1()');
    expect(
      await readFile(join(target, 'src/pages/index.astro'), 'utf8'),
    ).toContain('m.index_title()');
    expect(
      await readFile(
        join(target, 'src/components/LanguageSwitcher.astro'),
        'utf8',
      ),
    ).toContain('esFlagSvg');
    expect(
      await readFile(join(target, 'src/components/Header.astro'), 'utf8'),
    ).toContain('LanguageSwitcher');
    expect(
      await readFile(
        join(target, 'src/components/SkipToContent.astro'),
        'utf8',
      ),
    ).toContain('m.layout_skip_to_content()');
    expect(await readFile(join(target, 'src/middleware.ts'), 'utf8')).toContain(
      '@/paraglide/server',
    );
    expect(
      (await readFile(join(target, 'src/middleware.ts'), 'utf8')).startsWith(
        'import { defineMiddleware }',
      ),
    ).toBe(true);
    expect(await readFile(join(target, 'package.json'), 'utf8')).toContain(
      'machine-translate',
    );
    expect(
      await readFile(join(target, '.vscode/extensions.json'), 'utf8'),
    ).toContain('inlang.vs-code-extension');
  });
  it('keeps Paraglide projects static when no adapter is selected', async () => {
    const root = await folder();
    const target = join(root, 'my-site');
    await generateProject(
      target,
      {
        ...base,
        adapter: 'none',
        language: {
          paraglide: true,
          languages: ['en', 'fr'],
          defaultLanguage: 'fr',
        },
      },
      skipInstall,
    );
    const config = await readFile(join(target, 'astro.config.mjs'), 'utf8');
    expect(config).toContain('output: "static"');
    expect(config).toContain('defaultLocale: "fr"');
    expect(config).toContain('locales: ["en","fr"]');
    expect(config).toContain('paraglideVitePlugin');
  });
  it('adds Vitest to CI and the Git pre-commit hook', async () => {
    const root = await folder();
    const target = join(root, 'my-site');
    const git = vi.fn(async () => undefined);
    await generateProject(
      target,
      {
        ...base,
        git: true,
        improvements: {
          ...base.improvements,
          prettier: true,
          vitest: true,
        },
      },
      { ...skipInstall, git: git as never },
    );
    expect(await readFile(join(target, '.husky/pre-commit'), 'utf8')).toBe(
      'pnpm exec lint-staged\npnpm test\n',
    );
    expect(
      (
        JSON.parse(await readFile(join(target, 'package.json'), 'utf8')) as {
          'lint-staged'?: Record<string, string>;
        }
      )['lint-staged'],
    ).toEqual({ '*': 'prettier --write' });
    expect(
      await readFile(join(target, '.github/workflows/ci.yml'), 'utf8'),
    ).toContain('run: pnpm test');
  });
  it('always installs dependencies', async () => {
    const root = await folder();
    const install = vi.fn();
    await generateProject(join(root, 'my-site'), base, {
      ...skipInstall,
      install,
    });
    expect(install).toHaveBeenCalledOnce();
  });
  it('preserves files when installation fails', async () => {
    const root = await folder();
    const target = join(root, 'my-site');
    await expect(
      generateProject(target, base, {
        ...skipInstall,
        install: async () => {
          throw new Error('network failed');
        },
      }),
    ).rejects.toThrow('network failed');
    expect(await readFile(join(target, 'package.json'), 'utf8')).toContain(
      'my-site',
    );
  });
  it('runs add Astro, install, and verification in order', async () => {
    const root = await folder();
    const target = join(root, 'my-site');
    const order: string[] = [];
    const verify = vi.fn(async () => {
      order.push('verify');
    });
    await generateProject(target, base, {
      addAstro: async (directory) => {
        order.push('addAstro');
        await addAstro(directory);
      },
      install: async (path) => {
        order.push('install');
        const pkg = JSON.parse(
          await readFile(join(path, 'package.json'), 'utf8'),
        ) as PackageJson;
        expect(pkg.dependencies?.astro).toBe('^7.2.2');
      },
      verify,
    });
    expect(order).toEqual(['addAstro', 'install', 'verify']);
  });
  it('reports generation as labeled steps', async () => {
    const root = await folder();
    const steps: string[] = [];
    await generateProject(
      join(root, 'my-site'),
      {
        ...base,
        git: true,
        improvements: { ...base.improvements, tailwind: true },
      },
      {
        ...skipInstall,
        git: vi.fn(async () => undefined) as never,
        reporter: {
          start: (message) => steps.push(`start:${message}`),
          message: (message) => steps.push(`message:${message}`),
          stop: (message) => steps.push(`stop:${message}`),
        },
      },
    );
    expect(steps).toEqual([
      'start:Initiating base project',
      'stop:Initiated base project',
      'start:Creating first commit',
      'stop:First commit',
      'start:Applying improvements',
      'message:Applying improved template',
      'message:Writing files',
      'stop:Applied improvements',
      'start:Installing dependencies',
      'stop:Installed dependencies',
      'start:Creating second commit',
      'stop:Second commit',
    ]);
  });
});

import { runScript } from '../package-manager.js';
import type { PackageJson } from '../lib/package-json.js';
import type { ProjectInput } from '../types.js';

export const path = 'package.json';

export function usesHusky(input: ProjectInput): boolean {
  return (
    input.git && (input.improvements.prettier || input.improvements.vitest)
  );
}

export function packagesToAdd(input: ProjectInput): {
  dependencies: string[];
  devDependencies: string[];
} {
  const dependencies: string[] = [];
  const devDependencies: string[] = [
    '@astrojs/check',
    'typescript',
    '@types/node',
  ];
  if (input.improvements.eminenceAstroSuite) {
    dependencies.push('eminence-astro-suite');
    devDependencies.push('schema-dts');
  }
  if (input.improvements.resend) dependencies.push('resend');
  if (input.language.paraglide)
    devDependencies.push('@inlang/paraglide-js', '@inlang/cli');
  if (input.adapter === 'cloudflare') {
    dependencies.push('@astrojs/cloudflare');
    devDependencies.push('wrangler');
  }
  for (const framework of input.frameworks) {
    if (framework === 'svelte') dependencies.push('@astrojs/svelte', 'svelte');
    if (framework === 'react')
      dependencies.push('@astrojs/react', 'react', 'react-dom');
  }
  if (input.improvements.tailwind)
    dependencies.push('@tailwindcss/vite', 'tailwindcss');
  if (input.improvements.sitemap) dependencies.push('@astrojs/sitemap');
  if (input.improvements.prettier) {
    devDependencies.push(
      'prettier',
      'prettier-plugin-astro',
      'prettier-plugin-organize-imports',
    );
    if (input.frameworks.includes('svelte'))
      devDependencies.push('prettier-plugin-svelte');
  }
  if (input.improvements.vitest) devDependencies.push('vitest');
  if (usesHusky(input)) {
    devDependencies.push('husky');
    if (input.improvements.prettier) devDependencies.push('lint-staged');
  }
  return { dependencies, devDependencies };
}

export function generate(input: ProjectInput): string {
  const run = (script: string) => runScript(input.packageManager, script);
  const scripts: Record<string, string> = {
    dev: 'astro dev',
    build: 'astro build',
    preview: 'astro build && astro preview',
    astro: 'astro',
  };
  if (input.adapter === 'cloudflare') {
    scripts['generate-types'] = 'wrangler types';
    scripts.deploy = 'astro build && wrangler deploy';
  }
  if (input.improvements.prettier) {
    scripts.format = 'prettier . --write';
    scripts['format:check'] = 'prettier . --check';
  }
  if (input.improvements.vitest) {
    scripts.test = 'vitest run';
    scripts['test:watch'] = 'vitest watch';
  }
  scripts['github:ci'] = [
    ...(input.improvements.prettier ? [run('format:check')] : []),
    'astro check',
    ...(input.improvements.vitest ? [run('test')] : []),
  ].join(' && ');
  scripts.all = [
    ...(input.improvements.prettier ? [run('format')] : []),
    ...(input.adapter === 'cloudflare' ? [run('generate-types')] : []),
    'astro check',
    ...(input.improvements.vitest ? [run('test')] : []),
    run('build'),
  ].join(' && ');
  if (input.language.paraglide)
    scripts['machine-translate'] =
      'inlang machine translate --project project.inlang';
  const pkg: PackageJson = {
    name: input.projectName,
    type: 'module',
    version: '1.0.0',
    engines: { node: '>=22.12.0' },
    scripts,
  };
  if (input.improvements.prettier)
    pkg['lint-staged'] = { '*': 'prettier --write' };
  return `${JSON.stringify(pkg, null, 2)}\n`;
}

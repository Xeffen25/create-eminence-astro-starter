import type { Framework, ProjectInput } from '../types.js';
import type { PackageJson } from '../lib/package-json.js';

const frameworkDependencies: Record<Framework, Record<string, string>> = {
  svelte: { '@astrojs/svelte': 'latest', svelte: 'latest' },
  react: { '@astrojs/react': 'latest', react: 'latest', 'react-dom': 'latest' },
};

export const path = 'package.json';

export function generate(input: ProjectInput): string {
  const dependencies: Record<string, string> = { astro: 'latest' };
  const devDependencies: Record<string, string> = {};
  const scripts: Record<string, string> = {
    dev: 'astro dev',
    build: 'astro build',
    preview: 'astro preview',
    astro: 'astro',
  };
  if (input.improvements.eminenceAstroSuite)
    dependencies['eminence-astro-suite'] = 'latest';
  if (input.improvements.resend) dependencies.resend = 'latest';
  if (input.language.paraglide)
    devDependencies['@inlang/paraglide-js'] = 'latest';
  if (input.adapter === 'cloudflare') {
    devDependencies['@astrojs/cloudflare'] = 'latest';
    devDependencies.wrangler = 'latest';
    Object.assign(scripts, {
      start: 'astro dev',
      preview: 'wrangler dev',
      deploy: 'astro build && wrangler deploy',
      'cf-typegen': 'wrangler types',
    });
  }
  for (const framework of input.frameworks)
    Object.assign(devDependencies, frameworkDependencies[framework]);
  if (input.improvements.tailwind)
    Object.assign(devDependencies, {
      '@tailwindcss/vite': 'latest',
      tailwindcss: 'latest',
    });
  if (input.improvements.prettier) {
    Object.assign(devDependencies, {
      prettier: 'latest',
      'prettier-plugin-astro': 'latest',
      'prettier-plugin-tailwindcss': 'latest',
    });
    Object.assign(scripts, {
      format: 'prettier --write .',
      'format:check': 'prettier --check .',
    });
  }
  if (input.improvements.vitest) {
    devDependencies.vitest = 'latest';
    Object.assign(scripts, {
      test: 'vitest run',
      'test:watch': 'vitest',
    });
  }
  const huskyScripts = [
    ...(input.improvements.prettier ? ['format'] : []),
    ...(input.improvements.vitest ? ['test'] : []),
  ];
  if (input.git && huskyScripts.length) {
    devDependencies.husky = 'latest';
    scripts.prepare = 'husky';
  }
  const pkg: PackageJson = {
    name: input.projectName,
    type: 'module',
    version: '0.0.1',
    engines: { node: '>=22.12.0' },
    scripts,
    dependencies,
  };
  if (Object.keys(devDependencies).length)
    pkg.devDependencies = devDependencies;
  return `${JSON.stringify(pkg, null, 2)}\n`;
}

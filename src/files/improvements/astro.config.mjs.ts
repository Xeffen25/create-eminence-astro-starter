import { defaultSite, isDefaultSite } from '../../lib/site.js';
import type { ProjectInput } from '../../types.js';

export const path = 'astro.config.mjs';

export function generate(input: ProjectInput): string {
  const imports = [
    "import { defineConfig, fontProviders } from 'astro/config';",
  ];
  if (input.language.paraglide)
    imports.push("import { paraglideVitePlugin } from '@inlang/paraglide-js';");
  imports.push("import cloudflare from '@astrojs/cloudflare';");
  for (const framework of input.frameworks)
    imports.push(`import ${framework} from '@astrojs/${framework}';`);
  if (input.improvements.tailwind)
    imports.push("import tailwindcss from '@tailwindcss/vite';");
  if (input.improvements.eminenceAstroSuite)
    imports.push("import eminence from 'eminence-astro-suite';");
  if (input.improvements.sitemap && !input.improvements.eminenceAstroSuite)
    imports.push("import sitemap from '@astrojs/sitemap';");

  const integrations: string[] = [];
  if (input.improvements.eminenceAstroSuite)
    integrations.push(
      input.improvements.sitemap
        ? 'eminence()'
        : 'eminence({ sitemap: false })',
    );
  else if (input.improvements.sitemap) integrations.push('sitemap()');
  for (const framework of input.frameworks) integrations.push(`${framework}()`);

  const vitePlugins: string[] = [];
  if (input.language.paraglide)
    vitePlugins.push(`paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      strategy: ['url', 'baseLocale'],
      emitGitIgnore: true,
      emitPrettierIgnore: true,
    })`);
  if (input.improvements.tailwind) vitePlugins.push('tailwindcss()');

  const properties: string[] = [];
  if (isDefaultSite(input.site))
    properties.push(
      `// TODO: replace with the production URL\n  // site: ${JSON.stringify(defaultSite)}`,
    );
  else properties.push(`site: ${JSON.stringify(input.site)}`);
  properties.push('adapter: cloudflare()');
  properties.push('output: "server"');
  properties.push(`fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--astro-font-inter',
      weights: ['100 900'],
      styles: ['normal', 'italic'],
    },
  ]`);
  properties.push(`integrations: [${integrations.join(', ')}]`);

  if (vitePlugins.length)
    properties.push(`vite: {
    plugins: [${vitePlugins.join(', ')}],
  }`);

  return `${imports.join('\n')}\n\nexport default defineConfig({\n  ${properties.join(',\n  ')},\n});\n`;
}

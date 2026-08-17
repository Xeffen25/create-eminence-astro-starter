import type { ProjectInput } from '../types.js';

export const path = 'astro.config.mjs';

export function generate(input: ProjectInput): string {
  const imports = ["import { defineConfig } from 'astro/config';"];
  if (input.adapter === 'cloudflare')
    imports.push("import cloudflare from '@astrojs/cloudflare';");
  for (const framework of input.frameworks)
    imports.push(`import ${framework} from '@astrojs/${framework}';`);
  if (input.improvements.tailwind)
    imports.push("import tailwindcss from '@tailwindcss/vite';");
  if (input.language.paraglide)
    imports.push("import { paraglideVitePlugin } from '@inlang/paraglide-js';");
  if (input.improvements.eminenceAstroSuite)
    imports.push("import eminence from 'eminence-astro-suite';");

  const integrations = [
    ...input.frameworks.map((framework) => `${framework}()`),
    ...(input.improvements.eminenceAstroSuite
      ? [
          `eminence({
      headTags: {
        titleTemplate: ${JSON.stringify(`%s | ${input.projectName}`)},
        openGraphSiteName: ${JSON.stringify(input.projectName)},
        humansTxt: false,
      },
      icons: false,
      manifest: false,
      robotsTxt: false,
      securityTxt: false,
      sitemap: false,
    })`,
        ]
      : []),
  ];
  const vitePlugins: string[] = [];
  if (input.improvements.tailwind) vitePlugins.push('tailwindcss()');
  if (input.language.paraglide)
    vitePlugins.push(`paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      emitTsDeclarations: false,
    })`);

  const output = input.adapter === 'cloudflare' ? 'server' : 'static';
  const properties = [`output: ${JSON.stringify(output)}`];
  if (input.adapter === 'cloudflare')
    properties.push(`adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.jsonc',
      experimentalJsonConfig: true,
    },
  })`);
  if (input.language.paraglide && input.adapter === 'none')
    properties.push(`i18n: {
    defaultLocale: ${JSON.stringify(input.language.defaultLanguage)},
    locales: ${JSON.stringify(input.language.languages)},
  }`);
  properties.push(`integrations: [${integrations.join(', ')}]`);
  if (vitePlugins.length)
    properties.push(`vite: {
    plugins: [${vitePlugins.join(', ')}],
  }`);

  return `${imports.join('\n')}\n\nexport default defineConfig({\n  ${properties.join(',\n  ')},\n});\n`;
}

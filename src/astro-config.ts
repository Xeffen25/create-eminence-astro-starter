import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Answers } from './types.js';

export async function writeAstroConfig(directory: string, answers: Answers) {
  const imports = ["import { defineConfig } from 'astro/config';"];
  if (answers.adapter === 'cloudflare')
    imports.push("import cloudflare from '@astrojs/cloudflare';");
  for (const framework of answers.frameworks)
    imports.push(`import ${framework} from '@astrojs/${framework}';`);
  if (answers.improvements.tailwind)
    imports.push("import tailwindcss from '@tailwindcss/vite';");
  if (answers.language.paraglide)
    imports.push("import { paraglideVitePlugin } from '@inlang/paraglide-js';");
  if (answers.improvements.eminenceAstroSuite)
    imports.push("import eminence from 'eminence-astro-suite';");

  const integrations = [
    ...answers.frameworks.map((framework) => `${framework}()`),
    ...(answers.improvements.eminenceAstroSuite
      ? [
          `eminence({
      headTags: {
        titleTemplate: ${JSON.stringify(`%s | ${answers.projectName}`)},
        openGraphSiteName: ${JSON.stringify(answers.projectName)},
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
  if (answers.improvements.tailwind) vitePlugins.push('tailwindcss()');
  if (answers.language.paraglide)
    vitePlugins.push(`paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      emitTsDeclarations: false,
    })`);

  const output = answers.adapter === 'cloudflare' ? 'server' : 'static';
  const properties = [`output: ${JSON.stringify(output)}`];
  if (answers.adapter === 'cloudflare')
    properties.push(`adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.jsonc',
      experimentalJsonConfig: true,
    },
  })`);
  if (answers.language.paraglide && answers.adapter === 'none')
    properties.push(`i18n: {
    defaultLocale: ${JSON.stringify(answers.language.defaultLanguage)},
    locales: ${JSON.stringify(answers.language.languages)},
  }`);
  properties.push(`integrations: [${integrations.join(', ')}]`);
  if (vitePlugins.length)
    properties.push(`vite: {
    plugins: [${vitePlugins.join(', ')}],
  }`);

  await writeFile(
    join(directory, 'astro.config.mjs'),
    `${imports.join('\n')}\n\nexport default defineConfig({\n  ${properties.join(',\n  ')},\n});\n`,
    'utf8',
  );
}

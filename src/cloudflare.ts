import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { appendUniqueLines, writeNewFile } from './lib/files.js';
import {
  addDependencies,
  addScripts,
  updatePackageJson,
} from './lib/package-json.js';

// Updated deliberately when Cloudflare changes the supported compatibility date.
export const COMPATIBILITY_DATE = '2026-08-11';

export async function addCloudflare(directory: string, projectName: string) {
  await updatePackageJson(directory, (pkg) => {
    addDependencies(pkg, {
      '@astrojs/cloudflare': 'latest',
      wrangler: 'latest',
    });
    addScripts(pkg, {
      dev: 'astro dev',
      start: 'astro dev',
      build: 'astro build',
      preview: 'wrangler dev',
      deploy: 'astro build && wrangler deploy',
      'cf-typegen': 'wrangler types',
    });
  });
  const configPath = join(directory, 'astro.config.mjs');
  const config = await readFile(configPath, 'utf8');
  await writeFile(
    configPath,
    config
      .replace(
        "import { defineConfig } from 'astro/config';",
        "import { defineConfig } from 'astro/config';\nimport cloudflare from '@astrojs/cloudflare';",
      )
      .replace(
        "export default defineConfig({\n  output: 'static',\n});",
        "export default defineConfig({\n  output: 'server',\n  adapter: cloudflare({\n    platformProxy: {\n      enabled: true,\n      configPath: 'wrangler.jsonc',\n      experimentalJsonConfig: true,\n    },\n  }),\n});",
      ),
    'utf8',
  );
  await writeNewFile(
    join(directory, 'wrangler.jsonc'),
    `{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": ${JSON.stringify(projectName)},
  "main": "@astrojs/cloudflare/entrypoints/server",
  "compatibility_date": "${COMPATIBILITY_DATE}",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS"
  },
  "observability": {
    "enabled": true
  }
}
`,
  );
  await appendUniqueLines(join(directory, '.gitignore'), [
    '.wrangler/',
    '.dev.vars',
    '.dev.vars.*',
  ]);
}

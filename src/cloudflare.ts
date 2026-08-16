import { join } from 'node:path';
import { appendUniqueLines, writeNewFile } from './lib/files.js';
import {
  addDependencies,
  addScripts,
  updatePackageJson,
} from './lib/package-json.js';

// Kept at the latest date supported by the pinned Wrangler compatibility range.
export const COMPATIBILITY_DATE = '2026-08-11';

export async function addCloudflare(directory: string, projectName: string) {
  await updatePackageJson(directory, (pkg) => {
    addDependencies(pkg, {
      '@astrojs/cloudflare': '^13.1.0',
      astro: '^6.0.0',
      wrangler: '^4.68.0',
    });
    addScripts(pkg, {
      dev: 'astro dev',
      build: 'astro build',
      preview: 'wrangler dev',
      deploy: 'astro build && wrangler deploy',
      'cf-typegen': 'wrangler types',
    });
  });
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

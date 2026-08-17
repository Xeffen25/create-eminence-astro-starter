import { join } from 'node:path';
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
  await writeNewFile(
    join(directory, 'public/.assetsignore'),
    '_worker.js\n_routes.json\n',
  );
  await appendUniqueLines(join(directory, '.gitignore'), [
    '.wrangler/',
    '.dev.vars',
    '.dev.vars.*',
  ]);
}

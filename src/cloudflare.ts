import { join } from 'node:path';
import { latestWranglerCompatibilityDate } from './lib/compatibility-date.js';
import { appendUniqueLines, writeNewFile } from './lib/files.js';
import {
  addDependencies,
  addScripts,
  updatePackageJson,
} from './lib/package-json.js';

export async function addCloudflare(
  directory: string,
  projectName: string,
  compatibilityDate?: string,
) {
  const date = compatibilityDate ?? (await latestWranglerCompatibilityDate());
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
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": ${JSON.stringify(projectName)},
  "main": "@astrojs/cloudflare/entrypoints/server",
  "compatibility_date": "${date}",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist",
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

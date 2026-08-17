import type { ProjectInput } from '../types.js';

export const path = 'wrangler.jsonc';

export function generate(input: ProjectInput): string | undefined {
  if (input.adapter !== 'cloudflare') return;
  return `{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": ${JSON.stringify(input.projectName)},
  "main": "@astrojs/cloudflare/entrypoints/server",
  "compatibility_date": "${input.compatibilityDate}",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist",
  },
  "observability": {
    "enabled": true
  }
}
`;
}

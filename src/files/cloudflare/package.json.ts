import type { PackageJson } from '../../lib/package-json.js';
import type { ProjectInput } from '../../types.js';

export const path = 'package.json';

export const cloudflareDependencies = ['@astrojs/cloudflare'];
export const cloudflareDevDependencies = ['wrangler'];

export function generate(_input: ProjectInput): string {
  const pkg: PackageJson = {
    scripts: {
      'generate-types': 'wrangler types',
      deploy: 'astro build && wrangler deploy',
    },
  };
  return `${JSON.stringify(pkg, null, 2)}\n`;
}

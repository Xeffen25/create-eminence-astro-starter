import type { ProjectInput } from '../../types.js';

export const path = 'astro.config.mjs';

export function generate(_input: ProjectInput): string {
  return `// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  output: 'server',
});
`;
}

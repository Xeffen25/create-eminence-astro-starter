import type { FileModule } from '../../types.js';
import * as astroConfig from './astro.config.mjs.js';
import * as gitignore from './gitignore.js';
import * as packageJson from './package.json.js';
import * as pnpmWorkspace from './pnpm-workspace.yaml.js';
import * as assetsIgnore from './public/.assetsignore.js';
import * as envDts from './src/env.d.ts.js';
import * as tsconfig from './tsconfig.json.js';
import * as wranglerJsonc from './wrangler.jsonc.js';

export const cloudflareFiles: FileModule[] = [
  packageJson,
  astroConfig,
  tsconfig,
  gitignore,
  wranglerJsonc,
  assetsIgnore,
  envDts,
  pnpmWorkspace,
];

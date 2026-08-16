import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { writeNewFile } from '../lib/files.js';
import { addDependencies, updatePackageJson } from '../lib/package-json.js';

export async function addTailwind(directory: string) {
  await updatePackageJson(directory, (pkg) =>
    addDependencies(pkg, {
      '@tailwindcss/vite': 'latest',
      tailwindcss: 'latest',
    }),
  );
  const configPath = join(directory, 'astro.config.mjs');
  const config = await readFile(configPath, 'utf8');
  const updated = config
    .replace(
      "import cloudflare from '@astrojs/cloudflare';",
      "import cloudflare from '@astrojs/cloudflare';\nimport tailwindcss from '@tailwindcss/vite';",
    )
    .replace('\n});', '\n  vite: {\n    plugins: [tailwindcss()],\n  },\n});');
  await writeFile(configPath, updated, 'utf8');
  await writeNewFile(
    join(directory, 'src/styles/global.css'),
    "@import 'tailwindcss';\n",
  );
  const pagePath = join(directory, 'src/pages/index.astro');
  const page = await readFile(pagePath, 'utf8');
  await writeFile(
    pagePath,
    page.replace('---\n---', "---\nimport '../styles/global.css';\n---"),
    'utf8',
  );
}

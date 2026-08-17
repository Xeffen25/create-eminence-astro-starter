import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { addDependencies, updatePackageJson } from '../lib/package-json.js';

export async function addTailwind(directory: string) {
  await updatePackageJson(directory, (pkg) =>
    addDependencies(pkg, {
      '@tailwindcss/vite': 'latest',
      tailwindcss: 'latest',
    }),
  );
  const stylesheet = join(directory, 'src/styles/global.css');
  const current = await readFile(stylesheet, 'utf8');
  await writeFile(stylesheet, `@import 'tailwindcss';\n\n${current}`, 'utf8');
}

import { join } from 'node:path';
import {
  addDependencies,
  addScripts,
  updatePackageJson,
} from '../lib/package-json.js';
import { writeNewFile } from '../lib/files.js';

export async function addPrettier(directory: string) {
  await updatePackageJson(directory, (pkg) => {
    addDependencies(pkg, {
      prettier: 'latest',
      'prettier-plugin-astro': 'latest',
      'prettier-plugin-tailwindcss': 'latest',
    });
    addScripts(pkg, {
      format: 'prettier --write .',
      'format:check': 'prettier --check .',
    });
  });
  await writeNewFile(
    join(directory, 'prettier.config.mjs'),
    "export default {\n  singleQuote: true,\n  trailingComma: 'all',\n  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],\n};\n",
  );
  await writeNewFile(
    join(directory, '.prettierignore'),
    'node_modules\ndist\n.wrangler\n',
  );
}

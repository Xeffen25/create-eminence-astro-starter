import { addDependencies, updatePackageJson } from '../lib/package-json.js';
import type { Framework } from '../types.js';

const dependencies: Record<Framework, Record<string, string>> = {
  svelte: { '@astrojs/svelte': 'latest', svelte: 'latest' },
  react: { '@astrojs/react': 'latest', react: 'latest', 'react-dom': 'latest' },
};

export async function addFrameworks(
  directory: string,
  frameworks: Framework[],
) {
  if (!frameworks.length) return;
  await updatePackageJson(directory, (pkg) => {
    for (const framework of frameworks)
      addDependencies(pkg, dependencies[framework]);
  });
}

import { addDependencies, updatePackageJson } from '../lib/package-json.js';

export async function addEminenceAstroSuite(directory: string) {
  await updatePackageJson(directory, (pkg) =>
    addDependencies(pkg, { 'eminence-astro-suite': 'latest' }, false),
  );
}

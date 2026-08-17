import { join } from 'node:path';
import { writeNewFile } from '../lib/files.js';
import {
  addDependencies,
  addScripts,
  updatePackageJson,
} from '../lib/package-json.js';

export async function addVitest(directory: string) {
  await updatePackageJson(directory, (pkg) => {
    addDependencies(pkg, { vitest: 'latest' });
    addScripts(pkg, {
      test: 'vitest run',
      'test:watch': 'vitest',
    });
  });
  await writeNewFile(
    join(directory, 'src/tests/example.test.ts'),
    `import { expect, test } from 'vitest';

test('the starter test passes', () => {
  expect(true).toBe(true);
});
`,
  );
}

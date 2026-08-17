import type { ProjectInput } from '../../../types.js';

export const path = 'src/tests/example.test.ts';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.vitest) return;
  return `import { expect, test } from 'vitest';

test('the starter test passes', () => {
  expect(true).toBe(true);
});
`;
}

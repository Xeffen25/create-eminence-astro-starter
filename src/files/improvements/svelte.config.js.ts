import type { ProjectInput } from '../../types.js';

export const path = 'svelte.config.js';

export function generate(input: ProjectInput): string | undefined {
  if (!input.frameworks.includes('svelte')) return;
  return `import { vitePreprocess } from "@astrojs/svelte";

export default {
  preprocess: vitePreprocess(),
};
`;
}

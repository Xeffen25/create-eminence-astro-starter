import type { ProjectInput } from '../types.js';

export const path = '.prettierrc';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.prettier) return;
  const svelte = input.frameworks.includes('svelte');
  return `${JSON.stringify(
    {
      plugins: [
        'prettier-plugin-organize-imports',
        'prettier-plugin-astro',
        ...(svelte ? ['prettier-plugin-svelte'] : []),
      ],
      overrides: [
        {
          files: '*.astro',
          options: {
            parser: 'astro',
          },
        },
        {
          files: '*.svg',
          options: {
            parser: 'html',
          },
        },
        ...(svelte
          ? [
              {
                files: '*.svelte',
                options: {
                  parser: 'svelte',
                },
              },
            ]
          : []),
        {
          files: '*.mdc',
          options: {
            parser: 'markdown',
          },
        },
      ],
    },
    null,
    2,
  )}\n`;
}

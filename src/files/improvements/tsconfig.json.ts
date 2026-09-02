import type { ProjectInput } from '../../types.js';

export const path = 'tsconfig.json';

export function generate(_input: ProjectInput): string {
  return `${JSON.stringify(
    {
      extends: 'astro/tsconfigs/strict',
      include: ['.astro/types.d.ts', '**/*', './worker-configuration.d.ts'],
      exclude: ['dist'],
      compilerOptions: {
        types: ['./worker-configuration.d.ts', 'node'],
        paths: {
          '@/*': ['./src/*'],
          '~/*': ['./public/*'],
        },
        verbatimModuleSyntax: true,
      },
    },
    null,
    2,
  )}\n`;
}

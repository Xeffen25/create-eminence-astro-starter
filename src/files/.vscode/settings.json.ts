import type { ProjectInput } from '../../types.js';

export const path = '.vscode/settings.json';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.prettier) return;
  return `${JSON.stringify(
    {
      'editor.defaultFormatter': 'esbenp.prettier-vscode',
      'editor.formatOnSave': true,
      'prettier.configPath': '.prettierrc',
      'prettier.requireConfig': true,
    },
    null,
    2,
  )}\n`;
}

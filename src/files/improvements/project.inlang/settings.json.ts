import type { ProjectInput } from '../../../types.js';

export const path = 'project.inlang/settings.json';

export function generate(input: ProjectInput): string | undefined {
  if (!input.language.paraglide) return;
  return `${JSON.stringify(
    {
      $schema: 'https://inlang.com/schema/project-settings',
      baseLocale: input.language.defaultLanguage,
      locales: input.language.languages,
      modules: [
        'https://cdn.jsdelivr.net/npm/@inlang/plugin-message-format@4.4.0/dist/index.js',
        'https://cdn.jsdelivr.net/npm/@inlang/plugin-m-function-matcher@2.2.6/dist/index.js',
      ],
      'plugin.inlang.messageFormat': {
        pathPattern: './messages/{locale}.json',
      },
    },
    null,
    2,
  )}\n`;
}

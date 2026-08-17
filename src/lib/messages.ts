import type { Language, ProjectInput } from '../types.js';
import { greetings } from './greetings.js';
import { siteDescriptions, skipToContent } from './languages.js';

export function generateMessageFile(
  locale: Language,
  input: ProjectInput,
): string | undefined {
  if (!input.language.paraglide || !input.language.languages.includes(locale))
    return;
  return `${JSON.stringify(
    {
      $schema: 'https://inlang.com/schema/inlang-message-format',
      index_title: input.projectName,
      index_description: siteDescriptions[locale],
      index_h1: greetings[locale],
      layout_skip_to_content: skipToContent[locale],
    },
    null,
    2,
  )}\n`;
}

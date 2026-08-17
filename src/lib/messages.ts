import type { Language, ProjectInput } from '../types.js';
import { greetings } from './greetings.js';

export function generateMessageFile(
  locale: Language,
  input: ProjectInput,
): string | undefined {
  if (!input.language.paraglide || !input.language.languages.includes(locale))
    return;
  return `${JSON.stringify(
    {
      $schema: 'https://inlang.com/schema/inlang-message-format',
      home_greeting: greetings[locale],
    },
    null,
    2,
  )}\n`;
}

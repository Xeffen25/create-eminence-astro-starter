import { greetings } from '../../../lib/greetings.js';
import type { ProjectInput } from '../../../types.js';

export const path = 'src/pages/index.astro';

export function generate(input: ProjectInput): string {
  const message = input.language.paraglide
    ? "import { m } from '../paraglide/messages.js';"
    : `const greeting = ${JSON.stringify(greetings[input.language.defaultLanguage])};`;
  const greeting = input.language.paraglide ? 'm.home_greeting()' : 'greeting';
  return `---
import BaseLayout from '../layouts/BaseLayout.astro';
${message}
---

<BaseLayout title="My Astro site">
  <main>
    <h1>${greeting}</h1>
  </main>
</BaseLayout>
`;
}

import { greetings } from '../../../lib/greetings.js';
import { siteDescriptions } from '../../../lib/languages.js';
import type { ProjectInput } from '../../../types.js';

export const path = 'src/pages/index.astro';

export function generate(input: ProjectInput): string {
  if (input.language.paraglide)
    return `---
import DefaultLayout from "@/layouts/DefaultLayout.astro";
import { m } from "@/paraglide/messages";
---

<DefaultLayout title={m.index_title()} description={m.index_description()}>
  <h1>{m.index_h1()}</h1>
</DefaultLayout>
`;
  const title = JSON.stringify(input.projectName);
  const description = JSON.stringify(
    siteDescriptions[input.language.defaultLanguage],
  );
  const heading = JSON.stringify(greetings[input.language.defaultLanguage]);
  return `---
import DefaultLayout from "@/layouts/DefaultLayout.astro";
---

<DefaultLayout title={${title}} description={${description}}>
  <h1>{${heading}}</h1>
</DefaultLayout>
`;
}

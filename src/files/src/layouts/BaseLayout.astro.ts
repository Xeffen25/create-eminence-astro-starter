import type { ProjectInput } from '../../../types.js';

export const path = 'src/layouts/BaseLayout.astro';

export function generate(input: ProjectInput): string {
  const imports = ["import '../styles/global.css';"];
  if (input.improvements.eminenceAstroSuite)
    imports.push("import { Head } from 'eminence-astro-suite/components';");
  if (input.language.paraglide)
    imports.push("import { getLocale } from '../paraglide/runtime.js';");
  const languageAttribute = input.language.paraglide
    ? '{getLocale()}'
    : JSON.stringify(input.language.defaultLanguage);
  return `---
${imports.join('\n')}
const { title = 'My Astro site' } = Astro.props;
---

<!doctype html>
<html lang=${languageAttribute}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    ${input.improvements.eminenceAstroSuite ? '<Head title={title} description="An Astro site." />' : '<title>{title}</title>'}
  </head>
  <body>
    <slot />
  </body>
</html>
`;
}

import type { ProjectInput } from '../../../../types.js';

export const path = 'src/layouts/BaseLayout.astro';

export function generate(input: ProjectInput): string {
  const imports = [
    'import "@/styles/global.css";',
    'import Fonts from "@/components/Fonts.astro";',
  ];
  if (input.improvements.eminenceAstroSuite)
    imports.unshift(
      'import { Head, type HeadProps } from "eminence-astro-suite/components";',
    );
  if (input.language.paraglide)
    imports.push('import { getLocale } from "@/paraglide/runtime";');
  const languageAttribute = input.language.paraglide
    ? '{getLocale()}'
    : JSON.stringify(input.language.defaultLanguage);
  const props = input.improvements.eminenceAstroSuite
    ? 'interface Props extends HeadProps {}'
    : `interface Props {
  title?: string;
  description?: string;
}
const { title, description } = Astro.props;`;
  const head = input.improvements.eminenceAstroSuite
    ? `<Head {...Astro.props}>
    <Fonts />
    <slot name="head" />
  </Head>`
    : `<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    {title && <title>{title}</title>}
    {description && <meta name="description" content={description} />}
    <Fonts />
    <slot name="head" />
  </head>`;
  return `---
// BaseLayout is the document shell loaded on absolutely every route.
${imports.join('\n')}

${props}
---

<!doctype html>
<html lang=${languageAttribute}>
  ${head}
  <body>
    <slot name="body-start" />
    <slot />
    <slot name="body-end" />
  </body>
</html>
`;
}

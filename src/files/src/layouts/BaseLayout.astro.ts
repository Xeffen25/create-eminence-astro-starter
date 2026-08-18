import type { ProjectInput } from '../../../types.js';

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
    imports.push(
      input.improvements.eminenceAstroSuite
        ? `import {
  baseLocale,
  deLocalizeHref,
  getLocale,
  locales,
  localizeHref,
} from "@/paraglide/runtime";`
        : 'import { getLocale } from "@/paraglide/runtime";',
    );
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
  const languageAlternates =
    input.improvements.eminenceAstroSuite && input.language.paraglide
      ? `

const basePath = deLocalizeHref(Astro.url.pathname);
const origin = Astro.site ?? Astro.url.origin;
const languageAlternates = Object.fromEntries([
  ...locales.map((locale) => [
    locale,
    new URL(localizeHref(basePath, { locale }), origin),
  ]),
  [
    "x-default",
    new URL(localizeHref(basePath, { locale: baseLocale }), origin),
  ],
]);`
      : '';
  const head = input.improvements.eminenceAstroSuite
    ? `<Head {...Astro.props}${input.language.paraglide ? ' languageAlternates={languageAlternates}' : ''}>
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

${props}${languageAlternates}
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

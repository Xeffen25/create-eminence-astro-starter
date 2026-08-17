import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { writeNewFile } from '../lib/files.js';
import { addDependencies, updatePackageJson } from '../lib/package-json.js';
import type { Adapter, LanguageSetup } from '../types.js';

const greetings = {
  es: 'Hola',
  en: 'Hello',
  fr: 'Bonjour',
  it: 'Ciao',
  ca: 'Hola',
  de: 'Hallo',
} as const;

function layout(language: LanguageSetup, withEminenceAstroSuite: boolean) {
  const imports = ["import '../styles/global.css';"];
  if (withEminenceAstroSuite)
    imports.push("import { Head } from 'eminence-astro-suite/components';");
  if (language.paraglide)
    imports.push("import { getLocale } from '../paraglide/runtime.js';");
  const languageAttribute = language.paraglide
    ? '{getLocale()}'
    : JSON.stringify(language.defaultLanguage);
  return `---
${imports.join('\n')}
const { title = 'My Astro site' } = Astro.props;
---

<!doctype html>
<html lang=${languageAttribute}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    ${withEminenceAstroSuite ? '<Head title={title} description="An Astro site." />' : '<title>{title}</title>'}
  </head>
  <body>
    <slot />
  </body>
</html>
`;
}

function page(language: LanguageSetup) {
  const message = language.paraglide
    ? "import { m } from '../paraglide/messages.js';"
    : `const greeting = ${JSON.stringify(greetings[language.defaultLanguage])};`;
  const greeting = language.paraglide ? 'm.home_greeting()' : 'greeting';
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

export async function addLanguage(
  directory: string,
  language: LanguageSetup,
  adapter: Adapter,
  withEminenceAstroSuite: boolean,
) {
  await mkdir(join(directory, 'src/layouts'), { recursive: true });
  await writeFile(
    join(directory, 'src/layouts/BaseLayout.astro'),
    layout(language, withEminenceAstroSuite),
    'utf8',
  );
  await writeFile(
    join(directory, 'src/pages/index.astro'),
    page(language),
    'utf8',
  );
  await writeNewFile(
    join(directory, 'src/styles/global.css'),
    'body {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n}\n\nmain {\n  margin: 0 auto;\n  max-width: 65ch;\n  padding: 4rem 1.5rem;\n}\n',
  );

  if (!language.paraglide) return;

  await updatePackageJson(directory, (pkg) =>
    addDependencies(pkg, { '@inlang/paraglide-js': 'latest' }),
  );
  await writeNewFile(
    join(directory, 'project.inlang/settings.json'),
    `${JSON.stringify(
      {
        $schema: 'https://inlang.com/schema/project-settings',
        baseLocale: language.defaultLanguage,
        locales: language.languages,
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
    )}\n`,
  );
  await Promise.all(
    language.languages.map((locale) =>
      writeNewFile(
        join(directory, `messages/${locale}.json`),
        `${JSON.stringify(
          {
            $schema: 'https://inlang.com/schema/inlang-message-format',
            home_greeting: greetings[locale],
          },
          null,
          2,
        )}\n`,
      ),
    ),
  );
  const middleware =
    adapter === 'cloudflare'
      ? `import { defineMiddleware } from 'astro:middleware';
import { paraglideMiddleware } from './paraglide/server.js';

export const onRequest = defineMiddleware((context, next) =>
  paraglideMiddleware(context.request, ({ request }) => next(request)),
);
`
      : `import { defineMiddleware } from 'astro:middleware';
import { assertIsLocale, baseLocale, setLocale } from './paraglide/runtime.js';

export const onRequest = defineMiddleware((context, next) => {
  setLocale(assertIsLocale(context.currentLocale ?? baseLocale));
  return next();
});
`;
  await writeNewFile(join(directory, 'src/middleware.ts'), middleware);
}

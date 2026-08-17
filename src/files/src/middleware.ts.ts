import type { ProjectInput } from '../../types.js';

export const path = 'src/middleware.ts';

export function generate(input: ProjectInput): string | undefined {
  if (!input.language.paraglide) return;
  return input.adapter === 'cloudflare'
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
}

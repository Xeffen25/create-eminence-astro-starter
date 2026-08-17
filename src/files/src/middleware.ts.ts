import type { ProjectInput } from '../../types.js';

export const path = 'src/middleware.ts';

export function generate(input: ProjectInput): string | undefined {
  if (!input.language.paraglide) return;
  return `import { defineMiddleware } from "astro:middleware";
import { paraglideMiddleware } from "@/paraglide/server";

export const onRequest = defineMiddleware(async (context, next) => {
  return paraglideMiddleware(context.request, ({ request }) => next(request));
});
`;
}

import type { ProjectInput } from '../types.js';

export const path = 'prettier.config.mjs';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.prettier) return;
  return "export default {\n  singleQuote: true,\n  trailingComma: 'all',\n  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],\n};\n";
}

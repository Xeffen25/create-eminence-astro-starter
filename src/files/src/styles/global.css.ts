import type { ProjectInput } from '../../../types.js';

export const path = 'src/styles/global.css';

export function generate(input: ProjectInput): string {
  const body = `body {
  margin: 0;
  font-family: system-ui, sans-serif;
}

main {
  margin: 0 auto;
  max-width: 65ch;
  padding: 4rem 1.5rem;
}
`;
  if (input.improvements.tailwind) return `@import 'tailwindcss';\n\n${body}`;
  return body;
}

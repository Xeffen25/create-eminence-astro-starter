import type { ProjectInput } from '../../../types.js';

export const path = 'src/styles/global.css';

export function generate(input: ProjectInput): string {
  if (input.improvements.tailwind)
    return `@import "tailwindcss";

@theme {
  --font-inter: var(--astro-font-inter);
  --font-sans: var(--font-inter);
}

@layer base {
  body {
    @apply font-sans;
  }
}
`;
  return `body {
  margin: 0;
  font-family: var(--astro-font-inter), system-ui, sans-serif;
}

main {
  margin: 0 auto;
  max-width: 65ch;
  padding: 4rem 1.5rem;
}
`;
}

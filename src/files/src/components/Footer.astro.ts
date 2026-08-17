import type { ProjectInput } from '../../../types.js';

export const path = 'src/components/Footer.astro';

export function generate(_input: ProjectInput): string {
  return `<footer id="footer"></footer>
`;
}

import type { ProjectInput } from '../../../types.js';

export const path = 'src/components/Header.astro';

export function generate(input: ProjectInput): string {
  if (!input.language.paraglide) return `<header id="header"></header>\n`;
  return `---
import LanguageSwitcher from "@/components/LanguageSwitcher.astro";
---

<header id="header">
  <LanguageSwitcher />
</header>
`;
}

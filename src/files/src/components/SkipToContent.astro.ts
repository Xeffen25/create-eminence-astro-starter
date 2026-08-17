import type { ProjectInput } from '../../../types.js';
import { skipToContent } from '../../../lib/languages.js';

export const path = 'src/components/SkipToContent.astro';

export function generate(input: ProjectInput): string {
  if (input.language.paraglide)
    return `---
import { m } from "@/paraglide/messages";
---

<a
  href="#main"
  class="btn absolute left-2 top-2 z-9999 translate-y-[-500%] pointer-events-none transition-all outline-offset-0 focus-visible:translate-y-0 focus-visible:pointer-events-auto"
>
  {m.layout_skip_to_content()}
</a>
`;
  return `<a
  href="#main"
  class="btn absolute left-2 top-2 z-9999 translate-y-[-500%] pointer-events-none transition-all outline-offset-0 focus-visible:translate-y-0 focus-visible:pointer-events-auto"
>
  ${skipToContent[input.language.defaultLanguage]}
</a>
`;
}

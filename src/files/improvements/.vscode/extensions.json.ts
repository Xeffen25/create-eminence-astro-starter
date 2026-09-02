import type { ProjectInput } from '../../../types.js';

export const path = '.vscode/extensions.json';

export function generate(input: ProjectInput): string {
  const recommendations = ['astro-build.astro-vscode'];
  if (input.improvements.prettier)
    recommendations.push('esbenp.prettier-vscode');
  if (input.improvements.vitest) recommendations.push('vitest.explorer');
  if (input.language.paraglide)
    recommendations.push('inlang.vs-code-extension');
  return `${JSON.stringify(
    {
      recommendations,
      unwantedRecommendations: [],
    },
    null,
    2,
  )}\n`;
}

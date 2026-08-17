import type { ProjectInput } from '../../types.js';

export const path = '.github/labels.json';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.githubLabels) return;
  return `${JSON.stringify(
    [
      {
        name: 'bug',
        color: 'd73a4a',
        description: 'Something is not working',
      },
      {
        name: 'enhancement',
        color: 'a2eeef',
        description: 'New feature or request',
      },
      {
        name: 'documentation',
        color: '0075ca',
        description: 'Documentation improvements',
      },
      {
        name: 'good first issue',
        color: '7057ff',
        description: 'Good for newcomers',
      },
      {
        name: 'priority: high',
        color: 'b60205',
        description: 'Needs prompt attention',
      },
    ],
    null,
    2,
  )}\n`;
}

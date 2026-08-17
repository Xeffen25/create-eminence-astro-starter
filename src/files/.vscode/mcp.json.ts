import type { ProjectInput } from '../../types.js';

export const path = '.vscode/mcp.json';

export function generate(_input: ProjectInput): string {
  return `${JSON.stringify(
    {
      servers: {
        'Astro docs': {
          url: 'https://mcp.docs.astro.build/mcp',
          type: 'http',
        },
      },
      inputs: [],
    },
    null,
    2,
  )}\n`;
}

import type { ProjectInput } from '../types.js';

export const path = '.gitignore';

export function generate(input: ProjectInput): string {
  const lines = [
    '# build output',
    'dist/',
    '# generated types',
    '.astro/',
    '',
    '# dependencies',
    'node_modules/',
    '',
    '# logs',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    'pnpm-debug.log*',
    '',
    '',
    '# environment variables',
    '.env',
    '.env.production',
    '',
    '# macOS-specific files',
    '.DS_Store',
    '',
    '# jetbrains setting folder',
    '.idea/',
  ];
  if (input.adapter === 'cloudflare')
    lines.push(
      '',
      '# wrangler files',
      '.wrangler/',
      '.dev.vars',
      '.dev.vars.*',
      '!.dev.vars.example',
    );
  if (input.improvements.resend) lines.push('.env.*', '!.env.example');
  return `${lines.join('\n')}\n`;
}

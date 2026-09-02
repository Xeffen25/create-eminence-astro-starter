import type { ProjectInput } from '../../types.js';

export const path = '.env.example';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.resend) return;
  return 'RESEND_API_KEY=re_your_api_key\n';
}

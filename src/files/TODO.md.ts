import { isDefaultSite } from '../lib/site.js';
import type { ProjectInput } from '../types.js';

export const path = 'TODO.md';

export function generate(input: ProjectInput): string {
  const lines = [
    '# Post-setup checklist',
    '',
    '- [ ] Update the site name, title, description, and social metadata.',
    '- [ ] Create `LICENSE.md`.',
    '- [ ] Create `.github/SECURITY.md`.',
    '- [ ] Edit `CONTRIBUTING.md` to match this project.',
    '- [ ] Create a GitHub repository, add it as `origin`, and push the two setup commits.',
    '- [ ] Configure the selected deployment provider and production domain.',
  ];
  if (input.improvements.sitemap && isDefaultSite(input.site))
    lines.push(
      '- [ ] Replace `site` in `astro.config.mjs` with the production URL so the sitemap emits absolute URLs.',
    );
  if (input.improvements.resend)
    lines.push(
      '- [ ] Create a Resend API key at https://resend.com/api-keys.',
      '- [ ] Copy `.env.example` to `.env` and set `RESEND_API_KEY`. Never commit this value.',
      '- [ ] Verify a sending domain in Resend and choose the sender address for your application.',
      '- [ ] For Cloudflare Workers, run `wrangler secret put RESEND_API_KEY` before deploying.',
    );
  return `${lines.join('\n')}\n`;
}

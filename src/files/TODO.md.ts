import type { ProjectInput } from '../types.js';

export const path = 'TODO.md';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.resend) return;
  return `# Post-setup checklist

- [ ] Update the site name, title, description, and social metadata.
- [ ] Add a site icon and enable Eminence Astro Suite's icon, manifest, robots, sitemap, and security.txt outputs when the production domain and security contact are known.
- [ ] Create a GitHub repository, add it as \`origin\`, and push the two setup commits.
- [ ] Configure the selected deployment provider and production domain.
- [ ] Create a Resend API key at https://resend.com/api-keys.
- [ ] Copy \`.env.example\` to \`.env\` and set \`RESEND_API_KEY\`. Never commit this value.
- [ ] Verify a sending domain in Resend and choose the sender address for your application.
- [ ] For Cloudflare Workers, run \`wrangler secret put RESEND_API_KEY\` before deploying.
`;
}

import { join } from 'node:path';
import { appendUniqueLines, writeNewFile } from '../lib/files.js';
import { addDependencies, updatePackageJson } from '../lib/package-json.js';

export async function addResend(directory: string) {
  await updatePackageJson(directory, (pkg) =>
    addDependencies(pkg, { resend: 'latest' }, false),
  );
  await writeNewFile(
    join(directory, '.env.example'),
    'RESEND_API_KEY=re_your_api_key\n',
  );
  await appendUniqueLines(join(directory, '.gitignore'), [
    '.env',
    '.env.*',
    '!.env.example',
  ]);
  await writeNewFile(
    join(directory, 'TODO.md'),
    `# Post-setup checklist

- [ ] Update the site name, title, description, and social metadata.
- [ ] Add a site icon and enable Eminence Astro Suite's icon, manifest, robots, sitemap, and security.txt outputs when the production domain and security contact are known.
- [ ] Create a GitHub repository, add it as \`origin\`, and push the two setup commits.
- [ ] Configure the selected deployment provider and production domain.
- [ ] Create a Resend API key at https://resend.com/api-keys.
- [ ] Copy \`.env.example\` to \`.env\` and set \`RESEND_API_KEY\`. Never commit this value.
- [ ] Verify a sending domain in Resend and choose the sender address for your application.
- [ ] For Cloudflare Workers, run \`wrangler secret put RESEND_API_KEY\` before deploying.
`,
  );
}

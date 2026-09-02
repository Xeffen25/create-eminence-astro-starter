import { runScript } from '../../../package-manager.js';
import type { ProjectInput } from '../../../types.js';

export const path = '.github/PULL_REQUEST_TEMPLATE.md';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.issueTemplates) return;
  const preview = '- **Staging Preview:** [Insert Cloudflare URL here]\n';
  return `## ✅ Submission Checklist

- [ ] **Branch Name:** Follows \`issue-number-type/description\`.
- [ ] **Commitment:** I understand this PR will be **squashed** into a single commit.
- [ ] **Quality:** \`${runScript(input.packageManager, 'github:ci')}\` passes locally with no Astro/Typescript errors.

---

## 📝 Commit Details

### 🔗 Reference

- **Issue:** Closes # [Insert Issue Number]
${preview}
### 📖 Description

### 🖼️ Visuals (Screenshots/Videos)
`;
}

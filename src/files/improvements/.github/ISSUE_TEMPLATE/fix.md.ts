import { astroCommand } from '../../../../package-manager.js';
import type { ProjectInput } from '../../../../types.js';

export const path = '.github/ISSUE_TEMPLATE/fix.md';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.issueTemplates) return;
  const areas = [
    '- [ ] **Astro/Logic** (Functional bug)',
    '- [ ] **UI/CSS** (Visual bug)',
    '- [ ] **Cloudflare** (Deployment or Runtime error)',
    '- [ ] **Security** (Vulnerability)',
  ];
  return `---
name: "🐛 Bug Report (fix)"
about: Report a bug or performance issue
title: "fix: "
labels: ["fix"]
---

## 🚨 Impact Level

- [ ] **Critical** (Site is down or a major feature is broken)
- [ ] **Standard** (Feature works but has bugs)
- [ ] **Minor** (Visual glitch, typo, or small annoyance)

## 🔍 Area of Failure

_Select the area that needs fixing:_

${areas.join('\n')}

> **Note:** Please apply the corresponding labels (\`critical\`, \`ui\`, \`security\`, etc.) in the sidebar.

---

## 🌐 Browser(s) Affected

- [ ] **All Browsers**
- [ ] **Chrome/Chromium**
- [ ] **Firefox**
- [ ] **Safari**
- [ ] **Edge**
- [ ] **Mobile (iOS)**
- [ ] **Mobile (Android)**

## 🛠 Steps to Reproduce

1. Go to '...'
2. Perform '...'
3. See error '...'

## 📸 Evidence

(Add screenshots or code snippets of the error here)

## 🔧 Astro Info

Please provide the output of \`astro info\`:

\`\`\`
(Run \`${astroCommand(input.packageManager, 'info')}\` and paste the output here)
\`\`\`
`;
}

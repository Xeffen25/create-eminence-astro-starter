import type { ProjectInput } from '../../../../types.js';

export const path = '.github/ISSUE_TEMPLATE/docs.md';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.issueTemplates) return;
  return `---
name: "📚 Documentation (docs)"
about: Changes to README, Wiki, or code comments
title: "docs: "
labels: ["docs"]
assignees: ""
---

## 📄 Document(s) to Update

- [ ] README.md
- [ ] Wiki Page: [Name]
- [ ] Inline Code Comments

## ✍️ Description of Changes

What is missing or incorrect in the current documentation?
`;
}

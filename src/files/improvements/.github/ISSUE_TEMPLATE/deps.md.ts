import { usesHusky } from '../../package.json.js';
import type { ProjectInput } from '../../../../types.js';

export const path = '.github/ISSUE_TEMPLATE/deps.md';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.issueTemplates) return;
  const examples = ['- `astro`: `4.0.0` → `4.1.0` - Performance improvements'];
  if (input.improvements.prettier)
    examples.push(
      '- `prettier`: `3.0.0` → `3.1.0` - Bug fixes and new formatting options',
    );
  if (usesHusky(input) && input.improvements.prettier)
    examples.push('- `lint-staged`: `15.0.0` → `15.1.0` - Features');
  return `---
name: "📦 Dependency (deps)"
about: Update npm packages or external libraries
title: "deps: "
labels: ["deps"]
assignees: ""
---

## 🆙 Package(s) to Update

List the packages with current and target versions, and the reason for the update.

### Example:

${examples.join('\n')}

## ⚠️ Breaking Changes?

Does this update require changes to \`astro.config.mjs\` or other files?
`;
}

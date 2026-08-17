import { usesHusky } from '../../package.json.js';
import type { ProjectInput } from '../../../types.js';

export const path = '.github/ISSUE_TEMPLATE/test.md';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.issueTemplates) return;
  const tooling: string[] = [];
  if (input.improvements.vitest) tooling.push('- [ ] Playwright / Vitest');
  if (usesHusky(input)) tooling.push('- [ ] Husky/Lint-staged hook check');
  const toolingSection = tooling.length
    ? `
## 🛠 Tooling

${tooling.join('\n')}
`
    : '';
  return `---
name: "🧪 Testing (test)"
about: Adding or correcting tests
title: "test: "
labels: ["test"]
assignees: ""
---

## 🎯 Test Coverage

What component or logic is currently missing test coverage?
${toolingSection}`;
}

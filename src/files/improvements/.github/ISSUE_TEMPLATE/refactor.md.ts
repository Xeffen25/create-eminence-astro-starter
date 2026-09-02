import type { ProjectInput } from '../../../../types.js';

export const path = '.github/ISSUE_TEMPLATE/refactor.md';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.issueTemplates) return;
  return `---
name: "♻️ Refactor (refactor)"
about: Code cleanup or logic improvements (no behavior change)
title: "refactor: "
labels: ["refactor"]
assignees: ""
---

## 🧹 What needs being cleaned up?

Describe the current "mess" or technical debt.

## 🛠 Proposed Logic

How will this improve the Astro component structure or TypeScript types without changing the site's behavior?
`;
}

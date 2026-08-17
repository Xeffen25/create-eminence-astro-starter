import type { ProjectInput } from '../../../types.js';

export const path = '.github/ISSUE_TEMPLATE/revert.md';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.issueTemplates) return;
  return `---
name: "⏪ Revert (revert)"
about: Undo a previous commit/PR
title: "revert: "
labels: ["revert"]
assignees: ""
---

## 🚫 Commit to Revert

Original Commit SHA:

## ❓ Reason
`;
}

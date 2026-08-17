import type { ProjectInput } from '../../../types.js';

export const path = '.github/ISSUE_TEMPLATE/feature-request.yml';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.issueTemplates) return;
  return `name: Feature request
description: Suggest an improvement.
title: '[Feature]: '
labels: [enhancement]
body:
  - type: markdown
    attributes:
      value: Thank you for sharing an idea.
  - type: textarea
    id: problem
    attributes:
      label: What problem would this solve?
    validations:
      required: true
  - type: textarea
    id: proposal
    attributes:
      label: What would you like to happen?
    validations:
      required: true
`;
}

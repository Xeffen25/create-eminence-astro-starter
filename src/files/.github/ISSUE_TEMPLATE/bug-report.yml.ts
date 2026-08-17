import type { ProjectInput } from '../../../types.js';

export const path = '.github/ISSUE_TEMPLATE/bug-report.yml';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.issueTemplates) return;
  return `name: Bug report
description: Tell us about something that is not working.
title: '[Bug]: '
labels: [bug]
body:
  - type: markdown
    attributes:
      value: Thank you for taking the time to report a bug.
  - type: textarea
    id: description
    attributes:
      label: What happened?
      description: Include the expected and actual behaviour.
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: How can we reproduce it?
    validations:
      required: true
`;
}

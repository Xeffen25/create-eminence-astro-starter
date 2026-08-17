import { join } from 'node:path';
import { writeNewFile } from '../lib/files.js';

export async function addIssueTemplates(directory: string) {
  await Promise.all([
    writeNewFile(
      join(directory, '.github/ISSUE_TEMPLATE/config.yml'),
      `blank_issues_enabled: false
contact_links:
  - name: Questions and discussions
    url: https://github.com/OWNER/REPOSITORY/discussions
    about: Ask questions or start a discussion.
`,
    ),
    writeNewFile(
      join(directory, '.github/ISSUE_TEMPLATE/bug-report.yml'),
      `name: Bug report
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
`,
    ),
    writeNewFile(
      join(directory, '.github/ISSUE_TEMPLATE/feature-request.yml'),
      `name: Feature request
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
`,
    ),
  ]);
}

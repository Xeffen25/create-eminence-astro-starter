import type { ProjectInput } from '../../../types.js';

export const path = '.github/ISSUE_TEMPLATE/config.yml';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.issueTemplates) return;
  return `blank_issues_enabled: false
contact_links:
  - name: Questions and discussions
    url: https://github.com/OWNER/REPOSITORY/discussions
    about: Ask questions or start a discussion.
`;
}

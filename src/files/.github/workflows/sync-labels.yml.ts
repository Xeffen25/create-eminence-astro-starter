import type { ProjectInput } from '../../../types.js';

export const path = '.github/workflows/sync-labels.yml';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.githubLabels) return;
  return `name: Sync labels

on:
  workflow_dispatch:
  push:
    branches: [main]
    paths: ['.github/labels.json']

permissions:
  issues: write

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/github-script@v9
        with:
          script: |
            const labels = require('./.github/labels.json');
            const { owner, repo } = context.repo;
            const existing = await github.paginate(github.rest.issues.listLabelsForRepo, { owner, repo });
            const byName = new Map(existing.map((label) => [label.name, label]));
            for (const label of labels) {
              const current = byName.get(label.name);
              if (current) await github.rest.issues.updateLabel({ owner, repo, name: current.name, ...label });
              else await github.rest.issues.createLabel({ owner, repo, ...label });
            }
`;
}

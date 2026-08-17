import { join } from 'node:path';
import { writeNewFile } from '../lib/files.js';

export async function addGitHubLabels(directory: string) {
  await writeNewFile(
    join(directory, '.github/labels.json'),
    `${JSON.stringify(
      [
        {
          name: 'bug',
          color: 'd73a4a',
          description: 'Something is not working',
        },
        {
          name: 'enhancement',
          color: 'a2eeef',
          description: 'New feature or request',
        },
        {
          name: 'documentation',
          color: '0075ca',
          description: 'Documentation improvements',
        },
        {
          name: 'good first issue',
          color: '7057ff',
          description: 'Good for newcomers',
        },
        {
          name: 'priority: high',
          color: 'b60205',
          description: 'Needs prompt attention',
        },
      ],
      null,
      2,
    )}\n`,
  );
  await writeNewFile(
    join(directory, '.github/workflows/sync-labels.yml'),
    `name: Sync labels

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
`,
  );
}

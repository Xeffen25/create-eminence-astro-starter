import type { ProjectInput } from '../../../../types.js';

export const path = '.github/workflows/labels-sync.yml';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.githubLabels) return;
  return `name: Sync labels

on:
  workflow_dispatch:
  push:
    paths:
      - .github/labels.json
      - .github/workflows/labels-sync.yml

permissions:
  issues: write
  contents: read

jobs:
  labels:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          sparse-checkout: .github/labels.json

      - uses: EndBug/label-sync@v2
        with:
          config-file: .github/labels.json
          token: \${{ secrets.GITHUB_TOKEN }}
          delete-other-labels: true
`;
}

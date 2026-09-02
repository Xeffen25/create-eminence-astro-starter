import type { ProjectInput } from '../../../../types.js';

export const path = '.github/ISSUE_TEMPLATE/feat.md';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.issueTemplates) return;
  const scope = [
    '- [ ] **UI/Design** (Styling, Components, UX)',
    '- [ ] **Astro** (New routes, Components, Content Collections)',
    '- [ ] **Cloudflare** (Workers, KV, Pages Config)',
  ];
  if (input.improvements.eminenceAstroSuite || input.improvements.sitemap)
    scope.push('- [ ] **SEO/Lighthouse** (Meta tags, Performance, Web Vitals)');
  scope.push('- [ ] **Accessibility** (A11y improvements)');
  return `---
name: "🚀 Feature Request (feat)"
about: Suggest a new idea or improvement
title: "feat: "
labels: ["feat"]
---

## 🏗️ Scope of Feature

_Select all that apply to help us categorize this:_

${scope.join('\n')}

> **Note:** Please apply the corresponding labels (\`ui\`, \`astro\`, \`seo\`, etc.) in the sidebar.

---

## 🎯 Goal / Problem / Request

What problem are we solving? Who is this for?

## 💡 Proposed Solution

Describe the expected behavior or visual change.

## ✅ Implementation Checklist

- [ ] Requirement X
`;
}

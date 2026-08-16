import * as p from '@clack/prompts';
import type { Answers, Improvements, PackageManager } from './types.js';

export const defaultImprovements: Improvements = {
  tailwind: true,
  prettier: true,
  githubLabels: true,
};

function cancelled(value: unknown): value is symbol {
  return p.isCancel(value);
}

export async function collectAnswers(options: {
  name?: string;
  yes?: boolean;
  manager?: PackageManager;
}): Promise<Answers | undefined> {
  const packageManager =
    options.manager ??
    (options.yes
      ? 'pnpm'
      : ((await p.select({
          message: 'Which package manager should be used?',
          options: ['pnpm', 'npm', 'yarn', 'bun'].map((value) => ({
            value,
            label: value,
          })),
        })) as PackageManager));
  if (cancelled(packageManager)) return undefined;
  const projectName =
    options.name ??
    (options.yes
      ? 'eminence-astro-site'
      : await p.text({
          message: 'Project name:',
          placeholder: 'my-astro-site',
          validate: (value) =>
            value.trim() ? undefined : 'Project name is required.',
        }));
  if (cancelled(projectName)) return undefined;
  const selected = options.yes
    ? Object.keys(defaultImprovements)
    : await p.multiselect({
        message: 'Choose improvements:',
        options: [
          { value: 'tailwind', label: 'Tailwind CSS' },
          { value: 'prettier', label: 'Prettier' },
          { value: 'githubLabels', label: 'GitHub label sync' },
        ],
        initialValues: Object.keys(defaultImprovements),
      });
  if (cancelled(selected)) return undefined;
  const git = options.yes
    ? true
    : await p.confirm({
        message: 'Initialise a Git repository?',
        initialValue: true,
      });
  if (cancelled(git)) return undefined;
  const install = options.yes
    ? true
    : await p.confirm({ message: 'Install dependencies?', initialValue: true });
  if (cancelled(install)) return undefined;
  const picks = new Set(selected as string[]);
  return {
    projectName: String(projectName).trim(),
    improvements: {
      tailwind: picks.has('tailwind'),
      prettier: picks.has('prettier'),
      githubLabels: picks.has('githubLabels'),
    },
    git: Boolean(git),
    install: Boolean(install),
    packageManager,
  };
}

import * as p from '@clack/prompts';
import type {
  Adapter,
  Answers,
  Improvements,
  PackageManager,
} from './types.js';

export const defaultImprovements: Improvements = {
  tailwind: true,
  prettier: true,
  githubLabels: true,
};
export const defaultProjectName = 'my-site-name';

export function projectNameOrDefault(value: unknown): string {
  return typeof value === 'string' && value.trim()
    ? value.trim()
    : defaultProjectName;
}

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
      ? defaultProjectName
      : await p.text({
          message: 'Project name:',
          placeholder: defaultProjectName,
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
  const adapter = options.yes
    ? 'cloudflare'
    : ((await p.select({
        message: 'Which deployment adapter should be configured?',
        options: [
          { value: 'none', label: 'None', hint: 'Static Astro site' },
          {
            value: 'cloudflare',
            label: 'Cloudflare Workers',
            hint: 'Server-rendered Astro site',
          },
        ],
        initialValue: 'cloudflare',
      })) as Adapter);
  if (cancelled(adapter)) return undefined;
  const git = options.yes
    ? true
    : await p.confirm({
        message: 'Initialise a Git repository?',
        initialValue: true,
      });
  if (cancelled(git)) return undefined;
  const picks = new Set(selected as string[]);
  return {
    projectName: projectNameOrDefault(projectName),
    improvements: {
      tailwind: picks.has('tailwind'),
      prettier: picks.has('prettier'),
      githubLabels: picks.has('githubLabels'),
    },
    adapter,
    git: Boolean(git),
    packageManager,
  };
}

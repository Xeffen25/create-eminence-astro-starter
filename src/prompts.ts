import * as p from '@clack/prompts';
import {
  defaultSite,
  isDefaultSite,
  siteError,
  siteOrDefault,
} from './lib/site.js';
import type {
  Answers,
  Framework,
  Improvements,
  Language,
  PackageManager,
} from './types.js';

export {
  defaultSite,
  isDefaultSite,
  siteError,
  siteOrDefault,
} from './lib/site.js';

export const defaultImprovements: Improvements = {
  tailwind: true,
  prettier: true,
  githubLabels: true,
  issueTemplates: true,
  vitest: true,
  eminenceAstroSuite: true,
  sitemap: true,
  resend: true,
};
export const defaultProjectName = 'my-site-name';
export const languageOptions: Array<{ value: Language; label: string }> = [
  { value: 'es', label: 'Spanish' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'it', label: 'Italian' },
  { value: 'ca', label: 'Catalan' },
  { value: 'de', label: 'German' },
];

export const defaultLanguageSetup = {
  paraglide: true,
  languages: ['en', 'es'] as Language[],
  defaultLanguage: 'en' as Language,
};

export const kebabCaseNameError = 'Use kebab-case like my-site.';

export function toKebabCaseName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isKebabCaseName(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function projectNameOrDefault(value: unknown): string {
  return typeof value === 'string' && value.trim()
    ? value.trim()
    : defaultProjectName;
}

export function projectNameError(
  value: string | undefined,
): string | undefined {
  if (!value?.trim()) return undefined;
  if (!isKebabCaseName(toKebabCaseName(value))) return kebabCaseNameError;
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
          defaultValue: defaultProjectName,
          validate: projectNameError,
        }));
  if (cancelled(projectName)) return undefined;
  const selected = options.yes
    ? Object.keys(defaultImprovements)
    : await p.multiselect({
        message: 'Choose improvements:',
        options: [
          { value: 'tailwind', label: 'Tailwind CSS' },
          { value: 'prettier', label: 'Prettier' },
          {
            value: 'eminenceAstroSuite',
            label: 'Eminence Astro Suite',
            hint: 'SEO and metadata defaults',
          },
          {
            value: 'sitemap',
            label: 'Sitemap',
            hint: 'XML sitemap via @astrojs/sitemap',
          },
          {
            value: 'vitest',
            label: 'Vitest',
            hint: 'Starter test and scripts',
          },
          {
            value: 'resend',
            label: 'Resend',
            hint: 'Email dependency and setup guide',
          },
          { value: 'githubLabels', label: 'GitHub label sync' },
          { value: 'issueTemplates', label: 'GitHub issue templates' },
        ],
        initialValues: Object.keys(defaultImprovements),
      });
  if (cancelled(selected)) return undefined;
  const site = options.yes
    ? defaultSite
    : await p.text({
        message: 'Production site URL:',
        placeholder: defaultSite,
        defaultValue: defaultSite,
        validate: siteError,
      });
  if (cancelled(site)) return undefined;
  const siteUrl = siteOrDefault(site);
  let workersDev = isDefaultSite(siteUrl);
  if (!isDefaultSite(siteUrl) && !options.yes) {
    const workersDevAnswer = await p.confirm({
      message: 'Enable the workers.dev subdomain?',
      initialValue: false,
    });
    if (cancelled(workersDevAnswer)) return undefined;
    workersDev = Boolean(workersDevAnswer);
  }
  const frameworks = options.yes
    ? ['svelte']
    : await p.multiselect({
        message: 'Choose frontend frameworks:',
        options: [
          { value: 'svelte', label: 'Svelte', hint: 'Interactive islands' },
          { value: 'react', label: 'React', hint: 'Interactive islands' },
        ],
        initialValues: ['svelte'],
        required: false,
      });
  if (cancelled(frameworks)) return undefined;
  p.log.step('Language');
  const paraglide = options.yes
    ? true
    : await p.confirm({
        message: 'Add Paraglide for multilingual setup?',
        initialValue: true,
      });
  if (cancelled(paraglide)) return undefined;

  let languages: Language[];
  if (paraglide) {
    do {
      const selectedLanguages = options.yes
        ? defaultLanguageSetup.languages
        : await p.multiselect({
            message: 'Which languages should be included?',
            options: languageOptions,
            initialValues: defaultLanguageSetup.languages,
            required: true,
          });
      if (cancelled(selectedLanguages)) return undefined;
      languages = selectedLanguages as Language[];
      if (languages.length < 2)
        p.log.warn('Paraglide needs at least two languages.');
    } while (languages.length < 2);
  } else {
    const selectedLanguage = options.yes
      ? defaultLanguageSetup.defaultLanguage
      : await p.select({
          message: 'Which language should the site use?',
          options: languageOptions,
          initialValue: defaultLanguageSetup.defaultLanguage,
        });
    if (cancelled(selectedLanguage)) return undefined;
    languages = [selectedLanguage as Language];
  }
  const defaultLanguage = options.yes
    ? defaultLanguageSetup.defaultLanguage
    : await p.select({
        message: 'Which language should be the default?',
        options: languageOptions.filter((option) =>
          languages.includes(option.value),
        ),
        initialValue: languages.includes(defaultLanguageSetup.defaultLanguage)
          ? defaultLanguageSetup.defaultLanguage
          : languages[0],
      });
  if (cancelled(defaultLanguage)) return undefined;
  const git = options.yes
    ? true
    : await p.confirm({
        message: 'Initialise a Git repository?',
        initialValue: true,
      });
  if (cancelled(git)) return undefined;
  const picks = new Set(selected as string[]);
  return {
    projectName: options.name
      ? projectNameOrDefault(projectName)
      : toKebabCaseName(projectNameOrDefault(projectName)),
    improvements: {
      tailwind: picks.has('tailwind'),
      prettier: picks.has('prettier'),
      githubLabels: picks.has('githubLabels'),
      issueTemplates: picks.has('issueTemplates'),
      vitest: picks.has('vitest'),
      eminenceAstroSuite: picks.has('eminenceAstroSuite'),
      sitemap: picks.has('sitemap'),
      resend: picks.has('resend'),
    },
    frameworks: frameworks as Framework[],
    language: {
      paraglide: Boolean(paraglide),
      languages,
      defaultLanguage: defaultLanguage as Language,
    },
    git: Boolean(git),
    packageManager,
    site: siteUrl,
    workersDev,
  };
}

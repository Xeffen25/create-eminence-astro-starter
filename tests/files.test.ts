import { describe, expect, it } from 'vitest';
import { generate as generateGitignore } from '../src/files/.gitignore.js';
import { generate as generatePackageJson } from '../src/files/package.json.js';
import { generate as generateCss } from '../src/files/src/styles/global.css.js';
import { generate as generateWrangler } from '../src/files/wrangler.jsonc.js';
import type { PackageJson } from '../src/lib/package-json.js';
import type {
  Answers,
  Improvements,
  LanguageSetup,
  ProjectInput,
} from '../src/types.js';

const answers: Answers = {
  projectName: 'my-site',
  packageManager: 'pnpm',
  improvements: {
    tailwind: false,
    prettier: false,
    githubLabels: false,
    issueTemplates: false,
    vitest: false,
    eminenceAstroSuite: false,
    resend: false,
  },
  adapter: 'cloudflare',
  frameworks: [],
  language: {
    paraglide: false,
    languages: ['en'],
    defaultLanguage: 'en',
  },
  git: false,
};

function input(
  overrides: Omit<Partial<ProjectInput>, 'improvements' | 'language'> & {
    improvements?: Partial<Improvements>;
    language?: Partial<LanguageSetup>;
  } = {},
): ProjectInput {
  const { improvements, language, ...rest } = overrides;
  return {
    ...answers,
    ...rest,
    improvements: { ...answers.improvements, ...improvements },
    language: { ...answers.language, ...language },
    compatibilityDate: overrides.compatibilityDate ?? '2020-01-01',
  };
}

describe('file generators', () => {
  it('composes package.json deps and scripts from selected flags', () => {
    const pkg = JSON.parse(
      generatePackageJson(
        input({
          adapter: 'cloudflare',
          frameworks: ['react'],
          git: true,
          improvements: {
            tailwind: true,
            prettier: true,
            vitest: true,
            eminenceAstroSuite: true,
            resend: true,
          },
        }),
      ),
    ) as PackageJson;
    expect(pkg.dependencies).toMatchObject({
      astro: 'latest',
      'eminence-astro-suite': 'latest',
      resend: 'latest',
    });
    expect(pkg.devDependencies).toMatchObject({
      '@astrojs/cloudflare': 'latest',
      wrangler: 'latest',
      '@astrojs/react': 'latest',
      tailwindcss: 'latest',
      prettier: 'latest',
      vitest: 'latest',
      husky: 'latest',
    });
    expect(pkg.scripts).toMatchObject({
      preview: 'wrangler dev',
      format: 'prettier --write .',
      test: 'vitest run',
      prepare: 'husky',
    });
    const staticPkg = JSON.parse(
      generatePackageJson(input({ adapter: 'none' })),
    ) as PackageJson;
    expect(staticPkg.devDependencies?.wrangler).toBeUndefined();
    expect(staticPkg.scripts?.preview).toBe('astro preview');
    expect(staticPkg.scripts?.prepare).toBeUndefined();
  });
  it('adds gitignore lines only for selected features', () => {
    const cloudflare = generateGitignore(input());
    expect(cloudflare).toContain('.wrangler/');
    expect(cloudflare).not.toContain('!.env.example');
    const resend = generateGitignore(
      input({ adapter: 'none', improvements: { resend: true } }),
    );
    expect(resend).not.toContain('.wrangler/');
    expect(resend).toContain('!.env.example');
    const plain = generateGitignore(input({ adapter: 'none' }));
    expect(plain).not.toContain('.wrangler/');
    expect(plain).not.toContain('!.env.example');
    expect(plain).toContain('.idea/');
  });
  it('skips wrangler.jsonc when the adapter is none', () => {
    expect(generateWrangler(input({ adapter: 'none' }))).toBeUndefined();
    expect(generateWrangler(input())).toContain(
      '"compatibility_date": "2020-01-01"',
    );
  });
  it('adds the Tailwind import only when Tailwind is selected', () => {
    expect(generateCss(input())).not.toContain("@import 'tailwindcss'");
    expect(generateCss(input({ improvements: { tailwind: true } }))).toMatch(
      /^@import 'tailwindcss';/,
    );
  });
});

import { describe, expect, it } from 'vitest';
import {
  generate as generatePackageJson,
  packagesToAdd,
} from '../src/files/package.json.js';
import { generate as generatePrettierRc } from '../src/files/prettierrc.js';
import { generate as generateSvelteConfig } from '../src/files/svelte.config.js';
import { generate as generateEnvDts } from '../src/files/src/env.d.ts.js';
import { generate as generateCss } from '../src/files/src/styles/global.css.js';
import { generate as generateWrangler } from '../src/files/wrangler.jsonc.js';
import { generate as generateTodo } from '../src/files/TODO.md.js';
import { generate as generateHusky } from '../src/files/.husky/pre-commit.js';
import { generate as generateAstroConfig } from '../src/files/astro.config.mjs.js';
import { generate as generateMiddleware } from '../src/files/src/middleware.ts.js';
import { generate as generatePrettierIgnore } from '../src/files/.prettierignore.js';
import { generate as generateHeader } from '../src/files/src/components/Header.astro.js';
import { generate as generateLanguageSwitcher } from '../src/files/src/components/LanguageSwitcher.astro.js';
import { generate as generateSkipToContent } from '../src/files/src/components/SkipToContent.astro.js';
import { generate as generateBaseLayout } from '../src/files/src/layouts/BaseLayout.astro.js';
import { generate as generateDefaultLayout } from '../src/files/src/layouts/DefaultLayout.astro.js';
import { generate as generateIndex } from '../src/files/src/pages/index.astro.js';
import { generate as generateVscodeExtensions } from '../src/files/.vscode/extensions.json.js';
import { generate as generateVscodeMcp } from '../src/files/.vscode/mcp.json.js';
import { generate as generateVscodeSettings } from '../src/files/.vscode/settings.json.js';
import { generate as generateCi } from '../src/files/.github/workflows/ci.yml.js';
import { generate as generateLabelsSync } from '../src/files/.github/workflows/labels-sync.yml.js';
import { generate as generateLabels } from '../src/files/.github/labels.json.js';
import { generate as generateFeat } from '../src/files/.github/ISSUE_TEMPLATE/feat.md.js';
import { generate as generateSupport } from '../src/files/.github/SUPPORT.md.js';
import { generate as generatePullRequest } from '../src/files/.github/PULL_REQUEST_TEMPLATE.md.js';
import { installCommands, verifyScripts } from '../src/lib/verify.js';
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
    sitemap: false,
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
  site: 'https://example.com',
  workersDev: false,
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
  it('composes package.json scripts and packages from selected flags', () => {
    const full = input({
      adapter: 'cloudflare',
      frameworks: ['react'],
      git: true,
      improvements: {
        tailwind: true,
        prettier: true,
        vitest: true,
        eminenceAstroSuite: true,
        sitemap: true,
        resend: true,
      },
    });
    const pkg = JSON.parse(generatePackageJson(full)) as PackageJson;
    expect(pkg.dependencies).toBeUndefined();
    expect(pkg.devDependencies).toBeUndefined();
    expect(pkg['lint-staged']).toEqual({ '*': 'prettier --write' });
    expect(pkg.scripts).toMatchObject({
      preview: 'astro build && astro preview',
      'generate-types': 'wrangler types',
      deploy: 'astro build && wrangler deploy',
      format: 'prettier . --write',
      'format:check': 'prettier . --check',
      test: 'vitest run',
      'test:watch': 'vitest watch',
      'github:ci': 'pnpm format:check && astro check && pnpm test',
      all: 'pnpm format && pnpm generate-types && astro check && pnpm test && pnpm build',
    });
    expect(pkg.scripts?.prepare).toBeUndefined();
    expect(pkg.version).toBe('1.0.0');
    expect(packagesToAdd(full)).toEqual({
      dependencies: [
        'eminence-astro-suite',
        'resend',
        '@astrojs/cloudflare',
        '@astrojs/react',
        'react',
        'react-dom',
        '@tailwindcss/vite',
        'tailwindcss',
        '@astrojs/sitemap',
      ],
      devDependencies: [
        '@astrojs/check',
        'typescript',
        '@types/node',
        'schema-dts',
        'wrangler',
        'prettier',
        'prettier-plugin-astro',
        'prettier-plugin-organize-imports',
        'vitest',
        'husky',
        'lint-staged',
      ],
    });
    const staticPkg = JSON.parse(
      generatePackageJson(input({ adapter: 'none' })),
    ) as PackageJson;
    expect(packagesToAdd(input({ adapter: 'none' })).dependencies).toEqual([]);
    expect(packagesToAdd(input({ adapter: 'none' })).devDependencies).toEqual([
      '@astrojs/check',
      'typescript',
      '@types/node',
    ]);
    expect(staticPkg.scripts?.preview).toBe('astro build && astro preview');
    expect(staticPkg.scripts?.['generate-types']).toBeUndefined();
    expect(staticPkg.scripts?.prepare).toBeUndefined();
    expect(staticPkg.scripts?.all).toBe('astro check && pnpm build');
    const svelte = input({
      adapter: 'none',
      frameworks: ['svelte'],
      improvements: { prettier: true },
    });
    expect(packagesToAdd(svelte).dependencies).toEqual([
      '@astrojs/svelte',
      'svelte',
    ]);
    expect(packagesToAdd(svelte).devDependencies).toContain(
      'prettier-plugin-svelte',
    );
    expect(packagesToAdd(svelte).devDependencies).not.toContain('husky');
    expect(
      packagesToAdd(input({ language: { paraglide: true } })).devDependencies,
    ).toEqual(expect.arrayContaining(['@inlang/paraglide-js', '@inlang/cli']));
  });
  it('installs selected packages with add commands instead of latest', () => {
    const commands = installCommands(
      'pnpm',
      input({
        git: true,
        frameworks: ['svelte'],
        improvements: { prettier: true, vitest: true },
      }),
    );
    expect(commands).toEqual([
      [
        'add',
        '--ignore-workspace',
        '@astrojs/cloudflare',
        '@astrojs/svelte',
        'svelte',
      ],
      [
        'add',
        '-D',
        '--ignore-workspace',
        '@astrojs/check',
        'typescript',
        '@types/node',
        'wrangler',
        'prettier',
        'prettier-plugin-astro',
        'prettier-plugin-organize-imports',
        'prettier-plugin-svelte',
        'vitest',
        'husky',
        'lint-staged',
      ],
      ['--ignore-workspace', 'husky'],
    ]);
    expect(commands.flat().includes('latest')).toBe(false);
    expect(
      installCommands('npm', input({ improvements: { prettier: true } })),
    ).toEqual([
      ['install', '@astrojs/cloudflare'],
      [
        'install',
        '-D',
        '@astrojs/check',
        'typescript',
        '@types/node',
        'wrangler',
        'prettier',
        'prettier-plugin-astro',
        'prettier-plugin-organize-imports',
      ],
    ]);
  });
  it('writes a lint-staged Husky hook when Git is selected', () => {
    expect(generateHusky(input())).toBeUndefined();
    expect(
      generateHusky(
        input({
          git: true,
          improvements: { prettier: true, vitest: true },
        }),
      ),
    ).toBe('pnpm exec lint-staged\npnpm test\n');
    expect(
      generateHusky(
        input({
          git: true,
          packageManager: 'npm',
          improvements: { prettier: true },
        }),
      ),
    ).toBe('npm exec lint-staged\n');
  });
  it('skips wrangler.jsonc when the adapter is none', () => {
    expect(generateWrangler(input({ adapter: 'none' }))).toBeUndefined();
    expect(generateWrangler(input())).toContain(
      '"compatibility_date": "2020-01-01"',
    );
    expect(generateWrangler(input())).toContain('"workers_dev": true');
    expect(generateWrangler(input())).not.toContain('"route"');
  });
  it('sets a Cloudflare custom-domain route from a production site URL', () => {
    const wrangler = generateWrangler(
      input({
        site: 'https://eminence-astro-starter.xeffen25.com',
        workersDev: true,
      }),
    );
    expect(wrangler).toContain('"workers_dev": true');
    expect(wrangler).toContain(
      '"pattern": "eminence-astro-starter.xeffen25.com"',
    );
    expect(wrangler).toContain('"custom_domain": true');
    expect(
      generateWrangler(
        input({
          site: 'https://eminence-astro-starter.xeffen25.com',
          workersDev: false,
        }),
      ),
    ).toContain('"workers_dev": false');
    expect(
      generateWrangler(input({ adapter: 'none', site: 'https://example.org' })),
    ).toBeUndefined();
  });
  it('keeps the sitemap site TODO only for the example.com placeholder', () => {
    expect(generateTodo(input())).toContain('.github/SECURITY.md');
    expect(generateTodo(input({ improvements: { sitemap: true } }))).toContain(
      'Replace `site` in `astro.config.mjs`',
    );
    expect(
      generateTodo(
        input({
          improvements: { sitemap: true },
          site: 'https://eminence-astro-starter.xeffen25.com',
        }),
      ),
    ).not.toContain('Replace `site` in `astro.config.mjs`');
  });
  it('writes Tailwind global CSS with Inter when Tailwind is selected', () => {
    expect(generateCss(input())).not.toContain('@import "tailwindcss"');
    expect(generateCss(input({ improvements: { tailwind: true } }))).toBe(
      `@import "tailwindcss";

@theme {
  --font-inter: var(--astro-font-inter);
  --font-sans: var(--font-inter);
}

@layer base {
  body {
    @apply font-sans;
  }
}
`,
    );
  });
  it('configures Astro like the reference starter', () => {
    const config = generateAstroConfig(
      input({
        frameworks: ['svelte'],
        improvements: {
          eminenceAstroSuite: true,
          sitemap: true,
          tailwind: true,
        },
        language: {
          paraglide: true,
          languages: ['en', 'es'],
          defaultLanguage: 'en',
        },
      }),
    );
    expect(config).toContain('fontProviders.google()');
    expect(config).toContain("name: 'Inter'");
    expect(config).toContain('adapter: cloudflare()');
    expect(config).not.toContain('platformProxy');
    expect(config).toContain('eminence()');
    expect(config).not.toContain('sitemap: false');
    expect(config).not.toContain('icons: false');
    expect(config).toContain('// TODO: replace with the production URL');
    expect(config).toContain('// site: "https://example.com"');
    expect(config).not.toMatch(/^\s*site:/m);
    expect(config).toContain('emitGitIgnore: true');
    expect(config).toContain('emitPrettierIgnore: true');
    expect(config).not.toContain('optimizeDeps');
    expect(
      generateAstroConfig(
        input({ improvements: { eminenceAstroSuite: true, sitemap: false } }),
      ),
    ).toContain('eminence({ sitemap: false })');
    expect(
      generateAstroConfig(
        input({ site: 'https://eminence-astro-starter.xeffen25.com' }),
      ),
    ).toContain('site: "https://eminence-astro-starter.xeffen25.com"');
    expect(
      generateAstroConfig(
        input({ site: 'https://eminence-astro-starter.xeffen25.com' }),
      ),
    ).not.toContain('// TODO: replace with the production URL');
  });
  it('runs generate-types before build when verifying Cloudflare projects', () => {
    expect(verifyScripts(true, true, true)).toEqual([
      'generate-types',
      'build',
      'format',
      'test',
    ]);
    expect(verifyScripts(false, false, false)).toEqual(['build']);
  });
  it('writes svelte.config.js only when Svelte is selected', () => {
    expect(generateSvelteConfig(input())).toBeUndefined();
    expect(generateSvelteConfig(input({ frameworks: ['svelte'] }))).toContain(
      'vitePreprocess',
    );
  });
  it('writes src/env.d.ts only for the Cloudflare adapter', () => {
    expect(generateEnvDts(input({ adapter: 'none' }))).toBeUndefined();
    expect(generateEnvDts(input())).toContain('@astrojs/cloudflare');
  });
  it('writes .prettierrc with Svelte plugin only when Svelte is selected', () => {
    expect(generatePrettierRc(input())).toBeUndefined();
    const withoutSvelte = JSON.parse(
      generatePrettierRc(input({ improvements: { prettier: true } }))!,
    ) as { plugins: string[] };
    expect(withoutSvelte.plugins).toEqual([
      'prettier-plugin-organize-imports',
      'prettier-plugin-astro',
    ]);
    const withSvelte = JSON.parse(
      generatePrettierRc(
        input({
          improvements: { prettier: true },
          frameworks: ['svelte'],
        }),
      )!,
    ) as { plugins: string[] };
    expect(withSvelte.plugins).toContain('prettier-plugin-svelte');
  });
  it('writes Paraglide middleware with the tsconfig alias', () => {
    expect(generateMiddleware(input())).toBeUndefined();
    const middleware = generateMiddleware(
      input({ language: { paraglide: true } }),
    );
    expect(middleware?.startsWith('import { defineMiddleware }')).toBe(true);
    expect(middleware).toContain('from "@/paraglide/server"');
    expect(middleware).toContain('paraglideMiddleware');
    expect(
      generateMiddleware(
        input({ adapter: 'none', language: { paraglide: true } }),
      ),
    ).toContain('@/paraglide/server');
  });
  it('leaves Paraglide ignores to generated ignore files', () => {
    const ignore = generatePrettierIgnore(
      input({ improvements: { prettier: true } }),
    );
    expect(ignore).not.toContain('src/paraglide');
    expect(ignore).not.toContain('project.inlang');
  });
  it('adapts chrome and SEO props for Paraglide and Eminence', () => {
    expect(generateLanguageSwitcher(input())).toBeUndefined();
    expect(generateHeader(input())).not.toContain('LanguageSwitcher');
    expect(generateSkipToContent(input())).toContain('Skip to main content');
    expect(generateIndex(input())).toContain('DefaultLayout');
    expect(generateIndex(input())).toContain('title={"my-site"}');
    expect(generateBaseLayout(input())).not.toContain('HeadProps');
    const localized = input({
      language: {
        paraglide: true,
        languages: ['en', 'es'],
        defaultLanguage: 'en',
      },
      improvements: { eminenceAstroSuite: true },
    });
    expect(generateLanguageSwitcher(localized)).toContain('enFlagSvg');
    expect(generateHeader(localized)).toContain('LanguageSwitcher');
    expect(generateSkipToContent(localized)).toContain(
      'm.layout_skip_to_content()',
    );
    expect(generateIndex(localized)).toContain('m.index_title()');
    expect(generateIndex(localized)).toContain('m.index_description()');
    expect(generateBaseLayout(localized)).toContain('HeadProps');
    expect(generateBaseLayout(localized)).toContain('{...Astro.props}');
    expect(generateBaseLayout(localized)).toContain('deLocalizeHref');
    expect(generateBaseLayout(localized)).toContain('locales.map((locale)');
    expect(generateBaseLayout(localized)).toContain(
      'localizeHref(basePath, { locale })',
    );
    expect(generateBaseLayout(localized)).toContain('"x-default"');
    expect(generateBaseLayout(localized)).toContain(
      'languageAlternates={languageAlternates}',
    );
    expect(
      generateBaseLayout(input({ language: { paraglide: true } })),
    ).not.toContain('languageAlternates');
    expect(
      generateBaseLayout(input({ improvements: { eminenceAstroSuite: true } })),
    ).not.toContain('languageAlternates');
  });
  it('puts layout comments in frontmatter before imports', () => {
    const baseLayout = generateBaseLayout(input());
    expect(baseLayout.startsWith('---\n// BaseLayout')).toBe(true);
    expect(baseLayout).not.toContain('<!--');
    const defaultLayout = generateDefaultLayout(input());
    expect(defaultLayout.startsWith('---\n// DefaultLayout')).toBe(true);
    expect(defaultLayout).not.toContain('<!--');
  });
  it('recommends VS Code extensions for selected features', () => {
    expect(JSON.parse(generateVscodeExtensions(input()))).toEqual({
      recommendations: ['astro-build.astro-vscode'],
      unwantedRecommendations: [],
    });
    expect(
      JSON.parse(
        generateVscodeExtensions(
          input({
            improvements: { prettier: true, vitest: true },
            language: { paraglide: true },
          }),
        ),
      ),
    ).toEqual({
      recommendations: [
        'astro-build.astro-vscode',
        'esbenp.prettier-vscode',
        'vitest.explorer',
        'inlang.vs-code-extension',
      ],
      unwantedRecommendations: [],
    });
    expect(JSON.parse(generateVscodeMcp(input()))).toEqual({
      servers: {
        'Astro docs': {
          url: 'https://mcp.docs.astro.build/mcp',
          type: 'http',
        },
      },
      inputs: [],
    });
    expect(generateVscodeSettings(input())).toBeUndefined();
    expect(
      JSON.parse(
        generateVscodeSettings(input({ improvements: { prettier: true } }))!,
      ),
    ).toEqual({
      'editor.defaultFormatter': 'esbenp.prettier-vscode',
      'editor.formatOnSave': true,
      'prettier.configPath': '.prettierrc',
      'prettier.requireConfig': true,
    });
  });
  it('writes GitHub workflows and templates from selected features', () => {
    const ci = generateCi(
      input({
        improvements: { prettier: true, vitest: true },
      }),
    );
    expect(ci).toContain('name: CI');
    expect(ci).toContain('pnpm/action-setup@v4');
    expect(ci).toContain('version: 11');
    expect(ci).toContain('Format check');
    expect(ci).toContain('Generate Cloudflare types');
    expect(ci).toContain('pnpm astro check');
    expect(ci).toContain('Run tests');
    expect(ci).not.toContain('github:ci');
    const staticCi = generateCi(
      input({
        adapter: 'none',
        packageManager: 'npm',
      }),
    );
    expect(staticCi).not.toContain('Format check');
    expect(staticCi).not.toContain('generate-types');
    expect(staticCi).not.toContain('Run tests');
    expect(staticCi).toContain('npm run astro -- check');
    expect(generateLabelsSync(input())).toBeUndefined();
    expect(
      generateLabelsSync(input({ improvements: { githubLabels: true } })),
    ).toContain('EndBug/label-sync@v2');
    expect(
      generateLabelsSync(input({ improvements: { githubLabels: true } })),
    ).toContain('delete-other-labels: true');
    const cloudflareLabels = JSON.parse(
      generateLabels(input({ improvements: { githubLabels: true } }))!,
    ) as Array<{ name: string }>;
    expect(cloudflareLabels.map((label) => label.name)).toEqual(
      expect.arrayContaining(['feat', 'fix', 'cloudflare', 'astro', 'ui']),
    );
    expect(cloudflareLabels.map((label) => label.name)).not.toContain('locale');
    expect(cloudflareLabels.map((label) => label.name)).not.toContain(
      'analytics',
    );
    const staticLabels = JSON.parse(
      generateLabels(
        input({
          adapter: 'none',
          improvements: { githubLabels: true, sitemap: true },
          language: { paraglide: true },
        }),
      )!,
    ) as Array<{ name: string }>;
    expect(staticLabels.map((label) => label.name)).toContain('locale');
    expect(staticLabels.map((label) => label.name)).toContain('seo');
    expect(staticLabels.map((label) => label.name)).not.toContain('cloudflare');
    expect(generateFeat(input())).toBeUndefined();
    expect(
      generateFeat(input({ improvements: { issueTemplates: true } })),
    ).toContain('**Cloudflare**');
    expect(
      generateFeat(
        input({ adapter: 'none', improvements: { issueTemplates: true } }),
      ),
    ).not.toContain('**Cloudflare**');
    expect(
      generatePullRequest(input({ improvements: { issueTemplates: true } })),
    ).toContain('Staging Preview');
    expect(
      generatePullRequest(
        input({
          adapter: 'none',
          improvements: { issueTemplates: true },
        }),
      ),
    ).not.toContain('Staging Preview');
    const support = generateSupport(
      input({
        frameworks: ['svelte'],
        improvements: { tailwind: true, prettier: true, vitest: true },
        language: { paraglide: true },
      }),
    );
    expect(support).toContain('Svelte');
    expect(support).toContain('Paraglide JS');
    expect(support).toContain('Tailwind CSS');
    expect(support).not.toContain('daisyUI');
    expect(support).not.toContain('ESLint');
    expect(
      generateSupport(input({ adapter: 'none', frameworks: ['react'] })),
    ).toContain('React');
    expect(generateSupport(input({ adapter: 'none' }))).not.toContain(
      'Cloudflare Workers',
    );
  });
});

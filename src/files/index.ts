import type { FileModule } from '../types.js';
import * as envExample from './.env.example.js';
import * as githubDeps from './.github/ISSUE_TEMPLATE/deps.md.js';
import * as githubDocs from './.github/ISSUE_TEMPLATE/docs.md.js';
import * as githubFeat from './.github/ISSUE_TEMPLATE/feat.md.js';
import * as githubFix from './.github/ISSUE_TEMPLATE/fix.md.js';
import * as githubRefactor from './.github/ISSUE_TEMPLATE/refactor.md.js';
import * as githubRevert from './.github/ISSUE_TEMPLATE/revert.md.js';
import * as githubTest from './.github/ISSUE_TEMPLATE/test.md.js';
import * as pullRequestTemplate from './.github/PULL_REQUEST_TEMPLATE.md.js';
import * as support from './.github/SUPPORT.md.js';
import * as githubLabels from './.github/labels.json.js';
import * as ciWorkflow from './.github/workflows/ci.yml.js';
import * as labelsSync from './.github/workflows/labels-sync.yml.js';
import * as huskyPreCommit from './.husky/pre-commit.js';
import * as prettierIgnore from './.prettierignore.js';
import * as vscodeExtensions from './.vscode/extensions.json.js';
import * as vscodeMcp from './.vscode/mcp.json.js';
import * as vscodeSettings from './.vscode/settings.json.js';
import * as astroConfig from './astro.config.mjs.js';
import * as messagesCa from './messages/ca.json.js';
import * as messagesDe from './messages/de.json.js';
import * as messagesEn from './messages/en.json.js';
import * as messagesEs from './messages/es.json.js';
import * as messagesFr from './messages/fr.json.js';
import * as messagesIt from './messages/it.json.js';
import * as packageJson from './package.json.js';
import * as pnpmWorkspace from './pnpm-workspace.yaml.js';
import * as prettierRc from './prettierrc.js';
import * as inlangSettings from './project.inlang/settings.json.js';
import * as assetsIgnore from './public/.assetsignore.js';
import * as footer from './src/components/Footer.astro.js';
import * as header from './src/components/Header.astro.js';
import * as languageSwitcher from './src/components/LanguageSwitcher.astro.js';
import * as skipToContent from './src/components/SkipToContent.astro.js';
import * as envDts from './src/env.d.ts.js';
import * as baseLayout from './src/layouts/BaseLayout.astro.js';
import * as defaultLayout from './src/layouts/DefaultLayout.astro.js';
import * as middleware from './src/middleware.ts.js';
import * as indexPage from './src/pages/index.astro.js';
import * as globalCss from './src/styles/global.css.js';
import * as exampleTest from './src/tests/example.test.ts.js';
import * as svelteConfig from './svelte.config.js.js';
import * as todo from './TODO.md.js';
import * as wranglerJsonc from './wrangler.jsonc.js';

export const files: FileModule[] = [
  packageJson,
  astroConfig,
  footer,
  header,
  languageSwitcher,
  skipToContent,
  baseLayout,
  defaultLayout,
  indexPage,
  globalCss,
  ciWorkflow,
  pnpmWorkspace,
  wranglerJsonc,
  assetsIgnore,
  middleware,
  inlangSettings,
  messagesEn,
  messagesEs,
  messagesFr,
  messagesIt,
  messagesCa,
  messagesDe,
  prettierRc,
  prettierIgnore,
  exampleTest,
  svelteConfig,
  envDts,
  envExample,
  todo,
  githubLabels,
  labelsSync,
  githubFeat,
  githubFix,
  githubRevert,
  githubRefactor,
  githubTest,
  githubDocs,
  githubDeps,
  pullRequestTemplate,
  support,
  huskyPreCommit,
  vscodeExtensions,
  vscodeMcp,
  vscodeSettings,
];

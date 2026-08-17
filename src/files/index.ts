import type { FileModule } from '../types.js';
import * as envExample from './.env.example.js';
import * as gitignore from './.gitignore.js';
import * as githubBugReport from './.github/ISSUE_TEMPLATE/bug-report.yml.js';
import * as githubIssueConfig from './.github/ISSUE_TEMPLATE/config.yml.js';
import * as githubFeatureRequest from './.github/ISSUE_TEMPLATE/feature-request.yml.js';
import * as githubLabels from './.github/labels.json.js';
import * as ciWorkflow from './.github/workflows/ci.yml.js';
import * as syncLabels from './.github/workflows/sync-labels.yml.js';
import * as huskyPreCommit from './.husky/pre-commit.js';
import * as prettierIgnore from './.prettierignore.js';
import * as astroConfig from './astro.config.mjs.js';
import * as messagesCa from './messages/ca.json.js';
import * as messagesDe from './messages/de.json.js';
import * as messagesEn from './messages/en.json.js';
import * as messagesEs from './messages/es.json.js';
import * as messagesFr from './messages/fr.json.js';
import * as messagesIt from './messages/it.json.js';
import * as packageJson from './package.json.js';
import * as pnpmWorkspace from './pnpm-workspace.yaml.js';
import * as prettierConfig from './prettier.config.mjs.js';
import * as inlangSettings from './project.inlang/settings.json.js';
import * as assetsIgnore from './public/.assetsignore.js';
import * as baseLayout from './src/layouts/BaseLayout.astro.js';
import * as middleware from './src/middleware.ts.js';
import * as indexPage from './src/pages/index.astro.js';
import * as globalCss from './src/styles/global.css.js';
import * as exampleTest from './src/tests/example.test.ts.js';
import * as todo from './TODO.md.js';
import * as wranglerJsonc from './wrangler.jsonc.js';

export const files: FileModule[] = [
  packageJson,
  gitignore,
  astroConfig,
  baseLayout,
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
  prettierConfig,
  prettierIgnore,
  exampleTest,
  envExample,
  todo,
  githubLabels,
  syncLabels,
  githubIssueConfig,
  githubBugReport,
  githubFeatureRequest,
  huskyPreCommit,
];

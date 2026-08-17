import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { execa } from 'execa';
import { writeAstroConfig } from './astro-config.js';
import { addCloudflare } from './cloudflare.js';
import { addCi } from './features/ci.js';
import { addEminenceAstroSuite } from './features/eminence-astro-suite.js';
import { addFrameworks } from './features/frameworks.js';
import { addGitHubLabels } from './features/github-labels.js';
import { addHusky } from './features/husky.js';
import { addIssueTemplates } from './features/issue-templates.js';
import { addLanguage } from './features/language.js';
import { addPrettier } from './features/prettier.js';
import { addResend } from './features/resend.js';
import { addTailwind } from './features/tailwind.js';
import { addVitest } from './features/vitest.js';
import {
  copyDirectoryContents,
  copyTemplate,
  ensureEmptyDirectory,
  writeNewFile,
} from './lib/files.js';
import { addAstro, installDependencies, verifyProject } from './lib/verify.js';
import { pnpmWorkspaceYaml } from './package-manager.js';
import type { Answers, Reporter } from './types.js';

const here = dirname(fileURLToPath(import.meta.url));
export const templateDirectory = resolve(here, '../templates/base');
export const improvedTemplateDirectory = resolve(here, '../templates/improved');

const silentReporter: Reporter = {
  start() {},
  message() {},
  stop() {},
};

const frameworkLabels = { svelte: 'Svelte', react: 'React' } as const;

function basePackageJson(name: string) {
  return `${JSON.stringify(
    {
      name,
      type: 'module',
      version: '0.0.1',
      engines: { node: '>=22.12.0' },
      scripts: {
        dev: 'astro dev',
        build: 'astro build',
        preview: 'astro preview',
        astro: 'astro',
      },
    },
    null,
    2,
  )}\n`;
}

async function commit(
  directory: string,
  message: string,
  runner: typeof execa,
) {
  await runner('git', ['add', '.'], { cwd: directory, stdio: 'ignore' });
  await runner('git', ['commit', '--allow-empty', '-m', message], {
    cwd: directory,
    stdio: 'ignore',
  });
}

export async function generateProject(
  target: string,
  answers: Answers,
  options: {
    addAstro?: typeof addAstro;
    install?: typeof installDependencies;
    verify?: typeof verifyProject;
    git?: typeof execa;
    reporter?: Reporter;
    compatibilityDate?: string;
  } = {},
) {
  const report = options.reporter ?? silentReporter;
  await ensureEmptyDirectory(target);
  report.start('Initiating base project');
  await copyTemplate(templateDirectory, target);
  await writeNewFile(
    join(target, 'package.json'),
    basePackageJson(answers.projectName),
  );
  if (answers.packageManager === 'pnpm')
    await writeNewFile(join(target, 'pnpm-workspace.yaml'), pnpmWorkspaceYaml);
  await (options.addAstro ?? addAstro)(target, answers.packageManager);
  report.stop('Initiated base project');
  const git = options.git ?? execa;
  if (answers.git) {
    report.start('Creating first commit');
    await git('git', ['init'], { cwd: target, stdio: 'ignore' });
    await commit(target, 'Initialize Astro', git);
    report.stop('First commit');
  }
  report.start('Applying improvements');
  report.message('Applying improved template');
  await copyDirectoryContents(improvedTemplateDirectory, target);
  report.message(
    `Applying ${answers.language.paraglide ? 'Paraglide' : 'Language'}`,
  );
  await addLanguage(
    target,
    answers.language,
    answers.adapter,
    answers.improvements.eminenceAstroSuite,
  );
  if (answers.adapter === 'cloudflare') {
    report.message('Applying Cloudflare Workers');
    await addCloudflare(target, answers.projectName, options.compatibilityDate);
  }
  for (const framework of answers.frameworks)
    report.message(`Applying ${frameworkLabels[framework]}`);
  await addFrameworks(target, answers.frameworks);
  if (answers.improvements.tailwind) {
    report.message('Applying Tailwind CSS');
    await addTailwind(target);
  }
  if (answers.improvements.prettier) {
    report.message('Applying Prettier');
    await addPrettier(target);
  }
  if (answers.improvements.vitest) {
    report.message('Applying Vitest');
    await addVitest(target);
  }
  if (answers.improvements.eminenceAstroSuite) {
    report.message('Applying Eminence Astro Suite');
    await addEminenceAstroSuite(target);
  }
  if (answers.improvements.resend) {
    report.message('Applying Resend');
    await addResend(target);
  }
  if (answers.improvements.githubLabels) {
    report.message('Applying GitHub label sync');
    await addGitHubLabels(target);
  }
  if (answers.improvements.issueTemplates) {
    report.message('Applying GitHub issue templates');
    await addIssueTemplates(target);
  }
  const huskyScripts = [
    ...(answers.improvements.prettier ? ['format'] : []),
    ...(answers.improvements.vitest ? ['test'] : []),
  ];
  if (answers.git && huskyScripts.length) {
    report.message('Applying Husky');
    await addHusky(target, answers.packageManager, huskyScripts);
  }
  report.message('Applying CI');
  await addCi(target, {
    prettier: answers.improvements.prettier,
    vitest: answers.improvements.vitest,
    packageManager: answers.packageManager,
  });
  report.message('Updating Astro config');
  await writeAstroConfig(target, answers);
  report.stop('Applied improvements');
  report.start('Installing dependencies');
  await (options.install ?? installDependencies)(
    target,
    answers.packageManager,
  );
  await (options.verify ?? verifyProject)(
    target,
    answers.packageManager,
    answers.improvements.prettier,
    answers.improvements.vitest,
  );
  report.stop('Installed dependencies');
  if (answers.git) {
    report.start('Creating second commit');
    await commit(target, 'Apply setup', git);
    report.stop('Second commit');
  }
}

import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { execa } from 'execa';
import { generate as generatePnpmWorkspace } from './files/pnpm-workspace.yaml.js';
import { applyFiles } from './lib/apply-files.js';
import { latestWranglerCompatibilityDate } from './lib/compatibility-date.js';
import {
  copyDirectoryContents,
  copyTemplate,
  ensureEmptyDirectory,
  writeNewFile,
} from './lib/files.js';
import { addAstro, installDependencies, verifyProject } from './lib/verify.js';
import type { Answers, ProjectInput, Reporter } from './types.js';

const here = dirname(fileURLToPath(import.meta.url));
export const templateDirectory = resolve(here, '../templates/base');
export const improvedTemplateDirectory = resolve(here, '../templates/improved');

const silentReporter: Reporter = {
  start() {},
  message() {},
  stop() {},
};

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
  const input: ProjectInput = {
    ...answers,
    compatibilityDate:
      options.compatibilityDate ??
      (answers.adapter === 'cloudflare'
        ? await latestWranglerCompatibilityDate()
        : ''),
  };
  await ensureEmptyDirectory(target);
  report.start('Initiating base project');
  await copyTemplate(templateDirectory, target);
  await writeNewFile(
    join(target, 'package.json'),
    basePackageJson(answers.projectName),
  );
  const pnpmWorkspace = generatePnpmWorkspace(input);
  if (pnpmWorkspace)
    await writeNewFile(join(target, 'pnpm-workspace.yaml'), pnpmWorkspace);
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
  report.message('Writing files');
  await applyFiles(target, input);
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

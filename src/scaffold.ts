import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { execa } from 'execa';
import { addCloudflare } from './cloudflare.js';
import { addGitHubLabels } from './features/github-labels.js';
import { addPrettier } from './features/prettier.js';
import { addTailwind } from './features/tailwind.js';
import {
  copyTemplate,
  ensureEmptyDirectory,
  writeNewFile,
} from './lib/files.js';
import { installDependencies, verifyProject } from './lib/verify.js';
import type { Answers } from './types.js';

const here = dirname(fileURLToPath(import.meta.url));
export const templateDirectory = resolve(here, '../templates/base');

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
    install?: typeof installDependencies;
    verify?: typeof verifyProject;
    git?: typeof execa;
  } = {},
) {
  await ensureEmptyDirectory(target);
  await copyTemplate(templateDirectory, target);
  await writeNewFile(
    join(target, 'package.json'),
    `${JSON.stringify({ name: answers.projectName, version: '0.0.0', private: true, type: 'module', scripts: { dev: 'astro dev', start: 'astro dev', build: 'astro build' }, devDependencies: { astro: 'latest' } }, null, 2)}\n`,
  );
  await writeNewFile(join(target, '.gitignore'), 'node_modules/\ndist/\n');
  const git = options.git ?? execa;
  if (answers.git) {
    await git('git', ['init'], { cwd: target, stdio: 'ignore' });
    await commit(target, 'Initialize Astro', git);
  }
  if (answers.adapter === 'cloudflare') {
    await addCloudflare(target, answers.projectName);
  }
  if (answers.improvements.tailwind) await addTailwind(target);
  if (answers.improvements.prettier) await addPrettier(target);
  if (answers.improvements.githubLabels) await addGitHubLabels(target);

  await (options.install ?? installDependencies)(
    target,
    answers.packageManager,
  );
  await (options.verify ?? verifyProject)(
    target,
    answers.packageManager,
    answers.improvements.prettier,
  );
  if (answers.git) await commit(target, 'Apply setup', git);
}

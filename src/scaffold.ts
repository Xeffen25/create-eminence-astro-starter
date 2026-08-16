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
    `${JSON.stringify({ name: answers.projectName, version: '0.0.0', private: true, type: 'module' }, null, 2)}\n`,
  );
  await writeNewFile(join(target, '.gitignore'), 'node_modules/\ndist/\n');
  await addCloudflare(target, answers.projectName);
  if (answers.improvements.tailwind) await addTailwind(target);
  if (answers.improvements.prettier) await addPrettier(target);
  if (answers.improvements.githubLabels) await addGitHubLabels(target);

  if (answers.install) {
    await (options.install ?? installDependencies)(
      target,
      answers.packageManager,
    );
    await (options.verify ?? verifyProject)(
      target,
      answers.packageManager,
      answers.improvements.prettier,
    );
  }
  if (answers.git)
    await (options.git ?? execa)('git', ['init'], {
      cwd: target,
      stdio: 'ignore',
    });
}

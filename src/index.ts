#!/usr/bin/env node
import * as p from '@clack/prompts';
import { basename, dirname, join, resolve } from 'node:path';
import {
  collectAnswers,
  isKebabCaseName,
  kebabCaseNameError,
  toKebabCaseName,
} from './prompts.js';
import { commandsFor, detectPackageManager } from './package-manager.js';
import { generateProject } from './scaffold.js';
import { emptyDirectory, isNonEmptyDirectory } from './lib/files.js';

function parseArgs(argv: string[]) {
  const values = argv.slice(2);
  const yes = values.includes('--yes') || values.includes('-y');
  const name = values.find((value) => !value.startsWith('-'));
  return { yes, name };
}

async function main() {
  const { name, yes } = parseArgs(process.argv);
  p.intro('create-eminence-astro-starter');
  if (name) {
    const kebab = toKebabCaseName(basename(name));
    if (!isKebabCaseName(kebab)) {
      p.log.error(kebabCaseNameError);
      process.exitCode = 1;
      return;
    }
  }
  const answers = await collectAnswers({
    name,
    yes,
    manager: detectPackageManager(),
  });
  if (!answers) {
    p.cancel('Cancelled. No files were created.');
    return;
  }
  const requested = resolve(process.cwd(), name ?? answers.projectName);
  const projectName = toKebabCaseName(basename(requested));
  if (!isKebabCaseName(projectName)) {
    p.log.error(kebabCaseNameError);
    process.exitCode = 1;
    return;
  }
  const target = join(dirname(requested), projectName);
  answers.projectName = projectName;
  if (await isNonEmptyDirectory(target)) {
    if (yes) {
      p.log.error(`Target directory is not empty: ${target}`);
      process.exitCode = 1;
      return;
    }
    const empty = await p.confirm({
      message: `Target directory is not empty. Empty it and continue?`,
      initialValue: false,
    });
    if (p.isCancel(empty) || !empty) {
      p.cancel('Cancelled. No files were changed.');
      return;
    }
    await emptyDirectory(target);
  }
  const spinner = p.spinner();
  let running = false;
  try {
    await generateProject(target, answers, {
      reporter: {
        start(message) {
          spinner.start(message);
          running = true;
        },
        message(message) {
          spinner.message(message);
        },
        stop(message) {
          spinner.stop(message);
          running = false;
        },
      },
    });
  } catch (error) {
    if (running) spinner.stop('Generation failed');
    p.log.error(error instanceof Error ? error.message : String(error));
    p.outro(`Generated files were preserved at ${target}.`);
    process.exitCode = 1;
    return;
  }
  const commands = commandsFor(answers.packageManager, projectName);
  p.note(`${commands.cd}\n${commands.dev}`, 'Next steps');
  p.outro('Happy building.');
}

main();

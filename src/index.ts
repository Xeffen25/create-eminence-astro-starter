#!/usr/bin/env node
import * as p from '@clack/prompts';
import { basename, resolve } from 'node:path';
import { collectAnswers } from './prompts.js';
import { commandsFor, detectPackageManager } from './package-manager.js';
import { generateProject } from './scaffold.js';

function parseArgs(argv: string[]) {
  const values = argv.slice(2);
  const yes = values.includes('--yes') || values.includes('-y');
  const name = values.find((value) => !value.startsWith('-'));
  return { yes, name };
}

async function main() {
  const { name, yes } = parseArgs(process.argv);
  p.intro('create-eminence-astro-starter');
  const answers = await collectAnswers({
    name,
    yes,
    manager: detectPackageManager(),
  });
  if (!answers) {
    p.cancel('Cancelled. No files were created.');
    return;
  }
  const target = resolve(process.cwd(), answers.projectName);
  const spinner = p.spinner();
  try {
    spinner.start('Generating project');
    await generateProject(target, answers);
    spinner.stop('Project generated');
  } catch (error) {
    spinner.stop('Generation failed');
    p.log.error(error instanceof Error ? error.message : String(error));
    p.outro(`Generated files were preserved at ${target}.`);
    process.exitCode = 1;
    return;
  }
  const commands = commandsFor(answers.packageManager, basename(target));
  if (!answers.install)
    p.note(
      `${commands.cd}\n${commands.install}\n${commands.dev}`,
      'Next steps',
    );
  else p.note(`${commands.cd}\n${commands.dev}`, 'Next steps');
  p.outro('Happy building.');
}

main();

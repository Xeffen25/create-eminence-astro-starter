import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const directory = mkdtempSync(join(tmpdir(), 'eminence-packed-'));
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const commandOptions = process.platform === 'win32' ? { shell: true } : {};
try {
  const tarball = resolve(
    process.argv[2] ??
      execFileSync(pnpm, ['pack'], { encoding: 'utf8', ...commandOptions })
        .trim()
        .split(/\r?\n/)
        .at(-1),
  );
  execFileSync(
    pnpm,
    [
      'dlx',
      '--package',
      tarball,
      'create-eminence-astro-starter',
      'smoke-site',
      '--yes',
    ],
    {
      cwd: directory,
      stdio: 'inherit',
      ...commandOptions,
    },
  );
  execFileSync(pnpm, ['build'], {
    cwd: join(directory, 'smoke-site'),
    stdio: 'inherit',
    ...commandOptions,
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}

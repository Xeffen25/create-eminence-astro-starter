import { describe, expect, it } from 'vitest';
import { commandsFor, detectPackageManager } from '../src/package-manager.js';

describe('package managers', () => {
  it.each([
    ['pnpm/10.0.0 npm/?', 'pnpm'],
    ['npm/11.0.0 node/v22', 'npm'],
    ['yarn/4.0.0 npm/?', 'yarn'],
    ['bun/1.2.0 npm/?', 'bun'],
  ])('detects %s', (agent, expected) =>
    expect(detectPackageManager(agent)).toBe(expected),
  );
  it('returns undefined for an unknown agent', () =>
    expect(detectPackageManager('curl/8')).toBeUndefined());
  it.each(['pnpm', 'npm', 'yarn', 'bun'] as const)(
    'creates commands for %s',
    (manager) =>
      expect(commandsFor(manager, 'site').install).toContain(manager),
  );
});

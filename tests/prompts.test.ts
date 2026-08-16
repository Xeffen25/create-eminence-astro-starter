import { describe, expect, it } from 'vitest';
import {
  defaultImprovements,
  defaultProjectName,
  projectNameOrDefault,
} from '../src/prompts.js';

describe('prompt defaults', () => {
  it('enables every improvement by default', () =>
    expect(defaultImprovements).toEqual({
      tailwind: true,
      prettier: true,
      githubLabels: true,
    }));

  it('uses my-site-name as the default project name', () =>
    expect(defaultProjectName).toBe('my-site-name'));

  it('uses the default for a blank prompt response', () => {
    expect(projectNameOrDefault(undefined)).toBe('my-site-name');
    expect(projectNameOrDefault('')).toBe('my-site-name');
  });
});

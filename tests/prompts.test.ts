import { describe, expect, it } from 'vitest';
import { defaultImprovements } from '../src/prompts.js';

describe('prompt defaults', () => {
  it('enables every improvement by default', () =>
    expect(defaultImprovements).toEqual({
      tailwind: true,
      prettier: true,
      githubLabels: true,
    }));
});

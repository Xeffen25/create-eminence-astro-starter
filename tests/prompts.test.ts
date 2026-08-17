import { describe, expect, it } from 'vitest';
import {
  defaultImprovements,
  defaultLanguageSetup,
  defaultProjectName,
  isKebabCaseName,
  kebabCaseNameError,
  languageOptions,
  projectNameError,
  projectNameOrDefault,
  toKebabCaseName,
} from '../src/prompts.js';

describe('prompt defaults', () => {
  it('enables every improvement by default', () =>
    expect(defaultImprovements).toEqual({
      tailwind: true,
      prettier: true,
      githubLabels: true,
      issueTemplates: true,
      vitest: true,
      eminenceAstroSuite: true,
      resend: true,
    }));

  it('uses my-site-name as the default project name', () =>
    expect(defaultProjectName).toBe('my-site-name'));

  it('uses the default for a blank prompt response', () => {
    expect(projectNameOrDefault(undefined)).toBe('my-site-name');
    expect(projectNameOrDefault('')).toBe('my-site-name');
  });

  it('uses bilingual Paraglide defaults', () => {
    expect(defaultLanguageSetup).toEqual({
      paraglide: true,
      languages: ['en', 'es'],
      defaultLanguage: 'en',
    });
    expect(languageOptions.map((option) => option.value)).toEqual([
      'es',
      'en',
      'fr',
      'it',
      'ca',
      'de',
    ]);
  });
});

describe('kebab-case project names', () => {
  it('converts spaces and underscores to dashes', () => {
    expect(toKebabCaseName('My Site')).toBe('my-site');
    expect(toKebabCaseName('My_Site_Name')).toBe('my-site-name');
    expect(toKebabCaseName('  My   Site  ')).toBe('my-site');
  });

  it('accepts kebab-case names', () => {
    expect(isKebabCaseName('my-site')).toBe(true);
    expect(isKebabCaseName('my-site-name')).toBe(true);
    expect(isKebabCaseName('a')).toBe(true);
  });

  it('rejects leftover invalid characters', () => {
    expect(isKebabCaseName(toKebabCaseName('foo!bar'))).toBe(false);
    expect(isKebabCaseName(toKebabCaseName('my.site'))).toBe(false);
    expect(projectNameError('foo!bar')).toBe(kebabCaseNameError);
    expect(projectNameError('My Site')).toBeUndefined();
    expect(projectNameError('')).toBeUndefined();
    expect(projectNameError(undefined)).toBeUndefined();
  });
});

import { describe, expect, it } from 'vitest';
import {
  defaultImprovements,
  defaultLanguageSetup,
  defaultProjectName,
  defaultSite,
  isKebabCaseName,
  kebabCaseNameError,
  languageOptions,
  projectNameError,
  projectNameOrDefault,
  siteError,
  siteOrDefault,
  toKebabCaseName,
} from '../src/prompts.js';
import { isDefaultSite, siteHostname } from '../src/lib/site.js';

describe('prompt defaults', () => {
  it('enables every improvement by default', () =>
    expect(defaultImprovements).toEqual({
      tailwind: true,
      prettier: true,
      githubLabels: true,
      issueTemplates: true,
      vitest: true,
      eminenceAstroSuite: true,
      sitemap: true,
      resend: true,
    }));

  it('uses my-site-name as the default project name', () =>
    expect(defaultProjectName).toBe('my-site-name'));

  it('uses https://example.com as the default site URL', () =>
    expect(defaultSite).toBe('https://example.com'));

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

describe('site URLs', () => {
  it('uses the default for a blank prompt response', () => {
    expect(siteOrDefault(undefined)).toBe('https://example.com');
    expect(siteOrDefault('')).toBe('https://example.com');
    expect(siteOrDefault('  ')).toBe('https://example.com');
  });

  it('normalizes hostnames and trailing slashes', () => {
    expect(siteOrDefault('example.org')).toBe('https://example.org');
    expect(siteOrDefault('https://example.org/')).toBe('https://example.org');
    expect(isDefaultSite('https://example.com/')).toBe(true);
    expect(isDefaultSite('https://example.org')).toBe(false);
    expect(siteHostname('https://eminence-astro-starter.xeffen25.com')).toBe(
      'eminence-astro-starter.xeffen25.com',
    );
  });

  it('rejects invalid site URLs', () => {
    expect(siteError('')).toBeUndefined();
    expect(siteError(undefined)).toBeUndefined();
    expect(siteError('https://example.com')).toBeUndefined();
    expect(siteError('not a url')).toBeDefined();
    expect(siteError('ftp://example.com')).toBeDefined();
  });
});

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export type Improvements = {
  tailwind: boolean;
  prettier: boolean;
  githubLabels: boolean;
  issueTemplates: boolean;
  vitest: boolean;
  eminenceAstroSuite: boolean;
  sitemap: boolean;
  resend: boolean;
};

export type Adapter = 'none' | 'cloudflare';
export type Framework = 'svelte' | 'react';
export type Language = 'es' | 'en' | 'fr' | 'it' | 'ca' | 'de';

export type LanguageSetup = {
  paraglide: boolean;
  languages: Language[];
  defaultLanguage: Language;
};

export type Answers = {
  projectName: string;
  improvements: Improvements;
  adapter: Adapter;
  frameworks: Framework[];
  language: LanguageSetup;
  git: boolean;
  packageManager: PackageManager;
  site: string;
  workersDev: boolean;
};

export type ProjectInput = Answers & {
  compatibilityDate: string;
};

export type FileModule = {
  path: string;
  generate: (input: ProjectInput) => string | undefined;
  mode?: number;
};

export type Reporter = {
  start(message: string): void;
  message(message: string): void;
  stop(message: string): void;
};

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export type Improvements = {
  tailwind: boolean;
  prettier: boolean;
  githubLabels: boolean;
};

export type Adapter = 'none' | 'cloudflare';

export type Answers = {
  projectName: string;
  improvements: Improvements;
  adapter: Adapter;
  git: boolean;
  packageManager: PackageManager;
};

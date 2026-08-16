export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export type Improvements = {
  tailwind: boolean;
  prettier: boolean;
  githubLabels: boolean;
};

export type Answers = {
  projectName: string;
  improvements: Improvements;
  git: boolean;
  install: boolean;
  packageManager: PackageManager;
};

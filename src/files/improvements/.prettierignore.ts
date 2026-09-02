import type { ProjectInput } from '../../types.js';

export const path = '.prettierignore';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.prettier) return;
  return `.husky/*
.prettierignore
.gitattributes
.gitignore
.npmrc
.idx/dev.nix
public/.assetsignore
LICENSE
**/*.gitkeep
**/*.png
**/*.jpg
**/*.jpeg
**/*.gif
**/*.webp
**/*.avif
**/*.mp4
**/*.mp3
**/*.woff
**/*.woff2
**/*.ttf
**/*.otf
**/*.txt
**/*.pdf
**/*.example
`;
}

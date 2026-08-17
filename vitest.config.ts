import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      'templates/**',
      '.reference-eminence/**',
      'my-site-name/**',
      '**/node_modules/**',
    ],
  },
});

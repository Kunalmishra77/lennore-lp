// Lints plain JS/MJS (scripts, config). TypeScript and .astro files are type-checked by `astro check`.
// Adding typescript-eslint / eslint-plugin-astro would be new dependencies (docs/03 §4) — ask first.
import js from '@eslint/js';

export default [
  { ignores: ['dist/**', '.astro/**', 'node_modules/**', 'assets/**', 'docs/**', '**/*.ts', '**/*.astro'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { process: 'readonly', console: 'readonly', URL: 'readonly' },
    },
  },
];

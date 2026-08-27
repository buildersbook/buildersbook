import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    ignores: ['lib/source.ts', 'lib/content/validate.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/.source/server'],
          message: 'Import generated collections through lib/source.ts; validate.ts is the only audit exception.',
        }],
      }],
    },
  },
  globalIgnores(['.next/**', '.source/**', 'design/reference/**', 'next-env.d.ts']),
]);

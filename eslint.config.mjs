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
          group: ['@/.source', '@/.source/*', '**/.source', '**/.source/*'],
          message: 'Import generated collections through lib/source.ts; validate.ts is the only audit exception.',
        }],
      }],
      'no-restricted-syntax': ['error',
        {
          selector: "ImportExpression[source.value=/(^|.*\\/)\\.source(\\/|$)/]",
          message: 'Import generated collections through lib/source.ts; validate.ts is the only audit exception.',
        },
        {
          selector: "ImportExpression[source.type='TemplateLiteral'][source.expressions.length=0][source.quasis.0.value.raw=/(^|.*\\/)\\.source(\\/|$)/]",
          message: 'Import generated collections through lib/source.ts; validate.ts is the only audit exception.',
        },
        {
          selector: "TSImportType[source.value=/(^|.*\\/)\\.source(\\/|$)/]",
          message: 'Reference generated collection types through lib/source.ts; validate.ts is the only audit exception.',
        },
        {
          selector: "CallExpression[arguments.0.type='Literal'][arguments.0.value=/(^|.*\\/)\\.source(\\/|$)/]",
          message: 'Load generated collections through lib/source.ts; validate.ts is the only audit exception.',
        },
        {
          selector: "CallExpression[arguments.0.type='TemplateLiteral'][arguments.0.expressions.length=0][arguments.0.quasis.0.value.raw=/(^|.*\\/)\\.source(\\/|$)/]",
          message: 'Load generated collections through lib/source.ts; validate.ts is the only audit exception.',
        },
      ],
    },
  },
  globalIgnores(['.next/**', '.source/**', 'design/reference/**', 'next-env.d.ts']),
]);

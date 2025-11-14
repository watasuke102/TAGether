// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {defineConfig, globalIgnores} from 'eslint/config';
import drizzlePlugin from 'eslint-plugin-drizzle';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import importPlugin from 'eslint-plugin-import';
import headerPlugin from '@tony.ganchev/eslint-plugin-header';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig(
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'public/**',
    'docker/**',
    'next-env.d.ts',
  ]),
  {
    files: ['**/*.{j,t}s', '**/*.{j,t}sx'],
    plugins: {
      header: headerPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      // // appearance
      // indent: ['error', 2, {SwitchCase: 1}],
      // quotes: ['error', 'single'],
      // 'linebreak-style': ['error', 'unix'],
      // // program
      // eqeqeq: ['error', 'always'], // force ===, !==
      // 'no-undef': 'error',
      // 'no-unused-vars': 'error',
      // 'no-invalid-regexp': 'error',
      // 'no-case-declarations': 'off', // allow declare in case block
      'header/header': [
        'warn',
        'line',
        [
          ' TAGether - Share self-made exam for classmates',
          ' CopyRight (c) 2020-2025 watasuke',
          '',
          ' Email  : <watasuke102@gmail.com>',
          ' Twitter: @watasuke1024',
          ' This software is released under the MIT or MIT SUSHI-WARE License.',
        ],
      ],
    },
  },
  {
    plugins: {
      drizzle: drizzlePlugin,
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'warn',
        {
          // prettier-ignore
          groups: [
            'builtin',
            'external',
            'internal',
            'index',
            'sibling',
            'parent',
            'object',
            'type',
          ],
          // prettier-ignore
          pathGroups: [
            { position: 'before', group: 'builtin',  pattern: '*.scss', patternOptions: {matchBase: true} },
            { position: 'before', group: 'internal', pattern: '@mytypes**' },
            { position: 'before', group: 'internal', pattern: '@/**' },
            { position: 'before', group: 'builtin',  pattern: '*.svg', patternOptions: {matchBase: true} },
          ],
          'newlines-between': 'ignore',
        },
      ],
    },
  },
);

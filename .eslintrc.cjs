/**
 * @type import('eslint').Linter.Config
 */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',

    'plugin:react-hooks/recommended',

    'airbnb',
    'airbnb/hooks',
    'plugin:react/jsx-runtime',

    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    'plugin:@tanstack/eslint-plugin-query/recommended',

    'prettier',
    '.eslintrc-auto-import.json',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier', 'import', '@tanstack/query'],
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.*.json'],
    tsconfigRootDir: __dirname,
  },
  settings: {
    // 'import/parsers': {
    //   '@typescript-eslint/parser': ['.ts', '.tsx'],
    // },
    'import/resolver': {
      typescript: true,
      node: true,
      alias: {
        map: [['@', './src/']],
        extensions: ['.ts', '.tsx', '.json'],
      },
    },
  },
  rules: {
    'prettier/prettier': 'error',

    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'react/function-component-definition': [
      'error',
      { namedComponents: ['arrow-function'] },
    ],
    'react/prop-types': 'off',
    'react/jsx-no-undef': ['error', { allowGlobals: true }],

    'no-shadow': 'off',

    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/prefer-query-object-syntax': 'off',

    'import/extensions': [
      'error',
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
        svg: 'always',
        json: 'always',
      },
    ],

    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.ts',
          '**/*.spec.ts',
          '**/*.page.ts',
          'vite.config.ts',
          'playwright.config.ts',
          'vitest.config.ts',
        ],
      },
    ],
  },
};

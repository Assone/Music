module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react-hooks/recommended',

    'airbnb',
    'airbnb/hooks',

    'plugin:@tanstack/eslint-plugin-query/recommended',

    'prettier',
  ],
  plugins: ['@typescript-eslint', 'react-refresh'],

  ignorePatterns: ['dist', '.eslintrc.cjs'],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.*.json'],
    tsconfigRootDir: __dirname,
  },

  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
      alias: {
        map: [
          ['@', './src/'],
          ['', './public/'],
        ],
        extensions: ['.ts', '.tsx', '.json'],
      },
    },
  },

  rules: {
    // eslint
    'no-undef': 'off',
    'no-shadow': 'off', // Typescript Enum
    'no-unused-vars': 'off',
    'no-redeclare': 'off',

    // typescript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // react
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': [
      'error',
      { namedComponents: ['function-declaration', 'arrow-function'] },
    ],
    'react/prop-types': 'off',

    // import
    'import/no-absolute-path': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.ts',
          '**/*.spec.ts',
          'server.js',
          'vite.config.ts',
        ],
      },
    ],
    'import/extensions': ['error', 'never', { svg: 'always' }],
  },
};

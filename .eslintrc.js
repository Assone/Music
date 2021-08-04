/**
 * @type import('eslint').Linter.Config
 */
const config = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  globals: {
    Model: 'readonly',
    Structure: 'readonly',
    NodeJS: 'readonly',
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['@test', './tests'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json', '.vue'],
      },
    },
    'import/extensions': ['.js', '.jsx', '.mjs', '.ts', '.tsx'],
  },
  extends: [
    'plugin:vue/base',
    'plugin:vue/vue3-recommended',
    'eslint-config-airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/script-setup-uses-vars': 'error',
    'import/extensions': [
      'error',
      'always',
      {
        ignorePackages: true,
        pattern: {
          js: 'never',
          mjs: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      },
    ],
    'vue/require-default-prop': 'off',
    'import/no-unresolved': [2, { ignore: ['@intlify/vite-plugin-vue-i18n.', 'vite-plugin-svg-icons/register'] }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
  overrides: [
    {
      files: ['src/apis/**/*.ts', 'src/composables/**/*.ts'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      files: ['src/apis/**/*.ts', 'src/models/**/*.ts'],
      rules: {
        'import/no-cycle': [2, { maxDepth: 1 }],
      },
    },
    {
      files: ['src/store/**/*.ts', 'src/plugins/**/*.ts', 'src/router/**/*.ts'],
      rules: {
        'no-param-reassign': 'off',
      },
    },
  ],
};

module.exports = config;

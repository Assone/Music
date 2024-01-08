module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",

    "airbnb",
    "airbnb/hooks",

    "plugin:@tanstack/eslint-plugin-query/recommended",

    "prettier",
  ],
  plugins: ["react-refresh"],

  ignorePatterns: ["dist", ".eslintrc.cjs"],

  parser: "@typescript-eslint/parser",

  settings: {
    "import/resolver": {
      node: true,
      alias: {
        map: [
          ["@", "./src/"],
          ["", "./public/"],
        ],
        extensions: [".ts", ".tsx", ".json"],
      },
    },
  },

  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    // eslint
    "no-undef": "off",

    // react
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react/react-in-jsx-scope": "off",
    "react/function-component-definition": [
      "error",
      { namedComponents: ["function-declaration", "arrow-function"] },
    ],

    // import
    "import/no-absolute-path": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/*.test.ts",
          "**/*.spec.ts",
          "vite.config.ts",
          "server.js",
        ],
      },
    ],
    "import/extensions": ["error", "never", { svg: "always" }],
  },
};

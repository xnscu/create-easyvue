/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");
module.exports = {
  root: true,
  env: {
    node: true,
    amd: true,
  },
  extends: [
    "./src/unplugin/.eslintrc-auto-import.json",
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-empty": 0,
    "prettier/prettier": [
      "warn",
      {
        singleQuote: false,
        trailingComma: "all", // when using rvest.vs-code-prettier-eslint, this needs to be configured
        printWidth: 100,
      },
    ],
    "max-len": ["warn", { code: 100, ignoreComments: true, ignoreStrings: true }],
    "prefer-const": [
      "error",
      {
        destructuring: "all",
        ignoreReadBeforeAssign: false,
      },
    ],
    "vue/no-unused-vars": [
      "warn",
      {
        ignorePattern: "^_",
      },
    ],
    "no-unused-vars": ["warn", { vars: "all", args: "after-used", argsIgnorePattern: "^_" }],
    "vue/multi-word-component-names": "off",
  },
};

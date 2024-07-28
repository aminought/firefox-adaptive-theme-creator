import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.all,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        chroma: "readonly",
      },
    },
  },
  {
    ignores: ["lib/*"],
  },
  {
    rules: {
      camelcase: "off",
      "guard-for-in": "off",
      "id-length": "off",
      "max-statements": "off",
      "no-await-in-loop": "off",
      "no-continue": "off",
      "no-magic-numbers": "off",
      "max-lines-per-function": "off",
      "max-params": "off",
      "no-param-reassign": "off",
      "no-plusplus": "off",
      "no-ternary": "off",
      "one-var": "off",
      "sort-keys": "off",
      "sort-vars": "off",
    },
  },
];

/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },

  overrides: [
    {
      files: ["confetti.js"],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: null,
      },
      rules: {
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
      },
    },
    {
      files: [
        "src/app/voice-llm/page.tsx",
        "src/components/VoiceRecorder.tsx",
      ],
      parserOptions: {
        project: null,
      },
      rules: {
        "@typescript-eslint/no-misused-promises": "off",
      },
    },
    {
      files: ["src/env.js"],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/consistent-type-imports": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/consistent-type-definitions": "off",
      },
    },
  ],

  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
  },
};
module.exports = config;

import { config as eslintConfigBase } from "@repo/eslint-config/base";

export default [
  ...eslintConfigBase,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
  {
    ignores: ["*.config.*", "dist/**"],
  },
];
// @ts-check
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import cds from "@sap/eslint-plugin-cds";

export default defineConfig(
  {
    ignores: ["coverage/**", "dist/**", "@cds-models/**", "node_modules/**"],
  },
  {
    files: ["src/**/*.{js,ts}", "*.cds"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      cds.configs.recommended,
      { rules: { "@typescript-eslint/no-unused-expressions": "off" } },
    ],
    languageOptions: {
      parserOptions: { project: true, tsconfigRootDir: import.meta.dirname },
    },
  },
);

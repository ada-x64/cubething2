/////////////////////////////// cubething.dev /////////////////////////////////

// @ts-check

import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  {
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
    },
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    extends: tseslint.configs.strict,
  },
  {
    ignores: ["www/", "node_modules/"],
  },
);

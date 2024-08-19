// @ts-check

import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
	eslint.configs.recommended,
	{
		rules: {
			"no-console": "off",
		},
		languageOptions: {
			globals: { ...globals.node, ...globals.browser },
		},
		extends: tseslint.configs.strict,
	},
	{
		ignores: ["dist/", "node_modules/"],
	},
);

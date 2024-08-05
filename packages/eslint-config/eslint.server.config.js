import baseConfig from "./eslint.base.config.js";
import globals from "globals";
import next from "@next/eslint-plugin-next";
import { fixupConfigRules } from "@eslint/compat";
import flatCompat from "./compat.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
    ...baseConfig,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                React: false,
                JSX: false
            }
        },
    }
];

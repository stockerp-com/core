import baseConfig from "./eslint.base.config.js";
import globals from "globals";

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

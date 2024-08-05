import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from 'eslint-plugin-prettier/recommended'
import globals from "globals";

export default [
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
            parserOptions: {
                project: resolve(process.cwd(), "tsconfig.json")
            },
        }
    },
    {
        ignores: [
            ".*.?(c)js",
            "*.config*.?(c)js",
            ".*.ts",
            "*.config*.ts",
            "*.d.ts",
            "dist",
            ".git",
            "node_modules",
            "build",
            ".next",
            "*rollup*"
        ]
    },
    js.configs.recommended,
    prettier
]

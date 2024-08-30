import server from '@core/eslint-config/eslint.config.server.js';
import { resolve } from 'path';

export default [
    ...server,
    {
        languageOptions: {
            parserOptions: {
                project: resolve(process.cwd(), "tsconfig.json")
            },
        }
    },
];

import base from '@retailify/eslint-config/eslint.config.base.js';
import { resolve } from 'path';

export default [
  ...base,
  {
    languageOptions: {
      parserOptions: {
        project: resolve(process.cwd(), "tsconfig.json")
      },
    }
  },
];

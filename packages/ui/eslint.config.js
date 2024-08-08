import react from '@retailify/eslint-config/eslint.config.react.js';
import { resolve } from 'path';

export default [
  ...react,
  {
    languageOptions: {
      parserOptions: {
        project: resolve(process.cwd(), "tsconfig.json")
      },
    }
  },
];

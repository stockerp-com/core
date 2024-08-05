import globals from 'globals'
import base from './eslint.config.base.js'
import react from "eslint-plugin-react";

export default [
    ...base,
    react.configs.flat.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser
            }
        }
    }
]

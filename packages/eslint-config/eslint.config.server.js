import globals from 'globals'
import base from './eslint.config.base.js'

export default [
    ...base,
    {
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    }
]

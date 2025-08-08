import pluginJs from '@eslint/js'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { globals: globals.browser } },
  { ignores: ['**/*.config.js'] },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-var': 'error',
      'no-console': 'error',
    },
  },
]

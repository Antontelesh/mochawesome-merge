import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['**/coverage'],
  },
  ...compat.extends('eslint:recommended', 'prettier'),
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 2024,
      sourceType: 'module',

      parserOptions: {
        impliedStrict: true,
      },
    },

    rules: {
      'no-console': 0,
    },
  },
  {
    files: ['tests/**/*.{js,ts}'],

    languageOptions: {
        globals: {
          ...globals.jest,
        },
  
        ecmaVersion: 2024,
        sourceType: 'module',
  
        parserOptions: {
          impliedStrict: true,
        },
      },
  
      rules: {
        'no-console': 0,
      },
  }
]

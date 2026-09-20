import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  // Exclude build output, coverage reports, native projects, and skill resources.
  globalIgnores(['dist', 'dev-dist', 'dist-ssr', 'coverage', 'android', 'ios', '.agents']),
  // JavaScript files: core ESLint checks and Node.js globals.
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
  // TypeScript: core checks and type-aware rules (for example, Promise handling).
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        // Read type information from the tsconfig associated with each file.
        projectService: {
          // These tooling files are not included in the existing tsconfig projects.
          allowDefaultProject: ['capacitor.config.ts', 'jest.config.ts', 'jest.setup.ts'],
        },
        // Resolve paths from the project root regardless of where ESLint is run.
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Application source: React, JSX, Hooks, and Vite Fast Refresh compatibility.
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      react.configs.flat.recommended,
      // The modern JSX transform does not require importing React in every component.
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    settings: {
      // Match React checks to the installed library version.
      react: { version: 'detect' },
    },
    rules: {
      // TypeScript checks prop types, so PropTypes are not required.
      'react/prop-types': 'off',
    },
  },
  // Tool configuration and Jest setup: add Node.js globals.
  {
    files: ['*.config.ts', 'jest.setup.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
])

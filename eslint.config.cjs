const globals = require('globals');
const tseslint = require('typescript-eslint');
const jestPlugin = require('eslint-plugin-jest');
const prettierConfig = require('eslint-config-prettier');

// Globals for Google Apps Script environment
const googleAppsScriptGlobals = {
  Logger: 'readonly',
  SpreadsheetApp: 'readonly',
  DocumentApp: 'readonly',
  CalendarApp: 'readonly',
  DriveApp: 'readonly',
  HtmlService: 'readonly',
  PropertiesService: 'readonly',
  UrlFetchApp: 'readonly',
  Utilities: 'readonly',
  Session: 'readonly',
  CacheService: 'readonly',
  MailApp: 'readonly',
  FormApp: 'readonly',
  SitesApp: 'readonly',
  ContentService: 'readonly',
  CardService: 'readonly',
};

module.exports = tseslint.config(
  // 1. Global ignores
  {
    ignores: [
      'build/',
      'coverage/',
      'node_modules/',
      '.clasp.json',
      '.claspignore',
      'appsscript.json',
    ],
  },

  // 2. Base configurations for all files
  tseslint.configs.eslintRecommended,

  // 3. Configuration for Node.js files (e.g., config files)
  {
    files: ['**/*.js', '**/*.cjs'],
    ignores: ['src/**/*.js'], // Exclude source files which are for GAS
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },

  // 4. Configuration for Google Apps Script source files (TypeScript)
  {
    files: ['src/**/*.ts'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.es2021,
        ...googleAppsScriptGlobals,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },

  // 5. Configuration for Google Apps Script source files (JavaScript)
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.es2021,
        ...googleAppsScriptGlobals,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // 6. Jest/test files configuration
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs['flat/recommended'],
    },
  },

  // 7. Prettier configuration (must be last)
  prettierConfig,
);

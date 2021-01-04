/** @format */

// https://eslint.org/docs/user-guide/configuring
const path = require('path');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:import/react',
    'prettier',
    'prettier/react',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
  ],
  // required to lint *.vue files
  plugins: ['react', 'jest', 'react-hooks', 'testing-library', 'jest-dom'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
      webpack: {
        /* 跑 eslint 的時候，實際上是執行 junyiacademy root 的 .eslintrc
         * 所以 __dirname 會指向 junyiacademy 的 root path
         */
        config: path.join(__dirname, '/webpack.prod.js'),
        'config-index': 0,
      },
    },
    react: {
      version: '16.13.1',
    },
  },
  // add your custom rules here
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-underscore-dangle': 0,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    radix: ['error', 'as-needed'],
    'max-classes-per-file': ['warn', 1]
    'max-len': [
      1,
      120,
      2,
      {
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
        ignoreUrls: true,
        ignoreStrings: true,
      },
    ],
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'jsx-quotes': ['error', 'prefer-double'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'testing-library/no-debug': 'error',
    'no-unused-vars': [
      'error',
      { varsIgnorePattern: '[iI]gnored', argsIgnorePattern: '^_' },
    ],
  },
};

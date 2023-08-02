module.exports = {
  extends: ['plugin:@rnx-kit/recommended'],
  rules: {
    '@rnx-kit/no-const-enum': 'error',
    '@rnx-kit/no-export-all': 'error',

    'react/react-in-jsx-scope': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ]
  },
  ignorePatterns: ['**/lib/*', '**/dist/*', '**/.tmp/*', '**/node_modules/*']
};

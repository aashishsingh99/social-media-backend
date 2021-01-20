module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'prefer-destructuring': 0,
    'no-console': 0,
    'consistent-return': 0,
    'no-underscore-dangle': 0,
    'no-shadow': 0,
  },
};

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    'prettier/prettier': ['error', { printWidth: 150, endOfLine: 'auto' }],
  },
};

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
    'prettier/prettier': ['error', { printWidth: 150 }], // 줄바꿈 150 적용을 위해 해당 부분 추가
  },
};

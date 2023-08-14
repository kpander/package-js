module.exports = {
  env: {
    browser: false,
    commonjs: false,
    es6: true,
    node: false
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 6
  },
  rules: {
    "no-console": 0
  }
};

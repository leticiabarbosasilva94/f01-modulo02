module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'prettier'
  ],
  rules: {
    "prettier/prettier": ["error", { "singleQuote": true }],
    "class-method-use-this": "off",
    "no-param-reasign": "off",
    "camel-case": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
    "quotes": ["error", "single"]
  },
};

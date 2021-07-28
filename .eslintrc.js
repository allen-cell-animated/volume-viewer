module.exports = {
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  env: {
    browser: true,
    es6: true,
    mocha: true,
  },
  parserOptions: {
    ecmaVersion: "2020",
    sourceType: "module",
  },
  rules: {
    camelcase: "off",
    "no-unused-vars": [1, { args: "none" }],
  },
};

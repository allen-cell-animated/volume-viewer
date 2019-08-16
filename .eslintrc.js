module.exports = {
  "extends": ["plugin:@typescript-eslint/recommended"],
  "env": {
    "mocha": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"]
};

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    ["@babel/plugin-transform-runtime"],
    [
      "babel-plugin-inline-import",
      {
        extensions: [".obj"],
      },
    ],
    [
      "inline-import-data-uri",
      {
        extensions: [".png"],
      },
    ],
  ],
};

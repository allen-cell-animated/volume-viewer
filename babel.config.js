export default {
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
        extensions: [".obj", ".frag", ".vert", ".glsl", ".fs", ".vs"],
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

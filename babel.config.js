export default {
  presets: ["@babel/preset-typescript"],
  plugins: [
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

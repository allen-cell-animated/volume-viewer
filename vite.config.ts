import type { UserConfig } from "vite";

// We want to be able to import glsl shaders without url decorations like ?raw.
// This is because we still build the distribution with babel/tsc and don't want
// to use nonstandard import syntax there.
import glsl from "vite-plugin-glsl";

export default {
  plugins: [glsl()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  server: {
    open: "public/index.html",
  },
  worker: {
    format: "es",
  },
} satisfies UserConfig;

import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolve } from "path";
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "es/test/*"],
  },
  worker: { format: "es" },
  build: {
    lib: { entry: resolve(__dirname, "src/index.ts"), formats: ["es"], name: "@aics/volume-viewer" },
    sourcemap: true,
    rollupOptions: {
      // treat all ts files as entry points so that they are translated preserving the directory structure
      input: Object.fromEntries(
        globSync("src/**/*.ts", { ignore: ["src/test/**/*.ts", "node_modules"] }).map((file) => [
          // This remove `src/` as well as the file extension from each
          // file, so e.g. src/nested/foo.js becomes nested/foo
          path.relative("src", file.slice(0, file.length - path.extname(file).length)),
          // This expands the relative paths to absolute paths, so e.g.
          // src/nested/foo becomes /project/src/nested/foo.js
          fileURLToPath(new URL(file, import.meta.url)),
        ])
      ),
      output: {
        format: "es",
        dir: "es",
        // treat all ts files as entry points so that they are translated preserving the directory structure
        entryFileNames: "[name].js",
      },
    },
  },
  resolve: { alias: { src: resolve("src/") } },
});

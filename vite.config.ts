import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import glob from "glob";

const tests = glob.sync(resolve(__dirname, "src/**/test/**/*.{js,ts}"));

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    outDir: resolve(__dirname, "es"),
    emptyOutDir: true,

    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "volume-viewer",
      fileName: "volume-viewer",
      formats: ["es"],
    },
    rollupOptions: {
      input: glob.sync(resolve(__dirname, "src/**/*.{js,css}")),
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: ({ name: fileName }) => {
          return `${fileName}.js`;
        },
      },
      external: ["chai", "mocha"],
    },
  },
  plugins: [dts()],
});

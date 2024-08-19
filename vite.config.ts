import { resolve } from "path";
import { defineConfig } from "vite";
import glob from "glob";
import { configDefaults } from 'vitest/config'

const tests = glob.sync(resolve(__dirname, "src/**/test/**/*.{js,ts}"));

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  test: {
    exclude:[
      ...configDefaults.exclude,
      'es/test/*',
    ]
  },
  build: {

  },
});

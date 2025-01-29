import type { UserConfig } from "vite";

export default {
    plugins: [],
    define: {
        "APP_VERSION": JSON.stringify(process.env.npm_package_version),
    },
    server: {
        open: "public/index.html",
    },
    worker: {
        format: "es",
    },
} satisfies UserConfig;

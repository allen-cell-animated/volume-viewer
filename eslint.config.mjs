import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
).map(config => ({
    ...config,
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    ignores: [
        "**/test/*",
        "**/MarchingCubes.ts",
        "**/NaiveSurfaceNets.js",
    ],
})), {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    ignores: [
        "**/test/*",
        "**/MarchingCubes.ts",
        "**/NaiveSurfaceNets.js",
    ],

    plugins: {
        "@typescript-eslint": typescriptEslint,
        react,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.mocha,
        },
    },

    rules: {
        "@typescript-eslint/no-empty-object-type": ["warn"],
        "@typescript-eslint/no-unsafe-function-type": ["warn"],
        "@typescript-eslint/no-wrapper-object-types": ["warn"],

        "@typescript-eslint/naming-convention": ["warn", {
            selector: "default",
            format: ["camelCase", "PascalCase"],
        }, {
            selector: "variable",
            format: ["camelCase", "UPPER_CASE"],
        }, {
            selector: "property",
            format: ["camelCase", "UPPER_CASE"],
        }, {
            selector: "typeLike",
            format: ["PascalCase"],
        }, {
            selector: "enumMember",
            format: ["UPPER_CASE"],
        }, {
            selector: "parameter",
            format: ["camelCase"],
            leadingUnderscore: "allow",
        }],

        "@typescript-eslint/indent": ["off"],
        "@typescript-eslint/no-empty-function": ["warn"],
        "@typescript-eslint/no-inferrable-types": ["warn"],
        "@typescript-eslint/no-this-alias": ["warn"],
        "@typescript-eslint/no-unused-expressions": ["warn"],
        "@typescript-eslint/no-duplicate-enum-values": ["warn"],
        "prefer-const": ["warn"],
        "prefer-spread": ["warn"],
        "no-var": ["warn"],
        "no-unused-vars": "off",

        "@typescript-eslint/no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
        }],
    },
}];
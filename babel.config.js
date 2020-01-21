module.exports = {
    "presets": [
        "@babel/preset-env",
    ],
    "env": {
        "es": {
            "presets": [
                ["@babel/preset-env", {
                    "modules": false,
                }],
            ],
        },
    },
    "plugins": [
        ["babel-plugin-inline-import", {
            "extensions": [".obj"],
        }],
        ["inline-import-data-uri", {
            "extensions": [".png"],
        }],
    ],
};

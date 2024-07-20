import globals from "globals";
import js from "@eslint/js";

export default [
    js.configs.all,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.webextensions,
                Cache: "readonly",
                Options: "readonly",
                Theme: "readonly",
                calculateFgColor: "readonly",
                chroma: "readonly",
                fixImages: "readonly",
                getMostPopularColor: "readonly",
                limitSaturation: "readonly",
                notifyNotCompatible: "readonly",
                notifyOptionsUpdated: "readonly",
            },
        },
    },
    {
        ignores: ["lib/*"],
    },
    {
        rules: {
            "camelcase": "off",
            "id-length": "off",
            "max-statements": "off",
            "no-await-in-loop": "off",
            "no-continue": "off",
            "no-magic-numbers": "off",
            "no-param-reassign": "off",
            "no-plusplus": "off",
            "no-ternary": "off",
            "one-var": "off",
            "sort-vars": "off",
        }
    }
];

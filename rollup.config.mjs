import { terser } from "rollup-plugin-terser"

export default [
    {
        input: "src/index.mjs",
        external: [
            "fs",
            "path",
            "lodash",
            "events",
            "dotenv",
            "telegram",
            "telegram/sessions/index.js",
            "telegram/extensions/index.js",
        ],
        plugins: [terser()],
        output: [
            {
                file: "dist/esm/index.mjs",
                format: "es",
                compact: true,
            },
            {
                file: "dist/cjs/index.cjs",
                format: "cjs",
                compact: true,
            },
        ],
    },
]

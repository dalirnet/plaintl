import { terser } from "rollup-plugin-terser"

export default [
    {
        input: "src/index.mjs",
        external: ["fs", "path", "lodash", "events", "dotenv", new RegExp("telegram")],
        plugins: [terser()],
        output: [
            {
                file: "dist/index.mjs",
                format: "es",
                compact: true,
            },
            {
                file: "dist/index.cjs",
                format: "cjs",
                compact: true,
            },
        ],
    },
]

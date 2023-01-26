// @ts-check
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonJs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { defineConfig } from "rollup";

export default defineConfig([
  {
    input: ["src/index.ts", "src/client.ts"],
    output: {
      dir: "dist",
      format: "es",
    },
    // Rollup works bad with chalk.
    // https://github.com/chalk/supports-color/issues/113
    external: ["chalk"],
    plugins: [
      nodeResolve(),
      commonJs(),
      json(),
      typescript()
    ],
  },
]);

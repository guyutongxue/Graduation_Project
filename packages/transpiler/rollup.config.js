// @ts-check
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig([
  {
    input: ["src/index.ts"],
    output: {
      dir: "dist",
      format: "es",
    },
    external: [/^node:/],
    plugins: [typescript({ tsconfig: "tsconfig.json" })],
  },
]);

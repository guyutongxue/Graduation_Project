import { transform } from "@babel/standalone";
import { RuleSyntaxError } from "./errors.js";
import babelPlugin from "./plugin.js";

const TEST_SRC = `
"use web";
{
  assert: $.title == "Hello, World";
  $("#hello").click();
  assert: "Hello, JavaScript" in $("body").html;
}
`;

export function transpile(src: string) {
  return transform(src, {
    filename: "test.rule.js",
    sourceType: "module",
    plugins: [babelPlugin],
  });
}

export { babelPlugin };

// console.log(transpile(TEST_SRC).code);

export * from "./types.js";
export * from "./errors.js";

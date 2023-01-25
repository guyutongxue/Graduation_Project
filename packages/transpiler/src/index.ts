import { transform } from "@babel/standalone";
import { RuleSyntaxError } from "./errors";
import plg from "./plugin";

const TEST_SRC = `
"use web";
{
  assert: $.title == "Hello, World";
  $("#hello").click();
  assert: "Hello, JavaScript" in $("body").html;
}
`;

export function transpile(src: string) {
  try {
    const r = transform(src, {
      filename: "test.rule.js",
      sourceType: "module",
      plugins: [plg],
    });
    console.log(r.code);
  } catch (e) {
    if (e instanceof RuleSyntaxError) {
      console.log(e.position);
    } else {
      console.error(e);
    }
  }
}

transpile(TEST_SRC);

export * from "./types";
export * from "./errors";

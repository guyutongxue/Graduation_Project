import { babelPlugin } from "transpiler";
import { PluginObj, transformAsync } from "@babel/core";
import tmp from "tmp-promise";
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { Controller } from "./client.js";

const TEST_SRC = `
"use web";
{
  assert: $.title == "Hello, World";
  $("#hello").click();
  assert: "Hello, JavaScript" in $("body").html;
}`;

const clientUrl = new URL("./client.js", import.meta.url);

const result = await transformAsync(TEST_SRC, {
  plugins: [
    babelPlugin,
    (): PluginObj => {
      return {
        visitor: {
          ImportDeclaration(path) {
            if (path.node.source.value === "graduate") {
              path.node.source.value = clientUrl.href;
            }
          }
        }
      }
    }
  ]
});
if (result === null) {
  throw new Error("Empty code");
}
const { code } = result;
if (typeof code === "undefined" || code === null) {
  throw new Error("Empty code");
}

tmp.setGracefulCleanup();

const controller = await tmp.withFile(async ({ path }) => {
  fs.writeFile(path, code);
  const controller: Controller = (await import(pathToFileURL(path).href)).default;
  return controller;
}, { postfix: ".mjs" });

await (controller.useDirectorySource ? tmp.withDir : tmp.withFile)(async ({ path }) => {
  await controller.run(path);
});

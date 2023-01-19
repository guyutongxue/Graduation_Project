import * as tmp from "tmp-promise";
import chalk from "chalk";
import { writeFile, copyFile, rm } from "node:fs/promises";
import { pathToFileURL, fileURLToPath } from "node:url";

import { launch } from "./browser";
import { Server } from "./server";

import { transpile } from "transpiler";
import { AssertionError, check } from "./check";

const HELLOWORLD_RULE = `export default {
  cases: [
      function (page) {
          expect(page).title().eq("Hello, world");
          expect(page.$("h1")).text().eq("Hello, world!");
      }
  ]
}`;

const HELLO_JS_RULE = `
"use web";
{
  assert: $.title == "Hello, JavaScript";
  $("#hello").click();
  assert: "Hello, JavaScript!" in $("body").html;
}`

async function startServer() {
  const { path } = await tmp.dir();
  const HTML_PATH = fileURLToPath(
    new URL("../examples/hello_js-ok.html", import.meta.url).href
  );
  await copyFile(HTML_PATH, `${path}/index.html`);
  const server = new Server(path);
  await server.listen();
  return {
    address: server.address()!,
    dispose: () => server.dispose(true),
  };
}

const actions = await transpile(HELLO_JS_RULE);
// console.log(actions);
const { address, dispose } = await startServer();
const { browser, page } = await launch(address);
for (const case_ of actions) {
  try {
    await check(page, case_);
    console.log(chalk.green("ACCEPTED"));
  } catch (err) {
    if (err instanceof AssertionError) {
      console.log(chalk.red("FAILED"));
      break;
    }
    throw err;
  }
}
await browser.close();
await dispose();

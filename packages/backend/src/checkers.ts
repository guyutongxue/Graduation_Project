import { ChildProcess, execFile, fork } from "node:child_process";
import jayson from "jayson/promise/index.js";
import type { Category } from "transpiler";
import { fileURLToPath } from "node:url";
import waitPort from "wait-port";
import getPort from "get-port";

import { JudgeError } from "./error.js";
import type { RawRequest } from "./client.js";

export class Checker {
  #process: ChildProcess;
  #client: jayson.Client;
  constructor(cp: ChildProcess, client: jayson.Client) {
    this.#process = cp;
    this.#client = client;
  }

  static async fromProcess(cp: ChildProcess, port: number) {
    await waitPort({
      port,
      // output: "silent"
    });
    const client = jayson.Client.http({
      port,
      timeout: 10000,
    });
    return new Checker(cp, client);
  }

  async #sendImpl(method: string, param?: any) {
    param = typeof param === "undefined" ? []: [param];
    console.log({ method, param });
    const response = await this.#client.request(method, param);
    console.log(response);
    if (!jayson.utils.Response.isValidResponse(response)) {
      throw new JudgeError(
        "ConnectionFailure",
        `Invalid response for method ${method}`
      );
    }
    if ("result" in response) {
      return response.result;
    } else {
      throw new JudgeError(
        "UnmetPrecondition",
        `${method} = (${response.error.code}) ${response.error.message}`
      );
    }
  }

  async initialize(sourcePath: string) {
    return this.#sendImpl("initialize", sourcePath);
  }

  async restart() {
    return this.#sendImpl("restart");
  }

  async send(command: RawRequest) {
    const param: any = { ...command };
    delete param.method;
    return this.#sendImpl(command.method, param);
  }

  async dispose() {
    await this.#sendImpl("dispose");
    this.#process.kill();
  }
}

async function createWebChecker() {
  const port = await getPort();
  const process = fork(
    fileURLToPath(
      new URL("../../webcheck/dist/index.js", import.meta.url).href
    ),
    [port.toString()]
  );
  return Checker.fromProcess(process, port);
}

async function createFormChecker() {
  const port = await getPort();
  console.log(
    new URL(
      "../../formcheck/formcheck/bin/Debug/net7.0-windows/formcheck.exe",
      import.meta.url
    ).href);
  const process = execFile(
    fileURLToPath(
      new URL(
        "../../formcheck/formcheck/bin/Debug/net7.0-windows/formcheck.exe",
        import.meta.url
      ).href
    ),
    [port.toString()]
  );
  return Checker.fromProcess(process, port);
}

export async function createChecker(category: Category) {
  switch (category) {
    case "web":
      return createWebChecker();
    case "form":
      return createFormChecker();
    default:
      const _: never = category;
      throw new JudgeError("UnknownCategory");
  }
}

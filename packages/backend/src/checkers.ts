import { ChildProcess, fork } from "node:child_process";
import jayson from "jayson/promise/index.js";
import type { AllCommand, Category } from "transpiler";
import { fileURLToPath } from "node:url";
import waitPort from "wait-port";
import getPort from "get-port";

type RawRequest = {
  method: string;
} & unknown;

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

  async #sendImpl(method: string, param: any) {
    const response = await this.#client.request(method, [param]);
    console.log(response);
    if ("result" in response) {
      return response.result;
    } else {
      throw new Error(
        `send ${method} failed, ${response.error.code}: ${response.error.message}`
      );
    }
  }

  async initialize(sourcePath: string) {
    return this.#sendImpl("initialize", sourcePath);
  }

  async send(command: RawRequest) {
    const param: any = { ...command };
    delete param.method;
    return this.#sendImpl(command.method, param);
  }

  async dispose() {
    await this.#sendImpl("dispose", void 0);
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

export async function createChecker(category: Category) {
  switch (category) {
    case "web":
      return createWebChecker();
    default:
      const _: never = category;
      throw new Error();
  }
}

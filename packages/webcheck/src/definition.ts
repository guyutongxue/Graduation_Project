import { launch } from "./browser.js";
import { Server } from "./server.js";
import { Browser, Page } from "puppeteer-core";
import jayson from "jayson/promise/index.js";
import type { MethodLike } from "jayson/promise";

function assert(cond: boolean, message?: string) {
  if (!cond) {
    rpcServer.error(510, message);
    throw new Error(message);
  }
}


export class Handler {
  #htmlServer: Server | null = null;
  #browserContext: {
    page: Page,
    browser: Browser,
  } | null = null;

  async initialize(path: string) {
    if (this.#htmlServer) {
      return rpcServer.error(501, "HTML server already started");
    }
    this.#htmlServer = await Server.create(path);
    if (this.#browserContext) {
      return rpcServer.error(502, "Puppeteer browser already started");
    }
    this.#browserContext = await launch(this.#htmlServer.address());
    return true;
  }

  async dispose() {
    if (this.#browserContext) {
      await this.#browserContext.browser.close();
      this.#browserContext = null;
    }
    if (this.#htmlServer) {
      await this.#htmlServer.dispose();
      this.#htmlServer = null;
    }
    return true;
  }

  async page({ component }: any) {
    if (!this.#browserContext) { throw new Error("browser not loaded"); }
    switch (component) {
      case "html":
        return this.#browserContext.page.evaluate(() => document.documentElement.outerHTML);
      case "text":
        return this.#browserContext.page.evaluate(() => document.body.innerText);
      case "title":
        return this.#browserContext.page.title();
      default:
        throw new Error(`Unknown component ${component}`);
    }
  }

  async selector({ selector, component }: any) {
    if (!this.#browserContext) { throw new Error("browser not loaded"); }
    const target = await this.#browserContext.page.$$(selector);
      switch (component) {
        case "html":
          assert(target.length === 1, `Selector target ${selector} not exists or not unique`);
          return target[0].evaluate(e => e.textContent);
        case "text":
          assert(target.length === 1, `Selector target ${selector} not exists or not unique`);
          return target[0].evaluate(e => e.innerHTML);
        case "count":
          return target.length;
        default:
          throw new Error(`Unknown component ${component}`);
      }
  }
  async click({ selector }: any) {
    if (!this.#browserContext) { throw new Error("browser not loaded"); }
    const target = await this.#browserContext.page.$$(selector);
    assert(target.length === 1, `Selector target ${selector} not exists or not unique`);
    await target[0].click();
    await new Promise(r => setTimeout(r, 100));
  }
  key!: (param: any) => Promise<any>;
  value!: (param: any) => Promise<any>;
}

let rpcServer: jayson.Server = undefined!;

export function createServer() {
  const server = new Handler();
  const init: Record<string, MethodLike> = {};
  for (const key of Object.getOwnPropertyNames(Handler.prototype)) {
    const { value } = Object.getOwnPropertyDescriptor(Handler.prototype, key)!;
    if (key !== "constructor" && typeof value === "function") {
      init[key] = async (args: unknown) => {
        if (!Array.isArray(args)) {
          return rpcServer.error(400, "Argument list not array");
        }
        try {
          const result = await value.call(server, ...args);
          return result;
        } catch (e) {
          if (e instanceof Error) {
            return rpcServer.error(510, e.message);
          } else {
            throw e;
          }
        }
      }
    }
  }
  console.log(init);
  return rpcServer = jayson.Server(init);
}


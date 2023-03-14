import { launch } from "./browser.js";
import { Server } from "./server.js";
import { Browser, Page } from "puppeteer-core";
import jayson from "jayson/promise/index.js";
import type { MethodLike } from "jayson/promise";

function assert(cond: boolean, message?: string): asserts cond {
  if (!cond) {
    throw new Error(message);
  }
}

export class Handler {
  #htmlServer: Server | null = null;
  #browserContext: {
    page: Page;
    browser: Browser;
  } | null = null;

  #assertSingle<T>(elem: T[], description = "Target"): T {
    assert(elem.length === 1, `${description} not exists or not unique`);
    return elem[0];
  }

  async initialize(path: string) {
    assert(!this.#htmlServer, "HTML server already started");
    this.#htmlServer = await Server.create(path);
    assert(!this.#browserContext, "Puppeteer browser already started");
    this.#browserContext = await launch(this.#htmlServer.address());
    return true;
  }

  async restart() {
    assert(!!this.#browserContext, "browser not loaded");
    await this.#browserContext.page.reload({ waitUntil: "networkidle2" });
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
    assert(!!this.#browserContext, "browser not loaded");
    switch (component) {
      case "html":
        return this.#browserContext.page.evaluate(
          () => document.documentElement.outerHTML
        );
      case "text":
        return this.#browserContext.page.evaluate(
          () => document.body.textContent
        );
      case "title":
        return this.#browserContext.page.title();
      default:
        throw new Error(`Unknown component ${component}`);
    }
  }

  async selector({ selector, component }: any) {
    assert(!!this.#browserContext, "browser not loaded");
    const target = await this.#browserContext.page.$$(selector);
    switch (component) {
      case "html": {
        const t = this.#assertSingle(target, selector);
        return t.evaluate((e) => e.innerHTML);
      }
      case "text": {
        const t = this.#assertSingle(target, selector);
        return t.evaluate((e) => e.innerText);
      }
      case "count":
        return target.length;
      case "value": {
        const t = this.#assertSingle(target, selector);
        const isInput = await t.evaluate((e) => e instanceof HTMLInputElement);
        assert(isInput, `Selector target ${selector} is not input element`);
        return t.evaluate((e) => e.value);
      }
      default:
        throw new Error(`Unknown component ${component}`);
    }
  }
  async click({ selector }: any) {
    assert(!!this.#browserContext, "browser not loaded");
    const target = await this.#browserContext.page.$$(selector);
    const t = this.#assertSingle(target, selector);
    await t.click();
    await new Promise((r) => setTimeout(r, 100));
  }

  async key({ key }: any) {
    assert(!!this.#browserContext, "browser not loaded");
    await this.#browserContext.page.keyboard.press(key);
  }

  async input({ selector, value }: any) {
    assert(!!this.#browserContext, "browser not loaded");
    const target = await this.#browserContext.page.$$(selector);
    const t = this.#assertSingle(target, selector);
    const isInput = await t.evaluate((e) => e instanceof HTMLInputElement);
    assert(isInput, `Selector target ${selector} is not input element`);
    await t.evaluate((e, v) => (e.value = v), value);
    await new Promise((r) => setTimeout(r, 100));
  }

  async attribute({ selector, attribute }: any) {
    assert(!!this.#browserContext, "browser not loaded");
    const target = await this.#browserContext.page.$$(selector);
    const t = this.#assertSingle(target, selector);
    return t.evaluate((e, a) => e.getAttribute(a), attribute);
  }

  async style({ selector, property }: any) {
    assert(!!this.#browserContext, "browser not loaded");
    const target = await this.#browserContext.page.$$(selector);
    const t = this.#assertSingle(target, selector);
    return t.evaluate(
      (e, p) => window.getComputedStyle(e).getPropertyValue(p),
      property
    );
  }
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
            throw rpcServer.error(510, e.message);
          } else {
            throw e;
          }
        }
      };
    }
  }
  console.log(init);
  return (rpcServer = jayson.Server(init));
}

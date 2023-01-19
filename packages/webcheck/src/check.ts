import type { Browser, KeyInput, Page } from "puppeteer-core";
import type { Action, Operator, AssertExpression } from "transpiler";

export class AssertionError extends Error {
  constructor() {
    super("Assertion failed.");
  }
}

function failIfFalse(expr: boolean) {
  if (!expr) {
    throw new AssertionError;
  }
}

function assert(lhs: any, rhs: any, op: Operator) {
  console.log({ lhs, rhs, op});
  switch (op) {
    case "eq":
      failIfFalse(lhs === rhs);
      break;
    case "neq":
      failIfFalse(lhs !== rhs);
      break;
    case "lt":
      failIfFalse(
        typeof lhs === "number" && typeof rhs === "number" && lhs < rhs
      );
      break;
    case "gt":
      failIfFalse(
        typeof lhs === "number" && typeof rhs === "number" && lhs > rhs
      );
      break;
    case "lteq":
      failIfFalse(
        typeof lhs === "number" && typeof rhs === "number" && lhs <= rhs
      );
      break;
    case "gteq":
      failIfFalse(
        typeof lhs === "number" && typeof rhs === "number" && lhs >= rhs
      );
      break;
    case "in":
      failIfFalse(
        typeof lhs === "string" && typeof rhs === "string" && rhs.includes(lhs)
      );
      break;
  }
}

async function eval_(page: Page, expr: AssertExpression) {
  switch (expr.target) {
    case "constant": return expr.value;
    case "page": return page.title();
    case "selector":
      const selector = await page.$$(expr.selector);
      switch (expr.component) {
        case "html":
          failIfFalse(selector.length === 1);
          return selector[0].evaluate(e => e.textContent);
        case "text":
          failIfFalse(selector.length === 1);
          return selector[0].evaluate(e => e.innerHTML);
        case "count":
          return selector.length;
        default:
          throw new Error("Unknown component");
      }
    default:
      throw new Error("Unknown target");
  }
}

export async function check(page: Page, actions: Action[]) {
  for (const action of actions) {
    if (action.type === "assert") {
      const lhs = await eval_(page, action.lhs);
      const rhs = await eval_(page, action.rhs);
      assert(lhs, rhs, action.operator);
    } else if (action.type === "control") {
      if (action.selector) {
        const selector = await page.$(action.selector);
        if (action.how === "click") {
          await selector.click();
        } else if (action.how === "value") {
          failIfFalse(await selector.evaluate(e => e.tagName) === "input");
          await selector.evaluate((e, v) => (<HTMLInputElement>e).value = v, action.value);
        } else if (action.how === "key") {
          page.keyboard.press(action.key as KeyInput); // TODO
        }
      }
      await new Promise(r => setTimeout(r, 100));
    }
  }
}

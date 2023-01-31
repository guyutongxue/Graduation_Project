import type { Browser, KeyInput, Page } from "puppeteer-core";

export class AssertionError extends Error {
  constructor() {
    super("Assertion failed.");
  }
}

export function qAssert(expr: boolean, message?: string) {
  if (!expr) {
    throw new Error(message);
  }
}

// function __assert(lhs: any, rhs: any, op: Operator) {
//   console.log({ lhs, rhs, op});
//   switch (op) {
//     case "eq":
//       qAssert(lhs === rhs);
//       break;
//     case "neq":
//       qAssert(lhs !== rhs);
//       break;
//     case "lt":
//       qAssert(
//         typeof lhs === "number" && typeof rhs === "number" && lhs < rhs
//       );
//       break;
//     case "gt":
//       qAssert(
//         typeof lhs === "number" && typeof rhs === "number" && lhs > rhs
//       );
//       break;
//     case "lteq":
//       qAssert(
//         typeof lhs === "number" && typeof rhs === "number" && lhs <= rhs
//       );
//       break;
//     case "gteq":
//       qAssert(
//         typeof lhs === "number" && typeof rhs === "number" && lhs >= rhs
//       );
//       break;
//     case "in":
//       qAssert(
//         typeof lhs === "string" && typeof rhs === "string" && rhs.includes(lhs)
//       );
//       break;
//   }
// }

// async function check(page: Page, actions: Action[]) {
//   for (const action of actions) {
//     if (action.type === "assert") {
//       const lhs = await eval_(page, action.lhs);
//       const rhs = await eval_(page, action.rhs);
//       assert(lhs, rhs, action.operator);
//     } else if (action.type === "control") {
//       if (action.selector) {
//         const selector = await page.$(action.selector);
//         if (action.how === "click") {
//           await selector.click();
//         } else if (action.how === "value") {
//           failIfFalse(await selector.evaluate(e => e.tagName) === "input");
//           await selector.evaluate((e, v) => (<HTMLInputElement>e).value = v, action.value);
//         } else if (action.how === "key") {
//           page.keyboard.press(action.key as KeyInput); // TODO
//         }
//       }
//       await new Promise(r => setTimeout(r, 100));
//     }
//   }
// }

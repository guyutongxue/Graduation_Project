import type { Category } from "transpiler";
import { Checker, createChecker } from "./checkers.js";
import { JudgeError } from "./error.js";
import { onCase, onError, onSuccess } from "./preparations.js";

type Case = () => Promise<void>;

type Op =
  | "=="
  | "==="
  | "!="
  | "!=="
  | "in"
  | "instanceof"
  | ">"
  | "<"
  | ">="
  | "<=";

type Assertion = (
  | {
      type: "binary";
      lhs: unknown;
      rhs: unknown;
      op: Op;
    }
  | {
      type: "other";
      expr: boolean;
    }
) & {
  src: string;
};

export type RawRequest = {
  method: string;
} & {
  [key: string]: unknown;
};

function assertSingle(expr: boolean, src: string) {
  if (!expr) {
    throw new JudgeError("AssertionFailure", src);
  }
}

// Tagged template, better format
function f(strings: TemplateStringsArray, ...args: unknown[]) {
  let result = strings[0];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (typeof arg) {
      case "string":
        result += JSON.stringify(arg);
        break;
      case "number":
      case "boolean":
      case "undefined":
      case "symbol":
        result += String(arg);
        break;
      case "bigint":
        result += arg.toString() + "n";
      case "object":
        if (args[i] === null) {
          result += "null";
        } else {
          result += JSON.stringify(args[i]);
        }
        break;
      case "function":
        result += arg.toString();
        break;
      default:
        result += `${arg}`;
    }
    result += strings[i + 1];
  }
  return result;
}

function assertBinary(lhs: unknown, rhs: unknown, op: Op, src: string) {
  switch (op) {
    case "==":
      // eqeqeq here; Do not use eqeq anywhere
      return assertSingle(lhs === rhs, src + f` (${lhs} == ${rhs})`);
    case "===":
      return assertSingle(lhs === rhs, src + f` (${lhs} === ${rhs})`);
    case "!=":
      return assertSingle(lhs !== rhs, src + f` (${lhs} != ${rhs})`);
    case "!==":
      return assertSingle(lhs !== rhs, src + f` (${lhs} !== ${rhs})`);
    case "in":
      if (Array.isArray(rhs)) {
        return assertSingle(rhs.includes(lhs), src + f` (${lhs} in ${rhs})`);
      } else if (typeof rhs === "string") {
        if (typeof lhs !== "string") {
          throw new JudgeError(
            "AssertionFailure",
            src + f` (${lhs} in ${rhs})`
          );
        }
        return assertSingle(rhs.includes(lhs), src + f` (${lhs} in ${rhs})`);
      } else if (
        (typeof rhs === "object" || typeof rhs === "function") &&
        rhs !== null &&
        (typeof lhs === "string" ||
          typeof lhs === "number" ||
          typeof lhs === "symbol")
      ) {
        return assertSingle(lhs in rhs, src + f` (${String(lhs)} in ${rhs})`);
      } else {
        throw new JudgeError("AssertionFailure", src + f` (${lhs} in ${rhs})`);
      }
    case "instanceof":
      if (typeof rhs === "function") {
        return assertSingle(
          lhs instanceof rhs,
          src + f` (${lhs} instanceof ${rhs})`
        );
      } else {
        throw new JudgeError(
          "AssertionFailure",
          src + f` (${lhs} instanceof ${rhs})`
        );
      }
    case ">":
      if (typeof lhs === "number" && typeof rhs === "number") {
        return assertSingle(lhs > rhs, src + f` (${lhs} > ${rhs})`);
      } else if (typeof lhs === "string" && typeof rhs === "string") {
        return assertSingle(
          lhs.localeCompare(rhs) > 0,
          src + f` (${lhs} > ${rhs})`
        );
      } else {
        throw new JudgeError("AssertionFailure", src + f` (${lhs} > ${rhs})`);
      }
    case "<":
      if (typeof lhs === "number" && typeof rhs === "number") {
        return assertSingle(lhs < rhs, src + f` (${lhs} < ${rhs})`);
      } else if (typeof lhs === "string" && typeof rhs === "string") {
        return assertSingle(
          lhs.localeCompare(rhs) < 0,
          src + f` (${lhs} < ${rhs})`
        );
      } else {
        throw new JudgeError("AssertionFailure", src + ` (${lhs} < ${rhs})`);
      }
    case ">=":
      if (typeof lhs === "number" && typeof rhs === "number") {
        return assertSingle(lhs >= rhs, src + f` (${lhs} >= ${rhs})`);
      } else if (typeof lhs === "string" && typeof rhs === "string") {
        return assertSingle(
          lhs.localeCompare(rhs) >= 0,
          src + f` (${lhs} >= ${rhs})`
        );
      } else {
        throw new JudgeError("AssertionFailure", src + f` (${lhs} >= ${rhs})`);
      }
    case "<=":
      if (typeof lhs === "number" && typeof rhs === "number") {
        return assertSingle(lhs <= rhs, src + f` (${lhs} <= ${rhs})`);
      } else if (typeof lhs === "string" && typeof rhs === "string") {
        return assertSingle(
          lhs.localeCompare(rhs) <= 0,
          src + f` (${lhs} <= ${rhs})`
        );
      } else {
        throw new JudgeError("AssertionFailure", src + f` (${lhs} <= ${rhs})`);
      }
    default:
      const _: never = op;
      throw new JudgeError("InternalError", `Unknown op: ${op}`);
  }
}

export class Controller {
  #cases: Case[] = [];
  #checker: Checker | null = null;

  constructor(public category: Category) {}

  async addCase(case_: Case) {
    this.#cases.push(case_);
  }

  async send(command: RawRequest) {
    if (!this.#checker) {
      throw new JudgeError("EmptyChecker");
    }
    return this.#checker.send(command);
  }

  assert(assertion: Assertion) {
    console.log(assertion);
    if (assertion.type === "binary") {
      assertBinary(assertion.lhs, assertion.rhs, assertion.op, assertion.src);
    } else {
      assertSingle(assertion.expr, assertion.src);
    }
  }

  async run(jid: number, source: string) {
    this.#checker = await createChecker(this.category);
    let caseNum = 0;
    try {
      if (this.#cases.length === 0) {
        throw new JudgeError("NoCase");
      }
      await this.#checker.initialize(source);
      for (const case_ of this.#cases) {
        onCase(jid, caseNum);
        await case_();
        caseNum++;
      }
      onSuccess(jid);
    } catch (e) {
      if (e instanceof JudgeError) {
        onError(jid, caseNum, e);
      } else if (e instanceof Error) {
        onError(jid, caseNum, new JudgeError("InternalError", e.message));
      } else {
        throw e;
      }
    } finally {
      await this.#checker?.dispose();
      this.#checker = null;
    }
  }
}

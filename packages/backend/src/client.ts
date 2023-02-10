import type { Category, Command } from "transpiler";
import { Checker, createChecker } from "./checkers.js";

type Case = () => Promise<void>;

type Assertion = (
  | {
      type: "binary";
      lhs: unknown;
      rhs: unknown;
      op:
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
    }
  | {
      type: "other";
      expr: boolean;
    }
) & {
  src: string;
};

export class Controller<C extends Category = Category> {
  #cases: Case[] = [];
  #checker: Checker | null = null;

  constructor(public category: C) {}

  async addCase(case_: Case) {
    this.#cases.push(case_);
  }

  async send(command: Command<C>) {
    console.log(command);
    if (!this.#checker) {
      throw new Error(`empty checker`);
    }
    return this.#checker.send(command);
  }

  async assert(assertion: Assertion) {
    console.log(assertion);
  }

  async run(source: string) {
    this.#checker = await createChecker(this.category);
    console.log(this.#checker);
    try {
      await this.#checker.initialize(source);
      for (const case_ of this.#cases) {
        await case_();
      }
    } finally {
      await this.#checker.dispose();
      this.#checker = null;
    }
  }
}

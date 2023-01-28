import type { Category, Command } from "transpiler";

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

  get useDirectorySource() {
    return this.category === "web";
  }

  constructor(private category: C) {

  }
  async addCase(case_: Case) {
    this.#cases.push(case_);
  }
  async send(command: Command<C>) {
    console.log(command);
  }
  async assert(assertion: Assertion) {
    console.log(assertion);
  }

  async run(source: string) {

    for (const case_ of this.#cases) {
      await case_();
    }
  }
}

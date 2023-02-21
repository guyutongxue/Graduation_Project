import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import peggy from "peggy";

function loadFile(file: string) {
  return readFileSync(fileURLToPath(new URL(file, import.meta.url)), "utf-8");
}

const grammar = loadFile("./defdef.peggy");
const parser = peggy.generate(grammar);
const source = loadFile("./this.dd");
const ast = parser.parse(source);

// types: 前置类型声明
// defs: 规则定义序列，包含 using 和 define
const { types, defs } = ast;

let currentCategory: string | undefined = undefined;
for (const i of defs) {
  if (typeof i === "string") {
    // using
    currentCategory = i;
    continue;
  }
  /**
   * attr: 特性列表（可空）
   * form: 链式调用形式
   * type: 返回类型（可空）
   * production: 产生的 RPC 方法名和额外实参
   */
  const { attr, form, type, production } = i;
  
}

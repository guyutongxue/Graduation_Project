export interface DefDefAst {
  /**
   * 前置类型声明
   */
  types: string | null;
  /**
   * 规则定义序列，包含 using 和 define
   */
  defs: DefDefItem[];
}

export type DefDefItem = string | RuleDefinition;

export type RuleDefinition = {
  /**
   * 特性列表
   */
  attr: Record<string, string | number> | null;
  /**
   * 链式调用形式
   */
  form: FormPart[];
  /**
   * 返回类型
   */
  type: string | null;
  production: Production;
}

/**
 * 产生的 RPC 方法名和额外实参
 */
export type FormPart = {
  type: "identifier";
  identifier: string;
} | {
  type: "call";
  parameters: Parameter[];
}

export interface Parameter {
  name: string;
  type: string;
}

export type Production = {
  method: string;
} & {
  [key: string]: string | number;
}

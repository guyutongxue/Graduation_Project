import { WebAssertTarget, WebControl } from "./webcheck_types";

export type Category = "web";

export type Action = ControlBase | Assertion;

export interface ControlBase {
  type: "control"
}

export interface TargetBase<T extends string> {
  target: T
}

export interface ConstantTarget<T> extends TargetBase<"constant"> {
  value: T
}

export type Operator = "eq" | "gt" | "lt" | "neq" | "gteq" | "lteq" | "in";

export interface Assertion {
  type: "assert",
  lhs: TargetBase<string>,
  rhs: TargetBase<string>,
  operator: Operator
}

interface Production {
  control: ControlBase,
  assert: TargetBase<string>
}

// https://github.com/Microsoft/TypeScript/issues/24274#issuecomment-471435068
export type Implements<T, U extends T> = {}

interface WebProduction extends Implements<Production, WebProduction> {
  control: WebControl,
  assert: WebAssertTarget
}

export interface AllProduction extends Implements<Record<Category, Production>, AllProduction> {
  web: WebProduction
}

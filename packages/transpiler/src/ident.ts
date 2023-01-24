import { Expression } from "@babel/types";
import { AllProduction, Category } from "./types";
import { IPosition, RuleSyntaxError } from "./errors";
import { globals } from "./definitions";
import { Call, Runtype, RUndefined, Produced } from "./runtypes-patch";

interface IdentifierElement {
  type: "identifier";
  name: string;
}

interface RawCallElement {
  type: "call";
  args: Expression[];
}

interface DeducedCallElement {
  type: "call";
  args: unknown[];
}

export type IdElement = (IdentifierElement | RawCallElement) & IPosition;
export type PathElement = (IdentifierElement | DeducedCallElement) & IPosition;

export function parseIdentifier(expr: Expression): IdElement[] {
  switch (expr.type) {
    case "CallExpression": {
      const lhs = expr.callee;
      if (lhs.type === "Super" || lhs.type === "V8IntrinsicIdentifier") {
        throw new RuleSyntaxError(`Unexpected super keyword`, lhs);
      }
      return [
        ...parseIdentifier(lhs),
        {
          type: "call",
          args: expr.arguments.filter((e): e is Expression => !e.type.endsWith("Expression") ),
          start: expr.start,
          end: expr.end,
        },
      ];
    }
    case "Identifier":
      return [
        {
          type: "identifier",
          name: expr.name,
          start: expr.start,
          end: expr.end,
        },
      ];
    case "MemberExpression": {
      const lhs = expr.object;
      if (lhs.type === "Super") {
        throw new RuleSyntaxError(`Unexpected super keyword`, lhs);
      }
      const rhs = expr.property;
      if (rhs.type !== "Identifier") {
        throw new RuleSyntaxError(
          `Should be a identifier here, got ${rhs.type}`,
          rhs
        );
      }
      return [
        ...parseIdentifier(lhs),
        {
          type: "identifier",
          name: rhs.name,
          start: rhs.start,
          end: rhs.end,
        },
      ];
    }
    default:
      throw new RuleSyntaxError(
        `Expected a call/identity/member here. Got ${expr.type}`,
        expr
      );
  }
}

export function checkIdentifier<
  C extends Category,
  T extends "control" | "assert"
>(type: `${C}.${T}`, ids: IdElement[]): AllProduction[C][T] {
  ids = [...ids]; // do not modify original
  const top = ids.shift();
  if (typeof top === "undefined") {
    throw new Error(`internal: ids empty`);
  }
  if (top.type !== "identifier") {
    throw new Error(`internal: top id not identifier`);
  }
  const g = globals as Record<string, Runtype>;
  if (!(top.name in g)) {
    throw new RuleSyntaxError(`Unknown identifier ${top.name}`, top);
  }
  let rt = g[top.name];
  // console.log(rt);
  const path: PathElement[] = [top];
  while (ids.length) {
    const cur = ids.shift()!;
    if (cur.type === "call") {
      if (Call in rt && typeof rt[Call] !== "undefined") {
        const params = rt[Call].parameters ?? [];
        if (cur.args.length !== params.length) {
          throw new RuleSyntaxError(
            `Expected ${params.length} parameters, got ${cur.args.length} arguments.`,
            cur
          );
        }
        const argValues: unknown[] = [];
        for (let i = 0; i < params.length; i++) {
          const arg = cur.args[i];
          const param = params[i];
          if (arg.type !== "StringLiteral" && arg.type !== "NumericLiteral") {
            throw new RuleSyntaxError(
              `Argument should be literal, got ${arg.type}`,
              arg
            );
          }
          const validation = param.reflect.validate(arg.value);
          if (!validation.success) {
            throw new RuleSyntaxError(validation.message, arg);
          }
          argValues.push(arg.value);
        }
        path.push({
          ...cur,
          args: argValues,
        });
        rt = rt[Call].returns ?? RUndefined;
      } else {
        throw new RuleSyntaxError(`Not a callable`, cur);
      }
    } else {
      const reflect = rt.reflect;
      if (reflect.tag !== "record") {
        throw new RuleSyntaxError(`Member not allowed here`, cur);
      }
      const properties = Object.keys(reflect.fields);
      if (!properties.includes(cur.name)) {
        throw new RuleSyntaxError(
          `Unknown property ${cur.name}. Valid: ${properties.join(", ")}`,
          cur
        );
      } else {
        rt = reflect.fields[cur.name];
      }
      path.push(cur);
    }
  }
  // console.log("path: ", path);
  const args = path
    .filter((e): e is DeducedCallElement & IPosition => e.type === "call")
    .map((e) => e.args);
  const production = rt[Produced];
  // console.log(production);
  if (typeof production === "undefined") {
    throw new RuleSyntaxError(
      `An invalid target, or the definition is missing (internal error).`,
      {
        start: path[0].start,
        end: path[path.length - 1].end,
      }
    );
  }
  return production.result(...args) as any;
}

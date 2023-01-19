import { Expression, SpreadElement } from "estree";
import { Category, IPosition, RuleSyntaxError } from ".";
import { globals } from "./new_types";
import { Call } from "./runtypes-patch";
import {
  Runtype,
  Record as RRecord,
  Undefined,
  ValidationError,
} from "runtypes";
import { isRuntype } from "runtypes/lib/runtype.js";

type IdElement = (
  | {
      type: "identifier";
      name: string;
    }
  | {
      type: "call";
      args: (Expression | SpreadElement)[];
    }
) &
  IPosition;

export type PathElement = (
  | {
      type: "identifier";
      name: string;
    }
  | {
      type: "call";
      args: unknown[];
    }
) &
  IPosition;

export function parseIdentifier(expr: Expression): IdElement[] {
  switch (expr.type) {
    case "CallExpression": {
      const lhs = expr.callee;
      if (lhs.type === "Super") {
        throw new RuleSyntaxError(`Unexpected super keyword`, lhs);
      }
      return [
        ...parseIdentifier(lhs),
        {
          type: "call",
          args: expr.arguments,
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

export function checkIdentifier(category: Category, ids: IdElement[]) {
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
          if (arg.type !== "Literal") {
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
        rt = rt[Call].returns ?? Undefined;
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
  return path;
}

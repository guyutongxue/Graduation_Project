import { Expression } from "@babel/types";
import { AllCommand, Category } from "./types.js";
import { IPosition, RuleSyntaxError } from "./errors.js";
import { globals } from "./definitions.js";
import { Call, Runtype, RUndefined, Produced } from "./runtypes-patch.js";

interface IdentifierElement {
  type: "identifier";
  name: string;
}

interface RawCallElement {
  type: "call";
  args: Expression[];
}

export type IdElement = (IdentifierElement | RawCallElement) & IPosition;

export function checkIdentifier(category: Category, ids: IdElement[]) {
  const newIds = [...ids]; // do not modify original
  const top = newIds.shift();
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
  while (newIds.length) {
    const cur = newIds.shift()!;
    if (cur.type === "call") {
      if (Call in rt && typeof rt[Call] !== "undefined") {
        const params = rt[Call].parameters ?? [];
        if (cur.args.length !== params.length) {
          throw new RuleSyntaxError(
            `Expected ${params.length} parameters, got ${cur.args.length} arguments.`,
            cur
          );
        }
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
    }
  }
  const args = ids
    .filter((e): e is RawCallElement & IPosition => e.type === "call")
    .map((e) => e.args);
  const production = rt[Produced];
  const pos = {
    start: ids[0].start,
    end: ids[ids.length - 1].end,
  };
  // console.log(production);
  if (typeof production === "undefined") {
    throw new RuleSyntaxError(`An invalid target`, pos);
  }
  if (production.category !== category) {
    throw new RuleSyntaxError(`This target is configured to category ${production.category}`, pos);
  }
  return production.result(...args) as unknown;
}

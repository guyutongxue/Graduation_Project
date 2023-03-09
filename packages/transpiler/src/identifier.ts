import { Expression } from "@babel/types";
import { Category } from "./types.js";
import { IPosition, RuleSyntaxError } from "./errors.js";
import allTargets from "../deftool/build/targets.json";

import type { FormPart, Production } from "../deftool/src/types.js";

interface IdentifierElement {
  type: "identifier";
  name: string;
}

interface RawCallElement {
  type: "call";
  args: Expression[];
}

export type IdElement = (IdentifierElement | RawCallElement) & IPosition;

interface Target {
  form: FormPart[];
  production: Production;
  boundedArgs?: Record<string, Expression>;
}

export function checkIdentifier(category: Category, ids: IdElement[]) {
  let targets: Target[] = (allTargets as any)[category];
  if (typeof targets === "undefined") {
    throw new Error(`internal: category ${category} do not have any rules`);
  }
  for (const id of ids) {
    targets = targets.filter((tgt) => {
      if (tgt.form.length === 0) {
        return false;
      }
      if (tgt.form[0].type === "call" && id.type === "call") {
        // TODO: Some literal type checks can be done here
        return tgt.form[0].parameters.length === id.args.length;
      } else if (
        tgt.form[0].type === "identifier" &&
        id.type === "identifier"
      ) {
        return tgt.form[0].identifier === id.name;
      } else {
        return false;
      }
    }).map((tgt) => {
      const [top, ...rest] = tgt.form;
      const args = { ...(tgt.boundedArgs ?? {}) };
      if (top.type === "call" && id.type === "call") {
        for (let i = 0; i < top.parameters.length; i++) {
          args[top.parameters[i].name] = id.args[i];
        }
      }
      return {
        form: rest,
        production: tgt.production,
        boundedArgs: args
      };
    });
    if (targets.length === 0) {
      throw new RuleSyntaxError(`No target match`, id);
    }
  }
  if (targets.length > 1) {
    throw new Error("internal: multiple targets match");
  }
  return {
    ...targets[0].production,
    ...(targets[0].boundedArgs ?? {}),
  };
}

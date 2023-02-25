import { DefDefAst } from "./types";

export function generateBlocklyThings({ defs }: DefDefAst): string {
  let currentCategory: string | undefined = undefined;
  let id = 0;
  function appendLast(list: string[], last: string) {
    if (list.length === 0) {
      return;
    }
    list[list.length - 1] += last;
  }
  const result: unknown[] = [];
  for (const i of defs) {
    if (typeof i === "string") {
      currentCategory = i;
      continue;
    }
    if (!currentCategory) {
      continue;
    }
    const { form, attr, type: rType } = i;
    if (!attr) {
      continue;
    }
    let msg: string;
    if (typeof attr.blockly === "string") {
      msg = attr.blockly;
    } else {
      continue;
    }
    let message0 = "";
    const args0: unknown[] = [];
    for (let i = 0; i < msg.length; i++) {
      if (msg[i] === '$' && msg[i + 1] === '(') {
        let j = i + 2;
        let name = "";
        while (j < msg.length && msg[j] !== ')') {
          name += msg[j];
          j++;
        }
        if (j >= msg.length) {
          throw new Error("unterminated blockly variable");
        }
        let defaultVal: string | null = null;
        if (name.includes("=")) {
          [name, defaultVal] = name.split("=");
        }
        args0.push({
          type: defaultVal ? "field_input" : "input_value",
          name,
          text: defaultVal,
        });
        message0 += `%${args0.length}`;
        i = j;
      } else {
        message0 += msg[i];
      }
    }
    let type = `category_${currentCategory}_${id++}`;
    let tooltip = "";
    if (typeof attr.description === "string") {
      tooltip = attr.description;
    }
    let misc: Record<string, unknown> = {
      colour: 45,
      helpUrl: "",
    };
    switch (rType) {
      case "void": {
        misc.previousStatement = null;
        misc.nextStatement = null;
        break;
      }
      case "string": {
        misc.output = "String";
        break;
      }
      case "number": {
        misc.output = "Number";
      }
    }
    const [first, ...rest] = form;
    if (first.type !== "identifier") {
      throw new Error("internal: first part of form must be identifier");
    }
    const codes = [first.identifier];
    const params: string[] = [];
    for (const part of rest) {
      if (part.type === "call") {
        let first = true;
        appendLast(codes, "(");
        for (const p of part.parameters) {
          if (first) {
            first = false;
          } else {
            appendLast(codes, ",");
          }
          params.push(p.name);
          codes.push("");
        }
        appendLast(codes, ")");
      } else {
        appendLast(codes, "." + part.identifier);
      }
    };
    result.push({
      type,
      message0,
      args0,
      tooltip,
      codes,
      params,
      ...misc,
    });
  }
  return JSON.stringify(result, null, 2);
}

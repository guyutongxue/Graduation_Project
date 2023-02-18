import Blockly, { type Block } from "blockly";
import { javascriptGenerator } from "blockly/javascript";

Blockly.defineBlocksWithJsonArray([
  {
    type: "assert_unary",
    message0: "assert that %1 is true",
    args0: [
      {
        type: "input_value",
        name: "EXPR",
        check: "Boolean",
        align: "CENTRE",
      },
    ],
    colour: 0,
    previousStatement: null,
    nextStatement: null,
    tooltip:
      "Assert a boolean expression. Fail if the expression evaluated to false.",
    helpUrl: "",
  },
  {
    type: "assert_binary",
    message0: "assert that %1 %2 %3",
    args0: [
      {
        type: "input_value",
        name: "LHS",
      },
      {
        type: "field_dropdown",
        name: "OP",
        options: [
          ["=", "EQ"],
          ["≠", "NEQ"],
          ["<", "LT"],
          ["≤", "LTEQ"],
          [">", "GT"],
          ["≥", "GTEQ"],
          ["in", "IN"],
        ],
      },
      {
        type: "input_value",
        name: "RHS",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 0,
    tooltip:
      "Assert a binary expression. Fail if the expression evaluated to false.",
    helpUrl: "",
  },
]);

javascriptGenerator["assert_unary"] = function (block: Block) {
  const expr = javascriptGenerator.valueToCode(block, "EXPR", javascriptGenerator.ORDER_NONE);
  return `assert: ${expr};`;
}

javascriptGenerator["assert_binary"] = function (block: Block) {
  const lhs = javascriptGenerator.valueToCode(block, "LHS", javascriptGenerator.ORDER_EQUALITY);
  const rhs = javascriptGenerator.valueToCode(block, "RHS", javascriptGenerator.ORDER_EQUALITY);
  let op: string;
  switch (block.getFieldValue("OP")) {
    case "EQ": op = "==="; break;
    case "NEQ":op = "!=="; break;
    case "LT":op = "<"; break;
    case "LTEQ":op = "<="; break;
    case "GT":op = ">"; break;
    case "GTEQ":op = ">="; break;
    case "IN":op = "in"; break;
    default: throw new Error("unknown op in blockly assert_binary");
  }
  return `assert: ${lhs} ${op} ${rhs};`;
}

import Blockly, { type Block } from "blockly";
import { javascriptGenerator } from "blockly/javascript";

Blockly.defineBlocksWithJsonArray([
  // Meta
  {
    type: "meta_category",
    message0: "the target category is a %1 application",
    args0: [
      {
        type: "field_dropdown",
        name: "CATEGORY",
        options: [
          ["Web", "web"],
          ["Windows form", "form"],
        ],
      },
    ],
    colour: 300,
    tooltip: "Set the target category of this rule.",
    helpUrl: "",
  },
  {
    type: "meta_case",
    message0: "do %1 as a test case",
    args0: [
      {
        type: "input_statement",
        name: "ACTIONS",
      },
    ],
    colour: 300,
    tooltip: "Create a new test case.",
    helpUrl: "",
  },
]);

// Using external patch (`updateRule` in `BlocklyRule.tsx`)
// to make sure "use ..." is top-most
javascriptGenerator["meta_category"] = function (block: Block) {
  return "";
}

javascriptGenerator["meta_case"] = function (block: Block) {
  const actions = javascriptGenerator.statementToCode(block, "ACTIONS");
  return `{\n${actions}}`;
}

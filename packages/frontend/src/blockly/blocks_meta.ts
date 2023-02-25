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
          ["Web", "WEB"],
          ["Windows form", "FORM"],
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

// TODO Should use external method
javascriptGenerator["meta_category"] = function (block: Block) {
  const category = block.getFieldValue("CATEGORY");
  return `"use ${category.toLowerCase()}";`;
}

javascriptGenerator["meta_case"] = function (block: Block) {
  const actions = javascriptGenerator.statementToCode(block, "ACTIONS");
  return `{\n${actions}}`;
}

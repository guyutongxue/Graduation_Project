import Blockly from "blockly";

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
  // Assertions
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
  // Web
  // TODO: Generate from transpiler
  {
    type: "web_page_title",
    message0: "page title",
    output: "String",
    colour: 45,
    tooltip: "Get the title of the page.",
    helpUrl: "",
  },
  {
    type: "web_click",
    message0: "click element %1",
    args0: [
      {
        type: "field_input",
        name: "SELECTOR",
        text: "#myButton",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 45,
    tooltip:
      "Click element by a given selector. Errors if not found or multiple found.",
    helpUrl: "",
  },
  {
    type: "web_input",
    message0: "change the value of %1 to %2",
    args0: [
      {
        type: "field_input",
        name: "SELECTOR",
        text: "#myInput",
      },
      {
        type: "input_value",
        name: "VALUE",
        check: "String",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 45,
    tooltip: "Change the value of an <input> element by a given selector.",
    helpUrl: "",
  },
  {
    type: "web_html",
    message0: "inner HTML of %1",
    args0: [
      {
        type: "field_input",
        name: "SELECTOR",
        text: "#container",
      },
    ],
    output: "String",
    colour: 45,
    tooltip: "Get the innerHTML of an element by a given selector.",
    helpUrl: "",
  },
  {
    type: "web_text",
    message0: "text of %1",
    args0: [
      {
        type: "field_input",
        name: "SELECTOR",
        text: "#container",
      },
    ],
    output: "String",
    colour: 45,
    tooltip: "Get the innerText of an element by a given selector.",
    helpUrl: "",
  },
]);

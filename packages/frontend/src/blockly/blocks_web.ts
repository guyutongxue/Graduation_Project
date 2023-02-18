import Blockly from "blockly";

Blockly.defineBlocksWithJsonArray([
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

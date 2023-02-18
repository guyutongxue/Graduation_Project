import Blockly from "blockly";

Blockly.defineBlocksWithJsonArray([
  {
    type: "form_click_button",
    message0: "click button with name %1",
    args0: [
      {
        type: "field_input",
        name: "NAME",
        text: "button1",
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 45,
    tooltip: "Click a button by its Name property.",
    helpUrl: "",
  }
]);

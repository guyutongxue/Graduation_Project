import "./style.css";
import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import "./monaco";

const toolbox = {
  kind: "flyoutToolbox",
  contents: [
    {
      kind: "block",
      type: "controls_if",
    },
    {
      kind: "block",
      type: "controls_repeat_ext",
    },
    {
      kind: "block",
      type: "logic_compare",
    },
    {
      kind: "block",
      type: "math_number",
    },
    {
      kind: "block",
      type: "math_arithmetic",
    },
    {
      kind: "block",
      type: "text",
    },
    {
      kind: "block",
      type: "text_print",
    },
  ],
};

const blocklyArea = document.getElementById("blocklyArea")!;
const blocklyDiv = document.getElementById("blocklyDiv")!;
const workspace = Blockly.inject(blocklyDiv, { toolbox });
const onresize = () => {
  // Compute the absolute coordinates and dimensions of blocklyArea.
  let element: HTMLElement | null = blocklyArea;
  let x = 0;
  let y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent as HTMLElement;
  } while (element);
  // Position blocklyDiv over blocklyArea.
  blocklyDiv.style.left = x + "px";
  blocklyDiv.style.top = y + "px";
  blocklyDiv.style.width = blocklyArea.offsetWidth + "px";
  blocklyDiv.style.height = blocklyArea.offsetHeight + "px";
  Blockly.svgResize(workspace);
};
window.addEventListener("resize", onresize, false);
onresize();

document.querySelector("#generate")?.addEventListener("click", () => {
  const code = javascriptGenerator.workspaceToCode(workspace);
  console.log(code);
})

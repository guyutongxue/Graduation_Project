import { WorkspaceSvg, svgResize } from "blockly";
import { useEffect, useState } from "react";
import { BlocklyWorkspace, ToolboxDefinition } from "react-blockly";
import { useResizeDetector } from "react-resize-detector";

const TOOLBOX: ToolboxDefinition = {
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

let workspaceObj: WorkspaceSvg | null = null;

export function BlocklyRule() {
  const [xml, setXml] = useState(
    `<xml xmlns="https://developers.google.com/blockly/xml"></xml>`
  );
  const { width, height, ref } = useResizeDetector();
  useEffect(() => {
    workspaceObj && svgResize(workspaceObj);
  }, [width, height]);
  return (
    <div className="h-full w-full" ref={ref}>
      <BlocklyWorkspace
        className="h-full w-full"
        onInject={(ws) => (workspaceObj = ws)}
        onDispose={() => (workspaceObj = null)}
        toolboxConfiguration={TOOLBOX}
        initialXml={xml}
        onXmlChange={setXml}
      ></BlocklyWorkspace>
    </div>
  );
}

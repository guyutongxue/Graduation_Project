import { WorkspaceSvg, svgResize } from "blockly";
import { useEffect, useState } from "react";
import { BlocklyWorkspace, ToolboxDefinition } from "react-blockly";
import { useResizeDetector } from "react-resize-detector";
import { getToolboxDefinition } from "./blockly/toolbox";
import { javascriptGenerator } from "blockly/javascript";
import DEFAULT_XML from "./blockly/default.xml?raw";

import { setRule } from "./MonacoRule";

let workspaceObj: WorkspaceSvg | null = null;
// 我真不想把这玩意儿放在父组件里，直接用全局变量存一下得了
let xml: string = DEFAULT_XML;

const TOOLBOX = getToolboxDefinition();
function updateCategory() {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const category =
    doc
      .querySelector("block[type=meta_category]>field[name=CATEGORY]")
      ?.textContent?.toLowerCase() ?? null;
  if (workspaceObj) {
    workspaceObj.updateToolbox(getToolboxDefinition(category));
    // Remove all category-specific blocks, except the ones in the current category
    // Pretty dirty hack here:
    // assume that these blocks' colors are #a5935b (45deg in HSV, see custom_blockly_blocks.ts)
    workspaceObj
      .getAllBlocks(false)
      .filter(
        (b) =>
          b.type.startsWith("category_") &&
          !b.type.startsWith(`category_${category}_`)
      )
      .forEach((b) => b.dispose(true, true));
  }
}

function updateRule() {
  try {
    const code = javascriptGenerator.workspaceToCode(workspaceObj);
    if (code) {
      setRule(code);
    } else {
      // 有时 Blockly 进行无意义拖动操作后，会返回空字符串。为什么捏？
      // console.log(code);
    }
  } catch (e) {
    let msg: string = `${e}`;
    if (e instanceof Error) {
      msg = e.message;
    }
    setRule("// Error: \n// " + msg.split("\n").join("\n// "));
  }
}

export function BlocklyRule() {
  const { width, height, ref } = useResizeDetector();
  useEffect(() => {
    workspaceObj && svgResize(workspaceObj);
  }, [width, height]);
  
  useEffect(() => {
    updateRule();
  }, []);

  return (
    <div className="h-full w-full" ref={ref}>
      <BlocklyWorkspace
        className="h-full w-full"
        onInject={(ws) => (workspaceObj = ws)}
        onDispose={() => (workspaceObj = null)}
        toolboxConfiguration={TOOLBOX}
        initialXml={xml}
        onXmlChange={(x) => {
          xml = x;
          updateCategory();
          updateRule();
        }}
      ></BlocklyWorkspace>
    </div>
  );
}

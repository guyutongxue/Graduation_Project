import { WorkspaceSvg, svgResize } from "blockly";
import { useEffect, useState } from "react";
import { BlocklyWorkspace, ToolboxDefinition } from "react-blockly";
import { useResizeDetector } from "react-resize-detector";
import { getToolboxDefinition } from "./blockly_toolbox";

let workspaceObj: WorkspaceSvg | null = null;

const DEFAULT_XML = `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="meta_category" id="b0" x="16" y="16">
  <field name="CATEGORY">WEB</field>
</block>
<block type="meta_case" id="b1" x="16" y="60">
  <statement name="ACTIONS">
    <block type="assert_binary" id="b2">
      <field name="OP">EQ</field>
      <value name="LHS">
        <block type="web_page_title" id="b3"></block>
      </value>
      <value name="RHS">
        <block type="text" id="b4">
          <field name="TEXT">Hello, World</field>
        </block>
      </value>
      <next>
        <block type="web_click" id="b5">
          <field name="SELECTOR">#button</field>
          <next>
            <block type="assert_binary" id="b6">
              <field name="OP">IN</field>
              <value name="LHS">
                <block type="text" id="b7">
                  <field name="TEXT">Hello, JavaScript</field>
                </block>
              </value>
              <value name="RHS">
                <block type="web_text" id="b8">
                  <field name="SELECTOR">body</field>
                </block>
              </value>
            </block>
          </next>
        </block>
      </next>
    </block>
  </statement>
</block>
</xml>`;

const TOOLBOX = getToolboxDefinition();

export function BlocklyRule() {
  const [xml, setXml] = useState(DEFAULT_XML);
  const { width, height, ref } = useResizeDetector();
  useEffect(() => {
    workspaceObj && svgResize(workspaceObj);
  }, [width, height]);
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    // https://developer.mozilla.org/en-US/docs/Web/XPath/Introduction_to_using_XPath_in_JavaScript#implementing_a_default_namespace_for_xml_documents
    const nsResolver = () => {
      return "https://developers.google.com/blockly/xml";
    };
    const result = doc.evaluate(
      `//x:block[@type='meta_category']/x:field[@name='CATEGORY']/text()`,
      doc,
      nsResolver,
      XPathResult.STRING_TYPE,
      null
    );
    const category = result.stringValue.toLowerCase();
    if (workspaceObj) {
      workspaceObj.updateToolbox(getToolboxDefinition(category));
      // Remove all category-specific blocks, except the ones in the current category
      // Pretty dirty hack here:
      // assume that these blocks' colors are #a5935b (45deg in HSV, see custom_blockly_blocks.ts)
      workspaceObj
        .getAllBlocks(false)
        .filter(
          (b) =>
            b.getColour() === "#a5935b" && !b.type.startsWith(category + "_")
        )
        .forEach((b) => b.dispose(true, true));
    }
  }, [xml]);
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

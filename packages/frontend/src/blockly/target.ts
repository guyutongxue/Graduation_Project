// @ts-expect-error In moduleResolution Node, TS do not recognize "exports"
import ALL_BLOCKS from "transpiler/blockly"
import Blockly, { Block } from "blockly";
import type { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { javascriptGenerator } from "blockly/javascript";

const ENABLED_CATEGORIES = ["web", "form"];

const blockDefs: Record<string, any[]> = {};

for (const c of ENABLED_CATEGORIES) {
  const blocks = ALL_BLOCKS.filter((b: any) => b.type.startsWith(`category_${c}_`));
  Blockly.defineBlocksWithJsonArray(blocks);
  blockDefs[c] = blocks;
}

for (const block of ALL_BLOCKS) {
  const { type, codes, params } = block;
  javascriptGenerator[type] = (block: Block) => {
    let code = codes[0];
    for (let i = 1; i < codes.length; i++) {
      const param = params[i - 1];
      let value: string | null = null;
      if (value = block.getFieldValue(param)) {
        value = JSON.stringify(value);
      } else {
        value = javascriptGenerator.valueToCode(block, param, javascriptGenerator.ORDER_COMMA);
      }
      code += value + codes[i];
    }
    if (block.outputConnection) {
      return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
    } else {
      return code + "; \n";
    }
  }
}

export function getToolboxItems(category: string): ToolboxItemInfo {
  const blocks = blockDefs[category];
  if (!blocks) {
    throw new Error(`Unknown category ${category}`);
  }
  return {
    kind: "category",
    name: category,
    colour: "45",
    contents: blocks.map((b) => ({
      kind: "block",
      type: b.type,
    }))
  };
}

import { ToolboxDefinition, ToolboxItemInfo } from "blockly/core/utils/toolbox";
import "./custom_blockly_blocks";

// https://github.com/google/blockly-samples/blob/master/plugins/dev-tools/src/toolboxCategories.js
const PREDEFINED_BLOCKS: ToolboxItemInfo[] = [
  {
    kind: "category",
    name: "Logic",
    categorystyle: "logic_category",
    contents: [
      {
        type: "controls_if",
        kind: "block",
      },
      {
        type: "logic_compare",
        kind: "block",
        fields: {
          OP: "EQ",
        },
      },
      {
        type: "logic_operation",
        kind: "block",
        fields: {
          OP: "AND",
        },
      },
      {
        type: "logic_negate",
        kind: "block",
      },
      {
        type: "logic_boolean",
        kind: "block",
        fields: {
          BOOL: "TRUE",
        },
      },
      {
        type: "logic_null",
        kind: "block",
        // enabled: false,
      },
      {
        type: "logic_ternary",
        kind: "block",
      },
    ],
  },
  {
    kind: "category",
    name: "Loops",
    categorystyle: "loop_category",
    contents: [
      {
        type: "controls_repeat_ext",
        kind: "block",
        inputs: {
          TIMES: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 10,
              },
            },
          },
        },
      },
      // {
      //   type: "controls_repeat",
      //   kind: "block",
      //   enabled: false,
      //   fields: {
      //     TIMES: 10,
      //   },
      // },
      {
        type: "controls_whileUntil",
        kind: "block",
        fields: {
          MODE: "WHILE",
        },
      },
      {
        type: "controls_for",
        kind: "block",
        fields: {
          VAR: {
            name: "i",
          },
        },
        inputs: {
          FROM: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
          TO: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 10,
              },
            },
          },
          BY: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
        },
      },
      {
        type: "controls_forEach",
        kind: "block",
        fields: {
          VAR: {
            name: "j",
          },
        },
      },
      {
        type: "controls_flow_statements",
        kind: "block",
        // enabled: false,
        fields: {
          FLOW: "BREAK",
        },
      },
    ],
  },
  {
    kind: "category",
    name: "Math",
    categorystyle: "math_category",
    contents: [
      {
        type: "math_number",
        kind: "block",
        fields: {
          NUM: 123,
        },
      },
      {
        type: "math_arithmetic",
        kind: "block",
        fields: {
          OP: "ADD",
        },
        inputs: {
          A: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
          B: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
        },
      },
      {
        type: "math_single",
        kind: "block",
        fields: {
          OP: "ROOT",
        },
        inputs: {
          NUM: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 9,
              },
            },
          },
        },
      },
      {
        type: "math_trig",
        kind: "block",
        fields: {
          OP: "SIN",
        },
        inputs: {
          NUM: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 45,
              },
            },
          },
        },
      },
      {
        type: "math_constant",
        kind: "block",
        fields: {
          CONSTANT: "PI",
        },
      },
      {
        type: "math_number_property",
        kind: "block",
        fields: {
          PROPERTY: "EVEN",
        },
        inputs: {
          NUMBER_TO_CHECK: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 0,
              },
            },
          },
        },
      },
      {
        type: "math_round",
        kind: "block",
        fields: {
          OP: "ROUND",
        },
        inputs: {
          NUM: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 3.1,
              },
            },
          },
        },
      },
      {
        type: "math_on_list",
        kind: "block",
        fields: {
          OP: "SUM",
        },
      },
      {
        type: "math_modulo",
        kind: "block",
        inputs: {
          DIVIDEND: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 64,
              },
            },
          },
          DIVISOR: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 10,
              },
            },
          },
        },
      },
      {
        type: "math_constrain",
        kind: "block",
        inputs: {
          VALUE: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 50,
              },
            },
          },
          LOW: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
          HIGH: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 100,
              },
            },
          },
        },
      },
      {
        type: "math_random_int",
        kind: "block",
        inputs: {
          FROM: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
          TO: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 100,
              },
            },
          },
        },
      },
      {
        type: "math_random_float",
        kind: "block",
      },
      {
        type: "math_atan2",
        kind: "block",
        inputs: {
          X: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
          Y: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
        },
      },
    ],
  },
  {
    kind: "category",
    name: "Text",
    categorystyle: "text_category",
    contents: [
      {
        type: "text",
        kind: "block",
        fields: {
          TEXT: "",
        },
      },
      {
        type: "text_multiline",
        kind: "block",
        fields: {
          TEXT: "",
        },
      },
      {
        type: "text_join",
        kind: "block",
      },
      {
        type: "text_append",
        kind: "block",
        fields: {
          name: "item",
        },
        inputs: {
          TEXT: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "",
              },
            },
          },
        },
      },
      {
        type: "text_length",
        kind: "block",
        inputs: {
          VALUE: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "abc",
              },
            },
          },
        },
      },
      {
        type: "text_isEmpty",
        kind: "block",
        inputs: {
          VALUE: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "",
              },
            },
          },
        },
      },
      {
        type: "text_indexOf",
        kind: "block",
        fields: {
          END: "FIRST",
        },
        inputs: {
          VALUE: {
            block: {
              type: "variables_get",
              fields: {
                VAR: {
                  name: "text",
                },
              },
            },
            shadow: undefined,
          },
          FIND: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "abc",
              },
            },
          },
        },
      },
      {
        type: "text_charAt",
        kind: "block",
        fields: {
          WHERE: "FROM_START",
        },
        inputs: {
          VALUE: {
            block: {
              type: "variables_get",
              fields: {
                VAR: {
                  name: "text",
                },
              },
            },
            shadow: undefined,
          },
        },
      },
      {
        type: "text_getSubstring",
        kind: "block",
        fields: {
          WHERE1: "FROM_START",
          WHERE2: "FROM_START",
        },
        inputs: {
          STRING: {
            block: {
              type: "variables_get",
              fields: {
                VAR: {
                  name: "text",
                },
              },
            },
            shadow: undefined,
          },
        },
      },
      {
        type: "text_changeCase",
        kind: "block",
        fields: {
          CASE: "UPPERCASE",
        },
        inputs: {
          TEXT: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "abc",
              },
            },
          },
        },
      },
      {
        type: "text_trim",
        kind: "block",
        fields: {
          MODE: "BOTH",
        },
        inputs: {
          TEXT: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "abc",
              },
            },
          },
        },
      },
      {
        type: "text_count",
        kind: "block",
        inputs: {
          SUB: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "",
              },
            },
          },
          TEXT: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "",
              },
            },
          },
        },
      },
      {
        type: "text_replace",
        kind: "block",
        inputs: {
          FROM: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "",
              },
            },
          },
          TO: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "",
              },
            },
          },
          TEXT: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "",
              },
            },
          },
        },
      },
      {
        type: "text_reverse",
        kind: "block",
        inputs: {
          TEXT: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "",
              },
            },
          },
        },
      },

      {
        type: "text_print",
        kind: "block",
        inputs: {
          TEXT: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "abc",
              },
            },
          },
        },
      },
      {
        type: "text_prompt_ext",
        kind: "block",
        fields: {
          TYPE: "TEXT",
        },
        inputs: {
          TEXT: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: "abc",
              },
            },
          },
        },
      },
    ],
  },
  {
    kind: "category",
    name: "Lists",
    categorystyle: "list_category",
    contents: [
      {
        type: "lists_create_with",
        kind: "block",
      },
      {
        type: "lists_create_with",
        kind: "block",
      },
      {
        type: "lists_repeat",
        kind: "block",
        inputs: {
          NUM: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 5,
              },
            },
          },
        },
      },
      {
        type: "lists_length",
        kind: "block",
      },
      {
        type: "lists_isEmpty",
        kind: "block",
      },
      {
        type: "lists_indexOf",
        kind: "block",

        fields: {
          END: "FIRST",
        },
        inputs: {
          VALUE: {
            block: {
              type: "variables_get",
              fields: {
                VAR: {
                  name: "list",
                },
              },
            },
            shadow: undefined,
          },
        },
      },
      {
        type: "lists_getIndex",
        kind: "block",
        fields: {
          MODE: "GET",
          WHERE: "FROM_START",
        },
        inputs: {
          VALUE: {
            block: {
              type: "variables_get",
              fields: {
                VAR: {
                  name: "list",
                },
              },
            },
            shadow: undefined,
          },
        },
      },
      {
        type: "lists_setIndex",
        kind: "block",
        fields: {
          MODE: "SET",
          WHERE: "FROM_START",
        },
        inputs: {
          LIST: {
            block: {
              type: "variables_get",
              fields: {
                VAR: {
                  name: "list",
                },
              },
            },
            shadow: undefined,
          },
        },
      },
      {
        type: "lists_getSublist",
        kind: "block",
        fields: {
          WHERE1: "FROM_START",
          WHERE2: "FROM_START",
        },
        inputs: {
          LIST: {
            block: {
              type: "variables_get",
              fields: {
                VAR: {
                  name: "list",
                },
              },
            },
            shadow: undefined,
          },
        },
      },
      {
        type: "lists_split",
        kind: "block",

        fields: {
          MODE: "SPLIT",
        },
        inputs: {
          DELIM: {
            block: undefined,
            shadow: {
              type: "text",
              fields: {
                TEXT: ",",
              },
            },
          },
        },
      },
      {
        type: "lists_sort",
        kind: "block",

        fields: {
          TYPE: "NUMERIC",
          DIRECTION: "1",
        },
      },
      {
        type: "lists_reverse",
        kind: "block",
      },
    ],
  },
  /*{
    kind: "category",
    categorystyle: "colour_category",
    name: "Colour",
    contents: [
      {
        type: "colour_picker",
        kind: "block",
        fields: {
          COLOUR: "#ff0000",
        },
      },
      {
        type: "colour_random",
        kind: "block",
      },
      {
        type: "colour_rgb",
        kind: "block",
        inputs: {
          RED: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 100,
              },
            },
          },
          GREEN: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 50,
              },
            },
          },
          BLUE: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 0,
              },
            },
          },
        },
      },
      {
        type: "colour_blend",
        kind: "block",
        inputs: {
          COLOUR1: {
            block: undefined,
            shadow: {
              type: "colour_picker",
              fields: {
                COLOUR: "#ff0000",
              },
            },
          },
          COLOUR2: {
            block: undefined,
            shadow: {
              type: "colour_picker",
              fields: {
                COLOUR: "#3333ff",
              },
            },
          },
          RATIO: {
            block: undefined,
            shadow: {
              type: "math_number",
              fields: {
                NUM: 0.5,
              },
            },
          },
        },
      },
    ],
  },*/
  {
    kind: "sep",
  },
  {
    kind: "category",
    name: "Variables",
    custom: "VARIABLE",
    categorystyle: "variable_category",
  },
  {
    kind: "category",
    name: "Functions",
    custom: "PROCEDURE",
    categorystyle: "procedure_category",
  },
];

const WEB_BLOCKS: ToolboxItemInfo = {
  kind: "category",
  name: "Web",
  colour: "45",
  contents: [
    {
      type: "web_page_title",
      kind: "block",
    },
    {
      type: "web_click",
      kind: "block",
    },
    {
      type: "web_input",
      kind: "block",
    },
    {
      type: "web_html",
      kind: "block",
    },
    {
      type: "web_text",
      kind: "block",
    },
  ],
};

const FORM_BLOCKS: ToolboxItemInfo = {
  kind: "category",
  name: "Form",
  colour: "45",
  contents: [
    {
      type: "form_click_button",
      kind: "block",
    },
  ],
};

export function getToolboxDefinition(
  category: string = "web"
): ToolboxDefinition {
  let categoryBlocks: ToolboxItemInfo[] = [];
  switch (category) {
    case "web": categoryBlocks = [WEB_BLOCKS]; break;
    case "form": categoryBlocks = [FORM_BLOCKS]; break;
  }
  return {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Meta",
        colour: "300",
        contents: [
          {
            type: "meta_category",
            kind: "block",
            disabled: !!category
          },
          {
            type: "meta_case",
            kind: "block",
          },
        ],
      },
      {
        kind: "category",
        name: "Assertion",
        colour: "0",
        contents: [
          {
            type: "assert_binary",
            kind: "block",
          },
          {
            type: "assert_unary",
            kind: "block",
          },
        ],
      },
      ...categoryBlocks,
      {
        kind: "sep",
      },
      ...PREDEFINED_BLOCKS,
    ],
  };
}

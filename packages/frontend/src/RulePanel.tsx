import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MonacoEditor from "react-monaco-editor";
import { transpile } from "transpiler";
import { useState } from "react";
import { map } from "rxjs";
import { bind } from "@react-rxjs/core";
import { BlocklyRule } from "./BlocklyRule";
import MonacoRule, { rule$ } from "./MonacoRule";


type TranspileResult =
  | {
      success: true;
      code: string;
    }
  | {
      success: false;
      error?: Error;
      message: string;
    };

const [useTranspileResult, transpileResult$] = bind<TranspileResult>(
  rule$.pipe(
    map((v): TranspileResult => {
      try {
        const { code } = transpile(v);
        return {
          success: true,
          code: code ?? "",
        };
      } catch (e) {
        if (e instanceof Error) {
          return {
            success: false,
            error: e,
            message: e.message,
          };
        } else {
          return {
            success: false,
            message: "Unknown error",
          };
        }
      }
    })
  ),
  {
    success: false,
    message: "No rule",
  }
);

export default function RulePanel() {
  const [visualized, setVisualized] = useState(false);
  const transpileResult = useTranspileResult();
  return (
    <Tabs className="h-full">
      <TabList className="flex justify-between react-tabs__tab-list">
        <div>
          <Tab>规则源码</Tab>
          <Tab>转换结果(只读)</Tab>
        </div>
        <div className="flex items-center">
          <span>可视化</span>
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-primary mx-3"
            checked={visualized}
            onChange={(e) => setVisualized(e.target.checked)}
          />
        </div>
      </TabList>

      <TabPanel>
        {visualized ? <BlocklyRule></BlocklyRule> : <MonacoRule></MonacoRule>}
      </TabPanel>
      <TabPanel>
        <MonacoEditor
          language={transpileResult.success ? "javascript" : "plaintext"}
          value={
            transpileResult.success
              ? transpileResult.code
              : transpileResult.message
          }
          options={{
            readOnly: true,
            automaticLayout: true,
          }}
        ></MonacoEditor>
      </TabPanel>
    </Tabs>
  );
}

export { transpileResult$ };

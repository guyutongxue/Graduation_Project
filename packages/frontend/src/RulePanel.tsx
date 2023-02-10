import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MonacoEditor from "react-monaco-editor";
import { useState } from "react";
import { BlocklyRule } from "./BlocklyRule";
import MonacoRule, { useTranspileResult } from "./MonacoRule";

export default function RulePanel() {
  const [visualized, setVisualized] = useState(false);
  const transpileResult = useTranspileResult();
  return (
    <Tabs className="h-full">
      <TabList className="react-tabs__tab-list flex justify-between">
        <div>
          <Tab>规则源码</Tab>
          <Tab className="react-tabs__tab inline-flex items-center">
            <span>转换结果</span>
            <div className="ml-1 badge badge-ghost badge-sm">只读</div>
          </Tab>
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

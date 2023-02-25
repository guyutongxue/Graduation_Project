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
          {visualized && <Tab>可视化编辑器</Tab>}
          <Tab>规则源码</Tab>
          <Tab>转换结果</Tab>
        </div>
        <div className="flex items-center">
          <button
            className="btn btn-secondary btn-link btn-sm"
            onClick={() => setVisualized(!visualized)}
          >
            {visualized ? "返回" : "显示可视化编辑器"}
          </button>
        </div>
      </TabList>

      {visualized && (
        <TabPanel>
          <BlocklyRule></BlocklyRule>
        </TabPanel>
      )}
      <TabPanel>
        <MonacoRule readonly={visualized}></MonacoRule>
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

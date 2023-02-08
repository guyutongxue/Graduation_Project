import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import MonacoEditor from "react-monaco-editor";
import { RuleSyntaxError, transpile } from "transpiler";
import { useEffect, useState } from "react";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  type Subscription,
} from "rxjs";
import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import * as monaco from "monaco-editor";
import "./monaco-env";

import "react-tabs/style/react-tabs.css";

const DEFAULT_RULE = `"use web";
{
  assert: $.title == "Hello, World";
  $("#hello").click();
  assert: "Hello, JavaScript" in $("body").html;
}`;

const [ruleChange$, setRule] = createSignal<string>();
const [useRule, rule$] = bind(
  ruleChange$.pipe(distinctUntilChanged(), debounceTime(500)),
  DEFAULT_RULE
);

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

let transpileSubscription: Subscription | null = null;

function prepareEditor(editor: monaco.editor.IStandaloneCodeEditor) {
  const model = editor.getModel();
  if (model === null) {
    throw new Error("Model is null");
  }
  model.onDidChangeContent(() => {
    setRule(model.getValue());
  });

  transpileSubscription = transpileResult$.subscribe((v) => {
    const model = editor.getModel();
    if (model === null) {
      // throw new Error("Model is null");
      return;
    }
    monaco.editor.setModelMarkers(model, "rules", []);
    if (!v.success) {
      console.log(v);
      const e = v.error;
      if (e instanceof RuleSyntaxError) {
        const { start, end } = e.position;
        const startPos = model.getPositionAt(start ?? 0);
        const endPos = model.getPositionAt(end ?? model.getValue().length);
        monaco.editor.setModelMarkers(model, "rules", [
          {
            startColumn: startPos.column,
            startLineNumber: startPos.lineNumber,
            endColumn: endPos.column,
            endLineNumber: endPos.lineNumber,
            message: v.message,
            severity: monaco.MarkerSeverity.Error,
          },
        ]);
      } else if (e instanceof SyntaxError && "loc" in e) {
        const pos: any = e.loc;
        monaco.editor.setModelMarkers(model, "rules", [
          {
            startColumn: pos.column + 1,
            startLineNumber: pos.line,
            endColumn: pos.column + 2,
            endLineNumber: pos.lineNumber,
            message: e.message,
            severity: monaco.MarkerSeverity.Error,
          },
        ]);
      } else if (e instanceof Error) {
        console.error({ e });
        const { column, lineNumber } = model.getPositionAt(model.getValueLength());
        monaco.editor.setModelMarkers(model, "rules", [
          {
            startColumn: 1,
            startLineNumber: 1,
            endColumn: column,
            endLineNumber: lineNumber,
            message: e.message,
            severity: monaco.MarkerSeverity.Error,
          },
        ]);
      }
    }
  });
}

export default function RulePanel() {
  const rule = useRule();
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
          />
        </div>
      </TabList>

      <TabPanel>
        <MonacoEditor
          language="javascript"
          value={rule}
          options={{
            automaticLayout: true,
          }}
          editorDidMount={prepareEditor}
          editorWillUnmount={() => transpileSubscription?.unsubscribe()}
        ></MonacoEditor>
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

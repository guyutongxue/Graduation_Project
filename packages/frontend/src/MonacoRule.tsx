import { createSignal } from "@react-rxjs/utils";
import { bind } from "@react-rxjs/core";
import * as monaco from "monaco-editor";
import MonacoEditor from "react-monaco-editor/lib/editor";
import { debounceTime, distinctUntilChanged, map, Subscription } from "rxjs";
import { RuleSyntaxError, transpile, transpileWithCategory } from "transpiler";

const DEFAULT_RULE = `"use web";
{
  assert: $.title == "Hello, World";
  $("#hello").click();
  assert: "Hello, JavaScript" in $("body").text;
}`;

type TranspileResult =
  | {
      success: true;
      category?: string;
      code: string;
    }
  | {
      success: false;
      error?: Error;
      message: string;
    };

const [ruleChange$, setRule] = createSignal<string>();
const [useRule, rule$] = bind(
  ruleChange$.pipe(distinctUntilChanged(), debounceTime(500)),
  DEFAULT_RULE
);

const [useTranspileResult, transpileResult$] = bind<TranspileResult>(
  rule$.pipe(
    map((v): TranspileResult => {
      try {
        const { code, category } = transpileWithCategory(v);
        return {
          success: true,
          category: category,
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
        const { column, lineNumber } = model.getPositionAt(
          model.getValueLength()
        );
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

export default function MonacoRule() {
  const rule = useRule();
  return (
    <MonacoEditor
      language="javascript"
      value={rule}
      options={{
        automaticLayout: true,
      }}
      editorDidMount={prepareEditor}
      editorWillUnmount={() => transpileSubscription?.unsubscribe()}
    ></MonacoEditor>
  );
}

export { rule$, useRule, transpileResult$, useTranspileResult };

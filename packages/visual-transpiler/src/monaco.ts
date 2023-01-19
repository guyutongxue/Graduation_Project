import * as monaco from "monaco-editor";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { transpile, RuleSyntaxError } from "transpiler";

// https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md#using-vite
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import declare from "./temp.d.ts?raw";

// @ts-ignore
self.MonacoEnvironment = {
	getWorker(_: any, label: string) {
		if (label === 'json') {
			return new jsonWorker();
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new cssWorker();
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new htmlWorker();
		}
		if (label === 'typescript' || label === 'javascript') {
			return new tsWorker();
		}
		return new editorWorker();
	}
};

const editor = monaco.editor.create(document.getElementById("editor")!, {
  value: `"use web";
{
  assert: $.title == "Hello, World";
  $("#hello").click();
  assert: "Hello, JavaScript" in $("body").html;
}`,
  language: "javascript",
  automaticLayout: true,
});

monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  // noSemanticValidation: true,
  noSuggestionDiagnostics: true,
});
monaco.languages.typescript.javascriptDefaults.addExtraLib(declare);

const $textChanged = new Subject<string>();

editor.onDidChangeModelContent(() => {
  $textChanged.next(editor.getValue());
});

$textChanged.pipe(debounceTime(500)).subscribe((text) => {
  const model = editor.getModel();
  if (model === null) return;
  try {
    monaco.editor.setModelMarkers(model, "rules", []);
    const rules = transpile(text);
    console.log(rules);
  } catch (e) {
    if (e instanceof RuleSyntaxError) {
      const start = model.getPositionAt(e.position.start);
      const end = model.getPositionAt(e.position.end);
      monaco.editor.setModelMarkers(model, "rules", [
        {
          startColumn: start.column,
          startLineNumber: start.lineNumber,
          endColumn: end.column,
          endLineNumber: end.lineNumber,
          message: e.message,
          severity: monaco.MarkerSeverity.Error,
        },
      ]);
    }
  }
});

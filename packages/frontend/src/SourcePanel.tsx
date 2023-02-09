import { useState } from "react";
import MonacoEditor from "react-monaco-editor/lib/editor";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

export default function SourcePanel() {
  const [editor, setEditor] = useState(false);
  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-2 flex justify-between bg-base-200">
        <span className="flex gap-4">
          <label className="flex gap-1 items-center">
            <input
              type="radio"
              name="sourceType"
              value="file"
              className="radio radio-primary radio-sm"
              checked={!editor}
              onChange={(e) => setEditor(!e.target.checked)}
            ></input>
            <span>上传文件</span>
          </label>
          <label className="flex gap-1 items-center">
            <input
              type="radio"
              name="sourceType"
              value="editor"
              className="radio radio-primary radio-sm"
              checked={editor}
              onChange={(e) => setEditor(e.target.checked)}
            ></input>
            <span>编辑器</span>
          </label>
        </span>
        <button className="btn btn-primary btn-sm">Go</button>
      </div>
      <div className="flex-grow">
        {editor ? (
          <MonacoEditor
            options={{
              automaticLayout: true,
            }}
          ></MonacoEditor>
        ) : (
          <div className="p-2">
            <input
              type="file"
              className="file-input file-input-bordered w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

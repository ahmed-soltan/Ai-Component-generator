"use client";

import React, { useRef } from "react";
import MonacoEditor, { Monaco } from "@monaco-editor/react";

interface MonacoEditorProps {
  code: string;
  setCode?: (code: string) => void;
  readOnly?: boolean;
}

export const CodeEditor = ({ code, setCode, readOnly }: MonacoEditorProps) => {
  const monacoRef = useRef<Monaco | null>(null);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    monacoRef.current = monaco;
    monacoRef.current?.editor.setTheme("vs-dark");
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <MonacoEditor
        height="300px"
        defaultLanguage="javascript"
        value={code.trim()}
        onChange={(newCode) => setCode?.(newCode || "")}
        options={{
          fontSize: 14,
          readOnly,
          minimap: { enabled: false },
          fontFamily: "Fira Code",
          contextmenu: false,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

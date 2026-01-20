import AceEditor from "react-ace";
import { useActiveCode } from "@codesandbox/sandpack-react";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-textmate";

import "ace-builds/src-noconflict/theme-monokai";

interface CustomAceEditorProps{
  code: string;
  setCode: (code: string) => void;
  isGenerating?: boolean;
}

export const CustomAceEditor = ({ code, setCode, isGenerating }: CustomAceEditorProps) => {
  const { updateCode } = useActiveCode();

  return (
    <AceEditor
      mode="javascript"
      value={code}
      onChange={(e) => {
        // Don't allow editing while generating
        if (isGenerating) return;
        updateCode(e);
        setCode(e);
      }}
      fontSize={14}
      style={{ height: "82vh" }}
      width="100%"
      theme="monokai"
      readOnly={isGenerating}
    />
  );
};

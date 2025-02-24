import AceEditor from "react-ace";
import { useActiveCode } from "@codesandbox/sandpack-react";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-textmate";

import "ace-builds/src-noconflict/theme-monokai";

interface CustomAceEditorProps{
  code:string;
  setCode: (code: string) => void;
}

export const CustomAceEditor = ({code , setCode}:CustomAceEditorProps) => {
  const { updateCode } = useActiveCode();

  return (
    <AceEditor
      mode="javascript"
      value={code}
      onChange={(e) => {
        updateCode(e);
        setCode(e);
      }}
      fontSize={14}
      style={{ height: "82vh" }}
      width="100%"
      theme="monokai"
    />
  );
};

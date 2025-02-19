import AceEditor from "react-ace";
import { useActiveCode } from "@codesandbox/sandpack-react";

import { useComponentStore } from "@/features/component/store/store";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-textmate";

import "ace-builds/src-noconflict/theme-monokai";

interface CustomAceEditorProps{
  code:string
}

export const CustomAceEditor = ({code}:CustomAceEditorProps) => {
  const { updateCode } = useActiveCode();
  const { setCode } = useComponentStore();

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

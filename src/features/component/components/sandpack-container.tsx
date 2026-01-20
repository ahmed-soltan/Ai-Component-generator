import { useState, useEffect } from "react";
import { CustomAceEditor } from "./custom-ace-editor";
import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";

import { useComponentStore } from "../store/store";

interface SandpackContainerProps {
  code?: string;
  values: Record<string, any>;
  setCode: (code: string) => void;
}

const templateToMainFile: {
  [framework: string]: string;
} = {
  react: "/App.js",
  vue: "src/App.vue",
  angular: "/src/app/app.component.ts",
  svelte: "/App.svelte",
  preact: "/src/App.js",
  lit: "/src/App.ts",
  ionic: "/src/app/app.component.ts",
  vanilla: "index.js",
};

export default function SandpackContainer({
  code,
  values,
  setCode
}: SandpackContainerProps) {
  const [isClient, setIsClient] = useState(false);
  const [mainFile, setMainFile] = useState<string>("/App.js");
  
  const { isGenerating, streamingCode } = useComponentStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const template = values.jsFramework || "react";
    setMainFile(templateToMainFile[template] || "/App.js");
  }, [values.jsFramework]);

  if (!isClient) return null;

  const defaultCode = `
const MyComponent = () => {
  return (
   <div>Hello world</div>
  );
};

export default MyComponent;
`;

  // Use stable code for preview (keeps old code during generation)
  // Use streaming code for editor if generating, otherwise stable code
  const previewCode = code || defaultCode.trim();
  const editorCode = isGenerating && streamingCode ? streamingCode : (code || defaultCode);

  return (
    <>
      <SandpackProvider
        theme={"dark"}
        template={values.jsFramework || "react"}
        files={{
          [mainFile]: {
            code: previewCode,
          },
        }}
        customSetup={{
          dependencies: {
            "react-icons": "latest",
          },
        }}
        options={{
          externalResources: [
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
            "https://unpkg.com/@tailwindcss/browser@4",
            "bootstrap/dist/css/bootstrap.min.css",
          ],
          visibleFiles: [""],
          recompileMode: "immediate",
          autoReload: true,
          autorun: true,
        }}
      >
        <SandpackLayout>
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
            {values.jsFramework === "angular" ||
            values.jsFramework === "vanilla" ? (
              <div className="flex items-center justify-center flex-col w-full h-full">
                <h2>
                  This template does not support Angular or Vanilla JavaScript.
                </h2>
                <p>Please use a different template or framework.</p>
              </div>
            ) : (
              <SandpackPreview style={{ height: "82vh" }} />
            )}
            <CustomAceEditor code={editorCode} setCode={setCode} isGenerating={isGenerating} />
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
}

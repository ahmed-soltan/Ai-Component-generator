"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { BsCopy } from "react-icons/bs";
import { FaRegSave } from "react-icons/fa";
import { BsDownload } from "react-icons/bs";

import { Button } from "@/components/ui/button";
import SandpackContainer from "@/features/component/components/sandpack-container";

import { useComponentStore } from "../store/store";
import { useSaveComponent } from "../api/use-save-component";

export const ComponentPreviewCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate, isPending } = useSaveComponent();

  const {values , code , setCode} = useComponentStore()

  const handleCopy = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Code Copy Successfully");
    }, 1000);
    navigator.clipboard.writeText(code);
  };

  const exportFile = () => {
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${values.name || "Untitled"}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col items-start gap-2">
      <div className="flex items-center justify-between gap-4 w-full flex-wrap">
        <span className="text-gray-400 text-sm">
          (if the preview does not appear just reload the page)
        </span>
        <div className="flex items-center justify-center gap-4">
          <Button variant={"outline"} onClick={handleCopy}>
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <BsCopy className="size-5" />
            )}
            Copy Code
          </Button>
          <Button variant={"secondary"} onClick={exportFile} disabled={isPending}>
            <BsDownload className="size-7" />
            Export
          </Button>
          <Button variant={"success"} onClick={mutate} disabled={isPending}>
            <FaRegSave className="size-5" />
            Save
          </Button>
        </div>
      </div>
      <SandpackContainer code={code} values={values} setCode={setCode}/>
    </div>
  );
};

"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { BsCopy } from "react-icons/bs";
import { FaRegSave } from "react-icons/fa";
import { BsDownload } from "react-icons/bs";

import Hint from "./hint";
import { Button } from "@/components/ui/button";
import SandpackContainer from "@/features/component/components/sandpack-container";

import { useCurrentComponent } from "../store/store";
import { useCurrent } from "@/features/auth/api/use-current";
import { useUpdateComponent } from "../api/use-update-component";

export const ComponentPreviewEdit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate, isPending } = useUpdateComponent();

  const { data: user } = useCurrent();

  const { values, code, setCode } = useCurrentComponent();

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
          <Hint
            label={
              user?.profile.plan === "free"
                ? "Upgrade to Pro"
                : "Download the Code"
            }
            align="center"
            side="top"
          >
            <div>
              <Button
                variant={"secondary"}
                onClick={exportFile}
                disabled={isPending || user?.profile.plan === "free"}
              >
                <BsDownload className="size-7" />
                Export
              </Button>
            </div>
          </Hint>
          <Button variant={"success"} onClick={mutate} disabled={isPending}>
            <FaRegSave className="size-5" />
            Save
          </Button>
        </div>
      </div>
      <SandpackContainer code={code} values={values} setCode={setCode} />
    </div>
  );
};

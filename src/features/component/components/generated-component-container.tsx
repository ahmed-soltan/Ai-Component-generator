"use client";

import { Loader2 } from "lucide-react";
import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EditComponentForm } from "./edit-component-form";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ComponentPreviewEdit } from "@/features/component/components/component-preview-edit";

import { useGetComponent } from "../api/use-get-component";
import { useComponentId } from "../hooks/use-component-id";

export const GeneratedComponentContainer = () => {
  const componentId = useComponentId();
  const { data, isLoading } = useGetComponent({ componentId });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin size-6" />
      </div>
    );
  }

  const initialValues = {
    name: data?.name,
    theme: data?.theme,
    layout: data?.layout,
    jsFramework: data?.jsFramework,
    cssFramework: data?.cssFramework,
    radius: data?.radius,
    shadow: data?.shadow,
    prompt: data?.aiPrompt,
  };

  return (
    <>
      <div className="hidden lg:block">
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={"as_component_generation_layout"}
        >
          <ResizablePanel minSize={20} defaultSize={29} className="pr-2 pt-0">
            <EditComponentForm initialValues={initialValues} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} defaultSize={89} className="px-2 py-5">
            <ComponentPreviewEdit />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="block lg:hidden py-5">
        <Sheet>
          <SheetTrigger asChild>
            <Button size={"icon"} className="mb-4" variant={"secondary"}>
              <Settings className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="">
            <SheetHeader>
              <SheetTitle></SheetTitle>
            </SheetHeader>
            <EditComponentForm initialValues={initialValues} />
          </SheetContent>
        </Sheet>
        <div className="w-full h-full">
          <ComponentPreviewEdit />
        </div>
      </div>
    </>
  );
};

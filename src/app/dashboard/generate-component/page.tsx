"use client";

import { Loader2, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { ComponentPreviewCreate } from "@/features/component/components/component-preview-create";
import { CreateComponentForm } from "@/features/component/components/create-component-form";

import { useComponentStore } from "@/features/component/store/store";
import { useCurrent } from "@/features/auth/api/use-current";

const GenerateComponentPage = () => {
  const { values } = useComponentStore();
  const { data: user, isLoading } = useCurrent();

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin size-6" />
      </div>
    );
  }

  const initialValues = {
    name: values.name || "",
    theme: values.theme || user?.preferences.default_theme,
    layout: values.layout || user?.preferences.default_layout,
    jsFramework: values.jsFramework || user?.preferences.default_jsFramework,
    cssFramework: values.cssFramework || user?.preferences.default_cssFramework,
    radius: values.radius || user?.preferences.default_radius,
    shadow: values.shadow || user?.preferences.default_shadow,
    prompt: values.prompt || "",
  };

  return (
    <>
      <div className="hidden lg:block">
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={"as_component_generation_layout"}
        >
          <ResizablePanel minSize={20} defaultSize={29} className="pr-2 pt-0">
            <CreateComponentForm initialValues={initialValues} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} defaultSize={89} className="px-2 py-5">
            <ComponentPreviewCreate />
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
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle></SheetTitle>
            </SheetHeader>
            <CreateComponentForm initialValues={values} />
          </SheetContent>
        </Sheet>
        <div className="w-full h-full">
          <ComponentPreviewCreate />
        </div>
      </div>
    </>
  );
};

export default GenerateComponentPage;

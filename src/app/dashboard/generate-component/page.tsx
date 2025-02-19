"use client";

import { Settings } from "lucide-react";

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
import { ComponentPreview } from "@/features/component/components/component-preview";
import { CreateComponentForm } from "@/features/component/components/create-component-form";
import { useComponentStore } from "@/features/component/store/store";

const GenerateComponentPage = () => {
  const { values } = useComponentStore();

  return (
    <>
      <div className="hidden lg:block">
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={"as_component_generation_layout"}
        >
          <ResizablePanel minSize={20} defaultSize={29} className="pr-2 pt-0">
            <CreateComponentForm initialValues={values} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} defaultSize={89} className="px-2 py-5">
            <ComponentPreview />
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
          <ComponentPreview />
        </div>
      </div>
    </>
  );
};

export default GenerateComponentPage;

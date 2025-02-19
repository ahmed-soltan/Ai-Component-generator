"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ComponentPreview } from "@/features/component/components/component-preview";
import { CreateComponentForm } from "@/features/component/components/create-component-form";
import { useComponentStore } from "@/features/component/store/store";

const GenerateComponentPage = () => {
  const {values} = useComponentStore()
  
  return (
    <ResizablePanelGroup
      direction="horizontal"
      autoSaveId={"as_component_generation_layout"}
    >
      <ResizablePanel
        minSize={20}
        defaultSize={29}
        className="pr-2 pt-0"
      >
        <CreateComponentForm initialValues={values}/>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={20} defaultSize={89} className="px-2 py-5">
        <ComponentPreview />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default GenerateComponentPage;

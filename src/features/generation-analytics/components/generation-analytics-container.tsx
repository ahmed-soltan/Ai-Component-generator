import { Separator } from "@/components/ui/separator";

import { GenerationBarChart } from "./performance-bar-chart";
import { ContainerWrapper } from "@/components/container-wrapper";
import { GenerationRadialChart } from "./generation-radial-chart";

export const GenerationAnalyticsContainer = () => {
  return (
    <ContainerWrapper className="w-full h-full flex flex-col items-start gap-10">
      <h1 className="text-4xl font-bold">Generation Analytics</h1>
      <Separator />
      <div className="w-full h-full grid grid-cols-1 gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <GenerationBarChart/>
          <GenerationRadialChart/>
        </div>
        <div></div>
      </div>
    </ContainerWrapper>
  );
};

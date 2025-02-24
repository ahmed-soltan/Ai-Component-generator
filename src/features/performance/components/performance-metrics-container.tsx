import { Separator } from "@/components/ui/separator";

import { PerformanceBarChart } from "./performance-bar-chart";
import { PerformanceLineChart } from "./performance-line-chart";
import { ContainerWrapper } from "@/components/container-wrapper";
import { PerformanceRadialChart } from "./performance-radial-chart";

export const PerformanceMetricsContainer = () => {
  return (
    <ContainerWrapper className="w-full h-full flex flex-col items-start gap-10">
      <h1 className="text-4xl font-bold">Performance Metrics</h1>
      <Separator />
      <div className="w-full h-full grid grid-cols-1 gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <PerformanceBarChart />
          <PerformanceRadialChart />
        </div>
        <PerformanceLineChart />
      </div>
    </ContainerWrapper>
  );
};

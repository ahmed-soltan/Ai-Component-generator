import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { Separator } from "@/components/ui/separator";
import { ContainerWrapper } from "@/components/container-wrapper";
import { PremiumCard } from "@/features/component/components/premium-card";
import { PerformanceBarChart } from "@/features/performance/components/performance-bar-chart";
import { PerformanceLineChart } from "@/features/performance/components/performance-line-chart";
import { PerformanceRadialChart } from "@/features/performance/components/performance-radial-chart";
import { GenerationBarChart } from "@/features/generation-analytics/components/performance-bar-chart";
import { GenerationRadialChart } from "@/features/generation-analytics/components/generation-radial-chart";

const DashboardPage = async () => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return (
    <ContainerWrapper className="w-full h-full flex flex-col items-start gap-10">
      <h1 className="text-4xl font-bold">General Analytics</h1>
      <Separator />
      <div className="w-full h-full grid grid-cols-1 gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <GenerationBarChart />
          <div className="grid grid-cols-1">
            <GenerationRadialChart />
            <div className="relative h-full w-full">
              {user.profile.plan === "free" && <PremiumCard />}
              <PerformanceRadialChart />
            </div>
          </div>
        </div>
        <div className="relative h-full w-full">
          {user.profile.plan === "free" && <PremiumCard />}
          <PerformanceLineChart />
        </div>
        <div className="relative h-full w-full">
          {user.profile.plan === "free" && <PremiumCard />}
          <PerformanceBarChart />
        </div>
      </div>
    </ContainerWrapper>
  );
};

export default DashboardPage;

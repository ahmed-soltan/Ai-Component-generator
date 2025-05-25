"use client";

import { Loader2 } from "lucide-react";

import { PremiumCard } from "@/components/premium-card";
import { PerformanceMetricsContainer } from "@/features/performance/components/performance-metrics-container";

import { useCurrent } from "@/features/auth/api/use-current";

const PerformanceMetricsClient = () => {
  const { data: user, isLoading } = useCurrent();

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      {user?.profile.plan === "free" && <PremiumCard className="w-full max-w-[300px] h-[50px] text-lg"/>}
      <PerformanceMetricsContainer />
    </div>
  );
};

export default PerformanceMetricsClient;

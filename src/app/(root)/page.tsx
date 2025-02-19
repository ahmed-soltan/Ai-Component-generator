"use client";

import { Plans } from "@/features/home/components/plans";
import { Banner } from "@/features/home/components/banner";
import { TechStack } from "@/features/home/components/tech-stack";
import { PromoBanner } from "@/features/home/components/promo-banner";
import { UserBenefits } from "@/features/home/components/user-benefits";

import { useDots } from "@/hooks/use-dots";

export default function Home() {
  const { dotContainerRef: dotContainerRef1 } = useDots();

  return (
    <div className="flex flex-col items-center gap-10">
      <Banner />
      <div className="relative bg-dots h-[200px] w-full max-w-[700px] rounded-full">
        <div
          ref={dotContainerRef1}
          className="absolute inset-0 w-full max-w-[400px] m-auto"
        ></div>
      </div>
      <TechStack />
      <UserBenefits />
      <Plans />
      <PromoBanner />
    </div>
  );
}

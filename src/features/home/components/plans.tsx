"use client"

import { Loader2 } from "lucide-react";
import { IoDiamond } from "react-icons/io5";

import { PricingCard } from "@/components/pricing-card";

import { useDots } from "@/hooks/use-dots";
import { useGetPlans } from "../api/use-get-plans";

export const Plans = () => {
  const { dotContainerRef: dotContainerRef3 } = useDots();
  const { data: plans, isLoading } = useGetPlans();

  if (isLoading) {
    return <Loader2 className="size-5 animate-spin"/>;
  }

  return (
    <div className="relative flex items-start justify-start flex-col gap-5 my-12 w-full md:max-w-[1000px]">
      <div
        className="w-full max-w-[500px] h-[300px] p-10 flex flex-col items-start justify-center
     relative gap-2 border border-r-0 rounded-xl -mb-[50px] lg:-ml-16"
      >
        <div
          ref={dotContainerRef3}
          className="absolute inset-0 w-full max-w-[400px]"
        ></div>
        <div
          className="gr-bg rounded-md size-12 flex items-center justify-center text-center
     absolute left-[20%] -top-5 -translate-x-1/2"
        >
          <IoDiamond className="size-6 text-gray-200" />
        </div>
        <h1 className="text-4xl font-semibold text-gray-800">
          Flexible Pricing <br /> Plans For Everyone
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          Choose a plan works for you, with options for every budget and
          requirements
        </p>
      </div>
      <div className="flex items-center justify-center w-full">
        <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 z-20 ">
          {plans?.data.documents?.map((plan, i) => (
            <PricingCard
              key={i}
              name={plan.name}
              description={plan.description}
              options={plan.options}
              price={plan.price}
              currency={plan.currency}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

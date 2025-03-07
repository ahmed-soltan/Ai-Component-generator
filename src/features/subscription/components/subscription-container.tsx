"use client";

import { useMemo } from "react";
import { FiBox } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { TfiBag } from "react-icons/tfi";
import { LuWallet } from "react-icons/lu";
import { IoMdAlarm } from "react-icons/io";
import { RiAiGenerate2 } from "react-icons/ri";
import { MdOutlineMessage } from "react-icons/md";

import { Progress } from "@/components/ui/progress";
import { ContainerWrapper } from "@/components/container-wrapper";
import { currencySymbolMap, PricingCard } from "@/components/pricing-card";

import { useContactModal } from "../hooks/use-contact-modal";
import { useCurrent } from "@/features/auth/api/use-current";
import { useGetPlans } from "@/features/home/api/use-get-plans";
import { useGetCurrentSubscription } from "@/features/subscription/api/use-get-current-subscription";
import { useGetGenerationAnalytics } from "@/features/generation-analytics/api/use-get-analytics";
import { useGetPerformanceMetrics } from "@/features/performance/api/use-get-performance-metrics";

export const SubscriptionContainer = () => {
  const { open } = useContactModal();
  const { data: user, isLoading: isLoadingUser } = useCurrent();
  const { data: plans, isLoading: isLoadingPlans } = useGetPlans();
  const { data: subscriptionData, isLoading: isLoadingSubscriptionData } =
    useGetCurrentSubscription({ userId: user?.$id! });
  const {
    data: generationAnalyticsData,
    isLoading: isLoadingGenerationAnalyticsData,
  } = useGetGenerationAnalytics();
  const {
    data: performanceMetricsData,
    isLoading: isLoadingPerformanceMetricsData,
  } = useGetPerformanceMetrics();

  const isLoading =
    isLoadingUser ||
    isLoadingPlans ||
    isLoadingSubscriptionData ||
    isLoadingGenerationAnalyticsData ||
    isLoadingPerformanceMetricsData;

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin size-6" />
      </div>
    );
  }

  const planCost = plans?.data.documents.find(
    (plan) => plan.name === user?.profile.plan
  )?.price;

  const planCurrency: "egp" | "usd" | "eur" = plans?.data.documents.find(
    (plan) => plan.name === user?.profile.plan
  )?.currency;

  const planRequestsLimit = plans?.data.documents.find(
    (plan) => plan.name === user?.profile.plan
  )?.ai_request_limit;

  const planGenerateComponentsLimit = plans?.data.documents.find(
    (plan) => plan.name === user?.profile.plan
  )?.generate_components_limit;

  console.log({planRequestsLimit})
  console.log({planGenerateComponentsLimit})

  return (
    <ContainerWrapper className="flex items-start flex-col gap-14 sm:max-w-[95%] lg:max-w-[85%]">
      <div className="w-full rounded-xl bg-neutral-900 p-10 flex flex-col items-start gap-14">
        <div className="flex items-center justify-between w-full flex-wrap gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Subscription</h1>
          <span onClick={open} className="cursor-pointer">
            <MdOutlineMessage className="size-4 mr-2 inline" />
            Contact Us
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 w-full flex-wrap">
          <div className="flex items-center gap-4 border border-neutral-700 bg-neutral-800 rounded-full w-full md:max-w-[250px] p-3">
            <div className="flex items-center justify-center bg-neutral-600 size-10 rounded-full">
              <TfiBag className="size-5 text-white" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-neutral-400">Plan</span>
              <h1 className="text-white capitalize">
                {user?.profile.plan} Plan
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-full w-full md:max-w-[250px] p-3">
            <div className="flex items-center justify-center bg-neutral-600 size-10 rounded-full">
              <LuWallet className="size-5 text-white" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-neutral-400">Plan Cost</span>
              <h1 className="text-white capitalize">
                {planCost} {currencySymbolMap[planCurrency]}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-full w-full md:max-w-[250px] p-3">
            <div className="flex items-center justify-center bg-neutral-600 size-10 rounded-full">
              <FiBox className="size-5 text-white" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-neutral-400">AI Requests Limit</span>
              <h1 className="text-white capitalize">
                {planRequestsLimit === -1 ? "Unlimited" : planRequestsLimit}{" "}
                Requests
              </h1>
            </div>
          </div>
          {/**@ts-ignore */}
          {subscriptionData?.data.plan === "free" && (
            <div className="flex items-center gap-4 rounded-full w-full md:max-w-[250px] p-3">
              <div className="flex items-center justify-center bg-neutral-600 size-10 rounded-full">
                <RiAiGenerate2 className="size-5 text-white" />
              </div>

              <div className="flex flex-col items-start gap-1">
                <span className="text-neutral-400">Generate Limit</span>
                <h1 className="text-white capitalize">
                  {planGenerateComponentsLimit === -1
                    ? "Unlimited"
                    : planGenerateComponentsLimit}{" "}
                  Components
                </h1>
              </div>
            </div>
          )}
          {/**@ts-ignore */}
          {subscriptionData?.data.plan !== "free" && (
            <div className="flex items-center gap-4 rounded-full w-full md:max-w-[250px] p-3">
              <div className="flex items-center justify-center bg-neutral-600 size-10 rounded-full">
                <IoMdAlarm className="size-5 text-white" />
              </div>
              {/**@ts-ignore */}
              <RenewalDate createdAt={subscriptionData?.data.$createdAt} />
            </div>
          )}
        </div>
      </div>
      <div className="my-5 w-full space-y-6">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-lg">AI Requests: </h1>
          <h1 className=" text-neutral-300">
            {performanceMetricsData?.totalRequests} /{" "}
            <span>
              {planRequestsLimit === -1 ? "Unlimited" : planRequestsLimit}
            </span>
          </h1>
        </div>
        <Progress
          className="w-full"
          max={planRequestsLimit === -1 ? 1 : planRequestsLimit}
          value={performanceMetricsData?.totalRequests}
        />
      </div>
      <div className="my-5 w-full space-y-6">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-lg">AI Generated Components: </h1>
          <h1 className=" text-neutral-300">
            {generationAnalyticsData?.totalComponents} /{" "}
            <span>
              {planGenerateComponentsLimit === -1
                ? "Unlimited"
                : planGenerateComponentsLimit}
            </span>
          </h1>
        </div>
        <Progress
          className="w-full"
          max={planGenerateComponentsLimit === -1
            ? 1
            : planGenerateComponentsLimit}
          value={generationAnalyticsData?.totalComponents}
        />
      </div>
      <div className="w-full flex items-center justify-evenly gap-5 flex-wrap">
        {plans?.data.documents.map((plan) => (
          <PricingCard
            key={plan.$id}
            currency={plan.currency}
            description={plan.description}
            name={plan.name}
            options={plan.options}
            price={plan.price}
            className="bg-gradient-to-t from-neutral-900 to-neutral-700"
            textHeadlineColor="text-neutral-100"
            textDescriptionColor="text-neutral-400"
            currentPlan={user?.profile.plan === plan.name}
          />
        ))}
      </div>
    </ContainerWrapper>
  );
};

const RenewalDate = ({ createdAt }: { createdAt: string }) => {
  const formattedDate = useMemo(() => {
    if (!createdAt) return "N/A";

    const date = new Date(createdAt);
    date.setMonth(date.getMonth() + 1);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [createdAt]);

  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-neutral-400">Renewal Date</span>
      <h1 className="text-white capitalize">{formattedDate}</h1>
    </div>
  );
};

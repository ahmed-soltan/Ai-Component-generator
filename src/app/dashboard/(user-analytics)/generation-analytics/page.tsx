export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { GenerationAnalyticsContainer } from "@/features/generation-analytics/components/generation-analytics-container";

const GenerationAnalyticsPage = async () => {
  const user = await getCurrent();

  Promise.resolve(() => setTimeout(() => {}, 1000));

  if (!user) {
    redirect("/auth/sign-in");
  }

  return <GenerationAnalyticsContainer />;
};

export default GenerationAnalyticsPage;

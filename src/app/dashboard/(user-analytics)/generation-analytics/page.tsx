import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { GenerationAnalyticsContainer } from "@/features/generation-analytics/components/generation-analytics-container";

const GenerationAnalyticsPage = async () => {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  return <GenerationAnalyticsContainer />;
};

export default GenerationAnalyticsPage;

import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { SubscriptionContainer } from "@/features/subscription/components/subscription-container";

const SubscriptionPage = async () => {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  return <SubscriptionContainer />;
};

export default SubscriptionPage;

import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { SupportCenterContainer } from "@/features/support-center/components/support-center-container";

const SupportCenterPage = async () => {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }
  return <SupportCenterContainer/>;
};

export default SupportCenterPage;

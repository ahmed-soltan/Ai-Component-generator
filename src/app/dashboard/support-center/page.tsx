import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

const SupportCenterContainer = dynamic(
  () => import("@/features/support-center/components/support-center-container").then(mod => mod.SupportCenterContainer),
  { ssr: false }
);
const SupportCenterPage = async () => {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }
  return <SupportCenterContainer/>;
};

export default SupportCenterPage;

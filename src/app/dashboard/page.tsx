import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

const DashboardPage = async () => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  redirect(`/dashboard/analytics`)
};

export default DashboardPage;

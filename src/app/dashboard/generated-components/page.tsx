import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { ComponentsContainer } from "@/features/component/components/components-container";

const GeneratedComponentsPage = async () => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  return <ComponentsContainer />;
};

export default GeneratedComponentsPage;

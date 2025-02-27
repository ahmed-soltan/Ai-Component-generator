export const dynamic = "force-dynamic"; 

import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { GeneratedComponentContainer } from "@/features/component/components/generated-component-container";

const ComponentIdPage = async () => {
  const user = await getCurrent();
  if (!user) {
    redirect("/auth/sign-in");
  }
  
  return <GeneratedComponentContainer />;
};

export default ComponentIdPage;

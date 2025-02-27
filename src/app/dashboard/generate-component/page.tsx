export const dynamic = "force-dynamic"; 

import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { GenerateComponentClient } from "./generate-component-client";

const GenerateComponentPage = async () => {
  const user = await getCurrent();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return <GenerateComponentClient />;
};

export default GenerateComponentPage;

import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { GenerateComponentClient } from "./generate-component-client";
import { Suspense } from "react";

const GenerateComponentPage = async () => {
  const user = await getCurrent();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <Suspense fallback={<div>loading...</div>}>
      <GenerateComponentClient />
    </Suspense>
  );
};

export default GenerateComponentPage;

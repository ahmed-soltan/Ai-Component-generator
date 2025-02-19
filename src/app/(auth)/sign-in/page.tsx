import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { SignInForm } from "@/features/auth/components/sign-in-form";

const SignInPage = async () => {
  const user = await getCurrent();

  if (user) {
    redirect("/");
  }

  return <SignInForm />;
};

export default SignInPage;

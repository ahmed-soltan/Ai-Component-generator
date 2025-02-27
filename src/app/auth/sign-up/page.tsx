export const dynamic = "force-dynamic"; 

import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

const SignUpPage = async () => {
  const user = await getCurrent();

  if (user) {
    redirect("/");
  }
  return <SignUpForm/>
};

export default SignUpPage;

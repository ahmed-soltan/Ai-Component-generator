import Link from "next/link";

import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { ContainerWrapper } from "@/components/container-wrapper";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccountSettings } from "@/features/settings/components/account-settings";
import { PreferencesSettings } from "@/features/settings/components/preferences-settings";

import { getCurrent } from "@/features/auth/queries";

const SettingsPage = async () => {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }
  return (
    <ContainerWrapper className="flex flex-col items-start gap-10">
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-bold">General Settings</h1>
        <p className="text-md text-neutral-400">
          Settings and Options for your application
        </p>
      </div>
      <Card className="w-full">
        <CardHeader className="bg-neutral-900 px-5 py-7 rounded-xl">
          <CardTitle>Your Application is Currently on the free plan</CardTitle>
          <CardDescription>
            Upgrade to a paid plan to access more features and support. Learn
            more{" "}
            <Link href={"/plans"} className="underline">
              here
            </Link>
            .
          </CardDescription>
        </CardHeader>
      </Card>
      <Separator />
      <AccountSettings />
      <Separator />
      <PreferencesSettings />
    </ContainerWrapper>
  );
};

export default SettingsPage;

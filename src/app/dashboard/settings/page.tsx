import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { ContainerWrapper } from "@/components/container-wrapper";
import { FreePlanBanner } from "@/features/settings/components/free-plan-banner";
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
      <FreePlanBanner/>
      <Separator />
      <AccountSettings />
      <Separator />
      <PreferencesSettings />
    </ContainerWrapper>
  );
};

export default SettingsPage;

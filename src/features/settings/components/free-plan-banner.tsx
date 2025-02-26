"use client";

import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useCurrent } from "@/features/auth/api/use-current";

export const FreePlanBanner = () => {
  const { data: user, isLoading } = useCurrent();
  if (isLoading) {
    return null;
  }

  if (user?.profile.plan === "free") {
    return (
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
    );
  }

  return null;
};

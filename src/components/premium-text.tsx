import Link from "next/link";
import React from "react";
import { IoDiamondOutline } from "react-icons/io5";

export const PremiumText = () => {
  return (
    <div className="flex items-center gap-1">
      <IoDiamondOutline className="size-3"/>
      <p className="text-neutral-400 text-sm">
        <Link href={"/dashboard/subscription"} className="underline">Upgrade </Link>
        to Premium to Unlock
      </p>
    </div>
  );
};

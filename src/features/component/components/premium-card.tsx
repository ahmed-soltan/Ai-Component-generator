import { IoDiamondOutline } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PremiumCardProps {
  className?: string;
}

export const PremiumCard = ({ className = "" }: PremiumCardProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col absolute top-0 left-0
     bg-white/10 backdrop-blur-md rounded-lg text-white z-50">
      <Button variant={"primary"} className={className} asChild size={"lg"}>
        <Link href={"/"}>
          <IoDiamondOutline className="size-20 text-white" />
          Upgrade to Premium
        </Link>
      </Button>
    </div>
  );
};

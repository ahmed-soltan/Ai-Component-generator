import Link from "next/link";
import { Stars } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCurrent } from "@/features/auth/api/use-current";

export const PromoBanner = () => {
  const { data: user } = useCurrent();
  return (
    <div className="relative flex items-center justify-center flex-col gap-5 my-12 bg-gradient text-center w-full md:max-w-[1000px] rounded-2xl px-5 py-10 h-auto">
      <div className="gr-bg rounded-md size-12 flex items-center justify-center text-center">
        <Stars className="size-7 text-white" />
      </div>
      <h1 className="text-4xl text-gray-800 font-semibold">
        Discover The Power of <br /> AI ui Components Generator
      </h1>
      <p className="text-xl text-gray-500 font-medium">
        Make Your Design Phenomenal using AI Power
      </p>
      <Button
        variant="primary"
        size={"lg"}
        className="w-full max-w-[200px] text-lg"
      >
        <Link href={!user ? "/sign-up" : "/dashboard"}>Get Started</Link>
      </Button>
    </div>
  );
};

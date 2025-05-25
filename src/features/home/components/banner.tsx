"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, StarsIcon } from "lucide-react";

import bannerImage from "../../../../public/Screenshot (476).png";

import { Button } from "@/components/ui/button";

import { useCurrent } from "@/features/auth/api/use-current";

export const Banner = () => {
  const { data: user } = useCurrent();

  return (
    <div className="w-full h-full">
      <div className="bg-gradient h-full min-h-[500px] rounded-xl flex flex-col items-center justify-center gap-8 px-4 pt-32">
        <div className="bg-image" />
        <h1 className="text-4xl md:text-6xl font-semibold max-w-[900px] text-center text-gray-800 z-10 md:leading-[70px] capitalize">
          Generate Your UI Component With Our Sultan AI{" "}
          <StarsIcon className="size-8 md:size-14 mb-3 inline" />
        </h1>
        <p className="text-md md:text-xl font-semibold max-w-[900px] text-center text-gray-700 z-10">
          Build and customize UI components effortlessly! Enter a prompt, tweak
          styles, and generate production-ready JSX with Tailwind in seconds.
          Instantly preview, edit, and export your components—all powered by
          AI.{" "}
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant={"primary"}
            size={"lg"}
            asChild
            className="text-lg py-6 group"
          >
            <Link href={!user ? "/auth/sign-up" : "/dashboard/generate-component"}>
              Get Started {user?.profile.plan === "free" && "For Free"}{" "}
              <ArrowRight className="ml-1 size-8 group-hover:translate-x-1 duration-150 transition-transform" />
            </Link>
          </Button>
          {!user && (
            <Button
              variant={"secondary"}
              size={"lg"}
              asChild
              className="text-lg py-6"
            >
              <Link href={"/auth/sign-up"}>Sign Up </Link>
            </Button>
          )}
        </div>
        <div className="translate-y-32 bg-white rounded-md flex flex-col gap-4 p-4 w-full max-w-[1000px] border shadow z-20 h-[450px]">
          <Image
            src={bannerImage}
            alt="Code Generation"
            fill
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

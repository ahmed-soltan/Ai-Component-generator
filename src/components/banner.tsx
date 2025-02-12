"use client";

import Link from "next/link";
import { ArrowRight, StarsIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CodeEditor } from "@/components/code-editor";

export const Banner = () => {
  const code = `
  const InspireCard = () => {
    return (
        <div className="p-6 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl shadow-lg text-white text-center">
            <h1 className="text-4xl font-extrabold mb-3">Unleash Your Creativity</h1>
            <p className="text-lg opacity-90">
                Build stunning UI components effortlessly with AI-powered precision.
            </p>
            <button className="mt-5 px-6 py-3 bg-white text-purple-700 font-semibold rounded-lg shadow-md hover:bg-purple-100 transition">
                Generate Now 🚀
            </button>
        </div>
    );
};

export default InspireCard;

          `;
  return (
    <div className="w-full h-full">
      <div className="bg-gradient h-full min-h-[500px] rounded-xl flex flex-col items-center justify-center gap-8 px-4 pt-32">
        <div className="bg-image" />
        <h1 className="text-4xl md:text-6xl font-semibold max-w-[900px] text-center text-gray-800 z-10 md:leading-[70px] capitalize">
          Generate Your UI Component With Our Sultana AI{" "}
          <StarsIcon className="size-8 md:size-14 mb-3 inline" />
        </h1>
        <p className="text-md md:text-xl font-semibold max-w-[900px] text-center text-gray-700 z-10">
          Build and customize UI components effortlessly! Enter a prompt, tweak
          styles, and generate production-ready JSX with Tailwind in seconds.
          Instantly preview, edit, and export your components—all powered by AI.{" "}
        </p>
        <Button
          variant={"primary"}
          size={"lg"}
          asChild
          className="text-lg py-6 group"
        >
          <Link href={"/sign-up"}>
            Get Started For Free{" "}
            <ArrowRight className="ml-1 size-8 group-hover:translate-x-1 duration-150 transition-transform" />
          </Link>
        </Button>
        <div className="translate-y-32 bg-white rounded-md flex flex-col gap-4 p-4 w-full max-w-[650px] border shadow z-20">
          <h1 className="font-bold text-xl text-gray-900">
            Generating Your UI Component...{" "}
            <Badge variant={"primary"}>Preview</Badge>
          </h1>
          <Separator />
          <CodeEditor code={code} readOnly />
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { Loader2 } from "lucide-react";

import { Filters } from "./filters";
import { ComponentCard } from "./component-card";
import { Separator } from "@/components/ui/separator";
import { ContainerWrapper } from "@/components/container-wrapper";

import { useFilters } from "../hooks/use-filters";
import { useGetComponents } from "../api/use-get-components";

import { cssFrameworks, jsFrameworks, themes } from "../schema";

export const ComponentsContainer = () => {
  const [{ jsFramework, cssFramework, theme, search }, _] = useFilters();
  const { data, isLoading } = useGetComponents({
    jsFramework: (jsFramework as (typeof jsFrameworks)[number]) || undefined,
    cssFramework:
      (cssFramework as (typeof cssFrameworks)[number]) || undefined,
    theme: (theme as keyof typeof themes) || undefined,
    search: search || undefined,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="animate-spin size-6" />
      </div>
    );
  }

  return (
    <ContainerWrapper className="flex flex-col items-start gap-8 sm:max-w-[95%] lg:max-w-[75%]">
      <h1 className="text-4xl font-bold">Generated Components</h1>
      <Separator />
      <Filters />
      <div className="flex flex-col items-start gap-5 w-full">
        {data?.documents.map((component) => (
          //@ts-ignore
          <ComponentCard key={component.$id} component={component!} />
        ))}
      </div>
    </ContainerWrapper>
  );
};

import { ListChecks } from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFilters } from "../hooks/use-filters";
import { useDebounce } from "../hooks/use-debounce";

import { cssFrameworks, jsFrameworks, themeKeys } from "../schema";

export const Filters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [{ jsFramework, cssFramework, theme, search }, setFilters] =
    useFilters();
  const debouncedValue = useDebounce(searchTerm || "", 500);

  useEffect(() => {
    setFilters({ search: debouncedValue });
  }, [debouncedValue]);

  const onJsFrameworkChange = (value: string) => {
    if (value === "all") {
      setFilters({ jsFramework: null });
    } else {
      setFilters({ jsFramework: value });
    }
  };
  const onCssFrameworkChange = (value: string) => {
    if (value === "all") {
      setFilters({ cssFramework: null });
    } else {
      setFilters({ cssFramework: value as string });
    }
  };
  const onThemeChange = (value: string) => {
    if (value === "all") {
      setFilters({ theme: null });
    } else {
      setFilters({ theme: value as string });
    }
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
};

  return (
    <div className="flex items-center justify-between flex-wrap gap-5 w-full">
      <div className="flex items-center gap-5">
        <Select
          defaultValue={jsFramework || undefined}
          onValueChange={onJsFrameworkChange}
        >
          <SelectTrigger className="w-full lg:w-auto h-10">
            <div className="flex items-center pr-2">
              <ListChecks className="size-4 mr-2" />
              <SelectValue placeholder="All" className="capitalize" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {jsFrameworks.map((framework) => (
              <SelectItem
                value={framework}
                key={framework}
                className="capitalize"
              >
                {framework}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          defaultValue={cssFramework || undefined}
          onValueChange={onCssFrameworkChange}
        >
          <SelectTrigger className="w-full lg:w-auto h-10 capitalize">
            <div className="flex items-center pr-2">
              <ListChecks className="size-4 mr-2" />
              <SelectValue placeholder="All" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {cssFrameworks.map((framework) => (
              <SelectItem
                value={framework}
                key={framework}
                className="capitalize"
              >
                {framework}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue={theme || undefined} onValueChange={onThemeChange}>
          <SelectTrigger className="w-full lg:w-auto h-10 capitalize">
            <div className="flex items-center pr-2">
              <ListChecks className="size-4 mr-2" />
              <SelectValue placeholder="All Themes" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Themes</SelectItem>
            {themeKeys.map((theme) => (
              <SelectItem value={theme} key={theme} className="capitalize">
                {theme}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:max-w-[300px]">
        <Input
          className="w-full px-4 h-10"
          placeholder="Search For a Component"
          onChange={onSearchChange}
          value={searchTerm || ""}
        />
      </div>
    </div>
  );
};

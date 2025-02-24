"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCurrent } from "@/features/auth/api/use-current";

import {
  cssFrameworks,
  jsFrameworks,
  layouts,
  radius,
  shadow,
  themes,
} from "@/features/component/schema";
import { Button } from "@/components/ui/button";

import { useUpdatePreferences } from "../api/use-update-preferences";

import { cn } from "@/lib/utils";

export const PreferencesSettings = () => {
  const { data: user, isLoading } = useCurrent();
  const [borderRadius, setBorderRadius] = useState("none");
  const [boxShadow, setBoxShadow] = useState("none");
  const { mutate, isPending } = useUpdatePreferences();

  const form = useForm({
    defaultValues: {
      default_jsFramework: user?.preferences.default_jsFramework,
      default_cssFramework: user?.preferences.default_cssFramework,
      default_theme: user?.preferences.default_theme,
      default_radius: user?.preferences.default_radius,
      default_shadow: user?.preferences.default_shadow,
      default_layout: user?.preferences.default_layout,
    },
  });

  useEffect(() => {
    if (user?.preferences) {
      form.reset({
        default_jsFramework: user.preferences.default_jsFramework,
        default_cssFramework: user.preferences.default_cssFramework,
        default_theme: user.preferences.default_theme,
        default_radius: user.preferences.default_radius,
        default_shadow: user.preferences.default_shadow,
        default_layout: user.preferences.default_layout,
      });
      setBorderRadius(user.preferences.default_radius);
      setBoxShadow(user.preferences.default_shadow);
    }
  }, [user, form]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin size-6" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-red-500">Failed to load user data</p>;
  }

  const onSubmit = (values: any) => {
    mutate({ json: values });
  };

  const handleSelect = (
    key: "radius" | "shadow",
    value: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  ) => {
    if (key === "radius") {
      setBorderRadius(value);
      form.setValue("default_radius", value);
    } else {
      setBoxShadow(value);
      form.setValue("default_shadow", value);
    }
  };

  return (
    <Card className="w-full xl:max-w-[70%] p-5">
      <CardHeader>
        <CardTitle className="text-2xl">Preferences Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="default_jsFramework"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-2">
                  <FormLabel className="dark:text-gray-300 font-normal">
                    default js framework
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={user.preferences.default_jsFramework}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="w-full lg:max-w-[60%] capitalize"
                        disabled={isPending}
                      >
                        <SelectValue placeholder="Select a JS Framework" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jsFrameworks.map((framework) => (
                        <SelectItem
                          key={framework}
                          value={framework}
                          className="capitalize"
                        >
                          {framework}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="default_cssFramework"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-2">
                  <FormLabel className="dark:text-gray-300 font-normal">
                    default css framework
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={user.preferences.default_cssFramework}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="w-full lg:max-w-[60%] capitalize"
                        disabled={isPending}
                      >
                        <SelectValue placeholder="Select a CSS Framework" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cssFrameworks.map((framework) => (
                        <SelectItem
                          key={framework}
                          value={framework}
                          className="capitalize"
                        >
                          {framework}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="default_layout"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-2">
                  <FormLabel className="dark:text-gray-300 font-normal">
                    default layout
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={user.preferences.default_layout}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="w-full lg:max-w-[60%] capitalize"
                        disabled={isPending}
                      >
                        <SelectValue placeholder="select a layout" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {layouts.map((key) => (
                        <SelectItem
                          key={key}
                          value={key}
                          className="capitalize"
                        >
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="default_theme"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-2">
                  <FormLabel className="dark:text-gray-300 font-normal">
                    default theme
                  </FormLabel>
                  <div className="flex flex-col items-end gap-4 w-full lg:max-w-[60%]">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={user.preferences.default_theme}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full capitalize">
                          <SelectValue placeholder="select a theme" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {Object.keys(themes).map((key) => (
                          <SelectItem
                            key={key}
                            value={key}
                            className="capitalize"
                          >
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/**@ts-ignore */}
                    {field.value && themes[field.value] && (
                      <div className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-2 mt-3">
                        {/**@ts-ignore */}
                        {Object.entries(themes[field.value]).map(
                          ([key, color]) => (
                            <div
                              key={key}
                              className="flex flex-col items-center gap-2"
                            >
                              <div
                                style={{ backgroundColor: color as string }}
                                className="h-16 w-24 rounded-md"
                              />
                              <p className="dark:text-gray-200">{key}</p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex items-center justify-between flex-wrap lg:flex-nowrap gap-2">
              <h1 className="dark:text-gray-300 font-normal">radius</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {radius.map((r) => (
                  <Button
                    key={r}
                    variant={r === borderRadius ? "secondary" : "outline"}
                    type="button"
                    onClick={() => handleSelect("radius", r)}
                    className={cn(`w-14 text-white`, {
                      [`rounded-${r}`]: true,
                    })}
                    disabled={isPending}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>

            <div className="w-full flex items-center justify-between flex-wrap lg:flex-nowrap gap-2">
              <h1 className="dark:text-gray-300 font-normal">shadow</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {shadow.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={s === boxShadow ? "secondary" : "outline"}
                    onClick={() => handleSelect("shadow", s)}
                    className={cn(`w-14 text-white`, { [`shadow-${s}`]: true })}
                    disabled={isPending}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
            <div className="w-full ml-auto flex justify-end">
              <Button
                variant={"default"}
                size={"lg"}
                className="ml-auto mt-5 font-semibold"
                disabled={isPending}
              >
                update
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

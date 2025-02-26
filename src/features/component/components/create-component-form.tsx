"use client";

import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FaMagic, FaPlus } from "react-icons/fa";
import { GrCircleInformation } from "react-icons/gr";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createComponentSchema,
  cssFrameworks,
  jsFrameworks,
  layouts,
  radius,
  shadow,
  themes,
} from "../schema";

import { cn } from "@/lib/utils";

import { useGenerateUI } from "../api/use-generate-ui";
import { useCurrent } from "@/features/auth/api/use-current";
import { PremiumText } from "@/components/premium-text";

interface CreateComponentFormProps {
  initialValues: any;
}

export const CreateComponentForm = ({
  initialValues,
}: CreateComponentFormProps) => {
  const [borderRadius, setBorderRadius] = useState(initialValues.radius);
  const [boxShadow, setBoxShadow] = useState(initialValues.shadow);
  const { mutate, isPending } = useGenerateUI();
  const { data: user } = useCurrent();

  const form = useForm<z.infer<typeof createComponentSchema>>({
    resolver: zodResolver(createComponentSchema),
    defaultValues: {
      name: initialValues.name || "Untitled",
      theme: initialValues.theme,
      layout: initialValues.layout,
      jsFramework: initialValues.jsFramework,
      cssFramework: initialValues.cssFramework,
      radius: initialValues.radius,
      shadow: initialValues.shadow,
    },
  });

  const onSubmit = (values: z.infer<typeof createComponentSchema>) => {
    mutate({ json: values });
  };

  const handleSelect = (
    key: "radius" | "shadow",
    value: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  ) => {
    if (key == "radius") {
      setBorderRadius(value);
      form.setValue("radius", value);
    } else {
      setBoxShadow(value);
      form.setValue("shadow", value);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4 w-full h-full">
      <h1 className="text-2xl font-semibold">{form.getValues("name")}</h1>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-md h-full flex flex-col justify-between"
        >
          <div className="flex flex-col gap-5 ">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-300">
                    Component Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Component Name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="jsFramework"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-300">
                    Select Js Framework
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={initialValues.jsFramework}
                  >
                    <FormControl>
                      <div className="w-full space-y-3">
                        <SelectTrigger
                          className="w-full capitalize"
                          disabled={isPending || user?.profile.plan === "free"}
                        >
                          <SelectValue placeholder="Select a JS Framework" />
                        </SelectTrigger>
                        {user?.profile.plan === "free" && <PremiumText />}
                      </div>
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
              name="cssFramework"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-300">
                    Select CSS Framework
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={initialValues.cssFramework}
                  >
                    <FormControl>
                      <SelectTrigger
                        disabled={isPending}
                        className="capitalize"
                      >
                        <SelectValue placeholder="Select a css Framework" />
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
              name="layout"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-300">
                    Select Layout
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={initialValues.layout}
                  >
                    <FormControl>
                      <SelectTrigger
                        disabled={isPending}
                        className="capitalize"
                      >
                        <SelectValue placeholder="Select a Layout" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {layouts.map((layout) => (
                        <SelectItem
                          key={layout}
                          value={layout}
                          className="capitalize"
                        >
                          {layout}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={isPending}
                  value={"primary"}
                  className="dark:bg-transparent border dark:border-white/10 dark:text-white dark:hover:bg-white/10 my-4"
                >
                  <FaPlus className="w-4 mr-2" />
                  Add a Theme
                </Button>
              </DialogTrigger>
              <DialogContent className="flex flex-col gap-10">
                <FormField
                  name="theme"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">
                        Select Theme
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={initialValues.theme}
                      >
                        <FormControl>
                          <div className="w-full space-y-3">
                            <SelectTrigger
                              className="w-full capitalize"
                              disabled={
                                isPending || user?.profile.plan === "free"
                              }
                            >
                              <SelectValue placeholder="select a theme" />
                            </SelectTrigger>
                            {user?.profile.plan === "free" && (
                              <PremiumText />
                            )}{" "}
                          </div>
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
                      <div className="flex items-center justify-between gap-2 flex-wrap translate-y-3">
                        {Object.entries(themes[field.value]).map(
                          ([key, color]) => (
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div
                                key={key}
                                style={{ backgroundColor: color }}
                                className="h-16 w-24 rounded-md"
                              />
                              <p className="dark:text-gray-200">{key}</p>
                            </div>
                          )
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full">
                  <h1 className="mb-2 font-medium text-md">Radius</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    {radius.map((radius) => (
                      <Button
                        key={radius}
                        variant={
                          radius === borderRadius ? "secondary" : "outline"
                        }
                        type="button"
                        onClick={() => handleSelect("radius", radius)}
                        className={cn(`w-14 rounded-${radius} text-white`)}
                        disabled={isPending}
                      >
                        {radius}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="w-full">
                  <h1 className="mb-2 font-medium text-md">Shadow</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    {shadow.map((shadow) => (
                      <Button
                        key={shadow}
                        type="button"
                        variant={shadow === boxShadow ? "secondary" : "outline"}
                        onClick={() => handleSelect("shadow", shadow)}
                        className={cn(`w-14 shadow-${shadow} text-white`)}
                        disabled={isPending}
                      >
                        {shadow}
                      </Button>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col items-start gap-4 w-full">
            <p className="dark:text-white font-medium">
              <GrCircleInformation className="size-5 inline mr-1 mb-1" />
              Note:{" "}
              <span className="text-gray-400 font-normal text-sm">
                Please provide a detailed and clear prompt to help the AI
                understand the task you want it to perform. A well-written
                prompt can greatly enhance the accuracy and quality of the
                generated response.
              </span>
            </p>
            <FormField
              name="prompt"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full relative">
                  <FormLabel className="dark:text-gray-300">
                    AI Prompt
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      {...field}
                      placeholder="Enter Your Component Description"
                      className="w-full pb-12"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                  <Button
                    size="icon"
                    variant="primary"
                    type="submit"
                    className="absolute right-2 bottom-2 w-auto px-2"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin size-4" />
                    ) : (
                      <>
                        Generate
                        <FaMagic className="size-2" />
                      </>
                    )}
                  </Button>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

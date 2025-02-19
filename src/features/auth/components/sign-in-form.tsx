"use client";

import { z } from "zod";
import Link from "next/link";
import { Loader } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { loginSchema } from "../schemas";
import { useSignIn } from "../api/use-sign-in";

export const SignInForm = () => {
  const {mutate , isPending} = useSignIn();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate({json:values})
  };

  return (
    <div className="w-full max-w-[500px] bg-dots">
      <Card className="w-full h-full md:w-[487px] border-none shadow-none">
        <CardHeader className="flex items-center justify-center text-center p-7">
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        </CardHeader>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter Email Address"
                        {...field}
                        disabled={isPending}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        required
                        type="password"
                        {...field}
                        placeholder="Enter Password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isPending}
                size={"lg"}
                className="w-full flex items-center gap-2"
                variant={"primary"}
              >
                {isPending && <Loader className="w-5 h-5 animate-spin" />}
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <Separator />
        <CardContent className="p-7 flex flex-col gap-y-4">
          <Button
            variant={"secondary"}
            size={"lg"}
            className="w-full"
            disabled={isPending}
            // onClick={()=>signUpWithGoogle()}
          >
            <FcGoogle className="mr-2 size-5" />
            Login With Google
          </Button>
          <Button
            variant={"secondary"}
            size={"lg"}
            className="w-full"
            disabled={isPending}
            // onClick={()=>signUpWithGithub()}
          >
            <FaGithub className="mr-2 size-5" />
            Login With Github
          </Button>
        </CardContent>
        <Separator />
        <CardContent className="p-7 flex items-center justify-center">
          Don&apos;t Have an Account?{" "}
          <Link href={"/sign-up"}>
            <span className="text-blue-700">&nbsp;Sign Up</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

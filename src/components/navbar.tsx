"use client";

import Link from "next/link";

import { Logo } from "./logo";
import { Button } from "./ui/button";
import { useCurrent } from "@/features/auth/api/use-current";
import { useSignout } from "@/features/auth/api/use-sign-out";

export const Navbar = () => {
  const { data: user } = useCurrent();
  const { mutate } = useSignout();

  return (
    <div
      className="flex items-center justify-between w-full md:max-w-[80%] h-16
      bg-white rounded-2xl m-auto md:fixed z-30 top-10 md:left-1/2 
        transform md:-translate-x-1/2 md:px-5 border shadow-sm"
    >
      <div className="flex items-center gap-5 text-black">
        <Logo />
        <div className="hidden md:flex gap-5">
          |
          <Link href={"/"} className="font-semibold">
            Home
          </Link>
          <Link href={"/pricing"} className="font-semibold">
            Pricing
          </Link>
        </div>
      </div>
      <div>
        {user ? (
          <Button onClick={() => mutate()}>Logout</Button>
        ) : (
          <Button asChild>
            <Link href={"/sign-in"}>Sign In</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

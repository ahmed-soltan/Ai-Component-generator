"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

interface AuthProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthProps) => {
  const pathname = usePathname();

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between bg-white rounded-xl md:px-5 h-16">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <Button asChild>
            <Link
              href={
                pathname === "/auth/sign-in" ? "/auth/sign-up" : "/auth/sign-in"
              }
            >
              {pathname === "/auth/sign-in" ? "Sign Up" : "Login"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:mt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;

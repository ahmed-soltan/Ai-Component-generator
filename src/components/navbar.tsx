import Link from "next/link";

import { Logo } from "./logo";
import { Button } from "./ui/button";

export const Navbar = () => {
  return (
    <div
      className="flex items-center justify-between w-full md:max-w-[80%] h-16
      bg-white rounded-xl m-auto md:fixed z-30 top-10 md:left-1/2 
        transform md:-translate-x-1/2 md:px-5"
    >
      <div className="flex items-center gap-5">
        <Logo />
        <div className="hidden md:flex gap-5">
          |
          <Link href={"/"} className="font-semibold">
            Home
          </Link>
          <Link href={"/features"} className="font-semibold">
            Features
          </Link>
          <Link href={"/contact"} className="font-semibold">
            Contact Us
          </Link>
        </div>
      </div>
      <div>
        <Button>Sign In</Button>
      </div>
    </div>
  );
};

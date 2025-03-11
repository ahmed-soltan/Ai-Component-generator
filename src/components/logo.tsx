import { Stars } from "lucide-react";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <div className="gr-bg rounded-md size-10 flex items-center justify-center text-center">
        <Stars className="size-5 text-white" />
      </div>
      <span className="text-xl font-semibold">Sultan</span>
    </Link>
  );
};

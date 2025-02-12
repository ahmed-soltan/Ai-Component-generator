import { Stars } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="gr-bg rounded-md size-10 flex items-center justify-center text-center">
        <Stars className="size-5 text-white" />
      </div>
      <span className="text-xl font-semibold">Sultana</span>
    </div>
  );
};

import { cn } from "@/lib/utils";

interface ContainerWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ContainerWrapper = ({
  children,
  className,
}: ContainerWrapperProps) => {
  return (
    <div
      className={cn(
        "w-full md:max-w-[95%] m-auto px-2 md:px-6 py-8 h-full",
        className
      )}
    >
      {children}
    </div>
  );
};

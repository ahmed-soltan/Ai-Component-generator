import React, { PropsWithChildren } from "react";

export const ContainerWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full md:max-w-[95%] m-auto px-2 md:px-6 py-8 h-full">
      {children}
    </div>
  );
};

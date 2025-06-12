import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const Wrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn("px-8 md:px-12 xl:px-16", className)}>{children}</div>
  );
};

export default Wrapper;

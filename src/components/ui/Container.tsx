import React from "react";
import { clsx } from "clsx";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "narrow" | "default" | "wide" | "full";
}

export function Container({ children, className, size = "default" }: ContainerProps) {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[1440px]",
    full: "max-w-full"
  };

  return (
    <div className={clsx("mx-auto px-4 sm:px-6 lg:px-10 w-full", sizeClasses[size], className)}>
      {children}
    </div>
  );
}

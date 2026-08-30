import React from "react";
import { clsx } from "clsx";

interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "display" | "xl" | "lg" | "md" | "sm";
  goldGradient?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Heading({
  as: Component = "h2",
  size = "lg",
  goldGradient = false,
  children,
  className
}: HeadingProps) {
  const sizes = {
    display: "font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] font-light",
    xl: "font-editorial text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] font-normal",
    lg: "font-editorial text-2xl sm:text-4xl md:text-5xl tracking-normal leading-[1.15] font-normal",
    md: "font-editorial text-xl sm:text-2xl md:text-3xl tracking-wide leading-[1.2]",
    sm: "font-sans text-sm sm:text-base tracking-[0.2em] uppercase font-semibold text-[#C6A15B]"
  };

  return (
    <Component
      className={clsx(
        sizes[size],
        goldGradient && "gold-gradient-text",
        className
      )}
    >
      {children}
    </Component>
  );
}

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-sans tracking-[0.15em] uppercase text-xs font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-none focus:outline-none shadow-sm";

  const variants = {
    primary: "bg-[#050505] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#050505] hover:bg-[#B58A38] dark:hover:bg-[#C6A15B] hover:text-[#FFFFFF] dark:hover:text-[#050505]",
    secondary: "bg-[#FFFFFF] dark:bg-[#121212] text-[#050505] dark:text-[#FFFFFF] border border-[#E2DFD7] dark:border-[#262626] hover:border-[#B58A38] dark:hover:border-[#C6A15B] hover:text-[#B58A38] dark:hover:text-[#C6A15B]",
    gold: "bg-[#B58A38] dark:bg-[#C6A15B] text-[#FFFFFF] dark:text-[#050505] hover:bg-[#99722A] dark:hover:bg-[#B5904B] shadow-md",
    outline: "border border-[#050505] dark:border-[#FFFFFF] text-[#050505] dark:text-[#FFFFFF] hover:border-[#B58A38] dark:hover:border-[#C6A15B] hover:text-[#B58A38] dark:hover:text-[#C6A15B]",
    ghost: "text-[#646469] dark:text-[#8E8E93] hover:text-[#050505] dark:hover:text-[#FFFFFF] bg-transparent"
  };

  const sizes = {
    sm: "px-4 py-2.5 text-[10px]",
    md: "px-6 py-3.5 text-xs",
    lg: "px-9 py-4 text-xs tracking-[0.2em]"
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
}

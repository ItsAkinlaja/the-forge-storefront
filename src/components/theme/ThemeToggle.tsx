"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-[#050505] dark:text-white hover:text-[#C6A15B] dark:hover:text-[#C6A15B] transition-colors rounded-full focus:outline-none"
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
      aria-label="Toggle Theme Mode"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 stroke-[1.5]" />
      ) : (
        <Moon className="w-5 h-5 stroke-[1.5]" />
      )}
    </button>
  );
}

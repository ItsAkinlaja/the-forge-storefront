import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  id: string;
}

export function Input({ label, error, hint, id, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="uppercase tracking-[0.2em] text-[10px] text-[#888888] dark:text-[#555555] font-sans font-semibold"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          "w-full border border-[#E5E5E5] dark:border-[#262626]",
          "bg-white dark:bg-[#0A0A0A]",
          "px-4 py-3.5 text-sm text-[#050505] dark:text-white",
          "focus:outline-none focus:border-[#050505] dark:focus:border-white",
          "placeholder:text-[#BBBBBB] dark:placeholder:text-[#444444]",
          "rounded-none transition-colors font-sans",
          error ? "border-red-500 focus:border-red-500" : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && (
        <p className="text-[11px] text-red-500 mt-0.5 font-sans">{error}</p>
      )}
      {hint && !error && (
        <p className="text-[11px] text-[#888888] dark:text-[#555555] mt-0.5 font-sans">{hint}</p>
      )}
    </div>
  );
}

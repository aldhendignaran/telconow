import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "email" | "password";
  error?: string;
  suffix?: React.ReactNode;
}

export function Input({ type, error, suffix, className, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          "w-full rounded-lg border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0",
          "disabled:pointer-events-none disabled:opacity-50",
          error
            ? "border-danger focus:ring-danger"
            : "border-border hover:border-text-secondary",
          suffix && "pr-12",
          className
        )}
        {...props}
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {suffix}
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}

import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Input = forwardRef(
  ({ className, type = "text", error = false, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-[9px] border bg-white px-3 py-1.5 text-xs text-[#262626] transition-colors",
          "placeholder:text-[#a3a3a3] outline-hidden",
          "border-[#e6e9ee] hover:border-[#cbd5e1]",
          "focus:border-[#2D9FFE] focus:ring-2 focus:ring-[#2D9FFE]/15",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[#c2453a] focus:border-[#c2453a] focus:ring-[#c2453a]/15",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

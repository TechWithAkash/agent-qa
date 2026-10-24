"use client";

import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
  variant: {
    default:
      "bg-[#2D9FFE] text-white hover:bg-[#0b7ee6] shadow-xs active:translate-y-px",
    primary:
      "bg-[#2D9FFE] text-white hover:bg-[#0b7ee6] shadow-xs active:translate-y-px",
    dark:
      "bg-[#000000] text-white hover:bg-[#262626] shadow-xs active:translate-y-px",
    outline:
      "bg-white text-[#262626] border border-[#e6e9ee] hover:bg-[#f8fafc] hover:border-[#cbd5e1] active:bg-[#f1f5f9]",
    secondary:
      "bg-[#f0f0f0] text-[#262626] hover:bg-[#e6e9ee] border border-transparent",
    ghost:
      "bg-transparent text-[#525252] hover:text-[#000000] hover:bg-[#f8fafc]",
    link:
      "text-[#2D9FFE] underline-offset-4 hover:underline p-0 h-auto font-normal",
  },
  size: {
    default: "h-9 px-4 py-2 text-xs font-medium",
    sm: "h-7 px-3 text-[11px] font-medium",
    lg: "h-11 px-6 text-sm font-medium",
    icon: "h-8 w-8 p-0 flex items-center justify-center",
  },
};

export const Button = forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      type = "button",
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantClass =
      buttonVariants.variant[variant] || buttonVariants.variant.default;
    const sizeClass = buttonVariants.size[size] || buttonVariants.size.default;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[9px] transition-all cursor-pointer font-sans select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2D9FFE]/50 disabled:pointer-events-none disabled:opacity-50",
          variantClass,
          sizeClass,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

import { cn } from "../../lib/utils";

const badgeVariants = {
  default:
    "border-transparent bg-[#2D9FFE] text-white hover:bg-[#0b7ee6]",
  secondary:
    "border-transparent bg-[#f0f0f0] text-[#262626] hover:bg-[#e6e9ee]",
  outline:
    "border-[#e6e9ee] bg-white text-[#525252] hover:bg-[#fafafa]",
  subtle:
    "border-[#2D9FFE]/20 bg-[#2D9FFE]/8 text-[#0b7ee6]",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning:
    "border-amber-200 bg-amber-50 text-amber-800",
  fail:
    "border-[#c2453a]/20 bg-[#c2453a]/10 text-[#c2453a]",
  yc:
    "border-orange-200 bg-orange-50 text-orange-900",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}) {
  const variantClass = badgeVariants[variant] || badgeVariants.default;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors select-none",
        variantClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

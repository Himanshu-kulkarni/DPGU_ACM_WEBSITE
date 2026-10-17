import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "accent" | "success" | "warning" | "error";
  size?: "sm" | "md";
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "neutral",
  size = "md",
  showDot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    neutral: "bg-[#171E2D] text-[#A5AEC0] border-[#252D3D]",
    accent: "bg-[#648CFF]/15 text-[#648CFF] border-[#648CFF]/30",
    success: "bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30",
    warning: "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30",
    error: "bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30",
  };

  const dotStyles = {
    neutral: "bg-[#A5AEC0]",
    accent: "bg-[#648CFF]",
    success: "bg-[#10B981]",
    warning: "bg-[#F59E0B]",
    error: "bg-[#EF4444]",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border tracking-wide uppercase",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotStyles[variant])}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};

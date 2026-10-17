import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "accent" | "white" | "muted";
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  size = "md",
  variant = "accent",
  label = "Loading content...",
  ...props
}) => {
  const sizeStyles = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
    xl: "w-12 h-12 border-4",
  };

  const variantStyles = {
    accent: "border-[#252D3D] border-t-[#648CFF]",
    white: "border-white/20 border-t-white",
    muted: "border-[#252D3D] border-t-[#A5AEC0]",
  };

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <div
        className={cn(
          "rounded-full animate-spin shrink-0",
          sizeStyles[size],
          variantStyles[variant]
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

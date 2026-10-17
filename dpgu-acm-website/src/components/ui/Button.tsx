import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-[#648CFF] focus-visible:outline-offset-2";

    const variantStyles = {
      primary:
        "bg-[#648CFF] text-[#080B12] font-semibold hover:bg-[#5078EE] active:bg-[#4068DE] shadow-sm",
      secondary:
        "bg-[#101522] text-[#F5F7FB] border border-[#252D3D] hover:bg-[#171E2D] hover:border-[#3A4660] active:bg-[#1C2538]",
      text:
        "bg-transparent text-[#A5AEC0] hover:text-[#F5F7FB] hover:bg-[#101522] active:bg-[#171E2D]",
      destructive:
        "bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/30 hover:bg-[#EF4444]/25 hover:border-[#EF4444]/50 active:bg-[#EF4444]/35",
      outline:
        "bg-transparent text-[#648CFF] border border-[#648CFF]/40 hover:bg-[#648CFF]/10 hover:border-[#648CFF] active:bg-[#648CFF]/20",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
      md: "text-sm px-4 py-2 gap-2 h-10",
      lg: "text-base px-5 py-2.5 gap-2.5 h-12",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

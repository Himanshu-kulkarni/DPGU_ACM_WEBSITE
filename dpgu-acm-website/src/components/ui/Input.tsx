import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    // Generate fallback ID for accessible label-input association
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = Boolean(error);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#A5AEC0] uppercase tracking-wider"
          >
            {label}
            {required && <span className="text-[#648CFF] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[#A5AEC0]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "w-full h-10 px-3.5 py-2 text-sm text-[#F5F7FB] bg-[#080B12] rounded-lg border transition-colors duration-150 placeholder:text-[#A5AEC0]/50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2",
              leftIcon ? "pl-10" : "",
              rightIcon || hasError ? "pr-10" : "",
              hasError
                ? "border-[#EF4444] focus-visible:ring-[#EF4444]/40"
                : "border-[#252D3D] hover:border-[#3A4660] focus-visible:border-[#648CFF] focus-visible:ring-[#648CFF]/25",
              className
            )}
            {...props}
          />

          {hasError ? (
            <div className="absolute right-3 flex items-center pointer-events-none text-[#EF4444]">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
            </div>
          ) : (
            rightIcon && (
              <div className="absolute right-3 flex items-center pointer-events-none text-[#A5AEC0]">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {hasError ? (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-[#EF4444] mt-1"
          >
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-[#A5AEC0]/80 mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

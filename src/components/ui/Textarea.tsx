import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      disabled,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;
    const hasError = Boolean(error);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium text-[#A5AEC0] uppercase tracking-wider"
          >
            {label}
            {required && <span className="text-[#648CFF] ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={hasError ? "true" : undefined}
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            "w-full px-3.5 py-2.5 text-sm text-[#F5F7FB] bg-[#080B12] rounded-lg border transition-colors duration-150 placeholder:text-[#A5AEC0]/50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 resize-y",
            hasError
              ? "border-[#EF4444] focus-visible:ring-[#EF4444]/40"
              : "border-[#252D3D] hover:border-[#3A4660] focus-visible:border-[#648CFF] focus-visible:ring-[#648CFF]/25",
            className
          )}
          {...props}
        />

        {hasError ? (
          <p id={errorId} role="alert" className="text-xs text-[#EF4444] mt-1">
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

Textarea.displayName = "Textarea";

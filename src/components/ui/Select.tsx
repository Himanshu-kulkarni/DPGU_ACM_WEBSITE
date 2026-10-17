import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Option[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;
    const hasError = Boolean(error);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-[#A5AEC0] uppercase tracking-wider"
          >
            {label}
            {required && <span className="text-[#648CFF] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "w-full h-10 pl-3.5 pr-10 py-2 text-sm text-[#F5F7FB] bg-[#080B12] rounded-lg border appearance-none transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 cursor-pointer",
              hasError
                ? "border-[#EF4444] focus-visible:ring-[#EF4444]/40"
                : "border-[#252D3D] hover:border-[#3A4660] focus-visible:border-[#648CFF] focus-visible:ring-[#648CFF]/25",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-[#101522] text-[#A5AEC0]">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-[#101522] text-[#F5F7FB]"
              >
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 flex items-center pointer-events-none text-[#A5AEC0]">
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

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

Select.displayName = "Select";

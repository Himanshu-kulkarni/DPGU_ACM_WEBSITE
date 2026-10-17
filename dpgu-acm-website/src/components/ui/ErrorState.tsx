import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  className,
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this section. Please try again.",
  onRetry,
  retryText = "Try Again",
  ...props
}) => {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-[#EF4444]/30 bg-[#171E2D]/60 min-h-[220px]",
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#F87171] mb-4">
        <AlertTriangle className="w-6 h-6" aria-hidden="true" />
      </div>
      <h4 className="text-base font-semibold text-[#F5F7FB] mb-1">{title}</h4>
      <p className="text-sm text-[#A5AEC0] max-w-sm mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
        >
          {retryText}
        </Button>
      )}
    </div>
  );
};

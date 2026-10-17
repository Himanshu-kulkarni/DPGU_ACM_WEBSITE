import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onDismiss?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  className,
  variant = "info",
  title,
  message,
  onDismiss,
  ...props
}) => {
  const variantStyles = {
    info: {
      container: "bg-[#101522] border-[#252D3D] text-[#F5F7FB]",
      icon: <Info className="w-5 h-5 text-[#648CFF]" aria-hidden="true" />,
    },
    success: {
      container: "bg-[#101522] border-[#10B981]/40 text-[#F5F7FB]",
      icon: <CheckCircle2 className="w-5 h-5 text-[#10B981]" aria-hidden="true" />,
    },
    warning: {
      container: "bg-[#101522] border-[#F59E0B]/40 text-[#F5F7FB]",
      icon: <AlertTriangle className="w-5 h-5 text-[#F59E0B]" aria-hidden="true" />,
    },
    error: {
      container: "bg-[#101522] border-[#EF4444]/40 text-[#F5F7FB]",
      icon: <AlertCircle className="w-5 h-5 text-[#EF4444]" aria-hidden="true" />,
    },
  };

  const isAlert = variant === "error" || variant === "warning";

  return (
    <div
      role={isAlert ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-200",
        variantStyles[variant].container,
        className
      )}
      {...props}
    >
      <div className="shrink-0 mt-0.5">{variantStyles[variant].icon}</div>
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className="text-sm font-semibold text-[#F5F7FB] leading-5">
            {title}
          </h5>
        )}
        <p className="text-xs text-[#A5AEC0] leading-relaxed mt-0.5">
          {message}
        </p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 p-1 text-[#A5AEC0] hover:text-[#F5F7FB] rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#648CFF]"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

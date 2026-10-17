"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  size = "md",
}) => {
  const titleId = React.useId();
  const descId = React.useId();

  // Handle ESC key dismiss
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080B12]/80 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Surface */}
      <div
        className={cn(
          "relative w-full rounded-2xl bg-[#101522] border border-[#252D3D] shadow-2xl p-6 overflow-hidden z-10 transition-all duration-200 focus:outline-none",
          sizeStyles[size],
          className
        )}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#252D3D]/60 mb-4">
          <div>
            {title && (
              <h3
                id={titleId}
                className="text-lg font-semibold text-[#F5F7FB] leading-6"
              >
                {title}
              </h3>
            )}
            {description && (
              <p id={descId} className="text-xs text-[#A5AEC0] mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal dialog"
            className="p-1 rounded-lg text-[#A5AEC0] hover:text-[#F5F7FB] hover:bg-[#171E2D] transition-colors focus-visible:outline-2 focus-visible:outline-[#648CFF]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="text-sm text-[#F5F7FB]">{children}</div>
      </div>
    </div>
  );
};

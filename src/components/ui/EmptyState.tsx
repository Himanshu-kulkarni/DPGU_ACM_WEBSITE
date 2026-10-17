import * as React from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  icon,
  title,
  description,
  action,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-[#252D3D] bg-[#101522]/50 min-h-[220px]",
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#A5AEC0] mb-4">
        {icon || <Inbox className="w-6 h-6" aria-hidden="true" />}
      </div>
      <h4 className="text-base font-semibold text-[#F5F7FB] mb-1">{title}</h4>
      {description && (
        <p className="text-sm text-[#A5AEC0] max-w-sm mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};

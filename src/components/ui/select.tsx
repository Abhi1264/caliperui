import * as React from "react";

import { cn } from "../../lib/cn";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, style, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-8 w-full cursor-pointer appearance-none rounded-sm border border-white/8 bg-[#121215] bg-[length:12px] bg-[right_8px_center] bg-no-repeat px-2.5 pr-7 font-mono text-xs text-zinc-100 outline-none transition-colors hover:border-white/[0.14] focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23a1a1aa' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3 4.5 3 3 3-3'/%3E%3C/svg%3E\")",
        ...style,
      }}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = "Select";

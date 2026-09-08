import * as React from "react";

import { cn } from "../../lib/cn";

export interface DisclosureProps extends Omit<
  React.DetailsHTMLAttributes<HTMLDetailsElement>,
  "children"
> {
  summary: React.ReactNode;
  children: React.ReactNode;
}

export const Disclosure = React.forwardRef<HTMLDetailsElement, DisclosureProps>(
  ({ className, summary, children, ...props }, ref) => (
    <details
      ref={ref}
      className={cn("group rounded-sm border border-white/8 bg-[#121215]", className)}
      {...props}
    >
      <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 py-2 text-xs text-zinc-100 outline-none select-none hover:bg-[#18181b] focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121215] [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <span
          aria-hidden="true"
          className="font-mono text-[10px] text-zinc-400 transition-transform duration-150 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="border-t border-white/8 px-3 py-3 text-xs leading-5 text-zinc-400">
        {children}
      </div>
    </details>
  ),
);

Disclosure.displayName = "Disclosure";

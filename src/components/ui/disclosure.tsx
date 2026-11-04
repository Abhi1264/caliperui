import { forwardRef } from "react";
import type { DetailsHTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/cn";

export interface DisclosureProps extends Omit<
  DetailsHTMLAttributes<HTMLDetailsElement>,
  "children"
> {
  summary: ReactNode;
  children: ReactNode;
}

export const Disclosure = forwardRef<HTMLDetailsElement, DisclosureProps>(
  ({ className, summary, children, ...props }, ref) => (
    <details
      ref={ref}
      className={cn("group rounded-sm border border-line bg-surface", className)}
      {...props}
    >
      <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 py-2 text-xs text-ink select-none hover:bg-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <span
          aria-hidden="true"
          className="text-sm text-muted transition-transform duration-150 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="border-t border-line px-3 py-3 text-xs leading-5 text-muted">{children}</div>
    </details>
  ),
);

Disclosure.displayName = "Disclosure";

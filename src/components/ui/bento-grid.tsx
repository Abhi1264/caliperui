import * as React from "react";

import { cn } from "../../lib/cn";

export type BentoGridProps = React.HTMLAttributes<HTMLDivElement>;

export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-1 gap-px overflow-hidden rounded-md border border-white/8 bg-white/8 md:grid-cols-3",
        className,
      )}
      {...props}
    />
  ),
);

BentoGrid.displayName = "BentoGrid";

export interface BentoCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export const BentoCard = React.forwardRef<HTMLElement, BentoCardProps>(
  ({ title, description, className, children, ...props }, ref) => (
    <article
      ref={ref}
      className={cn("min-w-0 bg-[#121215] p-5 text-zinc-100", className)}
      {...props}
    >
      {title != null ? (
        <h3 className="text-sm font-medium leading-5 text-zinc-50">{title}</h3>
      ) : null}
      {description != null ? (
        <p className={cn("max-w-prose text-xs leading-5 text-zinc-400", title != null && "mt-1.5")}>
          {description}
        </p>
      ) : null}
      {children != null ? (
        <div className={cn("min-w-0", (title != null || description != null) && "mt-4")}>
          {children}
        </div>
      ) : null}
    </article>
  ),
);

BentoCard.displayName = "BentoCard";

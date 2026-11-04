import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "../../lib/cn";

export type KbdProps = ComponentPropsWithoutRef<"kbd">;

export const Kbd = forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => (
  <kbd
    ref={ref}
    className={cn(
      "inline-flex min-w-5 items-center justify-center rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[10px] leading-none text-ink",
      className,
    )}
    {...props}
  />
));

Kbd.displayName = "Kbd";

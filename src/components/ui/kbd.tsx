import * as React from "react";

import { cn } from "../../lib/cn";

export type KbdProps = React.ComponentPropsWithoutRef<"kbd">;

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => (
  <kbd
    ref={ref}
    className={cn(
      "inline-flex min-w-5 items-center justify-center rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] leading-none text-zinc-400",
      className,
    )}
    {...props}
  />
));

Kbd.displayName = "Kbd";
